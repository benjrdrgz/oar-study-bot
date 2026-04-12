// OAR Pro v4 — Admin Preview Account Management

route('/admin/preview', async () => {
  const app = document.getElementById('app');
  app.classList.remove('full-width');

  const { data: previews } = await supabase
    .from('profiles')
    .select('*')
    .eq('account_type', 'preview')
    .order('created_at', { ascending: false });

  app.innerHTML = `
    <div style="max-width:800px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div>
          <h1 style="font-size:28px;font-weight:800">Preview Accounts</h1>
          <p class="text-muted">Create demo accounts for recruiters to preview OAR Pro</p>
        </div>
        <a href="#/admin/sales" class="btn btn-secondary btn-sm">← Back to Sales</a>
      </div>

      <!-- Create Preview Account -->
      <div class="card mb-8">
        <h3 style="margin-bottom:16px">Create Preview Account</h3>
        <p class="text-muted text-sm mb-4">The recruiter will receive an email with login instructions. Preview accounts can access all content but are watermarked.</p>
        <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
          <div class="form-group" style="flex:1;min-width:180px;margin-bottom:0">
            <label class="form-label">Recruiter Name</label>
            <input type="text" class="form-input" id="prevName" placeholder="Lt. Smith">
          </div>
          <div class="form-group" style="flex:1;min-width:200px;margin-bottom:0">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="prevEmail" placeholder="smith@navy.mil">
          </div>
          <div class="form-group" style="width:160px;margin-bottom:0">
            <label class="form-label">Temp Password</label>
            <input type="text" class="form-input" id="prevPassword" value="${generateTempPassword()}">
          </div>
          <button class="btn btn-primary" onclick="createPreviewAccount()">Create Account</button>
        </div>
        <div id="prevResult" style="margin-top:12px;display:none"></div>
      </div>

      <!-- Existing Preview Accounts -->
      <div class="card">
        <h3 style="margin-bottom:16px">Active Preview Accounts (${(previews || []).length})</h3>
        ${(previews || []).length === 0 ? '<p class="text-muted">No preview accounts created yet.</p>' :
          `<table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="border-bottom:2px solid var(--border);text-align:left">
                <th style="padding:10px">Name</th>
                <th style="padding:10px">Email</th>
                <th style="padding:10px">Created</th>
                <th style="padding:10px">Status</th>
                <th style="padding:10px">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${previews.map(p => `
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px">${p.display_name || '—'}</td>
                  <td style="padding:10px;color:var(--text-2)">${p.email}</td>
                  <td style="padding:10px;color:var(--text-3)">${new Date(p.created_at).toLocaleDateString()}</td>
                  <td style="padding:10px">
                    <span class="badge ${p.is_paid ? 'badge-blue' : 'badge-red'}">${p.is_paid ? 'Active' : 'Revoked'}</span>
                  </td>
                  <td style="padding:10px">
                    ${p.is_paid ?
                      `<button class="btn btn-sm btn-danger" onclick="revokePreview('${p.id}')">Revoke</button>` :
                      `<button class="btn btn-sm btn-success" onclick="restorePreview('${p.id}')">Restore</button>`
                    }
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

function generateTempPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = 'OAR-';
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function createPreviewAccount() {
  const name = document.getElementById('prevName').value.trim();
  const email = document.getElementById('prevEmail').value.trim();
  const password = document.getElementById('prevPassword').value.trim();
  const result = document.getElementById('prevResult');

  if (!name || !email || !password) {
    result.style.display = 'block';
    result.innerHTML = '<span style="color:var(--red)">All fields are required</span>';
    return;
  }

  try {
    // Save admin session BEFORE creating the preview account
    // (otherwise supabase.auth.signUp will sign the admin out)
    const { data: { session: adminSession } } = await supabase.auth.getSession();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } }
    });

    if (authError) throw authError;

    // Update profile to preview account
    if (authData.user) {
      await supabase.from('profiles').update({
        display_name: name,
        account_type: 'preview',
        is_paid: true
      }).eq('id', authData.user.id);
    }

    // Restore admin session so the admin stays logged in
    if (adminSession) {
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token
      });
    }

    result.style.display = 'block';
    result.innerHTML = `
      <div style="background:var(--green-bg);border:1px solid rgba(16,185,129,.3);border-radius:8px;padding:12px">
        <div style="color:var(--green);font-weight:700;margin-bottom:4px">✅ Preview account created!</div>
        <div style="font-size:13px;color:var(--text-2)">
          Email: <strong>${email}</strong><br>
          Password: <strong>${password}</strong><br>
          Send these credentials to the recruiter.
        </div>
      </div>
    `;

    // Refresh after delay
    setTimeout(() => navigate('#/admin/preview'), 3000);
  } catch (err) {
    result.style.display = 'block';
    result.innerHTML = `<span style="color:var(--red)">Error: ${err.message}</span>`;
  }
}

async function revokePreview(profileId) {
  if (!confirm('Revoke this preview account? They will lose access to content.')) return;

  await supabase.from('profiles').update({
    is_paid: false
  }).eq('id', profileId);

  navigate('#/admin/preview');
}

async function restorePreview(profileId) {
  await supabase.from('profiles').update({
    is_paid: true
  }).eq('id', profileId);

  navigate('#/admin/preview');
}
