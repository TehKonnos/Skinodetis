'use client';

import { useActionState } from 'react';
import { submitContact, type FormState } from '../actions';

const initialState: FormState = { ok: false, message: '' };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — κρυφό από χρήστες */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Όνομα
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Μήνυμα
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold resize-y"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-block bg-gold hover:bg-gold-600 text-ink font-bold py-3 px-8 rounded-full text-sm shadow-lg hover:shadow-gold/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Αποστολή…' : 'Αποστολή μηνύματος'}
        </button>

        {state.message && (
          <p
            aria-live="polite"
            className={`text-sm font-medium ${
              state.ok
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
