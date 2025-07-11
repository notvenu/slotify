import React, { useState, useMemo, useEffect } from "react";

export default function CourseSelector({
  courseData,
  selectedCourses,
  setSelectedCourses,
  maxSubjects,
  editingCourse, // NEW: receive editing course
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selecting, setSelecting] = useState(null);
  const [selectedTheoryIdx, setSelectedTheoryIdx] = useState(null);
  const [selectedLabIdx, setSelectedLabIdx] = useState(null);

  const coursesPerPage = 10;

  const uniqueCourses = useMemo(() => courseData, [courseData]);

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return uniqueCourses;
    return uniqueCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [searchTerm, uniqueCourses]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(start, start + coursesPerPage);
  }, [filteredCourses, currentPage]);

  function getTheoryAndLabCombos(course) {
    const theoryCombos = [];
    const labCombos = [];
    course?.slotCombos?.forEach((combo, idx) => {
      if (combo.theory.length > 0 && combo.lab.length === 0) {
        theoryCombos.push({ ...combo, idx });
      } else if (combo.lab.length > 0 && combo.theory.length === 0) {
        labCombos.push({ ...combo, idx });
      } else if (combo.theory.length > 0 && combo.lab.length > 0) {
        theoryCombos.push({ ...combo, idx });
        labCombos.push({ ...combo, idx });
      }
    });
    return { theoryCombos, labCombos };
  }

  // NEW: Preselect when editingCourse changes
  useEffect(() => {
    if (editingCourse) {
      const course = courseData.find(
        (c) =>
          c.code === editingCourse.code && c.name === editingCourse.name
      );
      if (course) {
        setSelecting(course);

        const { theoryCombos, labCombos } = getTheoryAndLabCombos(course);

        // Find matching theory
        const matchedTheory = theoryCombos.find(
          (combo) =>
            JSON.stringify(combo.theory) === JSON.stringify(editingCourse.theory) &&
            JSON.stringify(combo.lab) === JSON.stringify(editingCourse.lab)
        );
        if (matchedTheory) setSelectedTheoryIdx(matchedTheory.idx);

        // If no match in theory, try lab
        if (!matchedTheory) {
          const matchedLab = labCombos.find(
            (combo) =>
              JSON.stringify(combo.theory) === JSON.stringify(editingCourse.theory) &&
              JSON.stringify(combo.lab) === JSON.stringify(editingCourse.lab)
          );
          if (matchedLab) setSelectedLabIdx(matchedLab.idx);
        }
      }
    }
  }, [editingCourse, courseData]);

  const canAdd =
    selecting &&
    ((selectedTheoryIdx !== null &&
      getTheoryAndLabCombos(selecting).theoryCombos.length > 0) ||
      (selectedLabIdx !== null && getTheoryAndLabCombos(selecting).labCombos.length > 0)) &&
    selectedCourses.length < maxSubjects;

  const handleAdd = () => {
    if (!canAdd) return;
    const { theoryCombos, labCombos } = getTheoryAndLabCombos(selecting);
    const newCourses = [];

    if (selectedTheoryIdx !== null) {
      const combo = theoryCombos.find((c) => c.idx === selectedTheoryIdx);
      if (combo) {
        newCourses.push({
          code: selecting.code,
          name: selecting.name,
          type: selecting.type,
          theory: combo.theory,
          lab: combo.lab,
        });
      }
    }

    if (
      selectedLabIdx !== null &&
      selectedLabIdx !== selectedTheoryIdx
    ) {
      const combo = labCombos.find((c) => c.idx === selectedLabIdx);
      if (combo) {
        newCourses.push({
          code: selecting.code,
          name: selecting.name,
          type: selecting.type,
          theory: combo.theory,
          lab: combo.lab,
        });
      }
    }

    if (newCourses.length > 0) {
      setSelectedCourses((prev) => [...prev, ...newCourses]);
    }

    setSelecting(null);
    setSelectedTheoryIdx(null);
    setSelectedLabIdx(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Course Selector</h2>
      <div className="flex gap-2 items-center">
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          disabled={!!selecting}
          placeholder="Search by code or name..."
          className="border px-2 py-1 flex-1"
        />
        {searchTerm && (
          <button
            className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
          >
            Clear
          </button>
        )}
      </div>


      {!selecting && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto border p-2">
            {paginatedCourses.map((c) => {
              const isSelected = selectedCourses.some(
                (s) =>
                  s.code === c.code &&
                  s.name === c.name &&
                  c.slotCombos.some(
                    (combo) =>
                      JSON.stringify(s.theory) === JSON.stringify(combo.theory) &&
                      JSON.stringify(s.lab) === JSON.stringify(combo.lab)
                  )
              );
              return (
                <button
                  key={c.code + c.name}
                  disabled={isSelected}
                  onClick={() => {
                    setSelecting(c);
                    setSelectedTheoryIdx(null);
                    setSelectedLabIdx(null);
                  }}
                  className={`border p-2 rounded text-left ${
                    isSelected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.code}</div>
                </button>
              );
            })}
          </div>
          {filteredCourses.length > coursesPerPage && (
            <div className="flex gap-2 justify-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} /{" "}
                {Math.ceil(filteredCourses.length / coursesPerPage)}
              </span>
              <button
                disabled={
                  currentPage ===
                  Math.ceil(filteredCourses.length / coursesPerPage)
                }
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selecting && (
        <div className="border p-4 rounded bg-blue-50">
          <div className="mb-2 font-semibold">
            {selecting.name} ({selecting.code})
          </div>
          <div className="mb-2 font-medium">Select Slot Combination(s):</div>
          {(() => {
            const { theoryCombos, labCombos } = getTheoryAndLabCombos(selecting);
            return (
              <>
                {theoryCombos.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Theory Slots</div>
                    <div className="flex flex-col gap-2">
                      {theoryCombos.map((combo) => {
                        const isChecked = selectedTheoryIdx === combo.idx;
                        return (
                          <label
                            key={combo.idx}
                            className={`flex items-center gap-2 border px-2 py-1 rounded ${
                              isChecked
                                ? "bg-blue-100"
                                : "bg-white hover:bg-blue-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="theoryCombo"
                              checked={isChecked}
                              onChange={() => setSelectedTheoryIdx(combo.idx)}
                            />
                            <span>
                              Theory: {combo.theory.join("+")}
                              {combo.lab.length > 0
                                ? ` | Lab: ${combo.lab.join("+")}`
                                : ""}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
                {labCombos.length > 0 && (
                  <div className="mb-2">
                    <div className="font-semibold mb-1">Lab Slots</div>
                    <div className="flex flex-col gap-2">
                      {labCombos.map((combo) => {
                        const isChecked = selectedLabIdx === combo.idx;
                        return (
                          <label
                            key={combo.idx}
                            className={`flex items-center gap-2 border px-2 py-1 rounded ${
                              isChecked
                                ? "bg-blue-100"
                                : "bg-white hover:bg-blue-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="labCombo"
                              checked={isChecked}
                              onChange={() => setSelectedLabIdx(combo.idx)}
                            />
                            <span>
                              Lab: {combo.lab.join("+")}
                              {combo.theory.length > 0
                                ? ` | Theory: ${combo.theory.join("+")}`
                                : ""}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
          <div className="flex gap-2 mt-4">
            <button
              disabled={!canAdd}
              onClick={handleAdd}
              className={`px-3 py-1 rounded ${
                canAdd
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {editingCourse ? "Save Changes" : "Add Course"}
            </button>
            <button
              onClick={() => {
                setSelecting(null);
                setSelectedTheoryIdx(null);
                setSelectedLabIdx(null);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
