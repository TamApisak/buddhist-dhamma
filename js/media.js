/* สื่อธรรมะ: กรองตามประเภท ค้นหา และเครื่องเล่น (ไม่เล่นอัตโนมัติ) */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc, I = S.ICONS;
  var all = S.visible(window.MEDIA);

  var grid = S.$('#media-grid');
  var tabs = S.$('#media-tabs');
  var input = S.$('#media-search');
  var clearBtn = S.$('#media-clear');
  var count = S.$('#media-count');
  var notice = S.$('#media-notice');
  var dialog = S.$('#player');
  if (!grid) return;

  if (notice) {
    var msgs = [];
    if (S.hasSamples(all)) msgs.push('รายการที่มีป้าย "ตัวอย่าง" เป็นรายการสาธิตที่ยังไม่มีไฟล์สื่อ และจะถูกแทนที่ด้วยสื่อจริงของชมรม');
    if (all.some(function (m) { return m.youtubeId; })) msgs.push('รายการจาก YouTube แสดงผ่านการฝังวิดีโอจากช่องต้นทาง ลิขสิทธิ์เป็นของผู้จัดทำแต่ละราย เว็บไซต์ไม่ได้ทำสำเนาไฟล์');
    if (msgs.length) notice.innerHTML = S.sampleNotice(msgs.join(' • '));
  }

  var state = { type: S.param('type') || 'all', q: (S.param('q') || '').trim() };
  if (['all', 'audio', 'video'].indexOf(state.type) < 0) state.type = 'all';
  if (input) input.value = state.q;

  function normalize(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function matches(m, q) {
    if (!q) return true;
    var hay = normalize([m.title, m.speaker, m.description, m.source, m.recorded].join(' '));
    return q.split(' ').every(function (w) { return hay.indexOf(w) >= 0; });
  }
  function byType(t) { return all.filter(function (m) { return t === 'all' || m.type === t; }); }

  function renderTabs() {
    if (!tabs) return;
    var defs = [['all', 'ทั้งหมด'], ['audio', 'เสียงธรรม'], ['video', 'วิดีโอ']];
    tabs.innerHTML = defs.map(function (d) {
      return '<button type="button" role="tab" class="tab" data-type="' + d[0] + '" aria-selected="' + (state.type === d[0]) + '">' +
        esc(d[1]) + '<span class="count">' + byType(d[0]).length + '</span></button>';
    }).join('');
  }

  function render() {
    var q = normalize(state.q);
    var list = byType(state.type).filter(function (m) { return matches(m, q); });
    if (input && input.parentElement) input.parentElement.classList.toggle('has-value', !!state.q);
    if (count) count.textContent = list.length ? 'พบ ' + list.length + ' รายการ' : '';

    if (!all.length) {
      grid.classList.remove('grid-3');
      grid.innerHTML = S.emptyState({ icon: I.headphones, title: 'ยังไม่มีสื่อธรรมะในขณะนี้', text: 'เมื่อมีไฟล์เสียงหรือวิดีโอพร้อมเผยแพร่ จะนำมาจัดไว้ที่นี่ โปรดติดตามข่าวสารทางเพจ Facebook', actions: S.fbButton() });
    } else if (!list.length) {
      grid.classList.remove('grid-3');
      grid.innerHTML = S.emptyState({
        icon: I.search,
        title: state.q ? 'ไม่พบสื่อที่ตรงกับคำค้น' : 'ยังไม่มีสื่อในหมวดนี้',
        text: state.q ? 'ลองใช้คำค้นอื่น หรือดูรายการทั้งหมด' : 'เมื่อมีสื่อในหมวดนี้พร้อมเผยแพร่ จะนำมาจัดไว้ที่นี่',
        actions: '<button type="button" class="btn btn-secondary btn-sm" id="media-reset">ดูรายการทั้งหมด</button>'
      });
    } else {
      grid.classList.add('grid-3');
      grid.innerHTML = list.map(S.mediaCard).join('');
    }
    renderTabs();
  }

  /* ---------- เครื่องเล่น ---------- */
  var lastTrigger = null;
  function openPlayer(id, trigger) {
    var m = all.filter(function (x) { return x.id === id; })[0];
    if (!m || !dialog) return;
    lastTrigger = trigger || null;
    var body;
    if (m.youtubeId) {
      body = '<div class="player-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(m.youtubeId) + '?rel=0&modestbranding=1&hl=th" title="' + esc(m.title) + '" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
        '<p class="player-src">เล่นจาก YouTube (ไม่เล่นอัตโนมัติ) • <a href="https://www.youtube.com/watch?v=' + encodeURIComponent(m.youtubeId) + '" target="_blank" rel="noopener noreferrer">เปิดบน YouTube</a></p>';
    } else if (m.src && m.type === 'audio') {
      body = '<audio controls preload="none" src="' + esc(m.src) + '">เบราว์เซอร์ของท่านไม่รองรับการเล่นเสียง <a href="' + esc(m.src) + '">ดาวน์โหลดไฟล์</a></audio>';
    } else if (m.src) {
      body = '<div class="player-frame"><video controls preload="metadata" src="' + esc(m.src) + '"' + (m.poster ? ' poster="' + esc(m.poster) + '"' : '') + '>เบราว์เซอร์ของท่านไม่รองรับการเล่นวิดีโอ</video></div>';
    } else {
      body = '<div class="notice notice-soft" role="note">' + I.info + '<p>ยังไม่มีไฟล์สื่อสำหรับรายการนี้ รายการนี้เป็นตัวอย่างเพื่อแสดงรูปแบบ เมื่อชมรมอัปโหลดไฟล์หรือระบุวิดีโอ YouTube แล้ว จะสามารถเล่นได้จากหน้านี้</p></div>';
    }
    S.$('#player-title').textContent = m.title;
    S.$('#player-meta').textContent = [m.speaker, m.recorded, m.duration ? 'ความยาว ' + m.duration : '', m.source].filter(Boolean).join(' • ');
    S.$('#player-body').innerHTML = body + (m.description ? '<p class="player-desc">' + esc(m.description) + '</p>' : '');
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    var closeBtn = S.$('#player-close'); if (closeBtn) closeBtn.focus();
  }
  function closePlayer() {
    if (!dialog) return;
    S.$('#player-body').innerHTML = ''; // หยุดการเล่นทันที
    if (dialog.open) dialog.close(); else dialog.removeAttribute('open');
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  }
  if (dialog) {
    S.$('#player-close').addEventListener('click', closePlayer);
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closePlayer(); });
    dialog.addEventListener('close', function () { S.$('#player-body').innerHTML = ''; });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); closePlayer(); });
  }

  grid.addEventListener('click', function (e) {
    var p = e.target.closest('[data-play]');
    if (p) { openPlayer(p.getAttribute('data-play'), p); return; }
    if (e.target.closest('#media-reset')) { state.q = ''; state.type = 'all'; if (input) input.value = ''; render(); }
  });
  if (tabs) tabs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-type]'); if (!b) return;
    state.type = b.getAttribute('data-type'); render();
  });
  var timer = null;
  if (input) input.addEventListener('input', function () {
    clearTimeout(timer); timer = setTimeout(function () { state.q = input.value.trim(); render(); }, 150);
  });
  if (clearBtn) clearBtn.addEventListener('click', function () { if (input) { input.value = ''; input.focus(); } state.q = ''; render(); });

  render();
})();
