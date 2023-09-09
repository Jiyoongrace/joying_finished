import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './css/template.css';
import './css/Welcome.css';

const Welcome = ({ name, username, role, tutor, students, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
    <br />
          <img src="JOY2.svg" id="logo2" alt="Logo" />
      <br /> <br />
      <br /> <br />
      <p><span id="wel_p">{name}</span> {role === 1 ? '선생님' : '학생'}</p>
      <br></br>
      <div id="wel_div">
      <span id="wel_p2">아이디</span>
          <div className="wel_input">{username} </div>
        </div>
        <br></br>
        {role === 1 && (
          <div id="wel_div">
            <span id="wel_p3">담당 학생</span>
            <ul className="wel_input2">
            {students.map((student) => (
              <li key={student.name} style={{ listStyleType: 'None', color: student.color }}>
                <span> ● </span>{student.name}
              </li>
            ))}
            </ul>
          </div>
        )}
      {role === 2 && (
                  <div id="wel_div">
                  <span id="wel_p4">담당 선생님</span>
                  <div className="wel_input">{tutor}</div>
                </div>
      )}
      <br /><br />
      <Link to="/user-info-edit">
        <button className="wel_btn">회원정보 수정</button>
      </Link> <br/><br />
      <Link to="/" onClick={handleLogout} id="wel_link">로그아웃</Link> {/* Use Link to navigate to the login page */}
    </div>
  );
};

export default Welcome;