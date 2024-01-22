'use server';

import { redirect } from 'next/navigation';

import { useGarminClient } from '../hooks/useGarminClient';

export async function authenticate(formData: FormData) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { login } = useGarminClient();

  const email = formData.get('email');
  const password = formData.get('password');
  if (!email || !password) {
    return;
  }

  await login(email.toString(), password.toString());
  redirect('/');
}
