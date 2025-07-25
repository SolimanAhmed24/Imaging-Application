import { test, expect } from '../fixtures/viewerFixture';

test('Image loading performance is within limits', async ({ viewerPage }) => {
    const info: any = await viewerPage.getRenderedImageInfo();
    expect(info.loadDelay).toBeLessThan(2000); 
});