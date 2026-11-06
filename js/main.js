/* =====================================================================
   main.js — ส่วนกลางของเว็บไซต์
   ส่วนหัว/ส่วนท้าย เมนูมือถือ ปุ่มปรับขนาดตัวอักษร ปุ่มกลับขึ้นบน
   และตัวช่วยสร้างการ์ดที่หน้าอื่น ๆ ใช้ร่วมกัน (window.Site)
   ===================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var TEXT_SIZES = ['s', 'm', 'l', 'xl'];
  var TEXT_SIZE_LABELS = { s: 'เล็ก', m: 'ปกติ', l: 'ใหญ่', xl: 'ใหญ่มาก' };
  var STORAGE_KEY = 'pdk-text-size';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var svgOpen = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var ICONS = {
    menu: svgOpen + '<path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: svgOpen + '<path d="M6 6l12 12M18 6L6 18"/></svg>',
    facebook: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.6 22v-8.1h2.8l.4-3.3h-3.2V8.5c0-1 .3-1.6 1.6-1.6h1.8V4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.3H7.3v3.3h2.8V22h3.5z"/></svg>',
    search: svgOpen + '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    calendar: svgOpen + '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    clock: svgOpen + '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: svgOpen + '<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    user: svgOpen + '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    book: svgOpen + '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
    play: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>',
    headphones: svgOpen + '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
    video: svgOpen + '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>',
    arrowUp: svgOpen + '<path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    arrowRight: svgOpen + '<path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    leaf: svgOpen + '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19c4-5 7-8 11-11"/></svg>',
    info: svgOpen + '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    link: svgOpen + '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    check: svgOpen + '<path d="m5 12 5 5L20 7"/></svg>',
    image: svgOpen + '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/></svg>',
    external: svgOpen + '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    heart: svgOpen + '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    hands: svgOpen + '<path d="M7 11V6a2 2 0 1 1 4 0v5M11 10V4a2 2 0 1 1 4 0v6M15 9V6a2 2 0 1 1 4 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.7 13a1.8 1.8 0 0 1 3-2l1.3 2"/></svg>',
    lotus: svgOpen + '<path d="M12 21c-5 0-8-3-9-7 3 0 5 1 6.5 2.5C9 12 10 8 12 5c2 3 3 7 2.5 11.5C16 15 18 14 21 14c-1 4-4 7-9 7z"/></svg>'
  };

  /* ---------- ตัวช่วยทั่วไป ---------- */
  function param(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }

  function parseDate(iso) {
    if (!iso) return null;
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  function thaiDate(iso, opts) {
    var d = parseDate(iso);
    if (!d) return iso || '';
    var o = { year: 'numeric', month: 'long', day: 'numeric' };
    if (opts) { for (var k in opts) o[k] = opts[k]; }
    try { return d.toLocaleDateString('th-TH-u-ca-buddhist', o); }
    catch (e) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() + 543); }
  }

  function stripHtml(html) {
    var t = document.createElement('div');
    t.innerHTML = html || '';
    return (t.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function readMinutes(html) {
    var chars = stripHtml(html).length;
    return Math.max(1, Math.round(chars / 650));
  }

  function visible(list) {
    list = list || [];
    return SITE.showSampleContent ? list.slice() : list.filter(function (i) { return !i.sample; });
  }

  function hasSamples(list) {
    return (list || []).some(function (i) { return i.sample; });
  }

  function setTitle(title, description) {
    document.title = title ? title + ' | ' + (SITE.name || '') : (SITE.name || '');
    if (description) {
      var m = $('meta[name="description"]');
      if (m) m.setAttribute('content', description);
      var og = $('meta[property="og:description"]');
      if (og) og.setAttribute('content', description);
    }
    var ogt = $('meta[property="og:title"]');
    if (ogt) ogt.setAttribute('content', document.title);
  }

  function fbUrl() { return SITE.facebookUrl || '#'; }

  function fbButton(cls, label) {
    return '<a class="btn ' + (cls || 'btn-primary btn-sm') + '" href="' + esc(fbUrl()) + '" target="_blank" rel="noopener noreferrer">' +
      ICONS.facebook + '<span>' + esc(label || 'ไปที่เพจ Facebook') + '</span></a>';
  }

  /* ---------- ส่วนประกอบที่ใช้ร่วมกัน ---------- */
  function placeholder(label, icon) {
    label = label || 'รอรูปภาพจากชมรม';
    return '<div class="ph" role="img" aria-label="ภาพประกอบชั่วคราว: ' + esc(label) + '">' +
      '<div class="ph-inner">' + (icon || ICONS.image) + '<span class="ph-label">' + esc(label) + '</span></div></div>';
  }

  function mediaImage(src, alt, label, icon) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy">';
    return placeholder(label, icon);
  }

  function sampleBadge(item) {
    return item && item.sample
      ? '<span class="badge badge-sample" title="เนื้อหาตัวอย่างสำหรับแสดงรูปแบบเว็บไซต์ จะถูกแทนที่ด้วยเนื้อหาจริงของชมรม">ตัวอย่าง</span>'
      : '';
  }

  function sampleNotice(text) {
    return '<div class="notice" role="note">' + ICONS.info + '<p><strong>หมายเหตุ:</strong> ' + esc(text) + '</p></div>';
  }

  function emptyState(o) {
    o = o || {};
    return '<div class="empty">' + (o.icon || ICONS.leaf) +
      '<h3>' + esc(o.title || 'ยังไม่มีเนื้อหาในส่วนนี้') + '</h3>' +
      '<p>' + esc(o.text || '') + '</p>' +
      (o.actions ? '<div class="flex">' + o.actions + '</div>' : '') +
      '</div>';
  }

  function textSizeControl() {
    return '<div class="text-size" role="group" aria-label="ปรับขนาดตัวอักษร">' +
      '<button type="button" class="ts-small" data-ts="down" aria-label="ลดขนาดตัวอักษร" title="ลดขนาดตัวอักษร">ก−</button>' +
      '<button type="button" class="ts-reset" data-ts="reset" aria-label="ขนาดตัวอักษรปกติ" title="ขนาดตัวอักษรปกติ">ปกติ</button>' +
      '<button type="button" class="ts-large" data-ts="up" aria-label="เพิ่มขนาดตัวอักษร" title="เพิ่มขนาดตัวอักษร">ก+</button>' +
      '</div>';
  }

  /* ---------- การ์ด ---------- */
  function articleCard(a) {
    var author = a.teacher || a.author || 'ไม่ระบุผู้เขียน';
    return '<article class="card">' +
      '<div class="card-media">' + mediaImage(a.image, a.imageAlt, 'ภาพประกอบบทความ (รอรูปภาพ)') + '</div>' +
      '<div class="card-body">' +
      '<div class="card-top"><a class="tag" href="dhamma.html?topic=' + encodeURIComponent(a.topic) + '">' + esc(a.topic) + '</a>' + sampleBadge(a) + '</div>' +
      '<h3 class="card-title"><a href="article.html?id=' + encodeURIComponent(a.id) + '">' + esc(a.title) + '</a></h3>' +
      '<p class="card-excerpt">' + esc(a.excerpt) + '</p>' +
      '<div class="card-meta">' +
      '<span>' + ICONS.user + esc(author) + '</span>' +
      '<span>' + ICONS.calendar + esc(thaiDate(a.date)) + '</span>' +
      '<span>' + ICONS.clock + 'อ่าน ' + readMinutes(a.body) + ' นาที</span>' +
      '</div></div></article>';
  }

  function activityStatus(a) {
    if (a.status === 'upcoming' || a.status === 'past') return a.status;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var end = parseDate(a.endDate || a.date);
    if (!end) return 'past';
    return end >= today ? 'upcoming' : 'past';
  }

  function dateBadge(iso) {
    var d = parseDate(iso);
    if (!d) return '';
    var mon;
    try { mon = d.toLocaleDateString('th-TH-u-ca-buddhist', { month: 'short' }); } catch (e) { mon = (d.getMonth() + 1) + ''; }
    return '<div class="date-badge" aria-hidden="true"><span class="d">' + d.getDate() + '</span><span class="m">' + esc(mon) + '</span><span class="y">' + (d.getFullYear() + 543) + '</span></div>';
  }

  function activityCard(a, opts) {
    opts = opts || {};
    var st = activityStatus(a);
    var upcoming = st === 'upcoming';
    var range = a.endDate ? thaiDate(a.date) + ' – ' + thaiDate(a.endDate) : thaiDate(a.date);
    var title = a.link
      ? '<a href="' + esc(a.link) + '" target="_blank" rel="noopener noreferrer">' + esc(a.title) + '</a>'
      : esc(a.title);
    return '<article class="card activity-card ' + (upcoming ? 'is-upcoming' : 'is-past') + '">' +
      '<div class="card-media">' + mediaImage(a.image, a.imageAlt, upcoming ? 'ภาพประกอบกิจกรรม (รอรูปภาพ)' : 'ภาพจากกิจกรรม (รอรูปภาพ)') + dateBadge(a.date) + '</div>' +
      '<div class="card-body">' +
      '<div class="card-top"><span class="badge ' + (upcoming ? 'badge-upcoming' : 'badge-past') + '">' + (upcoming ? 'กำลังจะมาถึง' : 'ผ่านไปแล้ว') + '</span>' + sampleBadge(a) + '</div>' +
      '<h3 class="card-title">' + title + '</h3>' +
      '<p class="' + (opts.full ? 'card-text' : 'card-excerpt') + '">' + esc(a.description) + '</p>' +
      '<div class="card-meta">' +
      '<span>' + ICONS.calendar + esc(range) + '</span>' +
      (a.time ? '<span>' + ICONS.clock + esc(a.time) + '</span>' : '') +
      (a.location ? '<span>' + ICONS.pin + esc(a.location) + '</span>' : '') +
      '</div>' +
      (a.link ? '<div class="mt-1"><a class="btn btn-ghost btn-sm" href="' + esc(a.link) + '" target="_blank" rel="noopener noreferrer">ดูรายละเอียดบน Facebook ' + ICONS.external + '</a></div>' : '') +
      '</div></article>';
  }

  function mediaCard(m) {
    var isAudio = m.type === 'audio';
    var typeLabel = isAudio ? 'เสียงธรรม' : 'วิดีโอ';
    var poster = m.poster || (m.youtubeId ? 'https://i.ytimg.com/vi/' + encodeURIComponent(m.youtubeId) + '/hqdefault.jpg' : null);
    var playable = !!(m.youtubeId || m.src);
    return '<article class="card media-card" data-id="' + esc(m.id) + '">' +
      '<div class="card-media">' +
      (poster ? '<img src="' + esc(poster) + '" alt="" loading="lazy">' : '') +
      '<span class="badge badge-type">' + (isAudio ? ICONS.headphones : ICONS.video) + typeLabel + '</span>' +
      '<span class="play-glyph' + (isAudio ? ' is-audio' : '') + '" aria-hidden="true">' + (isAudio ? ICONS.headphones : ICONS.play) + '</span>' +
      (m.duration ? '<span class="duration">' + esc(m.duration) + '</span>' : '') +
      '</div>' +
      '<div class="card-body">' +
      (m.sample ? '<div class="card-top">' + sampleBadge(m) + '</div>' : '') +
      '<h3 class="card-title"><button type="button" data-play="' + esc(m.id) + '" aria-haspopup="dialog">' + esc(m.title) + '</button></h3>' +
      '<p class="card-excerpt">' + esc(m.description) + '</p>' +
      '<div class="card-meta">' +
      '<span>' + ICONS.user + esc(m.speaker || 'ไม่ระบุผู้แสดงธรรม') + '</span>' +
      (m.recorded ? '<span>' + ICONS.calendar + esc(m.recorded) + '</span>' : '') +
      (m.duration ? '<span>' + ICONS.clock + esc(m.duration) + '</span>' : '') +
      '<span>' + ICONS.link + esc(m.source || 'ไม่ระบุแหล่งที่มา') + '</span>' +
      '</div>' +
      '<div class="mt-1"><button type="button" class="btn btn-ghost btn-sm" data-play="' + esc(m.id) + '">' +
      (playable ? (isAudio ? ICONS.headphones + '<span>ฟัง</span>' : ICONS.play + '<span>รับชม</span>') : ICONS.info + '<span>รายละเอียด</span>') +
      '</button></div>' +
      '</div></article>';
  }

  function teacherCard(t) {
    var hasBio = t.status === 'compiled' && t.bio;
    var title = hasBio
      ? '<a href="teacher.html?id=' + encodeURIComponent(t.id) + '">' + esc(t.name) + '</a>'
      : esc(t.name);
    return '<article class="card teacher-card">' +
      '<div class="card-media">' + mediaImage(t.image, t.name, 'รูปครูบาอาจารย์ (รอรูปที่ได้รับอนุญาต)', ICONS.lotus) + '</div>' +
      '<div class="card-body">' +
      '<div class="card-top">' + (hasBio
        ? '<span class="badge badge-verified">' + ICONS.book + 'มีประวัติฉบับย่อ</span>'
        : '<span class="badge badge-pending">รอข้อมูลประวัติ</span>') + '</div>' +
      '<h3 class="card-title">' + title + '</h3>' +
      (t.role ? '<p class="teacher-name-pali">' + esc(t.role) + '</p>' : '') +
      (t.summary ? '<p class="card-excerpt">' + esc(t.summary) + '</p>' : '') +
      '<div class="card-meta">' + (t.temple ? '<span>' + ICONS.pin + esc(t.temple) + '</span>' : '') + '</div>' +
      '</div></article>';
  }

  /* ---------- ส่วนหัว ---------- */
  function renderHeader() {
    var header = $('#site-header');
    if (!header) return;
    var page = document.body.getAttribute('data-page') || '';
    var alias = { article: 'dhamma', teacher: 'teachers' };
    var navItems = (SITE.nav || []).map(function (item) {
      var current = item.page === page || alias[page] === item.page;
      return '<li><a href="' + esc(item.href) + '"' + (current ? ' aria-current="page"' : '') + '>' + esc(item.label) + '</a></li>';
    }).join('');

    header.innerHTML =
      '<div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="' + esc(SITE.name) + ' — กลับหน้าแรก">' +
      '<img class="brand-mark" src="' + esc(SITE.logo || 'assets/logo-placeholder.svg') + '" alt="" width="46" height="46">' +
      '<span class="brand-text"><span class="brand-name">' + esc(SITE.nameLine1 || SITE.name) + '</span><span class="brand-sub">' + esc(SITE.nameLine2 || '') + '</span></span>' +
      '</a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
      '<span class="icon-menu">' + ICONS.menu + '</span><span class="icon-close">' + ICONS.close + '</span><span class="nav-toggle-label">เมนู</span>' +
      '</button>' +
      '<nav class="site-nav" id="site-nav" aria-label="เมนูหลัก">' +
      '<ul class="nav-list">' + navItems + '</ul>' +
      '<div class="nav-tools">' +
      '<p class="nav-tools-label">ขนาดตัวอักษร</p>' +
      textSizeControl() +
      '<a class="icon-btn" href="' + esc(fbUrl()) + '" target="_blank" rel="noopener noreferrer" aria-label="เพจ Facebook ของชมรม (เปิดหน้าต่างใหม่)">' + ICONS.facebook + '<span>Facebook</span></a>' +
      '</div>' +
      '</nav>' +
      '</div>';
  }

  /* ---------- ส่วนท้าย ---------- */
  function renderFooter() {
    var footer = $('#site-footer');
    if (!footer) return;
    var yearBE = new Date().getFullYear() + 543;
    var links = (SITE.nav || []).map(function (i) {
      return '<li><a href="' + esc(i.href) + '">' + esc(i.label) + '</a></li>';
    }).join('');
    footer.innerHTML =
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div>' +
      '<a class="footer-brand" href="index.html"><img src="' + esc(SITE.logo || 'assets/logo-placeholder.svg') + '" alt="" width="44" height="44">' +
      '<span class="brand-text"><span class="brand-name">' + esc(SITE.nameLine1 || SITE.name) + '</span><span class="brand-sub">' + esc(SITE.nameLine2 || '') + '</span></span></a>' +
      '<p>' + esc(SITE.description || '') + '</p>' +
      (SITE.footerNote ? '<p class="footer-note">' + esc(SITE.footerNote) + '</p>' : '') +
      '</div>' +
      '<div><h3>เมนู</h3><ul class="footer-links">' + links + '</ul></div>' +
      '<div><h3>ติดตามเรา</h3><p>ธรรมะประจำวัน ประวัติครูบาอาจารย์ และประกาศกิจกรรมของชมรม เผยแพร่ทางเพจ Facebook</p>' +
      fbButton('btn-light btn-sm') + '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
      '<span>© ' + yearBE + ' ' + esc(SITE.name) + '</span>' +
      '<span>' + (SITE.showSampleContent
        ? 'เว็บไซต์อยู่ระหว่างการจัดทำ เนื้อหาที่มีป้าย "ตัวอย่าง" จะถูกแทนที่ด้วยเนื้อหาจริงของชมรม'
        : 'เผยแผ่ธรรมะเป็นธรรมทาน') + '</span>' +
      '</div>' +
      '</div>';
  }

  /* ---------- เมนูมือถือ ---------- */
  function initMenu() {
    var btn = $('.nav-toggle');
    var nav = $('#site-nav');
    if (!btn || !nav) return;
    var label = $('.nav-toggle-label', btn);

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      if (label) label.textContent = open ? 'ปิด' : 'เมนู';
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    var mq = window.matchMedia('(min-width: 1200px)');
    var onChange = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- ขนาดตัวอักษร ---------- */
  function currentTextSize() {
    var v = document.documentElement.getAttribute('data-text-size');
    return TEXT_SIZES.indexOf(v) >= 0 ? v : 'm';
  }

  function applyTextSize(size, announce) {
    document.documentElement.setAttribute('data-text-size', size);
    try { localStorage.setItem(STORAGE_KEY, size); } catch (e) { /* โหมดส่วนตัว */ }
    var idx = TEXT_SIZES.indexOf(size);
    $$('[data-ts="down"]').forEach(function (b) { b.disabled = idx <= 0; });
    $$('[data-ts="up"]').forEach(function (b) { b.disabled = idx >= TEXT_SIZES.length - 1; });
    $$('[data-ts="reset"]').forEach(function (b) { b.setAttribute('aria-pressed', String(size === 'm')); });
    if (announce) toast('ขนาดตัวอักษร: ' + TEXT_SIZE_LABELS[size]);
  }

  function initTextSize() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ts]');
      if (!b) return;
      var idx = TEXT_SIZES.indexOf(currentTextSize());
      var action = b.getAttribute('data-ts');
      var next = action === 'up' ? Math.min(idx + 1, TEXT_SIZES.length - 1)
        : action === 'down' ? Math.max(idx - 1, 0)
        : TEXT_SIZES.indexOf('m');
      applyTextSize(TEXT_SIZES[next], true);
    });
    applyTextSize(currentTextSize(), false);
  }

  /* ---------- ปุ่มกลับขึ้นบน / แจ้งเตือนสั้น ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $('#site-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2200);
  }

  function initScrollUi() {
    document.body.insertAdjacentHTML('beforeend',
      '<button class="to-top" type="button" aria-label="กลับขึ้นด้านบน" title="กลับขึ้นด้านบน">' + ICONS.arrowUp + '</button>' +
      '<div class="toast" id="site-toast" role="status" aria-live="polite"></div>');
    var header = $('#site-header');
    var top = $('.to-top');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (top) top.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (top) top.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  function syncFacebookLinks() {
    $$('[data-fb-link]').forEach(function (a) {
      a.setAttribute('href', fbUrl());
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
    $$('[data-site-logo]').forEach(function (img) {
      img.setAttribute('src', SITE.logo || 'assets/logo-placeholder.svg');
    });
  }

  function copyLink(url) {
    url = url || window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(url).then(function () { toast('คัดลอกลิงก์แล้ว'); }, function () { fallbackCopy(url); });
    }
    fallbackCopy(url);
  }
  function fallbackCopy(url) {
    var ta = document.createElement('textarea');
    ta.value = url; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('คัดลอกลิงก์แล้ว'); } catch (e) { toast('คัดลอกไม่สำเร็จ โปรดคัดลอกจากแถบที่อยู่'); }
    document.body.removeChild(ta);
  }

  /* ---------- เริ่มทำงาน ---------- */
  function init() {
    renderHeader();
    renderFooter();
    initMenu();
    initTextSize();
    initScrollUi();
    syncFacebookLinks();
  }

  window.Site = {
    SITE: SITE, ICONS: ICONS,
    $: $, $$: $$, esc: esc, param: param,
    thaiDate: thaiDate, parseDate: parseDate, stripHtml: stripHtml, readMinutes: readMinutes,
    visible: visible, hasSamples: hasSamples, setTitle: setTitle,
    fbUrl: fbUrl, fbButton: fbButton,
    placeholder: placeholder, mediaImage: mediaImage, sampleBadge: sampleBadge, sampleNotice: sampleNotice,
    emptyState: emptyState, textSizeControl: textSizeControl,
    articleCard: articleCard, activityCard: activityCard, activityStatus: activityStatus,
    mediaCard: mediaCard, teacherCard: teacherCard,
    toast: toast, copyLink: copyLink
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
