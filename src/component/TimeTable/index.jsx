import React, { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../../asset/AuthContext';
import ScheduleTable from '../ScheduleTable';
import axios from 'axios';

const TimeTable = () => {
  const user = getUserFromLocalStorage();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/schedules');
        const data = await response.json();

        const filtered = data.find((item) => item.class === user.class);
        setSchedule(filtered || null);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thời khóa biểu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.class]);

  const handleUpdateSchedule = async (newSchedule) => {
    if (!schedule) return;
    setSaving(true);
    try {
      await axios.patch(`http://localhost:3000/schedules/${schedule.id}`, newSchedule);
      setSchedule(newSchedule);
    } catch (error) {
      console.error('Lỗi khi cập nhật thời khóa biểu:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thời khóa biểu</h1>
      {loading ? (
        <p>Đang tải thời khóa biểu...</p>
      ) : schedule ? (
        <ScheduleTable
          schedule={schedule}
          isTeacher={user.role === 'teacher'}
          onScheduleChange={handleUpdateSchedule}
          saving={saving}
        />
      ) : (
        <p>Không tìm thấy thời khóa biểu cho lớp {user.class}</p>
      )}
    </div>
  );
};

export default TimeTable;
