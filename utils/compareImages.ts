import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export async function compareImages(img1Path: string, img2Path: string, diffPath: string) {
    const img1 = PNG.sync.read(fs.readFileSync(img1Path));
    const img2 = PNG.sync.read(fs.readFileSync(img2Path));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    return numDiffPixels;
}

