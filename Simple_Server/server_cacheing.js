const morgan = require('morgan')
const path = require("path")
const dotenv = require("dotenv");
dotenv.config({path: path.resolve(__dirname,"../../config.env")});
const axios = require('axios');
const express = require('express');
const app = express();

/*포트설정*/
app.set('port',process.env.PORT||8080);

/*Redis 연결*/
const redis = require('redis')
const client = redis.createClient(6379,'127.0.0.1')
client.on('error',(err)=>{
    console.log('Redis Error: '+err);
});

/*공통 미들웨어*/
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

/*라우팅 설정*/
app.get('/airkorea',async(req,res)=>{
    await client.lrange('airItems',0,-1,async (err,cachedItems)=>{
        if(err) throw err;
        if(cachedItems.length){     //data in cache
            res.send(` 데이터가 캐시 안에 있습니다. <br>
            관측지역 : ${cachedItems[0]} / 관측시간 : ${cachedItems[1]}<br>
            미세먼지 : ${cachedItems[2]} / 초미세먼지 : ${cachedItems[3]}입니다.`)
        }else{          //data not in data
            const serviceKey = process.env.airServiceKey;           //dotenv 사용 *dotenv란? env 파일을 따로 만들어 공개적으로 api secretKey를 보여주는 것을 방지함
            const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";

            let params = encodeURI('serviceKey')+'='+serviceKey;
            params += '&' + encodeURI('numOfRows')+'='+encodeURI('1');
            params += '&' + encodeURI('pageNo')+'='+encodeURI('1');
            params += '&' + encodeURI('dataTerm') + '=' +encodeURI('DAILY');
            params += '&' + encodeURI('ver') + '=' + encodeURI('1.3')
            params += '&' + encodeURI('stationName') + '=' + encodeURI('용산구')
            params += '&' + encodeURI('returnType') + '=' +encodeURI('json');

            const url = airUrl + params;

            try{
                const result = await axios.get(url);
                console.log(result.data.response.body.items[0]['pm25Value'])
                const airItem = {
                "location": '용산구', //지역
                "time": result.data.response.body.items[0]['dataTime'],    //시간대
                "pm10": result.data.response.body.items[0]['pm10Value'],   //pm10 수치
                "pm25": result.data.response.body.items[0]['pm25Value']    //pm25 수치
                }
                console.log(airItem.pm25)
                const badAir = [];
                //pm 10은 미세먼지 수치
                if(airItem.pm10 <= 30){
                    badAir.push("좋음 ^^0")
                }else if(airItem.pm10 > 30 && airItem.pm10 <= 80){
                    badAir.push("보통");
                }else{
                    badAir.push('나쁨 ㅡㅡ')
                }

                //pm25는 초미세먼지 수치
                if(airItem.pm25 <= 15){
                    badAir.push("좋음 ㅎㅎ");
                }else if(airItem.pm25 > 15 && airItem.pm10 <= 35){
                    badAir.push("보통.");
                }else{
                    badAir.push("나쁨 ㅜㅜ");
                }

                res.send(`관측지역: ${airItem.location} / 관측시간 ${airItem.time} <br> 미세먼지 ${badAir[0]} 초미세먼지 ${badAir[1]} 입니다.`)
                //res.json(result.data); // .data
            }catch(error){
                console.log(error);
            }
        }
    })
    
    
    
});

/*서버와 포트 연결.. */

app.use(function (err,req,res,next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 서버 실행 중...')
});