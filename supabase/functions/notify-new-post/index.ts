import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = 'aaravdhawan25@gmail.com'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const payload = await req.json()
    // Supabase DB webhooks wrap the row under `record`; direct calls pass it flat
    const post = payload.record ?? payload

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(JSON.stringify({ error: 'Email not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const categoryEmoji: Record<string, string> = { Bug: '🐛', Question: '❓', Tip: '💡' }
    const emoji = categoryEmoji[post.category] ?? '📝'
    const postedAt = new Date(post.created_at).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/New_York',
    })

    const categoryColors: Record<string, string> = {
      Bug: '#fca5a5',
      Question: '#93c5fd',
      Tip: '#6ee7b7',
    }
    const categoryBg: Record<string, string> = {
      Bug: '#450a0a',
      Question: '#1e3a5f',
      Tip: '#022c22',
    }
    const catColor = categoryColors[post.category] ?? '#93c5fd'
    const catBg = categoryBg[post.category] ?? '#1e3a5f'

    const safeBody = String(post.body).replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#1e293b;border-radius:12px 12px 0 0;padding:24px 32px;border-bottom:1px solid #334155;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#60a5fa;">FTC-AutoTune</span>
                  <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#f8fafc;">New forum post</p>
                </td>
                <td align="right">
                  <span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:${catBg};color:${catColor};border:1px solid ${catColor}40;">${post.category}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#1e293b;padding:24px 32px 32px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#f1f5f9;line-height:1.3;">${post.title}</p>
            <p style="margin:0 0 20px;font-size:12px;color:#64748b;">by ${post.author} &middot; ${postedAt}</p>
            <div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.7;white-space:pre-wrap;">${safeBody}</p>
            </div>
            <p style="margin:0;font-size:11px;color:#475569;">Posted to FTC-AutoTune Community Forum</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 0 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#334155;">You receive this because you own FTC-AutoTune.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FTC-AutoTune Forum <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `${emoji} [Forum] ${post.category}: ${post.title}`,
        html: emailHtml,
      }),
    })

    const result = await res.json()
    console.log('Resend response:', JSON.stringify(result))

    return new Response(JSON.stringify({ ok: res.ok, resend: result }), {
      status: res.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
