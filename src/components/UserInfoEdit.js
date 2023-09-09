import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/template.css';
import './css/UserInfoEdit.css';

const UserInfoEdit = ({ userData, setMode, fetchUserInfo }) => {
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [password, setPassword] = useState('');
  const [color, setColor] = useState(userData.color || '');

  useEffect(() => {
    if (userData.color) {
      setColor(userData.color);
    }
  }, [userData.color]);

  const handleUpdate = () => {
    const updatedData = {
      name: name,
      newUsername: username,
      newPassword: password,
      color: color,
    };

    fetch('/userinfo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          fetchUserInfo();
          setMode('WELCOME');
          alert('회원정보가 수정되었습니다.');
        } else {
          alert('Failed to update user information');
        }
      })
      .catch((error) => {
        console.log('Error updating user information:', error);
        alert('Failed to update user information');
      });
  };

  return (
    <>
    <br />
          <img src="JOY2.svg" id="logo2" alt="Logo" />
          <br /><br /><br /><br />
      <div className="form">
        <p>
          <input
            className="edit_input"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </p>
        <p>
          <input
            className="edit_input"
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </p>
        <p>
          <input
            className="edit_input"
            type="password"
            placeholder="새로운 비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <p><span id="edit_color_p">색깔 선택&nbsp;&nbsp;</span>
          <input
            className="edit_color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </p>
        <br /><br />
        <p>
          <Link to ="/login"><input className="edit_btn" type="submit" value="수정하기" onClick={handleUpdate} /></Link>
        </p>
      </div>
      <p>
      <Link to ="/welcome"><input className="edit_btn2" value="취소" /></Link>
      </p>
    </>
  );
};

export default UserInfoEdit;
