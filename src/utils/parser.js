import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url'
import { buildSlotMapping, looksLikeSlotTimetable } from './slotTimetableParser'

GlobalWorkerOptions.workerSrc = pdfWorker

async function extractTokens(file) {
  const typedArray = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

  const tokens = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    for (const item of content.items) {
      const s = item.str.trim();
      if (s) tokens.push(s);
    }
  }
  return tokens;
}

function parseCourses(text) {
  const courseMap = new Map();
  const courseRegex = /([A-Z]{3}\d{4})\s+(.+?)\s+(ETH|TH|ELA|LO|PJT)\s+([A-Z0-9+-]+|NILL)/g;

  let match;
  while ((match = courseRegex.exec(text)) !== null) {
    const [_, code, name, type, slotStr] = match;
    const slotsArr = slotStr.split(/[+-]/).map(s => s.trim()).filter(Boolean);
    const theory = slotsArr.filter(s => !/^L\d+/i.test(s));
    const lab = slotsArr.filter(s => /^L\d+/i.test(s));
    const key = `${code}__${name.trim()}`;
    if (!courseMap.has(key)) {
      courseMap.set(key, { code, name: name.trim(), type, slotCombos: [] });
    }
    const comboKey = `${theory.slice().sort().join(',')}|${lab.slice().sort().join(',')}`;
    const existingCombos = courseMap.get(key).slotCombos;
    const isDuplicate = existingCombos.some(combo => {
      const existingKey = `${(combo.theory || []).slice().sort().join(',')}|${(combo.lab || []).slice().sort().join(',')}`;
      return existingKey === comboKey;
    });
    if (!isDuplicate) {
      courseMap.get(key).slotCombos.push({ theory, lab });
    }
  }

  return Array.from(courseMap.values());
}

// Auto-detects what was uploaded: a slot timetable grid (ANNEXURE-I style)
// or a course list. Returns { type: 'slotTimetable', mapping } or
// { type: 'courseList', courses }.
export async function parseUpload(file) {
  const tokens = await extractTokens(file);
  const text = tokens.join(' ');

  if (looksLikeSlotTimetable(text)) {
    const mapping = buildSlotMapping(tokens);
    if (!mapping) throw new Error('Could not read the slot timetable grid from this PDF');
    return { type: 'slotTimetable', mapping };
  }

  return { type: 'courseList', courses: parseCourses(text) };
}

export async function parseCourseData(file) {
  const tokens = await extractTokens(file);
  return parseCourses(tokens.join(' '));
}
