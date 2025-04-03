import mongoose from "mongoose";
import { config } from "../utils/constants";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(String(config.MONGO_URL))
        console.log("DB Connected :) ");
    } catch (error) {
        console.log("Error while Connecting to DB :", error);
        throw error
    }
}