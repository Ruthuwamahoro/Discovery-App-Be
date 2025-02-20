"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
// import bodyParser from "body-parser";
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', userRoutes_1.default);
app.use('/api', bookRoutes_1.default);
app.use((err, req, res, next) => {
    const Error = err;
    res.status(500).json({ status: 500, message: Error.message, data: null });
});
exports.default = app;
