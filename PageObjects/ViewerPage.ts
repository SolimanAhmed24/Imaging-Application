import { Page, Locator, expect } from '@playwright/test';

export class ViewerPage {
    readonly page: Page;
    readonly seriesItems: Locator;
    readonly viewport: Locator;
    readonly patientOverlay: Locator;


    constructor(page: Page) {
        this.page = page;
        this.seriesItems = page.locator('[data-testid="series-selection-buttons"] button');
        this.viewport = page.locator('[data-testid="medical-image-viewport"]');
        this.patientOverlay = page.locator('[data-testid="patient-info"]');

    }

    async goTo() {
        await this.page.goto('/');
        await this.page.locator('[data-testid="welcome-popup-accept-button"]').click();

    }



async getRenderedImageInfo() {
    await this.page.waitForSelector('[data-testid="medical-image-viewport"]', { state: 'attached' });
    
    
    await this.page.waitForTimeout(100);
    
    return await this.page.evaluate(() => {
        return new Promise((resolve, reject) => {
            const viewport = document.querySelector('[data-testid="medical-image-viewport"]');
            if (!viewport) {
                reject(new Error('Viewport not found'));
                return;
            }
            
            let resolved = false;
            
            const listener = (event) => {
                if (!resolved) {
                    resolved = true;
                    resolve(event.detail);
                }
            };
            
            viewport.addEventListener('imagerendered', listener, { once: true });
            
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    viewport.removeEventListener('imagerendered', listener);
                    reject(new Error('Timeout waiting for imagerendered event'));
                }
            }, 10000);
        });
    });
}



    async switchSeries(index: number) {
        await expect(this.seriesItems.nth(index)).toBeVisible();
        await this.seriesItems.nth(index).click();
    }

    async scrollViewport(deltaY: number) {
        await this.viewport.dispatchEvent('wheel', {
            deltaY,
            bubbles: true,
        });
    }

    async takeScreenshot(filePath: string) {
        await this.viewport.screenshot({ path: filePath });
    }
}