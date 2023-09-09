//require('dotenv').config();
const axios = require('axios');
const CryptoJS = require('crypto-js');

// 네이버 클라우드 SMS API 관련 정보
const serviceId = 'yourserviceID'; // 서비스 ID
const accessKey = 'yourAccessKey'; // ACCESS KEY
const secretKey = 'yourSecretKey'; // SECRET KEY

// SMS 발신자 번호와 수신자 번호
const from = '발신번호';
const to = '수신번호';

// SMS 내용
const message = '안녕하세요, JOY입니다.';

// SMS 전송 요청을 위한 API 엔드포인트 URL
const apiUrl = 'https://sens.apigw.ntruss.com/sms/v2/services/' + serviceId + '/messages';
const url2 = '/sms/v2/services/' + serviceId + '/messages';
const date = Date.now().toString();

const method = "POST";
const space = " ";
const newLine = "\n";

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

// SMS 전송 요청 헤더 설정
const headers = {
  "Content-type": "application/json; charset=utf-8",
  'x-ncp-apigw-timestamp': date,
  'x-ncp-iam-access-key': accessKey,
  'x-ncp-apigw-signature-v2': signature,
};

// SMS 전송 요청 바디 설정
const data = {
  type: 'SMS',
  contentType: 'COMM',
  countryCode: '82',
  from: from,
  content: message,
  messages: [{ to: to }],
};

// SMS 전송 요청
axios
  .post(apiUrl, data, { headers: headers })
  .then((response) => {
    console.log('data 출력:', data);
    console.log('SMS 전송 성공:', response.data);
  })
  .catch((error) => {
    console.log('data 출력:', data);
    console.error('SMS 전송 실패:', error.response.data);
  });
