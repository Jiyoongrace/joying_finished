import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import './css/template.css';
import './css/Signin.css';

const Signin = (props) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tutorId, setTutorId] = useState('');
  const [role, setRole] = useState(1);
  const [color, setColor] = useState('#000000'); // Set initial color value to black
  const navigate = useNavigate(); 
  
  const handleRoleChange = (event) => {
    setRole(parseInt(event.target.value));
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <>
    <br />
          <img src="JOY2.svg" id="logo2" alt="Logo" />
      <br />
      <br />
      <div className="form">
        {/* Role selection */}
        <div className="mb-3">
            <div className="form_toggle row-vh d-flex flex-row justify-content-between">
              <div className="signin_form_radio_btn">
                <input
                  id="radio-1"
                  type="radio"
                  name="role"
                  value={1} // 1 represents teacher
                  checked={role === 1}
                  onChange={handleRoleChange}
                />
                <label htmlFor="radio-1">선생님</label>
              </div>
              <div className="signin_form_radio_btn">
                <input
                  id="radio-2"
                  type="radio"
                  name="role"
                  value={2} // 2 represents student
                  checked={role === 2}
                  onChange={handleRoleChange}
                />
                <label htmlFor="radio-2">학생</label>
              </div>
              <p>
              
              </p>
            </div>
        </div>
        {/* Input fields based on selected role */}
        {role === 1 ? (
          // Render teacher form if role is 1 (teacher)
          <>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="이름"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="아이디"
                onChange={(event) => {
                  setId(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="password"
                placeholder="비밀번호"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="password"
                placeholder="비밀번호 확인"
                onChange={(event) => {
                  setPassword2(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="전화번호"
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
              />
            </p>
            <p><span id="signin_color_p">색깔 선택&nbsp;&nbsp;</span>
              <input
                className="signin_color"
                type="color"
                value={color}
                onChange={handleColorChange}
              />
            </p>
          </>
        ) : (
          // Render student form if role is 2 (student)
          <>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="선생님 아이디"
                onChange={(event) => {
                  setTutorId(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="학부모 전화번호"
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="이름"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="text"
                placeholder="아이디"
                onChange={(event) => {
                  setId(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="password"
                placeholder="비밀번호"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </p>
            <p>
              <input
                className="signin_input"
                type="password"
                placeholder="비밀번호 확인"
                onChange={(event) => {
                  setPassword2(event.target.value);
                }}
              />
            </p>
            <p><span id="signin_color_p">색깔 선택&nbsp;&nbsp;</span>
              <input
                className="signin_color"
                type="color"
                value={color}
                onChange={handleColorChange}
              />
            </p>
          </>
        )}
        {/* Submit button */}<Link to="/welcome">
        <p>
          <input
            className="signin_btn"
            type="submit"
            value="회원가입"
            onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
                userPassword2: password2,
                userName: name,
                role: role, // Include role in the userData object
                tutorId: tutorId, // Include tutorId in the userData object
                phone: phone, // Include phone in the userData object
                color: color, // Include color in the userData object
              };
              fetch('/signin', {
                method: 'post',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.isSuccess === 'True') {
                    alert('회원가입이 완료되었습니다!');
                    navigate('/login'); // useNavigate를 통한 페이지 이동
                    window.location.reload();
                  } else {
                    alert(json.isSuccess);
                  }
                });
            }}
          />
        </p></Link>
      </div>

      
      {/* Login link */}
      <p id="signin_p">
        로그인 화면으로 돌아가기{' '}&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/login" id="signin_link">
          로그인
        </Link>
      </p>

    </>
  );
};

export default Signin;