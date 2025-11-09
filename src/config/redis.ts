import { createClient } from "redis";
import { serverConfig } from ".";

export const redisClient = createClient({
    url: serverConfig.REDIS_URL
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
    console.log("Redis client connecting...");
});

redisClient.on("ready", () => {
    console.log("Redis client connected and ready");
});

export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Connected to Redis successfully");
    } catch (error) {
        console.error("Redis connection error:", error);
        throw error;
    }
}

export async function disconnectRedis() {
    try {
        await redisClient.quit();
        console.log("Disconnected from Redis successfully");
    } catch (error) {
        console.error("Error disconnecting from Redis:", error);
        throw error;
    }
}