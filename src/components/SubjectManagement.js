import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/template.css';
import './css/SubjectManagement.css';
import { selectClasses } from '@mui/material';

const SubjectManagement = ({ students, selectStudent }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [book, setBook] = useState('');
  const [selectedStudentSubjects, setSelectedStudentSubjects] = useState([]);

  console.log("selectedStudent:", selectedStudent);

  useEffect(() => {
    fetchSubjects();
    setSelectedStudent(selectStudent);
  }, []);

  const fetchSubjects = () => {
    fetch('/subjects')
      .then((res) => res.json())
      .then((json) => {
        setSubjects(json.subjects);
      })
      .catch((error) => {
        console.log('Error fetching subjects:', error);
      });
  };
  

  const handleDeleteSubject = (subjectId) => {
    fetch(`/subjects/${subjectId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          fetchSubjects();
        }
      })
      .catch((error) => {
        console.log('Error deleting subject:', error);
      });
  };


  const handleCreateSubject = () => {
    fetch('/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subjectName,
        totalPages,
        book,
        selectedStudent,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          fetchSubjects();
          setSubjectName('');
          setTotalPages('');
          setBook('');
        }
      })
      .catch((error) => {
        console.log('Error creating subject:', error);
      });
  };

  const fetchStudentSubjects = (studentName) => {
    const endpoint = `/subjects?subjectTutee=${studentName}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data;

        setSelectedStudentSubjects(data.subjects);
      })
      .catch((error) => {
        console.log('Error fetching student subjects:', error);
      });
  };

  return (
    <div>
      <img src="JOY2.svg" id="logo3" alt="Logo" />
        <br /> <br />
      {students && students.length > 0 && (
        <div>
          <select
            id="sub_select1"
            value={selectedStudent || selectStudent} // 이 부분 수정
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedStudent(selectedValue);
              fetchStudentSubjects(selectedValue);
            }}
          >
            <option value={selectStudent}>{selectStudent}</option> {/* 이 부분 수정 */}
            {students.map((student, index) => (
              <option key={index} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>

        </div>
      )}
      <br /><br />
      <div id="sub_div1">
        <span id="sub_sp1">과목</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <select id="sub_select2"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        >
          <option value="">과목을 선택해 주세요</option>
          <option value="고등수학_상">고등수학_상</option>
          <option value="고등수학_하">고등수학_하</option>
          <option value="수1">수1</option>
          <option value="수2">수2</option>
          <option value="확률과 통계">확률과 통계</option>
          <option value="미적분">미적분</option>
          <option value="기하">기하</option>
        </select></div>
        <div id="sub_div1">
        <span id="sub_sp2">총 페이지 수</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          id="sub_input1"
          type="text"
          placeholder="총 페이지 수를 입력해 주세요"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
          style={{ border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4' }}
        />
        </div>
        <div id="sub_div1">
        <span id="sub_sp3">교재</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          id="sub_input1"
          type="text"
          placeholder="교재를 입력해 주세요"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          style={{ border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4' }}
        /></div>
        <button id="sub_btn" onClick={handleCreateSubject}>등록</button>
      

      <br></br><br></br><br></br>

      <span id="sub_sp4">담당 학생 및 과목</span><br></br><br></br>
      <div>
        {subjects.map((subject) => (
          <div id="sub_div2" key={subject.id}>
          학생 <input id="sub_div5"
          type="text"
          name="subjectTutee"
          value={subject.subjectTutee}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
           과목 <input id="sub_div5"
          type="text"
          name="subjectName"
          value={subject.subjectName}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
           교재 <input id="sub_div5"
          type="text"
          name="book"
          value={subject.book}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
           진도 <input id="sub_div5"
          type="text"
          name="totalPages"
          value={subject.totalPages}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
            <button id="sub_btn2" onClick={() => handleDeleteSubject(subject.id)}>삭제</button>
          </div>
        ))}
      </div>
      <br /><br /><br /><br />
    </div>
  );
};

export default SubjectManagement;