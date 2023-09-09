import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './css/MainCardEdit.css';

const MainCardStudent = ({ lesson, isLoggedIn }) => {
  

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

            <br /><br /><br /><br />
        <div id="edit_div5">
        <label id="edit_label">과목 &nbsp;&nbsp;</label>
        <input id="edit_input"
          type="text"
          name="subjectName"
          value={lesson.subjectName}
          style={{ width: '230px'}}
        />
      </div>
      <br /><br />


      <div id="edit_div5">
        <label id="edit_label">교재 &nbsp;&nbsp;</label>
        <input id="edit_input"
          type="text"
          name="book"
          value={lesson.book}
          style={{ width: '230px'}}
        />
      </div>
      <br /><br />


      <div id="edit_div5">
        <label id="edit_label">진도 &nbsp;&nbsp;</label>
        <input id="edit_input"
          type="text"
          name="content"
          value={lesson.study}
          style={{ width: '230px'}}
        />
      </div>
      <br /><br />


        <div id="edit_div5">
        <label id="edit_label">숙제 &nbsp;&nbsp;</label>
        <input id="edit_input"
          type="text"
          name="hw"
          value={lesson.hw}
          style={{ width: '230px'}}
        />
      </div>
      <br /><br />

      <div className="edit_div5">
        <label id="edit_label2">학습 수행도</label>
      <div id="grade-options">
        <input
          type='radio'
          name="grade"
          id="high"
          value={10}
          checked={lesson.grade === 10}
        />
        <label htmlFor="high">상</label>
        <input
          type='radio'
          name="grade"
          id="medium"
          value={5}
          checked={lesson.grade === 5}
        />
        <label htmlFor="medium">중</label>
        <input
          type='radio'
          name="grade"
          id="low"
          value={2}
          checked={lesson.grade === 2}
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
          checked={lesson.completed === 10}
        />
        <label htmlFor="completed-yes">O</label>
        <input
          type='radio'
          name="completed"
          id="completed-triangle"
          value={5}
          checked={lesson.completed === 5}
        />
        <label htmlFor="completed-triangle">△</label>
        <input
          type='radio'
          name="completed"
          id="completed-no"
          value={2}
          checked={lesson.completed === 2}
        />
        <label htmlFor="completed-no">X</label>
      </div></div>
      <Link to="/lesson-diary">
        <button id="edit_btn">확인</button>
      </Link>
    </div>
  );
};

export default MainCardStudent;