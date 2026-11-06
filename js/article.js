/* หน้าบทความ: แสดงบทความตามรหัสใน URL พร้อมบทความที่เกี่ยวข้อง */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc, I = S.ICONS;
  var root = S.$('#article-root'); if (!root) return;

  var id = S.param('id');
  var all = S.visible(window.ARTICLES);
  var a = all.filter(function (x) { return x.id === id; })[0];

  if (!a) {
    S.setTitle('ไม่พบบทความ');
    root.innerHTML = '<div class="container section">' + S.emptyState({
      title: 'ไม่พบบทความที่ต้องการ',
      text: 'ลิงก์อาจไม่ถูกต้อง หรือบทความนี้ถูกย้ายหรือยังไม่เผยแพร่',
      actions: '<a class="btn btn-primary btn-sm" href="dhamma.html">กลับไปคลังธรรมะ</a>'
    }) + '</div>';
    return;
  }

  S.setTitle(a.title, a.excerpt);
  var author = a.teacher || a.author || 'ไม่ระบุผู้เขียน';
  var related = all.filter(function (x) { return x.id !== a.id && x.topic === a.topic; });
  if (related.length < 3) {
    all.filter(function (x) { return x.id !== a.id && x.topic !== a.topic; })
      .sort(function (x, y) { return (y.date || '').localeCompare(x.date || ''); })
      .forEach(function (x) { if (related.length < 3) related.push(x); });
  }
  related = related.slice(0, 3);

  var sampleBanner = a.sample
    ? '<div class="notice" role="note">' + I.info + '<p><strong>บทความตัวอย่าง:</strong> เนื้อหานี้เรียบเรียงจากหลักธรรมทั่วไปพร้อมระบุแหล่งอ้างอิง เพื่อแสดงรูปแบบของเว็บไซต์ ไม่มีการแต่งคำพูดของครูบาอาจารย์ท่านใด และควรให้ผู้รู้ตรวจทานก่อนเผยแพร่จริง</p></div>'
    : '';

  var shareUrl = window.location.href;
  var fbShare = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl);

  root.innerHTML =
    '<div class="page-head"><div class="container">' +
    '<nav class="breadcrumb" aria-label="เส้นทางหน้า"><ol>' +
    '<li><a href="index.html">หน้าแรก</a></li>' +
    '<li><a href="dhamma.html">คลังธรรมะ</a></li>' +
    '<li><a href="dhamma.html?topic=' + encodeURIComponent(a.topic) + '">' + esc(a.topic) + '</a></li>' +
    '</ol></nav>' +
    '<div class="article">' +
    '<div class="card-top"><a class="tag" href="dhamma.html?topic=' + encodeURIComponent(a.topic) + '">' + esc(a.topic) + '</a>' + S.sampleBadge(a) + '</div>' +
    '<h1>' + esc(a.title) + '</h1>' +
    '<div class="article-meta">' +
    '<span>' + I.user + esc(author) + '</span>' +
    '<span>' + I.calendar + 'เผยแพร่ ' + esc(S.thaiDate(a.date)) + '</span>' +
    '<span>' + I.clock + 'อ่านประมาณ ' + S.readMinutes(a.body) + ' นาที</span>' +
    '</div>' +
    (a.source ? '<p class="muted small mt-2 mb-0">' + I.book + ' ที่มา: ' + esc(a.source) + '</p>' : '') +
    '</div></div></div>' +

    '<div class="container section-tight section">' +
    '<article class="article">' +
    sampleBanner +
    '<div class="article-tools">' +
    '<div class="group"><span class="label">ขนาดตัวอักษร</span>' + S.textSizeControl() + '</div>' +
    '<div class="group">' +
    '<button type="button" class="btn btn-ghost btn-sm" id="copy-link">' + I.link + '<span>คัดลอกลิงก์</span></button>' +
    '<a class="btn btn-ghost btn-sm" href="' + esc(fbShare) + '" target="_blank" rel="noopener noreferrer">' + I.facebook + '<span>แชร์</span></a>' +
    '</div></div>' +
    '<div class="article-body">' + (a.body || '') + '</div>' +
    (a.sources && a.sources.length
      ? '<section class="sources" aria-labelledby="sources-title"><h2 id="sources-title">แหล่งที่มาและเอกสารอ้างอิง</h2><ol>' +
        a.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></section>'
      : '') +
    (a.tags && a.tags.length
      ? '<div class="card-tags mt-3 flex">' + a.tags.map(function (t) { return '<a class="tag" href="dhamma.html?q=' + encodeURIComponent(t) + '">' + esc(t) + '</a>'; }).join('') + '</div>'
      : '') +
    '<div class="article-foot">' +
    '<a class="btn btn-secondary btn-sm" href="dhamma.html">' + I.arrowRight + '<span>กลับไปคลังธรรมะ</span></a>' +
    '<button type="button" class="btn btn-ghost btn-sm" id="copy-link-2">' + I.link + '<span>คัดลอกลิงก์บทความ</span></button>' +
    '</div>' +
    '</article>' +
    (related.length
      ? '<section class="related" aria-labelledby="related-title">' +
        '<div class="section-head"><p class="eyebrow">อ่านต่อ</p><h2 id="related-title">บทความที่เกี่ยวข้อง</h2></div>' +
        '<div class="grid grid-3">' + related.map(S.articleCard).join('') + '</div></section>'
      : '') +
    '</div>';

  S.$$('#copy-link, #copy-link-2').forEach(function (b) {
    b.addEventListener('click', function () { S.copyLink(shareUrl); });
  });
  // อัปเดตสถานะปุ่มขนาดตัวอักษรชุดที่เพิ่งสร้าง
  var cur = document.documentElement.getAttribute('data-text-size') || 'm';
  var sizes = ['s', 'm', 'l', 'xl'], idx = sizes.indexOf(cur);
  S.$$('[data-ts="down"]').forEach(function (b) { b.disabled = idx <= 0; });
  S.$$('[data-ts="up"]').forEach(function (b) { b.disabled = idx >= sizes.length - 1; });
})();
