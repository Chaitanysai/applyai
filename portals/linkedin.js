module.exports = async function linkedin(page, creds, resumePath, log) {
  log("Opening LinkedIn...");

  await page.goto("https://www.linkedin.com/login");

  await page.fill("#username", creds.username);
  await page.fill("#password", creds.password);
  await page.click('button[type="submit"]');

  log("Logged in...");
  await page.waitForTimeout(5000);

  log("Searching jobs...");
  await page.goto(
    "https://www.linkedin.com/jobs/search/?keywords=software%20developer"
  );

  await page.waitForSelector(".jobs-search-results__list-item");

  const jobs = await page.$$(".jobs-search-results__list-item");
  log(`Found ${jobs.length} jobs`);

  for (let i = 0; i < Math.min(5, jobs.length); i++) {
    await jobs[i].click();
    await page.waitForTimeout(3000);

    const easyApply = await page.$("button:has-text('Easy Apply')");
    if (easyApply) {
      log("Easy Applying...");
      await easyApply.click();
      await page.waitForTimeout(2000);

      const submitBtn = await page.$(
        "button:has-text('Submit application')"
      );
      if (submitBtn) {
        await submitBtn.click();
        log("Application submitted");
      }
    }
  }

  log("LinkedIn automation finished.");
};
