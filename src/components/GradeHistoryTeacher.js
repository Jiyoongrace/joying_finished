import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const GradeHistoryTeacher = ({ name }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [grades, setGrades] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [color, setColor] = useState('');
  const [options, setOptions] = useState({
    scales: {
      x: {
        type: 'category',
        beginAtZero: true,
        position: 'bottom',
        ticks: {
          color: 'black', // x 축 글자 색상
          font: {
            family: 'Pretendard', // 글꼴
            size: 16, // 글꼴 크기
            color: '#6F3500',
          },
        },
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'black', // y 축 글자 색상
          font: {
            family: 'Pretendard', // 글꼴
            size: 14, // 글꼴 크기
            color: '#6F3500',
          },
        },
      },
    },
  });

  useEffect(() => {
    fetchStudents();
  }, []);


  const fetchStudents = async () => {
    try {
      const response = await axios.get('/grades/students');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchStudentGrades = async (student) => {
    try {
      const response = await axios.get(`/grades/students/${student}`);
      setGrades(response.data.grades);
      //console.log('grades:', response.data.grades[0]);
      //onsole.log('grades:', grades);
    } catch (error) {
      console.error('Error fetching student grades:', error);
    }
  };

  const fetchStudentColor = async (student) => {
    try {
      const response = await axios.get(`/grades/students/${student}`);
      setColor(response.data.grades[0].color); // 가져온 color 값을 상태에 저장
      console.log('colorr:', response.data.grades[0].color);
      console.log('color:', color);
    } catch (error) {
      console.error('Error fetching student color:', error);
    }
  };

  useEffect(() => {
    console.log('color is:', color);
  }, [color]);

  const generateChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const selectedStudentGrades = grades.filter((grade) => grade.grade === selectedGrade);
    const examLabels = selectedStudentGrades.map((grade) => grade.exam);
    const examScores = selectedStudentGrades.map((grade) => grade.score);

    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: examLabels,
        datasets: [
          {
            label: '모의고사 성적',
            data: examScores,
            backgroundColor: '#ffffff', // 이 부분을 가져온 color 값으로 설정
            borderColor: color,
            borderWidth: 5,
            borderRadius: 15, // 막대의 둥근 모서리
            maxBarThickness: 40,
          },
        ],
      },
      options: options,
    });
    setChartInstance(newChartInstance);
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
    fetchStudentGrades(event.target.value);
    fetchStudentColor(event.target.value);
  };

  return (
    <div>
      
      <img src="JOY2.svg" id="logo3" alt="Logo" />
      <br /> <br />
      <div id="les_div"><span id="les_p1">&nbsp;&nbsp;&nbsp;{name}</span> 선생님의 성적 관리</div><br />
      <div id="gd_div">
      <select id="gd_select" value={selectedStudent} onChange={handleStudentChange}>
        <option value="">학생 선택</option>
        {students.map((student) => (
          <option key={student.username} value={student.username}>
            {student.name}
          </option>
        ))}
      </select>
      <select id="gd_select" value={selectedGrade} onChange={(event) => setSelectedGrade(event.target.value)}>
        <option value="">학년 선택</option>
        {grades
          .map((grade) => grade.grade)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
      </select>
      <button id="gd_btn3" onClick={() => generateChart()}>그래프 보기</button></div>
      <br /> <br />
      <div style={{ position: 'relative', height: '400px' }}>
        <canvas id="graphCanvas"
        style={{ margin: '0 auto', width: '345px',
        backgroundColor: '#F8F8F8', borderRadius: '15px',
        border: '3px solid #a6b2ff'}}>
        </canvas>
      </div>
      <div id="sub_div7">
          {grades
          .sort((a, b) => {
            // 학년 및 월별 정렬 로직 유지
          })
          .map((grade) => (
          <div id="sub_div6" key={grade.id}>
          학년 <input id="sub_div5"
          type="text"
          name="학년"
          value={grade.grade}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
           월별 <input id="sub_div5"
          type="text"
          name="월별"
          value={grade.exam}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
           과목 <input id="sub_div5"
          type="text"
          name="과목"
          value={grade.subject}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br />
           점수 <input id="sub_div5"
          type="text"
          name="점수"
          value={grade.score}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        /><br /></div>
        ))}
      </div><br /><br /><br /><br />
    </div>
  );
};

export default GradeHistoryTeacher;
