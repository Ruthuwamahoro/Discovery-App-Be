"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true,
        trim: true, },
    email: { type: String, required: true, unique: true, trim: true,
        lowercase: true, },
    gender: { type: String, required: true },
    telephone: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, },
});
userSchema.index({ username: 1, email: 1 }, { unique: true });
exports.User = mongoose_1.default.model('User', userSchema);
