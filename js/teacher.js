/* หน้าประวัติครูบาอาจารย์รายองค์ */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc, I = S.ICONS;
  var root = S.$('#teacher-root'); if (!root) return;
  var id = S.param('id');
  var t = (window.TEACHERS || []).filter(function (x) { return x.id === id; })[0];

  if (!t || !(t.status === 'compiled' && t.bio)) {
    S.setTitle('ไม่พบข้อมูลครูบาอาจารย์');
    root.innerHTML = '<div class="container section">' + S.emptyState({
      title: 'ยังไม่มีประวัติของครูบาอาจารย์ท่านนี้',
      text: 'ชมรมจะเพิ่มประวัติเมื่อได้ตรวจสอบข้อมูลและแหล่งอ้างอิงเรียบร้อยแล้ว',
      actions: '<a class="btn btn-primary btn-sm" href="teachers.html">กลับไปหน้าครูบาอาจารย์</a>'
    }) + '</div>';
    return;
  }

  S.setTitle(t.name, t.summary);

  function fact(k, v) { return v ? '<li><span class="k">' + esc(k) + '</span><span class="v">' + esc(v) + '</span></li>' : ''; }

  var facts =
    fact('ชื่อเต็ม', t.fullName) +
    fact('เกิด', t.born) +
    fact('ภูมิลำเนา', t.bornPlace) +
    fact('อุปสมบท', t.ordained) +
    fact('มรณภาพ', t.died) +
    fact('อายุ', t.age) +
    fact('วัด', t.temple);

  var sources = (t.sources || []).map(function (s) {
    return '<li>' + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + '</a>' : esc(s.title)) + '</li>';
  }).join('');

  root.innerHTML =
    '<div class="page-head"><div class="container">' +
    '<nav class="breadcrumb" aria-label="เส้นทางหน้า"><ol>' +
    '<li><a href="index.html">หน้าแรก</a></li><li><a href="teachers.html">ครูบาอาจารย์</a></li><li aria-current="page">' + esc(t.name) + '</li>' +
    '</ol></nav>' +
    '<p class="eyebrow">' + esc(t.role || 'ครูบาอาจารย์') + '</p>' +
    '<h1>' + esc(t.name) + '</h1>' +
    (t.summary ? '<p class="lead">' + esc(t.summary) + '</p>' : '') +
    '</div></div>' +

    '<div class="container section">' +
    '<div class="profile-head">' +
    '<div>' +
    '<div class="profile-portrait">' + S.mediaImage(t.image, t.name, 'รูปครูบาอาจารย์ (รอรูปที่ได้รับอนุญาต)', I.lotus) + '</div>' +
    '<div class="notice notice-soft mt-3" role="note">' + I.info + '<p>ประวัติฉบับย่อนี้เรียบเรียงจากแหล่งอ้างอิงสาธารณะที่ระบุไว้ท้ายหน้า และรอการตรวจทานจากชมรมก่อนเผยแพร่อย่างเป็นทางการ</p></div>' +
    '</div>' +
    '<div>' +
    '<section aria-labelledby="facts-title"><h2 id="facts-title">ข้อมูลโดยสังเขป</h2><ul class="facts">' + facts + '</ul></section>' +
    '<section class="prose mt-4" aria-labelledby="bio-title"><h2 id="bio-title">ชีวประวัติโดยย่อ</h2>' + (t.bio || '') + '</section>' +
    (t.teaching ? '<section class="prose mt-4" aria-labelledby="teaching-title"><h2 id="teaching-title">แนวทางคำสอน</h2>' + t.teaching + '</section>' : '') +
    (t.works && t.works.length
      ? '<section class="prose mt-4" aria-labelledby="works-title"><h2 id="works-title">คำสอนที่บันทึกไว้เป็นลายลักษณ์อักษร</h2><ul>' + t.works.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></section>'
      : '') +
    (t.disciples && t.disciples.length
      ? '<section class="mt-4" aria-labelledby="disciples-title"><h2 id="disciples-title">' + (t.id === 'luangpu-sao' ? 'ศิษย์สำคัญ' : 'ศิษย์สำคัญบางส่วน') + '</h2><div class="flex">' +
        t.disciples.map(function (d) { return '<span class="tag">' + esc(d) + '</span>'; }).join('') + '</div></section>'
      : '') +
    (sources ? '<section class="sources" aria-labelledby="src-title"><h2 id="src-title">แหล่งอ้างอิง</h2><ol>' + sources + '</ol></section>' : '') +
    '<div class="article-foot"><a class="btn btn-secondary btn-sm" href="teachers.html">' + I.arrowRight + '<span>กลับไปหน้าครูบาอาจารย์</span></a></div>' +
    '</div></div></div>';
})();
