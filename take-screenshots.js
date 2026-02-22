const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:8081...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {
    console.log('networkidle timeout, continuing...');
  });

  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshot_home.png', fullPage: false });
  console.log('Home screenshot taken');

  // Get page title and URL
  const title = await page.title();
  const url = page.url();
  console.log('Title:', title);
  console.log('URL:', url);

  // Get all visible text content
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body text (first 1000 chars):', bodyText.substring(0, 1000));

  // Get all interactive elements
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button, [role="tab"], [role="button"]'))
      .map(el => ({ tag: el.tagName, text: el.innerText?.trim(), href: el.href, role: el.getAttribute('role') }))
      .filter(el => el.text)
      .slice(0, 30);
  });
  console.log('Interactive elements:', JSON.stringify(links, null, 2));

  // Look for navigation tabs
  const tabs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="tab"], nav a, .tab, [class*="tab"]'))
      .map(el => ({ text: el.innerText?.trim(), class: el.className }))
      .filter(el => el.text);
  });
  console.log('Tabs found:', JSON.stringify(tabs, null, 2));

  // Try to find and click tab buttons
  const tabButtons = await page.$$('a[href*="tab"], a[href="/"], [role="tablist"] *');
  console.log('Tab button count:', tabButtons.length);

  // Take a full-page screenshot
  await page.screenshot({ path: 'screenshot_full.png', fullPage: true });
  console.log('Full page screenshot taken');

  // Check for specific routes
  const routes = ['/', '/(tabs)', '/listings', '/add-car', '/notifications'];
  
  for (const route of routes) {
    try {
      console.log(`\nNavigating to route: ${route}`);
      await page.goto(`http://localhost:8081${route}`, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2000);
      const safeName = route.replace(/\//g, '_').replace(/[()]/g, '') || 'root';
      await page.screenshot({ path: `screenshot${safeName}.png` });
      const pageText = await page.evaluate(() => document.body.innerText).catch(() => '');
      console.log(`Route ${route} text (300 chars):`, pageText.substring(0, 300));
    } catch (e) {
      console.log(`Route ${route} error:`, e.message);
    }
  }

  await browser.close();
  console.log('\nAll screenshots saved!');
})().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
