import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../components/Fileuploader';
import CourseSelector from '../components/CourseSelector';
import SlotGrid from '../components/SlotGrid';
import ClashWarning from '../components/ClashWarning';
import SelectedCourses from '../components/SelectedCourses';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import { parseCourseData } from '../utils/parser';
import { getSlotMappingForSemester } from '../utils/slotMappingUtils';
import { colorConfig } from '../utils/colors';

export default function CourseScheduler({ theme, toggleTheme }) {
  const [courseData, setCourseData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [hasLoadedSelected, setHasLoadedSelected] = useState(false);
  const [defaultTag, setDefaultTag] = useState(null);
  const [defaultReloadSignal, setDefaultReloadSignal] = useState(0);
  const [currentSemester, setCurrentSemester] = useState(() => {
    return localStorage.getItem('currentSemester') || 'win_freshers';
  });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const toastTimerRef = React.useRef(null);

  const showToast = (message, type = 'info', timeout = 3000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      toastTimerRef.current = null;
    }, timeout);
  };

  const loadDefaultTimetable = async (fileName = 'win_freshers_25-26.pdf') => {
    try {
      const response = await fetch(`/course-lists/${fileName}`);
      const blob = await response.blob();
      const defaultFile = new File([blob], fileName, {
        type: 'application/pdf',
      });

      const parsed = await parseCourseData(defaultFile);
      setCourseData(parsed);
      localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
      const tag = response.headers.get('ETag') || response.headers.get('Last-Modified') || response.headers.get('Content-Length');
      if (tag) {
        localStorage.setItem('defaultFileTag', tag);
        setDefaultTag(tag);
      }
      setDefaultReloadSignal(Date.now());
    } catch (error) {
      console.error('Error loading default PDF:', error);
    }
  };

  useEffect(() => {
    const savedParsedData = localStorage.getItem('uploadedCourseData');
    const savedSelected = localStorage.getItem('selectedCourses');

    if (savedParsedData) {
      setCourseData(JSON.parse(savedParsedData));
    } else {
      try {
        const skip = localStorage.getItem('skipDefault');
        if (skip !== '1') {
          loadDefaultTimetable();
        }
      } catch (e) {
        loadDefaultTimetable();
      }
    }

    if (savedSelected) {
      setSelectedCourses(JSON.parse(savedSelected));
    }

    setHasLoadedSelected(true);
  }, []);

  useEffect(() => {
    if (hasLoadedSelected) {
      localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    }
  }, [selectedCourses, hasLoadedSelected]);

  useEffect(() => {
    if (hasLoadedSelected) {
      setSelectedCourses([]);
      localStorage.setItem('currentSemester', currentSemester);
      showToast(`Switched to ${currentSemester.toUpperCase()} semester. Selected courses cleared.`, 'info');
    }
  }, [currentSemester]);

  const handleFile = async (fileOrParsed) => {
    if (fileOrParsed && typeof fileOrParsed === 'object' && 'loadDefault' in fileOrParsed) {
      const val = fileOrParsed.loadDefault;
      if (val == null) {
        setCourseData([]);
        setSelectedCourses([]);
        try { localStorage.removeItem('uploadedCourseData'); } catch (e) {}
        try { localStorage.removeItem('selectedCourses'); } catch (e) {}
        return null;
      }
      try { localStorage.removeItem('skipDefault'); } catch (e) {}
      await loadDefaultTimetable(val);
      return;
    }

    if (fileOrParsed === 'loadDefault') {
      try { localStorage.removeItem('skipDefault'); } catch (e) {}
      await loadDefaultTimetable();
      return;
    }

    if (Array.isArray(fileOrParsed)) {
      setCourseData(fileOrParsed);
      localStorage.setItem('uploadedCourseData', JSON.stringify(fileOrParsed));
      try { localStorage.removeItem('skipDefault'); } catch (e) {}
      return fileOrParsed;
    }

    const parsed = await parseCourseData(fileOrParsed);
    setCourseData(parsed);
    localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
    return parsed;
  };

  const hasClash = () => {
    const slotMapping = getSlotMappingForSemester(currentSemester);
    const occupiedTimes = new Set();
    for (let course of selectedCourses) {
      const allSlots = [...(course.theory || []), ...(course.lab || [])];
      for (let slot of allSlots) {
        const mappings = slotMapping[slot];
        if (mappings) {
          for (let { day, time } of mappings) {
            const key = `${day}-${time}`;
            if (occupiedTimes.has(key)) {
              return true;
            }
            occupiedTimes.add(key);
          }
        }
      }
    }
    return false;
  };

  const getCourseCredits = (course) => {
    if (course.code === 'CAP4001' || course.name === 'Capstone') return 4;
    if (course.code === 'BIC4002' || course.name.includes('Internship') || course.name.includes('Design Project')) return 12;

    const theorySlots = course.theory || [];
    const labSlots = course.lab || [];
    const mainSlots = theorySlots.filter((s) => /^[A-G]\d?$/i.test(s));
    const tSlots = theorySlots.filter((s) => /^T/i.test(s));

    let credits = 0;
    if (mainSlots.length > 0) credits = 2 + tSlots.length;
    else if (tSlots.length > 0) credits = 1;
    if (labSlots.length > 0) credits += 1;
    if (credits === 0) credits = 1;
    if (course.type === 'LO') return 1;
    if (course.type === 'PJT') return 2;

    return credits;
  };

  const getTotalCredits = (courses) =>
    courses.reduce((sum, c) => sum + getCourseCredits(c), 0);

  const groupCourses = (selectedCourses) => {
    const map = new Map();
    for (const c of selectedCourses) {
      const key = `${c.code}__${c.name}`;
      if (!map.has(key)) {
        map.set(key, {
          code: c.code,
          name: c.name,
          type: c.type,
          theory: [],
          lab: [],
        });
      }
      if (c.theory?.length > 0) {
        map.get(key).theory.push(
          ...c.theory.filter((s) => !map.get(key).theory.includes(s))
        );
      }
      if (c.lab?.length > 0) {
        map.get(key).lab.push(
          ...c.lab.filter((s) => !map.get(key).lab.includes(s))
        );
      }
    }
    return Array.from(map.values());
  };

  const pageBg = theme === 'dark' ? colorConfig.background.dark.page : colorConfig.background.light.secondary;
  const pageText = theme === 'dark' ? colorConfig.text.dark.primary : colorConfig.text.light.primary;
  const inputBg = theme === 'dark' ? colorConfig.input.dark.bg : colorConfig.input.light.bg;
  const inputBorder = theme === 'dark' ? colorConfig.input.dark.border : colorConfig.input.light.border;
  const inputFocus = colorConfig.input.dark.focus;
  const alertBg = theme === 'dark' ? colorConfig.alert.info.dark : colorConfig.alert.info.light;

  return (
    <>
      <SEO 
        title="Course Scheduler - Slotify | VIT-AP Timetable Generator"
        description="Upload your course data and create optimized timetables with intelligent clash detection. Select courses, avoid conflicts, and build your perfect VIT-AP schedule."
        keywords="course scheduler, timetable generator, VIT-AP courses, academic planning, schedule optimization, clash detection"
      />
      <div
        className={`min-h-screen theme-transition transition-colors duration-500 ease-in-out ${pageBg} ${pageText}`}
      >
      <div className="p-6 pt-20 max-w-5xl mx-auto">

        <FileUploader
          onExtract={handleFile}
          defaultReloadSignal={defaultReloadSignal}
          theme={theme}
          showToast={showToast}
          onSemesterChange={setCurrentSemester}
          onRemove={() => {
            setCourseData([]);
            setSelectedCourses([]);
            showToast('All uploaded data removed', 'info');
          }}
        />

        <CourseSelector
          courseData={courseData}
          selectedCourses={selectedCourses}
          setSelectedCourses={(courses) => {
            setSelectedCourses(courses);
            setEditingCourse(null);
          }}
          editingCourse={editingCourse}
          setEditingCourse={setEditingCourse}
          theme={theme}
          showToast={showToast}
          currentSemester={currentSemester}
        />

        {hasClash() && <ClashWarning theme={theme} />}

        <SelectedCourses
          groupedCourses={groupCourses(selectedCourses)}
          onRemoveCourse={(course) => {
            setSelectedCourses(
              selectedCourses.filter(
                (c) => !(c.code === course.code && c.name === course.name)
              )
            );
            showToast('Course removed', 'info');
          }}
          onRemoveAll={() => {
            setSelectedCourses([]);
            showToast('All courses removed', 'info');
          }}
          onEditCourse={(course) => {
            setSelectedCourses(
              selectedCourses.filter(
                (c) => !(c.code === course.code && c.name === course.name)
              )
            );
            setEditingCourse(course);
            showToast('Editing course', 'info');
          }}
          getCourseCredits={getCourseCredits}
          theme={theme}
        />

        <Toast message={toast.message} type={toast.type} visible={toast.visible} />

        <div
          className={`mt-4 p-3 rounded-lg border ${alertBg}`}
        >
          <div className="font-bold text-lg">
            Total Credits: {getTotalCredits(groupCourses(selectedCourses))}
          </div>
          <div className="text-sm mt-1">
            Total Courses: {groupCourses(selectedCourses).length}
          </div>
        </div>

        <SlotGrid 
          selectedCourses={selectedCourses} 
          theme={theme} 
          showToast={showToast}
          currentSemester={currentSemester}
        />

      </div>
      </div>
    </>
  );
}
