/* =====================================================================
   เซิร์ฟเวอร์ทดสอบขนาดเล็ก (ไม่ต้องติดตั้งอะไรเพิ่ม)
   ใช้สำหรับเปิดดูเว็บไซต์ในเครื่องก่อนนำขึ้นโฮสติ้ง
   วิธีใช้:  node tools/serve.js                 เปิดที่ http://127.0.0.1:8765/
            node tools/serve.js 3000            กำหนดพอร์ตเอง
            node tools/serve.js 8766 --prefix ชื่อ-repo
                                                จำลองที่อยู่แบบ GitHub Pages
                                                เช่น http://127.0.0.1:8766/ชื่อ-repo/
   เมื่อไม่พบไฟล์ เซิร์ฟเวอร์จะแสดงหน้า 404.html เช่นเดียวกับบน GitHub Pages
   ===================================================================== */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
let port = Number(process.env.PORT || 8765);
let prefix = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--prefix' && args[i + 1]) prefix = '/' + args[++i].replace(/^\/+|\/+$/g, '');
  else if (/^\d+$/.test(args[i])) port = Number(args[i]);
}

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf'
};

function notFound(res) {
  fs.readFile(path.join(root, '404.html'), function (err, data) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    if (err) {
      res.end('<!doctype html><html lang="th"><meta charset="utf-8"><title>ไม่พบหน้า</title>' +
        '<p style="font-family:sans-serif;padding:2rem">ไม่พบไฟล์ที่ต้องการ (404) — <a href="' + prefix + '/">กลับหน้าแรก</a></p></html>');
    } else {
      res.end(data);
    }
  });
}

http.createServer(function (req, res) {
  let p;
  try { p = decodeURIComponent((req.url || '/').split('?')[0]); } catch (e) { p = '/'; }
  if (prefix) {
    if (p === prefix) { res.writeHead(301, { Location: prefix + '/' }); res.end(); return; }
    if (!p.startsWith(prefix + '/')) { notFound(res); return; }
    p = p.slice(prefix.length);
  }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, function (err, data) {
    if (err) { notFound(res); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', function () {
  console.log('เปิดดูเว็บไซต์ได้ที่ http://127.0.0.1:' + port + prefix + '/');
});
