const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  page.on('response', resp => {
    if (resp.url().includes('auth') || resp.url().includes('login')) {
      console.log('NETWORK:', resp.status(), resp.url());
    }
  });

  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '/tmp/ss_01_login.png', fullPage: true });

  await page.fill('input[type="email"]', 'sconnor@example.com');
  await page.fill('input[type="password"]', 'securepass1');
  await page.click('text=Login');
  await page.waitForTimeout(5000);

  console.log('URL after login:', page.url());
  await page.screenshot({ path: '/tmp/ss_02_home.png', fullPage: true });

  // Print body text to understand what's on screen
  const bodyText = await page.textContent('body');
  console.log('Home page body:', bodyText?.slice(0, 1000));

  await browser.close();
})();
