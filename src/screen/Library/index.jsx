import React, { useEffect, useMemo, useState } from 'react'
import BookCard from '../../component/BookCard'
import Navbar from '../../component/Nav/nav'
import { Modal, Input, Form, Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import AddBook from '../../component/AddBook'
import axios from 'axios'
import LibraryTab from '../../component/LibraryTab/LibraryTab'
import { getUserFromLocalStorage } from '../../asset/AuthContext'

const Library = () => {
  const user = getUserFromLocalStorage()
  const [books, setBooks] = useState([])
  const [status, setStatus] = useState("All")
  const [editingBook, setEditingBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [editImageBase64, setEditImageBase64] = useState('')
  const json_serverLink = 'http://localhost:3000/books'


  const fetchBooks = async () => {
    try {
      const response = await fetch(json_serverLink)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }


  useEffect(() => {
    fetchBooks()
  }, [])



  // const filteredBooks = useMemo(() => {
  //   if (status === "All") return books
  //   if (status === "Available") return books.filter(book => book.available === true)
  //   if (status === "Rented") return books.filter(book => book.available === false)
  //   if (status === "My Books") return books.filter(book => book.borrower === user.name)
  // }, [status, books])

  const filteredBooks = useMemo(() => {

    if (status === "All") return books
    if (status === "Available") {
      const availableBooks = books.filter(book => book.available === true)

      return availableBooks
    }
    if (status === "Rented") {
      const rentedBooks = books.filter(book => book.available === false)

      return rentedBooks
    }
    if (status === "My Books") return books.filter(book => book.borrower === user.name)
  }, [status, books])


  const handleEdit = (book) => {
    setEditingBook(book)
    form.setFieldsValue({
      ...book,
      gender: book.gender.join(', ')
    })
    setEditImageBase64(book.imgURL || '')
    setIsModalOpen(true)
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setEditImageBase64(reader.result)
      message.success('Image uploaded')
    }
    reader.onerror = () => {
      message.error('Failed to read image')
    }
    return false // prevent default upload
  }

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue()
      const updatedBook = {
        ...editingBook,
        ...values,
        gender: values.gender.split(',').map((g) => g.trim()),
        imgURL: editImageBase64
      }

      await axios.patch(`${json_serverLink}/${editingBook.id}`, updatedBook)
      setIsModalOpen(false)
      setEditingBook(null)
      fetchBooks()
    } catch (err) {
      console.error('Failed to save book:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        Library
      </h1>
      {user?.role !== 'student' && <AddBook onBookAdded={fetchBooks} />}
      <LibraryTab changeTag={setStatus} curTag={status} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((item, index) => {
          
          return <BookCard
            key={index}
            data={item}
            id={index}
            onEdit={handleEdit}
            onUpdate={fetchBooks}
          />

        })}
      </div>

      <Modal
        title="Edit Book"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Author" name="author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gender (comma-separated)" name="gender" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
            {editImageBase64 && (
              <img
                src={editImageBase64}
                alt="Book Cover"
                className="mt-2 w-full h-40 object-cover rounded border"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Library
