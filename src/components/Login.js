import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import './css/template.css';
import './css/Login.css';

function Login(props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useNavigate를 초기화

  const handleLogin = () => {
    const userData = {
      userId: id,
      userPassword: password,
    };

    fetch('/login', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.isLogin === '로그인 성공!') {
          alert(json.isLogin);
          navigate('/welcome'); // useNavigate를 통한 페이지 이동
          window.location.reload();
        } else {
          alert(json.isLogin);
          if (json.isLogin === '로그인 정보가 일치하지 않습니다.') {
            // 아무 작업 없이 그대로 로그인 페이지에 머무르게 됨
          }
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('로그인 과정에서 오류가 발생했습니다.');
      });
  };
  
  

  return (
    <>

          <img src="JOY2.svg" id="logo4" alt="Logo" />
      <br />
      <br />
      <br />
      <br />
      <div className="form">
        <p>
          <input
            className="login_input"
            type="text"
            name="username"
            placeholder="아이디"
            onChange={(event) => {
              setId(event.target.value);
            }}
          />
        </p>
        <p>
          <input
            className="login_input"
            type="password"
            name="pwd"
            placeholder="비밀번호"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </p>
          <br /> <br />
        <p>
          <input className="login_btn" type="submit" value="로그인" onClick={handleLogin} />
          </p>
      </div>
      <br /> 
      <p id="login_p">
        계정이 없으신가요?{' '}&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/signin" id="login_link">회원가입</Link> {/* Use Link to navigate to the signup page */}
      </p>
    </>
  );
};

export default Login;
