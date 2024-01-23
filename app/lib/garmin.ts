import { GarminConnect } from 'garmin-connect';
import { IGarminTokens } from 'garmin-connect/dist/garmin/types';

import { deleteAuthCookie, getAuthCookie, setAuthCookie } from './auth';

async function login(username: string, password: string): Promise<void> {
  const client = new GarminConnect({
    username,
    password,
  });
  await client.login();
  setAuthCookie(client.exportToken());
}

function logout(): void {
  deleteAuthCookie();
}

function isLoggedIn(): boolean {
  return getAuthCookie() != null;
}

function getClient(): GarminConnect {
  const tokens: IGarminTokens = getAuthCookie();
  if (!tokens) {
    throw Error('Not logged in');
  }

  const client = new GarminConnect({ username: '', password: '' });
  client.loadToken(tokens.oauth1, tokens.oauth2);
  return client;
}

export { getClient, isLoggedIn, login, logout };
