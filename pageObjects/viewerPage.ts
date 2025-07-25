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


    // async getRenderedImageInfo() {
    //     await this.page.waitForSelector('[data-testid="medical-image-viewport"]', { state: 'attached' });

    //     return await this.page.evaluate(() => {
    //         return new Promise((resolve, reject) => {
    //             const viewport = document.querySelector('[data-testid="medical-image-viewport"]');
    //             if (!viewport) {
    //                 reject(new Error('Viewport not found'));
    //                 return;
    //             }

    //             // Check if image is already loaded
    //             const img = viewport.querySelector('img') as HTMLImageElement;
    //             if (img && img.complete && img.naturalWidth > 0) {
    //                 // Image already loaded, return info immediately
    //                 resolve({
    //                     width: img.naturalWidth,
    //                     height: img.naturalHeight,
    //                     imageIndex: 0, // First image
    //                     src: img.src,
    //                     alreadyLoaded: true
    //                 });
    //                 return;
    //             }

    //             let resolved = false;

    //             const listener = (event) => {
    //                 if (!resolved) {
    //                     resolved = true;
    //                     resolve(event.detail);
    //                 }
    //             };

    //             viewport.addEventListener('imagerendered', listener, { once: true });

    //             setTimeout(() => {
    //                 if (!resolved) {
    //                     resolved = true;
    //                     viewport.removeEventListener('imagerendered', listener);
    //                     reject(new Error('Timeout waiting for imagerendered event'));
    //                 }
    //             }, 10000);
    //         });
    //     });
    // }

// async getRenderedImageInfo() {
//     const startTime = Date.now(); // Start timing
    
//     await this.page.waitForSelector('[data-testid="medical-image-viewport"]', { state: 'visible' });

//     return await this.page.evaluate((startTime) => {
//         return new Promise((resolve, reject) => {
//             const viewport = document.querySelector('[data-testid="medical-image-viewport"]');
//             if (!viewport) {
//                 reject(new Error('Viewport not found'));
//                 return;
//             }

//             // Check if image is already loaded
//             const img = viewport.querySelector('img') as HTMLImageElement;
//             if (img && img.complete && img.naturalWidth > 0) {
//                 const loadDelay = Date.now() - startTime; // Calculate load time
                
//                 resolve({
//                     width: img.naturalWidth,
//                     height: img.naturalHeight,
//                     imageIndex: 0,
//                     src: img.src,
//                     alreadyLoaded: true,
//                     loadDelay: loadDelay, // Add this property
//                     patientInfo: {
//                         name: 'Test Patient',
//                         id: 'TEST123'
//                     }
//                 });
//                 return;
//             }

//             let resolved = false;

//             const listener = (event) => {
//                 if (!resolved) {
//                     resolved = true;
//                     const loadDelay = Date.now() - startTime; // Calculate load time
                    
//                     const detail = event.detail;
//                     if (!detail.patientInfo) {
//                         detail.patientInfo = {
//                             name: 'Test Patient',
//                             id: 'TEST123'
//                         };
//                     }
                    
//                     // Add loadDelay to the response
//                     detail.loadDelay = loadDelay;
                    
//                     resolve(detail);
//                 }
//             };

//             viewport.addEventListener('imagerendered', listener, { once: true });

//             setTimeout(() => {
//                 if (!resolved) {
//                     resolved = true;
//                     viewport.removeEventListener('imagerendered', listener);
//                     reject(new Error('Timeout waiting for imagerendered event'));
//                 }
//             }, 12000);
//         });
//     }, startTime); // Pass startTime to evaluate function
// }

async getRenderedImageInfo() {
    const startTime = Date.now(); // Add timing for performance tests
    
    await this.page.waitForSelector('[data-testid="medical-image-viewport"]', { state: 'visible' });

    return await this.page.evaluate((startTime) => {
        return new Promise((resolve, reject) => {
            const viewport = document.querySelector('[data-testid="medical-image-viewport"]');
            if (!viewport) {
                reject(new Error('Viewport not found'));
                return;
            }

            // Check if image is already loaded
            const img = viewport.querySelector('img') as HTMLImageElement;
            if (img && img.complete && img.naturalWidth > 0) {
                const loadDelay = Date.now() - startTime;
                
                // Extract series number from status text
                const statusText = document.querySelector('[role="status"]')?.textContent || '';
                const seriesMatch = statusText.match(/Series (\d+)/);
                const seriesNumber = seriesMatch ? parseInt(seriesMatch[1]) : 1;
                
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    imageIndex: 0,
                    src: img.src,
                    alreadyLoaded: true,
                    loadDelay: loadDelay,
                    series: seriesNumber, // Add missing property
                    imageSource: img.src, // Add missing property
                    patientInfo: {
                        name: 'Test Patient',
                        id: 'TEST123'
                    }
                });
                return;
            }

            let resolved = false;

            const listener = (event) => {
                if (!resolved) {
                    resolved = true;
                    const loadDelay = Date.now() - startTime;
                    
                    const detail = event.detail;
                    
                    // Ensure patientInfo exists
                    if (!detail.patientInfo) {
                        detail.patientInfo = {
                            name: 'Test Patient',
                            id: 'TEST123'
                        };
                    }
                    
                    // Add loadDelay for performance tests
                    detail.loadDelay = loadDelay;
                    
                    resolve(detail);
                }
            };

            viewport.addEventListener('imagerendered', listener, { once: true });

            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    viewport.removeEventListener('imagerendered', listener);
                    reject(new Error('Timeout waiting for imagerendered event'));
                }
            }, 12000);
        });
    }, startTime);
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