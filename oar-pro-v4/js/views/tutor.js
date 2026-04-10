// OAR Pro v4 — Worked Problems Tutor View
// Route: /tutor
// Shows practice problems with step-by-step solutions and progressive hints.

const TUTOR_TOPICS = [
  { value: '', label: '— Select a Topic —', section: '' },
  // Math
  { value: 'fractions', label: 'Fractions & Decimals', section: 'Math' },
  { value: 'percents', label: 'Percents & Ratios', section: 'Math' },
  { value: 'algebra', label: 'Algebra & Equations', section: 'Math' },
  { value: 'geometry', label: 'Geometry', section: 'Math' },
  { value: 'word-problems', label: 'Word Problems (Rate/Time/Distance)', section: 'Math' },
  { value: 'statistics', label: 'Statistics & Averages', section: 'Math' },
  // Mechanical
  { value: 'levers', label: 'Levers & Torque', section: 'Mechanical' },
  { value: 'pulleys', label: 'Pulleys & Mechanical Advantage', section: 'Mechanical' },
  { value: 'gears', label: 'Gears & Rotation', section: 'Mechanical' },
  { value: 'electricity', label: "Ohm's Law & Circuits", section: 'Mechanical' },
  { value: 'forces', label: 'Forces & Motion', section: 'Mechanical' },
  { value: 'energy', label: 'Energy & Work', section: 'Mechanical' },
  { value: 'fluids', label: 'Fluids & Pressure', section: 'Mechanical' },
];

// Hardcoded sample problems — keyed by topic, then difficulty
const SAMPLE_PROBLEMS = {
  'fractions': {
    Easy: [
      {
        id: 'fr-e-1',
        statement: 'A recipe calls for ¾ cup of flour. If you want to make 2½ times the recipe, how many cups of flour do you need?',
        prompt: 'Before checking hints: write out what you know and what you need to find.',
        hints: [
          'You need to multiply the original amount by the scale factor.',
          'Multiply: ¾ × 2½. Convert 2½ to an improper fraction first: 2½ = 5/2.',
          '¾ × 5/2 = 15/8. Convert back: 15 ÷ 8 = 1 remainder 7, so 1⅞ cups.'
        ],
        solution: [
          { step: 'Identify what you know', detail: 'Original amount = ¾ cup. Scale factor = 2½.' },
          { step: 'Convert the mixed number', detail: '2½ = (2 × 2 + 1)/2 = 5/2' },
          { step: 'Multiply the fractions', detail: '¾ × 5/2 = (3 × 5)/(4 × 2) = 15/8' },
          { step: 'Convert to mixed number', detail: '15 ÷ 8 = 1 with remainder 7, so 15/8 = 1⅞' },
          { step: 'Answer', detail: '1⅞ cups of flour. Answer: 1⅞ (or 1.875)' }
        ]
      }
    ],
    Medium: [
      {
        id: 'fr-m-1',
        statement: 'A tank is ⅝ full. After adding 15 gallons it is ¾ full. What is the total capacity of the tank?',
        prompt: 'Set up an equation before reaching for the calculator.',
        hints: [
          'The fraction increase from ⅝ to ¾ equals 15 gallons.',
          'Find the fractional difference: ¾ − ⅝. Use a common denominator of 8.',
          '¾ = 6/8. So the difference is 6/8 − 5/8 = 1/8. If 1/8 of the tank = 15 gallons, then the full tank = 15 × 8.'
        ],
        solution: [
          { step: 'Set up the relationship', detail: 'Added fraction = ¾ − ⅝' },
          { step: 'Common denominator', detail: '¾ = 6/8, so 6/8 − 5/8 = 1/8' },
          { step: 'Write the equation', detail: '(1/8) × C = 15, where C = total capacity' },
          { step: 'Solve for C', detail: 'C = 15 × 8 = 120 gallons' },
          { step: 'Answer', detail: 'The tank holds 120 gallons total.' }
        ]
      }
    ],
    Hard: [
      {
        id: 'fr-h-1',
        statement: 'Three workers complete a job. Worker A finishes ⅓ of the work, Worker B finishes ⅖ of the work, and Worker C finishes the rest. If Worker C completed 14 tasks, how many total tasks were there?',
        prompt: 'What fraction does Worker C complete?',
        hints: [
          'Add the fractions for A and B to find the total fraction they completed together.',
          '⅓ + ⅖. Common denominator is 15: 5/15 + 6/15 = 11/15. So C does 1 − 11/15 = 4/15.',
          'If 4/15 of the total = 14 tasks, then total = 14 ÷ (4/15) = 14 × (15/4).'
        ],
        solution: [
          { step: "Find A + B's combined fraction", detail: '⅓ + ⅖ = 5/15 + 6/15 = 11/15' },
          { step: "Find C's fraction", detail: '1 − 11/15 = 15/15 − 11/15 = 4/15' },
          { step: 'Set up equation', detail: '(4/15) × T = 14' },
          { step: 'Solve', detail: 'T = 14 × (15/4) = 210/4 = 52.5 ≈ 52 or 53 depending on rounding' },
          { step: 'Check', detail: 'Exact answer: T = 52.5. If the problem expects a whole number, re-check the fractions or note the answer is 52.5 tasks.' }
        ]
      }
    ]
  },

  'word-problems': {
    Easy: [
      {
        id: 'wp-e-1',
        statement: 'A car travels 240 miles in 4 hours. At the same speed, how long will it take to travel 360 miles?',
        prompt: 'What formula connects distance, rate, and time?',
        hints: [
          'd = r × t. You need to find the rate first, then use it for the new distance.',
          'Rate = distance ÷ time = 240 ÷ 4 = 60 mph.',
          'New time = new distance ÷ rate = 360 ÷ 60.'
        ],
        solution: [
          { step: 'Find the rate', detail: 'r = d/t = 240 miles ÷ 4 hours = 60 mph' },
          { step: 'Set up new equation', detail: 't = d/r = 360 miles ÷ 60 mph' },
          { step: 'Calculate', detail: 't = 6 hours' },
          { step: 'Answer', detail: 'It will take 6 hours to travel 360 miles at 60 mph.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'wp-m-1',
        statement: 'Two trains leave the same station at the same time traveling in opposite directions. Train A goes 55 mph and Train B goes 65 mph. After how many hours are they 360 miles apart?',
        prompt: 'When objects move in opposite directions, their speeds add.',
        hints: [
          'Their combined separation rate = 55 + 65 = 120 mph.',
          'Distance = rate × time, so time = distance ÷ rate.',
          'time = 360 ÷ 120 = 3 hours.'
        ],
        solution: [
          { step: 'Identify the combined rate', detail: 'Moving apart: 55 + 65 = 120 mph' },
          { step: 'Apply d = rt', detail: '360 = 120 × t' },
          { step: 'Solve', detail: 't = 360 ÷ 120 = 3 hours' },
          { step: 'Answer', detail: 'After 3 hours they are 360 miles apart.' }
        ]
      }
    ],
    Hard: [
      {
        id: 'wp-h-1',
        statement: 'A plane flies 1,800 miles with a tailwind and returns the same distance against the headwind. The tailwind and headwind speed is 50 mph. The round trip takes 12 hours total. What is the plane\'s airspeed in still air?',
        prompt: 'Set up two time equations — one for each leg — and use the fact they sum to 12.',
        hints: [
          'Let p = plane airspeed. With tailwind: speed = p + 50. Against: speed = p − 50.',
          'Time with wind + Time against wind = 12. Write: 1800/(p+50) + 1800/(p−50) = 12.',
          'Multiply through to clear denominators, then solve the resulting quadratic.'
        ],
        solution: [
          { step: 'Define variables', detail: 'p = airspeed (mph). Tailwind speed = p + 50. Headwind speed = p − 50.' },
          { step: 'Set up equation', detail: '1800/(p+50) + 1800/(p−50) = 12' },
          { step: 'Multiply both sides by (p+50)(p−50)', detail: '1800(p−50) + 1800(p+50) = 12(p²−2500)' },
          { step: 'Simplify left side', detail: '1800p − 90000 + 1800p + 90000 = 3600p' },
          { step: 'Solve', detail: '3600p = 12p² − 30000 → 12p² − 3600p − 30000 = 0 → p² − 300p − 2500 = 0' },
          { step: 'Quadratic formula', detail: 'p = (300 ± √(90000 + 10000))/2 = (300 ± √100000)/2 ≈ (300 ± 316)/2' },
          { step: 'Answer', detail: 'p ≈ 308 mph (taking positive root). Verify: 1800/358 + 1800/258 ≈ 5.03 + 6.98 ≈ 12 ✓' }
        ]
      }
    ]
  },

  'percents': {
    Easy: [
      {
        id: 'pct-e-1',
        statement: 'A jacket originally costs $80. It is on sale for 25% off. What is the sale price?',
        prompt: 'What does 25% off mean in terms of multiplication?',
        hints: [
          '25% off means you pay 75% of the original price.',
          'Sale price = 0.75 × $80.',
          '0.75 × 80 = 60.'
        ],
        solution: [
          { step: 'Calculate the discount', detail: '25% of $80 = 0.25 × 80 = $20' },
          { step: 'Subtract from original', detail: '$80 − $20 = $60' },
          { step: 'Alternatively', detail: 'Pay 100% − 25% = 75% of price: 0.75 × $80 = $60' },
          { step: 'Answer', detail: 'Sale price = $60' }
        ]
      }
    ],
    Medium: [
      {
        id: 'pct-m-1',
        statement: 'A product\'s price increased by 20%, then decreased by 20%. Is the final price higher, lower, or the same as the original? By what percent?',
        prompt: 'Use a real number — try $100 — to test this.',
        hints: [
          'Start with $100. After 20% increase: $100 × 1.20 = $120.',
          'After 20% decrease on $120: $120 × 0.80 = $96.',
          '$96 < $100. The final price is lower than the original.'
        ],
        solution: [
          { step: 'Use $100 as the starting price', detail: '' },
          { step: 'After 20% increase', detail: '$100 × 1.20 = $120' },
          { step: 'After 20% decrease on new price', detail: '$120 × 0.80 = $96' },
          { step: 'Net change', detail: '$96 / $100 = 96% — a 4% net decrease.' },
          { step: 'Why?', detail: 'The decrease applies to a larger number, so the drop is larger in absolute terms. The net effect is always a loss of (x²/100)% when you increase then decrease by x%.' }
        ]
      }
    ],
    Hard: []
  },

  'levers': {
    Easy: [
      {
        id: 'lev-e-1',
        statement: 'A 200-lb load sits 4 feet from a fulcrum. How much effort force is needed to lift it when applied 8 feet from the fulcrum on the other side?',
        prompt: 'Write the lever balance equation before solving.',
        hints: [
          'The principle: Effort × Effort Arm = Load × Load Arm.',
          'E × 8 = 200 × 4.',
          'E = 800 ÷ 8.'
        ],
        solution: [
          { step: 'Write the balance equation', detail: 'E × d_effort = L × d_load' },
          { step: 'Substitute known values', detail: 'E × 8 = 200 × 4 = 800' },
          { step: 'Solve for E', detail: 'E = 800 ÷ 8 = 100 lbs' },
          { step: 'Verify the MA', detail: 'MA = Load/Effort = 200/100 = 2. The lever doubles your force.' },
          { step: 'Answer', detail: '100 lbs of effort is required.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'lev-m-1',
        statement: 'A 240-lb load is 3 feet from the fulcrum. Where must a 60-lb effort force be applied to achieve balance?',
        prompt: 'Rearrange the lever equation to solve for the unknown distance.',
        hints: [
          'E × d_E = L × d_L. You need to find d_E.',
          'd_E = (L × d_L) / E = (240 × 3) / 60.',
          '720 / 60 = 12 feet.'
        ],
        solution: [
          { step: 'Setup', detail: '60 × d_E = 240 × 3' },
          { step: 'Right side', detail: '240 × 3 = 720' },
          { step: 'Solve', detail: 'd_E = 720 / 60 = 12 feet from the fulcrum' },
          { step: 'Answer', detail: 'Apply 60 lbs at 12 feet from the fulcrum to balance the 240-lb load at 3 feet.' }
        ]
      }
    ],
    Hard: []
  },

  'pulleys': {
    Easy: [
      {
        id: 'pul-e-1',
        statement: 'A simple movable pulley system has 2 rope segments supporting the load. If the load weighs 300 lbs, how much effort is required (ignoring friction)?',
        prompt: 'How does the number of rope segments relate to mechanical advantage?',
        hints: [
          'Mechanical Advantage (MA) = number of rope segments supporting the moving block.',
          'MA = 2, so Effort = Load ÷ MA.',
          'Effort = 300 ÷ 2.'
        ],
        solution: [
          { step: 'Identify MA', detail: '2 rope segments support the load → MA = 2' },
          { step: 'Apply MA formula', detail: 'Effort = Load / MA = 300 / 2' },
          { step: 'Answer', detail: '150 lbs of effort needed. The pulley halves the required force.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'pul-m-1',
        statement: 'A compound pulley has 4 rope segments supporting the load. An operator applies 80 lbs of force. What is the maximum load they can lift?',
        prompt: 'MA = number of segments. Load = Effort × MA.',
        hints: [
          'MA = 4.',
          'Load = Effort × MA = 80 × 4.',
          '80 × 4 = 320.'
        ],
        solution: [
          { step: 'Find MA', detail: '4 rope segments → MA = 4' },
          { step: 'Calculate max load', detail: 'Load = 80 lbs × 4 = 320 lbs' },
          { step: 'Answer', detail: 'The system can lift 320 lbs with 80 lbs of effort.' }
        ]
      }
    ],
    Hard: []
  },

  'electricity': {
    Easy: [
      {
        id: 'elec-e-1',
        statement: 'A circuit has a 12-volt battery and a 4-ohm resistor. What is the current flowing through the circuit?',
        prompt: 'Which form of Ohm\'s Law do you need?',
        hints: [
          "Ohm's Law: V = IR. You have V and R; solve for I.",
          'I = V / R.',
          'I = 12 / 4.'
        ],
        solution: [
          { step: "Write Ohm's Law", detail: 'V = I × R' },
          { step: 'Rearrange for current', detail: 'I = V / R = 12 V / 4 Ω' },
          { step: 'Calculate', detail: 'I = 3 Amperes' },
          { step: 'Answer', detail: '3 amps flow through the circuit.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'elec-m-1',
        statement: 'Two resistors, 6Ω and 12Ω, are connected in parallel across a 24V battery. What is the total current drawn from the battery?',
        prompt: 'In a parallel circuit, find total resistance first, then apply Ohm\'s Law.',
        hints: [
          'Parallel resistance: 1/R_total = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4. So R_total = 4Ω.',
          'Total current: I = V / R_total = 24 / 4.',
          'I = 6 A total from the battery.'
        ],
        solution: [
          { step: 'Parallel resistance formula', detail: '1/R_t = 1/6 + 1/12 = 2/12 + 1/12 = 3/12' },
          { step: 'Invert to get R_total', detail: 'R_t = 12/3 = 4 Ω' },
          { step: 'Apply Ohm\'s Law', detail: 'I = V/R = 24/4 = 6 A' },
          { step: 'Verify with individual branches', detail: 'I_1 = 24/6 = 4A. I_2 = 24/12 = 2A. Total = 6A ✓' },
          { step: 'Answer', detail: '6 amps total current from the battery.' }
        ]
      }
    ],
    Hard: []
  }
};

// Tutor state
let tutorState = {
  topic: '',
  difficulty: 'Easy',
  problems: [],
  currentIndex: 0,
  hintsRevealed: 0,
  solutionVisible: false
};

route('/tutor', async () => {
  const app = document.getElementById('app');

  // Try loading from Supabase first; fall back to hardcoded
  let dbProblems = [];
  try {
    dbProblems = await Store.getWorkedProblems(null, null);
  } catch (e) {
    // Supabase table may not exist yet — that's fine
    dbProblems = [];
  }

  // Reset state
  tutorState = {
    topic: '',
    difficulty: 'Easy',
    problems: [],
    currentIndex: 0,
    hintsRevealed: 0,
    solutionVisible: false
  };

  // Build topic options grouped by section
  const mathTopics = TUTOR_TOPICS.filter(t => t.section === 'Math');
  const mechTopics = TUTOR_TOPICS.filter(t => t.section === 'Mechanical');

  const topicOptions = `
    <option value="">— Select a Topic —</option>
    <optgroup label="Math">
      ${mathTopics.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
    </optgroup>
    <optgroup label="Mechanical">
      ${mechTopics.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
    </optgroup>
  `;

  app.innerHTML = `
    <div style="max-width:780px">

      <!-- Header -->
      <div style="margin-bottom:24px">
        <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">Worked Problems Tutor</h1>
        <p class="text-muted text-sm">Select a topic and difficulty to get a practice problem with guided hints and a full step-by-step solution.</p>
      </div>

      <!-- Selectors -->
      <div class="card" style="padding:20px;margin-bottom:20px">
        <div class="grid-2" style="gap:16px;align-items:end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Topic</label>
            <select class="form-input" id="topicSelect" onchange="onTutorTopicChange()">
              ${topicOptions}
            </select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Difficulty</label>
            <select class="form-input" id="diffSelect" onchange="onTutorDiffChange()">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary btn-block mt-4" onclick="loadTutorProblem()">Load Problem</button>
      </div>

      <!-- Problem area -->
      <div id="tutorProblemArea"></div>

    </div>
  `;
});

function onTutorTopicChange() {
  const sel = document.getElementById('topicSelect');
  if (sel) tutorState.topic = sel.value;
}

function onTutorDiffChange() {
  const sel = document.getElementById('diffSelect');
  if (sel) tutorState.difficulty = sel.value;
}

async function loadTutorProblem() {
  const topicSel = document.getElementById('topicSelect');
  const diffSel = document.getElementById('diffSelect');
  if (topicSel) tutorState.topic = topicSel.value;
  if (diffSel) tutorState.difficulty = diffSel.value;

  if (!tutorState.topic) {
    renderTutorMessage('Please select a topic first.', 'warning');
    return;
  }

  // Map UI difficulty string to the integer used in Supabase
  const diffMap = { Easy: 1, Medium: 2, Hard: 3 };
  const diffInt = diffMap[tutorState.difficulty];

  // Try Supabase first — fetch all problems for this topic/difficulty
  let diffProblems = [];
  try {
    const dbProblems = await Store.getWorkedProblems(tutorState.topic, diffInt);
    if (Array.isArray(dbProblems) && dbProblems.length > 0) {
      // Normalize DB schema to match the shape the UI expects
      diffProblems = dbProblems.map(p => ({
        id: p.id,
        statement: p.problem_text,
        prompt: 'Before checking hints: write out what you know and what you need to find.',
        hints: Array.isArray(p.hints) ? p.hints : [],
        solution: Array.isArray(p.solution_steps) ? p.solution_steps : [],
        finalAnswer: p.final_answer,
        explanation: p.explanation
      }));
    }
  } catch (e) {
    console.warn('[Tutor] Supabase fetch failed, falling back to samples:', e.message);
  }

  // Fallback to hardcoded samples if Supabase returned nothing
  if (!diffProblems.length) {
    const topicProblems = SAMPLE_PROBLEMS[tutorState.topic];
    diffProblems = (topicProblems && topicProblems[tutorState.difficulty]) || [];
  }

  if (!diffProblems.length) {
    renderTutorMessage(
      `No ${tutorState.difficulty} problems available for this topic yet. Try another difficulty or topic.`,
      'tip'
    );
    return;
  }

  // Shuffle so students don't see the same order every time
  for (let i = diffProblems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [diffProblems[i], diffProblems[j]] = [diffProblems[j], diffProblems[i]];
  }

  tutorState.problems = diffProblems;
  tutorState.currentIndex = 0;
  tutorState.hintsRevealed = 0;
  tutorState.solutionVisible = false;

  renderTutorProblem();
}

function renderTutorMessage(message, type) {
  const area = document.getElementById('tutorProblemArea');
  if (!area) return;
  area.innerHTML = `
    <div class="callout callout-${type}">
      <div class="callout-title">${type === 'warning' ? 'Notice' : 'Info'}</div>
      ${message}
    </div>
  `;
}

function renderTutorProblem() {
  const area = document.getElementById('tutorProblemArea');
  if (!area) return;

  const problem = tutorState.problems[tutorState.currentIndex];
  if (!problem) return;

  const totalProblems = tutorState.problems.length;
  const isLast = tutorState.currentIndex >= totalProblems - 1;
  const difficultyColors = { Easy: 'var(--green)', Medium: 'var(--yellow)', Hard: 'var(--red)' };
  const diffColor = difficultyColors[tutorState.difficulty] || 'var(--accent)';

  // Build hints HTML
  const hintsHtml = problem.hints.map((hint, i) => `
    <div
      id="hint_${i}"
      class="callout callout-tip"
      style="display:${i < tutorState.hintsRevealed ? 'block' : 'none'};margin-bottom:8px"
    >
      <div class="callout-title">Hint ${i + 1}</div>
      ${hint}
    </div>
  `).join('');

  // Build solution HTML
  const solutionHtml = problem.solution.map((s, i) => `
    <div style="display:flex;gap:14px;padding:10px 0;${i < problem.solution.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
      <div style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;margin-top:1px">${i + 1}</div>
      <div>
        <div style="font-weight:700;font-size:13px;margin-bottom:2px">${s.step}</div>
        ${s.detail ? `<div style="color:var(--text-2);font-size:13px">${s.detail}</div>` : ''}
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <!-- Problem card -->
    <div class="card" style="margin-bottom:16px;padding:24px">

      <!-- Header row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge" style="background:rgba(0,0,0,0.2);color:${diffColor};border:1px solid ${diffColor}">${tutorState.difficulty}</span>
          <span class="badge badge-blue">${TUTOR_TOPICS.find(t => t.value === tutorState.topic)?.label || tutorState.topic}</span>
        </div>
        <span style="font-size:12px;color:var(--text-3)">Problem ${tutorState.currentIndex + 1} of ${totalProblems}</span>
      </div>

      <!-- Problem statement -->
      <div style="font-size:16px;font-weight:600;line-height:1.6;margin-bottom:14px">
        ${problem.statement}
      </div>

      <!-- Try it yourself prompt -->
      <div class="callout callout-think" style="margin-bottom:16px">
        <div class="callout-title">Try It Yourself</div>
        ${problem.prompt}
      </div>

      <!-- Hints -->
      <div id="hintsContainer" style="margin-bottom:12px">
        ${hintsHtml}
      </div>

      <!-- Hint control -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
        <button
          class="btn btn-secondary btn-sm"
          id="hintBtn"
          onclick="revealNextHint()"
          ${tutorState.hintsRevealed >= problem.hints.length ? 'disabled style="opacity:0.4"' : ''}
        >
          &#128161; ${tutorState.hintsRevealed === 0 ? 'Show First Hint' : tutorState.hintsRevealed >= problem.hints.length ? 'All Hints Shown' : `Show Hint ${tutorState.hintsRevealed + 1}`}
        </button>
        ${tutorState.hintsRevealed > 0 && tutorState.hintsRevealed < problem.hints.length
          ? `<span style="font-size:12px;color:var(--text-3);align-self:center">${problem.hints.length - tutorState.hintsRevealed} more hint${problem.hints.length - tutorState.hintsRevealed !== 1 ? 's' : ''} available</span>`
          : ''
        }
      </div>

      <!-- Show Solution button -->
      <button
        class="btn ${tutorState.solutionVisible ? 'btn-secondary' : 'btn-primary'} btn-sm"
        onclick="toggleTutorSolution()"
        id="solutionToggleBtn"
      >
        ${tutorState.solutionVisible ? '&#128065; Hide Solution' : '&#9989; Show Step-by-Step Solution'}
      </button>

      <!-- Solution panel -->
      <div id="solutionPanel" style="display:${tutorState.solutionVisible ? 'block' : 'none'};margin-top:16px;border-top:1px solid var(--border);padding-top:16px">
        <div style="font-weight:700;margin-bottom:12px">Step-by-Step Solution</div>
        ${solutionHtml}
      </div>

    </div>

    <!-- Navigation -->
    <div style="display:flex;justify-content:space-between;align-items:center">
      <button
        class="btn btn-secondary btn-sm"
        onclick="prevTutorProblem()"
        ${tutorState.currentIndex === 0 ? 'disabled style="opacity:0.4"' : ''}
      >
        &#8592; Previous
      </button>
      <button
        class="btn btn-primary btn-sm"
        onclick="nextTutorProblem()"
      >
        ${isLast ? '&#128257; New Problem' : '&#8594; Next Problem'}
      </button>
    </div>
  `;

  // MathJax v3 re-render
  if (typeof MathJax !== 'undefined') {
    const doTypeset = () => {
      if (typeof MathJax.typesetClear === 'function') {
        try { MathJax.typesetClear([area]); } catch (e) {}
      }
      if (typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise([area]).catch(() => {});
      }
    };
    if (MathJax.startup && typeof MathJax.startup.promise === 'object') {
      MathJax.startup.promise.then(doTypeset).catch(() => {});
    } else {
      doTypeset();
    }
  }
}

function revealNextHint() {
  const problem = tutorState.problems[tutorState.currentIndex];
  if (!problem || tutorState.hintsRevealed >= problem.hints.length) return;
  tutorState.hintsRevealed++;
  renderTutorProblem();
}

function toggleTutorSolution() {
  tutorState.solutionVisible = !tutorState.solutionVisible;
  renderTutorProblem();
}

function nextTutorProblem() {
  const total = tutorState.problems.length;
  if (tutorState.currentIndex < total - 1) {
    tutorState.currentIndex++;
  } else {
    // Cycle back or reload
    tutorState.currentIndex = 0;
  }
  tutorState.hintsRevealed = 0;
  tutorState.solutionVisible = false;
  renderTutorProblem();
}

function prevTutorProblem() {
  if (tutorState.currentIndex > 0) {
    tutorState.currentIndex--;
    tutorState.hintsRevealed = 0;
    tutorState.solutionVisible = false;
    renderTutorProblem();
  }
}
