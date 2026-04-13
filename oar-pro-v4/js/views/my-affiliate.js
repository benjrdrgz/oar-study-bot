// OAR Pro v4 — In-App Affiliate Dashboard
// Route: #/my-affiliate (authenticated users who are affiliates)
// Fetches affiliate record by matching the logged-in user's email.
// Uses existing submit_cashout_request RPC (validated by portal_token server-side).
// — Benjamin Rodriguez

route('/my-affiliate', async () => {
  const app = document.getElementById('app');
  app.classList.remove('full-width');
  if (typeof renderDashboardSidebar === 'function') renderDashboardSidebar();

  const profile = await getProfile();
  if (!profile?.email) { navigate('#/dashboard'); return; }

  // Fetch affiliate record by email
  const { data: aff, error } = await supabase
    .from('affiliates')
    .select('*')
    .eq('email', profile.email)
    .maybeSingle();

  if (error || !aff) {
    app.innerHTML = `
      <div style="max-width:560px;margin:60px auto;text-align:center">
        <h2 style="margin-bottom:12px">No Affiliate Account Found</h2>
        <p class="text-muted">Your account (${profile.email}) is not linked to an affiliate record. Contact OAR Pro if you think this is an error.</p>
        <a href="#/dashboard" class="btn btn-secondary" style="margin-top:20px">Back to Dashboard</a>
      </div>`;
    return;
  }

  const owed = Number(aff.total_earned) - Number(aff.total_paid);
  const token = aff.portal_token;

  // Fetch cashout history
  const { data: requests } = await supabase
    .rpc('get_cashout_requests_by_token', { p_token: token });

  const hasPending = (requests || []).some(r => r.status === 'pending');

  const statusBadge = s => {
    const map = { pending: 'badge-yellow', approved: 'badge-blue', paid: 'badge-green', rejected: 'badge-red' };
    return `<span class="badge ${map[s] || ''}">${s}</span>`;
  };

  const refLink = `${window.location.origin}${window.location.pathname}#/?ref=${aff.code}`;

  app.innerHTML = `
    <div style="max-width:720px">

      <!-- Header -->
      <div style="margin-bottom:28px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:6px">Affiliate Program</div>
        <h1 style="font-size:26px;font-weight:800;margin-bottom:6px">Your Affiliate Stats</h1>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <code style="background:var(--surface-2);padding:3px 10px;border-radius:6px;font-size:14px">${aff.code}</code>
          <span class="badge ${aff.active ? 'badge-green' : 'badge-red'}">${aff.active ? 'Active' : 'Paused'}</span>
          <span style="font-size:13px;color:var(--text-3)">${(Number(aff.commission_rate) * 100).toFixed(0)}% commission per referral</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid-3 mb-8">
        <div class="card" style="text-align:center">
          <div style="font-size:32px;font-weight:800;color:var(--accent)">${aff.total_referred}</div>
          <div class="text-muted text-sm">Referrals</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:32px;font-weight:800;color:var(--green)">$${Number(aff.total_earned).toFixed(2)}</div>
          <div class="text-muted text-sm">Total Earned</div>
        </div>
        <div class="card" style="text-align:center;${owed > 0 ? 'border-color:var(--yellow)' : ''}">
          <div style="font-size:32px;font-weight:800;color:${owed > 0 ? 'var(--yellow)' : 'var(--text-3)'}">$${owed.toFixed(2)}</div>
          <div class="text-muted text-sm">Owed to You</div>
        </div>
      </div>

      <!-- Referral Link -->
      <div class="card mb-8">
        <h3 style="margin-bottom:10px">Your Referral Link</h3>
        <p style="font-size:13px;color:var(--text-2);margin-bottom:12px">
          Anyone who buys OAR Pro through this link gets $30 off, and you earn ${(Number(aff.commission_rate) * 100).toFixed(0)}% of each sale.
        </p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <code id="myRefLink" style="flex:1;background:var(--surface-2);padding:8px 12px;border-radius:6px;font-size:13px;word-break:break-all;min-width:0">${refLink}</code>
          <button class="btn btn-secondary btn-sm" onclick="copyMyRefLink()">Copy</button>
        </div>
      </div>

      <!-- Cashout Request -->
      <div class="card mb-8">
        <h3 style="margin-bottom:6px">Request Cashout</h3>
        <p style="font-size:13px;color:var(--text-2);margin-bottom:16px">
          ${owed <= 0
            ? 'Nothing owed yet — your balance will appear here once referral commissions are confirmed.'
            : hasPending
              ? 'You already have a pending cashout request. It will be processed shortly.'
              : `You have <strong style="color:var(--yellow)">$${owed.toFixed(2)}</strong> available to request.`}
        </p>
        ${owed > 0 && !hasPending ? `
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <div class="form-group" style="flex:1;min-width:130px;margin-bottom:0">
                <label class="form-label">Amount</label>
                <input type="number" class="form-input" id="myAmount" value="${owed.toFixed(2)}" min="1" max="${owed.toFixed(2)}" step="0.01">
              </div>
              <div class="form-group" style="flex:1;min-width:130px;margin-bottom:0">
                <label class="form-label">Pay Me Via</label>
                <select class="form-input" id="myMethod">
                  <option value="venmo">Venmo</option>
                  <option value="paypal">PayPal</option>
                  <option value="zelle">Zelle</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group" style="flex:2;min-width:160px;margin-bottom:0">
                <label class="form-label">Your Handle / Email</label>
                <input type="text" class="form-input" id="myHandle" placeholder="@handle or email">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Notes (optional)</label>
              <input type="text" class="form-input" id="myNotes" placeholder="Anything we should know?">
            </div>
            <div id="myMsg" style="display:none;font-size:13px;padding:10px;border-radius:6px"></div>
            <button class="btn btn-primary" onclick="submitMyRequest('${token}', ${owed})">Request Cashout</button>
          </div>
        ` : ''}
      </div>

      <!-- Cashout History -->
      <div class="card">
        <h3 style="margin-bottom:16px">Payment History</h3>
        ${!requests || requests.length === 0
          ? '<p class="text-muted text-sm">No requests submitted yet.</p>'
          : `<div class="table-scroll">
              <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:500px">
                <thead>
                  <tr style="border-bottom:2px solid var(--border);text-align:left">
                    <th style="padding:8px">Date</th>
                    <th style="padding:8px">Amount</th>
                    <th style="padding:8px">Via</th>
                    <th style="padding:8px">Handle</th>
                    <th style="padding:8px">Status</th>
                    <th style="padding:8px">Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${requests.map(r => `
                    <tr style="border-bottom:1px solid var(--border)">
                      <td style="padding:8px;color:var(--text-2)">${new Date(r.created_at).toLocaleDateString()}</td>
                      <td style="padding:8px;font-weight:600">$${Number(r.amount).toFixed(2)}</td>
                      <td style="padding:8px;text-transform:capitalize">${r.payment_method}</td>
                      <td style="padding:8px;color:var(--text-2)">${r.payment_handle}</td>
                      <td style="padding:8px">${statusBadge(r.status)}</td>
                      <td style="padding:8px;color:var(--text-3);font-size:13px">${r.admin_note || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>`
        }
      </div>
    </div>
  `;
});

function copyMyRefLink() {
  const link = document.getElementById('myRefLink')?.textContent;
  if (!link) return;
  navigator.clipboard.writeText(link).then(() => {
    const btn = document.querySelector('[onclick="copyMyRefLink()"]');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000); }
  });
}

async function submitMyRequest(token, maxOwed) {
  const amount  = parseFloat(document.getElementById('myAmount')?.value);
  const method  = document.getElementById('myMethod')?.value;
  const handle  = (document.getElementById('myHandle')?.value || '').trim();
  const notes   = (document.getElementById('myNotes')?.value || '').trim();
  const msg     = document.getElementById('myMsg');

  const showMsg = (text, color) => {
    msg.style.display = 'block';
    msg.style.background = `${color}22`;
    msg.style.color = color;
    msg.style.border = `1px solid ${color}40`;
    msg.textContent = text;
  };

  if (!handle) { showMsg('Enter your payment handle or email.', 'var(--red)'); return; }
  if (!amount || amount <= 0) { showMsg('Enter a valid amount.', 'var(--red)'); return; }
  if (amount > maxOwed + 0.01) { showMsg(`Amount can't exceed $${maxOwed.toFixed(2)}.`, 'var(--red)'); return; }

  const { data, error } = await supabase.rpc('submit_cashout_request', {
    p_token:  token,
    p_amount: amount,
    p_method: method,
    p_handle: handle,
    p_notes:  notes || null
  });

  if (error) { showMsg('Error: ' + error.message, 'var(--red)'); return; }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.success) {
    showMsg(result?.error || 'Request failed.', 'var(--red)');
  } else {
    showMsg('Cashout request submitted! You\'ll see the status updated here once it\'s processed.', 'var(--green)');
    document.getElementById('myAmount').disabled = true;
    document.getElementById('myMethod').disabled = true;
    document.getElementById('myHandle').disabled = true;
    document.getElementById('myNotes').disabled = true;
    document.querySelector('[onclick^="submitMyRequest"]').disabled = true;
  }
}
