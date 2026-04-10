// OAR Pro v4 — Study View (Lesson Viewer)
// Routes: #/study, #/study/:id
// — Benjamin Rodriguez

// ==========================================
// SIDEBAR RENDERER (shared with dashboard)
// ==========================================
async function renderStudySidebar(activeLessonId) {
  const sidebar = document.getElementById('sidebar');
  const lessons = await Store.getLessons();
  const progress = await Store.getAllLessonProgress();

  // Build a lookup of lesson progress by lesson_id
  const progressMap = {};
  for (const p of progress) {
    progressMap[p.lesson_id] = p.status || 'not_started';
  }

  // Group lessons by section
  const sections = {};
  for (const lesson of lessons) {
    const sec = lesson.section || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(lesson);
  }

  // Count completed
  const totalLessons = lessons.length;
  const completedLessons = progress.filter(p => p.status === 'completed').length;
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  let html = `
    <div class="sidebar-score">
      <div class="score-value">${completedLessons}/${totalLessons}</div>
      <div class="score-label">Lessons Completed</div>
    </div>
    <div class="sidebar-progress">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-3)">
        <span>Progress</span>
        <span>${pct}%</span>
      </div>
      <div class="sidebar-progress-bar">
        <div class="sidebar-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>
  `;

  const sectionIcons = {
    'Math': '📐',
    'Reading': '📖',
    'Mechanical': '⚙️'
  };

  for (const [sectionName, sectionLessons] of Object.entries(sections)) {
    const icon = sectionIcons[sectionName] || '📚';
    html += `
      <div class="sidebar-section">
        <div class="sidebar-section-title">${icon} ${sectionName}</div>
    `;

    for (const lesson of sectionLessons) {
      const status = progressMap[lesson.id] || 'not_started';
      const dotClass = status === 'completed' ? 'completed'
        : status === 'in_progress' ? 'in-progress'
        : 'not-started';
      const isActive = String(lesson.id) === String(activeLessonId);

      html += `
        <div class="sidebar-item ${isActive ? 'active' : ''}"
             onclick="navigate('#/study/${lesson.id}')">
          <span class="status-dot ${dotClass}"></span>
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${lesson.title}</span>
        </div>
      `;
    }

    html += `</div>`;
  }

  sidebar.innerHTML = html;
}


// ==========================================
// STUDY LANDING (no lesson selected)
// ==========================================
async function renderStudyLanding() {
  const app = document.getElementById('app');

  // Show skeleton while loading
  app.innerHTML = `
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
  `;

  await renderStudySidebar(null);

  const lessons = await Store.getLessons();
  const progress = await Store.getAllLessonProgress();
  const progressMap = {};
  for (const p of progress) {
    progressMap[p.lesson_id] = p.status;
  }

  // Find first incomplete lesson
  const nextLesson = lessons.find(l => progressMap[l.id] !== 'completed');

  app.innerHTML = `
    <div style="max-width:640px">
      <h1 style="font-size:28px;font-weight:800;margin-bottom:8px">Study Materials</h1>
      <p class="text-muted mb-8">Select a lesson from the sidebar to begin studying, or pick up where you left off.</p>

      ${nextLesson ? `
        <div class="card" style="border-color:var(--accent);cursor:pointer" onclick="navigate('#/study/${nextLesson.id}')">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <span class="badge badge-blue">Up Next</span>
            <span class="badge" style="background:var(--surface-2);color:var(--text-3)">${nextLesson.section}</span>
          </div>
          <div class="card-title" style="font-size:18px">${nextLesson.title}</div>
          <p class="card-subtitle">${nextLesson.description || 'Continue your study plan with this lesson.'}</p>
          <div style="margin-top:16px">
            <span class="btn btn-primary btn-sm">Start Lesson &rarr;</span>
          </div>
        </div>
      ` : `
        <div class="callout callout-tip">
          <div class="callout-title">All caught up!</div>
          <p>You've completed all available lessons. Head to <a href="#/practice">Practice</a> to test your knowledge.</p>
        </div>
      `}

      <div class="divider"></div>

      <h2 style="font-size:18px;font-weight:700;margin-bottom:12px">Quick Stats</h2>
      <div class="grid-3">
        <div class="card text-center">
          <div style="font-size:28px;font-weight:800;color:var(--green)">${progress.filter(p => p.status === 'completed').length}</div>
          <div class="text-muted text-sm">Completed</div>
        </div>
        <div class="card text-center">
          <div style="font-size:28px;font-weight:800;color:var(--yellow)">${progress.filter(p => p.status === 'in_progress').length}</div>
          <div class="text-muted text-sm">In Progress</div>
        </div>
        <div class="card text-center">
          <div style="font-size:28px;font-weight:800;color:var(--text-3)">${lessons.length - progress.length}</div>
          <div class="text-muted text-sm">Not Started</div>
        </div>
      </div>
    </div>
  `;
}


// ==========================================
// LESSON VIEWER
// ==========================================
async function renderLessonView(lessonId) {
  const app = document.getElementById('app');

  // Show skeleton
  app.innerHTML = `
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-text" style="width:40%"></div>
    <div style="margin-top:24px">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width:80%"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width:60%"></div>
    </div>
  `;

  // Fetch lesson and progress in parallel
  const [lesson, lessonProgress] = await Promise.all([
    Store.getLesson(lessonId),
    Store.getLessonProgress(lessonId)
  ]);

  // Update sidebar with active lesson highlighted
  await renderStudySidebar(lessonId);

  if (!lesson) {
    app.innerHTML = `
      <div class="callout callout-warning">
        <div class="callout-title">Lesson Not Found</div>
        <p>This lesson doesn't exist or you don't have access. <a href="#/study">Back to Study</a></p>
      </div>
    `;
    return;
  }

  // Mark as in-progress if not already started
  if (!lessonProgress || lessonProgress.status === 'not_started') {
    await Store.setLessonProgress(lessonId, 'in_progress');
  }

  // Track start time for time-spent calculation
  const startTime = Date.now();

  const status = lessonProgress?.status || 'in_progress';
  const statusBadge = status === 'completed'
    ? '<span class="badge badge-green">Completed</span>'
    : '<span class="badge badge-yellow">In Progress</span>';

  // Determine topic for practice link
  const topic = lesson.tags?.[0] || lesson.title;

  app.innerHTML = `
    <div style="max-width:740px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
        <a href="#/study" style="color:var(--text-3);font-size:13px">&larr; All Lessons</a>
        <span style="color:var(--text-3);font-size:13px">/</span>
        <span class="badge" style="background:var(--surface-2);color:var(--text-2)">${lesson.section}</span>
        ${statusBadge}
      </div>

      <h1 style="font-size:28px;font-weight:800;margin-bottom:4px;line-height:1.3">${lesson.title}</h1>
      ${lesson.description ? `<p class="text-muted mb-8">${lesson.description}</p>` : ''}

      <div class="divider"></div>

      <div class="lesson-content" id="lessonContent">
        ${lesson.content_html || '<p class="text-muted">No content available for this lesson yet.</p>'}
      </div>

      <div class="divider"></div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        ${status !== 'completed' ? `
          <button class="btn btn-success btn-lg" id="markCompleteBtn" onclick="handleMarkComplete('${lessonId}')">
            Mark as Complete
          </button>
        ` : `
          <button class="btn btn-success btn-lg" disabled style="opacity:.6;cursor:default">
            Completed
          </button>
        `}
        <button class="btn btn-secondary" onclick="navigate('#/practice?topic=${encodeURIComponent(topic)}&section=${encodeURIComponent(lesson.section)}')">
          Practice This Topic
        </button>
      </div>
    </div>
  `;

  // Re-render MathJax for the lesson content
  triggerMathJax();

  // Store start time on the button for time calculation
  window._lessonStartTime = startTime;
  window._currentLessonId = lessonId;
}


// ==========================================
// MARK COMPLETE HANDLER
// ==========================================
async function handleMarkComplete(lessonId) {
  const btn = document.getElementById('markCompleteBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Saving...';
  }

  // Calculate time spent
  const timeSpent = window._lessonStartTime
    ? Math.round((Date.now() - window._lessonStartTime) / 1000)
    : 0;

  await Store.setLessonProgress(lessonId, 'completed', timeSpent);

  // Log study activity
  const minutesStudied = Math.round(timeSpent / 60);
  await Store.logStudyActivity(minutesStudied, 0);

  // Update button
  if (btn) {
    btn.innerHTML = 'Completed';
    btn.style.opacity = '0.6';
    btn.style.cursor = 'default';
    btn.onclick = null;
  }

  // Refresh sidebar to show updated status and find next lesson
  await renderStudySidebar(lessonId);

  // Find and highlight next lesson
  const lessons = await Store.getLessons();
  const progress = await Store.getAllLessonProgress();
  const progressMap = {};
  for (const p of progress) {
    progressMap[p.lesson_id] = p.status;
  }

  const currentIndex = lessons.findIndex(l => String(l.id) === String(lessonId));
  const nextLesson = lessons.slice(currentIndex + 1).find(l => progressMap[l.id] !== 'completed');

  if (nextLesson) {
    // Add "next lesson" prompt at the bottom
    const app = document.getElementById('app');
    const existingNext = document.getElementById('nextLessonPrompt');
    if (existingNext) existingNext.remove();

    const prompt = document.createElement('div');
    prompt.id = 'nextLessonPrompt';
    prompt.className = 'callout callout-tip';
    prompt.style.marginTop = '16px';
    prompt.innerHTML = `
      <div class="callout-title">Up Next</div>
      <p style="margin-bottom:8px"><strong>${nextLesson.title}</strong> &mdash; ${nextLesson.section}</p>
      <button class="btn btn-primary btn-sm" onclick="navigate('#/study/${nextLesson.id}')">
        Continue &rarr;
      </button>
    `;
    app.appendChild(prompt);
  }
}


// ==========================================
// MATHJAX HELPER
// ==========================================
function triggerMathJax() {
  if (typeof MathJax !== 'undefined' && MathJax.Hub) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById('app')]);
    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 500);
  }
}


// ==========================================
// REGISTER ROUTES
// ==========================================
route('/study', async () => {
  await renderStudyLanding();
});

route('/study/:id', async (params) => {
  await renderLessonView(params.id);
});
