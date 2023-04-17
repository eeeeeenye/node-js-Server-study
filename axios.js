/*axios로 요청을 보내는 형태는 여러가지가 있는데 크게 세가지 case에만 적어봄*/

/*case1 axios(url,[,config])*/

//GET 요청 전송 (기본 메서드)
axios('/user/12345');

//case 2. axios(config)
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firestName: 'Fred',
        lastName: 'Flintstone'
    }
});

//case 3. axios.method(url[,data[,config]])
axios.get(url[, config])
axios.post(url[, data[, config]])
axios.put(url[,data[,config]])
axios.patch(url[, data[,config]])
axios.delete(url[, config])

axios.request(config)
axios.head(url[,config])
axios.options(url[, config])
