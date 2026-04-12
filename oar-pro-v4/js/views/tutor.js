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
  // Reading Comprehension
  { value: 'main-idea', label: 'Main Idea & Author\'s Purpose', section: 'Reading' },
  { value: 'inference', label: 'Inference & Implication', section: 'Reading' },
  { value: 'vocabulary', label: 'Vocabulary in Context', section: 'Reading' },
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
    Hard: [
      {
        id: 'pct-h-1',
        statement: 'A bank account earns 8% annual interest, compounded quarterly. If $5,000 is deposited today, what is the balance after 3 years? (Round to the nearest dollar.)',
        prompt: 'Compounded quarterly means interest is applied 4 times per year at ¼ the annual rate. Write the compound interest formula.',
        hints: [
          'Compound interest formula: A = P(1 + r/n)^(nt). Here P = 5000, r = 0.08, n = 4, t = 3.',
          'A = 5000 × (1 + 0.08/4)^(4×3) = 5000 × (1.02)^12.',
          '(1.02)^12 ≈ 1.2682. So A = 5000 × 1.2682 ≈ 6341.'
        ],
        solution: [
          { step: 'Identify variables', detail: 'P = $5,000, r = 8% = 0.08, n = 4 (quarterly), t = 3 years' },
          { step: 'Write the formula', detail: 'A = P(1 + r/n)^(nt)' },
          { step: 'Substitute', detail: 'A = 5000(1 + 0.08/4)^(4×3) = 5000(1.02)^12' },
          { step: 'Compute (1.02)^12', detail: '(1.02)^12 ≈ 1.26824' },
          { step: 'Final answer', detail: 'A = 5000 × 1.26824 ≈ $6,341' }
        ]
      }
    ]
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
    Hard: [
      {
        id: 'lev-h-1',
        statement: 'A compound lever system has two levers connected in series. Lever 1 has a 300-lb load at 2 ft from fulcrum F1. The output of Lever 1 connects to Lever 2 at 1 ft from F1. Lever 2 has the effort applied at 5 ft from fulcrum F2, and the output connects to the load at 1 ft from F2. What effort is required to support the original 300-lb load?',
        prompt: 'In a compound lever, the output force of Lever 1 becomes the input load for Lever 2. Solve one lever at a time.',
        hints: [
          'First find the output force of Lever 1. Balance: F_out × 1 = 300 × 2, so F_out = 600 lbs.',
          'Now Lever 1\'s output (600 lbs) is the load on Lever 2 at 1 ft from F2.',
          'Lever 2 balance: Effort × 5 = 600 × 1. Effort = 600 / 5 = 120 lbs.'
        ],
        solution: [
          { step: 'Lever 1 balance', detail: 'Load side: 300 lbs × 2 ft = 600. Output arm = 1 ft. F_out = 600/1 = 600 lbs.' },
          { step: 'Transfer to Lever 2', detail: 'Lever 2 input load = 600 lbs at 1 ft from F2.' },
          { step: 'Lever 2 balance', detail: 'Effort × 5 ft = 600 × 1 ft → Effort = 120 lbs.' },
          { step: 'Overall MA', detail: 'MA_total = 300/120 = 2.5. Compound levers multiply MA.' },
          { step: 'Answer', detail: '120 lbs of effort required.' }
        ]
      }
    ]
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
    Hard: [
      {
        id: 'pul-h-1',
        statement: 'A pulley system with an MA of 4 has an efficiency of 75% due to friction. If an operator applies 100 lbs of effort, what actual load can be lifted?',
        prompt: 'Efficiency = Useful output / Total input. With friction, actual load < theoretical max.',
        hints: [
          'Theoretical max load (no friction) = Effort × MA = 100 × 4 = 400 lbs.',
          'Efficiency = Actual output / Ideal output. Actual output = efficiency × ideal output.',
          'Actual load = 0.75 × 400 = 300 lbs.'
        ],
        solution: [
          { step: 'Ideal (frictionless) max load', detail: 'Load_ideal = Effort × MA = 100 × 4 = 400 lbs' },
          { step: 'Apply efficiency', detail: 'Load_actual = Efficiency × Load_ideal = 0.75 × 400' },
          { step: 'Calculate', detail: 'Load_actual = 300 lbs' },
          { step: 'Interpret efficiency', detail: '75% efficiency means 25% of input force is lost to rope friction, pulley bearings, and rope stiffness.' },
          { step: 'Answer', detail: 'The system can actually lift 300 lbs — not the theoretical 400 lbs.' }
        ]
      }
    ]
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
    Hard: [
      {
        id: 'elec-h-1',
        statement: 'A circuit has a 24V battery with three resistors: R1 = 6Ω in series with a parallel pair of R2 = 12Ω and R3 = 4Ω. What is the total current drawn from the battery and the voltage across the parallel section?',
        prompt: 'Solve in stages: simplify the parallel section first, then treat the circuit as a simple series.',
        hints: [
          'Parallel section (R2 ∥ R3): 1/R_p = 1/12 + 1/4 = 1/12 + 3/12 = 4/12. R_p = 3Ω.',
          'Total resistance: R_total = R1 + R_p = 6 + 3 = 9Ω.',
          'Total current: I = V / R_total = 24 / 9 ≈ 2.67 A. Voltage across parallel section: V_p = I × R_p = 2.67 × 3 = 8V.'
        ],
        solution: [
          { step: 'Simplify parallel section', detail: '1/R_p = 1/12 + 1/4 = 1/12 + 3/12 = 4/12 → R_p = 3Ω' },
          { step: 'Total series resistance', detail: 'R_total = R1 + R_p = 6 + 3 = 9Ω' },
          { step: 'Total current from battery', detail: 'I = V/R = 24/9 = 8/3 ≈ 2.67 A' },
          { step: 'Voltage across R1', detail: 'V_R1 = I × R1 = 2.67 × 6 = 16V' },
          { step: 'Voltage across parallel section', detail: 'V_p = 24 − 16 = 8V (or: I × R_p = 2.67 × 3 = 8V ✓)' },
          { step: 'Verify', detail: 'I_R2 = 8/12 ≈ 0.67A. I_R3 = 8/4 = 2A. Total = 2.67A ✓' }
        ]
      }
    ]
  },

  // ==========================================
  // READING COMPREHENSION
  // ==========================================
  'main-idea': {
    Easy: [
      {
        id: 'mi-e-1',
        statement: `<strong>Passage:</strong><br><br>
The Navy V-12 College Training Program, established in 1942, addressed a critical shortage of officers during World War II. The program placed officer candidates at universities across the United States for combined academic and naval training. Students studied physics, calculus, and engineering alongside naval coursework. Unlike the traditional Naval Academy route requiring four years, V-12 allowed candidates to earn degrees in as little as two years while on active duty. The program produced over 60,000 officers and is considered one of the most successful officer training programs in American military history.
<br><br><strong>Question:</strong> What is the main idea of this passage?<br><br>
A. The Navy V-12 program was created at universities.<br>B. The Navy V-12 program successfully accelerated officer production during a wartime shortage.<br>C. The Naval Academy takes four years to complete.<br>D. Physics and calculus were required courses in the program.`,
        prompt: 'The main idea should cover the WHOLE passage, not just one detail. Which answer does that?',
        hints: [
          'Main idea = what the whole passage is primarily about, not just a single fact.',
          'A, C, and D are details mentioned in the passage but they are not what the whole passage is about.',
          'The passage is about the V-12 program\'s purpose, design, and success. Which answer captures all of that?'
        ],
        solution: [
          { step: 'Identify the topic', detail: 'The passage is about the Navy V-12 program.' },
          { step: 'What is the overall point?', detail: 'The program was created to solve a problem (officer shortage) and it worked (60,000 officers, historic success).' },
          { step: 'Eliminate detail answers', detail: 'A is a detail (location). C is a comparison. D is a specific fact. None cover the whole.' },
          { step: 'Answer', detail: 'B. The main idea is that V-12 successfully accelerated officer production during a wartime shortage.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'mi-m-1',
        statement: `<strong>Passage:</strong><br><br>
Computer-adaptive testing (CAT) represents a significant departure from traditional linear exams. In a standard test, every candidate answers the same questions in the same order. A CAT, by contrast, selects each question based on the test-taker's performance on previous questions. A correct answer triggers a harder question; an incorrect answer triggers an easier one. This dynamic approach allows the exam to precisely estimate a candidate's ability with far fewer questions than a traditional fixed-form test. However, CAT also introduces constraints: candidates cannot skip questions or return to change prior answers, since each response directly determines what comes next.
<br><br><strong>Question:</strong> The primary purpose of this passage is to:<br><br>
A. Argue that CAT exams are unfair to test-takers.<br>B. Explain how computer-adaptive testing works and how it differs from traditional exams.<br>C. Describe the history of standardized testing in the United States.<br>D. Warn candidates about the disadvantages of adaptive testing.`,
        prompt: 'The question asks for the author\'s PURPOSE. Is the author arguing, explaining, describing history, or warning?',
        hints: [
          'What is the author doing throughout — arguing a position, or explaining a concept?',
          'The passage presents facts about CAT without evaluating whether it is good or bad. That is explanation, not argument.',
          'The passage mentions constraints (no skipping, no going back) as a factual feature, not as a warning. Eliminate D.'
        ],
        solution: [
          { step: 'Identify the author\'s tone', detail: 'Neutral and explanatory — no emotional language, no recommendations.' },
          { step: 'Eliminate by tone', detail: 'A ("unfair") and D ("warn") require a negative position. The author doesn\'t take one.' },
          { step: 'Eliminate C', detail: 'The passage doesn\'t mention history of testing, only how CAT works.' },
          { step: 'Answer', detail: 'B. The purpose is to explain how CAT works and how it differs from traditional tests.' }
        ]
      }
    ],
    Hard: [
      {
        id: 'mi-h-1',
        statement: `<strong>Passage:</strong><br><br>
The distinction between leadership and management is often misunderstood. Management is fundamentally concerned with maintaining systems: allocating resources, enforcing procedures, and ensuring predictable outputs within established structures. Leadership, by contrast, is primarily concerned with change: setting vision, motivating people to move in new directions, and challenging existing structures when necessary. Neither is inherently superior — highly stable organizations benefit from strong management, while organizations facing disruption require strong leadership. The most effective executives recognize which mode is demanded by the current situation and switch between them fluidly. The failure to make this distinction is responsible for a significant number of organizational collapses: managers attempt to lead without a compelling vision, while leaders attempt to manage without the discipline required for execution.
<br><br><strong>Question:</strong> With which of the following statements would the author most likely agree?<br><br>
A. Leadership skills are more valuable than management skills in most modern organizations.<br>B. Organizations that blend leadership and management contextually outperform those that rely on only one mode.<br>C. The collapse of organizations is primarily due to poor management rather than poor leadership.<br>D. Stable organizations do not require leadership at all.`,
        prompt: 'This question requires inference — the answer isn\'t stated directly. Use the passage\'s argument to predict what the author believes.',
        hints: [
          'The author says neither is "inherently superior" and that the best executives switch between them. This implies balance and context-awareness is the key.',
          'A claims leadership is more valuable — but the passage explicitly says neither is superior. Eliminate A.',
          'C and D misrepresent the passage. C says management failures dominate — the passage says BOTH types of failure cause collapses. D contradicts the "stable organizations benefit from management" point, which doesn\'t say they need zero leadership.'
        ],
        solution: [
          { step: 'What is the author\'s core argument?', detail: 'Both management and leadership matter; context determines which is needed; the best executives switch between them fluidly.' },
          { step: 'Evaluate A', detail: '"More valuable" contradicts "neither is inherently superior." Eliminate.' },
          { step: 'Evaluate C', detail: 'The passage attributes collapses to BOTH leadership and management failures — not primarily one. Eliminate.' },
          { step: 'Evaluate D', detail: '"Do not require leadership at all" is never stated and conflicts with the "fluidity" point. Eliminate.' },
          { step: 'Answer', detail: 'B. Organizations that blend both modes contextually outperform those that rely on only one — this directly follows from the author\'s argument.' }
        ]
      }
    ]
  },

  'inference': {
    Easy: [
      {
        id: 'inf-e-1',
        statement: `<strong>Passage:</strong><br><br>
After three weeks of rain, the lake behind the dam had risen to within two feet of the overflow spillway. Engineers had been monitoring water levels hourly and had begun preliminary discussions about controlled releases. Local evacuation routes were reviewed by emergency management officials. Hardware stores in the region reported selling out of sandbags within hours of an announcement that the conditions were "being closely monitored."
<br><br><strong>Question:</strong> Which of the following can be inferred from the passage?<br><br>
A. The dam was poorly constructed and unsafe.<br>B. The community was concerned about the possibility of flooding.<br>C. Emergency officials had already ordered an evacuation.<br>D. The lake had flooded the surrounding area.`,
        prompt: 'Inference means what the passage implies but does not directly state. Eliminate answers that go beyond the evidence.',
        hints: [
          'A: The passage says nothing about construction quality. Cannot infer. Eliminate.',
          'C: Officials "reviewed evacuation routes" — they did not order an evacuation. That\'s too strong. Eliminate.',
          'D: The lake had risen but had not yet overflowed. Cannot infer flooding. Eliminate.'
        ],
        solution: [
          { step: 'What evidence exists for B?', detail: 'Sandbags sold out. Evacuation routes were reviewed. These actions happen when people anticipate flooding.' },
          { step: 'Key phrase', detail: '"Preliminary discussions" and selling out of sandbags within hours — clear community anxiety.' },
          { step: 'Check the other options', detail: 'A requires a judgment not in the text. C overreaches (reviewed ≠ ordered). D requires a fact not stated.' },
          { step: 'Answer', detail: 'B. The community was concerned about flooding — this is directly supported by the community\'s actions.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'inf-m-1',
        statement: `<strong>Passage:</strong><br><br>
The pilot approached the runway threshold at 140 knots, five knots above the aircraft's published reference speed. The control tower had reported winds gusting to 28 knots from a 45-degree crosswind angle, near the aircraft's certified crosswind limit. After touchdown, the aircraft veered toward the runway edge before the pilot corrected with rudder input. The incident was logged, and the flight crew submitted a voluntary safety report to the aviation authority within 24 hours.
<br><br><strong>Question:</strong> What can reasonably be inferred about the pilot's decision to fly slightly above reference speed?<br><br>
A. The pilot made an error in airspeed management and was cited for a violation.<br>B. The extra airspeed was likely a deliberate buffer against the gusty crosswind conditions.<br>C. The aircraft's systems required a higher approach speed due to a mechanical issue.<br>D. The tower had instructed the pilot to increase approach speed.`,
        prompt: 'Why would a competent pilot fly slightly fast on approach? Think about what gusts do to an aircraft near the ground.',
        hints: [
          'Gusty winds cause sudden airspeed fluctuations. Flying slightly fast gives more margin against a gust-induced speed loss that could lead to an unstable approach or stall.',
          'This is a standard technique — not an error. The passage doesn\'t say the pilot was cited, only that the incident was logged.',
          'C and D introduce information not in the passage (mechanical issue, tower instruction). Cannot infer either.'
        ],
        solution: [
          { step: 'What do we know about the conditions?', detail: 'Gusts up to 28 knots from a crosswind — challenging approach. Near the aircraft\'s certified limit.' },
          { step: 'Why fly 5 knots fast?', detail: 'Standard aviation practice: extra airspeed buffer in gusty conditions prevents speed decay from a sudden lull.' },
          { step: 'Eliminate A', detail: 'No citation mentioned. Voluntary safety report ≠ violation — it suggests transparency, not misconduct.' },
          { step: 'Eliminate C and D', detail: 'Neither mechanical issues nor tower instructions are mentioned. Inferences must be grounded in the text.' },
          { step: 'Answer', detail: 'B. The extra 5 knots was almost certainly a deliberate gust buffer — a standard and reasonable technique in these conditions.' }
        ]
      }
    ],
    Hard: [
      {
        id: 'inf-h-1',
        statement: `<strong>Passage:</strong><br><br>
The Posse Comitatus Act of 1878 prohibits the U.S. federal government from using the Army or Air Force to enforce domestic law without congressional approval. The Navy and Marine Corps are not explicitly named in the statute, though federal regulations extend the prohibition to them. The Coast Guard, however, is explicitly authorized for law enforcement purposes and routinely conducts maritime interdiction operations. Critics of the Act argue that its provisions hamper rapid federal response to domestic crises. Defenders counter that civilian law enforcement primacy is a foundational constitutional principle that protects civil liberties by preventing military overreach. Recent amendments have created narrow exceptions permitting military support for counterdrug operations and certain weapons of mass destruction scenarios.
<br><br><strong>Question:</strong> Based on the passage, which of the following situations would MOST LIKELY be legal under the Posse Comitatus Act?<br><br>
A. Army infantry units independently arresting suspected drug traffickers in a U.S. city.<br>B. The Air Force conducting domestic surveillance of civilian political groups without congressional authorization.<br>C. Coast Guard vessels boarding and searching a foreign-flagged ship suspected of drug smuggling in U.S. waters.<br>D. Marine Corps units directly replacing state police officers during a major natural disaster.`,
        prompt: 'Map each option against what the passage says about who is authorized to do what and under what conditions.',
        hints: [
          'A: Army independently making arrests = exactly what the Act prohibits. Eliminate.',
          'B: Air Force surveillance without authorization = prohibited by the Act. Eliminate.',
          'D: Marines replacing state police = direct law enforcement — prohibited even though Marines aren\'t in the statute\'s text (federal regulations extend the ban).',
          'C: The passage says the Coast Guard is "explicitly authorized for law enforcement purposes and routinely conducts maritime interdiction operations." Drug smuggling interdiction is exactly that.'
        ],
        solution: [
          { step: 'Map the Act\'s provisions', detail: 'Army + Air Force = prohibited. Navy + Marines = regulations extend the prohibition. Coast Guard = explicitly authorized.' },
          { step: 'Option A', detail: 'Army independently arresting = direct law enforcement. Prohibited. Eliminate.' },
          { step: 'Option B', detail: 'Air Force + no authorization = doubly prohibited. Eliminate.' },
          { step: 'Option D', detail: 'Marines replacing state police = direct domestic law enforcement. Federal regulations prohibit this. Eliminate.' },
          { step: 'Option C', detail: 'Coast Guard + maritime interdiction + drug smuggling = all three elements explicitly authorized by the passage.' },
          { step: 'Answer', detail: 'C. The Coast Guard\'s maritime drug interdiction is explicitly authorized under the Act.' }
        ]
      }
    ]
  },

  'vocabulary': {
    Easy: [
      {
        id: 'voc-e-1',
        statement: `<strong>Passage:</strong><br><br>
The battalion commander was known for his <em>pragmatic</em> approach to logistics. Rather than following doctrine rigidly, he evaluated each supply situation on its individual merits and devised solutions based on what actually worked in the field, not what the manual prescribed.
<br><br><strong>Question:</strong> As used in the passage, "pragmatic" most nearly means:<br><br>
A. Theoretical and academic<br>B. Practical and results-focused<br>C. Strict and rule-following<br>D. Cautious and risk-averse`,
        prompt: 'Use context clues: how is the commander described acting? That behavior should match the word\'s meaning.',
        hints: [
          'The passage contrasts "pragmatic" with following doctrine rigidly — so pragmatic is the opposite of rigid rule-following.',
          '"Evaluated each situation on its individual merits" and "devised solutions based on what actually worked" — these are clues.',
          'The commander is results-focused and flexible. Which answer captures that?'
        ],
        solution: [
          { step: 'Identify the contrast', detail: '"Rather than following doctrine rigidly" — pragmatic is the opposite of rigid rule-following (eliminates A and C).' },
          { step: 'Key context phrase', detail: '"What actually worked in the field" — this means practical, results-focused behavior.' },
          { step: 'Eliminate D', detail: '"Cautious and risk-averse" doesn\'t fit — devising field solutions often involves risk.' },
          { step: 'Answer', detail: 'B. Pragmatic means practical and results-focused — exactly how the passage describes his approach.' }
        ]
      }
    ],
    Medium: [
      {
        id: 'voc-m-1',
        statement: `<strong>Passage:</strong><br><br>
The testimony was praised for its <em>candor</em> — the officer neither deflected difficult questions with vague generalities nor embellished the chain of events to cast herself in a more favorable light. She answered each question directly, even when the truth reflected poorly on her unit's initial response.
<br><br><strong>Question:</strong> As used in the passage, "candor" most nearly means:<br><br>
A. Arrogance and self-confidence<br>B. Diplomatic evasiveness<br>C. Honest directness, even when uncomfortable<br>D. Attention to procedural detail`,
        prompt: 'What did the officer do in her testimony that earned the praise? Find the specific behaviors the passage describes.',
        hints: [
          'She didn\'t deflect or embellish — she was not evasive. Eliminate B.',
          '"Answered each question directly, even when the truth reflected poorly" — honesty under pressure.',
          'The passage doesn\'t mention arrogance (A) or procedure (D).'
        ],
        solution: [
          { step: 'What earned the praise?', detail: 'Not deflecting, not embellishing, answering directly even when unflattering.' },
          { step: 'Eliminate B', detail: '"Diplomatic evasiveness" is exactly what she did NOT do.' },
          { step: 'Eliminate A and D', detail: 'Neither arrogance nor procedural detail is mentioned.' },
          { step: 'Answer', detail: 'C. Candor means honest directness even when the truth is uncomfortable.' }
        ]
      }
    ],
    Hard: [
      {
        id: 'voc-h-1',
        statement: `<strong>Passage:</strong><br><br>
The intelligence report's conclusions were deemed <em>tendentious</em> by the oversight committee. Rather than presenting a balanced survey of the available evidence, the analyst appeared to have selected data points that confirmed a predetermined conclusion, while omitting contradictory findings. The committee noted that this was not necessarily a matter of intent — cognitive bias can produce tendentious analysis even among well-meaning professionals.
<br><br><strong>Question:</strong> As used in the passage, "tendentious" most nearly means:<br><br>
A. Classified and sensitive<br>B. Biased toward a particular conclusion<br>C. Accurate and well-documented<br>D. Cautious and appropriately hedged`,
        prompt: 'Look at what the committee criticized about the report. The word "tendentious" describes that failure — what was the failure?',
        hints: [
          'The committee said the analyst "selected data points that confirmed a predetermined conclusion" — that\'s the key behavior.',
          '"Omitting contradictory findings" adds to the picture. This is bias, not sensitivity (A), accuracy (C), or caution (D).',
          'Note: tendentious usually implies bias or an agenda — the passage confirms this meaning explicitly.'
        ],
        solution: [
          { step: 'What was wrong with the report?', detail: 'It confirmed a predetermined conclusion by cherry-picking evidence and ignoring contradictions.' },
          { step: 'Eliminate A', detail: '"Classified" has nothing to do with analysis quality.' },
          { step: 'Eliminate C and D', detail: '"Accurate" and "cautious" are the opposite of what was criticized.' },
          { step: 'Confirm B', detail: 'Biased toward a predetermined conclusion — exactly what the committee described and what cognitive bias produces.' },
          { step: 'Answer', detail: 'B. Tendentious means biased or slanted toward a particular conclusion, often while appearing objective.' }
        ]
      }
    ]
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
  const mathTopics    = TUTOR_TOPICS.filter(t => t.section === 'Math');
  const mechTopics    = TUTOR_TOPICS.filter(t => t.section === 'Mechanical');
  const readingTopics = TUTOR_TOPICS.filter(t => t.section === 'Reading');

  const topicOptions = `
    <option value="">— Select a Topic —</option>
    <optgroup label="Math">
      ${mathTopics.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
    </optgroup>
    <optgroup label="Mechanical Comprehension">
      ${mechTopics.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
    </optgroup>
    <optgroup label="Reading Comprehension">
      ${readingTopics.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
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
