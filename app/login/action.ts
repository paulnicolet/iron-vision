'use server';

import { redirect } from 'next/navigation';

import { login } from '../lib/garmin';

export async function authenticate(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  if (!email || !password) {
    return;
  }

  await login(email.toString(), password.toString());
  redirect('/');
}
