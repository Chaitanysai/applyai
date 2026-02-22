const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const SECRET = process.env.SECRET_KEY || "super_secret_key_32_bytes!";

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET.padEnd(32)), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(data) {
  const bData = Buffer.from(data, "base64"),
    iv = bData.slice(0, 16),
    tag = bData.slice(16, 32),
    text = bData.slice(32);

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET.padEnd(32)), iv);
  decipher.setAuthTag(tag);
  return decipher.update(text).toString() + decipher.final().toString();
}

module.exports = { encrypt, decrypt };
