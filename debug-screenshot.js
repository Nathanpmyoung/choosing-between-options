const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // Navigate to the local file
  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath);

  // Wait for page to load
  await page.waitForTimeout(1000);

  // Get localStorage data
  const pollData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('poll_')) {
        data[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    return data;
  });

  console.log('Poll Data from localStorage:');
  console.log(JSON.stringify(pollData, null, 2));

  // Take screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('\nScreenshot saved to screenshot.png');

  await browser.close();
})();
