import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { GarminConnect } from 'garmin-connect';
import { IGarminTokens } from 'garmin-connect/dist/garmin/types';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'iron-cookie';

function getKey(secret: string): string {
  return createHash('sha256')
    .update(String(secret))
    .digest('base64')
    .substring(0, 32);
}

const encrypt = (secret: string, plaintext: string) => {
  // create a random initialization vector
  const iv = randomBytes(12).toString('base64');

  // create a cipher object
  const cipher = createCipheriv('aes-256-gcm', getKey(secret), iv);

  // update the cipher object with the plaintext to encrypt
  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');

  // finalize the encryption process
  ciphertext += cipher.final('base64');

  // retrieve the authentication tag for the encryption
  const tag = cipher.getAuthTag();

  return { ciphertext, iv, tag };
};

const decrypt = (
  secret: string,
  ciphertext: string,
  iv: string,
  tag: string
) => {
  // create a decipher object
  const decipher = createDecipheriv('aes-256-gcm', getKey(secret), iv);

  // set the authentication tag for the decipher object
  decipher.setAuthTag(Buffer.from(tag, 'base64'));

  // update the decipher object with the base64-encoded ciphertext
  let plaintext = decipher.update(ciphertext, 'base64', 'utf8');

  // finalize the decryption process
  plaintext += decipher.final('utf8');

  return plaintext;
};

function getTokensfromCookies(): IGarminTokens | null {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const value = cookie?.value;
  if (!value) {
    return null;
  }

  const { ciphertext, iv, tag } = JSON.parse(value);
  return JSON.parse(decrypt(process.env.SECRET_KEY!, ciphertext, iv, tag));
}

function saveTokensToCookies(tokens: IGarminTokens) {
  const cookieStore = cookies();

  const plainText = JSON.stringify(tokens);
  const encrypted = encrypt(process.env.SECRET_KEY!, plainText);

  cookieStore.set(COOKIE_NAME, JSON.stringify(encrypted), {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });
}

interface useGarminClientType {
  isLoggedIn: () => boolean;
  login: (username: string, password: string) => Promise<GarminConnect>;
  getClient: () => GarminConnect | null;
}

export const useGarminClient = (): useGarminClientType => {
  const isLoggedIn = () => {
    return getClient() !== null;
  };

  const login = async (username: string, password: string) => {
    const client = new GarminConnect({
      username,
      password,
    });
    await client.login();
    saveTokensToCookies(client.exportToken());
    return client;
  };

  const getClient = (): GarminConnect | null => {
    const tokens = getTokensfromCookies();
    if (!tokens) {
      return null;
    }

    const client = new GarminConnect({ username: '', password: '' });
    client.loadToken(tokens.oauth1, tokens.oauth2);
    return client;
  };

  return { isLoggedIn, login, getClient };
};
