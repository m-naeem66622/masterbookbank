const { validationResult } = require("express-validator");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id, shippingAddress, phoneNumber } = req.user;
        const { items, paymentMethod, shippingPrice, code } = req.body;
        let { totalPrice } = req;
        let discountObj = {};

        // Apply coupon code if provided
        if (code) {
            const coupon = await Coupon.findOne({ code: code.toUpperCase() });
            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            const { type, expirationDate, maxUses, discount } = coupon;

            if (expirationDate && new Date(expirationDate) < new Date()) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Coupon has expired.",
                            param: "code",
                            location: "body",
                        },
                    ],
                });
            }

            if (maxUses && coupon.usedCount >= maxUses) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Coupon is invalid.",
                            param: "code",
                            location: "body",
                        },
                    ],
                });
            }

            if (type === "flat") {
                totalPrice = totalPrice - discount;
            } else {
                totalPrice =
                    totalPrice - (totalPrice * (discount / 100)).toFixed(2);
            }

            discountObj = { type, value: discount };
        }

        // Place the order
        const order = await Order.create({
            user: id,
            items,
            shippingAddress,
            phoneNumber,
            paymentMethod,
            shippingPrice,
            discount: discountObj,
            totalPrice: req.totalPrice,
        });

        res.status(201).json({ message: "Order sucessfully has been placed." });
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c1" });
    }
};

// Get all orders
const fetchAll = async (req, res) => {
    try {
        let orders;
        if (req.admin) {
            orders = await Order.find()
                .populate("user", "name email")
                .populate({
                    path: "items.product",
                    model: "books",
                    select: "title",
                });
        } else if (req.user) {
            orders = await Order.find({ user: req.user.id })
                .select("-user")
                .populate({
                    path: "items.product",
                    model: "books",
                    select: "title",
                });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c2" });
    }
};

// Get a specific order by ID
const fetch = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate({
                path: "items.product",
                model: "books",
                select: "title images authors",
            });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c3" });
    }
};

// Update an order's status (e.g. shipped, cancelled)
const update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (req.user && order.user != req.user.id) {
            return res.status(401).json({ message: "Access denied 0x000c6" });
        }
        order.orderStatus = req.body.orderStatus;
        await order.save();
        res.json({ message: "Order status sucessfully updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c4" });
    }
};

// Delete an order
const drop = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (req.user && order.user != req.user.id) {
            return res.status(401).json({ message: "Access denied 0x000c7" });
        }
        await order.remove();
        res.json({ message: "Order removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c5" });
    }
};

module.exports = { create, fetchAll, fetch, update, drop };
