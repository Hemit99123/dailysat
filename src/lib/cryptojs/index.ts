"use server";

import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const secretKey = process.env.CRYPTOJS_SECRET_KEY as string;
if (!secretKey) {
  throw new Error(
    "CRYPTOJS_SECRET_KEY environment variable is required for encryption"
  );
}

export const encryptPayload = async (payload: Record<string, any>) => {
  try {
    const jsonString = JSON.stringify(payload);
    const encrypted = AES.encrypt(jsonString, secretKey).toString();
    return encrypted;
  } catch (error) {
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// Not JSON because we expect payload to be encrypted
export const decryptPayload = async (payload: string) => {
  try {
    const decrypted = AES.decrypt(payload, secretKey);
    const decryptedString = decrypted.toString(Utf8);

    if (!decryptedString) {
      throw new Error(
        "Failed to decrypt payload - invalid key or corrupted data"
      );
    }

    const parsed = JSON.parse(decryptedString);
    return parsed;
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
