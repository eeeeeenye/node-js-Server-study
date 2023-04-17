const redis = require('redis');
const client = redis.createClient({
    legacyMode: true,
    PORT: 6379
});
client.connect().catch(console.error);

client.del('myKey', (err, reply) => {
  // 이전 데이터를 삭제한 후 새로운 데이터를 저장
  client.rpush('myKey', 0);
  client.rpush('myKey', 1);
  client.rpush('myKey', 2);

  // 저장된 값을 읽어온다
  client.lrange('myKey', 0, -1, (err, value) => {
    console.log(value);
    client.quit(); // Redis 클라이언트를 종료
  });
});
