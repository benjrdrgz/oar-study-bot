#!/bin/zsh
# ============================================================
# Cowork Watchdog v2.0
# Monitors Claude Cowork sessions and fires audio alerts
# independently — no reliance on Claude remembering to call it.
#
# Usage:
#   ./cowork_watchdog.sh              → Start monitoring (foreground)
#   ./cowork_watchdog.sh --daemon     → Start monitoring (background)
#   ./cowork_watchdog.sh --stop       → Stop background watchdog
#   ./cowork_watchdog.sh --status     → Check if running
#   ./cowork_watchdog.sh --test       → Fire a test alert
#
# Created: 2026-03-25 | Fixed: 2026-03-25
# — Benjamin Rodriguez
# ============================================================

setopt NO_VERBOSE NO_XTRACE 2>/dev/null

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NOTIFIER="$SCRIPT_DIR/cowork_notifier.sh"
PID_FILE="/tmp/cowork_watchdog.pid"
LOG_FILE="/tmp/cowork_watchdog.log"
STATE_DIR="/tmp/cowork_watchdog_state"

# --- Configuration ---
POLL_INTERVAL=5
PROJECTS_DIR="/Users/breakbread/Documents/Claude/Projects"
COOLDOWN=120

# --- CLI Handling ---
case "${1:-}" in
    --stop)
        if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
            kill "$(cat "$PID_FILE")" 2>/dev/null
            rm -f "$PID_FILE"
            echo "Watchdog stopped."
        else
            rm -f "$PID_FILE" 2>/dev/null
            echo "No watchdog running."
        fi
        exit 0 ;;
    --status)
        if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
            echo "Watchdog running (PID: $(cat "$PID_FILE"))"
        else
            rm -f "$PID_FILE" 2>/dev/null
            echo "Watchdog not running."
        fi
        exit 0 ;;
    --test)
        echo "Firing test alert..."
        bash "$NOTIFIER" custom "Watchdog test. If you hear this, it works."
        exit 0 ;;
    --daemon)
        nohup /bin/zsh "$0" >> "$LOG_FILE" 2>&1 &
        echo $! > "$PID_FILE"
        echo "Watchdog started (PID: $!). Log: $LOG_FILE"
        exit 0 ;;
esac

# --- Helpers ---
log_msg() { print "[$(date '+%H:%M:%S')] $1" }

now_ts() { date +%s }

should_alert() {
    local key="$1"
    local stamp_file="$STATE_DIR/cooldown_$key"
    local now=$(now_ts)
    if [[ -f "$stamp_file" ]]; then
        local last=$(<"$stamp_file")
        (( now - last < COOLDOWN )) && return 1
    fi
    print "$now" > "$stamp_file"
    return 0
}

fire_alert() {
    local event="$1" key="$2" project="${3:-}"
    if should_alert "$key"; then
        log_msg "ALERT [$event] project=$project"
        bash "$NOTIFIER" "$event" "$project"
    fi
}

# --- Monitor: Session log changes ---
check_session_logs() {
    for proj_dir in "$PROJECTS_DIR"/*(N/); do
        local proj=$(basename "$proj_dir")
        local logs_dir="$proj_dir/Logs/Session-Logs"
        [[ -d "$logs_dir" ]] || continue

        local latest=$(ls -t "$logs_dir"/*.md(N) 2>/dev/null | head -1)
        [[ -n "$latest" ]] || continue

        local hash_file="$STATE_DIR/log_${proj}"
        local current_hash=$(md5 -q "$latest" 2>/dev/null)
        [[ -n "$current_hash" ]] || continue

        if [[ -f "$hash_file" ]]; then
            local old_hash=$(<"$hash_file")
            if [[ "$current_hash" != "$old_hash" ]]; then
                fire_alert "done" "log_$proj" "$proj"
            fi
        elif [[ -f "$STATE_DIR/.baseline_done" ]]; then
            fire_alert "done" "log_$proj" "$proj"
        fi
        print "$current_hash" > "$hash_file"
    done
}

# --- Monitor: New output files ---
check_output_files() {
    for proj_dir in "$PROJECTS_DIR"/*(N/); do
        local proj=$(basename "$proj_dir")
        local out_dir="$proj_dir/Outputs"
        [[ -d "$out_dir" ]] || continue

        local count_file="$STATE_DIR/out_${proj}"
        local current_count=$(find "$out_dir" -type f 2>/dev/null | wc -l | tr -d ' ')

        if [[ -f "$count_file" ]]; then
            local old_count=$(<"$count_file")
            if (( current_count > old_count )); then
                fire_alert "done" "out_$proj" "$proj"
            fi
        elif [[ -f "$STATE_DIR/.baseline_done" ]] && (( current_count > 0 )); then
            fire_alert "done" "out_$proj" "$proj"
        fi
        print "$current_count" > "$count_file"
    done
}

# --- Monitor: Cowork workspace folder changes ---
check_cowork_workspaces() {
    for ws in /sessions/*/mnt(N/); do
        local session=$(basename "$(dirname "$ws")")
        local hash_file="$STATE_DIR/ws_${session}"
        local current=$(find "$ws" -type f -newer "$STATE_DIR/.marker" 2>/dev/null | wc -l | tr -d ' ')

        if [[ -f "$hash_file" ]]; then
            local old=$(<"$hash_file")
            if (( current > old + 2 )); then
                fire_alert "done" "ws_$session" "Cowork session"
            fi
        fi
        print "$current" > "$hash_file"
    done 2>/dev/null
}

# --- Setup ---
mkdir -p "$STATE_DIR"
touch "$STATE_DIR/.marker"
print $$ > "$PID_FILE"

cleanup() {
    rm -f "$PID_FILE"
    log_msg "Watchdog stopped."
    exit 0
}
trap cleanup SIGINT SIGTERM

log_msg "Cowork Watchdog v2.0 started"
log_msg "Monitoring: $PROJECTS_DIR"
log_msg "Poll: ${POLL_INTERVAL}s | Cooldown: ${COOLDOWN}s"

# Baseline scan (captures current state, no alerts)
check_session_logs
check_output_files
check_cowork_workspaces
touch "$STATE_DIR/.baseline_done"
log_msg "Baseline captured. Watching for changes..."

# --- Main loop ---
while true; do
    sleep "$POLL_INTERVAL"
    check_session_logs
    check_output_files
    check_cowork_workspaces
    touch "$STATE_DIR/.marker"
done
