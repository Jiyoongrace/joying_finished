import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Signin from './components/Signin';
import Welcome from './components/Welcome';
import UserInfoEdit from './components/UserInfoEdit';
import SubjectManagement from './components/SubjectManagement';
import Calendar from './components/Calendar';
import CalendarStudent from './components/CalendarStudent';
import MainCardEdit from './components/MainCardEdit';
import MainCardStudent from './components/MainCardStudent';
import LessonDiary from './components/LessonDiary';
import LessonDiaryStudent from './components/LessonDiaryStudent';
import Feedback from './components/Feedback';
import Start from './components/Start';
import Main from './components/Main';
import GradeHistory from './components/GradeHistory';
import GradeHistoryTeacher from './components/GradeHistoryTeacher';
import Notification from './components/Notification';
import NotificationTeacher from './components/NotificationTeacher';
import './components/css/template.css';
import './App.css';
import BottomNav from './components/BottomNav';

const App = () => {
  const [mode, setMode] = useState('');
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [editedLesson, setEditedLesson] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [selectStudent, setSelectStudent] = useState('');

  // 현재 경로를 문자열로 가져옴
  const currentPath = window.location.pathname;

  // "/"와 "/main" 경로인 경우에만 BottomNav를 숨김
  const shouldHideBottomNav = currentPath === '/' || currentPath === '/main';


  useEffect(() => {
    fetch('/authcheck')
      .then((res) => res.json())
      .then((json) => {
        if (json.isLogin === 'True') {
          fetchUserInfo();
          setIsLoggedIn(true);
          setMode('WELCOME');
        } else {
          setIsLoggedIn(false);
          setMode('LOGIN');
        }
      });
  }, []);

  useEffect(() => {
    if (mode === 'WELCOME') {
      fetchUserInfo();
      fetchLessons();
    }
  }, [mode]);

  const handleLogin = (username, password) => {
    // 예시로 axios를 사용하여 로그인 요청을 보냅니다.
    axios.post('/login', { username, password })
      .then((res) => {
        // 로그인 성공 시 처리
        if (res.data.success) {
          setIsLoggedIn(true);
          setMode('WELCOME');
        } else {
          console.log('Login failed:', res.data.message);
        }
      })
      .catch((error) => {
        console.log('Error logging in:', error);
      });
  };

  const fetchUserInfo = () => {
    fetch('/userinfo')
      .then((res) => res.json())
      .then((json) => {
        setUserData(json.user);
      })
      .catch((error) => {
        console.log('Error fetching user information:', error);
      });
  };

  const fetchLessons = () => {
    fetch('/lessons')
      .then((res) => res.json())
      .then((json) => {
        setLessons(json.lessons);
      })
      .catch((error) => {
        console.log('Error fetching lessons:', error);
      });
  };

  const createLesson = (newLesson) => {
    fetch('/lessons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLesson),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons((prevLessons) => [...prevLessons, newLesson]);
          console.log('Lesson created successfully');
        } else {
          console.log('Failed to create lesson');
        }
      })
      .catch((error) => {
        console.log('Error creating lesson:', error);
      });
  };

  const updateLesson = (updatedLesson) => {
    fetch(`/lessons/${updatedLesson.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedLesson),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
              lesson.id === updatedLesson.id ? updatedLesson : lesson
            )
          );
          console.log('Lesson updated successfully');
        } else {
          console.log('Failed to update lesson');
        }
      })
      .catch((error) => {
        console.log('Error updating lesson:', error);
      });
  };

  const deleteLesson = (lessonId) => {
    fetch(`/lessons/${lessonId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons((prevLessons) =>
            prevLessons.filter((lesson) => lesson.id !== lessonId)
          );
          console.log('Lesson deleted successfully');
        } else {
          console.log('Failed to delete lesson');
        }
      })
.catch((error) => {
        console.log('Error deleting lesson:', error);
      });
  };

  const handleOpenMainCard = (lesson) => {
    setEditedLesson(lesson);
    setMode('MAIN_CARD');
  };

  const handleOpenMainCardStudent = (lesson) => {
    setEditedLesson(lesson);
    setMode('MAIN_CARD_STUDENT');
  };

  const handleLesson = () => {
    setMode('LESSON_DIARY');
  }

  const handleFeedback = (filteredLessons, totalPages) => {
    setLessons(filteredLessons);
    setTotalPages(totalPages);
    setMode('FEEDBACK');
  };
  
  const handleStudent = (selectStudent) => {
    setSelectStudent(selectStudent);
    setMode('SUBJECT_MANAGEMENT');
  };

  const handleUpdateLesson = (updatedLesson) => {
    updateLesson(updatedLesson);
    setMode('LESSON_DIARY');
  };

  const handleDeleteLesson = (lessonId) => {
    deleteLesson(lessonId);
    setMode('LESSON_DIARY');
  };

  const handleCreateLesson = (newLesson) => {
    createLesson(newLesson);
    setMode('LESSON_DIARY');
  };

  const handleLogout = () => {
    fetch('/logout')
      .then(() => {
        window.location.reload();
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.log('Error logging out:', error);
      });
  };
  

  return (
    <div className="background">
      <Router>
        {!shouldHideBottomNav && <BottomNav />}
        <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login setMode={setMode} handleLogin={handleLogin} />} />
          <Route path="/signin" element={<Signin setMode={setMode} />} />
          <Route
            path="/welcome"
            element={(
              <Welcome
                name={userData.name}
                username={userData.username}
                role={userData.role}
                tutor={userData.tutor}
                students={userData.students}
                lessons={lessons}
                color={userData.color}
                onOpenMainCard={handleOpenMainCard}
                onOpenMainCardStudent={handleOpenMainCardStudent}
                onLogout={handleLogout}
                onFeedback={handleFeedback}
                onLesson={handleLesson}
              />
            )}
          />
          <Route
            path="/user-info-edit"
            element={(
              <UserInfoEdit
                userData={userData}
                setMode={setMode}
                fetchUserInfo={fetchUserInfo}
              />
            )}
          />
          <Route
            path="/subject-management"
            element={<SubjectManagement students={userData.students} selectStudent={selectStudent} />}
          />
          <Route
            path="/calendar"
            element={userData.role === 1 ? ( // Render different components based on user role
              <Calendar students={userData.students} name={userData.name} onStudent={handleStudent} />
            ) : (
              <CalendarStudent students={userData.students} userData={userData} name={userData.name} />
            )}
          />
          <Route
            path="/lesson-diary"
            element={userData.role === 1 ? ( // Render different components based on user role
              <LessonDiary 
                lessons={lessons}
                onOpenMainCard={handleOpenMainCard}
                onFeedback={handleFeedback}
              />
            ) : (
              <LessonDiaryStudent 
                lessons={lessons}
                name={userData.name}
                tutor={userData.tutor} // tutorId를 전달해줍니다.
                onOpenMainCardStudent={handleOpenMainCardStudent} 
                onFeedback={handleFeedback}
              />
            )}
          />
          <Route
            path="/feedback"
            element={(
              <Feedback
                lessons={lessons}
                totalPages={totalPages}
                onLesson={handleLesson}
              />
            )}
          />
            <Route
            path="/main-card-edit"
            element={(
              <MainCardEdit
                lesson={editedLesson}
                createLesson={handleCreateLesson}
                updateLesson={handleUpdateLesson}
                deleteLesson={handleDeleteLesson}
                students={userData.students}
                isLoggedIn={isLoggedIn}
              />
            )}
          />

          <Route
            path="/main-card-student"
            element={(
              <MainCardStudent
                lesson={editedLesson}
                isLoggedIn={isLoggedIn}
              />
            )}
          />
          <Route
            path="/notification"
            element={userData.role === 2 ? ( // Render different components based on user role
            <Notification name={userData.name}/>
            ) : (
              <NotificationTeacher name={userData.name}/>
            )}
          />
          <Route
            path="/grade-history-teacher"
            element={userData.role === 1 ? ( // Render different components based on user role
            <GradeHistoryTeacher name={userData.name} />
            ) : (
              <GradeHistory name={userData.name} />
            )}
          />
        </Routes>
        
      </Router>
    </div>
    
  );
};

export default App;