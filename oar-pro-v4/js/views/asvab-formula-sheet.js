// OAR Pro v4 — ASVAB Formula Reference Sheet (Free Preview)
// Route: #/asvab-formulas
// Public. Free: Arithmetic + Algebra sections (fully rendered with MathJax).
// Blurred/gated: Geometry, Word Problem Formulas, Electronics Formulas.
// Upgrade CTA: handleTestCheckoutClick(btn, 'ASVAB')
// — Benjamin Rodriguez

const ASVAB_FORMULA_DATA = [
  {
    section: 'Arithmetic',
    free: true,
    icon: '➕',
    formulas: [
      {
        name: 'Order of Operations (PEMDAS)',
        latex: '\\text{P} \\rightarrow \\text{E} \\rightarrow \\text{MD} \\rightarrow \\text{AS}',
        note: 'Parentheses first, then Exponents, then Multiply/Divide left-to-right, then Add/Subtract left-to-right. Never skip steps on multi-operation ASVAB problems.'
      },
      {
        name: 'Percent Formula',
        latex: '\\text{Percent} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100',
        note: 'Use when the question asks "what percent is X of Y?" Divide, then multiply by 100.'
      },
      {
        name: 'Percent Of',
        latex: 'X\\% \\text{ of } Y = \\frac{X}{100} \\times Y',
        note: 'Use when asked to find a portion. Example: 15% of 200 = 0.15 × 200 = 30.'
      },
      {
        name: 'Average (Mean)',
        latex: '\\text{Average} = \\frac{\\text{Sum of values}}{\\text{Number of values}}',
        note: 'Add all values, then divide by how many there are. Appears in nearly every AR section.'
      },
      {
        name: 'Ratio / Proportion (Cross-Multiply)',
        latex: '\\frac{a}{b} = \\frac{c}{d} \\Rightarrow ad = bc',
        note: 'If two ratios are equal, cross-multiplying gives you the missing value. Solve for one variable.'
      },
      {
        name: 'Distance Formula',
        latex: 'D = R \\times T',
        note: 'Distance = Rate × Time. Rearrange to solve for any variable: R = D/T, T = D/R. Common on AR word problems.'
      },
    ]
  },
  {
    section: 'Algebra',
    free: true,
    icon: '📐',
    formulas: [
      {
        name: 'Solving Linear Equations',
        latex: '\\text{Isolate the variable — same operation on both sides}',
        note: 'Whatever you do to one side, do to the other. Work backwards: undo addition/subtraction first, then multiply/divide.'
      },
      {
        name: 'Slope of a Line',
        latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
        note: '"Rise over run." Positive slope goes up left-to-right, negative goes down. A horizontal line has slope 0; vertical is undefined.'
      },
      {
        name: 'Quadratic Formula',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        note: 'Solves ax² + bx + c = 0 for x. If b²−4ac > 0: two real solutions. = 0: one solution. < 0: no real solutions.'
      },
      {
        name: 'Exponent Rules — Product',
        latex: 'x^a \\cdot x^b = x^{a+b}',
        note: 'Same base, multiply → add exponents. Example: x³ · x⁴ = x⁷.'
      },
      {
        name: 'Exponent Rules — Quotient',
        latex: '\\frac{x^a}{x^b} = x^{a-b}',
        note: 'Same base, divide → subtract exponents. Example: x⁵ ÷ x² = x³.'
      },
      {
        name: 'Exponent Rules — Power',
        latex: '(x^a)^b = x^{ab}',
        note: 'Power of a power — multiply the exponents. Example: (x²)³ = x⁶.'
      },
      {
        name: 'Zero and Negative Exponents',
        latex: 'x^0 = 1 \\quad \\text{and} \\quad x^{-n} = \\frac{1}{x^n}',
        note: 'Anything to the power of zero = 1. Negative exponents flip to the denominator: x⁻² = 1/x².'
      },
    ]
  },
  {
    section: 'Geometry',
    free: false,
    icon: '📏',
    formulas: [
      { name: 'Area of a Triangle',    latex: 'A = \\frac{1}{2}bh',                        note: 'Half base times height.' },
      { name: 'Pythagorean Theorem',   latex: 'a^2 + b^2 = c^2',                           note: 'Right triangle only. c is the hypotenuse.' },
      { name: 'Area of a Circle',      latex: 'A = \\pi r^2',                               note: 'r is the radius.' },
      { name: 'Circumference',         latex: 'C = 2\\pi r',                               note: 'Distance around the circle.' },
      { name: 'Volume of a Cylinder',  latex: 'V = \\pi r^2 h',                            note: 'Area of circular base times height.' },
      { name: 'Volume of a Box',       latex: 'V = l \\times w \\times h',                 note: 'Multiply the three dimensions.' },
    ]
  },
  {
    section: 'Word Problem Formulas',
    free: false,
    icon: '📝',
    formulas: [
      { name: 'Work Rate Formula',       latex: '\\text{Work} = \\text{Rate} \\times \\text{Time}',                  note: 'Combined work: 1/R₁ + 1/R₂ = 1/T.' },
      { name: 'Simple Interest',         latex: 'I = P \\times r \\times t',                                          note: 'Interest = Principal × rate × time.' },
      { name: 'Mixture Problems',        latex: 'c_1 v_1 + c_2 v_2 = c_3(v_1 + v_2)',                                note: 'Concentration × Volume = total mixture.' },
      { name: 'Consecutive Integers',    latex: 'n,\\ n+1,\\ n+2,\\ \\ldots',                                        note: 'Set up an equation and solve for n.' },
    ]
  },
  {
    section: 'Electronics Formulas',
    free: false,
    icon: '⚡',
    formulas: [
      { name: "Ohm's Law",              latex: 'V = IR',                                      note: 'Voltage = Current × Resistance.' },
      { name: 'Power Formula',          latex: 'P = IV = I^2R = \\frac{V^2}{R}',             note: 'Power in watts from any two known quantities.' },
      { name: 'Series Resistance',      latex: 'R_T = R_1 + R_2 + R_3',                      note: 'Resistors in series simply add up.' },
      { name: 'Parallel Resistance',    latex: '\\frac{1}{R_T} = \\frac{1}{R_1} + \\frac{1}{R_2}', note: 'Parallel circuit total resistance is always less than smallest branch.' },
    ]
  },
];

route('/asvab-formulas', () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  const freeSections   = ASVAB_FORMULA_DATA.filter(s => s.free);
  const lockedSections = ASVAB_FORMULA_DATA.filter(s => !s.free);
  const freeCount   = freeSections.reduce((n, s)  => n + s.formulas.length, 0);
  const lockedCount = lockedSections.reduce((n, s) => n + s.formulas.length, 0);

  app.innerHTML = `
    <!-- Top bar -->
    <div style="position:sticky;top:0;z-index:50;background:var(--bg);border-bottom:1px solid var(--border);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:20px">
        <a href="#/" style="font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:15px;color:var(--text);text-decoration:none">OAR <span style="color:var(--accent)">Pro</span></a>
        <span style="font-size:12px;color:var(--text-3)"><span style="color:var(--text-2);font-weight:700">${freeCount}</span> of ${freeCount + lockedCount} formulas free</span>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        <a href="#/asvab-diagnostic" style="font-size:13px;color:var(--text-3);text-decoration:none">← Free Diagnostic</a>
        <button class="btn btn-primary btn-sm" onclick="handleTestCheckoutClick(this,'ASVAB')">Get Full Access — $47 →</button>
      </div>
    </div>

    <!-- Body -->
    <div style="max-width:860px;margin:0 auto;padding:40px 24px 80px">

      <!-- Header -->
      <div style="text-align:center;margin-bottom:36px">
        <div style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:14px">Free Reference</div>
        <h1 style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:800;margin-bottom:10px;letter-spacing:-.025em">ASVAB Math Formula Sheet</h1>
        <p style="color:var(--text-2);font-size:14px;max-width:520px;margin:0 auto">
          Arithmetic and Algebra formulas are fully unlocked. Geometry, Word Problem Formulas,
          and Electronics Formulas unlock with ASVAB access.
        </p>
      </div>

      <!-- Free sections -->
      ${freeSections.map(sec => `
        <div style="margin-bottom:36px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">${sec.icon} ${sec.section}</span>
            <span style="font-size:10px;font-weight:700;background:rgba(59,130,246,.1);color:#60a5fa;border:1px solid rgba(59,130,246,.2);padding:2px 8px;border-radius:999px">FREE</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${sec.formulas.map(f => `
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 20px">
                <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:10px">${f.name}</div>
                <div class="formula-latex" style="font-size:15px;color:var(--accent);margin-bottom:8px;overflow-x:auto">\\(${f.latex}\\)</div>
                ${f.note ? `<div style="font-size:12px;color:var(--text-3);line-height:1.5">${f.note}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <!-- Locked sections (blurred) -->
      <div style="position:relative;margin-bottom:36px">
        <div style="filter:blur(5px);pointer-events:none;user-select:none">
          ${lockedSections.map(sec => `
            <div style="margin-bottom:32px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
                <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">${sec.icon} ${sec.section}</span>
                <span style="font-size:10px;font-weight:700;background:var(--surface-2);color:var(--text-3);border:1px solid var(--border);padding:2px 8px;border-radius:999px">LOCKED</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px">
                ${sec.formulas.map(f => `
                  <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 20px">
                    <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:10px">${f.name}</div>
                    <div style="font-size:15px;color:var(--accent);margin-bottom:8px">\\(${f.latex}\\)</div>
                    ${f.note ? `<div style="font-size:12px;color:var(--text-3)">${f.note}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Upgrade overlay -->
        <div onclick="handleTestCheckoutClick(this,'ASVAB')" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;padding:24px;text-align:center">
          <div style="background:var(--surface);border:1px solid var(--accent);border-radius:16px;padding:32px 28px;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,.4)">
            <div style="font-size:36px;margin-bottom:12px">🔒</div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">ASVAB Access</div>
            <h3 style="font-size:17px;font-weight:800;margin-bottom:8px">${lockedCount} more formulas locked</h3>
            <p style="font-size:13px;color:var(--text-2);margin-bottom:20px;line-height:1.5">
              Geometry, Word Problem Formulas, and Electronics Formulas — plus 620+ practice questions,
              24 lesson modules, and adaptive drills.
            </p>
            <button class="btn btn-primary" style="width:100%">Unlock All Formulas — $47 →</button>
            <div style="margin-top:8px;font-size:11px;color:var(--text-3)">30-day guarantee &bull; One-time payment</div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Render MathJax on free formulas
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise(
      Array.from(document.querySelectorAll('.formula-latex'))
    ).catch(function (err) { console.warn('MathJax typeset error:', err); });
  }
});
