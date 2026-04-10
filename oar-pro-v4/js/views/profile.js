// OAR Pro v4 — User Profile & Settings View
// Route: /profile

route('/profile', async () => {
  const app = document.getElementById('app');

  // Loading skeleton
  app.innerHTML = `
    <div style="max-width:640px">
      <div style="margin-bottom:24px">
        <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">Profile & Settings</h1>
        <p class="text-muted text-sm">Manage your account and track your progress.</p>
      </div>
      <div class="skeleton skeleton-card" style="height:180px;margin-bottom:16px"></div>
      <div class="skeleton skeleton-card" style="height:140px;margin-bottom:16px"></div>
      <div class="skeleton skeleton-card" style="height:140px"></div>
    </div>
  `;

  // Fetch data in parallel
  const [user, profile, quizHistory, lessonProgress, streaks] = await Promise.all([
    getUser(),
    getProfile(),
    Store.getQuizHistory(100).catch(() => []),
    Store.getAllLessonProgress().catch(() => []),
    Store.getStreaks(60).catch(() => [])
  ]);

  if (!user || !profile) {
    navigate('#/login');
    return;
  }

  // Compute stats
  const totalQuestions = quizHistory.reduce((sum, q) => sum + (q.total_questions || 0), 0);
  const totalCorrect = quizHistory.reduce((sum, q) => sum + (q.correct || 0), 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const lessonsCompleted = lessonProgress.filter(p => p.status === 'completed').length;

  // Current streak calculation
  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    if (streaks.find(s => s.study_date === dateStr)) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  // Format member since date
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  // Account type display
  const accountTypeLabels = { free: 'Free', paid: 'Pro', preview: 'Preview', admin: 'Admin' };
  const accountTypeColors = { free: 'badge-yellow', paid: 'badge-green', preview: 'badge-blue', admin: 'badge-red' };
  const accountType = profile.account_type || (profile.is_paid ? 'paid' : 'free');
  const accountLabel = accountTypeLabels[accountType] || accountType;
  const accountBadgeClass = accountTypeColors[accountType] || 'badge-blue';

  // Test date info
  const testDate = profile.test_date ? new Date(profile.test_date + 'T00:00:00') : null;
  const daysUntilTest = testDate
    ? Math.ceil((testDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const testDateFormatted = testDate
    ? testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  app.innerHTML = `
    <div style="max-width:640px">

      <!-- Page header -->
      <div style="margin-bottom:24px">
        <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">Profile & Settings</h1>
        <p class="text-muted text-sm">Manage your account and track your progress.</p>
      </div>

      <!-- Account Info Card -->
      <div class="card" style="padding:24px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
          <div style="width:52px;height:52px;border-radius:50%;background:var(--accent-glow);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;flex-shrink:0">
            ${(profile.display_name || profile.email || '?').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style="font-size:18px;font-weight:700">${profile.display_name || 'OAR Candidate'}</div>
            <div style="font-size:13px;color:var(--text-2)">${profile.email || user.email}</div>
            <div style="margin-top:6px">
              <span class="badge ${accountBadgeClass}">${accountLabel}</span>
            </div>
          </div>
        </div>
        <div class="divider" style="margin:0 0 16px 0"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
          <div>
            <div style="color:var(--text-3);margin-bottom:2px">Member Since</div>
            <div style="font-weight:600">${memberSince}</div>
          </div>
          <div>
            <div style="color:var(--text-3);margin-bottom:2px">Account Type</div>
            <div style="font-weight:600">${accountLabel}</div>
          </div>
        </div>
      </div>

      <!-- Edit Name Card -->
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:14px">Display Name</div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <input
            type="text"
            class="form-input"
            id="displayNameInput"
            value="${profile.display_name || ''}"
            placeholder="Your name"
            style="flex:1"
          >
          <button class="btn btn-primary btn-sm" onclick="saveDisplayName()" style="flex-shrink:0;white-space:nowrap">
            Save Name
          </button>
        </div>
        <div id="nameMsg" style="display:none;margin-top:8px;font-size:13px"></div>
      </div>

      <!-- Test Date Card -->
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:4px">Test Date</div>
        ${daysUntilTest !== null
          ? `<p class="text-muted text-sm" style="margin-bottom:12px">
              Scheduled: <strong>${testDateFormatted}</strong> &mdash;
              <span style="color:${daysUntilTest <= 14 ? 'var(--red)' : daysUntilTest <= 30 ? 'var(--yellow)' : 'var(--green)'}">
                ${daysUntilTest > 0 ? daysUntilTest + ' days away' : daysUntilTest === 0 ? 'Today!' : Math.abs(daysUntilTest) + ' days ago'}
              </span>
            </p>`
          : `<p class="text-muted text-sm" style="margin-bottom:12px">No test date set. Add one to track your countdown.</p>`
        }
        <div style="display:flex;gap:10px;align-items:flex-start">
          <input
            type="date"
            class="form-input"
            id="testDateInput"
            value="${testDate ? testDate.toISOString().split('T')[0] : ''}"
            style="flex:1"
          >
          <button class="btn btn-primary btn-sm" onclick="saveTestDate()" style="flex-shrink:0;white-space:nowrap">
            ${testDate ? 'Update Date' : 'Set Date'}
          </button>
        </div>
        <div id="dateMsg" style="display:none;margin-top:8px;font-size:13px"></div>
      </div>

      <!-- Study Stats Card -->
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:16px">Study Statistics</div>
        <div class="grid-3" style="gap:12px">
          <div style="text-align:center;padding:14px;background:var(--surface-2);border-radius:10px">
            <div style="font-size:26px;font-weight:800;color:var(--accent)">${totalQuestions.toLocaleString()}</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:4px;text-transform:uppercase;letter-spacing:.5px">Questions Answered</div>
          </div>
          <div style="text-align:center;padding:14px;background:var(--surface-2);border-radius:10px">
            <div style="font-size:26px;font-weight:800;color:var(--green)">${lessonsCompleted}</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:4px;text-transform:uppercase;letter-spacing:.5px">Lessons Completed</div>
          </div>
          <div style="text-align:center;padding:14px;background:var(--surface-2);border-radius:10px">
            <div style="font-size:26px;font-weight:800;color:${currentStreak >= 7 ? 'var(--yellow)' : currentStreak >= 3 ? 'var(--green)' : 'var(--text-2)'}">
              ${currentStreak}${currentStreak >= 3 ? ' &#128293;' : ''}
            </div>
            <div style="font-size:11px;color:var(--text-3);margin-top:4px;text-transform:uppercase;letter-spacing:.5px">Day Streak</div>
          </div>
        </div>
        ${totalQuestions > 0 ? `
          <div style="margin-top:16px;padding:14px;background:var(--surface-2);border-radius:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:13px;color:var(--text-2)">Overall Accuracy</span>
              <span style="font-weight:700;color:${overallAccuracy >= 75 ? 'var(--green)' : overallAccuracy >= 55 ? 'var(--yellow)' : 'var(--red)'}">${overallAccuracy}%</span>
            </div>
            <div class="sidebar-progress-bar">
              <div class="sidebar-progress-fill" style="width:${overallAccuracy}%;background:${overallAccuracy >= 75 ? 'var(--green)' : overallAccuracy >= 55 ? 'var(--yellow)' : 'var(--red)'}"></div>
            </div>
            <div style="font-size:11px;color:var(--text-3);margin-top:6px">${totalCorrect.toLocaleString()} correct out of ${totalQuestions.toLocaleString()} questions</div>
          </div>
        ` : ''}
      </div>

      <!-- Danger Zone Card -->
      <div class="card" style="padding:20px;margin-bottom:16px;border-color:rgba(239,68,68,.25)">
        <div style="font-weight:700;margin-bottom:4px;color:var(--red)">Danger Zone</div>
        <p class="text-muted text-sm" style="margin-bottom:14px">These actions are permanent and cannot be undone.</p>
        <button class="btn btn-danger btn-sm" onclick="showResetModal()">
          &#9888; Reset All Progress
        </button>
      </div>

      <!-- Sign Out -->
      <div style="text-align:center;padding-bottom:40px">
        <button class="btn btn-secondary" onclick="signOut()">
          &#128682; Sign Out
        </button>
      </div>

    </div>

    <!-- Reset Progress Modal (hidden by default) -->
    <div
      id="resetModal"
      style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:500;align-items:center;justify-content:center"
      onclick="closeResetModal(event)"
    >
      <div class="card" style="max-width:400px;width:90%;padding:28px;border-color:rgba(239,68,68,.3)" onclick="event.stopPropagation()">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:8px;color:var(--red)">Reset All Progress?</h2>
        <p style="color:var(--text-2);font-size:14px;margin-bottom:20px;line-height:1.6">
          This permanently deletes all quiz results, lesson progress, topic mastery, and study streaks.
          Your account and subscription remain active.
        </p>
        <div style="display:flex;gap:10px">
          <button class="btn btn-secondary" style="flex:1" onclick="closeResetModal()">Cancel</button>
          <button class="btn btn-danger" style="flex:1" id="confirmResetBtn" onclick="confirmResetProgress()">
            Yes, Reset Everything
          </button>
        </div>
        <div id="resetMsg" style="display:none;margin-top:12px;font-size:13px;text-align:center"></div>
      </div>
    </div>
  `;
});

// ── Action Handlers ───────────────────────────────────────────────────────────

async function saveDisplayName() {
  const input = document.getElementById('displayNameInput');
  const msg = document.getElementById('nameMsg');
  if (!input || !msg) return;

  const name = input.value.trim();
  if (!name) {
    showProfileMsg(msg, 'Name cannot be empty.', 'error');
    return;
  }

  try {
    await Store.updateProfile({ display_name: name });
    showProfileMsg(msg, 'Name updated.', 'success');
    await renderNav();
  } catch (e) {
    showProfileMsg(msg, 'Failed to save name. Try again.', 'error');
  }
}

async function saveTestDate() {
  const input = document.getElementById('testDateInput');
  const msg = document.getElementById('dateMsg');
  if (!input || !msg) return;

  const dateVal = input.value;
  if (!dateVal) {
    showProfileMsg(msg, 'Select a date first.', 'error');
    return;
  }

  try {
    await Store.updateProfile({ test_date: dateVal });
    const d = new Date(dateVal + 'T00:00:00');
    const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    showProfileMsg(msg, `Test date saved${days > 0 ? ' — ' + days + ' days away' : ''}.`, 'success');
  } catch (e) {
    showProfileMsg(msg, 'Failed to save test date. Try again.', 'error');
  }
}

function showResetModal() {
  const modal = document.getElementById('resetModal');
  if (modal) modal.style.display = 'flex';
}

function closeResetModal(event) {
  // If called from the overlay click, only close when clicking the backdrop directly
  if (event && event.currentTarget !== event.target) return;
  const modal = document.getElementById('resetModal');
  if (modal) modal.style.display = 'none';
}

async function confirmResetProgress() {
  const btn = document.getElementById('confirmResetBtn');
  const msg = document.getElementById('resetMsg');

  if (btn) { btn.disabled = true; btn.textContent = 'Resetting...'; }

  try {
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    await Promise.all([
      supabase.from('quiz_results').delete().eq('user_id', user.id),
      supabase.from('lesson_progress').delete().eq('user_id', user.id),
      supabase.from('topic_mastery').delete().eq('user_id', user.id),
      supabase.from('study_streaks').delete().eq('user_id', user.id),
      supabase.from('adaptive_tests').delete().eq('user_id', user.id)
    ]);

    Store.clearCache();

    if (msg) {
      msg.style.display = 'block';
      msg.style.color = 'var(--green)';
      msg.textContent = 'Progress reset. Redirecting to dashboard...';
    }

    setTimeout(() => navigate('#/dashboard'), 1800);
  } catch (e) {
    if (msg) {
      msg.style.display = 'block';
      msg.style.color = 'var(--red)';
      msg.textContent = 'Reset failed. Please try again.';
    }
    if (btn) { btn.disabled = false; btn.textContent = 'Yes, Reset Everything'; }
  }
}

function showProfileMsg(el, text, type) {
  if (!el) return;
  el.style.display = 'block';
  el.style.color = type === 'success' ? 'var(--green)' : 'var(--red)';
  el.textContent = text;
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}
