// capture-lead — OAR Pro freemium funnel
// Upserts an email lead from the diagnostic results page,
// fires the welcome email (non-blocking), and returns 3 sample questions.
// — Benjamin Rodriguez

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      email,
      diag_score,
      diag_correct,
      diag_total,
      weak_sections = [],
      utm_source = 'direct',
      utm_medium = 'organic',
      utm_campaign = null,
    } = await req.json()

    // Basic validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'invalid email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const cleanEmail = email.toLowerCase().trim()

    // Upsert lead — idempotent: duplicate emails update score/UTM, reset sequence if stale
    const { error: upsertError } = await supabase
      .from('email_leads')
      .upsert(
        {
          email: cleanEmail,
          diag_score: diag_score ?? null,
          diag_correct: diag_correct ?? null,
          diag_total: diag_total ?? null,
          weak_sections: Array.isArray(weak_sections) ? weak_sections : [],
          utm_source,
          utm_medium,
          utm_campaign,
          sequence_step: 0,
          last_emailed_at: new Date().toISOString(),
        },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (upsertError) throw upsertError

    // Determine primary weak section for email personalization
    const primaryWeak = (Array.isArray(weak_sections) && weak_sections.length > 0)
      ? weak_sections[0]
      : 'Math'

    // Fire welcome email non-blocking — don't let email failures break lead capture
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // @ts-ignore — EdgeRuntime is available in Supabase Deno runtime
    if (typeof EdgeRuntime !== 'undefined') {
      // @ts-ignore
      EdgeRuntime.waitUntil(
        fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            to: cleanEmail,
            template: 'welcome',
            vars: { diag_score: diag_score ?? 0, weak_section: primaryWeak },
          }),
        }).catch((err: Error) => console.error('send-email fire failed:', err.message))
      )
    } else {
      // Fallback for local dev: fire and forget without waitUntil
      fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          to: cleanEmail,
          template: 'welcome',
          vars: { diag_score: diag_score ?? 0, weak_section: primaryWeak },
        }),
      }).catch((err: Error) => console.error('send-email fire failed:', err.message))
    }

    // Fetch 3 sample questions from the lead's weakest section
    const { data: sampleQs, error: qErr } = await supabase
      .from('questions')
      .select('id, section, question_text, options, correct_index, explanation')
      .eq('section', primaryWeak)
      .eq('difficulty', 1)
      .contains('test_types', ['OAR'])
      .limit(3)

    if (qErr) console.error('sample question fetch error:', qErr.message)

    return new Response(
      JSON.stringify({ ok: true, sample_questions: sampleQs || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('capture-lead error:', msg)
    return new Response(
      JSON.stringify({ error: 'internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
