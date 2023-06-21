// import redis from "redis";
const redis = require("redis")

// const RedisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
    legacyMode: true
});

client.connect();

client.on('connect', () => {
    console.log('Connected to Redis');
})

client.on('error', (err) => {
    console.log(err.message);
})

client.on('ready', () => {
    console.log('Redis is ready');
})

// client.on('end', () => {
//     console.log('Redis connection ended');
// })

module.exports = client;