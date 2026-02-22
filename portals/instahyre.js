module.exports = async function instahyre(page, creds, resumePath, log) {
  log("Opening Instahyre...");

  await page.goto("https://www.instahyre.com/login/");

  await page.fill('input[name="email"]', creds.username);
  await page.fill('input[name="password"]', creds.password);
  await page.click('button[type="submit"]');

  await page.waitForTimeout(5000);

  log("Searching jobs...");
  await page.goto("https://www.instahyre.com/search-jobs/?q=developer");

  await page.waitForSelector(".job-card");

  const jobs = await page.$$(".job-card");
  log(`Found ${jobs.length} jobs`);

  for (let i = 0; i < Math.min(5, jobs.length); i++) {
    await jobs[i].click();
    await page.waitForTimeout(3000);

    const applyBtn = await page.$("button:has-text('Apply')");
    if (applyBtn) {
      await applyBtn.click();
      log("Applied to job");
      await page.waitForTimeout(2000);
    }
  }

  log("Instahyre automation finished.");
};
