const Coupon = require("../models/couponSchema");
const { validationResult } = require("express-validator");

// Route to create a new coupon
const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { code, type, discount, expirationDate, maxUses } = req.body;

        const coupon = new Coupon({
            code,
            type,
            discount,
            expirationDate,
            maxUses,
        });

        await coupon.save();
        res.status(201).json({ message: "Coupon sucessfully added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Route to get a list of all coupons
const fetchAll = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Route to get a single coupon by code
const fetch = async (req, res) => {
    const { code } = req.params;

    try {
        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Route to update a coupon by code
const update = async (req, res) => {
    const { code } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const coupon = await Coupon.findOneAndUpdate(
            { code },
            { $set: req.body },
            { new: true }
        );
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Route to delete a coupon by code
const drop = async (req, res) => {
    const { code } = req.params;

    try {
        const coupon = await Coupon.findOneAndDelete({ code });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const apply = async (req, res) => {
    try {
        const code = req.body.code.toUpperCase();
        const { totalPrice } = req;

        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        const { type, expirationDate, maxUses, discount } = coupon;

        if (expirationDate && new Date(expirationDate) < new Date()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        if (maxUses && coupon.usedCount >= maxUses) {
            return res
                .status(400)
                .json({ message: "Coupon has reached its maximum uses" });
        }

        let discountedPrice;

        if (type === "flat") {
            discountedPrice = discount;
        } else {
            discountedPrice = (totalPrice * (discount / 100)).toFixed(2);
        }

        req.body.discount = discountedPrice;

        if(code)
        res.json({ discount: discountedPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { create, fetchAll, fetch, update, drop, apply };
