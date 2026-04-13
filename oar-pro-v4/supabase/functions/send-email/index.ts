// send-email — OAR Pro transactional email via Resend
// All 5 nurture sequence templates live here.
// Called by capture-lead (welcome) and send-nurture cron (D+1/3/7/14).
// — Benjamin Rodriguez

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'hello@armedprep.com'
const SITE_URL = 'https://oar.armedprep.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Template registry ──────────────────────────────────────────────────────

interface EmailTemplate {
  subject: string
  html: string
}

type TemplateVars = Record<string, unknown>

const TEMPLATES: Record<string, (vars: TemplateVars) => EmailTemplate> = {
  welcome: (vars) => ({
    subject: `Your OAR score: ${vars.diag_score} — here's where to start`,
    html: welcomeHtml(vars),
  }),
  day1: (vars) => ({
    subject: 'Most OAR candidates waste 40% of their study time on this',
    html: day1Html(vars),
  }),
  day3: (vars) => ({
    subject: 'How to go from borderline to competitive in 3 weeks',
    html: day3Html(vars),
  }),
  day7: (vars) => ({
    subject: 'Quick check-in — are you still prepping?',
    html: day7Html(vars),
  }),
  day14: (vars) => ({
    subject: '10% off OAR Pro — expires in 48 hours',
    html: day14Html(vars),
  }),
}

// ─── Handler ────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set — skipping email send')
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'RESEND_API_KEY not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { to, template, vars = {} } = await req.json()

    if (!to || !template) {
      return new Response(JSON.stringify({ error: 'to and template are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const tmplFn = TEMPLATES[template]
    if (!tmplFn) {
      return new Response(JSON.stringify({ error: `unknown template: ${template}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { subject, html } = tmplFn(vars)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `OAR Pro <${FROM_EMAIL}>`,
        to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Resend API error:', res.status, errBody)
      return new Response(JSON.stringify({ error: errBody }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('send-email error:', msg)
    return new Response(JSON.stringify({ error: 'internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// ─── Shared layout ───────────────────────────────────────────────────────────

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>OAR Pro</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      -webkit-font-smoothing: antialiased;
    }
    .wrap { max-width: 560px; margin: 0 auto; padding: 40px 24px 60px; }
    .logo {
      font-size: 13px; font-weight: 700; letter-spacing: .1em;
      text-transform: uppercase; color: #2563eb; margin-bottom: 32px;
    }
    .card {
      background: #161b22; border: 1px solid #30363d;
      border-radius: 8px; padding: 20px 24px; margin-bottom: 16px;
    }
    h2 { font-size: 22px; color: #e6edf3; margin-bottom: 14px; line-height: 1.3; }
    p { color: #c9d1d9; line-height: 1.65; margin-bottom: 14px; font-size: 15px; }
    .btn {
      display: inline-block; background: #2563eb; color: #ffffff !important;
      padding: 13px 26px; border-radius: 6px; text-decoration: none;
      font-weight: 600; font-size: 15px; margin: 6px 0;
    }
    .muted { color: #6e7681; font-size: 12px; }
    .highlight { color: #f59e0b; font-weight: 600; }
    .divider { border: none; border-top: 1px solid #21262d; margin: 24px 0; }
    ul { color: #c9d1d9; font-size: 15px; line-height: 1.8; padding-left: 20px; margin-bottom: 14px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">OAR Pro</div>
    ${content}
    <hr class="divider">
    <p class="muted">
      You're getting this because you took the free OAR diagnostic at oarpro.com.<br>
      <a href="${SITE_URL}/#/unsubscribe?email={{email}}" style="color:#6e7681">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`
}

// ─── Email #1 — Welcome / Personalized study plan ────────────────────────────

function welcomeHtml(vars: TemplateVars): string {
  const score = Number(vars.diag_score) || 0
  const weak = String(vars.weak_section || 'Math')

  let scoreContext: string
  if (score >= 55) {
    scoreContext = `You're already competitive for most billets. A focused push on <span class="highlight">${weak}</span> could push you into aviation territory (52+ required).`
  } else if (score >= 45) {
    scoreContext = `You're borderline. Small gains in <span class="highlight">${weak}</span> will open up the billets you're targeting.`
  } else if (score >= 35) {
    scoreContext = `You're below most cutoffs right now. That's fixable — the math and reading on the OAR are coachable with focused practice on <span class="highlight">${weak}</span>.`
  } else {
    scoreContext = `You've got significant room to improve. The good news: the OAR tests coachable skills. Starting with <span class="highlight">${weak}</span> will give you the fastest gains.`
  }

  return emailLayout(`
    <h2>Your predicted OAR score: <span style="color:#2563eb">${score}</span></h2>
    <p>${scoreContext}</p>

    <div class="card">
      <p style="font-weight:600;margin-bottom:6px">Your study priority order:</p>
      <ol style="color:#c9d1d9;font-size:15px;line-height:1.8;padding-left:20px">
        <li><strong>${weak}</strong> — your weakest section, highest ROI</li>
        <li>Math — arithmetic and algebra before geometry</li>
        <li>Mechanical — concepts repeat, so it's trainable fast</li>
      </ol>
    </div>

    <p>The full platform has 220 practice questions, 20 lesson modules, and an adaptive test that automatically targets your weak topics.</p>

    <a href="${SITE_URL}/#/checkout?test=OAR" class="btn">Get OAR Pro — $97 →</a>
    <p class="muted" style="margin-top:10px">One-time payment · Lifetime access · 30-day money-back guarantee</p>
  `)
}

// ─── Email #2 — Day +1 ───────────────────────────────────────────────────────

function day1Html(_vars: TemplateVars): string {
  return emailLayout(`
    <h2>The mistake that tanks most OAR scores</h2>
    <p>Most candidates default to studying geometry. It feels like "real" math, so it gets the most time.</p>
    <p>The OAR doesn't weight it that way.</p>

    <div class="card">
      <p style="font-weight:600;margin-bottom:8px">What actually appears on the Math section:</p>
      <ul>
        <li>Arithmetic / Word Problems — ~40%</li>
        <li>Algebra (linear equations, functions) — ~35%</li>
        <li>Geometry — ~25%</li>
      </ul>
    </div>

    <p>If you're pressed for time, drill arithmetic and algebra first. That's where the points are. Geometry is the last 25% — don't let it take 50% of your prep time.</p>

    <a href="${SITE_URL}/#/diagnostic" class="btn">Retake the free diagnostic →</a>
    <p class="muted" style="margin-top:10px">
      Or <a href="${SITE_URL}/#/checkout?test=OAR" style="color:#6e7681">get the full platform for $97</a>
    </p>
  `)
}

// ─── Email #3 — Day +3 ───────────────────────────────────────────────────────

function day3Html(_vars: TemplateVars): string {
  return emailLayout(`
    <h2>Short sessions beat marathon cramming</h2>
    <p>The candidates who crack 55+ usually share one habit: they don't cram.</p>
    <p>20–30 minutes a day for 3 weeks outperforms 8-hour sessions the weekend before. Your brain consolidates practice from the night before during sleep. That's not motivational content — it's how memory consolidation works.</p>

    <div class="card">
      <p style="font-weight:600;margin-bottom:8px">If your test is 3+ weeks out:</p>
      <p style="margin:0">Pick one section. Do 20 minutes. Review your wrong answers. Stop. Repeat tomorrow.</p>
    </div>

    <p>The adaptive test in OAR Pro does this automatically — it identifies your weak topics and queues the right questions. No planning required.</p>

    <a href="${SITE_URL}/#/checkout?test=OAR" class="btn">Get OAR Pro — $97 →</a>
  `)
}

// ─── Email #4 — Day +7 ───────────────────────────────────────────────────────

function day7Html(vars: TemplateVars): string {
  const score = Number(vars.diag_score) || 0
  const scoreNote = score > 0 ? ` since you scored ${score} on the diagnostic` : ''

  return emailLayout(`
    <h2>Quick check-in</h2>
    <p>It's been a week${scoreNote}.</p>
    <p>A week of 20-minute sessions is ~140 minutes of practice. That's enough to move your score 3–5 points on the sections you're drilling.</p>
    <p>If you've been working on your own, keep going. If you've stalled — the most common reason is not knowing what to study next. The platform removes that friction.</p>

    <a href="${SITE_URL}/#/checkout?test=OAR" class="btn">Remove the friction — $97 →</a>
    <p class="muted" style="margin-top:10px">30-day money-back guarantee. No risk.</p>
  `)
}

// ─── Email #5 — Day +14 ──────────────────────────────────────────────────────

function day14Html(_vars: TemplateVars): string {
  return emailLayout(`
    <h2>10% off OAR Pro — expires Monday</h2>
    <p>If you're still on the fence, use code <strong style="color:#2563eb">OAR10</strong> at checkout. Brings it to $87.</p>

    <div class="card">
      <p style="font-weight:600;margin-bottom:10px">What's included:</p>
      <ul>
        <li>220 practice questions (Math, Reading, Mechanical)</li>
        <li>20 lesson modules with worked examples</li>
        <li>Adaptive CAT that targets your weak topics</li>
        <li>41 parameterized drill generators — unlimited practice</li>
        <li>Animated mechanical diagrams</li>
        <li>30-day money-back guarantee</li>
      </ul>
    </div>

    <p>If your OAR score affects your billet, this is the best $87 you'll spend on your career.</p>

    <a href="${SITE_URL}/#/checkout?test=OAR&promo=OAR10" class="btn">Get OAR Pro for $87 → (use OAR10)</a>
    <p class="muted" style="margin-top:10px">Code expires Monday. After that it's back to $97.</p>
  `)
}
