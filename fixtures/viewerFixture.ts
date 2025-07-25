import { test as base } from '@playwright/test';
import { ViewerPage } from '../PageObjects/viewerPage';

type Fixtures = {
    viewerPage: ViewerPage;
};

export const test = base.extend<Fixtures>({
    viewerPage: async ({ page }, use) => {
        const viewerPage = new ViewerPage(page);
        await viewerPage.goTo();
        await use(viewerPage);
    },
});

export { expect } from '@playwright/test';