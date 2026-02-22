const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  console.log('Navigating...');
  
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded', timeout: 10000 });
  } catch(e) {
    console.log('Navigation error:', e.message);
  }
  
  // Wait for content
  await new Promise(r => setTimeout(r, 4000));
  
  const title = await page.title().catch(() => 'N/A');
  console.log('TITLE:', title);
  
  const bodyText = await page.evaluate(() => document.body ? document.body.innerText : 'no body').catch(() => 'eval error');
  console.log('BODY TEXT (first 2000):\n', bodyText.substring(0, 2000));
  
  // Get computed styles and layout info
  const layout = await page.evaluate(() => {
    const result = {
      docTitle: document.title,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      bgColor: document.body ? window.getComputedStyle(document.body).backgroundColor : 'N/A',
      elements: []
    };
    
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (text && text.length > 1) {
        const parent = node.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          const style = window.getComputedStyle(parent);
          if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight + 100) {
            result.elements.push({
              text: text.substring(0, 80),
              tag: parent.tagName,
              top: Math.round(rect.top),
              left: Math.round(rect.left),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              fontSize: style.fontSize,
              color: style.color,
              fontWeight: style.fontWeight,
              bg: style.backgroundColor
            });
          }
        }
      }
    }
    return result;
  }).catch(e => ({ error: e.message }));
  
  console.log('\nLAYOUT INFO:', JSON.stringify(layout, null, 2));
  
  await page.screenshot({ path: 'home_detail.png', fullPage: false });
  console.log('\nScreenshot saved as home_detail.png');
  
  // Now check what URL we actually loaded
  console.log('Current URL:', page.url());
  
  // Try navigating to specific tab pages
  const pages_to_check = [
    { url: 'http://localhost:8081/(tabs)', name: 'tabs' },
    { url: 'http://localhost:8081/listings', name: 'listings' },
    { url: 'http://localhost:8081/add-listing', name: 'add-listing' },
    { url: 'http://localhost:8081/notifications', name: 'notifications' },
  ];
  
  for (const p of pages_to_check) {
    try {
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 8000 });
      await new Promise(r => setTimeout(r, 2500));
      
      const pText = await page.evaluate(() => document.body ? document.body.innerText.substring(0, 500) : '').catch(() => '');
      console.log(`\n--- PAGE: ${p.name} (${page.url()}) ---`);
      console.log('Text:', pText);
      
      await page.screenshot({ path: `detail_${p.name}.png` });
      console.log(`Screenshot saved: detail_${p.name}.png`);
    } catch(e) {
      console.log(`Error on ${p.name}:`, e.message);
    }
  }
  
  await browser.close();
  console.log('\nDone!');
})().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(0);
});
