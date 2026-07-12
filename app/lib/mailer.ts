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

function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Ειδοποίηση για νέα εγγραφή στο newsletter. Επιστρέφει true αν στάλθηκε.
 */
export async function sendNewsletterEmail(email: string): Promise<boolean> {
  const t = transport();
  if (!t) return false;
  await t.sendMail({
    from: process.env.CONTACT_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO || process.env.SMTP_USER,
    subject: 'Νέα εγγραφή στο newsletter',
    text: `Νέα εγγραφή: ${email}`,
    html: `<p><strong>Νέα εγγραφή στο newsletter:</strong> ${escapeHtml(email)}</p>`,
  });
  return true;
}

/**
 * Στέλνει email ειδοποίησης για νέο μήνυμα επικοινωνίας μέσω SMTP (papaki).
 * Ρυθμίζεται από μεταβλητές περιβάλλοντος στο .env.local. Αν λείπουν,
 * παραλείπεται σιωπηλά (η υποβολή έχει ήδη αποθηκευτεί στο submissions/).
 */
export async function sendContactEmail(msg: ContactMessage): Promise<boolean> {
  const t = transport();
  if (!t) {
    console.warn(
      '[mail] SMTP δεν έχει ρυθμιστεί (SMTP_HOST/SMTP_USER/SMTP_PASS) — παραλείπεται η αποστολή email.'
    );
    return false;
  }

  await t.sendMail({
    from: process.env.CONTACT_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO || process.env.SMTP_USER,
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
  return true;
}
