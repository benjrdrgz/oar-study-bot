// OAR Pro v4 — Admin Sales Dashboard

route('/admin/sales', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');

  // Fetch all paid profiles using service role via RPC or direct query
  // Note: Admin RLS policy must be set up for Benjamin's UID
  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const paidCustomers = (customers || []).filter(c => c.is_paid);
  const previewAccounts = (customers || []).filter(c => c.account_type === 'preview');
  const totalRevenue = paidCustomers.length * 29;

  // Fetch affiliate data
  const { data: affiliates } = await supabase.from('affiliates').select('*');
  const totalCommissions = (affiliates || []).reduce((sum, a) => sum + Number(a.total_earned), 0);

  app.innerHTML = `
    <div style="max-width:1200px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div>
          <h1 style="font-size:28px;font-weight:800">Admin Dashboard</h1>
          <p class="text-muted">OAR Pro Manager Suite</p>
        </div>
        <div style="display:flex;gap:8px">
          <a href="#/admin/affiliates" class="btn btn-secondary btn-sm">Affiliates</a>
          <a href="#/admin/preview" class="btn btn-secondary btn-sm">Preview Accounts</a>
          <button class="btn btn-sm btn-secondary" onclick="exportCSV()">📥 Export CSV</button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid-3 mb-8">
        <div class="card" style="text-align:center">
          <div style="font-size:36px;font-weight:800;color:var(--green)">${paidCustomers.length}</div>
          <div class="text-muted text-sm">Paid Customers</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:36px;font-weight:800;color:var(--accent)">$${totalRevenue.toLocaleString()}</div>
          <div class="text-muted text-sm">Total Revenue</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:36px;font-weight:800;color:var(--yellow)">$${totalCommissions.toFixed(2)}</div>
          <div class="text-muted text-sm">Affiliate Commissions Owed</div>
        </div>
      </div>

      <!-- Customer Table -->
      <div class="card">
        <h3 style="margin-bottom:16px">Customers (${paidCustomers.length})</h3>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="border-bottom:2px solid var(--border);text-align:left">
                <th style="padding:10px">Name</th>
                <th style="padding:10px">Email</th>
                <th style="padding:10px">Type</th>
                <th style="padding:10px">Paid</th>
                <th style="padding:10px">Joined</th>
                <th style="padding:10px">Affiliate</th>
              </tr>
            </thead>
            <tbody id="customerTableBody">
              ${(customers || []).map(c => `
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px">${c.display_name || '—'}</td>
                  <td style="padding:10px;color:var(--text-2)">${c.email}</td>
                  <td style="padding:10px">
                    <span class="badge ${c.account_type === 'admin' ? 'badge-yellow' : c.account_type === 'preview' ? 'badge-blue' : c.is_paid ? 'badge-green' : 'badge-red'}">
                      ${c.account_type === 'admin' ? 'Admin' : c.account_type === 'preview' ? 'Preview' : c.is_paid ? 'Paid' : 'Free'}
                    </span>
                  </td>
                  <td style="padding:10px">${c.paid_at ? new Date(c.paid_at).toLocaleDateString() : '—'}</td>
                  <td style="padding:10px;color:var(--text-3)">${new Date(c.created_at).toLocaleDateString()}</td>
                  <td style="padding:10px;color:var(--text-3)">${c.affiliate_code_used || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
});

function exportCSV() {
  // Simple CSV export of customer data
  const rows = document.querySelectorAll('#customerTableBody tr');
  let csv = 'Name,Email,Type,Paid Date,Joined,Affiliate\\n';
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    csv += Array.from(cells).map(c => `"${c.textContent.trim()}"`).join(',') + '\\n';
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oar-pro-customers-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}
