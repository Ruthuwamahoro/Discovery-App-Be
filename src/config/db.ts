import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async() => {
    try{
        if(!process.env.DATABASE_URL){
            process.exit(1)
        }
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDb connected successfully");

    } catch(err: unknown){
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
    mongoose.connection.on('disconnected', () => {
        console.log('OOps! MongoDB disconnected...');
    });
}