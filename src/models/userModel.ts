import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,
    trim: true, }, 
  email: { type: String, required: true, unique: true, trim: true,
    lowercase: true,},
  gender: { type: String, required: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true,     minlength: 8, },
});
userSchema.index({ username: 1, email: 1 }, { unique: true });
export const User = mongoose.model('User', userSchema);
export interface IUser {
    _id: string;
    username: string;
    email: string;
    gender: string;
    telephone: string;
    password: string;
  }