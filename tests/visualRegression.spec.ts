import { test, expect } from '../fixtures/viewerFixture';
import { compareImages } from '../utils/compareImages';

test('Visual regression - image viewport matches baseline', async ({ viewerPage }) => {
    const currentPath = 'test-results/current.png';
    const baselinePath = 'baseline/baseline.png';
    const diffPath = 'test-results/diff.png';

    await viewerPage.getRenderedImageInfo();
    await viewerPage.takeScreenshot(currentPath);



    const diff = await compareImages(baselinePath, currentPath, diffPath);

    expect(diff).toBeLessThan(2200);
});