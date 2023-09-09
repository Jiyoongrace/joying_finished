const express = require('express');
const session = require('express-session');

const path = require('path');
const app = express();
const port = 3010;
const cors = require('cors');

const request = require('request');

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(cors()); // CORS 미들웨어 추가

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);

app.use(session({  
  key: 'session_cookie_name',
  secret: '~',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));



app.get('/', (req, res) => {    
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.get('/authcheck', (req, res) => {      
  const sendData = { isLogin: "" };
  if (req.session.is_logined) {
    sendData.isLogin = "True";
  } else {
    sendData.isLogin = "False";
  }
  res.send(sendData);
});

app.get('/userinfo', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname; // Assuming nickname contains the username
    db.query('SELECT name, username, role, color FROM userTable WHERE username = ?', [username], function (error, results, fields) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          const userInfo = {
            name: results[0].name,
            username: results[0].username,
            role: results[0].role,
            color: results[0].color,
          };
          if (userInfo.role === 1) {
            db.query('SELECT name, color FROM userTable WHERE tutorId = ?', [username], function (error, results, fields) {
              if (error) {
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                //const studentNames = results.map(result => result.name);
                userInfo.students = results.map((result) => {
                  return {
                    name: result.name,
                    color: result.color
                  };
                });
                res.json({ user: userInfo });
              }
            });
          } else if (userInfo.role === 2) {
            db.query('SELECT tutorId FROM usertable WHERE username = ?', [username], function (error, results, fields) {
              if (error) {
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                const tutor = results[0].tutorId;
                userInfo.tutor = tutor;
                res.json({ user: userInfo });
              }
            });
          } else {
            res.json({ user: userInfo });
          }
        }
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

app.post("/login", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const sendData = { isLogin: "" };

  if (username && password) {
    db.query('SELECT * FROM userTable WHERE username = ?', [username], function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, (err, result) => {
          if (result === true) {
            req.session.is_logined = true;
            req.session.nickname = username;
            req.session.save(function () {
              sendData.isLogin = "로그인 성공!";
              res.send(sendData);
            });
            db.query(`INSERT INTO logTable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login', ?, ?)`,
              [req.session.nickname, '-', `React 로그인 테스트`], function (error, result) { });
          } else {
            sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
            res.send(sendData);
          }
        });
      } else {
        sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
        res.send(sendData);
      }
    });
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

app.post("/signin", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const password2 = req.body.userPassword2;
  const name = req.body.userName;
  const role = req.body.role;
  const tutorId = req.body.tutorId;
  const phone = req.body.phone;
  const color = req.body.color;

  const sendData = { isSuccess: "" };

  if (username && password && password2 && name && role) {
    db.query(
      "SELECT * FROM userTable WHERE username = ?",
      [username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length <= 0 && password === password2) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          let query;
          let values;
          if (role === 1) {
            // Teacher
            query =
              "INSERT INTO userTable (username, password, name, role, phone, color) VALUES (?, ?, ?, ?, ?, ?)";
            values = [username, hashedPassword, name, role, phone, color];
          } else if (role === 2) {
            // Student
            query =
              "INSERT INTO userTable (username, password, name, role, tutorId, phone, color) VALUES (?, ?, ?, ?, ?, ?, ?)";
            values = [username, hashedPassword, name, role, tutorId, phone, color];
          }
          db.query(query, values, function (error, data) {
            if (error) throw error;
            req.session.save(function () {
              sendData.isSuccess = "True";
              res.send(sendData);
            });
          });
        } else if (password !== password2) {
          sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
          res.send(sendData);
        } else {
          sendData.isSuccess = "이미 존재하는 아이디입니다!";
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.isSuccess = "아이디, 비밀번호, 이름, 역할을 입력하세요!";
    res.send(sendData);
  }
});

app.put('/userinfo', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname; // Assuming nickname contains the username
    const { name, newUsername, newPassword, color } = req.body;

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.query(
      'UPDATE userTable SET name = ?, username = ?, password = ?, color = ? WHERE username = ?',
      [name, newUsername, hashedPassword, color, username],
      function (error, results, fields) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.affectedRows > 0) {
          req.session.nickname = newUsername; // Update the session nickname with the new username

          // Update lesson color based on matching name
          db.query(
            'UPDATE lessontable SET color = ? WHERE name = ?',
            [color, name],
            function (error, results) {
              if (error) {
                console.log('Error updating lesson color:', error);
              } else {
                console.log(`Lesson color updated for user with name: ${name}`);
              }
            }
          );

          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.get('/subjects', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname; // Assuming nickname contains the username
    db.query('SELECT name, username, role FROM userTable WHERE username = ?', [username], function (error, results, fields) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          const userInfo = {
            name: results[0].name,
            username: results[0].username,
            role: results[0].role,
          };
          if (userInfo.role === 1) {
            db.query(
              'SELECT s.id, s.subjectName, s.totalPages, s.book, s.subjectTutee, u.name AS studentName FROM subjectTable s LEFT JOIN userTable u ON s.subjectTutee = u.username WHERE s.username = ?',
              [username],
              function (error, results) {
                if (error) {
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  res.json({ subjects: results });
                }
              }
            );
          } else if (userInfo.role === 2) {
            db.query(
              'SELECT * FROM subjecttable WHERE subjectTutee = ?',
              [userInfo.name], // 학생의 username과 비교
              function (error, results) {
                if (error) {
                  console.log('Error executing query:', error);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  res.json({ lessons: results });
                }
              }
            );
          } else {
            console.log('Invalid role'); // 유효하지 않은 역할일 경우
            res.status(403).json({ error: 'Invalid role' });
          }
        }
      }
    });
  } else {
    console.log('User not logged in'); // 로그인 상태 확인을 위한 로그 출력
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.post('/subjects', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;
    const { subjectName, totalPages, selectedStudent, book } = req.body;

    db.query(
      'INSERT INTO subjectTable (username, subjectName, totalPages, subjectTutee, book) VALUES (?, ?, ?, ?, ?)',
      [username, subjectName, totalPages, selectedStudent, book],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ success: true });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.put('/subjects/:subjectId', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;
    const subjectId = req.params.subjectId;
    const { subjectName, totalPages, book, subjectTutee } = req.body;

    db.query(
      'UPDATE subjectTable SET subjectName = ?, totalPages = ?, book = ?, subjectTutee = ? WHERE username = ? AND id = ?',
      [subjectName, totalPages, book, subjectTutee, username, subjectId],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'Subject not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.delete('/subjects/:subjectId', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;
    const subjectId = req.params.subjectId;

    db.query('DELETE FROM subjectTable WHERE username = ? AND id = ?', [username, subjectId], function (error, result) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Subject not found' });
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

// 수업일지
app.get('/lessons', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname; // Assuming nickname contains the username
    db.query('SELECT name, username, role FROM userTable WHERE username = ?', [username], function (error, results, fields) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          const userInfo = {
            name: results[0].name,
            username: results[0].username,
            role: results[0].role,
          };
          if (userInfo.role === 1) {
            db.query(
              'SELECT * FROM lessontable WHERE tutorId = ?',
              [username],
              function (error, results) {
                if (error) {
                  console.log('Error executing query:', error);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  res.json({ lessons: results });
                }
              }
            );
          } else if (userInfo.role === 2) {
            db.query(
              'SELECT * FROM lessontable WHERE name = ?',
              [userInfo.name], // 학생의 username과 비교
              function (error, results) {
                if (error) {
                  console.log('Error executing query:', error);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  res.json({ lessons: results });
                }
              }
            );
          } else {
            console.log('Invalid role'); // 유효하지 않은 역할일 경우
            res.status(403).json({ error: 'Invalid role' });
          }
        }
      }
    });
  } else {
    console.log('User not logged in'); // 로그인 상태 확인을 위한 로그 출력
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.post('/lessons', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username
    const { name, num, date, subjectName, book, study, hw, currentPage, grade, completed } = req.body;
    
    // Fetch the color from the usertable based on the provided name
    db.query('SELECT color FROM userTable WHERE name = ?', [name], function (error, results) {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          const color = results[0].color;
          
          db.query(
            'INSERT INTO lessontable (name, num, date, subjectName, book, study, hw, currentPage, grade, completed, tutorId, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, num, date, subjectName, book, study, hw, currentPage, grade, completed, tutorId, color],
            function (error, result) {
              if (error) {
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                res.json({ success: true });
              }
            }
          );
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.put('/lessons/:lessonId', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username
    const lessonId = req.params.lessonId;
    const { name, num, date, subjectName, book, study, hw, currentPage, grade, completed } = req.body;

    db.query(
      'UPDATE lessontable SET name = ?, num = ?, date = ?, subjectName = ?, book = ?, study = ?, hw = ?, currentPage = ?, grade = ?, completed = ? WHERE id = ? AND tutorId = ?',
      [name, num, date, subjectName, book, study, hw, currentPage, grade, completed, lessonId, tutorId],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'Lesson not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});




app.delete('/lessons/:lessonId', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname; // Assuming nickname contains the username
    const lessonId = req.params.lessonId;

    db.query(
      'DELETE FROM lessontable WHERE id = ? AND tutorId = ?',
      [lessonId, tutorId],
      function (error, result) {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: 'Lesson not found' });
        }
      }
    );
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


// POST: Save a new grade
app.post('/grades', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;

    // Fetch tutorId and color based on the logged-in user's username
    const getUserDataQuery = `SELECT tutorId, name, color FROM usertable WHERE username = ?`;
    db.query(getUserDataQuery, [username], (err, userResult) => {
      if (err) {
        console.error('DB select error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (userResult.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const { tutorId, name, color } = userResult[0];
        const { subject, exam, grade, score } = req.body;

        // Insert the grade data with name and color
        const insertGradeQuery = `INSERT INTO grade (username, tutorId, subject, exam, grade, score, name, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertGradeQuery, [username, tutorId, subject, exam, grade, score, name, color], (err, result) => {
          if (err) {
            console.error('DB insert error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ success: true });
          }
        });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


// GET: Fetch grades for the current logged-in user
app.get('/grades', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;

    // Fetch tutorId, name, and color based on the logged-in user's username
    const getTutorInfoQuery = `SELECT tutorId, name, color FROM usertable WHERE username = ?`;
    db.query(getTutorInfoQuery, [username], (err, result) => {
      if (err) {
        console.error('DB select error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const tutorId = result[0].tutorId;
        const name = result[0].name;
        const color = result[0].color;

        const fetchGradesQuery = `SELECT * FROM grade WHERE username = ? AND tutorId = ?`;
        db.query(fetchGradesQuery, [username, tutorId], (err, results) => {
          if (err) {
            console.error('DB select error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Include the user's name and color in the response
            res.json({ color: color, name: name, grades: results });
          }
        });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});



// PUT: Update a grade
app.put('/grades/:id', (req, res) => {
  const { subject, exam, grade, score } = req.body;
  const id = req.params.id;

  const query = `UPDATE grade SET subject = ?, exam = ?, grade = ?, score = ? WHERE id = ?`;
  db.query(query, [subject, exam, grade, score, id], (err, result) => {
    if (err) {
      console.error('DB update error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// DELETE: Delete a grade
app.delete('/grades/:id', (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM grade WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('DB delete error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// GET: Fetch students for the current logged-in teacher
app.get('/grades/students', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;

    const getStudentQuery = `
      SELECT DISTINCT G.username, U.name, U.color
      FROM grade G
      JOIN usertable U ON G.username = U.username
      WHERE G.tutorId = ?
    `;
    db.query(getStudentQuery, [username], (err, results) => {
      if (err) {
        console.error('DB select error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const students = results.map((result) => ({
          username: result.username,
          name: result.name,
          color: result.color,
        }));
        res.json({ students });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/grades/students/:student', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname;
    const student = req.params.student;

    const getGradesQuery = `SELECT * FROM grade WHERE tutorId = ? AND username = ?`;
    db.query(getGradesQuery, [tutorId, student], (err, results) => {
      if (err) {
        console.error('DB select error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ grades: results });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});



app.post('/api/notifications', (req, res) => {
  // Check if user is authenticated and get user information from session
  if (req.session.is_logined && req.session.nickname) {
    const { title, body, username } = req.body; // Add username to the request body
    const created_at = new Date();

    const sql = 'INSERT INTO notification (username, title, body, created_at) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, title, body, created_at], (err, result) => {
      if (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({ success: false, error: 'Failed to create notification' });
      } else {
        console.log('Notification created:', result);
        res.json({ success: true });
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.post('/api/notifications/student', (req, res) => {
  // Check if user is authenticated and get user information from session
  if (req.session.is_logined && req.session.nickname) {
    const username = req.session.nickname;
    const { title, body } = req.body; // Add username to the request body
    const created_at = new Date();

    const sql = 'INSERT INTO notification (username, title, body, created_at) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, title, body, created_at], (err, result) => {
      if (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({ success: false, error: 'Failed to create notification' });
      } else {
        console.log('Notification created:', result);
        res.json({ success: true });
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


// API to get notifications for a specific user
app.get('/api/notifications', (req, res) => {
  if (req.session.is_logined && req.session.nickname) {
    // Get user's role, name, and color from the usertable
    const userSql = 'SELECT role, name, color, tutorId FROM usertable WHERE username = ?';
    db.query(userSql, [req.session.nickname], (userErr, userResults) => {
      if (userErr) {
        console.error('Error fetching user role, name, and color:', userErr);
        res.status(500).json({ error: 'Failed to fetch user role, name, and color' });
      } else {
        const userRole = userResults[0]?.role || 0; // Default role to 0 if not found
        const userName = userResults[0]?.name || '';
        const userColor = userResults[0]?.color || '';
        const userTutorId = userResults[0]?.tutorId || '';

        let sql = '';
        let queryParams = [];

        if (userRole === 1) { // Teacher
          // Get students' usernames under the teacher
          const teacherStudentsSql = 'SELECT username FROM usertable WHERE tutorId = ?';
          db.query(teacherStudentsSql, [req.session.nickname], (studentsErr, studentsResults) => {
            if (studentsErr) {
              console.error('Error fetching teacher students:', studentsErr);
              res.status(500).json({ error: 'Failed to fetch teacher students' });
            } else {
              const studentUsernames = studentsResults.map(student => student.username);

              // Fetch notifications for the teacher's students
              sql = 'SELECT n.*, u.name, u.color FROM notification n JOIN usertable u ON n.username = u.username WHERE n.username IN (?) ORDER BY n.created_at DESC';
              queryParams = [studentUsernames];
              db.query(sql, queryParams, (err, results) => {
                if (err) {
                  console.error('Error fetching notifications:', err);
                  res.status(500).json({ error: 'Failed to fetch notifications' });
                } else {
                  res.json({ notifications: results });
                }
              });
            }
          });
        } else if (userRole === 2) { // Student
          // Fetch notifications for the student
          sql = 'SELECT n.*, u.name, u.color FROM notification n JOIN usertable u ON n.username = u.username WHERE n.username = ? ORDER BY n.created_at DESC';
          queryParams = [req.session.nickname];
          db.query(sql, queryParams, (err, results) => {
            if (err) {
              console.error('Error fetching notifications:', err);
              res.status(500).json({ error: 'Failed to fetch notifications' });
            } else {
              res.json({ notifications: results });
            }
          });
        }
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});





// API to delete a notification by ID
app.delete('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM notification WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting notification:', err);
      res.status(500).json({ success: false, error: 'Failed to delete notification' });
    } else {
      if (result.affectedRows > 0) {
        console.log('Notification deleted:', result);
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, error: 'Notification not found' });
      }
    }
  });
});



// Fetch a list of students associated with a teacher
app.get('/teacher/students', (req, res) => {
  if (req.session.is_logined && req.session.role === 1) { // Role이 1인 경우 (선생님)
    const tutorId = req.session.nickname;

    db.query('SELECT username, name, color FROM userTable WHERE tutorId = ?', [tutorId], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ students: results });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// GET: Fetch students for the current logged-in teacher
app.get('/usertable/students', (req, res) => {
  if (req.session.is_logined) {
    const username = req.session.nickname;

    const getStudentQuery = `SELECT username, name, phone, color FROM usertable WHERE tutorId = ?`;
    db.query(getStudentQuery, [username], (err, results) => {
      if (err) {
        console.error('DB select error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const students = results.map((result) => {
          return {
            username: result.username,
            name: result.name,
            phone: result.phone,
            color: result.color
          };
        });
        res.json({ students });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

//학생이름, 학부모번호 불러오기
app.get('/usertable/students/:student', (req, res) => {
  if (req.session.is_logined) {
    const tutorId = req.session.nickname;
    const student = req.params.student;

    const getStQuery = `SELECT name, phone FROM usertable WHERE tutorId = ? AND username = ?`;
    db.query(getStQuery, [tutorId, student], (err, results) => {
      if (err) {
        console.error('DB select error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const student = results.map((result) => {
          return {
            name: result.name,
            phone: result.phone
          };
        });
        res.json({ student });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// 클라이언트에서의 요청을 SMS 서비스로 중계
app.post('/sendSMS', async (req, res) => {
  const axios = require('axios');
  try {
    const CryptoJS = require('crypto-js');
    // SMS 서비스 URL 및 인증 정보 (여기 내가 보내준 걸로 채우면 돼!)
    const serviceId = '****'; // 서비스 ID
    const accessKey = '****'; // ACCESS KEY
    const secretKey = '****'; // SECRET KEY
    const apiUrl = 'https://sens.apigw.ntruss.com/sms/v2/services/' + serviceId + '/messages';
    const url2 = '/sms/v2/services/' + serviceId + '/messages';
    
    const method = 'POST';
    const space = ' ';
    const newLine = '\n';
    const date = Date.now().toString();

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
      hmac.update(method);
      hmac.update(space);
      hmac.update(url2);
      hmac.update(newLine);
      hmac.update(date);
      hmac.update(newLine);
      hmac.update(accessKey);
      const hash = hmac.finalize();
      const signature = hash.toString(CryptoJS.enc.Base64);

    // SMS 서비스에 전송할 데이터
    const smsData = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '****',
      content: req.body.message,
      messages: [{ to: req.body.to }],
    };

    // SMS 서비스로 요청을 전송
    const response = await axios.post(apiUrl, smsData, {
      headers: {
        "Content-type": "application/json; charset=utf-8",
        'x-ncp-apigw-timestamp': date,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signature,
      },
    });

    // SMS 서비스의 응답을 클라이언트로 전달
    res.json(response.data);
  } catch (error) {
    //console.log('smsData:', smsData);
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});