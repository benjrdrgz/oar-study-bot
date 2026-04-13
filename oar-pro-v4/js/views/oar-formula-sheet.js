// OAR Pro v4 — Free OAR Formula Sheet
// Route: #/oar-formula-sheet
// Public SEO page. Shows ~10 free formulas; email gate unlocks all 35+.
// Feeds the same email capture / nurture sequence as the diagnostic.
// — Benjamin Rodriguez

const _FREE_FORMULAS = [
  { section:'Math',       label:'Pythagorean Theorem',    formula:'a² + b² = c²',                              note:'Right triangle sides. c is always the hypotenuse.' },
  { section:'Math',       label:'Area of a Circle',       formula:'A = πr²',                                   note:'r = radius. π ≈ 3.14159.' },
  { section:'Math',       label:'Circumference',          formula:'C = 2πr',                                   note:'Perimeter of a circle.' },
  { section:'Math',       label:'Area of a Triangle',     formula:'A = ½ × base × height',                     note:'Height must be perpendicular to the base.' },
  { section:'Math',       label:'Distance Formula',       formula:'d = r × t',                                 note:'Distance = rate × time. The most tested word problem formula.' },
  { section:'Math',       label:'Percent Change',         formula:'% change = (new − old) / old × 100',        note:'Positive = increase. Negative = decrease.' },
  { section:'Math',       label:'Slope',                  formula:'m = (y₂ − y₁) / (x₂ − x₁)',                note:'Rise over run. Measures steepness of a line.' },
  { section:'Mechanical', label:'Newton\'s Second Law',   formula:'F = ma',                                    note:'Force (N) = mass (kg) × acceleration (m/s²).' },
  { section:'Mechanical', label:'Work',                   formula:'W = F × d',                                 note:'Work (J) = Force (N) × distance (m). Force must be parallel to displacement.' },
  { section:'Mechanical', label:'Torque',                 formula:'τ = F × d',                                 note:'Torque = Force × lever arm length. Lever arm must be perpendicular to force.' },
];

const _LOCKED_FORMULAS = [
  { section:'Math',       label:'Quadratic Formula',      formula:'x = (−b ± √(b²−4ac)) / 2a',                note:'Solves ax² + bx + c = 0. Discriminant b²−4ac determines number of solutions.' },
  { section:'Math',       label:'Interest (Simple)',       formula:'I = P × r × t',                             note:'Interest = Principal × rate × time.' },
  { section:'Math',       label:'Average',                 formula:'Avg = sum / count',                         note:'Add all values, divide by how many there are.' },
  { section:'Math',       label:'Slope-Intercept',        formula:'y = mx + b',                                note:'m = slope, b = y-intercept.' },
  { section:'Math',       label:'Area of a Trapezoid',    formula:'A = ½(b₁ + b₂) × h',                       note:'Two parallel bases, h = perpendicular height.' },
  { section:'Math',       label:'Volume of a Cylinder',   formula:'V = πr²h',                                  note:'r = radius, h = height.' },
  { section:'Mechanical', label:'Power',                  formula:'P = W / t',                                 note:'Power (W) = Work (J) ÷ time (s). Also P = Fv.' },
  { section:'Mechanical', label:'Kinetic Energy',         formula:'KE = ½mv²',                                 note:'m = mass (kg), v = velocity (m/s). Doubles when v doubles → quadruples KE.' },
  { section:'Mechanical', label:'Gravitational PE',       formula:'PE = mgh',                                  note:'m = mass, g = 9.8 m/s², h = height.' },
  { section:'Mechanical', label:'Pressure',               formula:'P = F / A',                                 note:'Pressure (Pa) = Force (N) ÷ Area (m²).' },
  { section:'Mechanical', label:'Ohm\'s Law',             formula:'V = IR',                                    note:'Voltage (V) = Current (A) × Resistance (Ω).' },
  { section:'Mechanical', label:'Electrical Power',       formula:'P = IV = I²R = V²/R',                      note:'Three equivalent forms. Use whichever two values you have.' },
  { section:'Mechanical', label:'Gear Ratio',             formula:'R = teeth_driven / teeth_driving',          note:'R > 1 → torque increase, speed decrease. R < 1 → opposite.' },
  { section:'Mechanical', label:'Mechanical Advantage',   formula:'MA = effort arm / load arm',                note:'A longer effort arm = greater mechanical advantage.' },
  { section:'Mechanical', label:'Pulley MA',              formula:'MA = number of supporting rope segments',   note:'Count rope segments supporting the load. More segments = easier lift.' },
  { section:'Mechanical', label:'Boyle\'s Law',           formula:'P₁V₁ = P₂V₂',                              note:'Pressure and volume are inversely related at constant temperature.' },
  { section:'Mechanical', label:'Ideal Gas Law',          formula:'PV = nRT',                                  note:'n = moles, R = 8.314 J/mol·K, T = temperature in Kelvin.' },
  { section:'Mechanical', label:'Density',                formula:'ρ = m / V',                                 note:'Density = mass ÷ volume. Denser objects sink in less dense fluids.' },
  { section:'Mechanical', label:'Momentum',               formula:'p = mv',                                    note:'p = momentum (kg·m/s), m = mass, v = velocity.' },
  { section:'Mechanical', label:'Impulse-Momentum',       formula:'FΔt = Δp = mΔv',                           note:'Force × time = change in momentum.' },
  { section:'Mechanical', label:'Acceleration',           formula:'a = (v_f − v_i) / t',                      note:'Change in velocity over time.' },
  { section:'Mechanical', label:'Kinematic (distance)',   formula:'d = v_i t + ½at²',                          note:'For constant acceleration from initial velocity v_i.' },
  { section:'Mechanical', label:'Specific Heat',         formula:'Q = mcΔT',                                  note:'Q = heat (J), m = mass, c = specific heat, ΔT = temp change.' },
];

route('/oar-formula-sheet', () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');

  function _renderFormulaCard(f, locked) {
    if (locked) {
      return `
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;opacity:.55;position:relative">
          <div style="position:absolute;top:10px;right:12px;font-size:11px">🔒</div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:4px">${f.section}</div>
          <div style="font-size:13px;font-weight:600;color:var(--text-2);margin-bottom:6px">${f.label}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-3);padding:6px 10px;background:var(--bg);border-radius:6px;filter:blur(4px);user-select:none">${f.formula}</div>
        </div>`;
    }
    return `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;transition:border-color .15s" onmouseover="this.style.borderColor='var(--border-hover)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3)">${f.section}</div>
        </div>
        <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px">${f.label}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--accent);padding:8px 12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.12);border-radius:6px;margin-bottom:8px">${f.formula}</div>
        <div style="font-size:12px;color:var(--text-3);line-height:1.5">${f.note}</div>
      </div>`;
  }

  const allUnlocked = (() => {
    try { return !!localStorage.getItem('oar_preview_email'); } catch (_) { return false; }
  })();

  app.innerHTML = `
    <div style="max-width:840px;margin:0 auto;padding:60px 24px 80px">

      <!-- Header -->
      <div style="margin-bottom:40px">
        <a href="#/" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:24px">← OAR Pro</a>
        <div style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:14px">Free Resource</div>
        <h1 style="font-size:clamp(1.8rem,4vw,2.4rem);font-weight:800;letter-spacing:-.03em;margin-bottom:12px">OAR Formula Reference Sheet</h1>
        <p style="font-size:1rem;color:var(--text-2);line-height:1.7;max-width:580px">
          Every formula you need for the OAR Math and Mechanical Comprehension sections.
          Organized, color-coded, and written to stick — not copied from a textbook.
        </p>
      </div>

      <!-- Free formulas -->
      <div style="margin-bottom:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
          <h2 style="font-size:1rem;font-weight:700;margin:0">Free Formulas (${_FREE_FORMULAS.length})</h2>
          <span style="font-size:12px;color:var(--text-3)">${_LOCKED_FORMULAS.length} more unlocked with your email →</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-bottom:32px">
          ${_FREE_FORMULAS.map(f => _renderFormulaCard(f, false)).join('')}
        </div>
      </div>

      <!-- Email gate / locked section -->
      <div id="fsGateWrap">
        ${allUnlocked ? `
          <!-- Already have email — show all locked formulas -->
          <div style="margin-bottom:12px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <h2 style="font-size:1rem;font-weight:700;margin:0">Full Reference (${_LOCKED_FORMULAS.length} more)</h2>
              <span style="font-size:11px;color:var(--green);font-weight:600">✓ Unlocked</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
              ${_LOCKED_FORMULAS.map(f => _renderFormulaCard(f, false)).join('')}
            </div>
          </div>
        ` : `
          <!-- Gate: show blurred + email capture -->
          <div style="margin-bottom:16px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <h2 style="font-size:1rem;font-weight:700;margin:0">Full Reference (${_LOCKED_FORMULAS.length} more)</h2>
              <span style="font-size:11px;color:var(--text-3)">Enter email to unlock →</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-bottom:24px;pointer-events:none">
              ${_LOCKED_FORMULAS.slice(0,6).map(f => _renderFormulaCard(f, true)).join('')}
            </div>
          </div>

          <!-- Email capture card -->
          <div style="background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:16px;padding:32px 28px;text-align:center;margin-bottom:8px" id="fsEmailCard">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:12px">Unlock All ${_LOCKED_FORMULAS.length} Remaining Formulas</div>
            <h3 style="font-size:1.2rem;font-weight:800;margin-bottom:8px">Get the complete formula sheet</h3>
            <p style="color:var(--text-2);font-size:13px;margin-bottom:20px;max-width:400px;margin-left:auto;margin-right:auto">
              ${_LOCKED_FORMULAS.length} more formulas including Ohm's Law, gear ratios, kinematic equations, gas laws, and more. Free.
            </p>
            <div style="display:flex;gap:8px;max-width:420px;margin:0 auto;flex-wrap:wrap">
              <input type="email" id="fsEmailInput" placeholder="your@email.com"
                style="flex:1;min-width:200px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:inherit"
                onkeydown="if(event.key==='Enter')_fsSubmit()">
              <button id="fsEmailBtn" onclick="_fsSubmit()" class="btn btn-primary" style="white-space:nowrap">Unlock Free →</button>
            </div>
            <div style="margin-top:8px;font-size:11px;color:var(--text-3)">No spam. We'll also send your study plan.</div>
          </div>
        `}
      </div>

      <!-- Study tip banner -->
      <div style="margin-top:40px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px 24px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:8px">💡 Study Tip</div>
        <p style="font-size:13px;color:var(--text-2);line-height:1.65;margin:0">
          Don't memorize every formula before you practice. Learn a formula, apply it to 3–5 questions, then move on.
          Active retrieval beats passive reading for retention — especially on the CAT format where difficulty adjusts in real time.
          Take the free diagnostic first to find out which formulas you actually need to prioritize.
        </p>
      </div>

      <!-- Bottom CTA -->
      <div style="text-align:center;margin-top:40px;padding-top:36px;border-top:1px solid var(--border)">
        <p style="color:var(--text-2);font-size:14px;margin-bottom:18px">Ready to put these into practice?</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a href="#/diagnostic" class="btn btn-primary btn-lg">Take Free Diagnostic →</a>
          <button class="btn btn-secondary btn-lg" onclick="handleCheckoutClick(this)">Get OAR Pro — $97</button>
        </div>
      </div>

    </div>
  `;
});

// ── Formula sheet email capture ───────────────────────────────────────────────

async function _fsSubmit() {
  const input = document.getElementById('fsEmailInput');
  const btn   = document.getElementById('fsEmailBtn');
  if (!input || !btn) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) { input.style.borderColor = 'var(--red)'; return; }

  btn.disabled = true;
  btn.textContent = 'Unlocking…';

  // Store preview token (gives lesson access too)
  try {
    localStorage.setItem('oar_preview_email', email);
    localStorage.setItem('oar_preview_expires', String(Date.now() + 72 * 60 * 60 * 1000));
  } catch (_) {}

  // Fire lead capture (non-blocking)
  if (window._emailCapture && window._emailCapture.submitLeadCapture) {
    window._emailCapture.submitLeadCapture({
      email,
      onSuccess: () => {},
      onError: () => {},
    });
  }

  // Reveal all locked formulas inline
  const wrap = document.getElementById('fsGateWrap');
  if (wrap) {
    wrap.innerHTML = `
      <div style="background:var(--surface);border:1px solid var(--green);border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <span style="font-size:20px">✓</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text)">All formulas unlocked</div>
          <div style="font-size:12px;color:var(--text-2)">Your study plan has also been sent to <strong>${email}</strong>. Your free lessons are ready too → <a href="#/lessons-preview" style="color:var(--accent)">Start lessons</a></div>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px">Full Reference (${_LOCKED_FORMULAS.length} more)</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
          ${_LOCKED_FORMULAS.map(f => {
            return `
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;transition:border-color .15s" onmouseover="this.style.borderColor='var(--border-hover)'" onmouseout="this.style.borderColor='var(--border)'">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:4px">${f.section}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px">${f.label}</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--accent);padding:8px 12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.12);border-radius:6px;margin-bottom:8px">${f.formula}</div>
                <div style="font-size:12px;color:var(--text-3);line-height:1.5">${f.note}</div>
              </div>`;
          }).join('')}
        </div>
      </div>
    `;
  }
}
window._fsSubmit = _fsSubmit;
