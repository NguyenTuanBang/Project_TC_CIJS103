import React, { useEffect, useState } from 'react'
import { getUserFromLocalStorage } from '../../asset/AuthContext'
import { Card, Input, Button, Tag, message as antdMessage } from 'antd'

const { TextArea } = Input

const ReplyMessage = () => {
  const user = getUserFromLocalStorage()
  const [messages, setMessages] = useState([])
  const [replyValues, setReplyValues] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3000/message')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      console.error('Lỗi khi lấy tin nhắn:', err)
    }
  }

  useEffect(() => {
    if (user?.role === 'teacher') {
      fetchMessages()
    }
  }, [user])

  const handleReplyChange = (id, value) => {
    setReplyValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleSendReply = async (msg) => {
    const replyText = replyValues[msg.id]?.trim()
    if (!replyText) {
      antdMessage.warning('Vui lòng nhập nội dung phản hồi.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/message/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      })

      if (res.ok) {
        antdMessage.success('Phản hồi đã được gửi.')
        setReplyValues((prev) => ({ ...prev, [msg.id]: '' }))
        fetchMessages()
      } else {
        antdMessage.error('Không thể gửi phản hồi.')
      }
    } catch (err) {
      console.error('Lỗi phản hồi:', err)
      antdMessage.error('Lỗi khi gửi phản hồi.')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="text-center text-gray-500 mt-10">
        Chỉ giáo viên mới có quyền phản hồi tin nhắn.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Phản hồi tin nhắn từ học sinh</h1>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500">Không có tin nhắn nào.</p>
      ) : (
        messages.map((msg) => (
              <Card key={msg.id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <strong>{msg.title}</strong>
                  <Tag color="blue">{new Date(msg.timestamp).toLocaleString()}</Tag>
                </div>
                <p><strong>Học sinh:</strong> {msg.sender} - <em>Lớp {msg.class}</em></p>
                <p className="mt-2"><strong>Nội dung:</strong> {msg.content}</p>

                {/* Hiển thị reply hiện tại, nếu có */}
                {msg.reply && (
                  <p className="mt-2 bg-gray-100 p-3 rounded-md text-gray-700">
                    <strong>Phản hồi:</strong> {msg.reply}
                  </p>
                )}

                <div className="mt-4">
                  <TextArea
                    rows={3}
                    style={{ resize: 'none', width: 600, height: 100 }}
                    placeholder="Nhập phản hồi..."
                    value={replyValues[msg.id] ?? ''}
                    onChange={(e) => handleReplyChange(msg.id, e.target.value)}
                  />
                  <Button
                    type="primary"
                    className="mt-2"
                    loading={loading}
                    onClick={() => handleSendReply(msg)}
                  >
                    Gửi phản hồi
                  </Button>
                </div>
              </Card>
            ))
      )}
    </div>
  )
}

export default ReplyMessage
