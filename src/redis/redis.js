const redis = require("redis");
const client = redis.createClient({
    // url
    port: 6379,
    host: '127.0.0.1'
});

// -------- || Listening on Redis Events || --------- //
client.on('connect', () => console.log('Connected to redis server....'))
client.on('ready', () => console.log('Connected to redis server and Ready to use....'))
client.on('error', (err) => console.log('Redis Client Error', err))
client.on('end', (err) => console.log('Redis Client Disconnected...'))



// --------- || Quit the Redis Connection || ---------------- //
/**
 * When we ctrl+c to stop our application then we need to stop our redis
 * that time SIGINT event fire
 */
process.on("SIGINT", () => {
    client.quit();
});

//-------- || Start the Redis Connection || -------------------- //
client.connect();

module.exports = client;
