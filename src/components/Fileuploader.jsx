import React, { useState, useEffect, useRef } from 'react';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function FileUploader({ onExtract, onRemove, defaultReloadSignal, theme = 'light', showToast, onSemesterChange }) {
  const [semester, setSemester] = useState(() => {
    return localStorage.getItem('currentSemester') || 'win_freshers';
  });
  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [hasPublicFile, setHasPublicFile] = useState(false);
  const fileURLRef = useRef('');
  const defaultFileNameRef = useRef('');
  const [expanded, setExpanded] = useState(false);

  const semesters = [
    { value: 'win_freshers', label: 'Winter Semester Freshers' },
    { value: 'win', label: 'Winter Semester' },
    { value: 'fall', label: 'Fall Semester' },
    { value: 'fall_freshers', label: 'Fall Semester Freshers' },
    { value: 'summ1', label: 'Short Summer-1 Semester' },
    { value: 'summ2', label: 'Short Summer-2 Semester' },
    { value: 'long-summ', label: 'Long Summer Semester' },
  ];

  const getFileNameFromSelection = (selectedSemester) => {
    return `${selectedSemester}.pdf`;
  };

  useEffect(() => {
    fileURLRef.current = fileURL;
  }, [fileURL]);

  useEffect(() => {
    const checkPublicFile = async () => {
      try {
        const candidates = [];
        const currentYear = '25-26';
        candidates.push(`${semester}_${currentYear}.pdf`);
        candidates.push(`${semester}.pdf`);
        
        if (semester.includes('freshers')) {
          const alt = semester.replace('freshers', 'fresher');
          candidates.push(`${alt}_${currentYear}.pdf`);
          candidates.push(`${alt}.pdf`);
        }
        if (semester === 'win') {
          candidates.push(`winter_${currentYear}.pdf`);
          candidates.push(`win_${currentYear}.pdf`);
          candidates.push(`winter.pdf`);
          candidates.push(`win.pdf`);
        }
        if (semester === 'fall') {
          candidates.push(`fall_${currentYear}.pdf`);
          candidates.push(`fall.pdf`);
        }

        let found = '';
        for (const cand of candidates) {
          try {
            const resp = await fetch(`/course-lists/${cand}`, { method: 'HEAD' });
            if (!resp.ok) continue;
            const ct = resp.headers.get('content-type') || '';
            if (ct.toLowerCase().includes('pdf')) {
              found = cand;
              break;
            }
            if (!ct) {
              try {
                const getResp = await fetch(`/course-lists/${cand}`, { method: 'GET' });
                const getCt = getResp.headers.get('content-type') || '';
                if (getResp.ok && getCt.toLowerCase().includes('pdf')) {
                  found = cand;
                  break;
                }
              } catch (e) {
              }
            }
          } catch (e) {
          }
        }

        if (found) {
          setHasPublicFile(true);
          setFileName(found);
          defaultFileNameRef.current = found;
          if (typeof onExtract === 'function') {
            setTimeout(async () => {
              if (defaultFileNameRef.current !== found) return;
              try {
                if (typeof showToast === 'function') showToast(`Loading default... `, 'info');
                await onExtract({ loadDefault: found });
                if (defaultFileNameRef.current === found) {
                  setFileURL(`/course-lists/${found}`);
                  setIsUploaded(true);
                  if (typeof showToast === 'function') showToast(`Default loaded`, 'success');
                }
              } catch (e) {
                if (typeof showToast === 'function') showToast('Failed to load default', 'error');
              }
            }, 50);
          }
        } else {
          setHasPublicFile(false);
          defaultFileNameRef.current = '';
          setFileName('');
          setFileURL('');
          setIsUploaded(false);
          if (typeof onExtract === 'function') {
            try { onExtract({ loadDefault: null }); } catch (e) {}
          }
          if (typeof showToast === 'function') showToast('No default available for this selection', 'info');
        }
      } catch (e) {
        setHasPublicFile(false);
        defaultFileNameRef.current = '';
      }
    };

    setIsUploaded(false);
    setFileName('');
    setFileURL('');
    defaultFileNameRef.current = '';

    checkPublicFile();
  }, [semester]);

  useEffect(() => {
    if (typeof onSemesterChange === 'function') {
      onSemesterChange(semester);
    }
    localStorage.setItem('currentSemester', semester);
  }, [semester, onSemesterChange]);

  useEffect(() => {
    const savedData = localStorage.getItem('uploadedCourseData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFileName('Uploaded Timetable.pdf');
      setFileURL('blob:uploaded');
      setIsUploaded(true);
      onExtract(parsedData);
    }

    return () => {
      if (fileURLRef.current && fileURLRef.current.startsWith('blob:') && fileURLRef.current !== 'blob:uploaded') {
        URL.revokeObjectURL(fileURLRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!defaultReloadSignal) return;
    const fn = defaultFileNameRef.current || getFileNameFromSelection(semester);
    if (fn) {
      setFileName(fn);
      setFileURL(`/course-lists/${fn}`);
      setIsUploaded(true);
      if (typeof showToast === 'function') showToast(`Default loaded`, 'success');
    }
  }, [defaultReloadSignal]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
      const url = URL.createObjectURL(file);
      setFileURL(url);
      if (typeof showToast === 'function') showToast('Uploading file...', 'info');
      try {
        const parsed = await onExtract(file);
        localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
        if (typeof showToast === 'function') showToast('File uploaded', 'success');
      } catch (err) {
        if (typeof showToast === 'function') showToast('Failed to parse uploaded file', 'error');
      }
    }
  };

  const handleRestoreDefault = async () => {
    try {
      localStorage.removeItem('skipDefault');
    } catch (e) {}
    if (typeof onExtract === 'function') {
      const fn = defaultFileNameRef.current || getFileNameFromSelection(semester);
      if (fn) {
        if (typeof showToast === 'function') showToast(`Loading default ${fn}...`, 'info');
        try {
          await onExtract({ loadDefault: fn });
          setFileName(fn);
          setFileURL(`/course-lists/${fn}`);
          setIsUploaded(true);
          if (typeof showToast === 'function') showToast(`Default loaded: ${fn}`, 'success');
        } catch (err) {
          if (typeof showToast === 'function') showToast('Failed to load default', 'error');
        }
      }
    }
  };

  const handleRemove = () => {
    if (fileURL && fileURL.startsWith('blob:') && fileURL !== 'blob:uploaded') {
      URL.revokeObjectURL(fileURL);
    }
    setFileName('');
    setFileURL('');
    setIsUploaded(false);
    localStorage.removeItem('uploadedCourseData');
    localStorage.removeItem('selectedCourses');
    try {
      localStorage.setItem('skipDefault', '1');
    } catch (e) {}

    if (typeof showToast === 'function') showToast('File removed', 'info');

    if (typeof onRemove === 'function') onRemove();
  };

  const bgTheme = getThemeColor(theme, colorConfig.background);
  const textTheme = getThemeColor(theme, colorConfig.text);
  const inputTheme = getThemeColor(theme, colorConfig.input);

  const headerColors = `${bgTheme.card} ${colorConfig.border[theme]} ${textTheme.primary}`;
  const containerColors = `${bgTheme.card} ${colorConfig.border[theme]} ${textTheme.primary}`;
  const labelColors = textTheme.secondary || '';
  const secondaryTextColors = textTheme.muted || '';

  const selectColors = `${inputTheme.bg} ${inputTheme.border} ${inputTheme.text}`;

  const primaryButtonColors = colorConfig.button.primary[theme === 'dark' ? 'dark' : 'light'];
  const secondaryButtonColors = colorConfig.button.secondary[theme === 'dark' ? 'dark' : 'light'];
  const dangerButtonColors = colorConfig.button.danger[theme === 'dark' ? 'dark' : 'light'];

  const successTextColors = getThemeColor(theme, colorConfig.alert.success).text || '';
  const fileNameTextColors = textTheme.primary || '';

  return (
    <div>
      <div
        onClick={() => setExpanded((s) => !s)}
        className={`mb-2 p-3 rounded-lg border flex items-center justify-between cursor-pointer select-none ${headerColors}`}
      >
        <div className="flex items-center gap-3">
          <div className="font-semibold">Upload / Defaults</div>
          <div className={`text-sm ${secondaryTextColors}`}>{semesters.find(s => s.value === semester)?.label}</div>
        </div>
        <div className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : 'rotate-0'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className={`mb-4 border rounded-lg overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`p-4 ${containerColors}`}>
          <p className={`text-sm mb-4 font-medium ${labelColors}`}>
            Select your semester, then upload the course list file.
          </p>

          {/* Semester Selector */}
          <div className="mb-4">
            <label className={`block text-sm font-semibold mb-2 ${labelColors}`}>
              Select the Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className={`w-full p-2 border rounded-lg ${selectColors}`}
            >
              {semesters.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <p className={`text-sm mb-2 font-medium ${labelColors}`}>
            Please upload{' '}
            <span className="font-semibold">ONLY THE COURSE LIST FILE.</span>
          </p>
          <div className={`text-sm mt-1 ${secondaryTextColors}`}>
            Supported formats: .xlsx, .xls, .csv, .pdf, .docx
          </div>

          {!isUploaded && (
            <div className="flex items-center space-x-3 mt-3">
              {/* Hidden input */}
              <input
                id="fileInput"
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
              {/* Label acting as button */}
              <label
                htmlFor="fileInput"
                className={`inline-block px-4 py-2 text-white rounded-lg cursor-pointer font-medium ${primaryButtonColors}`}
              >
                📂 Choose File
              </label>
              {hasPublicFile && (
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${secondaryButtonColors}`}
                >
                  Load Default
                </button>
              )}
            </div>
          )}

          {isUploaded && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
              <div className={`font-medium ${successTextColors}`}>
                ✅ Loaded:{' '}
                <span className={fileNameTextColors}>
                  {fileName}
                </span>
              </div>
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${dangerButtonColors}`}
                onClick={handleRemove}
              >
                Remove File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
