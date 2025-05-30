import React, { useEffect, useState } from 'react'
import { getUserFromLocalStorage } from '../../asset/AuthContext'
import axios from 'axios'
import Card from '../Card'
import { Form, Input, Button, message, Divider, Select } from 'antd'

const { TextArea } = Input
const { Option } = Select

const Posts = () => {
    const  user  = getUserFromLocalStorage()
    const [post, setPost] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get('http://localhost:3000/posts')
                setPost(response.data)
            } catch (error) {
                message.error("Lỗi khi tải bài viết")
                console.error(error)
            }
        }
        fetchPost()
    }, [])

    const onFinish = async (values) => {
        const postToCreate = {
            ...values,
            owner: user.name,
            postedDate: new Date().toISOString().slice(0, 10)
        }

        // Nếu chọn "Class", thêm key Class
        if (values.status === 'Class') {
            postToCreate.Class = user.class
        }

        try {
            setLoading(true)
            const response = await axios.post('http://localhost:3000/posts', postToCreate)
            setPost([...post, response.data])
            message.success("Đăng bài thành công")
        } catch (error) {
            message.error("Lỗi khi đăng bài")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPost = post.filter((item) => item.owner === user.name)

    return (
        <>
            <div className='createNewPost mb-6 bg-white p-6 rounded shadow'>
                <h2 className='text-lg font-semibold mb-4'>📝 Tạo bài viết mới</h2>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Tiêu đề bài viết" />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <TextArea rows={4} placeholder="Nội dung bài viết" />
                    </Form.Item>

                    <Form.Item
                        label="Phạm vi hiển thị"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn phạm vi hiển thị!' }]}
                    >
                        <Select
                            placeholder="Chọn phạm vi hiển thị"
                            onChange={(value) => setSelectedStatus(value)}
                        >
                            <Option value="All">All</Option>
                            <Option value="Class" disabled={user.role==="principal"}>Class</Option>
                        </Select>
                    </Form.Item>

                    {selectedStatus === 'Class' && (
                        <div className="text-sm text-blue-600 mb-3">
                            Bài viết sẽ chỉ hiển thị cho lớp <strong>{user.class}</strong>.
                        </div>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đăng bài
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Divider>Bài viết của tôi</Divider>

            <div>
                {filteredPost.length > 0 ? (
                    filteredPost.map((item) => (
                        <Card posts={item} />
                    ))
                ) : (
                    <p className='text-gray-600'>Bạn chưa có bài viết nào.</p>
                )}
            </div>
        </>
    )
}

export default Posts
