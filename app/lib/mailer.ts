import nodemailer from 'nodemailer';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/**
 * Στέλνει email ειδοποίησης για νέο μήνυμα επικοινωνίας μέσω SMTP (papaki).
 * Ρυθμίζεται από μεταβλητές περιβάλλοντος στο .env.local. Αν λείπουν,
 * παραλείπεται σιωπηλά (η υποβολή έχει ήδη αποθηκευτεί στο submissions/).
 */
export async function sendContactEmail(msg: ContactMessage): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      '[mail] SMTP δεν έχει ρυθμιστεί (SMTP_HOST/SMTP_USER/SMTP_PASS) — παραλείπεται η αποστολή email.'
    );
    return;
  }

  const port = Number(SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: CONTACT_FROM || SMTP_USER,
    to: CONTACT_TO || SMTP_USER,
    replyTo: `${msg.name} <${msg.email}>`,
    subject: `Νέο μήνυμα επικοινωνίας — ${msg.name}`,
    text: `Όνομα: ${msg.name}\nEmail: ${msg.email}\n\n${msg.message}`,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:15px;color:#241a33">
        <p><strong>Όνομα:</strong> ${escapeHtml(msg.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></p>
        <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(msg.message)}</p>
      </div>
    `,
  });
}
