# DNS and Email Infrastructure Setup Guide

**v1.0 — Complete step-by-step guide for domain purchase, DNS configuration, email setup, and warm-up**

— Benjamin Rodriguez

---

## SECTION 1: DOMAIN STRATEGY

### Why You Need Multiple Domains

You're running a Lead Factory, Site Factory, and Sales Factory. Your cold email campaigns need to hit inboxes, not spam folders. ISPs and Gmail are aggressive about blocking repeated cold email from the same domain. **Solution: Buy 2 separate outreach domains** so you can rotate them and maintain sender reputation.

You also need a **preview/demo domain** where you host sample client websites to send prospects during cold outreach. This shows social proof and lets prospects see exactly what they're paying for.

### Domain Purchase Strategy

**Buy 3 domains total:**

1. **Outreach Domain #1** (primary cold email sender)  
   Example: `localwebsolutions.com`

2. **Outreach Domain #2** (backup/rotation domain)  
   Example: `webpresencepro.com`

3. **Preview/Demo Domain** (host client portfolio sites)  
   Example: `yourneighborhoodweb.com`

### Naming Conventions (Copy-Paste Ready Examples)

**For outreach domains**, use trusted, professional names that feel like an established company:
- localwebsolutions.com
- webpresencepro.com
- sitesforsmallbiz.com
- digitalprofilepro.com
- localbizweb.com
- websitehelpslocal.com

**For demo domain**, something that feels like you host third-party sites:
- yourneighborhoodweb.com
- businesswebhosted.com
- localbusinesssites.com
- webportfoliopro.com

**What NOT to do:**
- Don't use your real name (ben@myname.com looks like personal outreach)
- Don't use "agency" in outreach domains (triggers spam filters)
- Don't use numbers or hyphens in outreach domains
- Keep domains short (2-3 words max)

### Where to Buy: Namecheap or Porkbun

Both registrars are cheap ($8-12/yr per .com) and integrate well with Google Workspace and Netlify.

**Namecheap:**
- Go to namecheap.com
- Search for your 3 domain names
- Add all three to cart
- Use coupon code (check RetailMeNot for current codes) for 10-15% off
- Cost: ~$24-30 for 3 .com domains (first year)
- Renewal: ~$9/domain/year

**Porkbun:**
- Go to porkbun.com
- Search for domain names
- Even cheaper on renewal (sometimes $8/year)
- Same integration capabilities as Namecheap
- Cost: ~$24-30 for 3 .com domains

### Budget Summary

- 3 domains @ $8-12/year average = **$30-36 total annual cost**
- This is per-domain, so if you scale to 3 agencies later, it's ~$100/year
- Registrar costs: negligible

---

## SECTION 2: GOOGLE WORKSPACE SETUP

### Why Google Workspace for Cold Email?

Google Workspace:
- **$7/user/month** (affordable)
- **Built-in email authentication** (SPF, DKIM, DMARC)
- **Built-in calendar + docs** (client management)
- **High deliverability** (Gmail infrastructure)
- **Easy to scale** (add domains, add users, remove without penalty)

Alternative: Zoho Mail ($1/user/month, but worse deliverability for cold email)

### Step-by-Step Google Workspace Setup

#### Step 1: Go to Google Workspace Admin Console

1. Navigate to `workspace.google.com`
2. Click "Get started" or "Sign up for Google Workspace"
3. You'll see a pricing page. Click any plan (Business Starter at $7/user/month is fine)

#### Step 2: Add Your First Domain

1. Enter your **first outreach domain** (e.g., localwebsolutions.com)
2. Google will ask: "Is this your first time signing up?" → Yes
3. Create your initial admin account: `admin@yourdomain.com` (example: `admin@localwebsolutions.com`)
4. Create a strong password (Google will generate one)
5. Verify your domain ownership (Google gives you a TXT record to add at your registrar)

#### Step 3: Verify Domain Ownership

Google gives you a verification TXT record. Go to your registrar (Namecheap or Porkbun):

1. Log into registrar account
2. Find "DNS settings" or "Advanced DNS"
3. Add new TXT record:
   - **Type:** TXT
   - **Name:** @ (or leave blank, depending on registrar)
   - **Value:** `google-site-verification=XXXX...` (copy from Google)
   - **TTL:** 3600 (automatic)
4. Wait 10-30 minutes for propagation
5. Return to Google Workspace setup and click "Verify"

#### Step 4: Create Email Accounts

Once verified, you're in the Google Workspace admin console. Create these email accounts:

**Account 1: Main outreach sender**
- Email: `ben@localwebsolutions.com` (or your name)
- Full Name: Benjamin Rodriguez (or your name)
- Password: Generate strong password
- 2FA: Enable (optional but recommended)

**Account 2: Secondary sender (for replies/support)**
- Email: `hello@localwebsolutions.com`
- Full Name: Your Agency Name
- Password: Generate strong password

**Repeat for Domain #2** (webpresencepro.com):
- `ben@webpresencepro.com`
- `hello@webpresencepro.com`

### Best Practices for Email Account Names

- **Use real first names for cold email** (ben@domain > support@domain)
  - Gmail sees "ben@" as a real person
  - "support@" or "hello@" looks like a company, triggers spam filters
- **Use a generic name for replies** (hello@, info@, etc.)
  - This is where you handle objections and demos
- **Never use numbers or underscores** in outreach addresses
- **Keep names short** (max 15 chars before @)

### Google Workspace MX Record Configuration

Your DNS provider needs to know that Google is handling your email. Add these MX records to your registrar's DNS settings:

**For EACH domain (localwebsolutions.com AND webpresencepro.com):**

Go to registrar DNS settings and add:

| Priority | Record Value |
|----------|---|
| 5 | gmail-smtp-in.l.google.com. |
| 10 | alt1.gmail-smtp-in.l.google.com. |
| 20 | alt2.gmail-smtp-in.l.google.com. |
| 30 | alt3.gmail-smtp-in.l.google.com. |
| 40 | alt4.gmail-smtp-in.l.google.com. |

**How to add MX records:**

1. Log into registrar (Namecheap/Porkbun)
2. Find DNS settings for your domain
3. Look for "MX Records" section
4. Add 5 records with the values above (priority numbers matter)
5. Delete any existing MX records that aren't Google's
6. Wait 30 minutes for propagation

**Verify MX records are working:**
- Use `mxtoolbox.com`
- Search your domain
- Should show 5 MX records all pointing to Google

---

## SECTION 3: DNS RECORDS — SPF, DKIM, DMARC

### What These Records Do (Plain English)

**SPF (Sender Policy Framework):**
Tells email providers: "Only these servers can send email from my domain." Prevents others from impersonating you.

**DKIM (DomainKeys Identified Mail):**
Digital signature on every email saying: "I really sent this, and it hasn't been tampered with." Stops spoofing and improves trustworthiness.

**DMARC (Domain-based Message Authentication, Reporting, and Conformance):**
Meta-rule that says: "If SPF or DKIM fail, what should you do?" Also sends you reports of who's using your domain (catches spoofing attempts).

### SPF Record (Easy)

**What it does:** Tells Gmail/Outlook that Google's servers are allowed to send from your domain.

**Type:** TXT Record  
**Name:** @ (or leave blank, varies by registrar)

**Value (copy-paste exactly):**
```
v=spf1 include:_spf.google.com ~all
```

**How to add it:**

1. Log into registrar (Namecheap/Porkbun)
2. Go to DNS settings for your domain
3. Add new TXT record
4. Set Name to `@` (or leave blank)
5. Paste value above
6. Save

**How to verify it works:**

1. Go to `mxtoolbox.com`
2. Search for "SPF Lookup"
3. Enter your domain
4. Should show the SPF record you just added
5. Status should be green/pass

**Common mistakes:**

- **Mistake:** Adding extra stuff to SPF (like IP addresses)
  - **Fix:** Keep it simple. Just `v=spf1 include:_spf.google.com ~all`
- **Mistake:** Using `~all` vs `-all`
  - **Fix:** Use `~all` (soft fail, tells servers "probably not spam but maybe check")
  - `-all` (hard fail) is stricter and can cause legitimate mail to bounce
- **Mistake:** Multiple SPF records
  - **Fix:** You can only have ONE SPF record per domain. If you add a second, delete the first.

---

### DKIM Record (Requires Google Admin Console)

**What it does:** Digitally signs every email so Gmail/Outlook can verify you sent it and no one modified it in transit.

**Important:** Google auto-generates DKIM for you. You don't create it manually.

**Step-by-step to enable DKIM:**

1. Go to `admin.google.com` (Google Workspace admin console)
2. Log in with your `admin@yourdomain.com` account
3. Go to **Security** (left menu)
4. Scroll down to **Authentication > Authenticate Email**
5. Click on your domain (e.g., localwebsolutions.com)
6. If DKIM is OFF, click **START AUTHENTICATION**
7. Google generates 2 DKIM records automatically (CNAME records)
8. You'll see something like:
   ```
   Name: google._domainkey
   Value: google.c._domainkey.localwebsolutions.com
   ```
9. Copy these values and add them to your registrar's DNS settings
10. **Important:** Wait 24-48 hours for Google to verify the DKIM records
    - Status will say "PENDING" during this time
    - Once verified, status changes to "ACTIVE"

**How to verify DKIM is working:**

1. In Google Admin Console, go back to the same page
2. Status should show "ACTIVE" (green checkmark)
3. On `mxtoolbox.com`, search "DKIM Lookup"
4. Enter your domain
5. Should show the DKIM records

**Common mistakes:**

- **Mistake:** Adding DKIM before Google finishes setup
  - **Fix:** Wait 30 minutes after clicking "Start Authentication"
- **Mistake:** Adding wrong CNAME records
  - **Fix:** Copy directly from Google Admin Console, don't retype
- **Mistake:** Not waiting 24-48 hours
  - **Fix:** Google takes time to verify. Be patient.

---

### DMARC Record (Important for Reputation)

**What it does:** Meta-policy that says "If SPF/DKIM fail, reject the email" and "Send me reports of anyone trying to use my domain."

**Type:** TXT Record  
**Name:** `_dmarc` (exactly this)

**Value (copy-paste):**
```
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

**Replace `yourdomain.com` with your actual domain:**
- Example: `v=DMARC1; p=none; rua=mailto:dmarc@localwebsolutions.com`

**How to add it:**

1. Log into registrar
2. Go to DNS settings
3. Add new TXT record
4. **Name:** `_dmarc` (exactly this)
5. **Value:** Paste the value above (with your domain)
6. Save

**Understanding the value:**
- `v=DMARC1` = DMARC version (always 1)
- `p=none` = Policy: "none" means don't reject emails that fail, just report them
  - Later you can change to `p=quarantine` or `p=reject` if you want stricter rules
- `rua=mailto:dmarc@yourdomain.com` = Send DMARC reports to this email

**How to verify it works:**

1. Go to `mxtoolbox.com`
2. Search "DMARC Lookup"
3. Enter your domain
4. Should show your DMARC record

**Common mistakes:**

- **Mistake:** Using `p=reject` too early
  - **Fix:** Start with `p=none` while you're setting things up. Change to `p=reject` after 30 days of monitoring reports.
- **Mistake:** Forgetting `_dmarc` in the name
  - **Fix:** The underscore is required. It must be `_dmarc`, not `dmarc`
- **Mistake:** Using a wrong email for `rua=`
  - **Fix:** Must be a real email you can access. Google will send DMARC reports here.

---

### Custom Tracking Domain for Instantly.ai

Instantly.ai is your cold email platform. When you send emails, tracking pixels/links go through a domain. If you use Instantly's default tracking domain, your emails get flagged as coming from a mass-mailing service (spam filter red flag).

**Solution:** Create a custom tracking domain so emails look like they're coming directly from you.

**Setup:**

1. In your Instantly.ai account, go to **Settings > Email Integration**
2. Look for "Custom Tracking Domain" or "CNAME"
3. Instantly will give you a CNAME record:
   ```
   Name: click
   Value: cname.instantly.com
   ```
4. Go to your registrar DNS settings
5. Add this CNAME record to your domain
6. Wait 30 minutes
7. In Instantly, click "Verify" to confirm the CNAME is active

**What this does:** When you send emails from Instantly, tracking links look like `click.localwebsolutions.com` instead of `tracking.instantly.io`. Gmail sees it as part of your domain, not a third-party tracker.

**Which domain to use for tracking:**
- Use your **demo/preview domain** (yourneighborhoodweb.com) for the tracking domain
- This keeps it separate from your outreach domains
- Lower chance of tracking links affecting your sender reputation

---

## SECTION 4: INSTANTLY.AI SETUP

### Account Creation

1. Go to `instantly.ai`
2. Click "Sign Up"
3. Create account with your email (can be your personal email, not agency email)
4. Verify email
5. Choose subscription plan:
   - **Starter:** $49/mo (300 emails/day, 3 email accounts)
   - For your first 3 months: use **Starter** (good enough for testing)
   - Later upgrade to **Pro** ($99/mo) if you need more accounts

### Connect Email Accounts

You need to add your 4 email accounts to Instantly (2 from each domain):

1. In Instantly dashboard, go to **Integrations > Email Accounts**
2. Click "Add Email Account"
3. Select "Google Workspace" (not Gmail)
4. Click "Connect with Google"
5. Sign in with your `ben@localwebsolutions.com` account
6. Grant Instantly permission to access email
7. Repeat for:
   - `hello@localwebsolutions.com`
   - `ben@webpresencepro.com`
   - `hello@webpresencepro.com`

**After adding all 4 accounts:**

Check that all show "Connected" (green checkmark)

### Enable Warm-Up on ALL Accounts

Email warm-up is critical. Gmail and Outlook watch your sending behavior:
- If you suddenly send 100 emails/day from a new domain, they block you
- If you gradually increase (5 emails day 1, 10 day 2, 20 day 3...), you're trusted
- Warm-up automates this gradual increase

**Enable warm-up:**

1. In Instantly, go to **Settings > Email Accounts**
2. For each of your 4 accounts, click the account
3. Toggle **Warm-Up: ON**
4. Set warm-up mode: **Standard** (default is fine)

### Warm-Up Settings (Recommended Values)

- **Warm-Up Duration:** 14 days (default)
- **Daily Increase:** Standard (Instantly increases sending limits automatically)
- **Warm-Up Emails/Day:** Start at 5-10, auto-increase to 50-100 by day 14
- **What emails to warm-up with:** Instantly sends to other warm-up accounts (safe, doesn't hit real inboxes)

**Don't change these.** The defaults are proven to work.

### 14-Day Warm-Up Timeline — What to Expect

**Days 1-3:**
- Instantly sends 5-10 warm-up emails/day from each account
- You don't send any real outreach yet
- Wait, even though you're excited
- What's happening: Gmail/Outlook see you're a real sender, builds reputation

**Days 4-7:**
- Warm-up increases to 15-30 emails/day
- Still no real outreach
- Keep waiting
- What's happening: ISPs mark your domain as "reputable sender"

**Days 8-11:**
- Warm-up increases to 30-50 emails/day
- You can start light outreach (50-100 real emails/day if you want)
- But still recommend waiting until day 12

**Days 12-14:**
- Warm-up finishes
- Instant can send 100-200 emails/day (depending on plan)
- Now start your real cold email campaign

**After 14 days:**
- Warm-up auto-disables
- Your domain is "warm" and trusted
- You can send at full limits without fear of spam folder

**Critical rule:** Do NOT disable warm-up early. Let it run the full 14 days. Skipping warm-up = spam folder = $0 responses.

### Daily Sending Limits During and After Warm-Up

**During warm-up (days 1-14):**
- Ben account: 100 emails/day max
- Hello account: 100 emails/day max
- (Warm-up emails don't count toward this limit)

**After warm-up (day 15+):**
- Ben account: 150-200 emails/day
- Hello account: 150-200 emails/day
- Depends on Instantly plan and domain reputation

**Best practice:** Don't max out limits. Send 80% of limit to stay safe:
- Warm-up complete? Send 120-160 emails/day across both accounts
- Gives you headroom if Gmail decides you're slightly suspicious

---

## SECTION 5: NETLIFY SETUP (FOR DEMO SITES)

### Why Netlify?

- Free hosting for static sites (HTML/CSS/JavaScript)
- Auto-scales (no server costs)
- Custom domain support (yourneighborhoodweb.com)
- Free SSL (HTTPS, looks professional)
- Auto-deploys from GitHub (commit code, site updates instantly)

### Account Creation

1. Go to `netlify.com`
2. Click "Sign Up"
3. Choose "Sign up with GitHub" (easiest)
4. Create/authorize GitHub account
5. You're in Netlify dashboard

### Connect to GitHub

Netlify deploys from GitHub repos. When you push code to GitHub, Netlify auto-deploys to your site.

**Setup:**

1. In Netlify dashboard, click "New site from Git"
2. Choose "GitHub"
3. Authorize Netlify to access your GitHub account
4. Select the repo you want to deploy (e.g., `client-website-1`)
5. Set build settings:
   - **Branch to deploy:** main (default)
   - **Build command:** (leave blank if static HTML)
   - **Publish directory:** . (root, if all files are in root)
6. Click "Deploy site"

**Note:** If you're using Lovable to generate sites, export as a folder and push to GitHub. Netlify will deploy it.

### Custom Domain/Subdomain Setup

**For demo sites**, use subdomains under your preview domain:
- `client1.yourneighborhoodweb.com` → Client 1's site
- `client2.yourneighborhoodweb.com` → Client 2's site
- etc.

**Setup steps:**

1. In Netlify site settings, go to **Domain Management**
2. Click "Add Custom Domain"
3. Enter subdomain: `client1.yourneighborhoodweb.com`
4. Netlify asks: "Do you own this domain?" → Yes
5. Netlify gives you nameserver (NS) records to add at your registrar
6. Go to registrar (Namecheap/Porkbun) → DNS settings
7. Replace nameservers with Netlify's nameservers:
   ```
   Nameserver 1: dns1.p04.nsone.net.
   Nameserver 2: dns2.p04.nsone.net.
   Nameserver 3: dns3.p04.nsone.net.
   Nameserver 4: dns4.p04.nsone.net.
   ```
   (Exact values given by Netlify, don't use these)
8. Wait 30 minutes for DNS propagation
9. In Netlify, click "Verify DNS Configuration"
10. Once verified, Netlify auto-provisions SSL

**Alternatively, point to Netlify with CNAME:**

Instead of changing nameservers, add CNAME records:

1. In registrar DNS, add:
   ```
   Name: client1
   Type: CNAME
   Value: your-netlify-domain.netlify.app
   ```
2. This is simpler if you only have a few sites
3. Wait 30 minutes, Netlify auto-activates

### DNS Settings for Preview Domain

Your preview domain (yourneighborhoodweb.com) points to Netlify:

**Option 1: Full nameserver delegation** (recommended for simplicity)
- Change yourneighborhoodweb.com's nameservers to Netlify's
- All DNS (mail, tracking, subdomains) goes through Netlify
- Netlify handles all records

**Option 2: CNAME for main domain**
- Keep yourneighborhoodweb.com at registrar
- Add CNAME for main domain: `@ → your-netlify-domain.netlify.app`
- Some registrars don't allow CNAME at root, so option 1 is safer

**Tracking domain CNAME** (from Section 3):
- Name: `click`
- Type: CNAME
- Value: `cname.instantly.com`
- Add this to Netlify's DNS or registrar's DNS (depending on option chosen)

### How to Deploy a Site

**Assume you have a GitHub repo with your HTML files:**

1. Push code to GitHub (branch: main)
   ```bash
   git add .
   git commit -m "Initial site"
   git push origin main
   ```
2. Go to Netlify dashboard
3. Select your site
4. Watch the "Deploys" tab
5. Netlify automatically detects the push and starts deploying
6. Status changes: Building → Verifying → Published
7. Site is live at your custom domain (e.g., client1.yourneighborhoodweb.com)

**Update the site:**
- Edit code in GitHub
- Commit and push
- Netlify auto-redeploys (30 seconds to 2 minutes)
- Site updated instantly

### How to Set Up SSL

SSL (HTTPS) makes your site secure and trusted (no scary "Not Secure" warning).

**Netlify auto-provisions SSL for free:**

1. Custom domain added (previous steps)
2. Wait 5-10 minutes
3. Netlify auto-creates and activates SSL certificate (Let's Encrypt)
4. Your site is now HTTPS
5. Visitors see a green lock icon in browser
6. No configuration needed

**Verify SSL is active:**

1. Visit your site in browser
2. Look for green lock icon in address bar
3. Click lock → should say "Connection is secure"

**If SSL doesn't activate:**

1. Wait 24 hours (Let's Encrypt needs time)
2. In Netlify settings, go to **SSL/TLS**
3. If still stuck, delete the custom domain and re-add it

---

## SECTION 6: TROUBLESHOOTING

### "My Emails Are Going to Spam" — Checklist

**Run this checklist in order:**

- [ ] **SPF record exists and is correct**
  - Use mxtoolbox.com → SPF Lookup
  - Should show: `v=spf1 include:_spf.google.com ~all`
  - If not, add it to your DNS

- [ ] **DKIM is active**
  - In Google Admin Console → Security → Authenticate Email
  - Status should be "ACTIVE" (green checkmark)
  - If "PENDING," wait 24-48 hours
  - If it never activates, delete and re-add the domain

- [ ] **DMARC record exists**
  - Use mxtoolbox.com → DMARC Lookup
  - Should show your DMARC record with `p=none`
  - If not, add it

- [ ] **Warm-up is enabled in Instantly**
  - In Instantly → Email Accounts → select account
  - Toggle "Warm-Up" should be ON
  - Wait full 14 days before sending real emails

- [ ] **You waited 14 days after adding domain**
  - Gmail takes 2 weeks to build sender reputation
  - If domain is less than 14 days old, ISPs are still evaluating it
  - Solution: Wait. Use second domain for outreach while first one warms up.

- [ ] **Your email list quality is good**
  - Sending to invalid/dead emails triggers spam filters
  - Use email verification before sending (see tools below)
  - Bounce rate should be < 5%

- [ ] **You're not sending too many emails too fast**
  - Don't exceed 150-200 emails/day from one account
  - Spread across both accounts (ben@ and hello@)
  - Don't send to same person 3x in one week (looks like spam)

- [ ] **Subject lines aren't triggering filters**
  - Avoid: "URGENT", "RE:", "LIMITED TIME", all caps
  - Avoid: Multiple exclamation marks, long URLs in subject
  - Keep subject under 50 characters

**If still going to spam after all above:**

- Switch to your second domain (webpresencepro.com)
- Let first domain rest for 7 days
- First domain reputation might be damaged; moving to second domain lets you continue while repairing first

---

### "DKIM Verification Failed" — Fix

**Symptom:** In Google Admin Console, DKIM status says "Failed" or stuck on "Pending" after 48 hours.

**Most common cause:** CNAME record not added to registrar's DNS.

**Fix:**

1. In Google Admin Console, go to Security → Authenticate Email → Your Domain
2. Look at the DKIM records Google generated
3. Copy the CNAME values exactly (including trailing dots)
4. Log into registrar (Namecheap/Porkbun)
5. Go to DNS settings
6. Make sure these CNAME records are added:
   - Example: `google._domainkey` → `google.c._domainkey.localwebsolutions.com.`
7. If already there, delete them and re-add (sometimes registrar caches old values)
8. Wait 30 minutes
9. In Google Admin Console, click "Retry Verification" or refresh the page
10. Status should change to "ACTIVE" after 5-10 minutes

**If still failing:**

- Check for extra spaces in the CNAME value
- Make sure you're copying the entire value (including the trailing dot)
- Try adding with different TTL (600 instead of 3600)
- Contact registrar support if DNS isn't updating

---

### "Site Shows 'Not Secure'" — SSL Fix

**Symptom:** Browser shows a red X or "Not Secure" warning when visiting your site.

**Cause:** SSL certificate not activated or expired.

**Fix:**

1. In Netlify, go to your site settings
2. Click **Domain management**
3. For the custom domain, check **SSL/TLS Certificate**
4. Status should say "Issued" or "Active"
5. If it says "Pending," wait 24 hours (Let's Encrypt takes time)
6. If it says "Failed" or expired:
   - Delete the custom domain
   - Wait 5 minutes
   - Re-add the same custom domain
   - Netlify re-provisions SSL
   - Wait 30 minutes for activation

**If certificate is active but browser still shows "Not Secure":**

1. Force refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Clear browser cache (Chrome → Settings → Clear Browsing Data)
3. Try in incognito window
4. If still failing, clear Netlify cache:
   - In Netlify, click **Deploys**
   - Click **Clear Cache and Redeploy**
   - Wait 5 minutes

---

### "Subdomain Not Working" — DNS Propagation Fix

**Symptom:** You added a CNAME record for `client1.yourneighborhoodweb.com` but it won't resolve.

**Most common causes:**
1. DNS hasn't propagated yet (takes 30 mins to 24 hours)
2. CNAME is pointing to wrong Netlify URL
3. Typo in the CNAME record

**Fix:**

1. **Verify the CNAME is correct in registrar:**
   - Log into registrar
   - Check DNS settings
   - CNAME Name: `client1` (not `client1.yourneighborhoodweb.com`)
   - CNAME Value: Copy exactly from Netlify (e.g., `your-site-123.netlify.app`)

2. **Check if DNS propagated:**
   - Go to `mxtoolbox.com`
   - Search "CNAME Lookup"
   - Enter: `client1.yourneighborhoodweb.com`
   - Should show the CNAME record you added
   - If not, DNS hasn't propagated yet. Wait 30 minutes and try again.

3. **Force Netlify to re-check:**
   - In Netlify site settings, delete the domain
   - Wait 5 minutes
   - Re-add the domain
   - Netlify re-provisions CNAME/SSL
   - Wait 30 minutes

4. **If mxtoolbox shows CNAME but site still doesn't work:**
   - DNS is correct, but Netlify might be slow
   - Wait another 30 minutes
   - Try different browser/incognito window
   - Clear your browser's DNS cache (usually fixes this):
     - Chrome: Type `chrome://net-internals/#dns` → Flush DNS Cache
     - Safari: Close all Safari windows and reopen

---

### Email Deliverability Testing Tools

Use these tools to diagnose delivery issues:

**Mail-Tester (mail-tester.com):**
- Send a test email to their address
- Shows your spam score and common problems
- Tells you which filters might block you
- Free version: 1 test/day
- Use this weekly to monitor

**MXToolbox (mxtoolbox.com):**
- Diagnostic tool for all DNS records
- SPF Lookup: Check if SPF record exists
- DKIM Lookup: Check if DKIM is active
- DMARC Lookup: Check if DMARC record exists
- Blacklist Check: See if your domain/IP is on spam blacklists
- Free, unlimited

**Gmail Postmaster Tools (postmaster.google.com):**
- Shows how Gmail sees your domain
- Reports on bounce rate, spam complaints, authentication
- Requires domain ownership (add TXT verification)
- Free
- Check weekly

**250ok.com (250ok.com):**
- Advanced deliverability testing
- Shows how different email providers rate your domain
- Free trial, then paid

**How to use these:**

1. **Week 1:** Use mail-tester + MXToolbox to verify SPF/DKIM/DMARC
2. **Week 2-4:** Send test emails with mail-tester (weekly)
3. **Ongoing:** Use postmaster.google.com to monitor bounce/spam complaint rates

---

## SECTION 7: VERIFICATION CHECKLIST

**Run this checklist after completing all sections above. Do not start cold email outreach until ALL items are checked.**

### Outreach Domain #1 (localwebsolutions.com)
- [ ] **Purchased on registrar**
- [ ] **MX records added and verified** (mxtoolbox.com)
- [ ] **SPF record added:** `v=spf1 include:_spf.google.com ~all`
- [ ] **DKIM enabled in Google Admin Console** (status: ACTIVE)
- [ ] **DMARC record added:** `v=DMARC1; p=none; rua=mailto:dmarc@localwebsolutions.com`
- [ ] **Google Workspace email accounts created:**
  - [ ] `ben@localwebsolutions.com`
  - [ ] `hello@localwebsolutions.com`
- [ ] **Instantly.ai connected:**
  - [ ] Both accounts added to Instantly
  - [ ] Warm-up enabled on both accounts
- [ ] **Warm-up countdown started** (14 days)
- [ ] **Test email sent** (can receive email from both accounts)

### Outreach Domain #2 (webpresencepro.com)
- [ ] **Purchased on registrar**
- [ ] **MX records added and verified**
- [ ] **SPF record added**
- [ ] **DKIM enabled in Google Admin Console** (status: ACTIVE)
- [ ] **DMARC record added**
- [ ] **Google Workspace email accounts created:**
  - [ ] `ben@webpresencepro.com`
  - [ ] `hello@webpresencepro.com`
- [ ] **Instantly.ai connected:**
  - [ ] Both accounts added to Instantly
  - [ ] Warm-up enabled on both accounts
- [ ] **Warm-up countdown started** (14 days)
- [ ] **Test email sent**

### Preview/Demo Domain (yourneighborhoodweb.com)
- [ ] **Purchased on registrar**
- [ ] **Netlify account created**
- [ ] **GitHub connected to Netlify**
- [ ] **Domain/nameservers or CNAME added** (custom domain configured)
- [ ] **SSL certificate provisioned** (green lock icon visible)
- [ ] **At least 1 sample site deployed** (accessible at youneighborhoodweb.com or subdomain)
- [ ] **Tracking domain CNAME added:**
  - [ ] Name: `click`
  - [ ] Value: `cname.instantly.com`
- [ ] **Tracking domain verified in Instantly**

### Instantly.ai Full Setup
- [ ] **Account created**
- [ ] **All 4 email accounts connected** (2 from each domain)
- [ ] **Warm-up enabled on all 4 accounts**
- [ ] **Custom tracking domain configured** (click.yourneighborhoodweb.com)
- [ ] **Email list imported** (or ready to import)
- [ ] **Campaign template created** (ready to send after warm-up)

### Final Tests (Days 12-14 of Warm-Up)
- [ ] **Sent test email from ben@localwebsolutions.com** to personal account
  - [ ] Email arrived in Inbox (not Spam)
  - [ ] Subject line isn't suspicious
  - [ ] Links are clean (not flagged as suspicious)
- [ ] **Sent test email from ben@webpresencepro.com** to personal account
  - [ ] Same checks as above
- [ ] **Ran mail-tester.com test**
  - [ ] Score ≥ 8/10
  - [ ] No critical DNS errors
- [ ] **Ran postmaster.google.com check**
  - [ ] Domains appear in "Manage domains"
  - [ ] Authentication status: PASS

### Ready to Launch Cold Email
- [ ] **All 14 days of warm-up complete**
- [ ] **Email list verified** (bounce rate < 5%)
- [ ] **First campaign ready**
- [ ] **Demo sites ready** (can send links in email)
- [ ] **Reply email template ready** (for objections/questions)
- [ ] **Calendar open** (to schedule demos with interested prospects)

---

## NEXT STEPS

1. **Today (Day 1):** Buy 3 domains. Registrar setup takes 1 hour.
2. **Today (Day 1):** Set up Google Workspace. Add MX/SPF/DKIM/DMARC records. Takes 2 hours.
3. **Today (Day 1):** Create Instantly.ai account. Connect 4 email accounts. Enable warm-up. Takes 30 minutes.
4. **Today (Day 1):** Set up Netlify. Deploy first demo site. Takes 1 hour.
5. **Days 2-14:** Wait. Warm-up runs. Prepare your email list and cold email script.
6. **Day 15:** Start cold email outreach.

**Total setup time: ~4 hours**
**Total cost: ~$36 domain + $7 Google Workspace + $49 Instantly = $92/month (then $63/month after first month)**

---

— Benjamin Rodriguez
