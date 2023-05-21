const { body } = require("express-validator");

// Validation rules for the Order schema
const createValidationRules = [
    body("items.*.product")
        .isMongoId()
        .withMessage("Product ID is required for each item"),
    body("items.*.quantity")
        .isNumeric({ no_symbols: true })
        .withMessage("Quantity must be a number"),
    body("paymentMethod")
        .isIn(["COD", "EASYPAISA", "JAZZCASH", "MASTERCARD"])
        .withMessage("Payment method is invalid"),
    body("shippingPrice")
        .isNumeric({ no_symbols: true })
        .withMessage("Shipping price must be a number"),
    body("orderStatus")
        .optional()
        .isIn(["Pending", "Processing", "Shipped", "Delivered"])
        .withMessage("Order Status is invalid"),
    body("deliveredAt").optional().isISO8601().toDate(),
];

const updateValidationRules = [
    body("orderStatus").exists().withMessage("Order status is required.")
        .isIn(["Pending", "Processing", "Shipped", "Delivered"])
        .withMessage("Order Status is invalid"),
    body("deliveredAt").optional().isISO8601().toDate(),
];

module.exports = { createValidationRules, updateValidationRules };
