/* กิจกรรมและจิตอาสา: แยกกิจกรรมที่กำลังจะมาถึงกับที่ผ่านมาแล้ว */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc, I = S.ICONS;
  var all = S.visible(window.ACTIVITIES);
  var grid = S.$('#activities-grid');
  var tabs = S.$('#activity-tabs');
  var notice = S.$('#activities-notice');
  var intro = S.$('#activities-intro');
  if (!grid) return;

  if (notice && S.hasSamples(all)) {
    notice.innerHTML = S.sampleNotice('รายการที่มีป้าย "ตัวอย่าง" เป็นรายการสาธิตเพื่อแสดงรูปแบบประกาศและรายงานกิจกรรม ไม่ใช่กำหนดการจริง ประกาศจริงของชมรมจะเผยแพร่ทางเพจ Facebook ก่อนเสมอ');
  }

  var upcoming = all.filter(function (a) { return S.activityStatus(a) === 'upcoming'; }).sort(function (a, b) { return a.date.localeCompare(b.date); });
  var past = all.filter(function (a) { return S.activityStatus(a) === 'past'; }).sort(function (a, b) { return b.date.localeCompare(a.date); });

  var state = { tab: S.param('tab') === 'past' ? 'past' : 'upcoming' };

  function renderTabs() {
    if (!tabs) return;
    tabs.innerHTML =
      '<button type="button" role="tab" class="tab" data-tab="upcoming" aria-selected="' + (state.tab === 'upcoming') + '">กิจกรรมที่กำลังจะมาถึง<span class="count">' + upcoming.length + '</span></button>' +
      '<button type="button" role="tab" class="tab" data-tab="past" aria-selected="' + (state.tab === 'past') + '">กิจกรรมที่ผ่านมา<span class="count">' + past.length + '</span></button>';
  }

  function render() {
    var list = state.tab === 'past' ? past : upcoming;
    if (intro) intro.textContent = state.tab === 'past'
      ? 'สรุปและภาพบรรยากาศกิจกรรมที่ชมรมได้จัดไปแล้ว เรียงจากล่าสุด'
      : 'ประกาศกิจกรรมและงานจิตอาสาที่กำลังจะมาถึง เรียงตามวันที่จัด';
    if (!list.length) {
      grid.classList.remove('grid-2');
      grid.innerHTML = state.tab === 'past'
        ? S.emptyState({ icon: I.calendar, title: 'ยังไม่มีรายงานกิจกรรมที่ผ่านมา', text: 'เมื่อชมรมจัดกิจกรรมและสรุปผลแล้ว จะนำรายงานพร้อมภาพบรรยากาศมาไว้ที่นี่' })
        : S.emptyState({ icon: I.calendar, title: 'ยังไม่มีประกาศกิจกรรมที่กำลังจะมาถึง', text: 'ประกาศกิจกรรมและงานจิตอาสาล่าสุดจะเผยแพร่ทางเพจ Facebook ของชมรมก่อนเสมอ โปรดติดตามที่เพจ', actions: S.fbButton() });
    } else {
      grid.classList.add('grid-2');
      grid.innerHTML = list.map(function (a) { return S.activityCard(a, { full: true }); }).join('');
    }
    renderTabs();
    try { history.replaceState(null, '', window.location.pathname + (state.tab === 'past' ? '?tab=past' : '')); } catch (e) { /* ignore */ }
  }

  if (tabs) tabs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    state.tab = b.getAttribute('data-tab'); render();
  });
  render();
})();
