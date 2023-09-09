import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { requestPermission, sendPushNotification } from '../firebase';
import './css/template.css';
import './css/Notification.css';

function Notification({ name }) {
  const [titleInput, setTitleInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [notifications, setNotifications] = useState([]);


  const options = [
    { value: '과외 날짜 변경 알림 📅', label: '과외 날짜 변경 알림 📅' },
    { value: '과외비 입금 알림 💸', label: '과외비 입금 알림 💸' },
    { value: '숙제 완료 알림 👍', label: '숙제 완료 알림 👍' },
    { value: '진도율 100% 알림 🎉', label: '진도율 100% 알림 🎉' },
    { value: '피드백 확인 알림 ✅', label: '피드백 확인 알림 ✅' },
  ];

  const sendNotification = async () => {
    if (selectedOption && bodyInput) {
      try {
        const token = await requestPermission();
        const payload = {
          notification: {
            title: selectedOption,
            body: bodyInput,
          },
        };
        await sendPushNotification(token, payload);

        const notificationData = {
          title: selectedOption,
          body: bodyInput,
        };
        const response = await fetch('/api/notifications/student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });

        if (response.ok) {
          toast.success(`${selectedOption}: ${bodyInput}`, {
            duration: 60000,
            position: 'top-right',
          });
          // Clear input fields
          setTitleInput('');
          setBodyInput('');
          setSelectedOption('');
          fetchNotifications(); // Refresh notifications after sending
        } else {
          toast.error('Failed to send notification', {
            duration: 60000,
            position: 'top-right',
          });
        }
      } catch (error) {
        toast.error('Failed to send notification', {
          duration: 60000,
          position: 'top-right',
        });
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        toast.error('Failed to fetch notifications', {
          duration: 60000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications', {
        duration: 60000,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotifications(); // Refresh notifications after deletion
        toast.success('Notification deleted', {
          duration: 60000,
          position: 'top-right',
        });
      } else {
        toast.error('Failed to delete notification', {
          duration: 60000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification', {
        duration: 60000,
        position: 'top-right',
      });
    }
  };

  const groupNotificationsByDate = (notifications) => {
    const groupedNotifications = {};
    
    notifications.forEach((notification) => {
      const createdAtUTC = new Date(notification.created_at);
      const offset = new Date().getTimezoneOffset(); // 현재 로컬 시간과 UTC 간의 차이 (분)
      const createdAtDate = new Date(createdAtUTC.getTime() - offset * 60000); // UTC 시간으로 변환
      const dateKey = createdAtDate.toISOString().substr(0, 10); // Get YYYY-MM-DD format

      if (!groupedNotifications[dateKey]) {
        groupedNotifications[dateKey] = [];
      }
      
      groupedNotifications[dateKey].push(notification);
    });

    return groupedNotifications;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);
  const sortedDates = Object.keys(groupedNotifications).sort().reverse();


  return (
    <div>
      <img src="JOY2.svg" id="logo3" alt="Logo" />
      <br /><br />
      <div id="noti_div"><span id="noti_p">{name}</span> 학생</div>
      <div id="noti_div2">

        <select id="noti_sel2"
        value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="" disabled>알림 종류</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div id="noti_div2">
    <input
        id="noti_input"
        type="text"
        value={bodyInput}
        onChange={(e) => setBodyInput(e.target.value)}
        placeholder="알림 내용 입력 (15자 이내)"
    />&nbsp;&nbsp;<button onClick={sendNotification} id="noti_btn">전송</button>
    </div>
      <br />
      {Object.keys(groupedNotifications).map((date) => (
        <div id="noti_p5" key={date}>
             {new Date(date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          <ul>
            {groupedNotifications[date].map((notification) => (
              <div id="noti_div3" onClick={() => deleteNotification(notification.id)}>
            <li key={notification.id} style={{ listStyleType: 'None' }}>
              <span id="noti_div4">
                <span style={{ color: notification.color }}> ● </span>
                <span id="noti_p2">{notification.name}</span> <span style={{ color: '#686868' }}>학생</span>&nbsp;&nbsp;
                <span id="noti_p3">{notification.title}</span>
              </span>
              <br />
              <span id="noti_div4">
              <span id="noti_p4">{notification.body}</span>
              <span id="noti_link">삭제하기</span>
              </span>
            </li>
          </div>
        ))}
      </ul>
      </div>
      ))}<br /><br /><br /><br /><br /><br />
      <Toaster />
    </div>
  );
}

export default Notification;