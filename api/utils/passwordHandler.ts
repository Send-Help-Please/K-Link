import crypto from 'crypto';
import util from 'util';

import HASH_CONFIG from '../configs/HashConfig';
import { ProcessResultError, ProcessResultSuccess, ProcessResultType } from '../models/ProcessResultModels';

const pbkdf2 = util.promisify(crypto.pbkdf2);

const HASH_ALGORITHM = HASH_CONFIG.hashAlgorithm;
const HASH_LENGTH = +HASH_CONFIG.hashLength;
const SALT_SECRET = HASH_CONFIG.saltSecret;
const SALT_LENGTH = +HASH_CONFIG.saltLength;
const ENCRYPTION_ALGORITHM = HASH_CONFIG.encryptionAlgorithm;
const IV_LENGTH = +HASH_CONFIG.ivLength;

const ENCRYPTION_KEY = crypto
  .createHash(HASH_ALGORITHM)
  .update(String(SALT_SECRET))
  .digest();

function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

function encryptSalt(salt: string): ProcessResultType {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(salt, 'utf8'), cipher.final()]);
    const result = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    return new ProcessResultSuccess(result);
  } catch (error) {
    return new ProcessResultError(true, 'Failed to encrypt salt');
  }
}

function decryptSalt(encrypted: string): ProcessResultType {
  try {
    const [ivHex, encryptedSaltHex] = encrypted.split(':');
    if (!ivHex || !encryptedSaltHex) {
      return new ProcessResultError(false, 'Invalid encrypted salt format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedSalt = Buffer.from(encryptedSaltHex, 'hex');
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedSalt), decipher.final()]);
    return new ProcessResultSuccess(decrypted.toString('utf8'));
  } catch (error) {
    return new ProcessResultError(false, 'Failed to decrypt salt');
  }
}

async function hashPasswordWithSalt(password: string, salt: string): Promise<ProcessResultType> {
  try {
    const hash = await pbkdf2(password + salt, '', 100000, HASH_LENGTH, HASH_ALGORITHM);
    return new ProcessResultSuccess(hash.toString('hex'));
  } catch (error) {
    return new ProcessResultError(true, 'Failed to hash password');
  }
}

export async function hashPassword(password: string): Promise<ProcessResultType> {
  const salt = generateSalt();

  const hashResult = await hashPasswordWithSalt(password, salt);
  if (!hashResult.success) return hashResult;

  const encryptResult = encryptSalt(salt);
  if (!encryptResult.success) return encryptResult;

  const combined = `${hashResult.data}:${encryptResult.data}`;
  return new ProcessResultSuccess(combined);
}

export async function validatePassword(password: string, stored: string): Promise<ProcessResultType> {
  const [storedHash, encryptedSalt] = stored.split(':');
  if (!storedHash || !encryptedSalt) {
    return new ProcessResultError(false, 'Stored password format is invalid');
  }

  const saltResult = decryptSalt(encryptedSalt);
  if (!saltResult.success) return saltResult;

  const hashResult = await hashPasswordWithSalt(password, saltResult.data);
  if (!hashResult.success) return hashResult;

  const isMatch = hashResult.data === storedHash;
  return new ProcessResultSuccess(isMatch);
}