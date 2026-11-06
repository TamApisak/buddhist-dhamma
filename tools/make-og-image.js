#!/usr/bin/env node
/* =====================================================================
   สร้างภาพสำหรับแชร์ลิงก์บน Facebook / LINE
   ผลลัพธ์: assets/og-image.png ขนาด 1200×630 พิกเซล
   แม่แบบ:  tools/og-image/template.html (ดึงชื่อชมรม คำขวัญ และโลโก้จาก content/site.js)

   วิธีใช้ (ต้องมี Google Chrome, Chromium หรือ Microsoft Edge ในเครื่อง และต่ออินเทอร์เน็ตเพื่อโหลดฟอนต์)
     node tools/make-og-image.js
   ถ้าโปรแกรมหาเบราว์เซอร์ไม่เจอ ให้ระบุที่อยู่เอง เช่น
     CHROME_PATH="/path/to/chrome" node tools/make-og-image.js
   ===================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { pathToFileURL } = require('url');

const WIDTH = 1200;
const HEIGHT = 630;
const root = path.resolve(__dirname, '..');
const template = path.join(__dirname, 'og-image', 'template.html');
const output = path.join(root, 'assets', 'og-image.png');

function findBrowser() {
  const fixed = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of fixed) if (p && fs.existsSync(p)) return p;
  const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge'];
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    for (const n of names) {
      const p = path.join(dir, n);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

const browser = findBrowser();
if (!browser) {
  console.error('ไม่พบ Google Chrome / Chromium / Edge ในเครื่อง กรุณาติดตั้ง หรือระบุ CHROME_PATH');
  process.exit(1);
}

// ใช้โปรไฟล์ชั่วคราว เพื่อไม่ให้ชนกับ Chrome ที่เปิดใช้งานอยู่
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'og-image-'));
try {
  execFileSync(browser, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--force-device-scale-factor=1',
    '--user-data-dir=' + profile,
    '--window-size=' + WIDTH + ',' + HEIGHT,
    '--virtual-time-budget=15000', // รอให้ฟอนต์และรูปโหลดครบก่อนถ่ายภาพ
    '--screenshot=' + output,
    pathToFileURL(template).href
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
} finally {
  fs.rmSync(profile, { recursive: true, force: true });
}

const size = fs.existsSync(output) && pngSize(output);
if (!size) {
  console.error('สร้างภาพไม่สำเร็จ');
  process.exit(1);
}
if (size.width !== WIDTH || size.height !== HEIGHT) {
  console.error('ขนาดภาพไม่ถูกต้อง: ได้ ' + size.width + '×' + size.height + ' แต่ต้องเป็น ' + WIDTH + '×' + HEIGHT);
  process.exit(1);
}
console.log('สร้างภาพแล้ว: ' + path.relative(root, output) + ' (' + size.width + '×' + size.height + ', ' + Math.round(size.bytes / 1024) + ' KB)');
console.log('ถ้าเคยแชร์ลิงก์บน Facebook ไปแล้ว ให้กด "Scrape Again" ที่ https://developers.facebook.com/tools/debug/ เพื่อให้ Facebook ดึงภาพใหม่');
