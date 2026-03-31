import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.RESEND_TO_EMAIL!;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name        = formData.get('fullName')           as string;
    const email       = formData.get('email')              as string;
    const phone       = formData.get('phone')              as string;
    const location    = formData.get('location')           as string;
    const placement   = formData.get('placement')          as string;
    const size        = formData.get('size')               as string;
    const budget      = formData.get('budget')             as string;
    const idea        = formData.get('idea')               as string;
    const replyMethod = formData.get('preferredReplyMethod') as string;
    const telegram    = formData.get('telegramUsername')   as string;
    const requestId   = formData.get('requestId')          as string;
    const days        = formData.getAll('bestDays[]')      as string[];

    // Build file attachments
    const fileEntries = formData.getAll('referenceFiles') as File[];
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const file of fileEntries) {
      if (file && file.size > 0) {
        const buf = await file.arrayBuffer();
        attachments.push({ filename: file.name, content: Buffer.from(buf) });
      }
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#111010;padding:24px 32px;margin-bottom:0">
          <p style="color:#c9a96e;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;margin:0">
            LEMME INK — New Booking Request
          </p>
        </div>
        <div style="border:1px solid #e5e5e5;border-top:none;padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#71717a;width:140px">Request ID</td><td style="padding:8px 0;font-weight:600">${requestId}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Name</td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Email</td><td style="padding:8px 0">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Phone</td><td style="padding:8px 0">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Reply via</td><td style="padding:8px 0">${replyMethod}${telegram ? ` — ${telegram}` : ''}</td></tr>
            <tr><td colspan="2"><hr style="border:none;border-top:1px solid #f0f0f0;margin:12px 0"/></td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Location</td><td style="padding:8px 0">${location || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Placement</td><td style="padding:8px 0">${placement || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Size</td><td style="padding:8px 0">${size || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Budget</td><td style="padding:8px 0">${budget || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a">Best days</td><td style="padding:8px 0">${days.length ? days.join(', ') : '—'}</td></tr>
            <tr><td colspan="2"><hr style="border:none;border-top:1px solid #f0f0f0;margin:12px 0"/></td></tr>
            <tr>
              <td style="padding:8px 0;color:#71717a;vertical-align:top">Idea</td>
              <td style="padding:8px 0;white-space:pre-wrap">${idea}</td>
            </tr>
            ${attachments.length ? `<tr><td style="padding:8px 0;color:#71717a">Files</td><td style="padding:8px 0">${attachments.map(a => a.filename).join(', ')}</td></tr>` : ''}
          </table>
        </div>
        <div style="padding:16px 32px;background:#f9f9f9;font-size:11px;color:#aaa;letter-spacing:0.05em">
          lemme.ink · West Hollywood, CA · ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Lemme Ink <noreply@lemme.ink>',
      to: TO,
      replyTo: email,
      subject: `[${requestId}] New request from ${name}`,
      html,
      attachments,
    });

    if (error) {
      console.error('[booking] resend error:', JSON.stringify(error));
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log('[booking] sent:', data?.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[booking]', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
