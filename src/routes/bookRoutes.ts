import { Router } from "express";
import {
  createBooksController,
  getAllBooksController,
  getBookByIdController,
  deleteBookByIdController,
  updateBookById,
  getRecommendedBooksController,
} from "../controllers/bookController";

const router = Router();

router.post("/books", createBooksController);
router.get("/books", getAllBooksController);
router.get("/books/:id", getBookByIdController);
router.patch("/books/:id", updateBookById);
router.delete("/books/:id", deleteBookByIdController);
router.get("/books/recommendations", getRecommendedBooksController);

export default router;
