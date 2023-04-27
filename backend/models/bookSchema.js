const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ReviewsSchema = require("./reviewsSchema");

const Book = new Schema({
    images: {
        type: [String],
    },
    title: {
        type: String,
        required: true
    },
    authors: {
        type: [String],
        required: true
    },
    categories: {
        type: [String],
        required: true,
    },
    language: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    inStock: {
        type: Number,
        min: 0,
        default: 0
    },
    publisher: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [ReviewsSchema]
}, {
    timestamps: true
})

module.exports = model("books", Book);