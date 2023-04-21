/* 클라이언트가 API 서버를 이용하는 것과 같은 테스트 진행 : cors*/
/* CORS 오류 발생*/
/* CORS 오류가 발생하는 이유? 내 서버에 아무나 접근해서 나쁜행위를 하는 것을 막기 위해서*/
/* 악의적인 의도로 내 서버에 접근해 세션을 탈취하거나 보안에 위협을 가하는 행위를 할 수 있기 때문에 기본적으로 SOP(Same Origin Policy) 보안 모델을 따르게 된다.*/
/* SOP은 같은 출처에 대한 http 요청만 허락한다는 뜻*/

const morgan = require('morgan');
const axios = require('axios');
const express = require('express');
const app = express();

app.set('port',3000);

/*공통 미들웨어 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*axios 요청*/
app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/board_api_test.html");
});

/*서버와 포트 연결 .. */
app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 서버 실행 중 ..')
});