const fs = require("fs");
const path = require("path");
const { encrypt, decrypt } = require("./encryption");

const FILE = path.join(__dirname, "storage/credentials.json");

if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}));

function saveCredentials(portal, username, password) {
  const data = JSON.parse(fs.readFileSync(FILE));
  data[portal] = { username, password: encrypt(password) };
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function getCredentials(portal) {
  const data = JSON.parse(fs.readFileSync(FILE));
  if (!data[portal]) return null;
  return { username: data[portal].username, password: decrypt(data[portal].password) };
}

module.exports = { saveCredentials, getCredentials };
