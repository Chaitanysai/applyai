module.exports = async function naukri(page, creds, resumePath, log) {
  log("Opening Naukri...");

  await page.goto("https://www.naukri.com/nlogin/login");

  await page.fill('input[type="text"]', creds.username);
  await page.fill('input[type="password"]', creds.password);

  await page.click('button[type="submit"]');

  log("Logged in. Waiting for dashboard...");
  await page.waitForTimeout(5000);

  log("Searching jobs...");
  await page.goto("https://www.naukri.com/software-developer-jobs");

  await page.waitForSelector(".jobTuple");

  const jobs = await page.$$(".jobTuple");
  log(`Found ${jobs.length} jobs`);

  for (let i = 0; i < Math.min(5, jobs.length); i++) {
    log(`Opening job ${i + 1}`);
    await jobs[i].click();
    await page.waitForTimeout(3000);

    const applyBtn = await page.$("button:has-text('Apply')");
    if (applyBtn) {
      log("Applying...");
      await applyBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  log("Naukri automation finished.");
};
