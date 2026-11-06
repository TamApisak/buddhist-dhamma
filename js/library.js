/* คลังธรรมะ: ค้นหา กรองตามหัวข้อ และเรียงลำดับ */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc;
  var all = S.visible(window.ARTICLES);
  var topics = (S.SITE.topics || []);

  var input = S.$('#search-input');
  var clearBtn = S.$('#search-clear');
  var chips = S.$('#topic-chips');
  var count = S.$('#results-count');
  var sortSel = S.$('#sort-select');
  var grid = S.$('#article-grid');
  var notice = S.$('#library-notice');
  if (!grid) return;

  if (notice && S.hasSamples(all)) {
    notice.innerHTML = S.sampleNotice('บทความที่มีป้าย "ตัวอย่าง" เป็นเนื้อหาสาธิตที่เรียบเรียงจากหลักธรรมทั่วไปพร้อมอ้างอิง เพื่อแสดงรูปแบบของคลังธรรมะ และจะถูกแทนที่ด้วยบทความจริงของชมรมเมื่อพร้อมเผยแพร่');
  }

  var state = {
    q: (S.param('q') || '').trim(),
    topic: S.param('topic') || '',
    sort: S.param('sort') || 'newest'
  };
  if (state.topic && topics.indexOf(state.topic) < 0) state.topic = '';
  if (input) input.value = state.q;
  if (sortSel) sortSel.value = state.sort;

  function countFor(topic) {
    return all.filter(function (a) { return !topic || a.topic === topic; }).length;
  }

  function renderChips() {
    if (!chips) return;
    var items = [''].concat(topics);
    chips.innerHTML = items.map(function (t) {
      var pressed = (state.topic || '') === t;
      return '<button type="button" class="chip" data-topic="' + esc(t) + '" aria-pressed="' + pressed + '">' +
        esc(t || 'ทั้งหมด') + ' <span class="muted">(' + countFor(t) + ')</span></button>';
    }).join('');
  }

  function normalize(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

  function matches(a, q) {
    if (!q) return true;
    var hay = normalize([a.title, a.excerpt, a.topic, (a.tags || []).join(' '), a.author, a.teacher, a.source, S.stripHtml(a.body)].join(' '));
    return q.split(' ').every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function sorted(list) {
    var l = list.slice();
    if (state.sort === 'oldest') l.sort(function (a, b) { return (a.date || '').localeCompare(b.date || ''); });
    else if (state.sort === 'title') l.sort(function (a, b) { return a.title.localeCompare(b.title, 'th'); });
    else l.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    return l;
  }

  function syncUrl() {
    try {
      var p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (state.topic) p.set('topic', state.topic);
      if (state.sort !== 'newest') p.set('sort', state.sort);
      var qs = p.toString();
      history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    } catch (e) { /* file:// ในบางเบราว์เซอร์ */ }
  }

  function render() {
    var q = normalize(state.q);
    var list = sorted(all.filter(function (a) { return (!state.topic || a.topic === state.topic) && matches(a, q); }));
    if (input && input.parentElement) input.parentElement.classList.toggle('has-value', !!state.q);

    if (count) {
      if (!all.length) count.textContent = '';
      else if (!list.length) count.textContent = 'ไม่พบบทความที่ตรงกับเงื่อนไข';
      else count.textContent = 'พบ ' + list.length + ' บทความ' + (state.topic ? ' ในหัวข้อ "' + state.topic + '"' : '') + (state.q ? ' สำหรับคำค้น "' + state.q + '"' : '');
    }

    if (!all.length) {
      grid.classList.remove('grid-3');
      grid.innerHTML = S.emptyState({ title: 'ยังไม่มีบทความในคลังธรรมะ', text: 'ทีมงานกำลังจัดเตรียมเนื้อหา โปรดติดตามธรรมะประจำวันได้ที่เพจ Facebook ของชมรม', actions: S.fbButton() });
    } else if (!list.length) {
      grid.classList.remove('grid-3');
      grid.innerHTML = S.emptyState({
        icon: S.ICONS.search,
        title: 'ไม่พบบทความที่ตรงกับคำค้น',
        text: 'ลองใช้คำค้นอื่นที่สั้นลง หรือเลือกหัวข้อ "ทั้งหมด" เพื่อดูบทความทั้งหมด',
        actions: '<button type="button" class="btn btn-secondary btn-sm" id="reset-filters">ล้างตัวกรอง</button>'
      });
    } else {
      grid.classList.add('grid-3');
      grid.innerHTML = list.map(S.articleCard).join('');
    }
    renderChips();
    syncUrl();
  }

  var timer = null;
  if (input) {
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = input.value.trim(); render(); }, 150);
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; state.q = ''; render(); } });
  }
  if (clearBtn) clearBtn.addEventListener('click', function () { if (input) { input.value = ''; input.focus(); } state.q = ''; render(); });
  if (chips) chips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-topic]'); if (!b) return;
    state.topic = b.getAttribute('data-topic') || '';
    render();
  });
  if (sortSel) sortSel.addEventListener('change', function () { state.sort = sortSel.value; render(); });
  grid.addEventListener('click', function (e) {
    if (e.target.closest('#reset-filters')) {
      state.q = ''; state.topic = ''; if (input) input.value = '';
      render(); if (input) input.focus();
    }
  });

  render();
})();
