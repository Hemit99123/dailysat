import crypto from "crypto";

const otpGenerate = (length: number = 12): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
  const charsetLength = charset.length;

  // Generate secure random bytes
  const randomBytes = crypto.randomBytes(length);

  // Map random bytes to characters in the charset
  const password = Array.from(randomBytes)
    .map((byte) => charset[byte % charsetLength])
    .join("");

  return password;
};

export default otpGenerate;
