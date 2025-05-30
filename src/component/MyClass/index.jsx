import React from 'react';
import { useOutletContext } from 'react-router';
import StudentCard from '../../component/StudentCard'; // điều chỉnh path nếu khác

const MyClass = () => {
  const { classInfo, teacherAvatarURL, teacherInfo } = useOutletContext();

  return (
    <>
      <div className="teacherInfo mb-8 bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
        <div className="w-24 h-24">
          <img src={teacherAvatarURL} alt="Teacher Avatar" className="w-full h-full object-cover rounded-full border" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Giáo viên phụ trách</h1>
          <p className="text-gray-700">Tên: <span className="font-medium">{teacherInfo?.name}</span></p>
          <p className="text-gray-700">Kinh nghiệm: <span className="font-medium">{teacherInfo?.exp} năm</span></p>
        </div>
      </div>

      <div className="ClassMateList">
        <h2 className="text-xl font-semibold mb-4">Danh sách bạn cùng lớp</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classInfo?.map((student, index) => (
            <StudentCard key={index} data={student} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyClass;
