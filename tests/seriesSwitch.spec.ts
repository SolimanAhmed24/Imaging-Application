import { test, expect } from '../fixtures/viewerFixture';

test('Switch between image series correctly', async ({ viewerPage }) => {
    await viewerPage.switchSeries(1); 
    const info: any = await viewerPage.getRenderedImageInfo();
    expect(info.series).toBe(2);
    expect(info.imageIndex).toBe(0);
});