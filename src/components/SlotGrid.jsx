import React, { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getSlotMappingForSemester } from '../utils/slotMappingUtils';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function SlotGrid({
  selectedCourses,
  theme = 'light',
  showToast,
  currentSemester = 'win'
}) {
  const timetableRef = useRef(null);

  const bgTheme = getThemeColor(theme, colorConfig.background);
  const textTheme = getThemeColor(theme, colorConfig.text);

  const headingTextClass = textTheme.primary || '';
  const downloadBtnClass =
    theme === 'dark'
      ? colorConfig.button.primary.dark
      : colorConfig.button.primary.light;

  const slotMapping = getSlotMappingForSemester(currentSemester);

  // ---------------- BUILD TIMETABLE MAP ----------------
  const timetable = {};
  for (let course of selectedCourses) {
    for (let slot of [...(course.theory || []), ...(course.lab || [])]) {
      timetable[slot] = {
        code: course.code,
        slot
      };
    }
  }

  // ---------------- TIME HELPERS ----------------
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // ---------------- GROUP TIMES ----------------
  const groupOverlappingTimes = (theoryTimes, labTimes) => {
    const groups = [];

    for (const theoryTime of theoryTimes) {
      const [s, e] = theoryTime.split('-');
      groups.push({
        times: [{
          original: theoryTime,
          startMin: timeToMinutes(s),
          endMin: timeToMinutes(e),
          isTheory: true,
          isLab: false
        }],
        theoryTimes: [theoryTime],
        labTimes: []
      });
    }

    for (const labTime of labTimes) {
      const [labStart, labEnd] = labTime.split('-').map(timeToMinutes);
      let assigned = false;

      for (const group of groups) {
        const theory = group.theoryTimes[0];
        if (!theory) continue;

        const [ts, te] = theory.split('-').map(timeToMinutes);
        if (labEnd > ts && labEnd <= te + 10) {
          const [s, e] = labTime.split('-');
          group.times.push({
            original: labTime,
            startMin: timeToMinutes(s),
            endMin: timeToMinutes(e),
            isTheory: false,
            isLab: true
          });
          group.labTimes.push(labTime);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        const [s, e] = labTime.split('-');
        groups.push({
          times: [{
            original: labTime,
            startMin: timeToMinutes(s),
            endMin: timeToMinutes(e),
            isTheory: false,
            isLab: true
          }],
          theoryTimes: [],
          labTimes: [labTime]
        });
      }
    }

    return groups.sort(
      (a, b) =>
        Math.min(...a.times.map(t => t.startMin)) -
        Math.min(...b.times.map(t => t.startMin))
    );
  };

  const extractTimeAndDay = () => {
    const theoryTimes = new Set();
    const labTimes = new Set();
    const days = new Set();

    Object.entries(slotMapping).forEach(([slot, schedules]) => {
      if (slot === 'Lunch') return;
      const isLab = /^L\d+/i.test(slot);

      schedules.forEach(({ day, time }) => {
        if (day) days.add(day);
        if (time) {
          isLab ? labTimes.add(time) : theoryTimes.add(time);
        }
      });
    });

    const order = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return {
      days: [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b)),
      timeGroups: groupOverlappingTimes([...theoryTimes], [...labTimes])
    };
  };

  const { days, timeGroups } = extractTimeAndDay();

  const allTimeGroups = (() => {
    const groups = [...timeGroups];
    const lunchTimes = slotMapping.Lunch?.map(l => l.time) || [];

    if (lunchTimes.length) {
      groups.push({
        isLunch: true,
        lunchCount: lunchTimes.length,
        times: lunchTimes.map(t => ({ original: t })),
        theoryTimes: [],
        labTimes: []
      });
    }

    return groups.sort(
      (a, b) =>
        timeToMinutes(a.times[0].original.split('-')[0]) -
        timeToMinutes(b.times[0].original.split('-')[0])
    );
  })();

  const getSlotsForDayAndGroup = (day, group, isLab) => {
    if (group.isLunch) return [];

    return Object.entries(slotMapping)
      .filter(([slot, schedules]) => {
        if (slot === 'Lunch') return false;
        if (/^L\d+/i.test(slot) !== isLab) return false;

        return schedules.some(
          s => s.day === day && group.times.some(t => t.original === s.time)
        );
      })
      .map(([slot]) => slot);
  };

  const getCourseForSlot = (day, group, isLab) => {
    if (group.isLunch) return null;

    for (const [slot, schedules] of Object.entries(slotMapping)) {
      if (slot === 'Lunch') continue;
      if (/^L\d+/i.test(slot) !== isLab) continue;

      if (
        schedules.some(
          s => s.day === day && group.times.some(t => t.original === s.time)
        )
      ) {
        return timetable[slot] || null;
      }
    }
    return null;
  };

  const handleDownload = () => {
    domtoimage.toPng(timetableRef.current).then(url => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `Timetable-${Date.now()}.png`;
      a.click();
    });
  };

  // ================= RENDER =================
  return (
    <div className="mt-6">
      <h2 className={`text-xl font-bold mb-4 ${headingTextClass}`}>
        Generated Timetable
      </h2>

      <button
        onClick={handleDownload}
        className={`mb-4 px-3 py-2 text-white rounded ${downloadBtnClass}`}
      >
        Download Timetable
      </button>

      {/* NO SCROLL */}
      <div className="overflow-x-hidden">
        <table
          ref={timetableRef}
          className="w-full border-collapse table-fixed"
          style={{ width: '100%' }}
        >
          <thead>
            <tr>
              <th rowSpan="3" className={`border p-3 font-semibold ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-teal-600 text-white' 
                  : 'border-gray-300 bg-green-600 text-white'
              }`}>Day</th>
              <th rowSpan="3" className={`border p-3 font-semibold ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-teal-600 text-white' 
                  : 'border-gray-300 bg-green-600 text-white'
              }`}>Type</th>
              
            </tr>

            <tr>
              {allTimeGroups.map((g, i) => (
                <th key={i} colSpan={g.isLunch ? g.lunchCount : 1} className={`border p-2 text-xs ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-teal-500 text-white'
                    : 'border-gray-300 bg-green-500 text-white'
                }`}>
                  {g.isLunch ? 'LUNCH' : g.theoryTimes.join(', ') || '-'}
                </th>
              ))}
            </tr>

            <tr>
              {allTimeGroups.map((g, i) => (
                <th key={i} colSpan={g.isLunch ? g.lunchCount : 1} className={`border p-2 text-xs ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-teal-500 text-white'
                    : 'border-gray-300 bg-green-500 text-white'
                }`}>
                  {g.isLunch ? 'LUNCH' : g.labTimes.join(', ') || '-'}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map(day => (
              <React.Fragment key={day}>
                <tr>
                  <td rowSpan="2" className={`border p-3 font-semibold text-center ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-slate-700 text-white'
                      : 'border-gray-300 bg-gray-100 text-gray-800'
                  }`}>
                    {day}
                  </td>
                  <td className={`border p-2 text-center font-semibold ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-slate-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}>Theory</td>

                  {allTimeGroups.map((g, i) =>
                    g.isLunch ? (
                      <td key={i} rowSpan="2" colSpan={g.lunchCount} className={`border text-center font-semibold text-sm ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-slate-600 text-white'
                          : 'border-gray-300 bg-gray-200 text-gray-700'
                      }`}>
                        Lunch
                      </td>
                    ) : (
                      <td key={i} className={`border text-center ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-slate-700 text-slate-200'
                          : 'border-gray-300 bg-white text-gray-800'
                      }`}>
                        {(() => {
                          const course = getCourseForSlot(day, g, false);
                          const slots = getSlotsForDayAndGroup(day, g, false);
                          return course
                            ? <div className={theme === 'dark' ? 'bg-teal-500 text-white rounded text-xs p-1' : 'bg-green-500 text-white rounded text-xs p-1'}>{course.code}<br />{course.slot}</div>
                            : slots.length ? <span className="text-xs">{slots.join(', ')}</span> : '-';
                        })()}
                      </td>
                    )
                  )}
                </tr>

                <tr>
                  <td className={`border p-2 text-center font-semibold ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-slate-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}>Lab</td>
                  {allTimeGroups.map((g, i) =>
                    g.isLunch ? null : (
                      <td key={i} className={`border text-center ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-slate-700 text-slate-200'
                          : 'border-gray-300 bg-white text-gray-800'
                      }`}>
                        {(() => {
                          const course = getCourseForSlot(day, g, true);
                          const slots = getSlotsForDayAndGroup(day, g, true);
                          return course
                            ? <div className="bg-orange-500 text-white rounded text-xs p-1">{course.code}<br />{course.slot}</div>
                            : slots.length ? <span className="text-xs">{slots.join(', ')}</span> : '-';
                        })()}
                      </td>
                    )
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`mt-4 flex gap-6 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        <div className="flex gap-2 items-center">
          <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-teal-500' : 'bg-green-500'}`} /> Theory Slot
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full" /> Lab Slot
        </div>
      </div>
    </div>
  );
}
