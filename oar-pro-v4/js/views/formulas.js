// OAR Pro v4 — Formula Reference View
// Route: /formulas
// Renders client-side hardcoded formula data with MathJax, search, and section tabs.

const FORMULA_DATA = [
  // ── ARITHMETIC ──────────────────────────────────────────────────────────
  {
    section: 'Arithmetic',
    tab: 'math',
    formulas: [
      {
        name: 'Order of Operations (PEMDAS)',
        latex: '\\text{Parentheses} \\to \\text{Exponents} \\to \\text{Mult/Div} \\to \\text{Add/Sub}',
        note: 'Left to right within same tier.'
      },
      {
        name: 'Percent of a Number',
        latex: '\\text{Part} = \\frac{\\text{Percent}}{100} \\times \\text{Whole}',
        note: 'Example: 35% of 80 = 0.35 × 80 = 28'
      },
      {
        name: 'Percent Change',
        latex: '\\% \\text{ Change} = \\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100',
        note: 'Positive = increase, negative = decrease.'
      },
      {
        name: 'Fraction Division',
        latex: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}',
        note: 'Multiply by the reciprocal.'
      },
      {
        name: 'Average (Mean)',
        latex: '\\bar{x} = \\frac{\\sum x_i}{n}',
        note: 'Sum of all values divided by count.'
      },
      {
        name: 'Ratio / Proportion',
        latex: '\\frac{a}{b} = \\frac{c}{d} \\implies ad = bc',
        note: 'Cross-multiply to solve.'
      }
    ]
  },
  // ── ALGEBRA ─────────────────────────────────────────────────────────────
  {
    section: 'Algebra',
    tab: 'math',
    formulas: [
      {
        name: 'Quadratic Formula',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        note: 'Solves ax² + bx + c = 0'
      },
      {
        name: 'Slope of a Line',
        latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
        note: 'Rise over run between two points.'
      },
      {
        name: 'Slope-Intercept Form',
        latex: 'y = mx + b',
        note: 'm = slope, b = y-intercept'
      },
      {
        name: 'Distance Formula',
        latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
        note: 'Distance between two coordinate points.'
      },
      {
        name: 'Distance / Rate / Time',
        latex: 'd = r \\times t',
        note: 'Rearranges to r = d/t and t = d/r.'
      },
      {
        name: 'Work Rate',
        latex: '\\frac{1}{t_1} + \\frac{1}{t_2} = \\frac{1}{t_{combined}}',
        note: 'How long two workers finish a job together.'
      }
    ]
  },
  // ── GEOMETRY ────────────────────────────────────────────────────────────
  {
    section: 'Geometry',
    tab: 'math',
    formulas: [
      {
        name: 'Pythagorean Theorem',
        latex: 'a^2 + b^2 = c^2',
        note: 'c is the hypotenuse. Common triples: 3-4-5, 5-12-13.'
      },
      {
        name: 'Area — Rectangle',
        latex: 'A = l \\times w',
        note: ''
      },
      {
        name: 'Area — Triangle',
        latex: 'A = \\frac{1}{2} b h',
        note: 'b = base, h = perpendicular height.'
      },
      {
        name: 'Area — Circle',
        latex: 'A = \\pi r^2',
        note: 'Use π ≈ 3.14 on OAR.'
      },
      {
        name: 'Circumference — Circle',
        latex: 'C = 2\\pi r = \\pi d',
        note: ''
      },
      {
        name: 'Volume — Rectangular Prism',
        latex: 'V = l \\times w \\times h',
        note: ''
      },
      {
        name: 'Volume — Cylinder',
        latex: 'V = \\pi r^2 h',
        note: ''
      }
    ]
  },
  // ── WORD PROBLEMS ────────────────────────────────────────────────────────
  {
    section: 'Word Problems',
    tab: 'math',
    formulas: [
      {
        name: 'Simple Interest',
        latex: 'I = P \\times r \\times t',
        note: 'P = principal, r = annual rate (decimal), t = years.'
      },
      {
        name: 'Mixture / Weighted Average',
        latex: '\\bar{x} = \\frac{n_1 x_1 + n_2 x_2}{n_1 + n_2}',
        note: 'Combine two groups with different averages.'
      },
      {
        name: 'Profit / Loss',
        latex: '\\text{Profit} = \\text{Revenue} - \\text{Cost}',
        note: ''
      }
    ]
  },
  // ── FORCES ──────────────────────────────────────────────────────────────
  {
    section: 'Forces',
    tab: 'mechanical',
    formulas: [
      {
        name: "Newton's Second Law",
        latex: 'F = ma',
        note: 'F = force (N), m = mass (kg), a = acceleration (m/s²).'
      },
      {
        name: 'Weight',
        latex: 'W = mg',
        note: 'g ≈ 9.8 m/s² on Earth.'
      },
      {
        name: 'Pressure',
        latex: 'P = \\frac{F}{A}',
        note: 'Force per unit area (Pa or psi).'
      },
      {
        name: 'Friction Force',
        latex: 'f = \\mu N',
        note: 'μ = coefficient of friction, N = normal force.'
      }
    ]
  },
  // ── LEVERS ──────────────────────────────────────────────────────────────
  {
    section: 'Levers',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Lever Balance',
        latex: 'F_1 \\times d_1 = F_2 \\times d_2',
        note: 'Effort × effort arm = load × load arm.'
      },
      {
        name: 'Mechanical Advantage — Lever',
        latex: 'MA = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{d_{effort}}{d_{load}}',
        note: 'MA > 1 means mechanical advantage gained.'
      }
    ]
  },
  // ── GEARS ───────────────────────────────────────────────────────────────
  {
    section: 'Gears',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Gear Ratio',
        latex: 'GR = \\frac{N_{driven}}{N_{driver}}',
        note: 'N = number of teeth. GR > 1 = more torque, less speed.'
      },
      {
        name: 'Speed Ratio',
        latex: '\\frac{\\omega_1}{\\omega_2} = \\frac{N_2}{N_1}',
        note: 'Gear speed is inversely proportional to tooth count.'
      },
      {
        name: 'Gear Direction',
        latex: '\\text{Meshing gears rotate in opposite directions}',
        note: 'Even number of gears in a chain → same direction as input.'
      }
    ]
  },
  // ── PULLEYS ─────────────────────────────────────────────────────────────
  {
    section: 'Pulleys',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Mechanical Advantage — Pulley',
        latex: 'MA = \\text{number of rope segments supporting the load}',
        note: 'Count only segments attached to the moving block.'
      },
      {
        name: 'Effort Force',
        latex: 'E = \\frac{L}{MA}',
        note: 'L = load weight, ignoring friction.'
      }
    ]
  },
  // ── ENERGY ──────────────────────────────────────────────────────────────
  {
    section: 'Energy',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Kinetic Energy',
        latex: 'KE = \\frac{1}{2}mv^2',
        note: 'm = mass (kg), v = velocity (m/s).'
      },
      {
        name: 'Potential Energy',
        latex: 'PE = mgh',
        note: 'h = height above reference point.'
      },
      {
        name: 'Work',
        latex: 'W = F \\times d \\times \\cos\\theta',
        note: 'θ = angle between force and displacement direction.'
      },
      {
        name: 'Power',
        latex: 'P = \\frac{W}{t}',
        note: 'Watts = Joules per second.'
      },
      {
        name: 'Conservation of Energy',
        latex: 'KE_1 + PE_1 = KE_2 + PE_2',
        note: 'Total mechanical energy constant (no friction).'
      }
    ]
  },
  // ── FLUIDS ──────────────────────────────────────────────────────────────
  {
    section: 'Fluids',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Density',
        latex: '\\rho = \\frac{m}{V}',
        note: 'kg/m³. Water ≈ 1000 kg/m³.'
      },
      {
        name: 'Buoyancy (Archimedes)',
        latex: 'F_b = \\rho_{fluid} \\times V_{displaced} \\times g',
        note: 'Object floats if F_b ≥ weight.'
      },
      {
        name: 'Pascal\'s Principle',
        latex: '\\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
        note: 'Pressure transmitted equally in enclosed fluid.'
      },
      {
        name: 'Continuity Equation',
        latex: 'A_1 v_1 = A_2 v_2',
        note: 'Narrow pipe → faster flow. Volume flow rate constant.'
      }
    ]
  },
  // ── ELECTRICITY ──────────────────────────────────────────────────────────
  {
    section: 'Electricity',
    tab: 'mechanical',
    formulas: [
      {
        name: "Ohm's Law",
        latex: 'V = IR',
        note: 'V = voltage (V), I = current (A), R = resistance (Ω).'
      },
      {
        name: 'Power (Electrical)',
        latex: 'P = IV = I^2R = \\frac{V^2}{R}',
        note: 'Watts. Use whichever form has known variables.'
      },
      {
        name: 'Series Resistance',
        latex: 'R_{total} = R_1 + R_2 + R_3 + \\cdots',
        note: 'Total resistance increases. Current same through all.'
      },
      {
        name: 'Parallel Resistance',
        latex: '\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\cdots',
        note: 'Total resistance decreases. Voltage same across all.'
      }
    ]
  },
  // ── MOMENTUM ────────────────────────────────────────────────────────────
  {
    section: 'Momentum',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Linear Momentum',
        latex: 'p = mv',
        note: 'kg·m/s. Momentum is conserved in collisions.'
      },
      {
        name: 'Conservation of Momentum',
        latex: 'm_1 v_1 + m_2 v_2 = m_1 v_1\' + m_2 v_2\'',
        note: 'Before = after in closed system.'
      },
      {
        name: 'Impulse',
        latex: 'J = F \\Delta t = \\Delta p',
        note: 'Force × time = change in momentum.'
      }
    ]
  },
  // ── KINEMATICS ──────────────────────────────────────────────────────────
  {
    section: 'Kinematics',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Velocity (constant acceleration)',
        latex: 'v = v_0 + at',
        note: 'v₀ = initial velocity, a = acceleration, t = time.'
      },
      {
        name: 'Displacement',
        latex: 'd = v_0 t + \\frac{1}{2}at^2',
        note: ''
      },
      {
        name: 'Velocity² Relation',
        latex: 'v^2 = v_0^2 + 2ad',
        note: 'Useful when time is not given.'
      }
    ]
  },
  // ── GAS LAWS ─────────────────────────────────────────────────────────────
  {
    section: 'Gas Laws',
    tab: 'mechanical',
    formulas: [
      {
        name: "Boyle's Law",
        latex: 'P_1 V_1 = P_2 V_2',
        note: 'Constant temperature. Pressure × volume = constant.'
      },
      {
        name: "Charles's Law",
        latex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
        note: 'Constant pressure. T must be in Kelvin (K = °C + 273).'
      },
      {
        name: 'Combined Gas Law',
        latex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
        note: 'Use when P, V, and T all change.'
      }
    ]
  },
  // ── HEAT TRANSFER ────────────────────────────────────────────────────────
  {
    section: 'Heat Transfer',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Heat Energy',
        latex: 'Q = mc\\Delta T',
        note: 'm = mass, c = specific heat, ΔT = temp change.'
      },
      {
        name: 'Thermal Conduction',
        latex: 'Q = \\frac{kA\\Delta T \\cdot t}{d}',
        note: 'k = conductivity, A = area, d = thickness.'
      }
    ]
  },
  // ── MAGNETISM ────────────────────────────────────────────────────────────
  {
    section: 'Magnetism',
    tab: 'mechanical',
    formulas: [
      {
        name: 'Magnetic Force on a Charge',
        latex: 'F = qvB\\sin\\theta',
        note: 'q = charge, v = velocity, B = magnetic field strength.'
      },
      {
        name: 'Electromagnetic Induction',
        latex: '\\mathcal{E} = -\\frac{\\Delta \\Phi}{\\Delta t}',
        note: 'Changing magnetic flux induces voltage (Faraday\'s Law).'
      },
      {
        name: 'Right-Hand Rule',
        latex: '\\text{Point fingers in direction of } \\vec{v}, \\text{ curl toward } \\vec{B} \\Rightarrow \\text{thumb} = \\vec{F}',
        note: 'For positive charges. Reverse for negative.'
      }
    ]
  }
];

route('/formulas', async () => {
  const app = document.getElementById('app');

  // Render shell immediately
  app.innerHTML = `
    <div style="max-width:860px">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px">
        <div>
          <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">Formula Reference</h1>
          <p class="text-muted text-sm">All OAR formulas in one place. Click any section to expand.</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.print()" title="Print formulas">
          &#128438; Print
        </button>
      </div>

      <!-- Search + Tabs row -->
      <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center">
        <input
          type="text"
          class="form-input"
          id="formulaSearch"
          placeholder="Search formulas..."
          style="flex:1;min-width:200px;max-width:340px"
          oninput="filterFormulas()"
        >
        <div style="display:flex;gap:4px" id="formulaTabs">
          <button class="btn btn-sm formula-tab active" data-tab="all" onclick="setFormulaTab('all')">All</button>
          <button class="btn btn-sm formula-tab" data-tab="math" onclick="setFormulaTab('math')">Math</button>
          <button class="btn btn-sm formula-tab" data-tab="mechanical" onclick="setFormulaTab('mechanical')">Mechanical</button>
        </div>
      </div>

      <!-- Formula sections -->
      <div id="formulaSections"></div>

      <!-- Empty state -->
      <div id="formulaEmpty" style="display:none;text-align:center;padding:60px 20px">
        <div style="font-size:40px;margin-bottom:12px">&#128269;</div>
        <p class="text-muted">No formulas match your search.</p>
        <button class="btn btn-secondary btn-sm mt-4" onclick="clearFormulaSearch()">Clear Search</button>
      </div>

    </div>
  `;

  // Inline print styles
  if (!document.getElementById('formulaPrintStyle')) {
    const style = document.createElement('style');
    style.id = 'formulaPrintStyle';
    style.textContent = `
      @media print {
        .nav, .app-sidebar, .mobile-toggle, #formulaSearch, #formulaTabs, button { display: none !important; }
        .app-main { margin: 0; padding: 0; max-width: 100%; }
        .formula-section { break-inside: avoid; }
        .formula-item { break-inside: avoid; }
        body { background: white; color: black; }
        .formula-block, .card { background: #f8f8f8 !important; border: 1px solid #ddd !important; }
        .MathJax { color: black !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // State
  window._formulaTab = 'all';
  window._formulaSearch = '';
  // Track which sections are expanded (all open by default)
  window._formulaExpanded = {};
  FORMULA_DATA.forEach(s => { window._formulaExpanded[s.section] = true; });

  renderFormulaSections();
});

function renderFormulaSections() {
  const search = (window._formulaSearch || '').toLowerCase();
  const tab = window._formulaTab || 'all';
  const container = document.getElementById('formulaSections');
  const emptyState = document.getElementById('formulaEmpty');
  if (!container) return;

  let anyVisible = false;
  let html = '';

  for (const group of FORMULA_DATA) {
    // Tab filter
    if (tab !== 'all' && group.tab !== tab) continue;

    // Search filter — check section name + formula names + notes
    const matchesSearch = !search || group.section.toLowerCase().includes(search) ||
      group.formulas.some(f =>
        f.name.toLowerCase().includes(search) ||
        (f.note && f.note.toLowerCase().includes(search))
      );

    if (!matchesSearch) continue;

    // Filter individual formulas if search active
    const visibleFormulas = search
      ? group.formulas.filter(f =>
          f.name.toLowerCase().includes(search) ||
          group.section.toLowerCase().includes(search) ||
          (f.note && f.note.toLowerCase().includes(search))
        )
      : group.formulas;

    if (!visibleFormulas.length) continue;
    anyVisible = true;

    const isOpen = window._formulaExpanded[group.section] !== false;
    const sectionId = 'fs_' + group.section.replace(/\s+/g, '_');

    html += `
      <div class="formula-section card mb-4" style="padding:0;overflow:hidden">
        <div
          onclick="toggleFormulaSection('${group.section}')"
          style="padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none"
        >
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-weight:700;font-size:15px">${group.section}</span>
            <span class="badge badge-blue" style="font-size:10px">${visibleFormulas.length}</span>
          </div>
          <span style="color:var(--text-3);font-size:18px;transition:transform .2s;transform:rotate(${isOpen ? '180' : '0'}deg)" id="arrow_${sectionId}">&#9660;</span>
        </div>
        <div id="${sectionId}" style="display:${isOpen ? 'block' : 'none'}">
          <div style="border-top:1px solid var(--border)">
            ${visibleFormulas.map((f, i) => `
              <div class="formula-item" style="padding:16px 20px;${i < visibleFormulas.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
                <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text)">${f.name}</div>
                <div class="formula-block" style="margin:0 0 8px 0">\\[${f.latex}\\]</div>
                ${f.note ? `<div style="font-size:12px;color:var(--text-2);margin-top:6px">&#128161; ${f.note}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  emptyState.style.display = anyVisible ? 'none' : 'block';

  // Re-typeset MathJax
  if (typeof MathJax !== 'undefined' && MathJax.Hub) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, container]);
  }
}

function toggleFormulaSection(section) {
  window._formulaExpanded[section] = !window._formulaExpanded[section];
  renderFormulaSections();
}

function filterFormulas() {
  const input = document.getElementById('formulaSearch');
  if (!input) return;
  window._formulaSearch = input.value;
  // Auto-expand all sections when searching
  if (window._formulaSearch) {
    FORMULA_DATA.forEach(s => { window._formulaExpanded[s.section] = true; });
  }
  renderFormulaSections();
}

function setFormulaTab(tab) {
  window._formulaTab = tab;
  // Update tab button styles
  document.querySelectorAll('.formula-tab').forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('btn-primary', isActive);
    btn.classList.toggle('btn-secondary', !isActive);
    btn.classList.toggle('active', isActive);
  });
  renderFormulaSections();
}

function clearFormulaSearch() {
  const input = document.getElementById('formulaSearch');
  if (input) input.value = '';
  window._formulaSearch = '';
  renderFormulaSections();
}
