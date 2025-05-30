import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginForm = ({ setUser }) => {
  const json_serverLink = 'http://localhost:3000/user';
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (value) => {
    try {
      const response = await axios.get(json_serverLink);
      const data = response.data;
      const loggedUser = data.find(
        (item) =>
          item.account === value.account && item.password === value.password
      );

      if (loggedUser) {
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser); // 🔥 cập nhật user để Navbar nhận đúng dữ liệu
        navigate('/');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(true);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Hello Client! Welcome to my app.
        </h1>
        <Form layout="vertical" onFinish={onFinish}>
          {error && (
            <Alert
              type="error"
              message="Something went wrong, please try again!"
              style={{ marginBottom: '1rem' }}
            />
          )}
          <Form.Item
            label="Account:"
            name="account"
            rules={[{ required: true, message: 'Please input your account!' }]}
          >
            <Input placeholder="Enter your account" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Password:"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" className="w-full" />
          </Form.Item>
          <div className="text-right mb-4">
            <span className="text-gray-600">Don't have an account yet? </span>
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/register')}
            >
              Click here
            </button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
