'use server';

import { redirect } from 'next/navigation';

import { logout } from './lib/garmin';

export async function unauthenticate(formData: FormData) {
  logout();
  redirect('/');
}
