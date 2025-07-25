import { test, expect } from '../fixtures/viewerFixture';

test('Patient information displays correctly', async ({ viewerPage }) => {
    const info: any = await viewerPage.getRenderedImageInfo();
    expect(info.patientInfo.name).toBeDefined();
    expect(info.patientInfo.id).toBeDefined();
});