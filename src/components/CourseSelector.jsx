import React, { useState, useMemo, useEffect } from 'react';

export default function CourseSelector({
  courseData,
  selectedCourses,
  setSelectedCourses,
  maxSubjects,
  editingCourse,
  setEditingCourse,
  theme = 'light'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selecting, setSelecting] = useState(null);
  const [selectedTheoryIdx, setSelectedTheoryIdx] = useState(null);
  const [selectedLabIdx, setSelectedLabIdx] = useState(null);

  const coursesPerPage = 10;

  // keep original ordering / structure as provided by courseData
  const uniqueCourses = useMemo(() => courseData || [], [courseData]);

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return uniqueCourses;
    return uniqueCourses.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.code || '').toLowerCase().includes(q)
    );
  }, [searchTerm, uniqueCourses]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(start, start + coursesPerPage);
  }, [filteredCourses, currentPage]);

  function getTheoryAndLabCombos(course) {
    const theoryCombos = [];
    const labCombos = [];

    (course?.slotCombos || []).forEach((combo, idx) => {
      // ensure arrays exist
      const theory = Array.isArray(combo.theory) ? combo.theory : [];
      const lab = Array.isArray(combo.lab) ? combo.lab : [];
      const c = { theory, lab, idx };

      if (theory.length > 0 && lab.length === 0) {
        theoryCombos.push(c);
      } else if (lab.length > 0 && theory.length === 0) {
        labCombos.push(c);
      } else if (theory.length > 0 && lab.length > 0) {
        theoryCombos.push(c);
        labCombos.push(c);
      }
    });

    return { theoryCombos, labCombos };
  }

  useEffect(() => {
    if (editingCourse) {
      const course = (courseData || []).find(
        (c) => c.code === editingCourse.code && c.name === editingCourse.name
      );

      if (course) {
        setSelecting(course);

        const matchedCombo = (course.slotCombos || []).find(
          (combo) =>
            JSON.stringify((combo.theory || []).slice().sort()) ===
              JSON.stringify((editingCourse.theory || []).slice().sort()) &&
            JSON.stringify((combo.lab || []).slice().sort()) ===
              JSON.stringify((editingCourse.lab || []).slice().sort())
        );

        if (matchedCombo) {
          const idx = matchedCombo.idx;
          setSelectedTheoryIdx((matchedCombo.theory || []).length > 0 ? idx : null);
          setSelectedLabIdx((matchedCombo.lab || []).length > 0 ? idx : null);
        } else {
          setSelectedTheoryIdx(null);
          setSelectedLabIdx(null);
        }
      }
    }
  }, [editingCourse, courseData]);

  const isEditing = !!editingCourse;

  const hasAnyComboWithBothTheoryAndLab = selecting?.slotCombos?.some(
    (combo) => (combo.theory || []).length > 0 && (combo.lab || []).length > 0
  );

  const { theoryCombos, labCombos } = selecting
    ? getTheoryAndLabCombos(selecting)
    : { theoryCombos: [], labCombos: [] };

  const hasAnyTheory = theoryCombos.length > 0;
  const hasAnyLab = labCombos.length > 0;
  const requiresBoth = hasAnyTheory && hasAnyLab;

  const canAdd =
    selecting &&
    (requiresBoth
      ? selectedTheoryIdx !== null && selectedLabIdx !== null
      : selectedTheoryIdx !== null || selectedLabIdx !== null) &&
    (isEditing || selectedCourses.length < maxSubjects);

  const handleAdd = () => {
    if (!canAdd) return;

    const alreadyAdded = selectedCourses.some(
      (s) => s.code === selecting.code && s.name === selecting.name
    );

    if (alreadyAdded && !isEditing) {
      alert('This course has already been added.');
      return;
    }

    const { theoryCombos: tCombos, labCombos: lCombos } = getTheoryAndLabCombos(selecting);

    const selectedTheoryCombo = selectedTheoryIdx !== null
      ? tCombos.find((c) => c.idx === selectedTheoryIdx)
      : null;
    const selectedLabCombo = selectedLabIdx !== null
      ? lCombos.find((c) => c.idx === selectedLabIdx)
      : null;

    const combinedTheory = Array.from(new Set([
      ...(selectedTheoryCombo?.theory || []),
      ...(selectedLabCombo?.theory || [])
    ]));

    const combinedLab = Array.from(new Set([
      ...(selectedTheoryCombo?.lab || []),
      ...(selectedLabCombo?.lab || [])
    ]));

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
              JSON.stringify((c.theory || []).slice().sort()) === JSON.stringify((editingCourse.theory || []).slice().sort()) &&
              JSON.stringify((c.lab || []).slice().sort()) === JSON.stringify((editingCourse.lab || []).slice().sort()))
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
        {isEditing ? 'Edit Course' : 'Course Selector'}
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
              className={`border px-3 py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500'
                  : 'bg-white border-gray-300 focus:ring-blue-400'
              }`}
            />
            {searchTerm && (
              <button
                className={`text-sm px-3 py-2 rounded-lg transition ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border p-2 rounded-lg">
            {paginatedCourses.map((c) => {
              const isSelected = selectedCourses.some(
                (s) => s.code === c.code && s.name === c.name
              );
              return (
                <button
                  key={(c.code || '') + (c.name || '')}
                  disabled={isSelected && !isEditing}
                  onClick={() => {
                    setSelecting(c);
                    setSelectedTheoryIdx(null);
                    setSelectedLabIdx(null);
                  }}
                  className={`border p-3 rounded-lg text-left transition-all flex flex-col justify-center items-start ${
                    isSelected && !isEditing
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:bg-blue-900/30'
                      : 'bg-white border-gray-200 hover:bg-blue-50'
                  }`}
                >
                  <div className="font-semibold">{c.name}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {c.code}
                  </div>
                </button>
              );
            })}
            {paginatedCourses.length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-500 p-4">
                No courses found.
              </div>
            )}
          </div>

          {filteredCourses.length > coursesPerPage && (
            <div className="flex gap-2 justify-center items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`p-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? currentPage === 1
                      ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'border-gray-700 text-gray-200 hover:bg-gray-700 active:bg-gray-800'
                    : currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                Prev
              </button>
              <span className={`p-2 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                Page {currentPage} / {Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage))}
              </span>
              <button
                disabled={currentPage === Math.ceil(filteredCourses.length / coursesPerPage)}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`p-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? currentPage === Math.ceil(filteredCourses.length / coursesPerPage)
                      ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'border-gray-700 text-gray-200 hover:bg-gray-700 active:bg-gray-800'
                    : currentPage === Math.ceil(filteredCourses.length / coursesPerPage)
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selecting && (
        <div className={`border p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50'}`}>
          <div className={`mb-2 font-semibold ${theme === 'dark' ? 'text-gray-100' : ''}`}>
            {selecting.name} ({selecting.code})
          </div>

          {isEditing && (
            <div className={`mb-2 text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
              Editing mode - modify the slot selection below
            </div>
          )}

          {(() => {
            const { theoryCombos: tCombos, labCombos: lCombos } = getTheoryAndLabCombos(selecting);

            const allNill = (selecting.slotCombos || []).every(
              (combo) =>
                (combo.theory || []).length === 1 &&
                ((combo.theory || [])[0] || '').toUpperCase() === 'NILL' &&
                (combo.lab || []).length === 0
            );

            if (allNill) {
              return (
                <>
                  <div className={`mb-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    This course has no slots (Project/Internship).
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedCourses((prev) => {
                          if (isEditing) {
                            const filtered = prev.filter(
                              (c) =>
                                !(c.code === editingCourse.code &&
                                  c.name === editingCourse.name &&
                                  JSON.stringify((c.theory || []).slice().sort()) === JSON.stringify((editingCourse.theory || []).slice().sort()) &&
                                  JSON.stringify((c.lab || []).slice().sort()) === JSON.stringify((editingCourse.lab || []).slice().sort()))
                            );
                            return [...filtered, {
                              code: selecting.code,
                              name: selecting.name,
                              type: selecting.type,
                              theory: [],
                              lab: [],
                            }];
                          }
                          return [...prev, {
                            code: selecting.code,
                            name: selecting.name,
                            type: selecting.type,
                            theory: [],
                            lab: [],
                          }];
                        });

                        if (isEditing && setEditingCourse) setEditingCourse(null);
                        setSelecting(null);
                        setSelectedTheoryIdx(null);
                        setSelectedLabIdx(null);
                      }}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
                    >
                      {isEditing ? 'Save Changes' : 'Add Course'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 active:bg-gray-800'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }`}
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

                {tCombos.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Theory Slots</div>
                    <div className="flex flex-col gap-2">
                      {tCombos.map((combo) => {
                        const isChecked = selectedTheoryIdx === combo.idx;
                        return (
                          <label
                            key={`t-${combo.idx}`}
                            className={`flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer ${
                              isChecked
                                ? theme === 'dark'
                                  ? 'bg-blue-800 border-blue-700 text-blue-100'
                                  : 'bg-blue-100 border-blue-300'
                                : theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                                  : 'bg-white hover:bg-blue-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="theoryCombo"
                              checked={isChecked}
                              onChange={() => handleTheorySelection(combo.idx)}
                            />
                            <span className="text-sm">
                              Theory: {combo.theory.join('+')}
                              {combo.lab.length > 0 ? ` | Lab: ${combo.lab.join('+')}` : ''}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {lCombos.length > 0 && (
                  <div className="mb-2">
                    <div className="font-semibold mb-1">Lab Slots</div>
                    <div className="flex flex-col gap-2">
                      {lCombos.map((combo) => {
                        const isChecked = selectedLabIdx === combo.idx;
                        return (
                          <label
                            key={`l-${combo.idx}`}
                            className={`flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer ${
                              isChecked
                                ? theme === 'dark'
                                  ? 'bg-blue-800 border-blue-700 text-blue-100'
                                  : 'bg-blue-100 border-blue-300'
                                : theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                                  : 'bg-white hover:bg-blue-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="labCombo"
                              checked={isChecked}
                              onChange={() => handleLabSelection(combo.idx)}
                            />
                            <span className="text-sm">
                              Lab: {combo.lab.join('+')}
                              {combo.theory.length > 0 ? ` | Theory: ${combo.theory.join('+')}` : ''}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    disabled={!canAdd}
                    onClick={handleAdd}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      canAdd
                        ? 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {isEditing ? 'Save Changes' : 'Add Course'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
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
