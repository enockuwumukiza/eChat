import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const URI = process.env.MONGO_URI;

export const dbConnection = async () => {
    try {
        await mongoose.connect(URI as string, {
            dbName:'enochChat'
        });
        console.log('connected to database successfully!');

    } catch (error) {
        console.error(`Error connecting to database: ${error}`);
        throw error;
    }
}