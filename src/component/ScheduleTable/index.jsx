import React, { useState } from "react";
import { Table, Input, Button, message, Popconfirm } from "antd";
import axios from "axios";

const ScheduleTable = ({ schedule, isTeacher, onScheduleChange }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const maxLessons = Math.max(...days.map((day) => schedule[day]?.length || 0));

  const [adding, setAdding] = useState(null); // { day, lessonIndex }
  const [newSubject, setNewSubject] = useState("");

  const handleAddSubject = async (day, index) => {
    if (!newSubject.trim()) {
      return message.warning("Vui lòng nhập tên môn học");
    }

    const updated = { ...schedule };
    if (!updated[day]) updated[day] = [];
    updated[day][index] = newSubject;

    try {
      await axios.patch(`http://localhost:3000/schedules/${schedule.id}`, {
        [day]: updated[day],
      });
      onScheduleChange(updated);
      message.success("Đã thêm môn học");
    } catch (err) {
      console.error("Lỗi khi lưu môn học:", err);
      message.error("Không thể lưu dữ liệu");
    }

    setAdding(null);
    setNewSubject('');
  };

  const handleDeleteSubject = async (day, index) => {
    const updated = { ...schedule };
    if (updated[day]) {
      updated[day][index] = "";
    }

    try {
      await axios.patch(`http://localhost:3000/schedules/${schedule.id}`, {
        [day]: updated[day],
      });
      onScheduleChange(updated);
      message.success("Đã xoá môn học");
    } catch (err) {
      console.error("Lỗi khi xoá môn:", err);
      message.error("Không thể xoá dữ liệu");
    }
  };

  const dataSource = Array.from({ length: maxLessons }, (_, index) => {
    const row = { key: index + 1, lesson: `Tiết ${index + 1}` };

    days.forEach((day) => {
      const isAdding = adding?.day === day && adding.lessonIndex === index;
      const subject = schedule[day]?.[index] || "";

      if (isAdding) {
        row[day] = (
          <div className="flex gap-2">
            <Input
              size="small"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Nhập môn"
            />
            <Button
              size="small"
              type="primary"
              onClick={() => handleAddSubject(day, index)}
            >
              Lưu
            </Button>
          </div>
        );
      } else if (isTeacher) {
        row[day] = subject ? (
          <div className="flex flex-col items-center">
            <span>{subject}</span>
            <Popconfirm
              title="Xoá môn học này?"
              onConfirm={() => handleDeleteSubject(day, index)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button size="small" danger className="mt-1">
                Xoá
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <Button
            size="small"
            onClick={() => {
              setAdding({ day, lessonIndex: index });
              setNewSubject("");
            }}
          >
            + Thêm
          </Button>
        );
      } else {
        row[day] = subject;
      }
    });

    return row;
  });

  const columns = [
    { title: "Tiết", dataIndex: "lesson", key: "lesson", align: "center" },
    ...days.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      align: "center",
    })),
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Thời khóa biểu lớp {schedule.class}
      </h2>
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
    </div>
  );
};

export default ScheduleTable;
