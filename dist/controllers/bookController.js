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
exports.updateBookById = exports.deleteBookByIdController = exports.getBookByIdController = exports.getAllBooksController = exports.createBooksController = void 0;
const bookModel_1 = __importDefault(require("../models/bookModel"));
const createBooksController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genre, publicationDate, coverImage, description, price, rating, stock } = req.body;
    if (!title || !author || !genre || !publicationDate || !coverImage || !description || !price || !rating || !stock) {
        res.status(404).json({ status: 404, message: "All fields must be provided", data: null });
    }
    const addBooks = new bookModel_1.default({
        title,
        author,
        genre,
        publicationDate,
        coverImage,
        description,
        price,
        rating,
        stock
    });
    yield addBooks.save();
    res.status(200).json({
        status: 200,
        message: "Book Added Successfully",
        data: null
    });
});
exports.createBooksController = createBooksController;
const getAllBooksController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startTime = Date.now();
        const { search, genre, sortBy, sortOrder = 'asc' } = req.query;
        // Start building the query
        let query = bookModel_1.default.find();
        let searchMetadata = null;
        // Apply search filter if provided
        if (search) {
            const searchFields = ['title', 'author', 'description', 'genre'];
            query = query.or(searchFields.map(field => ({
                [field]: { $regex: search, $options: 'i' }
            })));
            // Store search metadata
            searchMetadata = {
                query: search,
                matchCount: 0, // Will be updated after query execution
                searchFields,
                executionTimeMs: 0 // Will be updated after query execution
            };
        }
        // Apply genre filter if provided
        if (genre) {
            query = query.where('genre').equals(genre);
        }
        // Apply sorting if provided
        if (sortBy) {
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            switch (sortBy) {
                case 'title':
                    query = query.sort({ title: sortDirection });
                    break;
                case 'date':
                    query = query.sort({ createdAt: sortDirection });
                    break;
                case 'rating':
                    query = query.sort({ averageRating: sortDirection });
                    break;
                default:
                    query = query.sort({ createdAt: -1 });
            }
        }
        // Execute the query
        const allBooks = yield query.exec();
        const executionTime = Date.now() - startTime;
        // Update search metadata if search was performed
        if (searchMetadata) {
            searchMetadata.matchCount = allBooks.length;
            searchMetadata.executionTimeMs = executionTime;
        }
        // Return response
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
                    sortOrder
                },
                search: searchMetadata,
                pagination: {
                    total: allBooks.length,
                    totalPages: 1, // Add proper pagination logic if needed
                    currentPage: 1
                },
                executionTimeMs: executionTime
            }
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
exports.getAllBooksController = getAllBooksController;
const getBookByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield bookModel_1.default.findById(id);
        // if(book === null) {
        //     res.status(400).json({
        //         status: 400, 
        //         message: "Book not found", 
        //         data: null
        //     });
        // }
        res.status(200).json({
            status: 200,
            message: "Book retrieved successfully",
            data: book
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
exports.getBookByIdController = getBookByIdController;
const deleteBookByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield bookModel_1.default.findByIdAndDelete(id);
        // if(book === null) res.status(400).json({status: 400, message: "Book not found", data: null})
        res.status(200).json({
            status: 200,
            message: "Book deleted successfully",
            data: book
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
exports.deleteBookByIdController = deleteBookByIdController;
const updateBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield bookModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        // if(book === null) res.status(400).json({status: 400, message: "Book not found", data: null})
        res.status(200).json({
            status: 200,
            message: "Book updated successfully",
            data: book
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
exports.updateBookById = updateBookById;
