'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  verifyCredentials,
  createToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '../lib/auth';

export interface LoginState {
  error: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!verifyCredentials(username, password)) {
    return { error: 'Λάθος όνομα χρήστη ή κωδικός.' };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  redirect('/admin');
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/login');
}
