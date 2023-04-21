//API 서버 만들기
const express = require('express');
const app = express();

app.get('/:type',(req,res)=>{                           // ':/type'처럼, URI의 콜론(:) 뒤에 오는 path는 어떤 것이든 올 수 있다. 그렇게 들어온 변수는 req.parrams에 저장되는 라우트 파라미터이다. 
    let {type}=req.params;                              // 만약 URL 요청이 '/타입'이라는 주소가 들어왔으면 req.params.type에는 "type"이라는 문자열이 저장된다.
    res.send(type);
});

app.listen(8080);

//우리 서버에 API 서버를 얹어 내가 만든 정보를 다른 사람이 API를 통해 이용할 수 있게 한다.
// API서버를 따로 만들면 다른 사람이 내 서버의 정보를 사용할 수 있게 하는 이점뿐 아니라 내 웹의 모바일 서버로 운영할 수도 있다.
// API 서버는 웹 사이트의 프론트엔드 부분과 분리되어 운영되기 때문
// 내 서버의 코드를 공개하지 않고, 데이터베이스에 접근할 수 있는 권한도 주지 않고 결과값만 전달해주기 때문에 API로 데이터를 제공하는 것이 보안에도 좋다.