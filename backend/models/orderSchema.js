const mongoose = require('mongoose');

const Order = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'books',
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
        coupon: {
            type: String,
            trim: true,
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Credit Card', 'Debit Card', 'Net Banking'],
            required: true,
        },
        // paymentResult: {
        //     id: { type: String },
        //     status: { type: String },
        //     update_time: { type: String },
        //     email_address: { type: String },
        // },
        // taxPrice: {
        //     type: Number,
        //     required: true,
        //     default: 0.0,
        // },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        // isPaid: {
        //     type: Boolean,
        //     required: true,
        //     default: false,
        // },
        // paidAt: {
        //     type: Date,
        // },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// const Order = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'users',
//         required: true
//     },
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'books',
//                 required: true
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 default: 1
//             }
//         }
//     ],
//     shippingAddress: {
//         address: {
//             type: String,
//             required: true
//         },
//         city: {
//             type: String,
//             required: true
//         },
//         postalCode: {
//             type: String,
//             required: true
//         },
//         country: {
//             type: String,
//             required: true
//         }
//     },
//     paymentMethod: {
//         type: String,
//         required: true
//     },
//     paymentResult: {
//         id: {
//             type: String
//         },
//         status: {
//             type: String
//         },
//         update_time: {
//             type: String
//         },
//         email_address: {
//             type: String
//         }
//     },
//     itemsPrice: {
//         type: Number,
//         required: true,
//         default: 0.0
//     },
//     taxPrice: {
//         type: Number,
//         required: true,
//         default: 0.0
//     },
//     shippingPrice: {
//         type: Number,
//         required: true,
//         default: 0.0
//     },
//     totalPrice: {
//         type: Number,
//         required: true,
//         default: 0.0
//     },
//     isPaid: {
//         type: Boolean,
//         required: true,
//         default: false
//     },
//     paidAt: {
//         type: Date
//     },
//     isDelivered: {
//         type: Boolean,
//         required: true,
//         default: false
//     },
//     deliveredAt: {
//         type: Date
//     }
// }, {
//     timestamps: true
// });

module.exports = mongoose.model('orders', Order);
