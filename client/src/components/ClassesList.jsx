import React, { useState, useEffect } from 'react';
import { studentsAPI, gradesAPI } from '../services/api.js';

const CLASSES = ['10A1', '10A2', '10A3', '10A4', '10A5', '10A6', '10A7', '10A8', '10A9', '10A10',
                 '11A1', '11A2', '11A3', '11A4', '11A5', '11A6', '11A7', '11A8', '11A9', '11A10',
                 '12A1', '12A2', '12A3', '12A4', '12A5', '12A6', '12A7', '12A8', '12A9', '12A10'];

const SUBJECTS = [
  { key: 'Van', label: 'Văn' },
  { key: 'Toan', label: 'Toán' },
  { key: 'TiengAnh', label: 'Tiếng Anh' },
  { key: 'Hoa', label: 'Hóa' },
  { key: 'Su', label: 'Sử' },
  { key: 'Dia', label: 'Địa' },
  { key: 'VatLy', label: 'Vật Lý' },
  { key: 'TheDuc', label: 'Thể Dục' }
];

export default function ClassesList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedClass, setExpandedClass] = useState(null);

  useEffect(() => {
    loadClassesData();
  }, []);

  const loadClassesData = async () => {
    try {
      setLoading(true);
      const classesData = [];
      
      for (const className of CLASSES) {
        const response = await studentsAPI.getAll(className, '');
        
        // Lấy grades cho tất cả học sinh
        const studentsWithGrades = await Promise.all(
          response.data.map(async (student) => {
            try {
              const gradesRes = await gradesAPI.getStudentGrades(student._id);
              return {
                ...student,
                grades: gradesRes.data.grades || {}
              };
            } catch (err) {
              console.warn(`Failed to get grades for student ${student.maSv}:`, err?.response?.status);
              return {
                ...student,
                grades: {}
              };
            }
          })
        );
        
        classesData.push({
          name: className,
          students: studentsWithGrades
        });
      }
      
      setClasses(classesData);
      setError('');
    } catch (err) {
      setError('Failed to load classes data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (className) => {
    if (expandedClass === className) {
      setExpandedClass(null);
    } else {
      setExpandedClass(className);
    }
  };

  const handlePrint = (className) => {
    const classData = classes.find(c => c.name === className);
    const printContent = `
      <html>
        <head>
          <title>Danh Sách Lớp ${className}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 15px;
              line-height: 1.4;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              color: #0b6ef6;
              font-size: 20px;
            }
            .header p {
              margin: 3px 0;
              color: #666;
              font-size: 11px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th {
              background-color: #0b6ef6;
              color: white;
              padding: 8px;
              text-align: center;
              border: 1px solid #0b6ef6;
              font-weight: bold;
              font-size: 11px;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: center;
            }
            tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: right;
              color: #666;
              font-size: 10px;
            }
            .no-students {
              text-align: center;
              padding: 40px;
              color: #999;
              font-size: 16px;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Danh Sách Điểm Lớp ${className}</h1>
            <p>Trường: Hệ Thống Quản Lý Học Sinh</p>
            <p>Ngày in: ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>

          ${classData?.students?.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 40px;">STT</th>
                  <th style="width: 70px;">Mã HS</th>
                  <th style="width: 100px;">Tên Học Sinh</th>
                  ${SUBJECTS.map(s => `<th style="width: 35px;">${s.label}</th>`).join('')}
                  <th style="width: 40px;">TBM</th>
                </tr>
              </thead>
              <tbody>
                ${classData.students.map((student, index) => {
                  const grades = student.grades || {};
                  const gradeValues = SUBJECTS.filter(s => s.key !== 'TheDuc')
                    .map(s => parseFloat(grades[s.key]) || 0);
                  const average = gradeValues.length > 0 ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2) : 0;
                  
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${student.maSv}</td>
                      <td style="text-align: left;">${student.name}</td>
                      ${SUBJECTS.map(s => {
                        if (s.key === 'TheDuc') {
                          const value = grades[s.key];
                          const bgColor = value === 'Đạt' ? '#d1fae5' : value === 'Không Đạt' ? '#fee2e2' : '#f3f4f6';
                          const textColor = value === 'Đạt' ? '#065f46' : value === 'Không Đạt' ? '#991b1b' : '#6b7280';
                          return `<td style="background-color: ${bgColor}; color: ${textColor}; font-weight: bold;">${value || '-'}</td>`;
                        } else {
                          return `<td>${grades[s.key] !== undefined && grades[s.key] !== null ? parseFloat(grades[s.key]).toFixed(1) : '-'}</td>`;
                        }
                      }).join('')}
                      <td><strong>${average}</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Tổng cộng: ${classData.students.length} học sinh</p>
              <p>In lúc: ${new Date().toLocaleString('vi-VN')}</p>
            </div>
          ` : `
            <div class="no-students">
              Chưa có học sinh nào trong lớp này
            </div>
          `}
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">In Danh Sách Lớp</h1>
        <p className="text-gray-500 mt-2">Xem và in danh sách học sinh theo lớp</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((classItem) => (
            <div key={classItem.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                onClick={() => handleClassClick(classItem.name)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <p className="text-sm text-gray-500">{classItem.students.length} học sinh</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint(classItem.name);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg btn-ripple smooth-transition flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    In
                  </button>
                  <svg
                    className={`w-6 h-6 text-gray-600 transition-transform ${expandedClass === classItem.name ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedClass === classItem.name && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {classItem.students.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-white border-b">
                            <th className="px-2 py-2 text-center font-semibold text-gray-700 w-10">STT</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700 w-20">Mã HS</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700 min-w-32">Tên</th>
                            {SUBJECTS.map(s => (
                              <th key={s.key} className="px-1 py-2 text-center font-semibold text-gray-700 w-12">{s.label.substring(0, 2)}</th>
                            ))}
                            <th className="px-2 py-2 text-center font-semibold text-gray-700 w-12">TBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classItem.students.map((student, index) => {
                            const grades = student.grades || {};
                            const gradeValues = SUBJECTS.filter(s => s.key !== 'TheDuc')
                              .map(s => parseFloat(grades[s.key]) || 0);
                            const average = gradeValues.length > 0 ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2) : 0;
                            
                            return (
                              <tr key={student._id} className="border-b hover:bg-white">
                                <td className="px-2 py-2 text-center text-gray-700">{index + 1}</td>
                                <td className="px-2 py-2 text-gray-700 font-medium">{student.maSv}</td>
                                <td className="px-2 py-2 text-gray-700">{student.name}</td>
                                {SUBJECTS.map(s => (
                                  <td key={s.key} className="px-1 py-2 text-center text-gray-700">
                                    {s.key === 'TheDuc' 
                                      ? grades[s.key] !== undefined && grades[s.key] !== null 
                                        ? <span className={grades[s.key] === 'Đạt' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{grades[s.key]}</span>
                                        : '-'
                                      : grades[s.key] !== undefined && grades[s.key] !== null ? parseFloat(grades[s.key]).toFixed(1) : '-'
                                    }
                                  </td>
                                ))}
                                <td className="px-2 py-2 text-center font-semibold text-blue-600">{average}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">Chưa có học sinh nào</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
