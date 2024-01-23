import { cookies } from 'next/headers';

import { decrypt, encrypt } from './encrypt';

const COOKIE_NAME = 'iron-cookie';

function getAuthCookie(): any | null {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const value = cookie?.value;
  if (!value) {
    return null;
  }

  const { encrypted, iv, tag } = JSON.parse(value);
  return JSON.parse(decrypt(encrypted, iv, tag));
}

function setAuthCookie(data: any) {
  const cookieStore = cookies();

  const plainText = JSON.stringify(data);
  const { encrypted, iv, tag } = encrypt(plainText);

  cookieStore.set(COOKIE_NAME, JSON.stringify({ encrypted, iv, tag }), {
    sameSite: true,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 31,
    path: '/',
  });
}

function deleteAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { deleteAuthCookie, getAuthCookie, setAuthCookie };
