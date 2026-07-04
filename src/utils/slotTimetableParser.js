// Parses VIT "Slot Timetable" grid PDFs (ANNEXURE-I style) into the
// { SLOT: [{ day, time }] } shape used by src/data/slotMapping*.js.
// Pure text-token logic so it can be unit-tested outside the browser.

const TIME_RE = /^(\d{1,2})[.:](\d{2})\s*-\s*(\d{1,2})[.:](\d{2})$/;
const DAY_RE = /^(MON|TUE|WED|THU|FRI|SAT|SUN)$/;
// A grid cell: one or more slot names separated by '/', e.g. "A1", "TC1/G1", "TAA1/ECS", "L31"
const CELL_RE = /^[A-Z]{1,4}\d{0,2}(\/[A-Z]{1,4}\d{0,2})*$/;

// The timetable uses a 12-hour clock; hours 1-7 are afternoon/evening.
const to24 = (h, m) => {
  let hh = Number(h);
  if (hh < 8) hh += 12;
  return `${String(hh).padStart(2, '0')}:${m}`;
};

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export function looksLikeSlotTimetable(text) {
  return /slot\s*time\s*-?\s*table/i.test(text) || /slot\s*timetable/i.test(text);
}

export function buildSlotMapping(tokens) {
  // 1. Collect the header time rows (theory row, then lab row). The rows are
  //    split where the start time jumps backwards, since each row restarts at ~8:00.
  const timeRows = [];
  let row = null;
  let prevStart = -1;
  for (const t of tokens) {
    const m = t.match(TIME_RE);
    if (!m) {
      if (DAY_RE.test(t) && timeRows.length >= 2) break; // grid body starts
      row = null;
      prevStart = -1;
      continue;
    }
    const time = `${to24(m[1], m[2])}-${to24(m[3], m[4])}`;
    const start = toMinutes(time.split('-')[0]);
    if (!row || start <= prevStart) {
      row = [];
      timeRows.push(row);
    }
    row.push(time);
    prevStart = start;
  }
  const [theoryTimes, labTimes] = timeRows;
  if (!theoryTimes || !theoryTimes.length || !labTimes || !labTimes.length) return null;

  // 2. Walk the day sections: DAY, 'Theory', cells..., 'Lab', cells...
  //    Cells are read left-to-right and paired with the matching header column.
  const mapping = {};
  let day = null;
  let mode = null;
  let col = 0;
  for (const t of tokens) {
    if (DAY_RE.test(t)) { day = t; mode = null; continue; }
    if (/credit/i.test(t)) { day = null; mode = null; continue; } // slot-combo legend below the grid
    if (!day) continue;
    if (t === 'Theory') { mode = 'theory'; col = 0; continue; }
    if (t === 'Lab') { mode = 'lab'; col = 0; continue; }
    if (!mode) continue;
    const times = mode === 'theory' ? theoryTimes : labTimes;
    if (col >= times.length) continue;
    if (t === '-' || CELL_RE.test(t)) {
      if (t !== '-') {
        for (const slot of t.split('/')) {
          (mapping[slot] ||= []).push({ day, time: times[col] });
        }
      }
      col++;
    }
  }

  if (Object.keys(mapping).length < 20) return null; // not a real slot grid

  // 3. Lunch is the widest gap between consecutive theory columns.
  let lunch = null;
  for (let i = 0; i < theoryTimes.length - 1; i++) {
    const end = theoryTimes[i].split('-')[1];
    const start = theoryTimes[i + 1].split('-')[0];
    const gap = toMinutes(start) - toMinutes(end);
    if (gap > 30 && (!lunch || gap > lunch.gap)) lunch = { gap, time: `${end}-${start}` };
  }
  if (lunch) mapping.Lunch = [{ time: lunch.time }];

  return mapping;
}
