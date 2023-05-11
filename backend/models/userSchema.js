const mongoose = require("mongoose");

const User = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        shippingAddress: {
            country: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "orders",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("users", User);
