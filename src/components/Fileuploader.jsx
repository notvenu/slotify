import React, { useState, useEffect, useRef } from 'react';

export default function FileUploader({ onExtract, onRemove }) {
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
      setFileURL('/default.pdf');
      setIsUploaded(true);
      onExtract(parsedData);
    }

    return () => {
      if (fileURLRef.current && fileURLRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(fileURLRef.current);
      }
    };
  }, []);

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

  const handleRemove = () => {
    if (fileURL && fileURL.startsWith('blob:')) {
      URL.revokeObjectURL(fileURL);
    }
    setFileName('');
    setFileURL('');
    setIsUploaded(false);
    localStorage.removeItem('uploadedCourseData');
    localStorage.removeItem('selectedCourses');
    onExtract([]);
    onRemove();
  };

  return (
    <div className="mb-4 border p-4 rounded-lg bg-gray-50">
      <p className="text-sm text-gray-700 mb-2 font-medium">
        Please upload{' '}
        <span className="font-semibold">ONLY THE COURSE LIST FILE.</span>
      </p>
      <div className="text-sm text-gray-600 mt-1">
        Supported formats: .xlsx, .xls, .csv, .pdf, .docx
      </div>

      {!isUploaded && (
        <div className="flex items-center space-x-3 mt-3">
          <input
            id="fileInput"
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
          >
            📂 Choose File
          </label>
        </div>
      )}

      {isUploaded && (
        <div className="flex items-center justify-between mt-3">
          <div className="text-green-700 font-medium">
            ✅ Uploaded:{' '}
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700 hover:text-blue-900"
            >
              {fileName}
            </a>
          </div>
          <button
            className="px-4 py-2 bg-red-200 rounded-lg cursor-pointer hover:bg-red-300"
            onClick={handleRemove}
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  );
}
