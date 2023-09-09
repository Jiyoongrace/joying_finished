import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { requestPermission, sendPushNotification } from '../firebase';
import './css/template.css';
import './css/Notification.css';

function NotificationTeacher({ name }) {
  const [titleInput, setTitleInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [sendToParents, setSendToParents] = useState(false); // 학부모에게도 보내기 체크 상태

  const options = [
    { value: '과외 날짜 변경 알림 📅', label: '과외 날짜 변경 알림 📅' },
    { value: '과외비 입금 알림 💸', label: '과외비 입금 알림 💸' },
    { value: '숙제 완료 알림 👍', label: '숙제 완료 알림 👍' },
    { value: '진도율 100% 알림 🎉', label: '진도율 100% 알림 🎉' },
    { value: '피드백 확인 알림 ✅', label: '피드백 확인 알림 ✅' },
  ];

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

  const fetchStudentList = async () => {
    try {
      const response = await axios.get('/usertable/students');
      if (response.data.students) {
        setStudentList(response.data.students);
      } else {
        toast.error('Failed to fetch student list', {
          duration: 60000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
      toast.error('Failed to fetch student list', {
        duration: 60000,
        position: 'top-right',
      });
    }
  };
  
  const fetchStudentNamePhone = async (selectedStudent) => {
    try {
      const response = await axios.get(`/usertable/students/${selectedStudent}`);
      setStudentName(response.data.student[0].name);
      setPhone(response.data.student[0].phone);
      //console.log('studentname:', response.data.student[0].name);
      //console.log('phone:', response.data.student[0].phone);
      //console.log('studentName:', studentName);
      //console.log('Phone:', phone);
    } catch (error) {
      console.error('Error fetching studentName and Phone:', error);
      toast.error('Failed to fetch studentName and Phone', {
        duration: 60000,
        position: 'top-right',
      });
    }
  };

  const sendSMSNotification = async (to, message) => {
    // 네이버 클라우드 SMS API 관련 정보
    try {
      const response = await axios.post('/sendSMS', {
        to: to,
        message: message,
      });
      console.log('SMS 전송 성공:', response.data);
    } catch (error) {
      console.log('data:', message);
      console.error('SMS 전송 실패:', error);
    }
  };

  const sendNotification = async () => {
    if (selectedOption && bodyInput && selectedStudent) {
      try {
        /*const token = await requestPermission();
        const payload = {
          notification: {
            title: selectedOption,
            body: bodyInput,
          },
        };*/
        //await sendPushNotification(token, payload);

        const notificationData = {
          title: selectedOption,
          body: bodyInput,
          username: selectedStudent,
        };

        const response = await fetch('/api/notifications', {
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

          //이모지와 이모지 뒤 공백 및 문자열 삭제
          const cleanTitle = notificationData.title.replace(/([\s\uFE00-\uFEFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g, '');

          if (sendToParents) {
          const message = `${studentName} 학부모님, JOY입니다.\n${cleanTitle}: ${notificationData.body}`;
          // 학부모에게 SMS 보내기 아래 콘솔 확인용
          //console.log('message:', message)
          //console.log('phonenum:', phone);
          sendSMSNotification(phone, message);
          }

          // Clear input fields
          setTitleInput('');
          setBodyInput('');
          setSelectedOption('');
          setSelectedStudent('');
          setSendToParents(false); // 체크 박스 초기화
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

  // useEffect를 컴포넌트 내부에 위치시키고, 의존성 배열에 studentName과 phone을 추가합니다. 바로바로 업데이트되도록!
  useEffect(() => {
    console.log('studentName:', studentName);
    console.log('Phone:', phone);
  }, [studentName, phone]);


  useEffect(() => {
    fetchNotifications();
    fetchStudentList();
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

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
    fetchStudentNamePhone(event.target.value); // 학생이름 및 학부모 번호 불러오기!
  };

  return (
    <div>
      <img src="JOY2.svg" id="logo3" alt="Logo" />
      <br /><br />
      <div id="noti_div"><span id="noti_p">{name}</span> 선생님</div>
      <div id="noti_div2">
        <select id="noti_sel"
          value={selectedStudent}
          onChange={handleStudentChange}
        >
          <option value="" disabled>학생 선택</option>
          {studentList.map((student) => (
            <option key={student.username} value={student.username}>
              {student.name}
            </option>
          ))}
        </select>&nbsp;&nbsp;
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
    &nbsp;&nbsp;
    </div>
    <div id="noti_div5">
    <input id="noti_input2"
        type="checkbox"
        checked={sendToParents}
        onChange={() => setSendToParents(!sendToParents)}
      />&nbsp;
    <label>
      학부모에게도 보내기
    </label>
    </div>
      <br /><br /><br />
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

export default NotificationTeacher;
