const { chromium } = require("playwright");
const naukri = require("./portals/naukri");
const linkedin = require("./portals/linkedin");
const indeed = require("./portals/indeed");
const instahyre = require("./portals/instahyre");

async function runAutomation(portal, creds, resumePath, log) {
  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== "false",
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    if (portal === "naukri")
      await naukri(page, creds, resumePath, log);
    if (portal === "linkedin")
      await linkedin(page, creds, resumePath, log);
    if (portal === "indeed")
      await indeed(page, creds, resumePath, log);
    if (portal === "instahyre")
      await instahyre(page, creds, resumePath, log);
  } finally {
    await browser.close();
  }
}

module.exports = { runAutomation };
