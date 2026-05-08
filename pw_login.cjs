const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '/tmp/pw_01_landing.png', fullPage: true });
  console.log('Screenshot 1: landing page, URL:', page.url());

  // Fill email & password
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log('Inputs found:', inputCount);
  for (let i = 0; i < inputCount; i++) {
    const type = await inputs.nth(i).getAttribute('type');
    console.log(`  input[${i}] type=${type}`);
  }

  // Try to fill by type
  await page.fill('input[type="text"], input[type="email"], input:not([type])', 'sconnor@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.screenshot({ path: '/tmp/pw_02_filled.png', fullPage: true });
  console.log('Screenshot 2: form filled');

  // Submit
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/pw_03_after_login.png', fullPage: true });
  console.log('Screenshot 3: after login, URL:', page.url());

  // Try clicking a league
  await page.waitForTimeout(2000);
  const allText = await page.textContent('body');
  console.log('Page body excerpt:', allText?.slice(0, 500));
  await page.screenshot({ path: '/tmp/pw_04_home.png', fullPage: true });

  await browser.close();
})();
