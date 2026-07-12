'use server';

import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { sendContactEmail } from './lib/mailer';

export interface FormState {
  ok: boolean;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Φάκελος όπου αποθηκεύονται οι υποβολές (εκτός git). */
const SUBMISSIONS_DIR = path.join(process.cwd(), 'submissions');

/**
 * Προσθέτει μία εγγραφή σε αρχείο JSONL (μία γραμμή JSON ανά υποβολή).
 * Έτσι οι υποβολές παραμένουν στον server και μπορούν να διαβαστούν αργότερα.
 */
async function appendSubmission(
  file: string,
  record: Record<string, unknown>
): Promise<void> {
  // Χωρίς try/catch εδώ: αν αποτύχει η εγγραφή, θέλουμε να το μάθει
  // ο χρήστης (και τα logs) αντί να δείξουμε ψεύτικη επιτυχία.
  await mkdir(SUBMISSIONS_DIR, { recursive: true });
  const line = JSON.stringify({ at: new Date().toISOString(), ...record });
  await appendFile(path.join(SUBMISSIONS_DIR, file), line + '\n', 'utf8');
  console.log('[SUBMISSION] αποθηκεύτηκε στο', path.join(SUBMISSIONS_DIR, file));
}

/**
 * Φόρμα επικοινωνίας.
 *
 * TODO (αποστολή email): Αυτή τη στιγμή τα μηνύματα καταγράφονται μόνο στα
 * logs του server. Για πραγματική αποστολή, συνδέστε έναν πάροχο email
 * (π.χ. Resend, Nodemailer/SMTP, ή μια υπηρεσία φόρμας) εδώ, χρησιμοποιώντας
 * μεταβλητές περιβάλλοντος για τα credentials (.env.local).
 */
export async function submitContact(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  // Honeypot κατά των bots — πρέπει να είναι κενό.
  if (String(formData.get('company') ?? '').trim() !== '') {
    return { ok: true, message: 'Ευχαριστούμε! Το μήνυμά σας στάλθηκε.' };
  }

  if (name.length < 2) {
    return { ok: false, message: 'Παρακαλώ συμπληρώστε το όνομά σας.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: 'Παρακαλώ δώστε ένα έγκυρο email.' };
  }
  if (message.length < 10) {
    return {
      ok: false,
      message: 'Το μήνυμα είναι πολύ σύντομο (τουλάχιστον 10 χαρακτήρες).',
    };
  }

  try {
    await appendSubmission('contact.jsonl', { name, email, message });
  } catch (err) {
    console.error('[ΕΠΙΚΟΙΝΩΝΙΑ] αποτυχία αποθήκευσης', err);
    return {
      ok: false,
      message: 'Κάτι πήγε στραβά κατά την αποθήκευση. Δοκιμάστε ξανά.',
    };
  }

  // Ειδοποίηση με email (best-effort): το μήνυμα έχει ήδη αποθηκευτεί,
  // οπότε αποτυχία αποστολής δεν μπλοκάρει τον χρήστη.
  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    console.error('[ΕΠΙΚΟΙΝΩΝΙΑ] αποτυχία αποστολής email', err);
  }

  return {
    ok: true,
    message: 'Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα επικοινωνήσουμε σύντομα.',
  };
}

/**
 * Εγγραφή στο newsletter.
 *
 * TODO (πάροχος newsletter): Συνδέστε εδώ τον πάροχό σας (Mailchimp, Brevo,
 * Buttondown κ.λπ.) μέσω του API τους. Προς το παρόν η εγγραφή απλώς
 * καταγράφεται στα logs του server.
 */
export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();

  if (String(formData.get('website') ?? '').trim() !== '') {
    return { ok: true, message: 'Εγγραφήκατε στο newsletter!' };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: 'Παρακαλώ δώστε ένα έγκυρο email.' };
  }

  try {
    await appendSubmission('newsletter.jsonl', { email });
  } catch (err) {
    console.error('[NEWSLETTER] αποτυχία αποθήκευσης', err);
    return {
      ok: false,
      message: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
    };
  }

  return { ok: true, message: 'Εγγραφήκατε! Θα λαμβάνετε τα νέα μας.' };
}
