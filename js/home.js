/* หน้าแรก: พุทธพจน์แนะนำ บทความล่าสุด และกิจกรรม */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var esc = S.esc;

  var tEl = S.$('#featured-teachings');
  if (tEl) {
    var teachings = (window.TEACHINGS || []).slice(0, 3);
    tEl.innerHTML = teachings.map(function (t) {
      return '<blockquote class="quote-card">' +
        '<p class="quote-pali" lang="pi">' + esc(t.pali) + '</p>' +
        '<p class="quote-thai">' + esc(t.thai) + '</p>' +
        '<footer class="quote-src">ที่มา: ' + esc(t.source) + '</footer>' +
        '</blockquote>';
    }).join('');
  }

  var aEl = S.$('#recent-articles');
  if (aEl) {
    var arts = S.visible(window.ARTICLES).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); }).slice(0, 3);
    aEl.innerHTML = arts.length
      ? arts.map(S.articleCard).join('')
      : S.emptyState({ title: 'ยังไม่มีบทความ', text: 'ทีมงานกำลังจัดเตรียมเนื้อหา โปรดติดตามธรรมะประจำวันได้ที่เพจ Facebook ของชมรม', actions: S.fbButton() });
    if (!arts.length) aEl.classList.remove('grid-3');
  }

  var acEl = S.$('#home-activities');
  if (acEl) {
    var acts = S.visible(window.ACTIVITIES);
    var upcoming = acts.filter(function (a) { return S.activityStatus(a) === 'upcoming'; }).sort(function (a, b) { return a.date.localeCompare(b.date); });
    var past = acts.filter(function (a) { return S.activityStatus(a) === 'past'; }).sort(function (a, b) { return b.date.localeCompare(a.date); });
    var pick = upcoming.concat(past).slice(0, 3);
    if (pick.length) {
      acEl.innerHTML = pick.map(function (a) { return S.activityCard(a); }).join('');
    } else {
      acEl.classList.remove('grid-3');
      acEl.innerHTML = S.emptyState({
        title: 'ยังไม่มีประกาศกิจกรรม',
        text: 'ประกาศกิจกรรมและงานจิตอาสาล่าสุดจะเผยแพร่ทางเพจ Facebook ของชมรมก่อนเสมอ',
        actions: S.fbButton()
      });
    }
  }
})();
