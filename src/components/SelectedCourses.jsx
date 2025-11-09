import React, { useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SelectedCourses({
  groupedCourses,
  onRemoveCourse,
  onRemoveMultiple,
  onRemoveAll,
  onEditCourse,
  getCourseCredits,
  theme = 'light'
}) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSelection = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isSelected = (idx) => selectedIndices.includes(idx);
  const selectionMode = selectedIndices.length > 0;

  const generateExportData = () => {
    let totalCredits = 0;
    const rows = groupedCourses.map((course, idx) => {
      const credits = getCourseCredits(course);
      totalCredits += credits;
      return {
        'S.No.': idx + 1,
        Name: course.name,
        Code: course.code,
        Type: course.type,
        'Theory Slots': course.theory.length ? course.theory.join(' + ') : 'None',
        'Lab Slots': course.lab.length ? course.lab.join(' + ') : 'None',
        Credits: credits,
      };
    });
    return { rows, totalCredits };
  };

  const handleDownloadExcel = () => {
    const { rows, totalCredits } = generateExportData();

    rows.push({
      'S.No.': '',
      Name: '',
      Code: '',
      Type: '',
      'Theory Slots': '',
      'Lab Slots': 'Total Credits',
      Credits: totalCredits,
    });

    const headers = Object.keys(rows[0]);
    const data = [
      headers,
      ...rows.map((row) => headers.map((h) => row[h])),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const title = 'Selected Courses';
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });

    worksheet['!merges'] = [{
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 }
    }];

    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 'A3' });
    worksheet['!cols'] = headers.map(() => ({ wch: 20 }));

    const range = XLSX.utils.decode_range(worksheet['!ref']);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (!cell) continue;

        if (R === 0) {
          cell.s = {
            font: { sz: 14, bold: true },
            alignment: { horizontal: 'center', vertical: 'center' },
          };
        } else if (R === 2) {
          cell.s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' },
            },
          };
        } else {
          cell.s = {
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' },
            },
          };
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedCourses');
    XLSX.writeFile(workbook, `SelectedCourses-${Date.now()}.xlsx`);
  };

  const handleDownloadPDF = () => {
    const { rows, totalCredits } = generateExportData();
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = 'Selected Courses';
    const textWidth = doc.getTextWidth(titleText);
    doc.text(titleText, (pageWidth - textWidth) / 2, 20);

    const headers = Object.keys(rows[0]);
    const tableData = rows.map((row) => headers.map((key) => row[key]));

    const emptyRow = headers.map((h, i) =>
      i === headers.length - 2 ? 'Total Credits' : i === headers.length - 1 ? String(totalCredits) : ''
    );
    tableData.push(emptyRow);

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: tableData,
      styles: {
        fontSize: 9,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
      },
      tableLineWidth: 0.2,
      tableLineColor: [0, 0, 0],
    });

    doc.save(`SelectedCourses-${Date.now()}.pdf`);
  };

  const filteredCourses = groupedCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-6">
      <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        Selected Courses
      </h2>

      {groupedCourses.length > 0 && (
      <div className="mb-4 flex flex-wrap justify-between gap-2 items-center">
        {/* Left: Search */}
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search by name or code..."
            className={`border px-3 py-2 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500/50' 
                : 'bg-white border-gray-300 focus:ring-blue-500/30'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 active:bg-gray-800'
                  : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
              }`}
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {selectionMode && (
            <button
              className={`px-3 py-2 text-white rounded-lg cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'bg-red-800 hover:bg-red-700 active:bg-red-900'
                  : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
              }`}
              onClick={() => {
                onRemoveMultiple(selectedIndices);
                setSelectedIndices([]);
              }}
            >
              Remove Selected
            </button>
          )}
          <button
            className={`px-3 py-2 text-white rounded-lg cursor-pointer transition-colors ${
              theme === 'dark'
                ? 'bg-red-800 hover:bg-red-700 active:bg-red-900'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
            onClick={onRemoveAll}
          >
            Remove All
          </button>
          <button
            className={`px-3 py-2 text-white rounded-lg cursor-pointer transition-colors ${
              theme === 'dark'
                ? 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700'
            }`}
            onClick={handleDownloadExcel}
          >
            Download Excel
          </button>
          <button
            className={`px-3 py-2 text-white rounded-lg cursor-pointer transition-colors ${
              theme === 'dark'
                ? 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
            }`}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    )}


      <div className="space-y-2">
        {filteredCourses.length === 0 && (
          <div className="text-gray-500">No courses found.</div>
        )}

        {filteredCourses.map((course, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row md:items-center gap-4 border p-4 rounded-lg transition-colors ${
              theme === 'dark'
                ? isSelected(idx)
                  ? 'bg-amber-900/20 border-amber-700/50'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : isSelected(idx)
                ? 'bg-amber-50 border-amber-200'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            } ${theme === 'dark' ? 'text-gray-100' : ''}`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={isSelected(idx)}
                onChange={() => toggleSelection(idx)}
                className="cursor-pointer w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="space-y-1">
                <div className="font-semibold text-lg">{course.name}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {course.code} ({course.type})
                </div>
                <div className="text-sm">
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Theory Slots:</span>{' '}
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {course.theory.length ? course.theory.join(' + ') : 'None'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Lab Slots:</span>{' '}
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {course.lab.length ? course.lab.join(' + ') : 'None'}
                  </span>
                </div>
                <div className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Credits: {getCourseCredits(course)}
                </div>
              </div>
            </div>
            {!selectionMode && (
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'bg-amber-700 text-amber-50 hover:bg-amber-600 active:bg-amber-800'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200 active:bg-amber-300'
                  }`}
                  onClick={() => onEditCourse(course)}
                >
                  Edit
                </button>
                <button
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'bg-red-800/50 text-red-100 hover:bg-red-700/50 active:bg-red-900/50'
                      : 'bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300'
                  }`}
                  onClick={() => onRemoveCourse(course)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
