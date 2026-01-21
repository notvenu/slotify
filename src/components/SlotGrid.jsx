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
  const timetableTheme = getThemeColor(theme, colorConfig.timetable);

  const headingTextClass = textTheme.primary || '';
  const downloadBtnClass =
    theme === 'dark'
      ? colorConfig.button.primary.dark
      : colorConfig.button.primary.light;

  const slotMapping = getSlotMappingForSemester(currentSemester);

  const timetable = {};
  for (let course of selectedCourses) {
    for (let slot of [...(course.theory || []), ...(course.lab || [])]) {
      timetable[slot] = {
        code: course.code,
        slot
      };
    }
  }

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

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

  return (
    <div className="mt-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className={`text-lg sm:text-xl font-bold ${headingTextClass}`}>
          Generated Timetable
        </h2>

        <button
          onClick={handleDownload}
          className={`px-3 py-2 text-sm sm:text-base text-white rounded-lg ${downloadBtnClass} whitespace-nowrap`}
        >
          Download Timetable
        </button>
      </div>

      {/* Horizontal scroll for small screens only */}
      <div className="overflow-x-auto lg:overflow-x-visible lg:flex lg:justify-center">
        <table
          ref={timetableRef}
          className="w-full border-collapse min-w-[800px] lg:min-w-0 lg:w-auto table-auto rounded-md overflow-hidden"
        >
          <thead>
            <tr>
              <th rowSpan="3" className={`border px-2 py-1 sm:px-3 sm:py-1 lg:px-3 font-semibold text-xs sm:text-sm w-16 sm:w-20 ${timetableTheme.header.primary}`}>Day</th>
              <th rowSpan="3" className={`border px-2 py-1 sm:px-3 sm:py-1 lg:px-3 font-semibold text-xs sm:text-sm w-16 sm:w-20 ${timetableTheme.header.primary}`}>Type</th>
              
            </tr>

            <tr>
              {allTimeGroups.map((g, i) => (
                <th key={i} colSpan={g.isLunch ? g.lunchCount : 1} className={`border px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:px-3 text-[10px] sm:text-xs font-medium min-w-[60px] sm:min-w-[70px] ${timetableTheme.header.secondary}`}>
                  {g.isLunch ? 'LUNCH' : g.theoryTimes.join(', ') || '-'}
                </th>
              ))}
            </tr>

            <tr>
              {allTimeGroups.map((g, i) => (
                <th key={i} colSpan={g.isLunch ? g.lunchCount : 1} className={`border px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:px-3 text-[10px] sm:text-xs font-medium min-w-[60px] sm:min-w-[70px] ${timetableTheme.header.secondary}`}>
                  {g.isLunch ? 'LUNCH' : g.labTimes.join(', ') || '-'}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map(day => (
              <React.Fragment key={day}>
                <tr>
                  <td rowSpan="2" className={`border px-2 py-1 sm:px-3 sm:py-1 lg:px-3 font-semibold text-center text-xs sm:text-sm ${timetableTheme.cell.day}`}>
                    {day}
                  </td>
                  <td className={`border px-2 py-1 sm:px-3 sm:py-1 lg:px-3 text-center font-semibold text-xs sm:text-sm ${timetableTheme.cell.type}`}>Theory</td>

                  {allTimeGroups.map((g, i) =>
                    g.isLunch ? (
                      <td key={i} rowSpan="2" colSpan={g.lunchCount} className={`border text-center font-semibold px-2 py-1 sm:px-3 lg:px-3 text-xs sm:text-sm ${timetableTheme.cell.lunch}`}>
                        Lunch
                      </td>
                    ) : (
                      <td key={i} className={`border text-center px-1.5 py-1 sm:px-2 sm:py-1 lg:px-2 align-middle min-w-[60px] sm:min-w-[70px] ${timetableTheme.cell.slot}`}>
                        <div className="flex items-center justify-center">
                          {(() => {
                            const course = getCourseForSlot(day, g, false);
                            const slots = getSlotsForDayAndGroup(day, g, false);
                            return course
                              ? <div className={`${timetableTheme.course.theory} rounded text-[10px] sm:text-xs px-2 py-0.5 font-medium`}>{course.code}<br />{course.slot}</div>
                              : slots.length ? <span className={`text-[10px] sm:text-xs font-semibold ${timetableTheme.slotName.theory}`}>{slots.join(', ')}</span> : <span className="text-xs sm:text-sm">-</span>;
                          })()}
                        </div>
                      </td>
                    )
                  )}
                </tr>

                <tr>
                  <td className={`border px-2 py-1 sm:px-3 sm:py-1 lg:px-3 text-center font-semibold text-xs sm:text-sm ${timetableTheme.cell.type}`}>Lab</td>
                  {allTimeGroups.map((g, i) =>
                    g.isLunch ? null : (
                      <td key={i} className={`border text-center px-1.5 py-1 sm:px-2 sm:py-1 lg:px-2 align-middle min-w-[60px] sm:min-w-[70px] ${timetableTheme.cell.slot}`}>
                        <div className="flex items-center justify-center">
                          {(() => {
                            const course = getCourseForSlot(day, g, true);
                            const slots = getSlotsForDayAndGroup(day, g, true);
                            return course
                              ? <div className={`${timetableTheme.course.lab} rounded text-[10px] sm:text-xs px-2 py-0.5 font-medium`}>{course.code}<br />{course.slot}</div>
                              : slots.length ? <span className={`text-[10px] sm:text-xs font-semibold ${timetableTheme.slotName.lab}`}>{slots.join(', ')}</span> : <span className="text-xs sm:text-sm">-</span>;
                          })()}
                        </div>
                      </td>
                    )
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`mt-4 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm ${textTheme.primary}`}>
        <div className="flex gap-2 items-center">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${timetableTheme.course.theory}`} /> 
          <span>Theory Slot</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${timetableTheme.course.lab}`} /> 
          <span>Lab Slot</span>
        </div>
      </div>
    </div>
  );
}