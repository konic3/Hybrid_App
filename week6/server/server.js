const express = require('express');
const app = express();
const port = 3000;

// CORS 설정
const cors = require('cors');
app.use(cors());

// 'hi' URI에 대한 GET 요청을 처리하는 간단한 API
app.get('/hi', (req, res) => {
    // 서버에서 클라이언트로 데이터를 응답합니다.
    res.send({ message: '안녕하세요, 클라이언트! 이것은 서버에서 보낸 데이터입니다.' });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});