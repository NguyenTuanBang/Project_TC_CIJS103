import React, { useState } from 'react'
import { getUserFromLocalStorage } from '../../asset/AuthContext'
import { Alert, Button, message } from 'antd'
import dayjs from 'dayjs'

const BookCard = ({ data, onEdit, onUpdate }) => {
  const user = getUserFromLocalStorage()
  const [loading, setLoading] = useState(false)

  const handleRent = async () => {
    setLoading(true)
    const rentedDate = dayjs()
    const returnDate = rentedDate.add(30, 'day')

    try {
      const response = await fetch(`http://localhost:3000/books/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          available: false,
          borrower: user.name,
          rentedDate: rentedDate.format('DD/MM/YYYY'),
          returnDate: returnDate.format('DD/MM/YYYY')
        })
      })

      if (response.ok) {
        message.success('Thuê sách thành công!')
        onUpdate?.()
      } else {
        message.error('Không thể thuê sách.')
      }
    } catch (error) {
      console.error(error)
      message.error('Lỗi khi gửi yêu cầu thuê.')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async () => {
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3000/books/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          available: true,
          borrower: '',
          rentedDate: '',
          returnDate: ''
        })
      })

      if (response.ok) {
        message.success('Trả sách thành công!')
        onUpdate?.()
      } else {
        message.error('Không thể trả sách.')
      }
    } catch (error) {
      console.error(error)
      message.error('Lỗi khi gửi yêu cầu trả.')
    } finally {
      setLoading(false)
    }
  }

  const genderTag = data.gender.map((item, index) => (
    <span
      key={index}
      className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs mx-1"
    >
      {item}
    </span>
  ))

  const isOverdue = dayjs().isAfter(dayjs(data.returnDate, 'DD/MM/YYYY'))
  const isBorrowedByUser = data.borrower === user.name

  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition duration-300 flex flex-col min-h-[440px]">
      <div className="w-full h-48 overflow-hidden rounded-md mb-4">
        <img
          src={data.imgURL}
          alt={data.title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{data.title}</h3>
        <p className="text-sm text-gray-600 italic">Tác giả: {data.author}</p>
        <h4 className="text-sm text-gray-600 mt-1">Thể loại: {genderTag}</h4>
      </div>

      {isBorrowedByUser && isOverdue && (
        <Alert
          message="Bạn đang trả sách trễ hạn!"
          type="error"
          showIcon
          className="mb-3"
        />
      )}

      <div className="mt-auto w-full">
        {data.available ? (
          <Button
            type="primary"
            className="w-full"
            loading={loading}
            onClick={handleRent}
          >
            Thuê
          </Button>
        ) : (data.borrower === user.name) ? (
          <Button
            type={isOverdue ? 'primary' : 'default'}
            danger={isOverdue}
            className="w-full"
            loading={loading}
            onClick={handleReturn}
          >
            Trả sách
          </Button>
        ) : (
          <Button disabled className="w-full">
            Đã thuê
          </Button>
        )}

        {user.role === 'teacher' && (
          <Button
            onClick={() => onEdit(data)}
            className="w-full mt-2"
            type="default"
          >
            Edit
          </Button>
        )}
      </div>

    </div>
  )
}

export default BookCard
