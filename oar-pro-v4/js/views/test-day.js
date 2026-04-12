// OAR Pro v4 — Test Day Mode
// A focused view for the day of (or night before) the OAR.
// Shows a checklist, cram sheet, anxiety management, and key formulas.
// — Benjamin Rodriguez

route('/test-day', async () => {
  const app = document.getElementById('app');
  app.classList.remove('full-width');

  // Pull test date from profile if set
  const profile = await getProfile().catch(() => null);
  const testDate = profile?.test_date ? new Date(profile.test_date + 'T00:00:00') : null;
  const daysUntil = testDate ? Math.ceil((testDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  let countdownLabel = 'No test date set';
  let countdownColor = 'var(--text-2)';
  if (daysUntil !== null) {
    if (daysUntil < 0) { countdownLabel = 'Test day passed'; countdownColor = 'var(--text-3)'; }
    else if (daysUntil === 0) { countdownLabel = 'Today — good luck!'; countdownColor = 'var(--green)'; }
    else if (daysUntil === 1) { countdownLabel = 'Tomorrow'; countdownColor = 'var(--yellow)'; }
    else if (daysUntil <= 7) { countdownLabel = `${daysUntil} days out`; countdownColor = 'var(--yellow)'; }
    else { countdownLabel = `${daysUntil} days out`; countdownColor = 'var(--accent)'; }
  }

  app.innerHTML = `
    <div style="max-width:760px">
      <!-- HERO -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;flex-wrap:wrap;gap:16px">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:6px">OAR</div>
          <h1 style="margin-bottom:6px">Test Day</h1>
          <div style="font-size:14px;color:${countdownColor};font-weight:600">${countdownLabel}</div>
        </div>
        ${!profile?.test_date ? `
          <a href="#/profile" class="btn btn-secondary btn-sm">Set Test Date &rarr;</a>
        ` : ''}
      </div>

      <!-- THE NIGHT BEFORE -->
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:var(--purple);display:flex;align-items:center;justify-content:center;font-size:14px">🌙</div>
          <div class="card-title" style="margin:0">Night Before</div>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
          ${[
            { t: 'Stop studying by 8pm', s: 'Cramming past 8pm costs more sleep than it gains knowledge. Your brain consolidates what you already know overnight.' },
            { t: 'Review the cram sheet once, not twice', s: 'Read it slowly. Picture each formula. Do not re-learn material — trust the reps you already did.' },
            { t: 'Pack everything tonight', s: 'ID, admission letter, pencils, snack, water. Put them in your bag and place the bag at the door.' },
            { t: 'Lay out test-day clothes', s: 'Layers you can remove. Testing rooms are cold.' },
            { t: 'Set two alarms', s: 'Phone + backup alarm clock. Anxiety is worse than oversleeping.' },
            { t: 'Hydrate normally, eat dinner you like', s: 'New foods = stomach risk. Familiar food only.' },
            { t: 'Lights out by 10:30pm', s: 'Real sleep — not scrolling. Aim for 8 hours.' }
          ].map(item => `
            <li style="display:flex;align-items:flex-start;gap:10px">
              <input type="checkbox" style="margin-top:4px;accent-color:var(--accent);width:16px;height:16px;cursor:pointer">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">${item.t}</div>
                <div style="font-size:13px;color:var(--text-2);margin-top:2px">${item.s}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- TEST DAY MORNING -->
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:14px">☀️</div>
          <div class="card-title" style="margin:0">Test Day Morning</div>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
          ${[
            { t: 'Wake up 2 hours before your test', s: 'Your brain needs time to fully wake up. Do not rush.' },
            { t: 'Protein + complex carbs breakfast', s: 'Eggs + oatmeal, or peanut butter toast. Avoid sugar crashes.' },
            { t: 'Light review of the cram sheet (15 min)', s: 'Not to learn — to warm up recall. Read, don\'t drill.' },
            { t: 'Leave early, arrive 30 min before', s: 'Late arrival triggers cortisol spike. Buffer time = calm brain.' },
            { t: 'Use the bathroom before you sit down', s: 'Obvious but easy to forget under stress.' },
            { t: 'Box breathing in the parking lot: 4-4-4-4', s: 'Inhale 4s → hold 4s → exhale 4s → hold 4s. Do 4 rounds. Drops heart rate fast.' }
          ].map(item => `
            <li style="display:flex;align-items:flex-start;gap:10px">
              <input type="checkbox" style="margin-top:4px;accent-color:var(--accent);width:16px;height:16px;cursor:pointer">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">${item.t}</div>
                <div style="font-size:13px;color:var(--text-2);margin-top:2px">${item.s}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- DURING THE TEST -->
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:14px">⚡</div>
          <div class="card-title" style="margin:0">During the Test</div>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
          ${[
            { t: 'Dump formulas on scratch paper immediately', s: 'Before question 1. Quadratic, Pythagorean, v=at, F=ma, V=IR, Levers, Gears, Bernoulli. Five minutes of write-down = 65 min of reference.' },
            { t: 'Educated guess beats blank', s: 'CAT penalizes unanswered questions. Narrow to 2, pick one, move on.' },
            { t: 'No going back', s: 'CAT format locks answers. Commit and move forward — don\'t waste cycles regretting.' },
            { t: 'Pace yourself by section', s: 'Math: 50s/Q. Reading: 55s/Q. Mech: 30s/Q. Glance at the clock every 5 questions.' },
            { t: 'If stuck >60 seconds, guess and move', s: 'One hard question is not worth three easy ones you won\'t reach.' },
            { t: 'Read the question first on reading passages', s: 'Know what you\'re hunting for before you read the passage.' }
          ].map(item => `
            <li style="display:flex;align-items:flex-start;gap:10px">
              <input type="checkbox" style="margin-top:4px;accent-color:var(--accent);width:16px;height:16px;cursor:pointer">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">${item.t}</div>
                <div style="font-size:13px;color:var(--text-2);margin-top:2px">${item.s}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- CRAM SHEET -->
      <div class="card" style="margin-bottom:16px;border-color:var(--accent)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg, var(--accent), var(--purple));display:flex;align-items:center;justify-content:center;font-size:14px">📐</div>
            <div class="card-title" style="margin:0">Cram Sheet</div>
          </div>
          <a href="#/formulas" class="btn btn-sm btn-secondary">Full Reference &rarr;</a>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          ${[
            ['Arithmetic', ['Percent: (p/100)×n', 'Percent change: (new−old)/old ×100']],
            ['Algebra', ['Quadratic: \\(x = \\dfrac{-b \\pm \\sqrt{b^2-4ac}}{2a}\\)', 'Slope: \\(\\dfrac{y_2-y_1}{x_2-x_1}\\)']],
            ['Geometry', ['Pythagorean: a² + b² = c²', 'Circle: A = πr², C = 2πr', 'Triangle: A = ½bh']],
            ['Kinematics', ['v = at', 'd = ½at²', 'v² = u² + 2as']],
            ['Forces', ['F = ma', 'Weight = mg', 'μmg = friction force']],
            ['Energy', ['KE = ½mv²', 'PE = mgh', 'W = Fd']],
            ['Machines', ['Lever: F₁d₁ = F₂d₂', 'Gears: T₁RPM₁ = T₂RPM₂', 'Ramp MA = L/h']],
            ['Electricity', ['V = IR', 'P = VI', 'Series: R = R₁+R₂']],
            ['Fluids', ['P = F/A', 'Pascal: F₁/A₁ = F₂/A₂', 'Bernoulli: faster = lower P']]
          ].map(([cat, items]) => `
            <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:10px;padding:12px 14px">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:600;margin-bottom:6px">${cat}</div>
              ${items.map(f => {
                const hasMath = f.includes('\\(');
                return `<div ${hasMath ? '' : 'class="mono"'} style="font-size:12px;color:var(--text);margin-bottom:3px">${f}</div>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ANXIETY RESCUE -->
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:14px">🫁</div>
          <div class="card-title" style="margin:0">If You Panic Mid-Test</div>
        </div>
        <div style="font-size:14px;line-height:1.6;color:var(--text-2)">
          <p style="margin-bottom:10px">Panic is physiological — your body can't distinguish "hard question" from "bear attack." Reset with <strong style="color:var(--text)">one breath cycle</strong>:</p>
          <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px">
            <div style="font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">4-7-8 Breath</div>
            <div>Inhale 4 seconds → hold 7 seconds → exhale slowly 8 seconds. Do it once. Your heart rate drops in under 30 seconds.</div>
          </div>
          <p>Then reframe: <em style="color:var(--yellow)">"My body is giving me energy for this."</em> That single sentence is called anxiety reappraisal and it's the most-studied trick in sports psychology.</p>
        </div>
      </div>

      <!-- AFTER THE TEST -->
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:14px">🎯</div>
          <div class="card-title" style="margin:0">After the Test</div>
        </div>
        <div style="font-size:14px;color:var(--text-2);line-height:1.6">
          <p style="margin-bottom:10px">Do not review answers. Do not google explanations. Do not ask other candidates what they got.</p>
          <p style="margin-bottom:10px">Results come via your recruiter — typically same day or next morning. Your job between now and then: <strong style="color:var(--text)">go do literally anything else</strong>.</p>
          <p>You earned the score you earned. Rest is good prep for the next thing.</p>
        </div>
      </div>

      <div style="text-align:center;padding:32px 0 12px;color:var(--text-3);font-size:12px">
        You got this. &mdash; Benjamin
      </div>
    </div>
  `;
});
