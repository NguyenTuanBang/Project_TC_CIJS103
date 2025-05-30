import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // dùng useLocation
import Register from './screen/Register/index.jsx';
import LoginForm from './screen/Login/index.jsx';
import MyProfile from './screen/myProfile/index.jsx';
import PrivateRoute from './screen/PrivateRoute/index.jsx';
import HomePage from './screen/homePage/index.jsx';
import { getUserFromLocalStorage } from './asset/AuthContext.jsx';
import MyClass from './component/MyClass/index.jsx';
import TimeTable from './component/TimeTable/index.jsx';
import Library from './screen/Library/index.jsx';
import MyClassTeacherV from './component/MyClassTeacherV.jsx/index.jsx';
import Posts from './component/Post/index.jsx';
import Contact from './component/Contact/index.jsx';
import ReplyMessage from './component/Reply/index.jsx';
import ManageClasses from './component/Manage/index.jsx';
import Navbar from './component/Nav/nav.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(getUserFromLocalStorage());
  const location = useLocation(); // lấy thông tin route hiện tại

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserFromLocalStorage());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Nếu đang ở /login hoặc /register thì không hiện Navbar
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar setUser={setUser} user={user} />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={user ? <Navigate to='/' replace /> : <LoginForm setUser={setUser} />} />
        <Route path='/register' element={user ? <Navigate to='/' replace /> : <Register setUser={setUser} />} />
        <Route path='/library' element={<PrivateRoute user={user}><Library /></PrivateRoute>} />
        <Route path='/myprofile' element={<PrivateRoute user={user}><MyProfile user={user} setUser={setUser} /></PrivateRoute>} >
          {user?.role === 'student' && (
            <>
              <Route index element={<Navigate to="class" replace />} />
              <Route path='class' element={<MyClass />} />
              <Route path='timeTable' element={<TimeTable />} />
              <Route path='contact' element={<Contact />} />
            </>
          )}
          {user?.role === 'teacher' && (
            <>
              <Route index element={<Navigate to="class" replace />} />
              <Route path='class' element={<MyClassTeacherV />} />
              <Route path='timeTable' element={<TimeTable />} />
              <Route path='posts' element={<Posts />} />
              <Route path='report' element={<ReplyMessage />} />
            </>
          )}
          {user?.role === 'principal' && (
            <>
              <Route index element={<Navigate to="manage" replace />} />
              <Route path='manage' element={<ManageClasses />} />
              <Route path='posts' element={<Posts />} />
            </>
          )}
        </Route>
      </Routes>
    </>
  );
}

export default App;
