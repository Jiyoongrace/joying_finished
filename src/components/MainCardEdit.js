import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './css/MainCardEdit.css';

const MainCardEdit = ({ lesson, createLesson, updateLesson, deleteLesson, isLoggedIn }) => {
  // editedLesson 객체를 초기화할 때 lesson.grade와 lesson.completed 값을 사용
  const [editedLesson, setEditedLesson] = useState({
    ...lesson,
    grade: lesson.grade, // 기본값으로 10 설정
    completed: lesson.completed, // 기본값으로 5 설정
  });
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [subjectBooks, setSubjectBooks] = useState([]);

  useEffect(() => {
    setEditedLesson({ ...lesson });

    // 학생의 수강 과목을 가져옴
    if (lesson.name) {
      fetchStudentSubjects(lesson.name);
    }
  }, [lesson]);

  const fetchStudentSubjects = (studentName) => {
    const endpoint = `/subjects?subjectTutee=${studentName}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data;
        const studentSubjects = data.subjects.filter(
          (subject) => subject.subjectTutee === studentName
        );

        setStudentSubjects(studentSubjects);
      })
      .catch((error) => {
        console.log('Error fetching student subjects:', error);
      });
  };

  const fetchSubjectBooks = (selectedSubjectName, selectedSubjectTutee) => {
    const endpoint = `/subjects?subjectName=${selectedSubjectName}&subjectTutee=${selectedSubjectTutee}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data;
        const subjectBooks = data.subjects.filter(
          (subject) => subject.subjectname === selectedSubjectName && subject.subjectTutee === selectedSubjectTutee
        );
        setSubjectBooks(subjectBooks);
      })
      .catch((error) => {
        console.log('Error fetching subject books:', error);
      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'grade' || name === 'completed') {
      // 라디오 버튼 클릭 시 시각적으로 선택되도록 상태를 업데이트합니다.
      setEditedLesson((prevLesson) => ({
        ...prevLesson,
        [name]: parseInt(value), // 숫자로 파싱하여 저장
      }));
    } else if (name === 'subjectName') {
      const selectedSubject = studentSubjects.find((subject) => subject.subjectName === value);
      if (selectedSubject) {
        setEditedLesson((prevLesson) => ({
          ...prevLesson,
          [name]: value,
        }));

        fetchSubjectBooks(selectedSubject.subjectName, lesson.name);
      }
    } else {
      setEditedLesson((prevLesson) => ({
        ...prevLesson,
        [name]: value,
      }));
    }
  };

  const handleUpdateLesson = () => {
    updateLesson(editedLesson);
  };

  const handleDeleteLesson = () => {
    deleteLesson(lesson.id);
  };

  const handleCreateLesson = () => {
    const newLesson = {
      ...editedLesson,
    };
    createLesson(newLesson);
  };

  const renderSubjectOptions = () => {
    const uniqueSubjects = Array.from(new Set(studentSubjects.map((subject) => subject.subjectName)));

    return (
      <>
        <option value="">과목 선택</option>
        {uniqueSubjects.map((subjectName) => (
          <option key={subjectName} value={subjectName}>
            {subjectName}
          </option>
        ))}
      </>
    );
  };

  const renderStudyOptions = () => {
    // 선택된 subjectName에 따라서 진도 옵션들을 동적으로 생성합니다.
    if (editedLesson.subjectName === '고등수학_상') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="다항식의 연산">다항식의 연산</option>
          <option value="인수분해">인수분해</option>
          <option value="항등식과 미정계수">항등식과 미정계수</option>
          <option value="나머지 정리">나머지 정리</option>
          <option value="복소수">복소수</option>
          <option value="이차방정식">이차방정식</option>
          <option value="이차방정식의 판별식">이차방정식의 판별식</option>
          <option value="이차방정식의 근과 계수의 관계">이차방정식의 근과 계수의 관계</option>
          <option value="이차방정식과 이차함수">이차방정식과 이차함수</option>
          <option value="여러 가지 방정식">여러 가지 방정식</option>
          <option value="일차부등식과 연립일차부등식">일차부등식과 연립일차부등식</option>
          <option value="이차부등식과 연립이차부등식">이차부등식과 연립이차부등식</option>
          <option value="평면좌표">평면좌표</option>
          <option value="직선의 방정식">직선의 방정식</option>
          <option value="원의 방정식">원의 방정식</option>
          <option value="도형의 이동">도형의 이동</option>
        </>
      );
    } else if (editedLesson.subjectName === '고등수학_하') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="집합의 뜻과 표현">집합의 뜻과 표현</option>
          <option value="집합의 연산">집합의 연산</option>
          <option value="명제와 조건">명제와 조건</option>
          <option value="명제의 증명">명제의 증명</option>
          <option value="함수">함수</option>
          <option value="합성함수와 역함수">합성함수와 역함수</option>
          <option value="유리식과 유리함수">유리식과 유리함수</option>
          <option value="무리식과 무리함수">무리식과 무리함수</option>
          <option value="경우의 수">경우의 수</option>
          <option value="순열과 조합">순열과 조합</option>
        </>
      );
    } else if (editedLesson.subjectName === '수1') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="지수">지수</option>
          <option value="로그">로그</option>
          <option value="상용로그">상용로그</option>
          <option value="지수함수와 로그함수">지수함수와 로그함수</option>
          <option value="지수방정식과 로그방정식">지수방정식과 로그방정식</option>
          <option value="지수부등식과 로그부등식">지수부등식과 로그부등식</option>
          <option value="삼각함수의 정의">삼각함수의 정의</option>
          <option value="삼각함수의 기본 성질">삼각함수의 기본 성질</option>
          <option value="삼각함수의 그래프">삼각함수의 그래프</option>
          <option value="삼각방정식과 삼각부등식">삼각방정식과 삼각부등식</option>
          <option value="삼각형과 삼각함수">삼각형과 삼각함수</option>
          <option value="등차수열">등차수열</option>
          <option value="등비수열">등비수열</option>
          <option value="수열의 합">수열의 합</option>
          <option value="수학적 귀납법">수학적 귀납법</option>
        </>
      );
    } else if (editedLesson.subjectName === '수2') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="함수의 극한">함수의 극한</option>
          <option value="함수의 연속">함수의 연속</option>
          <option value="함수의 미분">함수의 미분</option>
          <option value="곡선의 접선과 미분">곡선의 접선과 미분</option>
          <option value="극대극소와 미분">극대*극소와 미분</option>
          <option value="최대최소와 미분">최대*최소와 미분</option>
          <option value="방정식*부등식과 미분">방정식*부등식과 미분</option>
          <option value="속도*가속도와 미분">속도*가속도와 미분</option>
          <option value="부정적분">부정적분</option>
          <option value="정적분">정적분</option>
          <option value="정적분으로 정의된 함수">정적분으로 정의된 함수</option>
          <option value="넓이와 적분">넓이와 적분</option>
          <option value="속도*거리와 적분">속도*거리와 적분</option>
        </>
      );
    } else if (editedLesson.subjectName === '확률과 통계') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="여러 가지 순열">여러 가지 순열</option>
          <option value="중복조합">중복조합</option>
          <option value="이항정리">이항정리</option>
          <option value="확률의 뜻과 활용">확률의 뜻과 활용</option>
          <option value="조건부확률">조건부확률</option>
          <option value="이산확률변수의 확률분포">이산확률변수의 확률분포</option>
          <option value="연속확률변수의 확률분포">연속확률변수의 확률분포</option>
          <option value="통계적 추정">통계적 추정</option>
        </>
      );
    } else if (editedLesson.subjectName === '미적분') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="수열의 극한">수열의 극한</option>
          <option value="급수">급수</option>
          <option value="삼각함수의 덧셈정리">삼각함수의 덧셈정리</option>
          <option value="함수의 극한">함수의 극한</option>
          <option value="함수의 미분">함수의 미분</option>
          <option value="여러 가지 함수의 도함수">여러 가지 함수의 도함수</option>
          <option value="곡선의 접선과 미분">곡선의 접선과 미분</option>
          <option value="도함수의 성질">도함수의 성질</option>
          <option value="극대극소와 미분">극대*극소와 미분</option>
          <option value="최대최소와 미분">최대*최소와 미분</option>
          <option value="방정식*부등식과 미분">방정식*부등식과 미분</option>
          <option value="속도*가속도와 미분">속도*가속도와 미분</option>
          <option value="부정적분">부정적분</option>
          <option value="치환적분과 부분적분">치환적분과 부분적분</option>
          <option value="정적분의 계산">정적분의 계산</option>
          <option value="여러 가지 정적분에 관한 문제">여러 가지 정적분에 관한 문제</option>
          <option value="넓이와 적분">넓이와 적분</option>
          <option value="부피와 적분">부피와 적분</option>
          <option value="속도*거리와 적분">속도*거리와 적분</option>
        </>
      );
    } else if (editedLesson.subjectName === '기하') {
      return (
        <>
          <option value="">진도 선택</option>
          <option value="포물선의 방정식">포물선의 방정식</option>
          <option value="타원의 방정식">타원의 방정식</option>
          <option value="쌍곡선의 방정식">쌍곡선의 방정식</option>
          <option value="벡터의 뜻과 연산">벡터의 뜻과 연산</option>
          <option value="평면벡터의 성분과 내적">평면벡터의 성분과 내적</option>
          <option value="직선과 원의 벡터방정식">직선과 원의 벡터방정식</option>
          <option value="공간도형">공간도형</option>
          <option value="정사영과 전개도">정사영과 전개도</option>
          <option value="공간좌표">공간좌표</option>
          <option value="공간벡터의 성분과 내적">공간벡터의 성분과 내적</option>
        </>
      );
    } else {
      // 선택되지 않은 경우 기본 옵션을 반환합니다.
      return <option value="">진도 선택</option>;
    }
  };

  return (
    <div className="main-card">
       <img src="JOY2.svg" id="logo3" alt="Logo" />
      <br /><br />
      <div id="edit_div"><span id="edit_p">{lesson.name}</span>
      <span id="edit_sp3">&nbsp;&nbsp;학생의 수업일지</span></div>

      <br /><br /><br />
      <div id="edit_div4">
            <div id="edit_div2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span id="edit_sp">●</span>&nbsp;&nbsp;
              {new Date(lesson.date).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric'
            })} 수업
            </div>
            <div id="edit_div3">
              {lesson.num}회차 <span id="edit_sp2"> / 8회차&nbsp;&nbsp;&nbsp;</span>
            </div></div>

            <br /><br /><br />

      {/* 학생이 수강 과목이 존재하는 경우에만 해당 학생의 수강 과목을 보여줌 */}
      <div id="edit_div5">     
          <label id="edit_label">과목 &nbsp;&nbsp;</label>
            <select id="edit_sel"
             style={{ width: '220px'}}
                name="subjectName"
                value={editedLesson.subjectName || ''}
                onChange={handleInputChange}
                disabled={!isLoggedIn}
              >
                {renderSubjectOptions()}

             </select>
      </div>
      <br /><br />
      <div id="edit_div5">      
          <label id="edit_label">교재 &nbsp;&nbsp;</label>
          <select id="edit_sel"
          style={{ width: '220px'}}
          name="book"
          value={editedLesson.book || ''}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        >
          <option value="">교재 선택</option>
          {studentSubjects
            .filter((subject) => subject.subjectName === editedLesson.subjectName)
            .map((subject) => (
              <option key={subject.id} value={subject.book}>
                {subject.book}
              </option>
            ))}
        </select>
      </div>

      <br /><br />

      <div id="edit_div5">
        <label id="edit_label">진도 &nbsp;&nbsp;</label>
        {/* 변경된 부분: select box로 진도 선택 가능 */}
        <select id="edit_sel"
        style={{ width: '220px'}}
          name="study"
          value={editedLesson.study || ''}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        >
          {renderStudyOptions()}
        </select>
      </div>
      <br /><br />


      <div id="edit_div5">
        <label id="edit_label">숙제 &nbsp;&nbsp;</label>
        <input id="edit_input"
          type="text"
          name="hw"
          value={editedLesson.hw || ''}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
          style={{ width: '230px'}}
        />
      </div>
      <br /><br />


      <div id="edit_div5">
        <label id="edit_label">진도 페이지 &nbsp;&nbsp;</label>
        <input id="edit_input"
          type="number"
          name="currentPage"
          value={editedLesson.currentPage || ''}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
          style={{ width: '170px'}}
        />
      </div>
      <br /><br /><br /><br /><br />

      <div className="edit_div5">
        <label id="edit_label2">학습 수행도</label>
      <div id="grade-options">
        <input
          type='radio'
          name="grade"
          id="high"
          value={10}
          checked={editedLesson.grade === 10}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        />
        <label htmlFor="high">상</label>
        <input
          type='radio'
          name="grade"
          id="medium"
          value={5}
          checked={editedLesson.grade === 5}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        />
        <label htmlFor="medium">중</label>
        <input
          type='radio'
          name="grade"
          id="low"
          value={2}
          checked={editedLesson.grade === 2}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        />
        <label htmlFor="low">하</label>
      </div></div>
      <br /><br />

      
      
      <div className="edit_div5">
      <label id="edit_label2">숙제 수행도</label>
      <div id="completed-options">
        <input
          type='radio'
          name="completed"
          id="completed-yes"
          value={10}
          checked={editedLesson.completed === 10}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        />
        <label htmlFor="completed-yes">O</label>
        <input
          type='radio'
          name="completed"
          id="completed-triangle"
          value={5}
          checked={editedLesson.completed === 5}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        />
        <label htmlFor="completed-triangle">△</label>
        <input
          type='radio'
          name="completed"
          id="completed-no"
          value={2}
          checked={editedLesson.completed === 2}
          onChange={handleInputChange}
          disabled={!isLoggedIn}
        />
        <label htmlFor="completed-no">X</label>
      </div></div>
      <br /><br /><br /><br /><br /><br />

      {isLoggedIn ? (
        <Link to="/lesson-diary">
          <button id="edit_btn" onClick={handleUpdateLesson}>수정</button>
          <button id="edit_btn" onClick={handleDeleteLesson}>삭제</button>
        </Link>
      ) : (
        <button id="edit_btn" onClick={handleCreateLesson}>생성</button>
      )}<br /><br /><br /><br /><br />
    </div>
  );
};

export default MainCardEdit;