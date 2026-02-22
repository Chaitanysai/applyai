module.exports = async function indeed(page, creds, resumePath, log) {
  log("Opening Indeed...");

  await page.goto("https://secure.indeed.com/account/login");

  await page.fill('input[type="email"]', creds.username);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');

  log("Logged in...");
  await page.waitForTimeout(5000);

  await page.goto("https://in.indeed.com/jobs?q=software+developer");

  await page.waitForSelector(".job_seen_beacon");

  const jobs = await page.$$(".job_seen_beacon");
  log(`Found ${jobs.length} jobs`);

  for (let i = 0; i < Math.min(5, jobs.length); i++) {
    await jobs[i].click();
    await page.waitForTimeout(3000);

    const applyBtn = await page.$("button:has-text('Apply Now')");
    if (applyBtn) {
      log("Applying...");
      await applyBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  log("Indeed automation finished.");
};
