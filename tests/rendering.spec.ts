import { test, expect } from '../fixtures/viewerFixture';

test('Image renders correctly on load', async ({ viewerPage }) => {
    const info: any = await viewerPage.getRenderedImageInfo();
    expect(info.imageIndex).toBe(0);
    expect(info.series).toBe(1);
    expect(info.imageSource).toContain('/1/');
});