const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewsSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = ReviewsSchema;
