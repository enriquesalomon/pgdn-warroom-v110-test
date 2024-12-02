// cryptoUtils.js
import { AES, enc } from "crypto-js";

const secretKey = import.meta.env.VITE_CRYPTO_KEY; // Replace with your secret key

// Function to encrypt a password
export function encryptPassword(password) {
  return AES.encrypt(password, secretKey).toString();
}

// Function to decrypt a password
export function decryptPassword(encryptedPassword) {
  const bytes = AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(enc.Utf8);
}
export function encryptData(data) {
  return AES.encrypt(data, secretKey).toString();
}
export function decryptData(data) {
  const bytes = AES.decrypt(data, secretKey);
  return bytes.toString(enc.Utf8);
}
