import React, { useState } from "react";
import { Form, Input, Button, Alert, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from "dayjs";

const Register = () => {
    const json_serverLink = 'http://localhost:3000/user';
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            const response = await axios.get(json_serverLink);
            const data = response.data;

            const isRegistered = data.some(item => item.account === values.account);

            if (isRegistered) {
                setError("Your account has already signed up. Try again!");
            } else {
                const newUser = {
                    ...values,
                    id: Math.floor(Math.random() * 999999),
                    exp: null,
                    DOB: values.DOB ? dayjs(values.DOB).format("DD/MM/YYYY") : null,
                    avatarURL: null
                };
                await axios.post(json_serverLink, newUser);
                setError(null);
                navigate("/Login");
            }
        } catch (err) {
            setError("Failed to connect to server. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Let's get you started</h1>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        role: 'student',
                        class: '12A',
                        sex: 'Male'
                    }}
                >
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    <Form.Item label="Full name:" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
                        <Input placeholder="Type your name" className="w-full" />
                    </Form.Item>

                    <Form.Item label="Create your own account:" name="account" rules={[{ required: true, message: "Please input account!" }]}>
                        <Input placeholder="Create your account" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Create password:"
                        name="password"
                        rules={[
                            { required: true, message: "Please input your password!" },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.reject("Please input your password!");
                                    if (value.length < 8) return Promise.reject("Password must be at least 8 characters.");
                                    if (!/[!@#$%^&*(),.?":{}|<>]/g.test(value)) {
                                        return Promise.reject("Password must contain at least one special character.");
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input.Password placeholder="Input your password" className="w-full" />
                    </Form.Item>

                    <Form.Item label="Your role:" name="role">
                        <Select className="w-full" options={[
                            { value: 'student', label: 'student' },
                            { value: 'teacher', label: 'teacher', disabled: true },
                            { value: 'principal', label: 'principal', disabled: true },
                        ]} />
                    </Form.Item>

                    <Form.Item label="Class:" name="class">
                        <Select className="w-full" options={[
                            { value: '12A', label: '12A' },
                            { value: '12B', label: '12B' },
                            { value: '12C', label: '12C' },
                            { value: '12D', label: '12D' },
                            { value: '12E', label: '12E' },
                            { value: '12F', label: '12F' },
                        ]} />
                    </Form.Item>

                    <Form.Item label="Sex:" name="sex">
                        <Select className="w-full" options={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                        ]} />
                    </Form.Item>

                    <Form.Item label="DOB:" name="DOB">
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
                    </Form.Item>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-500 hover:underline"
                                onClick={() => navigate('/login')}
                            >
                                Click here
                            </button>
                        </span>
                        <Button htmlType="submit" type="primary" className="bg-blue-500 hover:bg-blue-600">
                            Sign up
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
