const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json()); // JSON 파싱 미들웨어 추가
const _ = require('lodash');
const filePath = 'user.json';

// 회원가입 API
app.post('/signup', (req, res) => {
  try {
    // 기존 사용자 데이터 로드
    const filePath = 'user.json';
    const rawData = fs.readFileSync(filePath, 'utf8');
    const userData = JSON.parse(rawData);

    // 새로운 사용자 추가
    const newUsername = req.body.username;
    const newPassword = req.body.password;

    // 중복 확인
    const existingUser = userData.users.find(user => user.id == newUsername);
    if (existingUser) {
      // 이미 존재하는 아이디인 경우
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    const newUser = {
      id: newUsername,
      password: newPassword,
      bestscore: 0, // 또는 기본값 설정
    };

    userData.users.push(newUser);

    // 업데이트된 데이터를 다시 파일에 쓰기
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');

    res.status(200).json({ success: true, message: 'Sign up successful!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function getUserById(userId) {
  const filePath = 'user.json';
  const rawData = fs.readFileSync(filePath, 'utf8');
  const userData = JSON.parse(rawData);

  return userData.users.find(user => user.id === userId);
}

// 로그인 API
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = getUserById(username);
    if (user.id == username && user.password == password) {
      res.status(200).json({ success: true, message: '200, Login successful!', userId: user.id });
    } else {
      res.status(401).json({ success: false, error: '401, Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: '500 Inter' });
  }
});

app.get('/readrank', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('파일을 읽는 중 오류가 발생했습니다.', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      // JSON 데이터를 JavaScript 객체로 변환
      const jsonData = JSON.parse(data);

      // users 배열을 가져와서 정렬
      const sortedUsers = _.sortBy(jsonData.users, 'bestscore').reverse();

      // 클라이언트에 정렬된 결과 전송
      res.json(sortedUsers);
    } catch (jsonError) {
      console.error('JSON 데이터를 파싱하는 중 오류가 발생했습니다.', jsonError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});



//최고 점수
app.get('/bestscore/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const filePath = 'user.json';
    const rawData = fs.readFileSync(filePath, 'utf8');
    const userData = JSON.parse(rawData);

    const user = userData.users.find(u => u.id == userId);

    if (user) {
      res.status(200).json({ success: true, bestscore: user.bestscore });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting best score:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



app.post('/updateBestScore/:userId', (req, res) => {
  const userId = req.params.userId;
  const newBestScore = req.body.bestscore;
  const filePath = 'user.json';

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const usersData = JSON.parse(rawData);

    const userIndex = usersData.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      usersData.users[userIndex].bestscore = newBestScore;

      fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2), 'utf8');

      res.json({ success: true, message: 'Best score updated successfully.' });
    } else {
      res.status(404).json({ success: false, error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error updating best score:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 파일 읽기


    
