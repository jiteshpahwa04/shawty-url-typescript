import mongoose from "mongoose";
import { serverConfig } from ".";

export async function connectDB() {
    try {
        await mongoose.connect(serverConfig.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}