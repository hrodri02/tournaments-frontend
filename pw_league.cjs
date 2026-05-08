const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'sconnor@example.com');
  await page.fill('input[type="password"]', 'securepass1');
  await page.click('text=Login');
  await page.waitForTimeout(5000);

  // Screenshot home/leagues list
  await page.screenshot({ path: '/tmp/ss_home.png', fullPage: true });
  console.log('Home screenshot taken');

  // Click Liga MX (current league)
  await page.click('text=Liga MX');
  await page.waitForTimeout(3000);
  console.log('URL after clicking Liga MX:', page.url());

  const bodyText = await page.textContent('body');
  console.log('League page body:', bodyText?.slice(0, 2000));

  await page.screenshot({ path: '/tmp/ss_league.png', fullPage: true });
  console.log('League screenshot taken');

  // Try scrolling to see more content
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/ss_league_scrolled.png', fullPage: true });

  await browser.close();
})();
