import React, { useState, useEffect, useRef } from 'react';

export default function FileUploader({ onExtract, onRemove, defaultReloadSignal, theme = 'light' }) {
  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const fileURLRef = useRef('');

  useEffect(() => {
    fileURLRef.current = fileURL;
  }, [fileURL]);

  useEffect(() => {
    const savedData = localStorage.getItem('uploadedCourseData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFileName('Default Timetable.pdf');
      setFileURL('/default1.pdf');
      setIsUploaded(true);
      onExtract(parsedData);
    }

    return () => {
      if (fileURLRef.current && fileURLRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(fileURLRef.current);
      }
    };
  }, []);

  // If the app reloads the default data, update this component's UI
  useEffect(() => {
    if (!defaultReloadSignal) return;
    // update FileUploader to show the default file as uploaded
    setFileName('Default Timetable.pdf');
    setFileURL('/default1.pdf');
    setIsUploaded(true);
  }, [defaultReloadSignal]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
      const url = URL.createObjectURL(file);
      setFileURL(url);
      const parsed = await onExtract(file);
      localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
    }
  };

  const handleRestoreDefault = async () => {
    try {
      localStorage.removeItem('skipDefault');
    } catch (e) {}
    // Ask parent to load default timetable
    if (typeof onExtract === 'function') {
      await onExtract('loadDefault');
      // update UI to reflect default loaded
      setFileName('Default Timetable.pdf');
      setFileURL('/default1.pdf');
      setIsUploaded(true);
    }
  };

  const handleRemove = () => {
  if (fileURL && fileURL.startsWith('blob:')) {
    URL.revokeObjectURL(fileURL);
  }
  setFileName('');
  setFileURL('');
  setIsUploaded(false);
  localStorage.removeItem('uploadedCourseData');
  localStorage.removeItem('selectedCourses');
  // Mark that the user explicitly removed the uploaded/default file so
  // the app doesn't auto-reload the default again on next mount.
  try {
    localStorage.setItem('skipDefault', '1');
  } catch (e) {}

  // Notify parent to clear any in-memory selected data if provided
  if (typeof onRemove === 'function') onRemove();
};


  return (
    <div className={`mb-4 border p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
      <p className={`text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Please upload{' '}
        <span className="font-semibold">ONLY THE COURSE LIST FILE.</span>
      </p>
      <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
            className={`inline-block px-4 py-2 text-white rounded-lg cursor-pointer ${
              theme === 'dark'
                ? 'bg-blue-700 hover:bg-blue-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            📂 Choose File
          </label>
          <button
            type="button"
            onClick={handleRestoreDefault}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Restore Default
          </button>
        </div>
      )}

      {isUploaded && (
        <div className="flex items-center justify-between mt-3">
          <div className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
            ✅ Uploaded:{' '}
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-900'}`}
            >
              {fileName}
            </a>
          </div>
          <button
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              theme === 'dark' 
                ? 'bg-red-900/50 text-red-100 hover:bg-red-900/70' 
                : 'bg-red-200 hover:bg-red-300'
            }`}
            onClick={handleRemove}
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  );
}
