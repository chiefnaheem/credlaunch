import { BadRequestException } from '@nestjs/common';
import { isNumberString } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import serverConfig from 'src/database/config/env.config';


export const comparePassword = (text: string, hashedText: string) => {
  return bcrypt.compareSync(text, hashedText);
};

export const hashPassword = (text: string) => {
  return bcrypt.hashSync(text, 10);
}

export const unifyPhoneNumber = (value: string): string => {
  if (![11, 13, 14].includes(value?.length)) {
    throw new BadRequestException(
      `Invalid phone number. Phone number must start with +234, 234 or 0`,
    );
  }

  if (
    !value.startsWith('+234') &&
    !value.startsWith('234') &&
    !value.startsWith('0')
  ) {
    throw new BadRequestException(
      `Invalid phone number. Phone number must start with +234, 234 or 0`,
    );
  }

  return value.replace(/(^0)/, '234').replace(/(^\+)/, '');
};

export const isPhoneNumber = (value: string): boolean => {
  return (
    isNumberString(value) &&
    [11, 13, 14].includes(value?.length) &&
    (value.startsWith('+234') ||
      value.startsWith('234') ||
      value.startsWith('0'))
  );
};

// Encryption function
export const encrypt = (text: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    text,
    serverConfig.ENCRYPTION_KEY,
  ).toString();
  return encrypted;
};

// Decryption function
export const decrypt = (encryptedText: string) => {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedText,
    serverConfig.ENCRYPTION_KEY,
  ).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

export const generateRandomAlphanumeric = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `${result}${Date.now()}`;
}


