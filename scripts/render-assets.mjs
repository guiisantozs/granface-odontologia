import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:600,height:660},deviceScaleFactor:1.5});
  for(const model of ['tooth','arch','implant']){
    await page.goto(`http://127.0.0.1:5173/?asset=${model}`);
    await page.locator('canvas').waitFor();
    await page.waitForTimeout(2500);
    const data=await page.locator('canvas').evaluate(canvas=>canvas.toDataURL('image/png').split(',')[1]);
    await writeFile(`public/assets/model-${model}.png`,Buffer.from(data,'base64'));
    console.log(`Rendered original 3D asset: model-${model}.png`);
  }
} finally { await browser.close(); }
