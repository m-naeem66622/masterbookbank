const { body, query } = require("express-validator");

const forAddingModifying = [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Description is required"),
    body("authors")
        .isArray({ min: 1 })
        .withMessage("At least one author is required")
        .custom((value) => {
            if (!value) {
                return true; // stop executing custom errors if categories is undefined
            }
            if (value.some((item) => typeof item !== "string")) {
                throw new Error("All authors must be strings");
            }
            return true;
        }),
    body("authors.*")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Author name is required"),
    body("price")
        .isFloat({ min: 0.01 })
        .withMessage("Price must be a positive number"),
    body("publisher")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Publisher is required"),
    body("publishDate")
        .isISO8601()
        .withMessage("Publish date must be a valid date (YYYY-MM-DD)"),
    body("inStock")
        .if(body("inStock").exists())
        .isInt({ min: 0 })
        .withMessage("In stock must be a positive integer"),
    body("pages")
        .isInt({ min: 1 })
        .withMessage("Pages must be a positive integer"),
    body("language")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Language is required"),
    body("categories")
        .isArray({ min: 1 })
        .withMessage("At least one category is required")
        .custom((value) => {
            if (!value) {
                return true; // stop executing custom errors if categories is undefined
            }
            if (value.some((item) => typeof item !== "string")) {
                throw new Error("All categories must be strings");
            }
            return true;
        }),
    body("categories.*")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Category name is required"),
    body("tags")
        .isArray({ min: 1 })
        .withMessage("At least one tag is required")
        .custom((value) => {
            if (!value) {
                return true; // stop executing custom errors if categories is undefined
            }
            if (value.some((item) => typeof item !== "string")) {
                throw new Error("All tags must be strings");
            }
            return true;
        }),
    body("tags.*")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Tag name is required"),
];

const forRequestingBook = [
    query("page")
        .if(query("page").exists())
        .isInt({ min: 1 })
        .withMessage("page must be a positive integer"),
    query("limit")
        .if(query("limit").exists())
        .isInt()
        .withMessage("limit must be a positive integer")
        .isInt({ min: 1, max: 20 })
        .withMessage("limit must be between 1 to 20"),
];

module.exports = { forAddingModifying, forRequestingBook };
