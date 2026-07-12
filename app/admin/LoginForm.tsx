'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';

const initialState: LoginState = { error: '' };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Όνομα χρήστη
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Κωδικός
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {state.error && (
        <p aria-live="polite" className="text-sm font-medium text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gold hover:bg-gold-600 text-ink font-bold py-3 px-4 rounded-full text-sm shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Σύνδεση…' : 'Σύνδεση'}
      </button>
    </form>
  );
}
