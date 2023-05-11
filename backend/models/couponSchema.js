const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ["flat", "percent"],
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    maxUses: {
        type: Number,
        required: true,
        min: 1,
    },
    currentUses: {
        type: Number,
        default: 0,
        min: 0,
    },
});
// const couponSchema = new mongoose.Schema({
//     code: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     discount: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     expirationDate: {
//         type: Date,
//         required: true,
//     },
//     maxUses: {
//         type: Number,
//         required: true,
//         min: 1,
//     },
//     currentUses: {
//         type: Number,
//         required: true,
//         default: 0,
//         min: 0,
//     },
// });

module.exports = mongoose.model("coupons", couponSchema);
