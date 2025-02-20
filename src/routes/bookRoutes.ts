import { createBooksController, deleteBookByIdController, getAllBooksController, getBookByIdController, updateBookById } from "../controllers/bookController";
import express from "express";


const bookRouter = express.Router();

bookRouter.post("/books",createBooksController);
bookRouter.get("/books", getAllBooksController);
bookRouter.get("/books/:id", getBookByIdController);
bookRouter.delete("/books/:id", deleteBookByIdController);
bookRouter.patch("/books/:id", updateBookById);
export default bookRouter;