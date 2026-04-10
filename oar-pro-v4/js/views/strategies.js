// OAR Pro v4 — Test-Taking Strategies View
// Route: /strategies

const STRATEGY_SECTIONS = [
  {
    id: 'oar-overview',
    title: 'OAR Test Overview',
    icon: '&#9875;',
    content: `
      <p style="color:var(--text-2);margin-bottom:16px">
        The Officer Aptitude Rating (OAR) is a subset of the Aviation Selection Test Battery (ASTB-E).
        Understanding the test structure is the first step to a high score.
      </p>
      <div class="grid-3" style="gap:12px;margin-bottom:20px">
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--accent)">3</div>
          <div style="font-size:12px;color:var(--text-2);margin-top:4px">Subtests</div>
        </div>
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--green)">~35–50</div>
          <div style="font-size:12px;color:var(--text-2);margin-top:4px">Questions Total</div>
        </div>
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--yellow)">20–80</div>
          <div style="font-size:12px;color:var(--text-2);margin-top:4px">Score Range</div>
        </div>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:10px">The Three Subtests</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="callout callout-formula">
            <div class="callout-title">Math Skills Test (MST)</div>
            Arithmetic, algebra, geometry, and word problems. Typically 30 questions.
          </div>
          <div class="callout callout-example">
            <div class="callout-title">Reading Comprehension Test (RCT)</div>
            Short passages followed by inference and main-idea questions. Typically 20 questions.
          </div>
          <div class="callout callout-tip">
            <div class="callout-title">Mechanical Comprehension Test (MCT)</div>
            Pulleys, gears, levers, physics concepts. Typically 30 questions.
          </div>
        </div>
      </div>
      <div class="callout callout-warning">
        <div class="callout-title">Scoring</div>
        Scores are combined into a single OAR composite (20–80). Different programs set their own
        minimums. A 40+ is generally competitive; 50+ is strong. There is <strong>no penalty for
        wrong answers</strong> — never leave a question blank.
      </div>
    `
  },
  {
    id: 'adaptive-testing',
    title: 'How Adaptive Testing (CAT) Works',
    icon: '&#129504;',
    content: `
      <p style="color:var(--text-2);margin-bottom:16px">
        The OAR uses Computer Adaptive Testing (CAT). The test adapts to your ability level in real time.
        Understanding this changes how you should approach every question.
      </p>
      <div class="callout callout-formula">
        <div class="callout-title">How CAT Works</div>
        Start with a medium-difficulty question. Get it right → next question is harder.
        Get it wrong → next question is easier. The algorithm narrows in on your true ability level.
      </div>
      <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px">
        <div class="callout callout-tip">
          <div class="callout-title">Early Questions Matter More</div>
          The first 5–8 questions have a disproportionate impact on your score. Slow down, read carefully,
          and be accurate at the start.
        </div>
        <div class="callout callout-warning">
          <div class="callout-title">You Cannot Skip or Go Back</div>
          Every answer is final. Commit to an answer and move on — spending 5 minutes on one question
          hurts you on the remaining questions.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">Harder Questions = Higher Score</div>
          If you're seeing difficult questions, that's a good sign. Stay calm and apply your strategies.
          Seeing easy questions means the algorithm thinks you're struggling — focus and recover.
        </div>
      </div>
    `
  },
  {
    id: 'math-strategy',
    title: 'Math Strategy',
    icon: '&#10133;',
    content: `
      <div style="margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:10px">Core Approach</div>
        <div class="callout callout-formula">
          <div class="callout-title">PEMDAS — Know the Traps</div>
          The most common MST errors come from order-of-operations mistakes. When you see parentheses,
          exponents, or mixed operations — write it out. Don't do it in your head.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="callout callout-tip">
          <div class="callout-title">Plug In Numbers</div>
          When a question has variables (x, n, etc.), plug in a simple number (1, 2, or 10) and test
          each answer choice. Faster than solving algebraically.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">Backsolve from Answer Choices</div>
          For "solve for x" problems, start with choice C (the middle value). If it's too high, try B;
          too low, try D. Eliminates algebra entirely.
        </div>
        <div class="callout callout-tip">
          <div class="callout-title">Estimate First</div>
          Round numbers to eliminate obviously wrong answers before calculating. If the exact answer
          takes more than 90 seconds, use your best estimate and move on.
        </div>
        <div class="callout callout-warning">
          <div class="callout-title">Time Management — 90 Seconds Per Question</div>
          The MST is not designed to be leisurely. If you're over 90 seconds, make your best guess.
          Accuracy on earlier questions impacts your score more than spending 3 minutes on a late one.
        </div>
        <div class="callout callout-formula">
          <div class="callout-title">Geometry Shortcut: Common Right Triangles</div>
          Memorize 3-4-5 and 5-12-13. Sides are always multiples (6-8-10, 10-24-26, etc.).
          You'll save 30+ seconds on every Pythagorean problem.
        </div>
      </div>
    `
  },
  {
    id: 'reading-strategy',
    title: 'Reading Comprehension Strategy',
    icon: '&#128218;',
    content: `
      <div class="callout callout-formula" style="margin-bottom:16px">
        <div class="callout-title">The ONE Rule</div>
        Every correct answer is directly supported by the passage text. If you can't point to the exact
        sentence that backs your answer, it's probably wrong.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="callout callout-tip">
          <div class="callout-title">Read Questions First (Skimming Method)</div>
          Before reading the passage, skim the questions. This tells you what to look for — you read
          the passage with a purpose instead of absorbing everything.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">Eliminate Extreme Language</div>
          Answers with "always," "never," "all," or "only" are almost always wrong. The OAR loves
          nuanced language — look for "usually," "generally," "often," "may."
        </div>
        <div class="callout callout-tip">
          <div class="callout-title">Answer "Main Idea" Questions Last</div>
          If you understand each paragraph, the main idea becomes obvious. Tackle specific questions
          first, then circle back to the big-picture question.
        </div>
        <div class="callout callout-warning">
          <div class="callout-title">Don't Use Outside Knowledge</div>
          The RCT tests reading comprehension, not general knowledge. Even if you know the topic well,
          base your answer on what the passage says — not what you know to be true.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">Two-Step Elimination</div>
          Step 1: Eliminate answers that directly contradict the passage. Step 2: Choose between
          remaining options by finding the one most directly supported by the text.
        </div>
      </div>
    `
  },
  {
    id: 'mechanical-strategy',
    title: 'Mechanical Comprehension Strategy',
    icon: '&#9881;',
    content: `
      <div class="callout callout-warning" style="margin-bottom:16px">
        <div class="callout-title">The 30-Second Rule</div>
        MCT questions are designed to be solved conceptually, not mathematically. If you're still
        calculating after 30 seconds, you're approaching it wrong. Step back and think about the
        underlying principle.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="callout callout-formula">
          <div class="callout-title">Gears — Two Rules to Memorize</div>
          1. Meshing gears always rotate in opposite directions.<br>
          2. More teeth = slower rotation, more torque. Fewer teeth = faster, less torque.
        </div>
        <div class="callout callout-formula">
          <div class="callout-title">Pulleys — Count the Rope Segments</div>
          Mechanical Advantage = number of rope segments supporting the moving block.
          A single fixed pulley just changes direction (MA = 1). Each additional rope segment halves
          the effort required.
        </div>
        <div class="callout callout-formula">
          <div class="callout-title">Levers — Balance the Moments</div>
          Force × Distance from fulcrum must be equal on both sides to balance.
          Move the fulcrum toward the load → less effort needed.
        </div>
        <div class="callout callout-tip">
          <div class="callout-title">Fluid Flow — Think Hose</div>
          Narrow pipe = faster flow (same volume must pass through). Wider pipe = slower.
          Visualize squeezing a garden hose.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">Electricity — Series vs. Parallel</div>
          Series: one path, same current everywhere, resistance adds up.<br>
          Parallel: multiple paths, same voltage everywhere, resistance decreases.
        </div>
      </div>
    `
  },
  {
    id: 'mometrix-keys',
    title: 'Mometrix 5 Secret Keys',
    icon: '&#128273;',
    content: `
      <p style="color:var(--text-2);margin-bottom:16px">
        These meta-strategies apply to all three subtests and govern how you prepare and perform.
      </p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--accent);color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0">1</span>
            <div style="font-weight:700">Plan Big — Test the Whole Test</div>
          </div>
          <p style="color:var(--text-2);font-size:13px">
            Do a full diagnostic early. Identify your weakest areas before investing study time.
            Spending 20 hours on your strong sections while ignoring weaknesses is how people plateau.
          </p>
        </div>
        <div class="card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--accent);color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0">2</span>
            <div style="font-weight:700">Active Recall Over Passive Review</div>
          </div>
          <p style="color:var(--text-2);font-size:13px">
            Re-reading notes is the least effective study method. Test yourself constantly — flashcards,
            practice problems, teaching a concept out loud. If you can recall it under pressure, you own it.
          </p>
        </div>
        <div class="card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--accent);color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0">3</span>
            <div style="font-weight:700">3-Test Strategy — Don't Cram</div>
          </div>
          <p style="color:var(--text-2);font-size:13px">
            Take a practice test, study weak areas, take another practice test. Three spaced cycles
            outperform marathon cramming sessions every time. Space your full mock tests 5–7 days apart.
          </p>
        </div>
        <div class="card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--accent);color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0">4</span>
            <div style="font-weight:700">Pacing — Move Forward, Not Backward</div>
          </div>
          <p style="color:var(--text-2);font-size:13px">
            On CAT you cannot go back. The mental energy spent second-guessing is better used on
            the next question. Mark your answer decisively and advance.
          </p>
        </div>
        <div class="card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="background:var(--accent);color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0">5</span>
            <div style="font-weight:700">The $5 Challenge</div>
          </div>
          <p style="color:var(--text-2);font-size:13px">
            Before changing an answer, ask yourself: "Would I bet $5 that my new answer is better
            than my original?" If not, keep your first instinct. First answers are right more often
            than changed answers, statistically.
          </p>
        </div>
      </div>
    `
  },
  {
    id: 'qa-strategies',
    title: 'Question & Answer Strategies',
    icon: '&#10067;',
    content: `
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="callout callout-formula">
          <div class="callout-title">Process of Elimination (POE)</div>
          Start by eliminating obviously wrong answers. With 4 choices, eliminate 2 and you have a
          50/50 shot. With 5 choices, eliminate 2 and you're at 33%+ even guessing.
        </div>
        <div class="callout callout-tip">
          <div class="callout-title">Beware of "Attractive Distractors"</div>
          Test writers intentionally create answer choices that look right. They often use keywords
          from the question, correct formulas applied to wrong values, or answers that would be right
          in a slightly different version of the problem.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">When Two Answers Look Right</div>
          One is usually more complete, more specific, or directly stated in the passage/problem.
          The "better" answer covers more of the question's intent.
        </div>
        <div class="callout callout-warning">
          <div class="callout-title">Never Leave a Question Blank</div>
          The OAR has no wrong-answer penalty. A guess has a 25% (or 20%) chance of being correct.
          A blank has 0% chance. Always select something.
        </div>
        <div class="callout callout-tip">
          <div class="callout-title">Strategic Guessing Priority</div>
          If you must guess, eliminate what you can, then pick the longest answer (often the most
          complete/correct) or the middle numerical value on math questions.
        </div>
      </div>
    `
  },
  {
    id: 'test-day',
    title: 'Test Day Checklist',
    icon: '&#9989;',
    isChecklist: true,
    checklistItems: [
      { id: 'td1', text: 'Sleep 8 hours the night before' },
      { id: 'td2', text: 'Eat a solid meal 1–2 hours before the test' },
      { id: 'td3', text: 'Arrive at the MEPS / testing center 30 minutes early' },
      { id: 'td4', text: 'Bring valid government-issued photo ID' },
      { id: 'td5', text: 'No caffeine binge — stay at your normal intake level' },
      { id: 'td6', text: 'Do a brief 10-minute formula review, then stop studying' },
      { id: 'td7', text: 'Dress comfortably — you may be sitting for 2+ hours' },
      { id: 'td8', text: 'Confirm testing center location and parking the day before' },
      { id: 'td9', text: 'Review your top 3 weak areas once in the morning' },
      { id: 'td10', text: 'Have a plan for pacing each section (goal questions/minute)' },
      { id: 'td11', text: 'Remember: early CAT questions matter most — slow down at the start' },
      { id: 'td12', text: 'No blank answers — always select something before time runs out' }
    ]
  },
  {
    id: 'test-anxiety',
    title: 'Overcoming Test Anxiety',
    icon: '&#129504;',
    content: `
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="callout callout-tip">
          <div class="callout-title">Box Breathing (4-4-4-4)</div>
          Inhale for 4 seconds. Hold for 4 seconds. Exhale for 4 seconds. Hold for 4 seconds.
          Repeat 3 times. Used by Navy SEALs under stress — activates the parasympathetic nervous system.
        </div>
        <div class="callout callout-example">
          <div class="callout-title">Reframe Anxiety as Excitement</div>
          Your body's stress response (heart racing, alertness) is identical to excitement.
          Research shows telling yourself "I'm excited" outperforms "I'm calm" before high-stakes tests.
        </div>
        <div class="callout callout-formula">
          <div class="callout-title">Preparation Is the Best Anxiety Cure</div>
          Most test anxiety comes from feeling underprepared. Consistent daily practice — even 20 minutes
          — reduces anxiety more than any mental trick. You can't think your way out of being unprepared.
        </div>
        <div class="callout callout-tip">
          <div class="callout-title">Process Goals, Not Outcome Goals</div>
          Going in thinking "I need a 50" adds pressure. Instead focus on process: "I will read each
          question fully before answering" and "I will not spend more than 90 seconds on any question."
          Process goals are fully within your control.
        </div>
        <div class="callout callout-warning">
          <div class="callout-title">If You Blank on a Question</div>
          Stop. Take one box breath. Re-read the question stem only. Ask: what is actually being asked?
          What formula or concept applies? If still stuck, eliminate two options and commit to one.
          Move on.
        </div>
      </div>
    `
  }
];

route('/strategies', async () => {
  const app = document.getElementById('app');

  // Build checklist HTML helper
  function buildChecklist(items) {
    return `
      <div style="display:flex;flex-direction:column;gap:8px" id="checklistContainer">
        ${items.map(item => `
          <label style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:8px;cursor:pointer;border:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background=''" id="label_${item.id}">
            <input
              type="checkbox"
              id="${item.id}"
              onchange="updateChecklistItem('${item.id}')"
              style="width:16px;height:16px;accent-color:var(--green);cursor:pointer;flex-shrink:0"
            >
            <span style="font-size:14px" id="text_${item.id}">${item.text}</span>
          </label>
        `).join('')}
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--text-3)">
        &#128274; Checklist resets when you leave this page.
      </div>
    `;
  }

  // Build sections HTML
  let sectionsHtml = '';
  for (const section of STRATEGY_SECTIONS) {
    const isOpen = true; // all open by default
    const sectionId = 'strat_' + section.id;
    const bodyContent = section.isChecklist
      ? buildChecklist(section.checklistItems)
      : section.content;

    sectionsHtml += `
      <div class="card mb-4" style="padding:0;overflow:hidden" id="card_${section.id}">
        <div
          onclick="toggleStrategySection('${section.id}')"
          style="padding:18px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none"
        >
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:20px">${section.icon}</span>
            <span style="font-weight:700;font-size:15px">${section.title}</span>
          </div>
          <span style="color:var(--text-3);font-size:18px;transition:transform .2s" id="sarrow_${section.id}">&#9660;</span>
        </div>
        <div id="${sectionId}" style="display:block">
          <div style="padding:0 20px 20px 20px;border-top:1px solid var(--border);padding-top:16px">
            ${bodyContent}
          </div>
        </div>
      </div>
    `;
  }

  app.innerHTML = `
    <div style="max-width:780px">
      <div style="margin-bottom:24px">
        <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">Test-Taking Strategies</h1>
        <p class="text-muted text-sm">Evidence-based techniques to maximize your OAR score.</p>
      </div>
      <div id="strategySections">${sectionsHtml}</div>
    </div>
  `;

  // Initialize arrow states (all open)
  window._strategyOpen = {};
  STRATEGY_SECTIONS.forEach(s => { window._strategyOpen[s.id] = true; });
});

function toggleStrategySection(id) {
  window._strategyOpen = window._strategyOpen || {};
  window._strategyOpen[id] = !window._strategyOpen[id];
  const isOpen = window._strategyOpen[id];
  const body = document.getElementById('strat_' + id);
  const arrow = document.getElementById('sarrow_' + id);
  if (body) body.style.display = isOpen ? 'block' : 'none';
  if (arrow) arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(-90deg)';
}

function updateChecklistItem(itemId) {
  const checkbox = document.getElementById(itemId);
  const textEl = document.getElementById('text_' + itemId);
  if (!checkbox || !textEl) return;
  if (checkbox.checked) {
    textEl.style.textDecoration = 'line-through';
    textEl.style.color = 'var(--text-3)';
  } else {
    textEl.style.textDecoration = '';
    textEl.style.color = '';
  }
}
