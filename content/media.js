/* =====================================================================
   คลังสื่อธรรมะ (เสียงและวิดีโอ)
   -------------------------------------------------------------------
   รูปแบบรายการ:
   {
     id: "รหัสไม่ซ้ำ",
     type: "audio" | "video",          // ลักษณะเนื้อหา (เสียงธรรม หรือ วิดีโอ)
     title: "ชื่อรายการ",
     speaker: "ผู้แสดงธรรม / ผู้อ่าน (ถ้าทราบ)",
     duration: "45:12" หรือ null,
     recorded: "แสดงธรรมเมื่อ 12 เมษายน 2530" หรือ null,   // ข้อความอิสระ
     source: "แหล่งที่มา เช่น ชื่อช่อง YouTube หรือ ไฟล์ของชมรม",
     description: "คำอธิบายสั้น ๆ",
     youtubeId: "รหัสวิดีโอ YouTube 11 ตัวอักษร" หรือ null,
     src: "assets/media/xxx.mp3" (ไฟล์ของชมรมเอง) หรือ null,
     poster: "assets/images/xxx.jpg" (ภาพปก, ไม่บังคับ) หรือ null,
     sample: true (รายการตัวอย่าง) หรือ false
   }
   หมายเหตุ:
   - ระบบจะไม่เล่นสื่อโดยอัตโนมัติ ผู้ชมต้องกดเล่นเองเสมอ
   - รายการจาก YouTube แสดงผ่านการฝังวิดีโอ (youtube-nocookie.com) ลิขสิทธิ์เป็นของผู้จัดทำแต่ละราย
   - รายการด้านล่างตรวจสอบชื่อและช่องผ่าน YouTube oEmbed เมื่อ 5 พ.ย. 2569 (ยังไม่ได้รับฟังเนื้อหาทั้งหมด)
   ===================================================================== */
window.MEDIA = [
  {
    id: "muttodaya-reading",
    type: "audio",
    title: "มุตโตทัย ฉบับสมบูรณ์ — บันทึกธรรมหลวงปู่มั่น (เสียงอ่าน)",
    speaker: "เสียงอ่านโดย โจโฉ — บันทึกธรรมเทศนาของหลวงปู่มั่น ภูริทตฺโต",
    duration: "2:32:46",
    recorded: null,
    source: "ช่อง YouTube: โจโฉ เสียงธรรม Official",
    description: "เสียงอ่านหนังสือมุตโตทัย ซึ่งเป็นบันทึกธรรมเทศนาของหลวงปู่มั่น ภูริทตฺโต โดยพระอาจารย์วิริยังค์ สิรินฺธโร และพระอาจารย์ทองคำ จารุวณฺโณ",
    youtubeId: "v2cf3P-Pibk",
    src: null,
    poster: null,
    sample: false
  },
  {
    id: "lpm-biography-wiriyang-reading",
    type: "audio",
    title: "ประวัติหลวงปู่มั่น ฉบับสมบูรณ์ ภาค 1 (เสียงอ่าน)",
    speaker: "เสียงอ่านโดย โจโฉ — เรียบเรียงโดย หลวงพ่อวิริยังค์ สิรินฺธโร",
    duration: "5:12:19",
    recorded: null,
    source: "ช่อง YouTube: โจโฉ เสียงธรรม Official",
    description: "เสียงอ่านหนังสือประวัติหลวงปู่มั่น ภูริทตฺโต ภาค 1 เรียบเรียงโดยพระอาจารย์วิริยังค์ สิรินฺธโร ศิษย์ผู้เคยอุปัฏฐากหลวงปู่มั่น",
    youtubeId: "rq8ke2IUzcA",
    src: null,
    poster: null,
    sample: false
  },
  {
    id: "luangta-bua-2530-04-12",
    type: "audio",
    title: "เทศน์อบรมพระ: ความลึกลับซับซ้อนของจิตวิญญาณ",
    speaker: "หลวงตามหาบัว ญาณสมฺปนฺโน",
    duration: "1:27:29",
    recorded: "แสดงธรรมเมื่อ 12 เมษายน 2530",
    source: "ช่อง YouTube: Wat Pa Baan Taad วัดป่าบ้านตาด",
    description: "พระธรรมเทศนาอบรมพระภิกษุสามเณร โดยหลวงตามหาบัว ญาณสมฺปนฺโน วัดป่าบ้านตาด จังหวัดอุดรธานี",
    youtubeId: "AH18DnOtvYY",
    src: null,
    poster: null,
    sample: false
  },
  {
    id: "luangta-bua-2545-08-10",
    type: "audio",
    title: "เทศน์: ภาวนามีอานิสงส์มากกว่าบุญทั้งหลาย",
    speaker: "หลวงตามหาบัว ญาณสมฺปนฺโน",
    duration: "1:29:14",
    recorded: "แสดงธรรมเมื่อ 10 สิงหาคม 2545",
    source: "ช่อง YouTube: หลวงตามหาบัว ญาณสัมปันโน",
    description: "พระธรรมเทศนาของหลวงตามหาบัว ญาณสมฺปนฺโน ว่าด้วยอานิสงส์ของการภาวนา",
    youtubeId: "94nUtuxuE_w",
    src: null,
    poster: null,
    sample: false
  },
  {
    id: "luangta-bua-2548-06-07",
    type: "audio",
    title: "เทศน์: ให้ระวังกิเลสมากกว่าระวังธรรม",
    speaker: "หลวงตามหาบัว ญาณสมฺปนฺโน",
    duration: "46:14",
    recorded: "แสดงธรรมเมื่อ 7 มิถุนายน 2548",
    source: "ช่อง YouTube: Wat Pa Baan Taad วัดป่าบ้านตาด",
    description: "พระธรรมเทศนาของหลวงตามหาบัว ญาณสมฺปนฺโน วัดป่าบ้านตาด จังหวัดอุดรธานี",
    youtubeId: "jPknu7KWREc",
    src: null,
    poster: null,
    sample: false
  },
  {
    id: "luangpu-thet-sati-samadhi-panya",
    type: "audio",
    title: "สติ สมาธิ ปัญญา",
    speaker: "หลวงปู่เทสก์ เทสรํสี",
    duration: "31:56",
    recorded: null,
    source: "ช่อง YouTube: พิพิธภัณฑ์จรรโลงพุทธศาสนาและธรรมะพีเดีย.คอม",
    description: "พระธรรมเทศนาของหลวงปู่เทสก์ เทสรํสี วัดหินหมากเป้ง จังหวัดหนองคาย ว่าด้วยสติ สมาธิ และปัญญา",
    youtubeId: "ZryO5qNTq3k",
    src: null,
    poster: null,
    sample: false
  },

  /* ---- รายการตัวอย่าง (แสดงรูปแบบเท่านั้น) ---- */
  {
    id: "sample-audio-1",
    type: "audio",
    title: "ตัวอย่างรายการเสียง: บันทึกการฟังธรรมของชมรม",
    speaker: "รอระบุผู้แสดงธรรม",
    duration: null,
    recorded: null,
    source: "ไฟล์ของชมรม (ยังไม่ได้อัปโหลด)",
    description: "รายการตัวอย่างเพื่อแสดงรูปแบบการ์ดสื่อเสียง เมื่อมีไฟล์เสียงจริง ให้ระบุที่อยู่ไฟล์ในช่อง src ของไฟล์ content/media.js แล้วเปลี่ยน sample เป็น false",
    youtubeId: null,
    src: null,
    poster: null,
    sample: true
  },
  {
    id: "sample-video-1",
    type: "video",
    title: "ตัวอย่างรายการวิดีโอ: บรรยายธรรมในกิจกรรมของชมรม",
    speaker: "รอระบุผู้แสดงธรรม",
    duration: null,
    recorded: null,
    source: "ช่อง YouTube ของชมรม (ยังไม่ระบุ)",
    description: "รายการตัวอย่างเพื่อแสดงรูปแบบการ์ดวิดีโอ เมื่อมีวิดีโอจริงบน YouTube ให้ใส่รหัสวิดีโอในช่อง youtubeId แล้วเปลี่ยน sample เป็น false",
    youtubeId: null,
    src: null,
    poster: null,
    sample: true
  }
];
