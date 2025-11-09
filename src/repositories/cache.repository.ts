import { redisClient } from "../config/redis";

export class CacheRepository {
    async setUrlMapping(shortUrl: string, originalUrl: string): Promise<void> {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        await redisClient.set(key, originalUrl, { EX: 86400 }); // Set expiration to 24 hours
    }

    async getNextId(): Promise<number> {
        const counterKey = process.env.REDIS_COUNTER_KEY || "url_shortner_counter";
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const nextId = await redisClient.incr(counterKey);
        return nextId;
    }

    async getUrlMapping(shortUrl: string): Promise<string | null> {
        const key = `url:${shortUrl}`;
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const originalUrl = await redisClient.get(key);
        return originalUrl;
    }

    async deleteUrlMapping(shortUrl: string): Promise<void> {
        const key = `url:${shortUrl}`;
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        await redisClient.del(key);
    }
}