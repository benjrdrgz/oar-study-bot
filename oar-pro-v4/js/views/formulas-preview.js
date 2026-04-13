// OAR Pro v4 — Free Formula Sheet Preview
// Route: #/formulas-preview
// Shows Arithmetic + Algebra formulas fully rendered with MathJax.
// All other sections are blurred with a Pro upgrade overlay (FOMO gate).
// Uses FORMULA_DATA from formulas.js (loaded globally before this script).
// — Benjamin Rodriguez

const FORMULAS_FREE_SECTIONS = new Set(['Arithmetic', 'Algebra']);

route('/formulas-preview', () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  if (typeof FORMULA_DATA === 'undefined') {
    app.innerHTML = `<div style="text-align:center;padding:60px 24px;color:var(--text-3)">Formula data not loaded. <a href="#/lessons-preview" style="color:var(--accent)">← Back</a></div>`;
    return;
  }

  // Count totals for teaser
  const totalSections = FORMULA_DATA.length;
  const freeSections  = FORMULA_DATA.filter(s => FORMULAS_FREE_SECTIONS.has(s.section));
  const lockedSections = FORMULA_DATA.filter(s => !FORMULAS_FREE_SECTIONS.has(s.section));
  const freeCount  = freeSections.reduce((n, s) => n + s.formulas.length, 0);
  const lockedCount = lockedSections.reduce((n, s) => n + s.formulas.length, 0);

  app.innerHTML = `
    <!-- Top bar -->
    <div style="position:sticky;top:0;z-index:50;background:var(--bg-elevated);border-bottom:1px solid var(--border);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:20px">
        <a href="#/" style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:15px;color:var(--text);text-decoration:none">⚓ OAR <span style="color:var(--accent)">Pro</span></a>
        <span style="font-size:12px;color:var(--text-3)"><span style="color:var(--text-2);font-weight:700">${freeCount}</span> of ${freeCount + lockedCount} formulas free</span>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        <a href="#/lessons-preview" style="font-size:13px;color:var(--text-3);text-decoration:none">← Free Preview</a>
        <button class="btn btn-primary btn-sm" onclick="handleCheckoutClick(this)">Upgrade — $97 →</button>
      </div>
    </div>

    <!-- Body -->
    <div style="max-width:860px;margin:0 auto;padding:40px 24px 80px">

      <!-- Header -->
      <div style="text-align:center;margin-bottom:36px">
        <div style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:14px">Free Preview</div>
        <h1 style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:800;margin-bottom:10px;letter-spacing:-.025em">OAR Formula Reference Sheet</h1>
        <p style="color:var(--text-2);font-size:14px;max-width:500px;margin:0 auto">
          Arithmetic and Algebra formulas are fully unlocked. Geometry, Word Problems, and all Mechanical formulas unlock with OAR Pro.
        </p>
      </div>

      <!-- Free sections -->
      ${freeSections.map(sec => `
        <div style="margin-bottom:36px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">📐 ${sec.section}</span>
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

      <!-- Locked sections (blurred FOMO) -->
      <div style="position:relative;margin-bottom:36px">
        <div style="filter:blur(5px);pointer-events:none;user-select:none">
          ${lockedSections.map(sec => `
            <div style="margin-bottom:32px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
                <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">⚙️ ${sec.section}</span>
                <span style="font-size:10px;font-weight:700;background:var(--bg);color:var(--text-3);border:1px solid var(--border);padding:2px 8px;border-radius:999px">PRO</span>
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
        <div onclick="handleCheckoutClick(this)" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;padding:24px;text-align:center">
          <div style="background:var(--surface);border:1px solid var(--accent);border-radius:16px;padding:32px 28px;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,.4)">
            <div style="font-size:36px;margin-bottom:12px">🔒</div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">OAR Pro</div>
            <h3 style="font-size:17px;font-weight:800;margin-bottom:8px">${lockedCount} more formulas locked</h3>
            <p style="font-size:13px;color:var(--text-2);margin-bottom:16px;line-height:1.5">Geometry, Word Problems, and all ${lockedSections.length - 2} Mechanical sections unlock with OAR Pro — including Kinematics, Gas Laws, Electricity, and more.</p>
            <button class="btn btn-primary" style="width:100%">Unlock All Formulas — $97 →</button>
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
