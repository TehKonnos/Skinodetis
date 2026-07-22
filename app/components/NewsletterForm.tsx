'use client';

import { useActionState, useEffect } from 'react';
import { subscribeNewsletter, type FormState } from '../actions';
import { pushEvent } from '../lib/gtm';

const initialState: FormState = { ok: false, message: '' };

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialState
  );

  // Key event: επιτυχής εγγραφή στο newsletter.
  useEffect(() => {
    if (state.ok) pushEvent('newsletter_signup');
  }, [state]);

  return (
    <div className="w-full max-w-md">
      <form action={formAction} className="flex flex-col sm:flex-row gap-3">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Το email σας"
          className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={pending}
          className="whitespace-nowrap bg-gold hover:bg-gold-600 text-ink font-bold py-3 px-6 rounded-full text-sm shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? '…' : 'Εγγραφή'}
        </button>
      </form>
      {state.message && (
        <p
          aria-live="polite"
          className={`text-sm font-medium mt-2 ${
            state.ok
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
