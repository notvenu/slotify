import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const savedParsedData = localStorage.getItem('uploadedCourseData');
    const savedSelected = localStorage.getItem('selectedCourses');
    const savedNumSubjects = localStorage.getItem('numSubjects');

    if (savedParsedData) {
      setCourseData(JSON.parse(savedParsedData));
    } else {
      (async () => {
        try {
          const response = await fetch('/default.pdf');
          const blob = await response.blob();
          const defaultFile = new File([blob], 'Default Timetable.pdf', {
            type: 'application/pdf',
          });

          const parsed = await parseCourseData(defaultFile);
          setCourseData(parsed);
          localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
        } catch (error) {
          console.error('Error loading default PDF:', error);
        }
      })();
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

  useEffect(() => {
    if (hasLoadedSelected) {
      localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    }
  }, [selectedCourses, hasLoadedSelected]);

  useEffect(() => {
    localStorage.setItem('numSubjects', JSON.stringify(numSubjects));
  }, [numSubjects]);

  const handleFile = async (fileOrParsed) => {
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
    if (course.code === 'BIC4002') return 12;

    const theorySlots = course.theory || [];
    const labSlots = course.lab || [];
    const mainSlots = theorySlots.filter((s) => /^[A-F]\d?$/i.test(s));
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">SLOTIFY</h1>

      <FileUploader onExtract={handleFile} />

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
      />

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="font-bold text-lg text-blue-800">
          Total Credits: {getTotalCredits(groupCourses(selectedCourses))}
        </div>
        <div className="text-sm text-blue-600 mt-1">
          Total Courses: {groupCourses(selectedCourses).length}
        </div>
      </div>

      <SlotGrid selectedCourses={selectedCourses} />

      <footer className="w-full mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 pb-4">
        <Footer />
      </footer>
    </div>
  );
}
