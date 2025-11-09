import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import FileUploader from './components/Fileuploader';
import CourseSelector from './components/CourseSelector';
import SlotGrid from './components/SlotGrid';
import ClashWarning from './components/ClashWarning';
import SelectedCourses from './components/SelectedCourses';
import Footer from './components/Footer';
import slotMapping from './data/slotMapping';
import { parseCourseData } from './utils/parser';

export default function App() {
  const [courseData, setCourseData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [numSubjects, setNumSubjects] = useState(5);
  const [numSubjectsInput, setNumSubjectsInput] = useState("5");
  const [editingCourse, setEditingCourse] = useState(null);
  const [hasLoadedSelected, setHasLoadedSelected] = useState(false);
  const [theme, setTheme] = useState('light');
  const [defaultTag, setDefaultTag] = useState(null);

  // Helper to load the default PDF
  const [defaultReloadSignal, setDefaultReloadSignal] = useState(0);

  const loadDefaultTimetable = async () => {
    try {
      const response = await fetch('/default1.pdf');
      const blob = await response.blob();
      const defaultFile = new File([blob], 'Default Timetable.pdf', {
        type: 'application/pdf',
      });

      const parsed = await parseCourseData(defaultFile);
      setCourseData(parsed);
      localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
      // save tag/last-modified for change detection
      const tag = response.headers.get('ETag') || response.headers.get('Last-Modified') || response.headers.get('Content-Length');
      if (tag) {
        try {
          localStorage.setItem('defaultFileTag', tag);
        } catch (e) {}
        setDefaultTag(tag);
      }
      // signal to children that default data was reloaded
      setDefaultReloadSignal(Date.now());
    } catch (error) {
      console.error('Error loading default PDF:', error);
    }
  };

  useEffect(() => {
    // initialize theme from localStorage
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // ignore
    }

    const savedParsedData = localStorage.getItem('uploadedCourseData');
    const savedSelected = localStorage.getItem('selectedCourses');
    const savedNumSubjects = localStorage.getItem('numSubjects');

    if (savedParsedData) {
      setCourseData(JSON.parse(savedParsedData));
    } else {
      loadDefaultTimetable();
    }

    if (savedSelected) {
      setSelectedCourses(JSON.parse(savedSelected));
    }

    if (savedNumSubjects) {
      try {
        const parsed = JSON.parse(savedNumSubjects);
        if (typeof parsed === 'number' && !isNaN(parsed)) {
          setNumSubjects(parsed);
          setNumSubjectsInput(parsed.toString());
        } else {
          setNumSubjects(5);
          setNumSubjectsInput("5");
        }
      } catch (e) {
        console.error('Invalid numSubjects value in localStorage:', savedNumSubjects);
        setNumSubjects(5);
        setNumSubjectsInput("5");
      }
    }

    setHasLoadedSelected(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // automatic default file change detection: check HEAD for ETag/Last-Modified
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const resp = await fetch('/default1.pdf', { method: 'HEAD' });
        const tag = resp.headers.get('ETag') || resp.headers.get('Last-Modified') || resp.headers.get('Content-Length');
        const stored = localStorage.getItem('defaultFileTag');
        if (tag && tag !== stored) {
          // If the default file changed, reload it and overwrite stored parsed data
          await loadDefaultTimetable();
        }
        if (tag && mounted) {
          setDefaultTag(tag);
          try { localStorage.setItem('defaultFileTag', tag); } catch (e) {}
        }
      } catch (e) {
        // ignore network errors
      }
    };

    // run once immediately and then poll every 60s
    check();
    const id = setInterval(check, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (hasLoadedSelected) {
      localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    }
  }, [selectedCourses, hasLoadedSelected]);

  useEffect(() => {
    localStorage.setItem('numSubjects', JSON.stringify(numSubjects));
  }, [numSubjects]);

  const handleFile = async (fileOrParsed) => {
    if (fileOrParsed === 'loadDefault') {
      await loadDefaultTimetable();
      return;
    }

    if (Array.isArray(fileOrParsed)) {
      setCourseData(fileOrParsed);
      localStorage.setItem('uploadedCourseData', JSON.stringify(fileOrParsed));
      return fileOrParsed;
    }

    const parsed = await parseCourseData(fileOrParsed);
    setCourseData(parsed);
    localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
    return parsed;
  };

  const hasClash = () => {
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
    if (course.code === 'BIC4002' || (course.name === 'Industrial Intership' || course.name === 'Senior Design Project')) return 12;

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

  return (
    <>
      <Analytics/>
  <div className={`${theme === 'dark' ? 'theme-dark min-h-screen bg-gray-900 text-gray-100' : 'min-h-screen bg-white text-gray-900'}`}>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">SLOTIFY</h1>
          <div>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-100 dark:bg-gray-800 hover:opacity-90 "
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>

  <FileUploader onExtract={handleFile} defaultReloadSignal={defaultReloadSignal} theme={theme} />

        <div className="my-4">
          <label className="font-medium mr-2">Number of Subjects:</label>
          <input
            type="number"
            className="border p-1 w-16 rounded-lg"
            value={numSubjectsInput}
            onChange={(e) => {
              const val = e.target.value;
              setNumSubjectsInput(val);
              const parsed = parseInt(val, 10);
              if (!isNaN(parsed)) {
                setNumSubjects(parsed);
              }
            }}
            onBlur={() => {
              if (numSubjectsInput.trim() === "") {
                setNumSubjects(5);
                setNumSubjectsInput("5");
              }
            }}
          />
        </div>

        <CourseSelector
          courseData={courseData}
          selectedCourses={selectedCourses}
          setSelectedCourses={(courses) => {
            setSelectedCourses(courses);
            setEditingCourse(null);
          }}
          maxSubjects={numSubjects}
          editingCourse={editingCourse}
          setEditingCourse={setEditingCourse}
          theme={theme}
        />

        {hasClash() && <ClashWarning />}

        <SelectedCourses
          groupedCourses={groupCourses(selectedCourses)}
          onRemoveCourse={(course) =>
            setSelectedCourses(
              selectedCourses.filter(
                (c) => !(c.code === course.code && c.name === course.name)
              )
            )
          }
          onRemoveMultiple={(indices) => {
            const grouped = groupCourses(selectedCourses);
            const toRemove = indices.map((i) => grouped[i]);
            setSelectedCourses((prev) =>
              prev.filter(
                (c) =>
                  !toRemove.some((r) => c.code === r.code && c.name === r.name)
              )
            );
          }}
          onRemoveAll={() => setSelectedCourses([])}
          onEditCourse={(course) => {
            setSelectedCourses(
              selectedCourses.filter(
                (c) => !(c.code === course.code && c.name === course.name)
              )
            );
            setEditingCourse(course);
          }}
          getCourseCredits={getCourseCredits}
          theme={theme}
        />

        <div className={`${theme === 'dark' ? 'bg-blue-900/20 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'} mt-4 p-3 rounded-lg`}>
          <div className="font-bold text-lg">
            Total Credits: {getTotalCredits(groupCourses(selectedCourses))}
          </div>
          <div className="text-sm mt-1">
            Total Courses: {groupCourses(selectedCourses).length}
          </div>
        </div>

        <SlotGrid selectedCourses={selectedCourses} theme={theme} />

        <footer className="w-full mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 pb-4">
          <Footer />
        </footer>
      </div>
      </div>
    </>
  );
}
