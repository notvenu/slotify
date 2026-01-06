import React, { useState, useMemo, useEffect } from 'react';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function CourseSelector({
  courseData,
  selectedCourses,
  setSelectedCourses,
  maxSubjects,
  editingCourse,
  setEditingCourse,
  theme = 'light',
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selecting, setSelecting] = useState(null);
  const [selectedTheoryIdx, setSelectedTheoryIdx] = useState(null);
  const [selectedLabIdx, setSelectedLabIdx] = useState(null);

  const coursesPerPage = 10;

  // Centralized theme colors using colorConfig
  const inputTheme = getThemeColor(theme, colorConfig.input);
  const inputColors = `${inputTheme.bg} ${inputTheme.border} ${inputTheme.text} ${inputTheme.focus}`;

  const btnSecondary = getThemeColor(theme, colorConfig.button.secondary);
  const buttonClearColors = `${btnSecondary}`;

  const courseButtonSelectedColors = 'opacity-50 cursor-not-allowed';
  const courseBtnBg = getThemeColor(theme, colorConfig.background);
  const courseHoverBg = getThemeColor(theme, colorConfig.nav).hoverBg || '';
  const courseButtonNormalColors = `${courseBtnBg.card} ${getThemeColor(theme, colorConfig.border)} ${courseHoverBg}`;

  const pageBtnDisabled = getThemeColor(theme, colorConfig.border);
  const pageButtonDisabledColors = `${pageBtnDisabled} ${getThemeColor(theme, colorConfig.text).muted || ''} cursor-not-allowed`;

  const pageButtonActiveColors = `${getThemeColor(theme, colorConfig.border)} ${getThemeColor(theme, colorConfig.text).secondary || ''} ${getThemeColor(theme, colorConfig.nav).hoverBg || ''} ${getThemeColor(theme, colorConfig.nav).activeBg || ''}`;

  const pageNumberColors = getThemeColor(theme, colorConfig.text).secondary || '';

  const selectionPanelColors = `${getThemeColor(theme, colorConfig.background).card} ${getThemeColor(theme, colorConfig.background).secondary || ''}`;

  const editingModeTextColors = getThemeColor(theme, colorConfig.text).secondary || '';

  const noSlotsTextColors = getThemeColor(theme, colorConfig.text).muted || '';

  const comboCheckboxSelectedColors = getThemeColor(theme, colorConfig.alert.info) || '';

  const comboCheckboxNormalColors = `${getThemeColor(theme, colorConfig.background).card} ${getThemeColor(theme, colorConfig.border)} ${getThemeColor(theme, colorConfig.text).primary} ${getThemeColor(theme, colorConfig.nav).hoverBg || ''}`;

  const addButtonEnabledColors = colorConfig.button.primary[theme === 'dark' ? 'dark' : 'light'];
  const addButtonDisabledColors = '';

  const cancelButtonColors = btnSecondary;

  const courseNameTextColors = getThemeColor(theme, colorConfig.text).primary || '';
  const courseCodeTextColors = getThemeColor(theme, colorConfig.text).secondary || '';

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

    // Prevent adding beyond max when not editing
    if (!isEditing && selectedCourses.length >= maxSubjects) {
      if (typeof showToast === 'function') showToast(`Maximum of ${maxSubjects} subjects reached. Remove a course before adding another.`, 'error');
      return;
    }

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
    if (typeof showToast === 'function') showToast(isEditing ? 'Course updated' : 'Course added', 'success');
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
              className={`px-3 py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${inputColors}`}
            />
            {searchTerm && (
              <button
                className={`text-sm px-3 py-2 rounded-lg transition ${buttonClearColors}`}
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2 rounded-lg border ${getThemeColor(theme, colorConfig.border)}`}>
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
                      ? courseButtonSelectedColors
                      : courseButtonNormalColors
                  }`}
                >
                  <div className={`font-semibold ${courseNameTextColors}`}>{c.name}</div>
                  <div className={`text-sm ${courseCodeTextColors}`}>
                    {c.code}
                  </div>
                </button>
              );
            })}
            {paginatedCourses.length === 0 && (
              <div className={`col-span-full text-center text-sm p-4 ${noSlotsTextColors}`}>
                No courses found.
              </div>
            )}
          </div>

          {filteredCourses.length > coursesPerPage && (
            <div className="flex gap-2 justify-center items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`p-2 rounded-lg transition-colors ${getThemeColor(theme, colorConfig.border)} ${
                  currentPage === 1 ? pageButtonDisabledColors : pageButtonActiveColors
                }`}
              >
                Prev
              </button>
              <span className={`p-2 ${pageNumberColors}`}>
                Page {currentPage} / {Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage))}
              </span>
              <button
                disabled={currentPage === Math.ceil(filteredCourses.length / coursesPerPage)}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`p-2 rounded-lg transition-colors ${getThemeColor(theme, colorConfig.border)} ${
                  currentPage === Math.ceil(filteredCourses.length / coursesPerPage)
                    ? pageButtonDisabledColors
                    : pageButtonActiveColors
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selecting && (
        <div className={`p-4 rounded-lg ${getThemeColor(theme, colorConfig.border)} ${selectionPanelColors}`}>
          <div className={`mb-2 font-semibold ${courseNameTextColors}`}>
            {selecting.name} ({selecting.code})
          </div>

          {isEditing && (
            <div className={`mb-2 text-sm font-medium ${editingModeTextColors}`}>
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
                  <div className={`mb-2 text-sm ${noSlotsTextColors}`}>
                    This course has no slots (Project/Internship).
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        // Prevent adding beyond max when not editing
                        if (!isEditing && selectedCourses.length >= maxSubjects) {
                          if (typeof showToast === 'function') showToast(`Maximum of ${maxSubjects} subjects reached. Remove a course before adding another.`, 'error');
                          return;
                        }

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
                        if (typeof showToast === 'function') showToast(isEditing ? 'Course updated' : 'Course added', 'success');
                      }}
                      className={`px-3 py-2 rounded-lg cursor-pointer ${addButtonEnabledColors}`}
                    >
                      {isEditing ? 'Save Changes' : 'Add Course'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${cancelButtonColors}`}
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
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${getThemeColor(theme, colorConfig.border)} ${
                              isChecked ? comboCheckboxSelectedColors : comboCheckboxNormalColors
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
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${getThemeColor(theme, colorConfig.border)} ${
                              isChecked ? comboCheckboxSelectedColors : comboCheckboxNormalColors
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
                      canAdd ? addButtonEnabledColors : addButtonDisabledColors
                    }`}
                  >
                    {isEditing ? 'Save Changes' : 'Add Course'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg font-medium transition ${cancelButtonColors}`}
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
