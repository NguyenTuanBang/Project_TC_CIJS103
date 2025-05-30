import React, { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../../asset/AuthContext';
import { Modal, Input, Button, message } from 'antd';

const StudentCard = ({ data, onUpdate }) => {
  const user = getUserFromLocalStorage() || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(data.name);
  const [loading, setLoading] = useState(false);
  const [avatarURL, setAvatarURL] = useState('');

  const handleEdit = () => {
    setNewName(data.name);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (data.avatarURL) {
      setAvatarURL(data.avatarURL);
    } else {
      setAvatarURL(`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(data.name)}`);
    }
  }, [data.avatarURL, data.name]);

  const handleSave = async () => {
    if (!newName.trim()) {
      message.warning('Tên không được để trống');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/students/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        message.success('Cập nhật tên thành công');
        if (user.id === data.id) {
          const updatedUser = { ...user, name: newName };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        onUpdate?.();
        setIsModalOpen(false);
      } else {
        message.error('Không thể cập nhật tên');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition duration-300">
      <div className="flex flex-col items-center">
        <img
          src={avatarURL}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover mb-2"
        />
        <h3 className="text-lg font-semibold mb-2">{data.name}</h3>
        <p className="text-sm text-gray-600">Giới tính: {data.sex}</p>
        <p className="text-sm text-gray-600">Ngày sinh: {data.DOB}</p>

        {user.role === 'teacher' && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleEdit}
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      <Modal
        title="Chỉnh sửa tên học sinh"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        confirmLoading={loading}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nhập tên mới"
        />
      </Modal>
    </div>
  );
};

export default StudentCard;
