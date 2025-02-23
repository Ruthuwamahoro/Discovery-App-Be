import Book from "../models/bookModel";
import { Request, Response } from "express";
import { ApiResponse } from "./userController";

export const createBooksController = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  const {
    title,
    author,
    genre,
    publicationDate,
    coverImage,
    description,
    price,
    rating,
    stock,
  } = req.body;
  if (
    !title ||
    !author ||
    !genre ||
    !publicationDate ||
    !coverImage ||
    !description ||
    !price ||
    !rating ||
    !stock
  ) {
    res.status(404).json({
      status: 404,
      message: "All fields must be provided",
      data: null,
    });
  }

  const addBooks = new Book({
    title,
    author,
    genre,
    publicationDate,
    coverImage,
    description,
    price,
    rating,
    stock,
  });
  await addBooks.save();
  res.status(200).json({
    status: 200,
    message: "Book Added Successfully",
    data: null,
  });
};

interface QueryParams {
  search?: string;
  genre?: string;
  sortBy?: "title" | "date" | "rating";
  sortOrder?: "asc" | "desc";
}

interface SearchMetadata {
  query: string;
  matchCount: number;
  searchFields: string[];
  executionTimeMs: number;
}

export const getAllBooksController = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response<ApiResponse>
) => {
  try {
    const startTime = Date.now();
    const { search, genre, sortBy, sortOrder = "asc" } = req.query;

    let query = Book.find();
    let searchMetadata: SearchMetadata | null = null;

    if (search) {
      const searchFields = ["title", "author", "description", "genre"];
      query = query.or(
        searchFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        }))
      );

      searchMetadata = {
        query: search,
        matchCount: 0,
        searchFields,
        executionTimeMs: 0,
      };
    }

    if (genre) {
      query = query.where("genre").equals(genre);
    }

    if (sortBy) {
      const sortDirection = sortOrder === "desc" ? -1 : 1;

      switch (sortBy) {
        case "title":
          query = query.sort({ title: sortDirection });
          break;
        case "date":
          query = query.sort({ publicationDate: sortDirection });
          break;
        case "rating":
          query = query.sort({ rating: sortDirection });
          break;
        default:
          query = query.sort({ createdAt: -1 });
      }
    }

    const allBooks = await query.exec();
    const executionTime = Date.now() - startTime;

    if (searchMetadata) {
      searchMetadata.matchCount = allBooks.length;
      searchMetadata.executionTimeMs = executionTime;
    }

    res.status(200).json({
      status: 200,
      message: search
        ? `Found ${allBooks.length} books matching "${search}"`
        : "Books retrieved successfully",
      data: {
        books: allBooks,
        total: allBooks.length,
        filters: {
          search,
          genre,
          sortBy,
          sortOrder,
        },
        search: searchMetadata,
        pagination: {
          total: allBooks.length,
          totalPages: 1,
          currentPage: 1,
        },
        executionTimeMs: executionTime,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      data: null,
    });
  }
};

export const getBookByIdController = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({
        status: 404,
        message: "Book not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      data: null,
    });
  }
};

export const deleteBookByIdController = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      res.status(404).json({
        status: 404,
        message: "Book not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Book deleted successfully",
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      data: null,
    });
  }
};

export const updateBookById = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!book) {
      res.status(404).json({
        status: 404,
        message: "Book not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Book updated successfully",
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      data: null,
    });
  }
};
