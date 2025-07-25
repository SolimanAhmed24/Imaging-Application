import { test, expect } from '../fixtures/viewerFixture';

test('Rendering performance metrics via CDP (Chromium only)', async ({ viewerPage, page, context, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium', 'CDP metrics only available in Chromium');

  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');

  await page.waitForSelector('[data-testid="medical-image-viewport"] img');

  const { metrics } = await client.send('Performance.getMetrics');
  const metricMap = new Map(metrics.map(m => [m.name, m.value]));

  const navStart = metricMap.get('NavigationStart') || 0;
  const fcp = ((metricMap.get('FirstContentfulPaint') || 0) - navStart) * 1000;
  const lcp = ((metricMap.get('LargestContentfulPaint') || 0) - navStart) * 1000;

  await test.step('Rendering performance metrics (CDP)', async () => {
    await testInfo.attach('FCP (ms)', {
      body: fcp.toFixed(2),
      contentType: 'text/plain',
    });
    await testInfo.attach('LCP (ms)', {
      body: lcp.toFixed(2),
      contentType: 'text/plain',
    });
  });

  expect(fcp).toBeLessThan(2000);
  expect(lcp).toBeLessThan(3000);
});

