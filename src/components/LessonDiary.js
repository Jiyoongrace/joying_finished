import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css/template.css';
import './css/LessonDiary.css';

const LessonDiary = ({ lessons, onOpenMainCard, onFeedback }) => {
  const [selectedStudent, setSelectedStudent] = useState('학생');
  const [selectedSubject, setSelectedSubject] = useState('과목');
  const [selectedBook, setSelectedBook] = useState('교재');
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [bookOptions, setBookOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const studentOptions = ['학생', ...new Set(lessons.map((lesson) => lesson.name))];

  const filterLessonsByStudentAndSubject = () => {
    let filteredLessons = [...lessons];

    if (selectedStudent !== '학생') {
      filteredLessons = filteredLessons.filter((lesson) => lesson.name === selectedStudent);
    }

    if (selectedSubject !== '과목') {
      filteredLessons = filteredLessons.filter((lesson) => lesson.subjectName === selectedSubject);
    }

    if (selectedBook !== '교재') {
      filteredLessons = filteredLessons.filter((lesson) => lesson.book === selectedBook);
    }

    return filteredLessons;
  };

  const handleStudentSelectChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleSubjectSelectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedBook('교재'); // 과목이 변경되면 선택된 교재도 초기화
  };

  const handleBookSelectChange = (e) => {
    setSelectedBook(e.target.value);
  };

  const calculateProgress = () => {
    if (totalPages === 0) return 0;
    return ((currentPage / totalPages) * 100).toFixed(2);
  };

  const handleFeedbackClick = () => {
    // filterLessonsByStudentAndSubject()를 통해 현재 선택된 조건의 수업 일지를 가져옴
    const filteredLessons = filterLessonsByStudentAndSubject();
    // onFeedback 함수를 호출하면서 수업 일지와 totalPages 값을 전달
    onFeedback(filteredLessons, totalPages);
  };

  const areAllOptionsSelected = () => {
    return selectedStudent !== '학생' && selectedSubject !== '과목' && selectedBook !== '교재';
  };

  useEffect(() => {
    if (selectedStudent === '학생') {
      // 전체 선택 시 모든 수업 과목과 교재를 가져옴
      axios
        .get('/subjects')
        .then((response) => {
          const data = response.data;
          const allSubjects = data.subjects.map((subject) => subject.subjectName);
          setSubjectOptions(['과목', ...new Set(allSubjects)]);
          setBookOptions(['교재', ...new Set(data.subjects.map((subject) => subject.book))]);
        })
        .catch((error) => {
          console.log('Error fetching subjects:', error);
        });
    } else {
      // 특정 학생 선택 시 해당 학생의 수업 과목과 교재만 가져옴
      axios
        .get(`/subjects?subjectTutee=${selectedStudent}`)
        .then((response) => {
          const data = response.data;
          const studentSubjects = data.subjects.filter((subject) => subject.subjectTutee === selectedStudent);
          setSubjectOptions(['과목', ...new Set(studentSubjects.map((subject) => subject.subjectName))]);

          // 선택된 과목에 해당하는 교재를 가져옴
          const selectedSubjectBooks = studentSubjects
            .filter((subject) => subject.subjectName === selectedSubject)
            .map((subject) => subject.book);
          setBookOptions(['교재', ...new Set(selectedSubjectBooks)]);
        })
        .catch((error) => {
          console.log('Error fetching subjects:', error);
        });
    }
  }, [selectedStudent, selectedSubject]);

  useEffect(() => {
    if (selectedStudent !== '학생' && selectedSubject !== '과목' && selectedBook !== '교재') {
      // lessontable과 subjecttable에서 currentPage와 totalPages 가져오기
      axios
        .get(`/lessons?name=${selectedStudent}&subjectName=${selectedSubject}&book=${selectedBook}`)
        .then((response) => {
          const lessonData = response.data;
          const filteredLessons = lessonData.lessons.filter(
            (lesson) =>
              lesson.name === selectedStudent &&
              lesson.subjectName === selectedSubject &&
              lesson.book === selectedBook
          );

          if (filteredLessons.length > 0) {
            // 가장 큰 currentPage 값을 찾기 위해 reduce 메서드를 사용합니다.
            const maxCurrentPage = filteredLessons.reduce((maxPage, lesson) => {
              return lesson.currentPage > maxPage ? lesson.currentPage : maxPage;
            }, 0);
            setCurrentPage(maxCurrentPage);
          } else {
            setCurrentPage(0);
          }
        })
        .catch((error) => {
          console.log('Error fetching currentPage:', error);
        });

  
      axios
        .get(`/subjects?subjectTutee=${selectedStudent}&subjectName=${selectedSubject}&book=${selectedBook}`)
        .then((response) => {
          const subjectData = response.data;
          const filteredSubject = subjectData.subjects.find((subject) =>
          subject.subjectTutee === selectedStudent && subject.subjectName === selectedSubject && subject.book === selectedBook
        );

        if (filteredSubject) {
          setTotalPages(filteredSubject.totalPages);
        } else {
          setTotalPages(0);
        }
      })
      .catch((error) => {
        console.log('Error fetching totalPages:', error);
      });
    }
  }, [selectedStudent, selectedSubject, selectedBook]);
  function handleImageClick() {
    window.location.reload(); // 페이지를 새로 고침합니다.
  }

  return (
    <div>
        <img
          src="JOY2.svg"
          id="logo3"
          alt="Logo"
          onClick={handleImageClick}
        />

        <br /> <br />
        <div id="les_div1">
          <br />
          <select value={selectedStudent} onChange={handleStudentSelectChange} id="ld_select1">
            {studentOptions.map((student, index) => (
              <option key={index} value={student}>
                {student}
              </option>
            ))}
          </select><span id="ld_span1"> &nbsp; 학생의</span>
          <select value={selectedSubject} onChange={handleSubjectSelectChange} id="ld_select2">
            {subjectOptions.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select value={selectedBook} onChange={handleBookSelectChange} id="ld_select3">
            {bookOptions.map((book, index) => (
              <option key={index} value={book}>
                {book}
              </option>
            ))}
          </select>

        </div>
        <div id="les_div2">
          {areAllOptionsSelected() ? (
          <>
            {/* 진도율 바 */}
            {totalPages > 0 && (
              <div>
                <div id="les_div3">
                <span id="ld_span2">
                  과목 및 교재의 총 진도율은 &nbsp;</span>
                  <span id="ld_span3">{`${calculateProgress()}%`}</span>
                  <span id="ld_span6">&nbsp;입니다.</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#F0EDED', border: '1px solid #C9C9C9', borderRadius: '10px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${calculateProgress()}%`,
                      background: '#8596FF',
                      height: '20px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
        </div>
        {filterLessonsByStudentAndSubject().length > 0 ? (
          <table>
            <tbody>
              {filterLessonsByStudentAndSubject().map((lesson) => (
                <div 
                  key={lesson.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '13px',
                  }}
                >
                  <div id="ld_div2">
                    <div id="ld_div3">
                      <span id="ld_span4">●</span>&nbsp;&nbsp;
                      {format(parseISO(lesson.date), 'M월 d일')} 수업
                    </div>
                    <div id="ld_div4">
                      {lesson.num}회차 <span id="ld_span5"> / 8회차</span>
                    </div>
                    <div id="ld_div5">
                      <div id="ld_div6">오늘의 진도</div> &nbsp;
                      <div
                        id="ld_div7"
                        style={{
                          border: '1px solid #C9C9C9',
                          borderRadius: '20px',
                          backgroundColor: '#fff4f4',
                        }}
                      >
                        &nbsp;&nbsp;{lesson.study}
                      </div>
                    </div>
                    <div id="ld_div5">
                      <div id="ld_div6">오늘의 숙제</div> &nbsp;
                      <div
                        id="ld_div7"
                        style={{
                          border: '1px solid #C9C9C9',
                          borderRadius: '20px',
                          backgroundColor: '#fff4f4',
                        }}
                      >
                        &nbsp;&nbsp;{lesson.hw}
                      </div>
                    </div>
                    <br></br>
                    <br></br>
                    <Link to="/main-card-edit"><button onClick={() => onOpenMainCard(lesson)} id="ld_btn1">일지 수정</button></Link>
                  </div>
                </div>              
              ))}
            </tbody>
            
          </table>
        ) : (
          <p>수업일지가 없습니다.</p>
        )}  
        <br />    
        {/* 피드백 버튼 */}
        {areAllOptionsSelected() && totalPages > 0 && (
          <Link to="/feedback"><button id="les_btn" onClick={handleFeedbackClick}>
            피드백 보기
          </button></Link>
        )}      

        <br /> <br /><br /> <br /><br />
      </div>
  );
};

export default LessonDiary;