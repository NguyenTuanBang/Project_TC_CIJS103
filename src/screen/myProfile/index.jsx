import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Nav/nav';
import axios from 'axios';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Tabs } from 'antd';

import { getUserFromLocalStorage } from '../../asset/AuthContext';
import CardUserOverview from '../../component/CardUserOverview';

const MyProfile = () => {
  const storedUser = getUserFromLocalStorage();        // ✅ Đọc user một lần
  const [user, setUser] = useState(storedUser);                 // ✅ Không thay đổi sau khi mount

  const [avatarURL, setAvatarURL] = useState('');
  const [teacherAvatarURL, setTeacherAvatarURL] = useState('');
  const [classInfo, setClassInfo] = useState(null);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const tabItemsStudent = [
    { key: '/myprofile/class', label: 'Class' },
    { key: '/myprofile/timeTable', label: 'Time Table' },
    { key: '/myprofile/contact', label: 'Contact' },
  ];

  const tabItemsTeacher = [
    { key: '/myprofile/class', label: 'Class' },
    { key: '/myprofile/timeTable', label: 'Time Table' },
    { key: '/myprofile/posts', label: 'Posts' },
    { key: '/myprofile/report', label: 'Report' },
  ];
  const tabItemsPrincipal = [
    { key: '/myprofile/manage', label: 'Manage' },
    { key: '/myprofile/posts', label: 'Posts' },
  ];

  const getActiveTabs = () => {
    const currentPath = location.pathname;
    const allTabKeys = [...tabItemsStudent, ...tabItemsTeacher].map(item => item.key);
    return allTabKeys.find(key => currentPath.startsWith(key)) || '/myprofile/class';
  };

  useEffect(() => {
    if (!user) return;

    // Set avatar
    if (!user.avatarURL) {
      const url = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
      setAvatarURL(url);
    } else {
      setAvatarURL(user.avatarURL);
    }

    // Nếu là học sinh → tìm giáo viên
    if (user.role === 'student') {
      const fetchTeacher = async () => {
        try {
          const { data } = await axios.get('http://localhost:3000/user');
          const matchedTeacher = data.find(
            (teacher) => teacher.class === user.class && teacher.role === 'teacher'
          );
          setTeacherInfo(matchedTeacher);
          if (matchedTeacher) {
            const teacherURL = matchedTeacher.avatarURL ||
              `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(matchedTeacher.name)}`;
            setTeacherAvatarURL(teacherURL);
          }
        } catch (err) {
          console.error('Error fetching teacher:', err);
        }
      };
      fetchTeacher();
    }

    // Dữ liệu bạn cùng lớp
    const fetchClass = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/user');
        const matchedClass = data.filter(
          (s) => s.class === user.class && s.role === 'student' && s.name !== user.name
        );
        setClassInfo(matchedClass);
      } catch (err) {
        console.error('Error fetching class:', err);
      }
    };
    fetchClass();
  }, []); // ✅ Không có [user]

  const handleAvatarChange = (base64Image) => {
    setAvatarURL(base64Image);
    axios.patch(`http://localhost:3000/user/${user.id}`, {
      avatarURL: base64Image,
    }).catch((err) => {
      console.error('Lỗi khi cập nhật avatar:', err);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
       <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        My Proflie
      </h1>     
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="md:flex-[0.3] bg-white p-6 rounded-lg shadow-md">
          <CardUserOverview userAvatar={avatarURL} data={user} onAvatarChange={handleAvatarChange} />
        </div>

        {(user.role === "student" || user.role === "teacher") && (
          <div className="md:flex-[0.7] bg-white p-6 rounded-lg shadow-md flex flex-col">
            <Tabs
              items={user.role === "student" ? tabItemsStudent : tabItemsTeacher}
              activeKey={getActiveTabs()}
              onChange={(key) => navigate(key)}
              className="mb-4"
            />
            <div className="flex-grow">
              <Outlet context={{
                teacherAvatarURL,
                teacherInfo,
                classInfo
              }} />
            </div>
          </div>
        )}
        {(user.role === "principal") && (
          <div className="md:flex-[0.7] bg-white p-6 rounded-lg shadow-md flex flex-col">
            <Tabs
              items={tabItemsPrincipal}
              activeKey={getActiveTabs()}
              onChange={(key) => navigate(key)}
              className="mb-4"
            />
            <div className="flex-grow">
              <Outlet context={{
                teacherAvatarURL,
                teacherInfo,
                classInfo
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
