import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Menu, Button, message } from 'antd';
import { BookOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const avatarUrl =
    user?.avatarURL ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      user?.name || "User"
    )}`;

  const handleLogout = () => {
    // Xóa user trong localStorage
    localStorage.removeItem('user');
    // Cập nhật trạng thái user về null để render lại app
    if (setUser) {
      setUser(null);
    }
    message.success("Đã đăng xuất");
    // Điều hướng về trang đăng nhập
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="profile"
        onClick={() => navigate("/myprofile")}
        icon={<UserOutlined />}
      >
        Trang cá nhân
      </Menu.Item>
      <Menu.Item
        key="library"
        onClick={() => navigate("/library")}
        icon={<BookOutlined />}
      >
        Library
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-10">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/image/logo.png" alt="Logo" className="w-30 h-30 object-cover" />
        <span className="text-xl font-bold text-blue-600">Akademic School</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Button type="link" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </>
        ) : (
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <Avatar
              src={avatarUrl}
              size={60}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
