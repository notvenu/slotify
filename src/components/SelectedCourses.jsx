import React, { useState } from "react";

export default function SelectedCourses({
  groupedCourses,
  onRemoveCourse,
  onRemoveMultiple,
  onRemoveAll,
  onEditCourse,
  getCourseCredits
}) {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const toggleSelection = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  const isSelected = (idx) => selectedIndices.includes(idx);
  const selectionMode = selectedIndices.length > 0;

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-2">Selected Courses</h2>

      <div className="space-y-2">
        {groupedCourses.length === 0 && (
          <div className="text-gray-500">No courses added.</div>
        )}

        {groupedCourses.map((course, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row md:items-center gap-4 border p-2 rounded-lg ${
              isSelected(idx) ? "bg-yellow-50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={isSelected(idx)}
                onChange={() => toggleSelection(idx)}
                className="cursor-pointer"
              />
              <div>
                <div className="font-semibold">{course.name}</div>
                <div className="text-sm text-gray-600">
                  {course.code} ({course.type})
                </div>
                <div className="text-sm">
                  <span className="font-medium">Theory Slots:</span>{" "}
                  {course.theory.length > 0
                    ? course.theory.join(" + ")
                    : "None"}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Lab Slots:</span>{" "}
                  {course.lab.length > 0
                    ? course.lab.join(" + ")
                    : "None"}
                </div>
                <div className="text-sm font-bold text-blue-600">
                  Credits: {getCourseCredits(course)}
                </div>
              </div>
            </div>
            {!selectionMode && (
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-300"
                  onClick={() => onEditCourse(course)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-200 rounded-lg cursor-pointer hover:bg-red-300"
                  onClick={() => onRemoveCourse(course)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {groupedCourses.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {selectionMode && (
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
              onClick={() => {
                onRemoveMultiple(selectedIndices);
                setSelectedIndices([]);
              }}
            >
              Remove Selected ({selectedIndices.length})
            </button>
          )}
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
            onClick={() => {
              onRemoveAll();
              setSelectedIndices([]);
            }}
          >
            Remove All
          </button>
        </div>
      )}
    </div>
  );
}
