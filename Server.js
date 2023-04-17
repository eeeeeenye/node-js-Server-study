const express = require('express')
const logger = require('morgan')                       // moran API 로그 남기기
const cookieParser = require('cookie-parser')
const session = require('express-session')             //express-session을 선언하지 않는다면 const session = {} 이렇게 저장할 공간을 따로 선언 
const app = express()
// const sessionKey=new Date();
// session[sessionKey] = {name: 'Ploger'}

/*포트설정*/
app.set('port',process.env.PORT||8080);                // process.env 객체에 기본 포트번호가 있다면 해당 포트를 사용한다는 것이고 없다면 8080 포트번호를 사용하겠다.
          // app.set(키,값) 함수는 키,값 파라미터를 이용하여 키에 값을 설정하도록 설정할 수 있는 함수
          
/*공통 미들웨어 */
app.use(express.static(__dirname+'/public'))
app.use(logger('dev'))                                                       
app.use(cookieParser('secret@1234'));

app.use(session({
    secret: 'secret@1234',                             // 암호화
    resave: false,                                     // 새로운 요청 시 세션에 변동사항이 없어도 다시 저장할지 설정
    saveUninitialized: true,                           // 세션에 저장할 내용이 없어도 저장할지 설정
    cookie:{
        httpOnly: true,                                // 로그인 구현 시 필수 적용, 자바스크립트로 접근할 수 없게 하는 기능
        name: 'connect.sid'                            // session 쿠키의 name 지정 default가 connect.sid
    },
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}));

/* 라우팅 설정*/
app.get('/',function (req, res){                       // 그 데이터를 app.get(키)함수를 통해 가져온다. app.get(주소,라우터)은 주소에 대한 GET요청이 올 때 어떤 응답을 할 지 적어줌.
    if(req.session.name){
        const output = 
        `<h2> 로그인한 사용자님</h2><br>
        <p>${req.session.name}님 안녕하세요.</p>
        `
        res.send(output);
    }else{
        const output = `
        <h2>로그인하지 않은 사용자입니다.</h2>
        <p>로그인 해주세요.</p><br>`
        res.send(output);
    }
    
    // res.writeHead(200,{'Set-cookie':`session=${sessionKey}`})   // 쿠키 설정 - 사용자를 좀 더 쉽게 식별할 수 있다. 실제 정보는 서버에만 저장해두고 브라우저에는 암호화된 키 값만 보여주고 그 키 값으로 쉽게 값에 접근할 수 있도록 하는 것 = session
})

app.get('/login',(req,res)=>{                                   //실제 구현 시 post
    console.log(req.session);
    //쿠키를 사용할 경우 쿠키에 값 설정
    //res.cookie(name, value, options)
    //세션 쿠키를 사용할 경우
    req.session.name = 'Plogger';
    res.end('Login Ok');
})

app.get('/logout',(req,res)=>{
    res.clearCookie('connect.sid');                             //세션 쿠키 삭제
    res.end('Logout Ok');
})

/*서버와 포트와 연결*/

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),"번 포트에서 서버 실행 중...")
});

/*오류 미들웨어 설정*/
app.use(function (err,req,res){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

