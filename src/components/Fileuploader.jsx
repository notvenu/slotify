import React, { useState, useEffect } from 'react';

export default function FileUploader({ onExtract, onRemove }) {
  const [fileName, setFileName] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('uploadedCourseData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFileName('Default Timetable.pdf');
      setIsUploaded(true);
      onExtract(parsedData);
    }
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
      const parsed = await onExtract(file);
      localStorage.setItem('uploadedCourseData', JSON.stringify(parsed));
    }
  };

  const handleRemove = () => {
    setFileName('');
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
        <div className="mt-2">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Browse...
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {isUploaded && (
        <div className="flex items-center justify-between mt-2">
          <div className="text-green-700 font-medium">
            ✅ Uploaded: {fileName}
          </div>
          <button
            className="px-2 py-1 bg-red-200 rounded-lg cursor-pointer hover:bg-red-300"
            onClick={handleRemove}
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  );
}
