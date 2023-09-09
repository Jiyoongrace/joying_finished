import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const GradeHistory = ({name}) => {
  const [subject, setSubject] = useState('');
  const [exam, setExam] = useState('');
  const [grade, setGrade] = useState('');
  const [score, setScore] = useState('');
  const [grades, setGrades] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [chartInstance, setChartInstance] = useState(null); // Chart 인스턴스 상태 추가
  const [availableMonths, setAvailableMonths] = useState([]); // 월 선택지를 저장하는 상태 추가
  const [selectedGrade, setSelectedGrade] = useState(''); // 선택된 학년 상태 추가
  const [color, setColor] = useState('');

  useEffect(() => {
    fetchGrades();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/userinfo');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get('/grades');
      setGrades(response.data.grades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchStudentColor = async (name) => {
    try {
      const response = await axios.get('/grades');
      setColor(response.data.color); // 가져온 color 값을 상태에 저장
    } catch (error) {
      console.error('Error fetching student color:', error);
    }
  };

  useEffect(() => {
  }, [color]);

  const handleSaveGrade = async () => {
    try {
      if (!currentUser) {
        console.error('User is not logged in');
        return;
      }
  
      const response = await axios.post('/grades', {
        subject,
        exam,
        grade,
        score,
      });
  
      fetchGrades();
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleShowGraph = () => {
    fetchGrades(); // 데이터 업데이트
    const data = generateGraphData();

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = document.getElementById('graphCanvas');
    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });

    setChartInstance(newChartInstance);
  };

  
  const generateGraphData = () => {
    // 학년에 따라 데이터를 필터링하여 가져옵니다.
    const filteredGrades = grades.filter(grade => grade.grade === selectedGrade);
    
    // 월 순으로 데이터 정렬
    const sortedGrades = filteredGrades.sort((a, b) => {
      const monthOrder = {
        '3월': 1,
        '4월': 2,
        '6월': 3,
        '7월': 4,
        '9월': 5,
        '10월': 6,
        '11월': 7,
        '수능': 8,
      };
      return monthOrder[a.exam] - monthOrder[b.exam];
    });
    
    const labels = sortedGrades.map((grade) => `${grade.grade} - ${grade.exam}`);
    const scores = sortedGrades.map((grade) => grade.score);

    return {
      labels,
      datasets: [
        {
          label: '모의고사 성적',
          data: scores,
          backgroundColor: '#ffffff', // 이 부분을 가져온 color 값으로 설정
          borderColor: color,
          borderWidth: 5,
          borderRadius: 15, // 막대의 둥근 모서리
          maxBarThickness: 40,
        },
      ],
    };
  };
  const options = {
    scales: {
      x: {
        type: 'category', // Change this to 'category'
        beginAtZero: true,
        position: 'bottom',
      },
      y: {
        type: 'linear', // Keep this as 'linear'
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
    setSelectedGrade(e.target.value); // 선택된 학년 업데이트
    updateExamOptions(e.target.value); // 학년에 따라 월 선택지 업데이트
    fetchStudentColor(e.target.value);
  };

  const updateExamOptions = (selectedGrade) => {
    let months = [];
    if (selectedGrade === '고1' || selectedGrade === '고2') {
      months = ['3월', '6월', '9월', '11월'];
    } else if (selectedGrade === '고3') {
      months = ['3월', '4월', '6월', '7월', '9월', '10월', '수능'];
    }
    setExam('');
    setAvailableMonths(months);
  };

  const handleDeleteGrade = async (gradeId) => {
    try {
      await axios.delete(`/grades/${gradeId}`);
      fetchGrades(); // 성적 목록 다시 불러오기
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
  };
  
  return (
    <div>
      <img src="JOY2.svg" id="logo3" alt="Logo" />
      <br /> <br />
      <div id="les_div"><span id="les_p1">&nbsp;&nbsp;{name}</span> 학생의 성적 그래프</div><br />
      <div id="gd_div2">
        <select id="gd_select2"
          value={grade}
          onChange={handleGradeChange}
        >
          <option value="">학년 선택</option>
          <option value="고1">고1</option>
          <option value="고2">고2</option>
          <option value="고3">고3</option>
        </select>
        <select id="gd_select2"
          value={exam}
          onChange={(e) => setExam(e.target.value)}
        >
          <option value="">월별 선택</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <select id="gd_select2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">과목 선택</option>
          <option value="통합">통합(선택없음)</option>
          <option value="확률과 통계">확률과 통계</option>
          <option value="미적분">미적분</option>
          <option value="기하">기하</option>
        </select></div>
        <div id="gd_div2">
        <input id="sub_div5"
          type="number"
          placeholder="점수 입력"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          style={{ width: '130px', border: '1px solid #C9C9C9', borderRadius: '10px', backgroundColor: '#fff4f4'}}
        />
        <button id="gd_btn4" onClick={handleSaveGrade}>저장</button>
      <button id="gd_btn3" onClick={handleShowGraph}>그래프 보기</button>
    </div><br />


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
            // 학년 순으로 정렬하고 같은 학년 내에서 월 순으로 정렬
            if (a.grade !== b.grade) {
              const gradeOrder = { '고1': 1, '고2': 2, '고3': 3 };
              return gradeOrder[a.grade] - gradeOrder[b.grade];
            } else {
              const monthOrder = {
                '3월': 1,
                '4월': 2,
                '6월': 3,
                '7월': 4,
                '9월': 5,
                '10월': 6,
                '11월': 7,
                '수능': 8,
              };
              return monthOrder[a.exam] - monthOrder[b.exam];
            }
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
        /><br />&nbsp;&nbsp;<button id="sub_btn2" onClick={() => handleDeleteGrade(grade.id)}>삭제</button>
        </div>
        ))}
      </div>
      <br /><br /><br /><br />
    </div>
  );
};

export default GradeHistory;
