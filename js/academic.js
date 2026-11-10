/* บทความวิชาการ: แสดงข้อมูลบรรณานุกรม สรุปสาระสำคัญ ลิงก์ไปยังวารสารต้นฉบับ และคัดลอกรายการอ้างอิง */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc, I = S.ICONS;
  var list = S.$('#academic-list');
  if (!list) return;
  var all = S.visible(window.ACADEMIC);
  var NEW_TAB = '<span class="visually-hidden"> (เปิดในแท็บใหม่)</span>';

  function beYear(iso) {
    var d = S.parseDate(iso);
    return d ? String(d.getFullYear() + 543) : '';
  }

  function authorNames(p) {
    var names = (p.authors || []).map(function (a) { return a.name; });
    if (names.length < 2) return names.join('');
    return names.slice(0, -1).join(', ') + ' และ ' + names[names.length - 1];
  }

  // รูปแบบ APA 7 ฉบับภาษาไทย: ผู้แต่ง. (ปี พ.ศ.). ชื่อบทความ. ชื่อวารสาร, ปีที่(ฉบับที่), หน้า. ลิงก์
  function citation(p) {
    var vol = p.volume ? String(p.volume) + (p.issue ? '(' + p.issue + ')' : '') : '';
    return authorNames(p) + '. (' + beYear(p.published) + '). ' + p.title + '. ' + p.journal +
      (vol ? ', ' + vol : '') + (p.pages ? ', ' + p.pages : '') + '. ' + (p.url || '');
  }

  function issueText(p) {
    var parts = [];
    if (p.volume) parts.push('ปีที่ ' + p.volume);
    if (p.issue) parts.push('ฉบับที่ ' + p.issue);
    var t = parts.join(' ');
    return p.issueMonths ? t + ' (' + p.issueMonths + ')' : t;
  }

  function extLink(href, cls, icon, label) {
    return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
      icon + '<span>' + esc(label) + '</span>' + NEW_TAB + '</a>';
  }

  function paperCard(p, i) {
    var facts = [
      ['วารสาร', esc(p.journal)],
      ['ฉบับ', esc(issueText(p))],
      p.pages ? ['หน้า', esc(p.pages)] : null,
      p.published ? ['เผยแพร่', esc(S.thaiDate(p.published))] : null,
      p.issn ? ['ISSN', esc(p.issn)] : null
    ].filter(Boolean);
    var affiliations = (p.authors || []).map(function (a) {
      return '<li><span class="paper-author">' + esc(a.name) + '</span>' +
        (a.affiliation ? '<span class="paper-affil">' + esc(a.affiliation) + '</span>' : '') + '</li>';
    }).join('');
    var actions = [];
    if (p.url) actions.push(extLink(p.url, 'btn btn-primary', I.external, 'อ่านบทความที่วารสาร'));
    if (p.pdf) actions.push(extLink(p.pdf, 'btn btn-secondary', I.book, 'เปิดไฟล์ PDF'));
    actions.push('<button type="button" class="btn btn-secondary" data-cite="' + i + '">' + I.link + '<span>คัดลอกรายการอ้างอิง</span></button>');

    return '<article class="paper" aria-labelledby="paper-' + i + '-title">' +
      '<div class="card-top"><span class="tag">' + esc(p.type || 'บทความวิชาการ') + '</span>' + S.sampleBadge(p) + '</div>' +
      '<h2 class="paper-title" id="paper-' + i + '-title">' + esc(p.title) + '</h2>' +
      (p.titleEn ? '<p class="paper-en" lang="en">' + esc(p.titleEn) + '</p>' : '') +
      '<p class="paper-authors">' + I.user + '<span>' + esc(authorNames(p)) + '</span></p>' +
      (affiliations ? '<details class="paper-more"><summary>สังกัดของผู้แต่ง</summary><ol class="paper-affils">' + affiliations + '</ol></details>' : '') +
      '<dl class="paper-facts">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' +
      (p.keywords && p.keywords.length ? '<div class="paper-keywords"><span class="paper-label">คำสำคัญ</span><ul>' +
        p.keywords.map(function (k) { return '<li class="tag">' + esc(k) + '</li>'; }).join('') + '</ul></div>' : '') +
      (p.summary ? '<div class="paper-summary"><h3>สาระสำคัญโดยสรุป</h3><p>' + esc(p.summary) + '</p>' +
        '<p class="paper-note">สรุปโดยชมรม อ่านบทคัดย่อและเนื้อหาฉบับเต็มได้ที่เว็บไซต์ของวารสาร</p></div>' : '') +
      '<div class="paper-actions">' + actions.join('') + '</div>' +
      '<details class="paper-more"><summary>รายการอ้างอิง (APA)</summary><p class="paper-cite">' + esc(citation(p)) + '</p></details>' +
      (p.rights ? '<p class="paper-rights">' + esc(p.rights) + ' เว็บไซต์ชมรมแสดงข้อมูลบรรณานุกรม สรุปย่อที่ชมรมเรียบเรียงเอง และลิงก์ไปยังต้นฉบับ</p>' : '') +
      '</article>';
  }

  // card: the paper's <article>, whose "รายการอ้างอิง" is opened and selected when copying fails
  function copyText(text, card) {
    function done() { S.toast('คัดลอกรายการอ้างอิงแล้ว'); }
    function fail() {
      var cite = card && card.querySelector('.paper-cite');
      var box = cite && cite.parentNode;
      if (box && box.tagName === 'DETAILS') box.open = true;
      if (cite && window.getSelection && document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(cite);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      S.toast('คัดลอกไม่สำเร็จ กรุณาคัดลอกจาก "รายการอ้างอิง" ที่เลือกไว้ให้');
    }
    function fallback() {
      var ta = document.createElement('textarea');
      var ok = false;
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) done(); else fail();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  if (!all.length) {
    list.innerHTML = S.emptyState({ icon: I.book, title: 'ยังไม่มีบทความวิชาการในขณะนี้', text: 'เมื่อมีบทความวิชาการที่เกี่ยวข้องกับชมรม จะนำมารวบรวมไว้ที่นี่', actions: S.fbButton() });
    return;
  }
  list.innerHTML = all.map(paperCard).join('');
  list.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-cite]') : null;
    if (!btn) return;
    var p = all[Number(btn.getAttribute('data-cite'))];
    if (p) copyText(citation(p), btn.closest('.paper'));
  });
})();
