import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import './css/template.css';
import './css/LessonDiary.css';

const LessonDiaryStudent = ({ lessons, name, tutor, onOpenMainCardStudent, onFeedback }) => {
  const [selectedSubject, setSelectedSubject] = useState('전체');
  const [selectedBook, setSelectedBook] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const filterLessonsByStudentAndSubject = () => {
    let filteredLessons = [...lessons];

    if (selectedSubject !== '전체') {
      filteredLessons = filteredLessons.filter(lesson => lesson.subjectName === selectedSubject);
    }

    if (selectedBook !== '전체') {
      filteredLessons = filteredLessons.filter(lesson => lesson.book === selectedBook);
    }

    return filteredLessons.filter(lesson => lesson.name === name && lesson.tutorId === tutor);
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
    return selectedSubject !== '전체' && selectedBook !== '전체';
  };

  const subjects = [...new Set(lessons.map(lesson => lesson.subjectName))];
  const books = [...new Set(lessons.map(lesson => lesson.book))];

  useEffect(() => {
    if (selectedSubject !== '전체' && selectedBook !== '전체') {
      const filteredLessons = filterLessonsByStudentAndSubject();
      if (filteredLessons.length > 0) {
        const maxCurrentPage = filteredLessons.reduce((maxPage, lesson) => {
          return lesson.currentPage > maxPage ? lesson.currentPage : maxPage;
        }, 0);
        setCurrentPage(maxCurrentPage);
      } else {
        setCurrentPage(0);
      }
      // Assuming you fetch subjects data from an API
      axios
        .get(`/subjects?subjectTutee=${name}&subjectName=${selectedSubject}&book=${selectedBook}`)
        .then((response) => {
          console.log(response.data); // 서버 응답 데이터 확인
          const subjectData = response.data; // Accessing the "data" object
          const filteredSubject = subjectData.lessons.find((lesson) =>
            lesson.subjectTutee === name && lesson.subjectName === selectedSubject && lesson.book === selectedBook
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
  }, [name, selectedSubject, selectedBook]);

  return (
    <div>
        <img src="JOY2.svg" id="logo3" alt="Logo" />
        <br /> <br />

      <div id="les_div"><span id="les_p1">{name}</span> 학생의 수업일지</div><br />
        <div id="les_div1">
          <br />
        <select
          id="ld_select4"
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
        >
          <option value="전체 과목">전체 과목</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <select
          id="ld_select5"
          value={selectedBook}
          onChange={e => setSelectedBook(e.target.value)}
        >
          <option value="전체 교재">전체 교재</option>
          {books.map(book => (
            <option key={book} value={book}>
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

      
      {/* 일지 */}
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
                    <Link to="/main-card-student"><button onClick={() => onOpenMainCardStudent(lesson)} id="ld_btn1">일지 확인</button></Link>
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

export default LessonDiaryStudent;
