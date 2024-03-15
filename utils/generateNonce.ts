import crypto from "crypto";

export async function generateNonce(): Promise<string> {
  const nonce = crypto.randomBytes(16).toString('base64');
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hash = await window.crypto.subtle.digest("SHA-256", encodedNonce);
  const bytes = new Uint8Array(hash);
  const hashedNonce = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashedNonce;

}