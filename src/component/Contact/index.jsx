import React, { useState, useEffect } from 'react'
import { getUserFromLocalStorage } from '../../asset/AuthContext'
import { Input, Button, message as antdMessage, Card, Tag } from 'antd'

const { TextArea } = Input

const Contact = () => {
  const user = getUserFromLocalStorage()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:3000/message?sender=${encodeURIComponent(user.name)}`)
      const data = await res.json()
      setMessages(data.reverse()) // hiển thị cái mới nhất trước
    } catch (err) {
      console.error('Lỗi khi lấy tin nhắn:', err)
    }
  }

  useEffect(() => {
    if (user?.role === 'student') {
      fetchMessages()
    }
  }, [user?.name])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      antdMessage.warning('Vui lòng nhập cả tiêu đề và nội dung.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: user.name,
          class: user.class,
          title: title.trim(),
          content: content.trim(),
          timestamp: new Date().toISOString(),
          reply: '' // chưa có phản hồi
        })
      })

      if (response.ok) {
        antdMessage.success('Đã gửi liên hệ tới giáo viên.')
        setTitle('')
        setContent('')
        fetchMessages()
      } else {
        antdMessage.error('Gửi thất bại.')
      }
    } catch (error) {
      console.error(error)
      antdMessage.error('Lỗi khi gửi liên hệ.')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="p-4 text-center text-gray-500">
        Chỉ học sinh mới có thể gửi liên hệ đến giáo viên.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
        Liên hệ với giáo viên
      </h1>

      <Input
        placeholder="Tiêu đề"
        className="mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        rows={4}
        placeholder="Nhập nội dung liên hệ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        type="primary"
        className="mt-4 w-full"
        loading={loading}
        onClick={handleSubmit}
      >
        Gửi
      </Button>

      {messages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">Tin nhắn đã gửi</h2>
          {messages.map((msg) => (
            <Card key={msg.id} className="mb-4">
              <div className="flex justify-between items-center">
                <strong>{msg.title}</strong>
                <Tag color="blue">{new Date(msg.timestamp).toLocaleString()}</Tag>
              </div>
              <p className="mt-2 text-gray-700"><strong>Nội dung:</strong> {msg.content}</p>

              {msg.reply ? (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-green-600 font-medium">Phản hồi từ giáo viên:</p>
                  <p className="text-gray-800 mt-1">{msg.reply}</p>
                </div>
              ) : (
                <Tag color="orange" className="mt-3">Chưa có phản hồi</Tag>
              )}
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

export default Contact
