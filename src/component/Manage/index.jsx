import React, { useEffect, useState } from 'react'
import { Card, List, Button, Modal, Form, Input, Select, message, Divider } from 'antd'

const { Option } = Select

const ManageClasses = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [studentsInClass, setStudentsInClass] = useState([])
  const [teachersInClass, setTeachersInClass] = useState([])
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [formTeacher] = Form.useForm()
  const [formClass] = Form.useForm()

  // Lấy danh sách lớp
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:3000/user')
      const data = await res.json()

      const classSet = new Set(data.map(u => u.class).filter(c => c))
      let classArray = Array.from(classSet)
      classArray.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))

      setClasses(classArray)
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu lớp:', err)
    }
  }

  // Lấy chi tiết lớp
  const fetchClassDetails = async (className) => {
    try {
      const res = await fetch('http://localhost:3000/user')
      const data = await res.json()

      const students = data.filter(u => u.class === className && u.role === 'student')
      const teachers = data.filter(u => u.class === className && u.role === 'teacher')

      setStudentsInClass(students)
      setTeachersInClass(teachers)
      setSelectedClass(className)
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết lớp:', err)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleBackToClasses = () => {
    setSelectedClass(null)
    setStudentsInClass([])
    setTeachersInClass([])
  }

  // Xóa học sinh khỏi lớp
  const handleRemoveStudent = async (studentId) => {
    try {
      const res = await fetch(`http://localhost:3000/user/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class: null }),
      })
      if (res.ok) {
        message.success('Đã xoá học sinh khỏi lớp')
        fetchClassDetails(selectedClass)
      } else {
        message.error('Xoá học sinh thất bại')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi khi xoá học sinh')
    }
  }

  // Thêm giáo viên mới cho lớp đã chọn
  const handleAddTeacher = async (values) => {
    try {
      const newTeacher = {
        account: values.account,
        password: values.password,
        name: values.name,
        role: 'teacher',
        class: selectedClass,
        DOB: values.DOB,
        sex: values.sex,
        avatarURL: null,
      }
      const res = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher),
      })

      if (res.ok) {
        message.success('Đã thêm giáo viên mới')
        setShowAddTeacherModal(false)
        formTeacher.resetFields()
        fetchClassDetails(selectedClass)
      } else {
        message.error('Thêm giáo viên thất bại')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi khi thêm giáo viên')
    }
  }

  // Thêm lớp mới + tạo giáo viên quản lý lớp đó
  const handleAddClass = async (values) => {
    const { className, account, password, name, DOB, sex } = values

    // Kiểm tra lớp đã tồn tại chưa
    if (classes.includes(className)) {
      message.error(`Lớp ${className} đã tồn tại!`)
      return
    }

    try {
      // Tạo giáo viên mới với lớp vừa tạo
      const newTeacher = {
        account,
        password,
        name,
        role: 'teacher',
        class: className,
        DOB,
        sex,
        avatarURL: null,
      }

      const res = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher),
      })

      if (res.ok) {
        message.success(`Đã tạo lớp ${className} và giáo viên quản lý`)
        setShowAddClassModal(false)
        formClass.resetFields()
        fetchClasses()
      } else {
        message.error('Tạo lớp và giáo viên thất bại')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi khi tạo lớp và giáo viên')
    }
  }

  // Avatar render helper
  const renderAvatar = (user) => {
    if (user.avatarURL) {
      return <Avatar src={user.avatarURL} size={50} />
    }
    const seed = encodeURIComponent(user.name || 'User')
    const url = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`
    return <Avatar src={url} size={50} />
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {!selectedClass ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Quản lý các lớp</h1>
          <Button
            type="primary"
            className="mb-6"
            onClick={() => setShowAddClassModal(true)}
          >
            + Tạo lớp mới và giáo viên quản lý
          </Button>

          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={classes}
            renderItem={(className) => (
              <List.Item key={className}>
                <Card
                  hoverable
                  onClick={() => fetchClassDetails(className)}
                  className="cursor-pointer text-center"
                >
                  <h2 className="text-xl font-semibold">{className}</h2>
                </Card>
              </List.Item>
            )}
          />

          {/* Modal tạo lớp mới + giáo viên */}
          <Modal
            title="Tạo lớp mới và giáo viên quản lý"
            open={showAddClassModal}
            onCancel={() => setShowAddClassModal(false)}
            onOk={() => formClass.submit()}
            okText="Tạo"
          >
            <Form form={formClass} layout="vertical" onFinish={handleAddClass}>
              <Form.Item
                label="Tên lớp"
                name="className"
                rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
              >
                <Input placeholder="VD: 12A" />
              </Form.Item>
              <Divider />
              <Form.Item
                label="Tài khoản giáo viên"
                name="account"
                rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mật khẩu giáo viên"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Tên giáo viên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="DOB"
                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="sex"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="nam">Nam</Option>
                  <Option value="nữ">Nữ</Option>
                  <Option value="khác">Khác</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <>
          <Button onClick={handleBackToClasses} className="mb-4">
            ← Trở lại danh sách lớp
          </Button>
          <h2 className="text-2xl font-bold mb-4">Lớp {selectedClass}</h2>

          <Card title="Giáo viên phụ trách" className="mb-6">
            {teachersInClass.length === 0 ? (
              <p>Chưa có giáo viên phụ trách lớp.</p>
            ) : (
              <List
                dataSource={teachersInClass}
                renderItem={(teacher) => (
                  <List.Item key={teacher.id}>
                    <List.Item.Meta
                      avatar={renderAvatar(teacher)}
                      title={<span className="text-lg font-semibold">{teacher.name}</span>}
                    />
                  </List.Item>
                )}
              />
            )}
            <Button type="primary" onClick={() => setShowAddTeacherModal(true)}>
              Thêm giáo viên mới
            </Button>
          </Card>

          <Card title="Danh sách học sinh">
            {studentsInClass.length === 0 ? (
              <p>Chưa có học sinh trong lớp.</p>
            ) : (
              <List
                dataSource={studentsInClass}
                renderItem={(student) => (
                  <List.Item
                    key={student.id}
                    actions={[
                      <Button
                        danger
                        onClick={() => handleRemoveStudent(student.id)}
                        size="small"
                      >
                        Xoá
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={renderAvatar(student)}
                      title={<span className="text-lg font-semibold">{student.name}</span>}
                      description={
                        <div className="text-sm text-gray-600 mt-1">
                          Giới tính: {student.sex || 'Chưa cập nhật'}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>

          {/* Modal thêm giáo viên */}
          <Modal
            title="Thêm giáo viên mới"
            open={showAddTeacherModal}
            onCancel={() => setShowAddTeacherModal(false)}
            onOk={() => formTeacher.submit()}
            okText="Thêm"
          >
            <Form form={formTeacher} layout="vertical" onFinish={handleAddTeacher}>
              <Form.Item
                label="Tài khoản"
                name="account"
                rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Tên giáo viên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="DOB"
                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="sex"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="nam">Nam</Option>
                  <Option value="nữ">Nữ</Option>
                  <Option value="khác">Khác</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  )
}

export default ManageClasses
