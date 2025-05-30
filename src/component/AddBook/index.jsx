import React, { useState } from 'react'
import { Button, Form, Input, Modal, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const AddBook = ({ onBookAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [base64Image, setBase64Image] = useState(null)

  const showModal = () => setIsModalOpen(true)
  const handleCancel = () => {
    form.resetFields()
    setBase64Image(null)
    setIsModalOpen(false)
  }

  const handleAdd = async () => {
    try {
      const values = form.getFieldsValue()

      if (!base64Image) {
        message.error('Please upload an image')
        return
      }

      const newBook = {
        ...values,
        gender: values.gender.split(',').map((g) => g.trim()),
        imgURL: base64Image,
        available: true,
      }

      await axios.post('http://localhost:3000/books', newBook)
      setIsModalOpen(false)
      form.resetFields()
      setBase64Image(null)
      if (onBookAdded) onBookAdded()
    } catch (err) {
      console.error('Error adding book:', err)
    }
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setBase64Image(reader.result)
      message.success('Image uploaded successfully')
    }
    reader.onerror = () => {
      message.error('Failed to upload image')
    }
    return false // Prevent default upload
  }

  return (
    <div className="mb-6 text-right">
      <Button type="primary" onClick={showModal}>
        Add Book
      </Button>

      <Modal
        title="Add New Book"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender (comma-separated)"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image" required>
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {base64Image && (
              <img
                src={base64Image}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded border"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddBook
