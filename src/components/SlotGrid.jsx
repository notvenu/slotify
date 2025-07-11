import React, { useRef } from "react";
import domtoimage from "dom-to-image";
import slotMapping from "../data/slotMapping";

export default function SlotGrid({ selectedCourses }) {
  const timetableRef = useRef(null);

  const timetable = {};

  // Build timetable mapping
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
    "08:00-08:50", "09:00-09:50", "10:00-10:50",
    "11:00-11:50", "12:00-12:50", "12:50-13:30", "13:30-14:00",
    "14:00-14:50", "15:00-15:50", "16:00-16:50", "17:00-17:50",
    "18:00-18:50", "19:00-19:30"
  ];

  const days = ["TUE", "WED", "THU", "FRI", "SAT"];

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

  const slotTypeColorMap = {
    theory: "bg-green-500 text-white",
    lab: "bg-orange-500 text-white",
    project: "bg-pink-500 text-white"
  };

  const detectSlotType = (slot) => {
    if (/^L\d+/i.test(slot)) return "lab";
    if (/^P/i.test(slot)) return "project";
    return "theory";
  };

const handleDownload = () => {
  if (!timetableRef.current) return;

  console.log("Downloading with dom-to-image...");
  domtoimage.toPng(timetableRef.current)
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "Timetable"+`-${Date.now()}`+".png";
      link.href = dataUrl;
      link.click();
    })
    .catch((error) => {
      console.error("Screenshot failed:", error);
    });
};


  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Generated Timetable</h2>

      <button
        onClick={handleDownload}
        className="mb-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download Timetable as Image
      </button>

      <div className="overflow-x-auto">
        <table ref={timetableRef} className="w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="border border-gray-300 p-2 text-sm font-bold">Day</th>
              {timeSlots.map((time) => (
                <th
                  key={time}
                  className="border border-gray-300 p-2 text-sm font-bold min-w-[90px]"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border border-gray-300 p-2 text-xs font-medium bg-gray-50 text-center">
                  {day}
                </td>
                {timeSlots.map((time) => {
                  const entries = getCoursesForCell(day, time);
                  const slotsInCell = getSlotsForDayTime(day, time);

                  return (
                    <td
                      key={`${day}-${time}`}
                      className="border border-gray-300 p-0 text-center relative"
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
                            <div className="text-xs text-gray-400 h-16 flex flex-col items-center justify-center leading-tight">
                              {theorySlots.length > 0 && (
                                <div className="text-[10px] font-medium text-gray-500">
                                  {theorySlots.join('/')}
                                </div>
                              )}
                              {labSlots.length > 0 && (
                                <div className="text-[10px] text-gray-500">
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

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Theory Slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span>Lab Slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-500" />
          <span>Project Slot</span>
        </div>
      </div>
    </div>
  );
}
