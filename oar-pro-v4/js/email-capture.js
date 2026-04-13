// email-capture.js — UTM persistence + diagnostic lead capture
// Loaded globally before diagnostic.js. Runs on every page load.
// — Benjamin Rodriguez

;(function () {
  'use strict'

  // ── UTM persistence ─────────────────────────────────────────────────────────
  // Captures UTM params from the URL and keeps them in sessionStorage
  // so they survive SPA navigation (hash routing) within the same tab.

  function captureUTM() {
    const search = window.location.search
    if (!search) return
    const params = new URLSearchParams(search)
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    keys.forEach(function (k) {
      const v = params.get(k)
      if (v) sessionStorage.setItem(k, v)
    })
  }

  function getUTM() {
    return {
      utm_source:   sessionStorage.getItem('utm_source')   || 'direct',
      utm_medium:   sessionStorage.getItem('utm_medium')   || 'organic',
      utm_campaign: sessionStorage.getItem('utm_campaign') || null,
    }
  }

  // ── Lead capture ────────────────────────────────────────────────────────────
  // Called by submitDiagEmail() in diagnostic.js after the user submits
  // their email on the results page.

  async function submitLeadCapture(opts) {
    const email = opts.email
    const onSuccess = opts.onSuccess || null
    const onError = opts.onError || null

    const utm = getUTM()

    // Pull diagnostic result from sessionStorage
    let diagData = {}
    try {
      diagData = JSON.parse(sessionStorage.getItem('oar_diag_result') || '{}')
    } catch (_) {}

    const weakSections = Array.isArray(diagData.weak_sections) ? diagData.weak_sections : []

    // SUPABASE_URL and SUPABASE_ANON_KEY are globals declared with var in supabase-init.js
    const supabaseUrl = typeof SUPABASE_URL !== 'undefined'
      ? SUPABASE_URL
      : 'https://ugblwepfptumffzcljot.supabase.co'
    const anonKey = typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : ''

    // Try edge function — but always call onSuccess regardless.
    // If the function isn't deployed yet, the token still gets set and lessons unlock.
    let edgeData = { ok: true, sample_questions: [] }

    try {
      const res = await fetch(supabaseUrl + '/functions/v1/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + anonKey,
        },
        body: JSON.stringify({
          email: email,
          diag_score:    diagData.score    || null,
          diag_correct:  diagData.correct  || null,
          diag_total:    diagData.total    || null,
          weak_sections: weakSections,
          utm_source:    utm.utm_source,
          utm_medium:    utm.utm_medium,
          utm_campaign:  utm.utm_campaign,
        }),
      })

      if (res.ok) {
        edgeData = await res.json()
      }
      // Non-2xx responses silently ignored — proceed to onSuccess below
    } catch (err) {
      console.warn('[email-capture] capture-lead edge function not reachable:', err.message)
    }

    if (onSuccess) onSuccess(edgeData)
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  captureUTM()

  window._emailCapture = {
    captureUTM: captureUTM,
    getUTM: getUTM,
    submitLeadCapture: submitLeadCapture,
  }
})()
