"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.getAllUsers = exports.getUserByIdController = exports.signUpController = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const router = express_1.default.Router();
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return done(null, false, { message: "Invalid email" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, gender, telephone, password } = req.body;
    if (!username || !email || !gender || !telephone || !password) {
        res.status(400).json({
            status: 400,
            message: "Fields are missing",
            data: null,
        });
        return;
    }
    try {
        const [existingUsername, existingEmail] = yield Promise.all([
            userModel_1.User.findOne({ username }),
            userModel_1.User.findOne({ email }),
        ]);
        if (existingUsername) {
            res.status(400).json({
                status: 400,
                message: "Username already exists",
                data: null,
            });
            return;
        }
        if (existingEmail) {
            res.status(400).json({
                status: 400,
                message: "Email already exists",
                data: null,
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.User({
            username,
            email,
            gender,
            telephone,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(200).json({
            status: 200,
            message: "Successfully registered",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
            data: null,
        });
    }
});
exports.signUpController = signUpController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.User.findById({ id });
        res.status(200).json({
            status: 200,
            message: "user retrieved successfully",
            data: user
        });
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
            data: null
        });
    }
});
exports.getUserByIdController = getUserByIdController;
const getAllUsers = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.User.find();
        res.status(200).json({
            status: 200,
            message: "All users retrieved successfully",
            data: allUsers
        });
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
            data: null
        });
    }
});
exports.getAllUsers = getAllUsers;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", { session: false }, (error, user, info) => {
        if (error)
            return next(error);
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: info.message,
                data: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-fallback-secret', {
            expiresIn: "8h",
        });
        return res.status(200).json({
            status: 200,
            message: "Logged in successfully",
            data: token,
        });
    })(req, res, next);
});
exports.loginController = loginController;
exports.default = router;
