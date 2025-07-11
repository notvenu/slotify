import React, { useState, useMemo, useEffect } from "react";

export default function CourseSelector({
  courseData,
  selectedCourses,
  setSelectedCourses,
  maxSubjects,
  editingCourse,
  setEditingCourse,
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
        // This combo has BOTH theory and lab; we treat it as a single combined combo
        theoryCombos.push({ ...combo, idx });
        labCombos.push({ ...combo, idx });
      }
    });
    return { theoryCombos, labCombos };
  }

  useEffect(() => {
    if (editingCourse) {
      const course = courseData.find(
        (c) => c.code === editingCourse.code && c.name === editingCourse.name
      );
      if (course) {
        setSelecting(course);

        const matchedCombo = course.slotCombos.find(
          (combo) =>
            JSON.stringify(combo.theory.sort()) === JSON.stringify(editingCourse.theory.sort()) &&
            JSON.stringify(combo.lab.sort()) === JSON.stringify(editingCourse.lab.sort())
        );

        if (matchedCombo) {
          const idx = matchedCombo.idx;
          const hasTheory = matchedCombo.theory.length > 0;
          const hasLab = matchedCombo.lab.length > 0;

          setSelectedTheoryIdx(hasTheory ? idx : null);
          setSelectedLabIdx(hasLab ? idx : null);
        } else {
          setSelectedTheoryIdx(null);
          setSelectedLabIdx(null);
        }
      }
    }
  }, [editingCourse, courseData]);

  const isEditing = !!editingCourse;

  const hasAnyComboWithBothTheoryAndLab = selecting?.slotCombos.some(
    (combo) => combo.theory.length > 0 && combo.lab.length > 0
  );

  const { theoryCombos, labCombos } = selecting ? getTheoryAndLabCombos(selecting) : { theoryCombos: [], labCombos: [] };

const hasAnyTheory = theoryCombos.length > 0;
const hasAnyLab = labCombos.length > 0;

const requiresBoth = hasAnyTheory && hasAnyLab;

const canAdd =
  selecting &&
  (
    requiresBoth
      ? selectedTheoryIdx !== null && selectedLabIdx !== null
      : (selectedTheoryIdx !== null || selectedLabIdx !== null)
  ) &&
  (isEditing || selectedCourses.length < maxSubjects);


const handleAdd = () => {
  if (!canAdd) return;

  // ✅ Check if already added
  const alreadyAdded = selectedCourses.some(
    (s) => s.code === selecting.code && s.name === selecting.name
  );

  if (alreadyAdded && !isEditing) {
    // Prevent duplicate
    alert("This course has already been added.");
    return;
  }

  const { theoryCombos, labCombos } = getTheoryAndLabCombos(selecting);

  let selectedTheoryCombo = selectedTheoryIdx !== null
    ? theoryCombos.find((c) => c.idx === selectedTheoryIdx)
    : null;
  let selectedLabCombo = selectedLabIdx !== null
    ? labCombos.find((c) => c.idx === selectedLabIdx)
    : null;

  const combinedTheory = [...new Set([
    ...(selectedTheoryCombo?.theory || []),
    ...(selectedLabCombo?.theory || [])
  ])];

  const combinedLab = [...new Set([
    ...(selectedTheoryCombo?.lab || []),
    ...(selectedLabCombo?.lab || [])
  ])];

  const newCourse = {
    code: selecting.code,
    name: selecting.name,
    type: selecting.type,
    theory: combinedTheory,
    lab: combinedLab,
  };

  setSelectedCourses((prev) => {
    if (isEditing) {
      const filtered = prev.filter(
        (c) =>
          !(c.code === editingCourse.code &&
            c.name === editingCourse.name &&
            JSON.stringify(c.theory.sort()) === JSON.stringify(editingCourse.theory.sort()) &&
            JSON.stringify(c.lab.sort()) === JSON.stringify(editingCourse.lab.sort()))
      );
      return [...filtered, newCourse];
    }
    return [...prev, newCourse];
  });

  if (isEditing && setEditingCourse) {
    setEditingCourse(null);
  }
  setSelecting(null);
  setSelectedTheoryIdx(null);
  setSelectedLabIdx(null);
};

  const handleCancel = () => {
    if (isEditing && setEditingCourse) {
      setEditingCourse(null);
    }
    setSelecting(null);
    setSelectedTheoryIdx(null);
    setSelectedLabIdx(null);
  };

  const handleTheorySelection = (idx) => {
    setSelectedTheoryIdx(idx);
  };

  const handleLabSelection = (idx) => {
    setSelectedLabIdx(idx);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        {isEditing ? "Edit Course" : "Course Selector"}
      </h2>
      
      {!selecting && (
        <>
          <div className="flex gap-2 items-center">
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by code or name..."
              className="border px-2 py-2 flex-1 rounded-lg"
            />
            {searchTerm && (
              <button
                className="text-sm px-2 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto border p-2 rounded-lg">
            {paginatedCourses.map((c) => {
              const isSelected = selectedCourses.some(
                (s) => s.code === c.code && s.name === c.name
              );
              return (
                <button
                  key={c.code + c.name}
                  disabled={isSelected && !isEditing}
                  onClick={() => {
                    setSelecting(c);
                    setSelectedTheoryIdx(null);
                    setSelectedLabIdx(null);
                  }}
                  className={`border p-2 rounded-lg text-left ${
                    isSelected && !isEditing
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
                className="p-1 border-1 rounded-lg cursor-pointer"
              >
                Prev
              </button>
              <span className="p-1">
                Page {currentPage} /{" "}
                {Math.ceil(filteredCourses.length / coursesPerPage)}
              </span>
              <button
                disabled={
                  currentPage ===
                  Math.ceil(filteredCourses.length / coursesPerPage)
                }
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1 border-1 rounded-lg cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selecting && (
        <div className="border p-4 rounded-lg bg-blue-50">
          <div className="mb-2 font-semibold">
            {selecting.name} ({selecting.code})
          </div>
          
          {isEditing && (
            <div className="mb-2 text-sm text-blue-600 font-medium">
              Editing mode - modify the slot selection below
            </div>
          )}

          {(() => {
            const { theoryCombos, labCombos } = getTheoryAndLabCombos(selecting);
            const allNill = selecting.slotCombos.every(
              (combo) =>
                combo.theory.length === 1 &&
                combo.theory[0].toUpperCase() === "NILL" &&
                combo.lab.length === 0
            );

            if (allNill) {
              return (
                <>
                  <div className="mb-2 text-sm text-gray-700">
                    This course has no slots (Project/Internship).
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedCourses((prev) => {
                          if (isEditing) {
                            // Remove the exact matching course (by code, name, theory, and lab)
                            const filtered = prev.filter(
                              (c) =>
                                !(c.code === editingCourse.code && 
                                  c.name === editingCourse.name &&
                                  JSON.stringify(c.theory.sort()) === JSON.stringify(editingCourse.theory.sort()) &&
                                  JSON.stringify(c.lab.sort()) === JSON.stringify(editingCourse.lab.sort()))
                            );
                            return [...filtered, {
                              code: selecting.code,
                              name: selecting.name,
                              type: selecting.type,
                              theory: [],
                              lab: [],
                            }];
                          } else {
                            return [...prev, {
                              code: selecting.code,
                              name: selecting.name,
                              type: selecting.type,
                              theory: [],
                              lab: [],
                            }];
                          }
                        });
                        
                        // Clear editing mode and reset state
                        if (isEditing && setEditingCourse) {
                          setEditingCourse(null);
                        }
                        setSelecting(null);
                        setSelectedTheoryIdx(null);
                        setSelectedLabIdx(null);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
                    >
                      {isEditing ? "Save Changes" : "Add Course"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              );
            }

            return (
              <>
                <div className="mb-2 font-medium">Select Slot Combination(s):</div>
                {theoryCombos.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Theory Slots</div>
                    <div className="flex flex-col gap-2">
                      {theoryCombos.map((combo) => {
                        const isChecked = selectedTheoryIdx === combo.idx;
                        return (
                          <label
                            key={combo.idx}
                            className={`flex items-center gap-2 border px-2 py-1 rounded-lg cursor-pointer ${
                              isChecked
                                ? "bg-blue-100 border-blue-300"
                                : "bg-white hover:bg-blue-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="theoryCombo"
                              checked={isChecked}
                              onChange={() => handleTheorySelection(combo.idx)}
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
                            className={`flex items-center gap-2 border px-2 py-1 rounded-lg cursor-pointer ${
                              isChecked
                                ? "bg-blue-100 border-blue-300"
                                : "bg-white hover:bg-blue-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="labCombo"
                              checked={isChecked}
                              onChange={() => handleLabSelection(combo.idx)}
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
                <div className="flex gap-2 mt-4">
                  <button
                    disabled={!canAdd}
                    onClick={handleAdd}
                    className={`px-3 py-1 rounded-lg ${
                      canAdd
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isEditing ? "Save Changes" : "Add Course"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}