const morgan = require('morgan');
const request = require('request');
const express = require('express');
const app = express();

/*포트설정*/
app.set('port',process.env.PORT||8080);

/*공통 미들웨어*/
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*라우팅 설정*/
app.get('/naver/news',(req,res)=>{
    const client_id='발급받은 client id';
    const client_secret = '발급받은 client secret'
    const api_url = 'https://openapi.naver.com/v1/search/news?query='+
                    encodeURI('코스피'); //encodeURI
    const option = {

    };
    const options = {
        url: api_url,
        qs: option,
        header: {'X-Naver-Client-Id':client_id,
                 'X-Naver-Secret':client_secret},
    };

    request.get(options, (error,response, body)=>{
        if(!error && response.statusCode == 200){
            let newsItem = JSON.parse(body).items;
            //items - title, link, description, pubDate

            const newJson = {
                title: [],
                link: [],
                description: [],
                pubDate: []
            }

            for(let i =0; i<newsItem.length; i++){
                newJson.title.push(newsItem[i].title.replace(/(<([^>]+)>)|&quot;/ig,""));
                newJson.link.push(newsItem[i].link);
                newJson.description.push(newsItem[i].description);
                newJson.pubDate.push(newsItem[i].pubDate);
            }
            res.json(newJson);
        }else{
            res.status(response.statusCode).end();
            console.log('error = '+response.statusCode);
        }
    });
});

/*서버와 포트 연결..*/
app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 서버 실행 중..')
})