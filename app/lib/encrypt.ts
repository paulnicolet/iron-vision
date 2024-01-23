import {
  CipherGCM,
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

function getKey(): string {
  return createHash('sha256')
    .update(String(process.env.SECRET_KEY!))
    .digest('base64')
    .substring(0, 32);
}

function encrypt(plaintext: string): {
  encrypted: string;
  iv: string;
  tag: Buffer;
} {
  const iv = randomBytes(12).toString('base64');
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag();
  return { encrypted: ciphertext, iv: iv, tag: tag };
}

function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  let plaintext = decipher.update(encrypted, 'base64', 'utf8');
  plaintext += decipher.final('utf8');
  return plaintext;
}

export { decrypt, encrypt };
