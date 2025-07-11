import React, { useState, useEffect } from "react";

export default function FileUploader({ onExtract, onRemove }) {
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
  const savedData = localStorage.getItem("uploadedCourseData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    setFileName("Default Timetable.pdf");
    setIsUploaded(true);
    onExtract(parsedData); // Pass parsed data, not file
  }
}, [onExtract]);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
      const parsed = await onExtract(file);
      localStorage.setItem("uploadedCourseData", JSON.stringify(parsed));
    }
  };

  const handleRemove = () => {
    setFileName("");
    setIsUploaded(false);
    localStorage.removeItem("uploadedCourseData");
    localStorage.removeItem("selectedCourses");
    onExtract([]);  // Clear parsed data
    onRemove();     // Clear selectedCourses
  };

  return (
    <div className="mb-4 border p-4 rounded bg-gray-50">
      <p className="text-sm text-gray-700 mb-2 font-medium">
        Please upload <span className="font-semibold">ONLY THE COURSE LIST FILE. </span> <p className="text-sm text-gray-600 mt-1">
        Supported formats: .xlsx, .xls, .csv, .pdf, .docx</p>
      
      </p>
      {!isUploaded && (
        <input
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="mb-2"
        />
      )}
      {isUploaded && (
        <div className="flex items-center justify-between">
          <div className="text-green-700 font-medium">
            ✅ Uploaded: {fileName}
          </div>
          <button
            className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
            onClick={handleRemove}
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  );
}
