const mongoose = require('mongoose');

const ShippingAddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    shippingAddress: ShippingAddressSchema,
    phoneNumber: {
        type: String,
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('users', User);
