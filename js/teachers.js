/* ครูบาอาจารย์: รายชื่อและประวัติฉบับย่อ */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var all = window.TEACHERS || [];

  var featured = S.$('#featured-teachers');
  var grid = S.$('#teacher-grid');
  var withBio = all.filter(function (t) { return t.status === 'compiled' && t.bio; });
  var pending = all.filter(function (t) { return !(t.status === 'compiled' && t.bio); });

  if (featured) {
    featured.innerHTML = withBio.length
      ? withBio.map(S.teacherCard).join('')
      : S.emptyState({ title: 'ยังไม่มีประวัติครูบาอาจารย์', text: 'ชมรมกำลังรวบรวมประวัติพร้อมแหล่งอ้างอิง' });
    if (!withBio.length) featured.classList.remove('grid-2');
  }
  if (grid) {
    grid.innerHTML = pending.length
      ? pending.map(S.teacherCard).join('')
      : S.emptyState({ title: 'ยังไม่มีรายชื่อเพิ่มเติม', text: 'รายชื่อครูบาอาจารย์จะเพิ่มเติมเมื่อได้รับข้อมูลที่ตรวจสอบแล้ว' });
    if (!pending.length) grid.classList.remove('grid-3');
  }
})();
