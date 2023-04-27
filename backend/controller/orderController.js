const Order = require("../models/orderSchema");

// Get all orders
const fetchAll = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c1" });
    }
};

// Get a specific order by ID
const fetch = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c2" });
    }
};

// Update an order's status (e.g. shipped, cancelled)
const update = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = req.body.status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c3" });
    }
};

// Delete an order
const drop = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.remove();
        res.json({ message: "Order removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000c4" });
    }
};

module.exports = { fetchAll, fetch, update, drop }