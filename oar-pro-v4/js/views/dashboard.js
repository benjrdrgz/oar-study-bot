// OAR Pro v4 — Dashboard View (Authenticated Users)
// Route: #/dashboard

// XSS-safe HTML escaping — use for ALL user-controlled strings in innerHTML
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

route('/dashboard', async () => {
  // Show sidebar, remove full-width
  document.getElementById('sidebar').style.display = '';
  document.getElementById('app').classList.remove('full-width');
  document.getElementById('mobileToggle').style.display = '';

  const app = document.getElementById('app');

  // ── Upgrade gate for free (unpaid) users ────────────────────────────────
  // Router sends unpaid users HERE from all content routes — show the upgrade wall.
  const paid = await isPaid();
  if (!paid) {
    document.getElementById('sidebar').style.display = 'none';
    app.classList.add('full-width');
    app.innerHTML = `
      <div style="max-width:520px;margin:80px auto;text-align:center;padding:0 20px">
        <div style="font-size:56px;margin-bottom:16px">⚓</div>
        <h1 style="font-size:28px;font-weight:800;margin-bottom:8px">Unlock OAR Pro</h1>
        <p class="text-muted" style="margin-bottom:28px;font-size:15px">
          You're in — but your account needs a license to access study content.
        </p>
        <div class="card" style="text-align:left;padding:24px;margin-bottom:20px">
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">What you get</div>
          ${[
            'All 20 structured lessons (Math, Reading, Mechanical)',
            '190+ practice questions with explanations',
            '5 full-length adaptive practice tests',
            'Score predictor &amp; topic mastery heatmap',
            'Personalized study plan',
            'Lifetime access — one payment, no subscriptions'
          ].map(f => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0">
              <span style="color:var(--green);font-size:16px;line-height:1.4">&#10003;</span>
              <span style="font-size:14px">${f}</span>
            </div>
          `).join('')}
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
            <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px"></div>
            <button class="btn btn-primary btn-lg btn-block" onclick="handleCheckoutClick(this)">
              Get Access &rarr;
            </button>
            <p style="font-size:12px;color:var(--text-3);text-align:center;margin-top:10px">
              &#128274; Secure payment via Stripe &middot; 30-day money-back guarantee
            </p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-3)">
          Already purchased? Your access will activate automatically once payment is confirmed (usually instant).
          <br>Need help? <a href="mailto:ben@rodriguezwi.com">ben@rodriguezwi.com</a>
        </p>
      </div>
    `;
    return;
  }

  // Show loading skeleton while fetching
  app.innerHTML = `
    <div style="max-width:900px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;gap:16px">
        <div style="flex:1">
          <div class="skeleton" style="height:32px;width:60%;margin-bottom:8px"></div>
          <div class="skeleton" style="height:16px;width:40%"></div>
        </div>
        <div style="text-align:right">
          <div class="skeleton" style="height:12px;width:100px;margin-bottom:6px"></div>
          <div class="skeleton" style="height:40px;width:80px"></div>
        </div>
      </div>
      <div class="skeleton" style="height:96px;border-radius:14px;margin-bottom:20px"></div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:28px">
        <div class="skeleton" style="height:92px;border-radius:14px"></div>
        <div class="skeleton" style="height:92px;border-radius:14px"></div>
        <div class="skeleton" style="height:92px;border-radius:14px"></div>
        <div class="skeleton" style="height:92px;border-radius:14px"></div>
        <div class="skeleton" style="height:92px;border-radius:14px"></div>
      </div>
      <div class="skeleton" style="height:20px;width:180px;margin-bottom:14px"></div>
      <div class="grid-3">
        <div class="skeleton" style="height:140px;border-radius:14px"></div>
        <div class="skeleton" style="height:140px;border-radius:14px"></div>
        <div class="skeleton" style="height:140px;border-radius:14px"></div>
      </div>
    </div>
  `;

  // Fetch all data in parallel
  let profile, score, streak, streaks, mastery, quizHistory, lessonProgress, lessons, adaptiveHistory;
  try {
    [profile, score, streak, streaks, mastery, quizHistory, lessonProgress, lessons, adaptiveHistory] = await Promise.all([
      getProfile(),
      Store.predictScore(),
      Store.getCurrentStreak(),
      Store.getStreaks(30),
      Store.getAllTopicMastery(),
      Store.getQuizHistory(20),
      Store.getAllLessonProgress(),
      Store.getLessons(),
      Store.getAdaptiveTestHistory()
    ]);
  } catch (err) {
    console.error('[Dashboard] Data fetch failed:', err);
    app.innerHTML = `
      <div style="max-width:480px;margin:80px auto;text-align:center;padding:0 24px">
        <div style="font-size:48px;margin-bottom:16px">⚠️</div>
        <h2 style="margin-bottom:12px">Couldn't Load Dashboard</h2>
        <p class="text-muted" style="margin-bottom:24px">Check your connection and try again.</p>
        <button class="btn btn-primary" onclick="navigate('#/dashboard')">Try Again</button>
      </div>`;
    return;
  }

  // Render sidebar
  await renderDashboardSidebar(lessons, lessonProgress);

  // Determine last lesson for continue card
  const inProgressLessons = lessonProgress.filter(lp => lp.status === 'in_progress');
  const lastLesson = inProgressLessons.length
    ? lessons.find(l => l.id === inProgressLessons[inProgressLessons.length - 1].lesson_id)
    : lessons[0];

  // Calculate overall progress
  const completedCount = lessonProgress.filter(lp => lp.status === 'completed').length;
  const totalLessons = lessons.length || 21;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  // Section stats from mastery
  const sectionStats = { math: { correct: 0, total: 0, weakest: null, weakestAcc: 1 },
                         reading: { correct: 0, total: 0, weakest: null, weakestAcc: 1 },
                         mechanical: { correct: 0, total: 0, weakest: null, weakestAcc: 1 } };
  for (const m of mastery) {
    const sec = m.section || 'math';
    if (sectionStats[sec]) {
      sectionStats[sec].correct += m.correct || 0;
      sectionStats[sec].total += m.attempted || 0;
      const acc = m.attempted > 0 ? m.correct / m.attempted : 1;
      if (acc < sectionStats[sec].weakestAcc && m.attempted >= 2) {
        sectionStats[sec].weakestAcc = acc;
        sectionStats[sec].weakest = m.topic;
      }
    }
  }

  // Build 30-day heatmap data
  const streakMap = {};
  for (const s of streaks) { streakMap[s.study_date] = s.questions_answered || s.minutes_studied; }

  const displayName = esc(profile?.display_name || 'Candidate');
  const predictedScore = score.total || '--';

  app.innerHTML = `
    <!-- WELCOME HEADER -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:28px">
      <div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:-.5px;margin-bottom:4px">Welcome back, ${displayName}</h1>
        <p style="color:var(--text-2);font-size:14px">
          ${progressPct}% complete &bull; ${completedCount}/${totalLessons} lessons finished
        </p>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:1px">Predicted OAR</div>
        <div style="font-size:36px;font-weight:800;color:var(--accent)">${predictedScore}</div>
        ${score.confidence ? `<span class="badge badge-${score.confidence === 'medium' ? 'yellow' : 'red'}">${score.confidence} confidence</span>` : ''}
      </div>
    </div>

    <!-- CONTINUE CARD -->
    ${lastLesson ? `
    <div class="card" style="margin-bottom:20px;border-color:var(--accent);cursor:pointer" onclick="navigate('#/study/${lastLesson.id}')">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-size:12px;color:var(--accent);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Continue Where You Left Off</div>
          <div style="font-size:17px;font-weight:700">${lastLesson.title}</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:2px">${lastLesson.section} &bull; ${lastLesson.description || ''}</div>
        </div>
        <button class="btn btn-primary">Resume &rarr;</button>
      </div>
      <div style="margin-top:14px;height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:var(--green);border-radius:3px"></div>
      </div>
    </div>
    ` : ''}

    <!-- QUICK ACTIONS -->
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:28px">
      ${[
        ['⚡', 'Quick Drill', 'Timed', '#/practice'],
        ['∞', 'Infinite Drill', 'Unlimited', '#/practice'],
        ['📖', 'Resume Study', 'Next lesson', lastLesson ? `#/study/${lastLesson.id}` : '#/study'],
        ['📐', 'Formulas', 'Reference', '#/formulas'],
        ['🧪', 'Test Sim', 'Adaptive CAT', '#/adaptive']
      ].map(([icon, title, sub, href]) => `
        <div class="card" style="text-align:center;padding:20px 12px;cursor:pointer" onclick="navigate('${href}')">
          <div style="font-size:26px;margin-bottom:6px">${icon}</div>
          <div style="font-size:13px;font-weight:700">${title}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px">${sub}</div>
        </div>
      `).join('')}
    </div>

    <!-- WEAK TOPICS CTA -->
    ${(() => {
      const weak = mastery.filter(m => m.mastery_level === 'weak' || m.mastery_level === 'developing').slice(0, 5);
      if (!weak.length) return '';
      return `
        <div class="card" style="margin-bottom:28px;border-color:var(--red);background:var(--red-bg)">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
            <div>
              <div style="font-size:12px;color:var(--red);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">⚠ Focus Here</div>
              <div style="font-size:16px;font-weight:700;margin-bottom:6px">${weak.length} topic${weak.length === 1 ? '' : 's'} need work</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${weak.map(w => `<span class="badge badge-red" style="font-size:11px">${w.topic} (${w.correct}/${w.attempted})</span>`).join('')}
              </div>
            </div>
            <button class="btn btn-primary" onclick="navigate('#/practice')">Drill Weak Topics &rarr;</button>
          </div>
        </div>
      `;
    })()}

    <!-- PROGRESS OVERVIEW (3 sections) -->
    <h2 style="font-size:18px;font-weight:700;margin-bottom:14px">Section Progress</h2>
    <div class="grid-3" style="margin-bottom:28px">
      ${['math', 'reading', 'mechanical'].map(sec => {
        const s = sectionStats[sec];
        const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        const label = sec.charAt(0).toUpperCase() + sec.slice(1);
        const colors = { math: 'var(--accent)', reading: 'var(--green)', mechanical: 'var(--yellow)' };
        const sectionScore = score[sec] || '--';
        return `
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <span style="font-size:15px;font-weight:700;color:${colors[sec]}">${label}</span>
              <span style="font-size:24px;font-weight:800">${sectionScore}</span>
            </div>
            <div style="font-size:13px;color:var(--text-2);margin-bottom:4px">Accuracy: ${acc}% (${s.total} Qs)</div>
            <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden;margin-bottom:10px">
              <div style="height:100%;width:${acc}%;background:${colors[sec]};border-radius:3px"></div>
            </div>
            ${s.weakest ? `<div style="font-size:12px;color:var(--text-3)">Weakest: <span style="color:var(--red)">${s.weakest}</span></div>` : `<div style="font-size:12px;color:var(--text-3)">No weak topics yet</div>`}
          </div>
        `;
      }).join('')}
    </div>

    <!-- SCORE PREDICTOR GAUGE -->
    <h2 style="font-size:18px;font-weight:700;margin-bottom:14px">Score Predictor</h2>
    <div class="card" style="margin-bottom:28px">
      <div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
        <div style="text-align:center;min-width:140px">
          <div style="position:relative;width:140px;height:80px;margin:0 auto">
            <svg viewBox="0 0 140 80" style="width:140px;height:80px">
              <path d="M10 75 A60 60 0 0 1 130 75" fill="none" stroke="var(--surface-2)" stroke-width="10" stroke-linecap="round"/>
              <path d="M10 75 A60 60 0 0 1 130 75" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round"
                    stroke-dasharray="${score.total ? ((score.total - 20) / 60) * 188 : 0} 188"/>
            </svg>
            <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);font-size:28px;font-weight:800;color:var(--accent)">${predictedScore}</div>
          </div>
          <div style="font-size:11px;color:var(--text-3);margin-top:8px">PREDICTED OAR (20-80)</div>
        </div>
        <div style="flex:1;min-width:200px">
          ${['math', 'reading', 'mechanical'].map(sec => {
            const val = score[sec] || 0;
            const pct = val ? ((val - 20) / 60) * 100 : 0;
            const label = sec.charAt(0).toUpperCase() + sec.slice(1);
            return `
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                  <span style="color:var(--text-2)">${label}</span>
                  <span style="font-weight:700">${val || '--'}</span>
                </div>
                <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px;transition:width .5s"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- STUDY STREAK -->
    <div class="grid-2" style="margin-bottom:28px">
      <div class="card">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:14px">Study Streak</h3>
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:16px">
          <span style="font-size:36px;font-weight:800;color:${streak >= 3 ? 'var(--green)' : streak >= 1 ? 'var(--yellow)' : 'var(--text-3)'}">${streak}</span>
          <span style="font-size:14px;color:var(--text-2)">day${streak !== 1 ? 's' : ''}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(10,1fr);gap:3px">
          ${(() => {
            let cells = '';
            for (let i = 29; i >= 0; i--) {
              const d = new Date();
              d.setDate(d.getDate() - i);
              const dateStr = d.toISOString().split('T')[0];
              const val = streakMap[dateStr] || 0;
              const opacity = val > 0 ? Math.min(0.3 + (val / 20) * 0.7, 1) : 0.08;
              cells += `<div title="${dateStr}: ${val} questions" style="aspect-ratio:1;border-radius:3px;background:var(--green);opacity:${opacity}"></div>`;
            }
            return cells;
          })()}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-top:6px">
          <span>30 days ago</span><span>Today</span>
        </div>
      </div>

      <!-- TOPIC MASTERY — labeled, sortable, actually useful -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <h3 style="font-size:15px;font-weight:700;margin:0">Topic Mastery</h3>
          ${mastery.length > 0 ? `<span class="text-muted text-sm">${mastery.length} topic${mastery.length === 1 ? '' : 's'} tracked</span>` : ''}
        </div>
        ${mastery.length === 0
          ? `<p style="font-size:13px;color:var(--text-3)">Start practicing to see which topics you've mastered and which need work. Topics update automatically after every quiz.</p>`
          : (() => {
              // Sort: weakest first so they're top of mind
              const sorted = [...mastery].sort((a, b) => {
                const order = { weak: 0, developing: 1, strong: 2, mastered: 3, unstarted: 4 };
                const oa = order[a.mastery_level] ?? 5;
                const ob = order[b.mastery_level] ?? 5;
                if (oa !== ob) return oa - ob;
                const accA = a.attempted > 0 ? a.correct / a.attempted : 0;
                const accB = b.attempted > 0 ? b.correct / b.attempted : 0;
                return accA - accB;
              });
              return `
                <div style="display:flex;flex-direction:column;gap:8px">
                  ${sorted.map(m => {
                    const colors = {
                      mastered: { bg: 'var(--green-bg)', border: 'hsla(152, 68%, 50%, .3)', text: 'var(--green)', label: 'Mastered' },
                      strong:   { bg: 'var(--green-bg)', border: 'hsla(152, 68%, 50%, .2)', text: 'var(--green)', label: 'Strong' },
                      developing:{bg: 'var(--yellow-bg)', border: 'hsla(38, 94%, 58%, .3)', text: 'var(--yellow)', label: 'Developing' },
                      weak:     { bg: 'var(--red-bg)', border: 'hsla(4, 90%, 64%, .3)', text: 'var(--red)', label: 'Weak' },
                      unstarted:{ bg: 'var(--surface-2)', border: 'var(--border)', text: 'var(--text-3)', label: 'Not started' }
                    };
                    const c = colors[m.mastery_level] || colors.unstarted;
                    const acc = m.attempted > 0 ? Math.round((m.correct / m.attempted) * 100) : 0;
                    const fillPct = m.mastery_level === 'unstarted' ? 0 : Math.max(acc, 5);
                    return `
                      <div
                        onclick="navigate('#/practice?mode=topic&section=${encodeURIComponent(m.section || '')}&topic=${encodeURIComponent(m.topic)}')"
                        style="cursor:pointer;background:var(--bg-elevated);border:1px solid var(--border);border-radius:9px;padding:10px 12px;transition:all var(--dur-fast) var(--ease-out);position:relative;overflow:hidden"
                        onmouseover="this.style.borderColor='${c.border}'"
                        onmouseout="this.style.borderColor='var(--border)'"
                        title="Click to drill ${m.topic}"
                      >
                        <div style="position:absolute;inset:0;background:${c.bg};opacity:.4;pointer-events:none"></div>
                        <div style="position:relative;display:flex;justify-content:space-between;align-items:center;gap:12px">
                          <div style="min-width:0;flex:1">
                            <div style="font-size:13px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.topic}</div>
                            <div style="display:flex;align-items:center;gap:8px;margin-top:3px">
                              <span class="badge" style="background:${c.bg};color:${c.text};border-color:${c.border};font-size:9.5px">${c.label}</span>
                              <span class="text-muted text-sm mono" style="font-size:11px">${m.correct}/${m.attempted}</span>
                            </div>
                          </div>
                          <div style="text-align:right;min-width:44px">
                            <div style="font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600;color:${c.text};line-height:1">${acc}%</div>
                          </div>
                        </div>
                        <div style="position:relative;height:3px;margin-top:8px;background:var(--surface-2);border-radius:2px;overflow:hidden">
                          <div style="height:100%;width:${fillPct}%;background:${c.text};border-radius:2px;transition:width var(--dur-base) var(--ease-out)"></div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
                <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);font-size:11px;color:var(--text-3);text-align:center">
                  Click any topic to drill it
                </div>
              `;
            })()
        }
      </div>
    </div>

    <!-- ADAPTIVE TEST HISTORY -->
    <h2 style="font-size:18px;font-weight:700;margin-bottom:14px">Adaptive Test History</h2>
    <div class="card" style="margin-bottom:28px">
      ${adaptiveHistory.length === 0
        ? `<div style="text-align:center;padding:24px">
            <p style="color:var(--text-3);font-size:14px;margin-bottom:12px">No adaptive tests taken yet.</p>
            <a href="#/adaptive" class="btn btn-primary btn-sm">Take Your First Test</a>
          </div>`
        : `<div style="overflow-x:auto">
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <thead>
                <tr style="border-bottom:1px solid var(--border)">
                  <th style="text-align:left;padding:10px 12px;color:var(--text-3);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Date</th>
                  <th style="text-align:center;padding:10px 12px;color:var(--text-3);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Score</th>
                  <th style="text-align:center;padding:10px 12px;color:var(--text-3);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Questions</th>
                  <th style="text-align:center;padding:10px 12px;color:var(--text-3);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                ${adaptiveHistory.slice(0, 10).map((test, i) => {
                  const date = new Date(test.completed_at || test.created_at).toLocaleDateString();
                  const acc = test.total_questions > 0 ? Math.round((test.correct / test.total_questions) * 100) : 0;
                  const prev = adaptiveHistory[i + 1];
                  const trend = prev ? (test.correct / test.total_questions) - (prev.correct / prev.total_questions) : 0;
                  const trendIcon = trend > 0.02 ? '<span style="color:var(--green)">&#9650;</span>' : trend < -0.02 ? '<span style="color:var(--red)">&#9660;</span>' : '<span style="color:var(--text-3)">&mdash;</span>';
                  return `
                    <tr style="border-bottom:1px solid var(--border)">
                      <td style="padding:10px 12px">${date}</td>
                      <td style="padding:10px 12px;text-align:center;font-weight:700">${test.estimated_score || acc}%</td>
                      <td style="padding:10px 12px;text-align:center">${test.total_questions}</td>
                      <td style="padding:10px 12px;text-align:center">${acc}% ${trendIcon}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>`
      }
    </div>
  `;
});

// Render study sidebar with lesson list
async function renderDashboardSidebar(lessons, lessonProgress) {
  const sidebar = document.getElementById('sidebar');
  if (!lessons) lessons = await Store.getLessons();
  if (!lessonProgress) lessonProgress = await Store.getAllLessonProgress();

  const progressMap = {};
  for (const lp of lessonProgress) {
    progressMap[lp.lesson_id] = lp.status;
  }

  // Group lessons by section
  const sections = {};
  for (const l of lessons) {
    const sec = l.section || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(l);
  }

  const completedCount = lessonProgress.filter(lp => lp.status === 'completed').length;
  const totalLessons = lessons.length || 1;
  const pct = Math.round((completedCount / totalLessons) * 100);

  // Predicted score for sidebar header
  const score = await Store.predictScore();

  sidebar.innerHTML = `
    ${score.total ? `
    <div class="sidebar-score">
      <div class="score-label">Predicted OAR</div>
      <div class="score-value">${score.total}</div>
    </div>
    ` : ''}
    <div class="sidebar-progress">
      <div style="display:flex;justify-content:space-between;font-size:13px">
        <span style="color:var(--text-2)">Progress</span>
        <span style="font-weight:700">${completedCount}/${totalLessons}</span>
      </div>
      <div class="sidebar-progress-bar">
        <div class="sidebar-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>
    ${Object.entries(sections).map(([sec, items]) => `
      <div class="sidebar-section">
        <div class="sidebar-section-title">${sec}</div>
        ${items.map(l => {
          const status = progressMap[l.id] || 'not_started';
          const dotClass = status === 'completed' ? 'completed' : status === 'in_progress' ? 'in-progress' : 'not-started';
          return `
            <a href="#/study/${l.id}" class="sidebar-item" data-lesson="${l.id}">
              <span class="status-dot ${dotClass}"></span>
              <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.title}</span>
            </a>
          `;
        }).join('')}
      </div>
    `).join('')}
  `;
}
