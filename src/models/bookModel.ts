import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    publicationDate: String,
    coverImage: String || null,
    description: String,
    price: Number,
    rating: Number,
    stock: Number,
})

const Book = mongoose.model('Book', bookSchema);
export default Book;