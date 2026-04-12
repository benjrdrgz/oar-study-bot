// OAR Pro v4 — Admin Affiliate Management

route('/admin/affiliates', async () => {
  const app = document.getElementById('app');
  app.classList.remove('full-width');

  const { data: affiliates } = await supabase
    .from('affiliates')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: referrals } = await supabase
    .from('affiliate_referrals')
    .select('*, affiliates(name, code)')
    .order('created_at', { ascending: false });

  const { data: cashoutRequests } = await supabase
    .from('cashout_requests')
    .select('*, affiliates(name, code)')
    .order('created_at', { ascending: false });

  const totalOwed = (affiliates || []).reduce((sum, a) => sum + Number(a.total_earned) - Number(a.total_paid), 0);
  const pendingCashouts = (cashoutRequests || []).filter(r => r.status === 'pending');
  const totalPendingCashout = pendingCashouts.reduce((sum, r) => sum + Number(r.amount), 0);

  app.innerHTML = `
    <div style="max-width:1000px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div>
          <h1 style="font-size:28px;font-weight:800">Affiliate Management</h1>
          <p class="text-muted">Create codes, track referrals, manage payouts</p>
        </div>
        <div style="display:flex;gap:8px">
          <a href="#/admin/sales" class="btn btn-secondary btn-sm">← Back to Sales</a>
        </div>
      </div>

      <!-- Create Affiliate -->
      <div class="card mb-8">
        <h3 style="margin-bottom:16px">Create New Affiliate Code</h3>
        <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
          <div class="form-group" style="flex:1;min-width:150px;margin-bottom:0">
            <label class="form-label">Recruiter Name</label>
            <input type="text" class="form-input" id="affName" placeholder="Sgt. Jones">
          </div>
          <div class="form-group" style="flex:1;min-width:150px;margin-bottom:0">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="affEmail" placeholder="jones@navy.mil">
          </div>
          <div class="form-group" style="width:150px;margin-bottom:0">
            <label class="form-label">Code</label>
            <input type="text" class="form-input" id="affCode" placeholder="JONES" style="text-transform:uppercase">
          </div>
          <div class="form-group" style="width:100px;margin-bottom:0">
            <label class="form-label">Commission %</label>
            <input type="number" class="form-input" id="affRate" value="20" min="0" max="50">
          </div>
          <button class="btn btn-primary" onclick="createAffiliate()">Create</button>
        </div>
        <div id="affResult" style="margin-top:12px;display:none"></div>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:32px">
        <div class="card" style="text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--accent)">${(affiliates || []).length}</div>
          <div class="text-muted text-sm">Active Affiliates</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--green)">${(referrals || []).length}</div>
          <div class="text-muted text-sm">Total Referrals</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--red)">$${totalOwed.toFixed(2)}</div>
          <div class="text-muted text-sm">Outstanding Payouts</div>
        </div>
        <div class="card" style="text-align:center;${pendingCashouts.length > 0 ? 'border-color:var(--yellow)' : ''}">
          <div style="font-size:28px;font-weight:800;color:var(--yellow)">${pendingCashouts.length}</div>
          <div class="text-muted text-sm">Pending Cashouts${totalPendingCashout > 0 ? ` ($${totalPendingCashout.toFixed(2)})` : ''}</div>
        </div>
      </div>

      <!-- Affiliates Table -->
      <div class="card mb-8">
        <h3 style="margin-bottom:16px">All Affiliates</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead>
            <tr style="border-bottom:2px solid var(--border);text-align:left">
              <th style="padding:10px">Name</th>
              <th style="padding:10px">Code</th>
              <th style="padding:10px">Status</th>
              <th style="padding:10px">Referral Link</th>
              <th style="padding:10px">Portal</th>
              <th style="padding:10px">Rate</th>
              <th style="padding:10px">Referrals</th>
              <th style="padding:10px">Earned</th>
              <th style="padding:10px">Paid</th>
              <th style="padding:10px">Owed</th>
              <th style="padding:10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${(affiliates || []).map(a => {
              const owed = Number(a.total_earned) - Number(a.total_paid);
              const isActive = a.active !== false;
              return `
              <tr style="border-bottom:1px solid var(--border);opacity:${isActive ? '1' : '0.5'}">
                <td style="padding:10px">${a.name}${a.email ? `<br><span style="font-size:12px;color:var(--text-3)">${a.email}</span>` : ''}</td>
                <td style="padding:10px"><code style="background:var(--surface-2);padding:2px 8px;border-radius:4px">${a.code}</code></td>
                <td style="padding:10px">
                  <span class="badge ${isActive ? 'badge-green' : 'badge-red'}">${isActive ? 'Active' : 'Paused'}</span>
                </td>
                <td style="padding:10px;font-size:12px;color:var(--text-3)">
                  <span style="cursor:pointer" onclick="copyLink('${a.code}')" title="Click to copy">📋 Copy</span>
                </td>
                <td style="padding:10px;font-size:12px">
                  ${a.portal_token
                    ? `<span style="cursor:pointer;color:var(--accent)" onclick="copyPortalLinkAdmin('${a.portal_token}')" title="Copy their private portal link">🔗 Copy</span>`
                    : '<span style="color:var(--text-3)">—</span>'}
                </td>
                <td style="padding:10px">${(Number(a.commission_rate) * 100).toFixed(0)}%</td>
                <td style="padding:10px;font-weight:600">${a.total_referred}</td>
                <td style="padding:10px;color:var(--green)">$${Number(a.total_earned).toFixed(2)}</td>
                <td style="padding:10px">$${Number(a.total_paid).toFixed(2)}</td>
                <td style="padding:10px;color:${owed > 0 ? 'var(--red)' : 'var(--text-3)'};font-weight:${owed > 0 ? '700' : '400'}">$${owed.toFixed(2)}</td>
                <td style="padding:10px">
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    ${owed > 0 ? `<button class="btn btn-sm btn-success" onclick="markPaid('${a.id}', ${owed})">Mark Paid</button>` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="toggleAffiliate('${a.id}', ${isActive})" title="${isActive ? 'Pause' : 'Activate'}">${isActive ? '⏸' : '▶'}</button>
                    <button class="btn btn-sm" style="background:var(--red-bg);color:var(--red);border-color:var(--red)40" onclick="deleteAffiliate('${a.id}', '${a.name}', ${a.total_referred})" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Recent Referrals -->
      <div class="card">
        <h3 style="margin-bottom:16px">Recent Referrals</h3>
        ${(referrals || []).length === 0 ? '<p class="text-muted">No referrals yet.</p>' :
          `<table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="border-bottom:2px solid var(--border);text-align:left">
                <th style="padding:10px">Date</th>
                <th style="padding:10px">Affiliate</th>
                <th style="padding:10px">Sale</th>
                <th style="padding:10px">Commission</th>
                <th style="padding:10px">Status</th>
              </tr>
            </thead>
            <tbody>
              ${referrals.map(r => `
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px">${new Date(r.created_at).toLocaleDateString()}</td>
                  <td style="padding:10px">${r.affiliates?.name || '—'} (${r.affiliates?.code || '—'})</td>
                  <td style="padding:10px">$${Number(r.purchase_amount).toFixed(2)}</td>
                  <td style="padding:10px;color:var(--green)">$${Number(r.commission_amount).toFixed(2)}</td>
                  <td style="padding:10px">
                    <span class="badge ${r.paid_out ? 'badge-green' : 'badge-yellow'}">${r.paid_out ? 'Paid' : 'Pending'}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>`
        }
      </div>

      <!-- Cashout Requests -->
      <div class="card" style="margin-top:32px;${pendingCashouts.length > 0 ? 'border-color:var(--yellow)' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="margin:0">Cashout Requests</h3>
          ${pendingCashouts.length > 0 ? `<span class="badge badge-yellow">${pendingCashouts.length} pending</span>` : ''}
        </div>
        ${!cashoutRequests || cashoutRequests.length === 0
          ? '<p class="text-muted">No cashout requests yet.</p>'
          : `<table style="width:100%;border-collapse:collapse;font-size:14px">
              <thead>
                <tr style="border-bottom:2px solid var(--border);text-align:left">
                  <th style="padding:10px">Date</th>
                  <th style="padding:10px">Affiliate</th>
                  <th style="padding:10px">Amount</th>
                  <th style="padding:10px">Via</th>
                  <th style="padding:10px">Handle</th>
                  <th style="padding:10px">Status</th>
                  <th style="padding:10px">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${cashoutRequests.map(r => `
                  <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:10px;color:var(--text-2)">${new Date(r.created_at).toLocaleDateString()}</td>
                    <td style="padding:10px;font-weight:600">${r.affiliates?.name || '—'} (${r.affiliates?.code || '—'})</td>
                    <td style="padding:10px;font-weight:700;color:var(--yellow)">$${Number(r.amount).toFixed(2)}</td>
                    <td style="padding:10px;text-transform:capitalize">${r.payment_method}</td>
                    <td style="padding:10px"><code style="background:var(--surface-2);padding:2px 8px;border-radius:4px;font-size:12px">${r.payment_handle}</code></td>
                    <td style="padding:10px">
                      <span class="badge ${{pending:'badge-yellow',approved:'badge-blue',paid:'badge-green',rejected:'badge-red'}[r.status] || ''}">${r.status}</span>
                    </td>
                    <td style="padding:10px">
                      <div style="display:flex;gap:6px;flex-wrap:wrap">
                        ${r.status === 'pending' ? `
                          <button class="btn btn-sm btn-success" onclick="processCashout('${r.id}', 'paid', ${Number(r.amount)}, '${r.affiliate_id}')">Mark Paid</button>
                          <button class="btn btn-sm btn-secondary" onclick="processCashout('${r.id}', 'rejected', 0, '${r.affiliate_id}')">Reject</button>
                        ` : '—'}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`
        }
      </div>
    </div>
  `;
});

async function createAffiliate() {
  const name = document.getElementById('affName').value.trim();
  const email = document.getElementById('affEmail').value.trim();
  const code = document.getElementById('affCode').value.trim().toUpperCase();
  const rate = parseInt(document.getElementById('affRate').value) / 100;
  const result = document.getElementById('affResult');

  if (!name || !code) {
    result.style.display = 'block';
    result.innerHTML = '<span style="color:var(--red)">Name and code are required</span>';
    return;
  }

  const { data, error } = await supabase.from('affiliates').insert({
    name, email: email || null, code, commission_rate: rate
  }).select().single();

  if (error) {
    result.style.display = 'block';
    result.innerHTML = `<span style="color:var(--red)">Error: ${error.message}</span>`;
  } else {
    const link = `${window.location.origin}${window.location.pathname}#/?ref=${code}`;
    result.style.display = 'block';
    result.innerHTML = `<span style="color:var(--green)">✅ Created! Link: <code style="background:var(--surface-2);padding:4px 8px;border-radius:4px;user-select:all">${link}</code></span>`;
    // Refresh the page after 2 seconds
    setTimeout(() => navigate('#/admin/affiliates'), 2000);
  }
}

function copyLink(code) {
  const link = `${window.location.origin}${window.location.pathname}#/?ref=${code}`;
  navigator.clipboard.writeText(link).then(() => {
    alert(`Copied: ${link}`);
  });
}

async function toggleAffiliate(affiliateId, currentActive) {
  const action = currentActive ? 'pause' : 'activate';
  if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this affiliate? ${currentActive ? 'Their code will stop generating discounts.' : 'Their code will work again.'}`)) return;

  const { error } = await supabase.from('affiliates').update({ active: !currentActive }).eq('id', affiliateId);
  if (error) { alert('Error: ' + error.message); return; }
  navigate('#/admin/affiliates');
}

async function deleteAffiliate(affiliateId, name, totalReferred) {
  const hasReferrals = totalReferred > 0;
  const msg = hasReferrals
    ? `Delete ${name}? They have ${totalReferred} referral(s). Referral records will be kept for accounting but the affiliate code will be removed. Type DELETE to confirm.`
    : `Delete ${name}? This cannot be undone. Type DELETE to confirm.`;
  if (prompt(msg) !== 'DELETE') return;

  // If they have referrals, keep referral records but detach by nulling affiliate_id
  if (hasReferrals) {
    await supabase.from('affiliate_referrals').update({ affiliate_id: null }).eq('affiliate_id', affiliateId);
  }

  const { error } = await supabase.from('affiliates').delete().eq('id', affiliateId);
  if (error) { alert('Error: ' + error.message); return; }
  navigate('#/admin/affiliates');
}

async function markPaid(affiliateId, amount) {
  if (!confirm(`Mark $${amount.toFixed(2)} as paid?`)) return;

  // Fetch current total_paid and accumulate, don't overwrite
  const { data: existing } = await supabase
    .from('affiliates')
    .select('total_paid')
    .eq('id', affiliateId)
    .single();

  const newTotal = (Number(existing?.total_paid) || 0) + Number(amount);

  await supabase.from('affiliates').update({
    total_paid: newTotal
  }).eq('id', affiliateId);

  // Mark all unpaid referrals for this affiliate as paid
  await supabase.from('affiliate_referrals').update({
    paid_out: true,
    paid_at: new Date().toISOString()
  }).eq('affiliate_id', affiliateId).eq('paid_out', false);

  navigate('#/admin/affiliates');
}

function copyPortalLinkAdmin(portalToken) {
  const link = `${window.location.origin}${window.location.pathname}#/affiliate/${portalToken}`;
  navigator.clipboard.writeText(link).then(() => alert(`Portal link copied!\n\nShare this privately with the affiliate:\n${link}`));
}

async function processCashout(requestId, action, amount, affiliateId) {
  const label = action === 'paid' ? `Mark $${Number(amount).toFixed(2)} as paid?` : 'Reject this cashout request?';
  if (!confirm(label)) return;
  const adminNote = action === 'rejected' ? (prompt('Rejection reason (optional):') || '') : '';

  await supabase.from('cashout_requests').update({
    status: action,
    admin_note: adminNote || null,
    processed_at: new Date().toISOString()
  }).eq('id', requestId);

  if (action === 'paid' && Number(amount) > 0) {
    const { data: existing } = await supabase
      .from('affiliates').select('total_paid').eq('id', affiliateId).single();
    const newTotal = (Number(existing?.total_paid) || 0) + Number(amount);
    await supabase.from('affiliates').update({ total_paid: newTotal }).eq('id', affiliateId);
    await supabase.from('affiliate_referrals').update({
      paid_out: true, paid_at: new Date().toISOString()
    }).eq('affiliate_id', affiliateId).eq('paid_out', false);
  }

  navigate('#/admin/affiliates');
}
