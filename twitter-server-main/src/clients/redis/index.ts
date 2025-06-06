import Redis from "ioredis";

const REDIS_URL = "rediss://defaultAYUEAAIjcDExZTc4NDZjNmFmZjg0MDA1OTg5NDhhOTE0MTJkOTVlMHAxMA@tops-cheetah-34052.upstash.io:6379";

export const redisClient = new Redis(REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => {
  // console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  // console.log('Successfully connected to Redis');
});