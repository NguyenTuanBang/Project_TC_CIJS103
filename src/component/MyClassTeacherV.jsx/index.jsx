import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import StudentCard from '../../component/StudentCard';

const MyClassTeacherV = () => {
  const { classInfo: initialClassInfo } = useOutletContext();
  const [classInfo, setClassInfo] = useState(initialClassInfo);

  const fetchClassInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/students?class=${initialClassInfo[0]?.class}`);
      const data = await res.json();
      setClassInfo(data);
    } catch (err) {
      console.error('Không thể tải lại danh sách lớp:', err);
    }
  };

  useEffect(() => {
    setClassInfo(initialClassInfo);
  }, [initialClassInfo]);

  return (
    <>
      <div className="ClassMateList">
        <h2 className="text-xl font-semibold mb-4">Danh sách học sinh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classInfo?.map((student, index) => (
            <StudentCard key={index} data={student} onUpdate={fetchClassInfo} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyClassTeacherV;
