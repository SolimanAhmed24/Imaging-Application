import { test, expect } from '../fixtures/viewerFixture';

test('Navigates to next image using mouse scroll', async ({ viewerPage }) => {
    const initialInfo: any = await viewerPage.getRenderedImageInfo();


    await viewerPage.scrollViewport(1000);

    const scrolledInfo: any = await viewerPage.getRenderedImageInfo();

    expect(scrolledInfo.imageIndex).toBeGreaterThan(initialInfo.imageIndex);
});