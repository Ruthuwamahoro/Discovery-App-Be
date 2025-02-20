import Book from "../models/bookModel";
import {Request, Response} from "express";
import { ApiResponse } from "./userController";
import { FilterQuery } from 'mongoose';


export const createBooksController = async(req:Request, 
  res: Response<ApiResponse>
): Promise<void>  => {
    const { title, author, genre, publicationDate, coverImage, description, price, rating,stock} = req.body;
    if(!title ||  !author|| !genre || !publicationDate || !coverImage || !description || !price || !rating || !stock){
        res.status(404).json({status:404, message: "All fields must be provided", data: null})
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
        stock
    })
    await addBooks.save();
    res.status(200).json({
        status: 200,
        message: "Book Added Successfully",
        data: null
    })
}
// export const getAllBooksController = async(req:Request, res: Response<ApiResponse>) => {
//     try{

//         const AllBooks = await Book.find();
//         res.status(200).json({
//             status: 200,
//             message: "All books retrieved successfully",
//             data: AllBooks
//         })

//     } catch(err){
//         res.status(500).json({
//             status: 500,
//             message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
//             data: null
//         })
//     }
// }


interface QueryParams {
    search?: string;
    genre?: string;
    sortBy?: 'title' | 'date' | 'rating';
    sortOrder?: 'asc' | 'desc';
}

interface SearchMetadata {
    query: string;
    matchCount: number;
    searchFields: string[];
    executionTimeMs: number;
}

export const getAllBooksController = async (req: Request<{}, {}, {}, QueryParams>, res: Response<ApiResponse>) => {
    try {
        const startTime = Date.now();
        const { search, genre, sortBy, sortOrder = 'asc' } = req.query;

        // Start building the query
        let query = Book.find();
        let searchMetadata: SearchMetadata | null = null;

        // Apply search filter if provided
        if (search) {
            const searchFields = ['title', 'author', 'description','genre'];
            query = query.or(
                searchFields.map(field => ({
                    [field]: { $regex: search, $options: 'i' }
                }))
            );

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
        const allBooks = await query.exec();
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

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
            data: null
        });
    }
};

export const getBookByIdController = async(req: Request, res: Response<ApiResponse>) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        
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
    } catch(err) {
        res.status(500).json({
            status: 500,
            message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
            data: null
        });
    }
}
export const deleteBookByIdController = async(req:Request, res: Response<ApiResponse>) => {
    try{
        const {id} = req.params;
        const book = await Book.findByIdAndDelete(id);
        // if(book === null) res.status(400).json({status: 400, message: "Book not found", data: null})
        res.status(200).json({
            status: 200,
            message: "Book deleted successfully",
            data: book
        })
    } catch(err){
    res.status(500).json({
        status: 500,
        message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
        data: null
    })
 }
}

export const updateBookById = async(req:Request, res: Response<ApiResponse>) => {
    try{
        const {id} = req.params;
        const book = await Book.findByIdAndUpdate(id, req.body, {new: true});
        // if(book === null) res.status(400).json({status: 400, message: "Book not found", data: null})
        res.status(200).json({
            status: 200,
            message: "Book updated successfully",
            data: book
        })
    } catch(err){
        res.status(500).json({
            status: 500,
            message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
            data: null
        })
     }
            
}