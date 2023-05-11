const { body } = require("express-validator");

const couponValidationRules = [
    body("code")
        .trim()
        .notEmpty()
        .withMessage("Coupon code is required")
        .isLength({ min: 4 })
        .withMessage("Coupon code must be at least 4 characters"),
    body("type").isIn(["flat", "percent"]).withMessage("Invalid discount type"),
    body("discount")
        .isFloat({ min: 0 })
        .withMessage("Discount must be a positive number"),
    body("expirationDate")
        .isISO8601()
        .toDate()
        .isAfter(new Date().toISOString())
        .withMessage("Expiration date must be a future date"),
    body("maxUses")
        .isInt({ min: 1 })
        .withMessage("Maximum uses must be a positive integer"),
];

module.exports = couponValidationRules;
