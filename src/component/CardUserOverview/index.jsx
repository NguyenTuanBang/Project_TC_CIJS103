import React, { useRef } from 'react';
import axios from 'axios';
import { getUserFromLocalStorage } from '../../asset/AuthContext';

const CardUserOverview = (props) => {
  const { data = {}, onAvatarChange } = props;
  const fileInputRef = useRef(null);
  const user = getUserFromLocalStorage();

  const updateUserInLocalStorage = (newUserData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { ...currentUser, ...newUserData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      if (onAvatarChange) onAvatarChange(base64Image);

      updateUserInLocalStorage({ avatarURL: base64Image });

      axios.patch(`http://localhost:3000/user/${user.id}`, {
        avatarURL: base64Image,
      }).catch((err) => {
        console.error('Lỗi khi cập nhật avatar:', err);
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full text-center h-[70vh]">
      <div className="flex justify-center mb-10">
        <img
          src={props.userAvatar}
          alt="avatar"
          className="w-60 h-60 rounded-full object-cover border-4 border-blue-500"
        />
      </div>

      <div className="mb-10">
        <label className="cursor-pointer inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Đổi ảnh đại diện
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </label>
      </div>

      <div className="text-center space-y-4">
        <div className='mb-10'>
          <span className="font-semibold text-gray-700">Tên:</span>
          <span className="ml-2 text-gray-900">{data.name || "Chưa có tên"}</span>
        </div>
        {user.role !== "principal" && (
          <div className='mb-10'>
            <span className="font-semibold text-gray-700">Lớp:</span>
            <span className="ml-2 text-gray-900">{data.class || "Chưa có lớp"}</span>
          </div>
        )}
        <div className='mb-10'>
          <span className="font-semibold text-gray-700">Vai trò:</span>
          <span className="ml-2 text-gray-900">{data.role || "Chưa có vai trò"}</span>
        </div>
      </div>
    </div>
  );
};

export default CardUserOverview;
