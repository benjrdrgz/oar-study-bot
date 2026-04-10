// OAR Pro v4 — Shareable Score Card
// Generates a branded PNG using Canvas 2D API — no libraries.
// Used after Quick Drill, Infinite Drill, and Adaptive CAT.
// — Benjamin Rodriguez

/**
 * Generate a shareable PNG score card.
 * @param {Object} opts
 * @param {string} opts.title        — e.g. "Quick Drill" or "Adaptive CAT"
 * @param {string|number} opts.score — the main big number
 * @param {string} opts.scoreLabel   — e.g. "Predicted OAR" or "Accuracy"
 * @param {string} [opts.subline]    — e.g. "5 of 5 correct in 1:18"
 * @param {Array<[string,string]>} [opts.breakdown] — e.g. [['Math','90%'],['Reading','60%']]
 * @param {string} [opts.badge]      — optional badge text ("Personal Best", "Elite")
 * @param {string} [opts.userName]   — to print in the footer
 * @returns {Promise<string>}        — data URL of the PNG
 */
async function generateScoreCard(opts = {}) {
  const W = 1200, H = 630;   // Twitter/OG card spec
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ——— Background: deep Raycast-style dark + radial gradient glow ———
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#07080a');
  bgGrad.addColorStop(1, '#0f111a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Ambient glow (top-left blue, bottom-right purple)
  const glow1 = ctx.createRadialGradient(200, 150, 0, 200, 150, 700);
  glow1.addColorStop(0, 'rgba(62, 139, 255, 0.22)');
  glow1.addColorStop(1, 'rgba(62, 139, 255, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(1000, 500, 0, 1000, 500, 700);
  glow2.addColorStop(0, 'rgba(155, 107, 255, 0.18)');
  glow2.addColorStop(1, 'rgba(155, 107, 255, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // ——— Header: OAR Pro logo ———
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 34px "Space Grotesk", -apple-system, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('⚓ OAR', 60, 50);
  ctx.fillStyle = '#3e8bff';
  ctx.fillText('Pro', 60 + ctx.measureText('⚓ OAR ').width, 50);

  // Title of the result (right-aligned)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 13px "Inter", -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText((opts.title || 'Result').toUpperCase(), W - 60, 60);
  ctx.textAlign = 'left';

  // Optional badge (top-center)
  if (opts.badge) {
    const badgeText = opts.badge.toUpperCase();
    ctx.font = '700 14px "Inter", sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + 32;
    const badgeX = (W - badgeWidth) / 2;
    const badgeY = 50;
    // Pill background
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, badgeX, badgeY, badgeWidth, 32, 16);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, W / 2, badgeY + 17);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  // ——— Main score label ———
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText((opts.scoreLabel || 'Score').toUpperCase(), W / 2, 180);

  // Big score
  const scoreStr = String(opts.score ?? '—');
  ctx.font = '600 220px "Space Grotesk", sans-serif';
  const scoreGrad = ctx.createLinearGradient(W / 2 - 200, 210, W / 2 + 200, 430);
  scoreGrad.addColorStop(0, '#3e8bff');
  scoreGrad.addColorStop(1, '#9b6bff');
  ctx.fillStyle = scoreGrad;
  ctx.fillText(scoreStr, W / 2, 220);

  // Subline (under the score)
  if (opts.subline) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '500 22px "Inter", sans-serif';
    ctx.fillText(opts.subline, W / 2, 460);
  }

  // ——— Breakdown (bottom row, max 4 items) ———
  if (opts.breakdown && opts.breakdown.length) {
    const items = opts.breakdown.slice(0, 4);
    const boxWidth = 220;
    const boxSpacing = 20;
    const totalWidth = items.length * boxWidth + (items.length - 1) * boxSpacing;
    const startX = (W - totalWidth) / 2;
    const y = 510;

    items.forEach(([label, value], i) => {
      const x = startX + i * (boxWidth + boxSpacing);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      roundRect(ctx, x, y, boxWidth, 80, 12);
      ctx.fill(); ctx.stroke();
      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label.toUpperCase(), x + boxWidth / 2, y + 14);
      // Value
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 32px "Space Grotesk", sans-serif';
      ctx.fillText(value, x + boxWidth / 2, y + 34);
    });
  }

  // ——— Footer ———
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '500 16px "Inter", sans-serif';
  ctx.textAlign = 'left';
  if (opts.userName) {
    ctx.fillText(opts.userName, 60, H - 50);
  }
  ctx.textAlign = 'right';
  ctx.fillText('oar-pro-v4.vercel.app', W - 60, H - 50);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  return canvas.toDataURL('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Download a data URL as a file.
 */
function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy a data URL to clipboard as an image (modern browsers).
 */
async function copyImageToClipboard(dataUrl) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (e) {
    console.warn('[ScoreCard] Clipboard copy failed:', e);
    return false;
  }
}

/**
 * Open a modal that shows the generated card + Download / Copy / Share buttons.
 */
async function showScoreCardModal(opts) {
  const dataUrl = await generateScoreCard(opts);
  const modal = document.createElement('div');
  modal.id = 'scoreCardModal';
  modal.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(8px);
    z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;
    animation:fadeIn 200ms ease-out;
  `;
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:720px;width:100%;box-shadow:var(--shadow-lg)" onclick="event.stopPropagation()">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div>
          <h2 style="margin:0 0 4px 0;font-size:22px">Share Your Score</h2>
          <p class="text-muted text-sm" style="margin:0">Download or copy the image to share</p>
        </div>
        <button onclick="document.getElementById('scoreCardModal').remove()" style="background:transparent;border:none;color:var(--text-2);font-size:22px;cursor:pointer;padding:4px 8px">&times;</button>
      </div>
      <img src="${dataUrl}" style="width:100%;border-radius:12px;border:1px solid var(--border);display:block;margin-bottom:18px" alt="Score card"/>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="window._scoreCardDataUrl && downloadDataUrl(window._scoreCardDataUrl, 'oar-score-${opts.score || 'result'}.png')">
          &darr; Download PNG
        </button>
        <button class="btn btn-secondary" id="scoreCardCopyBtn">
          ⎘ Copy Image
        </button>
        <a class="btn btn-secondary" target="_blank" rel="noopener"
           href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just scored ${opts.score} on the OAR Pro ${opts.title || 'practice'}. ${opts.subline || ''}`)}&url=${encodeURIComponent('https://oar-pro-v4.vercel.app')}">
          𝕏 Post to X
        </a>
        <a class="btn btn-secondary" target="_blank" rel="noopener"
           href="https://www.reddit.com/submit?title=${encodeURIComponent(`My OAR Pro ${opts.title || 'practice'} score: ${opts.score}`)}&url=${encodeURIComponent('https://oar-pro-v4.vercel.app')}">
          ⬆ Post to Reddit
        </a>
      </div>
    </div>
  `;
  window._scoreCardDataUrl = dataUrl;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);

  // Wire copy button
  const copyBtn = document.getElementById('scoreCardCopyBtn');
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const ok = await copyImageToClipboard(dataUrl);
      copyBtn.innerHTML = ok ? '✓ Copied!' : '✗ Copy failed';
      setTimeout(() => { copyBtn.innerHTML = '⎘ Copy Image'; }, 2000);
    };
  }
}

// Expose globally
window.generateScoreCard = generateScoreCard;
window.showScoreCardModal = showScoreCardModal;
window.downloadDataUrl = downloadDataUrl;
