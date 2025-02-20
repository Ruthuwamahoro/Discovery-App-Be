"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookController_1 = require("../controllers/bookController");
const express_1 = __importDefault(require("express"));
const bookRouter = express_1.default.Router();
bookRouter.post("/books", bookController_1.createBooksController);
bookRouter.get("/books", bookController_1.getAllBooksController);
bookRouter.get("/books/:id", bookController_1.getBookByIdController);
bookRouter.delete("/books/:id", bookController_1.deleteBookByIdController);
bookRouter.patch("/books/:id", bookController_1.updateBookById);
exports.default = bookRouter;
