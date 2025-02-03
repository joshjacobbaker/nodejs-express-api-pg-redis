const Redis = require("ioredis");

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1"
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
const REDIS_DB = process.env.REDIS_DB || 0;

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT, 
    // password: "yourpassword" // Uncomment if Redis requires authentication
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("Redis Error:", err));

module.exports = redis;
