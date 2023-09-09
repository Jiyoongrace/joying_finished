import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/template.css';
import './css/Feedback.css';

const Feedback = ({ lessons, totalPages, onLesson }) => {
  console.log('total:', totalPages);
  const calculateFeedback = () => {
    const feedbackData = lessons.map((lesson) => ({
      id: lesson.id,
      name: lesson.name,
      subjectName: lesson.subjectName,
      study: lesson.study,
      currentPage: lesson.currentPage,
      grade: parseInt(lesson.grade),
      completed: lesson.completed,
    }));
    return feedbackData;
  };

  const feedbackData = calculateFeedback();
  const dataCount = feedbackData.length;

  const filteredStudyData = feedbackData.filter((data) => data.grade === 2);
  const maxCurrentPage = Math.max(...feedbackData.map((data) => data.currentPage));
  const completedTotal = feedbackData.reduce((total, data) => total + parseInt(data.completed), 0);

  const getEmotionIcon = (percentage) => {
    let comment = '';
    if (percentage >= 0 && percentage < 30) {
      comment = '나빴어요.';
    } else if (percentage >= 30 && percentage < 70) {
      comment = '무난해요.';
    } else if (percentage >= 70 && percentage < 100) {
      comment = '좋았어요!';
    } else if (percentage === 100) {
      comment = '최고였어요!';
    }
    return {
      emoji: getEmojiByPercentage(percentage),
      comment: comment,
    };
  };

  const getEmojiByPercentage = (percentage) => {
    if (percentage >= 0 && percentage < 30) {
      return '😖';
    } else if (percentage >= 30 && percentage < 70) {
      return '😐';
    } else if (percentage >= 70 && percentage < 100) {
      return '😊';
    } else if (percentage === 100) {
      return '🥰';
    } else {
      return '';
    }
  };

  // 모달 관련 state 정의
  const [modalEmoji, setModalEmoji] = useState('');
  const [modalComment, setModalComment] = useState('');
  const [showModal, setShowModal] = useState(false);

  // 모달 열기 함수
  const openModal = (emoji, comment) => {
    setModalEmoji(emoji);
    setModalComment(comment);
    setShowModal(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <img src="JOY2.svg" id="logo3" alt="Logo" />
      <br /> <br />
      <div key={feedbackData[0].id}>
        <div id="fb_div">
          <div id="fb_div2">
            <span id="fb_sp">{feedbackData[0].name}</span> 학생의
          </div>
          <div id="fb_div3">
            <span id="fb_sp2">{feedbackData[0].subjectName}</span> 과목 피드백입니다.
          </div>
        </div>
      </div>

      <br />
      <br />
      <div id="fb_div8">
        <span id="fb_sp3">●</span>&nbsp;
        <span id="fb_sp4">현재까지의 총 진도</span>
      </div>
      <div
        id="fb_div7"
        style={{
          border: '1px solid #C9C9C9',
          borderRadius: '20px',
          backgroundColor: '#fff4f4',
        }}
      >
        현재 {totalPages}페이지 중
        <br />
        {maxCurrentPage}페이지의 진도가 완료되었습니다.
      </div>

      <div id="fb_div9">
        <span id="fb_sp3">●</span>&nbsp;
        <span id="fb_sp4">학습 능력이 부족한 단원</span>
      </div>
      <div id="fb_div7"
      style={{
            border: '1px solid #C9C9C9',
            borderRadius: '20px',
            backgroundColor: '#fff4f4',
          }}
      >
      {filteredStudyData.map((data) => (
        <span
          key={data.id}
        >
          🔎 {data.study}<br />
        </span>
      ))}</div>

      <div id="fb_div10">
        <span id="fb_sp3">●</span>&nbsp;
        <span id="fb_sp4">숙제 이행률</span>
      </div>
      <div
        id="fb_div7"
        style={{
          border: '1px solid #C9C9C9',
          borderRadius: '20px',
          backgroundColor: '#fff4f4',
        }}
      >
        {((completedTotal / (dataCount * 10)) * 100).toFixed(2)}%의 이행률을 기록했습니다.{' '}

      </div>
      <br /> <br />
      <button id="fb_btn3" onClick={() => openModal(getEmotionIcon((completedTotal / (dataCount * 10)) * 100).emoji, getEmotionIcon((completedTotal / (dataCount * 10)) * 100).comment)}>
      {getEmotionIcon((completedTotal / (dataCount * 10)) * 100).emoji}
        </button>
      {/* 모달 렌더링 */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <p id="fb_p"><span id="fb_sp">{feedbackData[0].name}</span> 학생의</p>
            <p id="fb_p"><span id="fb_sp2">{feedbackData[0].subjectName}</span> 과목 학습 태도가</p>
            <p id="fb_p2">{modalComment}
            {getEmotionIcon((completedTotal / (dataCount * 10)) * 100).emoji}</p>
            <Link to="/lesson-diary">
              <button id="fb_btn2" className="close-button" onClick={closeModal}>
              닫기
            </button></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
