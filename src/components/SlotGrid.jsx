import React, { useRef } from 'react';
import domtoimage from 'dom-to-image';
import slotMapping from '../data/slotMapping';

export default function SlotGrid({ selectedCourses, theme = 'light' }) {
  const timetableRef = useRef(null);
  const timetable = {};

  for (let course of selectedCourses) {
    for (let slot of [...(course.theory || []), ...(course.lab || [])]) {
      timetable[slot] = {
        code: course.code,
        name: course.name,
        type: course.type,
        theory: course.theory || [],
        lab: course.lab || []
      };
    }
  }

  const timeSlots = [
    '08:00-08:50', '09:00-09:50', '10:00-10:50',
    '11:00-11:50', '12:00-12:50', '12:50-13:30', '13:30-14:00',
    '14:00-14:50', '15:00-15:50', '16:00-16:50', '17:00-17:50',
    '18:00-18:50', '19:00-19:30'
  ];

  const days = ['TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const dayTimeToSlots = {};
  Object.entries(slotMapping).forEach(([slot, timeSlots]) => {
    timeSlots.forEach(({ day, time }) => {
      const key = `${day.toUpperCase()}-${time}`;
      if (!dayTimeToSlots[key]) {
        dayTimeToSlots[key] = [];
      }
      dayTimeToSlots[key].push(slot);
    });
  });

  const getSlotsForDayTime = (day, time) => {
    const key = `${day}-${time}`;
    return dayTimeToSlots[key] || [];
  };

  const getCoursesForCell = (day, time) => {
    const slots = getSlotsForDayTime(day, time);
    const entries = [];
    for (let slot of slots) {
      if (timetable[slot]) {
        entries.push({
          ...timetable[slot],
          slot
        });
      }
    }
    return entries;
  };

  const slotTypeColorMap = theme === 'dark' ? {
    theory: 'bg-emerald-800 text-emerald-100',
    lab: 'bg-amber-800 text-amber-100',
    project: 'bg-pink-800 text-pink-100'
  } : {
    theory: 'bg-green-500 text-white',
    lab: 'bg-orange-500 text-white',
    project: 'bg-pink-500 text-white'
  };

  const detectSlotType = (slot) => {
    if (/^L\d+/i.test(slot)) return 'lab';
    if (/^P/i.test(slot)) return 'project';
    return 'theory';
  };

  const handleDownload = () => {
    if (!timetableRef.current) return;

    domtoimage.toPng(timetableRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Timetable-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Screenshot failed:', error);
      });
  };

  return (
    <div className="mt-6">
      <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
        Generated Timetable
      </h2>

      <button
        onClick={handleDownload}
        className={`mb-4 px-3 py-2 text-white rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800'
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        Download Timetable
      </button>

      <div className="overflow-x-auto">
        <table ref={timetableRef} className={`w-full border-collapse border ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-gray-300'
          }`}>
          <thead>
            <tr className={theme === 'dark' ? 'bg-emerald-800' : 'bg-green-500'}>
              <th className={`border p-2 text-sm font-bold text-white ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>Day</th>
              {timeSlots.map((time) => (
                <th
                  key={time}
                  className={`border p-2 text-sm font-bold min-w-[90px] text-white ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  }`}
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className={`border p-2 text-xs font-medium text-center ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  {day}
                </td>
                {timeSlots.map((time) => {
                  const entries = getCoursesForCell(day, time);
                  const slotsInCell = getSlotsForDayTime(day, time);

                  return (
                    <td
                      key={`${day}-${time}`}
                      className={`border p-0 text-center relative ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                      }`}
                    >
                      {entries.length > 0 ? (
                        <div className="flex flex-col justify-center items-center h-full w-full">
                          {entries.map((entry, idx) => {
                            const slotType = detectSlotType(entry.slot);
                            return (
                              <div
                                key={idx}
                                className={`w-full h-full flex flex-col justify-center items-center px-1 py-2 ${slotTypeColorMap[slotType]}`}
                              >
                                <div className="font-bold text-xs">
                                  {entry.code}
                                </div>
                                <div className="text-[10px]">{entry.name}</div>
                                <div className="text-xs font-semibold">
                                  ({entry.slot})
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        slotsInCell.length > 0 && (() => {
                          const theorySlots = slotsInCell.filter(s => !/^L\d+/i.test(s));
                          const labSlots = slotsInCell.filter(s => /^L\d+/i.test(s));
                          return (
                            <div className={`text-xs h-16 flex flex-col items-center justify-center leading-tight ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {theorySlots.length > 0 && (
                                <div className={`text-[10px] font-medium ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {theorySlots.join('/')}
                                </div>
                              )}
                              {labSlots.length > 0 && (
                                <div className={`text-[10px] ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {labSlots.join('/')}
                                </div>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 text-sm">
        <div className="flex items-center gap-1">
          <div className={`w-4 h-4 rounded-lg ${theme === 'dark' ? 'bg-emerald-800' : 'bg-green-500'}`} />
          <span className={theme === 'dark' ? 'text-gray-200' : ''}>Theory Slot</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-4 h-4 rounded-lg ${theme === 'dark' ? 'bg-amber-800' : 'bg-orange-500'}`} />
          <span className={theme === 'dark' ? 'text-gray-200' : ''}>Lab Slot</span>
        </div>
      </div>
    </div>
  );
}
