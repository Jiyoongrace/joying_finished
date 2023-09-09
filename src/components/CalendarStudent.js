import React, { useState, useEffect } from 'react';
import './Modal.css';
import { parseISO, format } from 'date-fns';

const CalendarStudent = ({ students, userData, name }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [calendar, setCalendar] = useState(generateCalendar(currentYear, currentMonth));
  const [lessonData, setLessonData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedNum, setSelectedNum] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarData, setCalendarData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [modalStudentList, setModalStudentList] = useState([]);

  useEffect(() => {
    fetch('/lessons')
      .then((res) => res.json())
      .then((json) => {
        if (json.lessons) {
          const dataByDate = json.lessons.reduce((acc, lesson) => {
            const lessonDate = new Date(lesson.date).toISOString().split('T')[0];
            if (!acc[lessonDate]) {
              acc[lessonDate] = [];
            }
            acc[lessonDate].push({ name: lesson.name, color: lesson.color });
            return acc;
          }, {});

          setLessonData(dataByDate);
        }
      })
      .catch((error) => {
        console.log('Error fetching lesson data:', error);
      });
  }, []);

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleNumChange = (event) => {
    setSelectedNum(event.target.value);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date); // Use the clicked date as it is
  };

  const openModal = (date) => {
    setModalDate(date);
    const lessonInfo = lessonData[date] || [];
    const studentList = lessonInfo.map((lesson) => ({
      name: lesson.name,
      color: lesson.color,
    }));
    setModalStudentList(studentList);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
  
    const calendar = [];
  
    let dayCounter = 1;
  
    for (let week = 0; week < 6; week++) {
      const weekData = [];
  
      if (dayCounter > daysInMonth) {
        break;
      }
  
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < startingDay) || dayCounter > daysInMonth) {
          weekData.push(null);
        } else {
          const currentDate = new Date(year, month, dayCounter + 1); // Subtracting 1 to show the correct date
          weekData.push({
            date: currentDate.toISOString().split('T')[0],
            day: dayCounter,
          });
          dayCounter++;
        }
      }
  
      calendar.push(weekData);
    }
  
    return calendar;
  }
  

  const handlePrevMonth = () => {
    const newMonth = currentMonth - 1;
    const newYear = currentYear;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(newYear - 1);
    } else {
      setCurrentMonth(newMonth);
    }
    setCalendar(generateCalendar(newYear, newMonth));
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth + 1;
    const newYear = currentYear;
    if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(newYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
    setCalendar(generateCalendar(newYear, newMonth));
  };



  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  
  const renderDayCell = (day) => {
    const lessonInfo = lessonData?.[day.date];
    const isSelectedDate = selectedDate === day.date;
  
    const cellStyle = {
      padding: '8px',
      cursor: 'pointer',
      height: '40px',
      color: lessonInfo ? '#5f62ff' : 'black', // Change background color based on lessonInfo
      backgroundColor: isSelectedDate ? '#c6cae4' : 'white', // Apply background color based on selection
    };
  
    return (
      <td
        key={day.date}
        onClick={() => handleDateClick(day.date)}
        onDoubleClick={() => openModal(day.date)}
        style={cellStyle}
        className={isSelectedDate ? 'selected-day' : ''}
    >
        {day.day}
      </td>
    );
  };


  return (
    <div id="calendar">
     <img src="JOY2.svg" id="logo3" alt="Logo" />
    <br /><br />
      <span id="cal_sp1">{name}</span>
      &nbsp;<span id="cal_sp2">학생의</span>
      &nbsp;&nbsp;<span id="cal_sp3">월간 과외 캘린더</span>

      <br /><br /><br />
      <div>
        <div id="cal_div">
          <button className="nav-button" onClick={handlePrevMonth}> ◀ </button>
          <h3>{monthName}</h3>
          <button className="nav-button" onClick={handleNextMonth}> ▶ </button>
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '14.2857%' }} />
            <col style={{ width: '14.2857%' }} />
            <col style={{ width: '14.2857%' }} />
            <col style={{ width: '14.2857%' }} />
            <col style={{ width: '14.2857%' }} />
            <col style={{ width: '14.2857%' }} />
            <col style={{ width: '14.2857%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ color: 'red', borderTopLeftRadius: '10px' }}>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th style={{ color: 'blue', borderTopRightRadius: '10px' }}>Sat</th>
            </tr>
          </thead>
          <tbody>
          {calendar && calendar?.map((week, index) => (
            <tr key={index}>
              {week && week?.map((day, dayIndex) =>
                day ? (
                  renderDayCell(day)
                ) : (
                  <td
                    key={`null-${dayIndex}`}
                    style={{ padding: '8px' }}
                    >
                    {' '}
                  </td>
                )
              )}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />



      {showModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <span className="close" onClick={closeModal}>
        &times;
      </span>
      <h3 id="cal_h3">{format(parseISO(modalDate), 'Y년 M월 d일')}</h3>
      <ul>
      {modalStudentList && modalStudentList?.length > 0 ? (
        modalStudentList.map((student, index) => (
          <li key={index} style={{ color: student.color, fontSize: '20px' }}>
            ● <span style={{ color: '#5d5d5d' }}>{student.name} 학생 수업이 있습니다. </span>
          </li>
        ))
      ) : (
        <p style={{ color: '#5d5d5d' }}>해당 날짜에 수업이 없습니다.</p>
      )}
      </ul>
      <button id="cal_btn2" className="close-button" onClick={closeModal}>
        닫기
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default CalendarStudent;
