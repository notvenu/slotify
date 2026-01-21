import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url'

GlobalWorkerOptions.workerSrc = pdfWorker

export async function parseCourseData(file) {
  const typedArray = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

  let text = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(' ') + '\n';
  }

  const lines = text.split(/\n/).filter(Boolean);

    const courseMap = new Map();

    const courseRegex = /([A-Z]{3}\d{4})\s+(.+?)\s+(ETH|TH|ELA|LO|PJT)\s+([A-Z0-9\+\-]+|NILL)/g;

  for (let line of lines) {
    let match;
    while ((match = courseRegex.exec(line)) !== null) {
      const [_, code, name, type, slotStr] = match;
      const slotsArr = slotStr.split(/[\+\-]/).map(s => s.trim()).filter(Boolean);
      const theory = slotsArr.filter(s => !/^L\d+/i.test(s));
      const lab = slotsArr.filter(s => /^L\d+/i.test(s));
      const key = `${code}__${name.trim()}`;
      if (!courseMap.has(key)) {
        courseMap.set(key, {
          code,
          name: name.trim(),
          type,
          slotCombos: []
        });
      }
      const comboKey = `${theory.sort().join(',')}|${lab.sort().join(',')}`;
      const existingCombos = courseMap.get(key).slotCombos;
      const isDuplicate = existingCombos.some(combo => {
        const existingKey = `${(combo.theory || []).slice().sort().join(',')}|${(combo.lab || []).slice().sort().join(',')}`;
        return existingKey === comboKey;
      });
      if (!isDuplicate) {
        courseMap.get(key).slotCombos.push({ theory, lab });
      }
    }
  }

  const parsedCourses = Array.from(courseMap.values());

  if (parsedCourses.length === 0) {
    return [
      {
        code: 'FALLBACK101',
        name: 'Fallback Subject',
        type: 'ETH',
        slotCombos: [{ theory: ['A1', 'TA1'], lab: [] }]
      }
    ];
  }

  return parsedCourses;
}


