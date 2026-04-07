#!/bin/zsh
# ============================================================
# Cowork Notifier v4.0
# Changelog: v4.0 — Uses system voice (Siri Voice 4) instead of
#   hardcoded Samantha. Removed -v flag so say uses whatever
#   system voice is set in System Settings > Accessibility >
#   Read & Speak > System voice. Added osascript notification.
# Sound + voice alerts for Claude Cowork sessions
# — Benjamin Rodriguez
# ============================================================
# Usage:
#   ./cowork_notifier.sh done "Website Agency"
#   ./cowork_notifier.sh input "DFT"
#   ./cowork_notifier.sh error "OAR Study Bot"
#   ./cowork_notifier.sh custom "Any message you want"

EVENT="${1:-done}"
PROJECT="${2:-}"

# Voice rate (words per minute) — 165 is natural conversational pace
RATE="165"

# System sounds
SOUND_DONE="/System/Library/Sounds/Glass.aiff"
SOUND_INPUT="/System/Library/Sounds/Sosumi.aiff"
SOUND_ERROR="/System/Library/Sounds/Basso.aiff"
SOUND_START="/System/Library/Sounds/Blow.aiff"

# --- Build the message based on event + project ---
case "$EVENT" in
    done|complete|finished)
        SOUND="$SOUND_DONE"
        NOTIF_TITLE="Session Complete"
        if [[ -n "$PROJECT" ]]; then
            MSG="Hey Ben. $PROJECT is done. Go check it out."
            NOTIF_SUBTITLE="$PROJECT"
        else
            MSG="Hey Ben. Your Cowork session just finished."
            NOTIF_SUBTITLE="Cowork"
        fi ;;
    input|needed|waiting|ask)
        SOUND="$SOUND_INPUT"
        NOTIF_TITLE="Input Needed"
        if [[ -n "$PROJECT" ]]; then
            MSG="Hey Ben. $PROJECT needs your input. Head over to the Cowork window."
            NOTIF_SUBTITLE="$PROJECT"
        else
            MSG="Hey Ben. Claude is waiting for you. Check the Cowork window."
            NOTIF_SUBTITLE="Cowork"
        fi ;;
    error|fail|failed)
        SOUND="$SOUND_ERROR"
        NOTIF_TITLE="Error"
        if [[ -n "$PROJECT" ]]; then
            MSG="Heads up. $PROJECT hit an error."
            NOTIF_SUBTITLE="$PROJECT"
        else
            MSG="Heads up. Something went wrong in your Cowork session."
            NOTIF_SUBTITLE="Cowork"
        fi ;;
    start|begin)
        SOUND="$SOUND_START"
        NOTIF_TITLE="Session Started"
        NOTIF_SUBTITLE="Cowork"
        MSG="Cowork session started." ;;
    custom)
        SOUND="$SOUND_DONE"
        NOTIF_TITLE="Cowork"
        NOTIF_SUBTITLE=""
        MSG="$PROJECT" ;;
    *)
        echo "Usage: $0 {done|input|error|start|custom} [project or message]"
        exit 1 ;;
esac

# --- macOS notification banner ---
osascript -e "display notification \"$MSG\" with title \"$NOTIF_TITLE\" subtitle \"$NOTIF_SUBTITLE\"" 2>/dev/null &

# --- Play sound chime ---
[[ -f "$SOUND" ]] && afplay "$SOUND" 2>/dev/null

# --- Speak using system voice (set to Siri Voice 4 in System Settings) ---
# NOTE: No -v flag = uses system default voice. To change voice,
# go to System Settings > Accessibility > Read & Speak > System voice
say -r "$RATE" "$MSG" 2>/dev/null
