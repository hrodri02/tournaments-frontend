const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // Capture console and network errors
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('response', resp => {
    if (resp.url().includes('auth') || resp.url().includes('login')) {
      console.log('NETWORK:', resp.status(), resp.url());
    }
  });

  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'sconnor@example.com');
  await page.fill('input[type="password"]', 'password123');

  // Click the Login button
  await page.click('text=Login');
  await page.waitForTimeout(5000);

  const url = page.url();
  const bodyText = await page.textContent('body');
  console.log('URL after login:', url);
  console.log('Body:', bodyText?.slice(0, 800));
  await page.screenshot({ path: '/tmp/pw_login_attempt.png', fullPage: true });

  await browser.close();
})();
