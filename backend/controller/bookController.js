const { validationResult } = require("express-validator");
const fs = require("fs");
const Book = require("../models/bookSchema");

// Get all books
const fetchAll = async (req, res) => {
    try {
        const { query } = req;
        const {
            title,
            authors,
            categories,
            publisher,
            language,
            limit = 10,
            page = 1,
            from,
            to,
            random,
        } = query;
        const filters = {};

        if (title) {
            const terms = title.split(" ").map((term) => new RegExp(term, "i"));
            filters.$or = terms.map((term) => ({ title: term }));
        }

        if (authors) {
            const authorArray = authors
                .split(",")
                .map((word) =>
                    word
                        .replace(/[^a-zA-Z0-9-\s]+/g, "")
                        .trim()
                        .replace(/\s*-\s*/g, "-")
                )
                .filter(Boolean);
            filters.authors = {
                $in: authorArray.map((author) => new RegExp(author, "i")),
            };
        }

        if (categories) {
            const categoryArray = categories
                .split(",")
                .map((word) =>
                    word
                        .replace(/[^a-zA-Z0-9-\s]+/g, "")
                        .trim()
                        .replace(/\s*-\s*/g, "-")
                )
                .filter(Boolean);
            filters.categories = {
                $in: categoryArray.map((category) => new RegExp(category, "i")),
            };
        }

        if (publisher) {
            filters.publisher = new RegExp(publisher, "i");
        }

        if (language) {
            filters.language = new RegExp(language, "i");
        }

        if (from) {
            filters.createdAt = { $gte: new Date(from) };
        }

        if (to) {
            if (filters.createdAt) {
                filters.createdAt.$lte = new Date(to);
            } else {
                filters.createdAt = { $lte: new Date(to) };
            }
        }

        let totalDocuments;
        let documents;
        if (random === "true") {
            documents = await Book.aggregate([
                { $match: filters },
                { $sample: { size: Number(limit) } },
            ]).exec();
            totalDocuments = documents.length;
        } else {
            totalDocuments = await Book.countDocuments(filters).exec();
            documents = await Book.find(filters)
                .limit(Number(limit))
                .skip((page - 1) * limit)
                .exec();
        }

        res.json({
            limit: Number(limit),
            page: Number(page),
            totalResults: totalDocuments,
            currentResults: documents.length,
            documents,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error 0x000b1" });
    }
};

// Get specific book
const fetch = async (req, res) => {
    try {
        // Check book trying to fetch exist or not
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (err) {
        if (err.reason.toString().includes("string of 24 hex characters")) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(500).json({ message: "Server error 0x000b2" });
    }
};

// Create a new book
const create = async (req, res) => {
    // Check at least one image added or not
    if (!req.files) {
        return res.status(400).json({
            errors: [
                {
                    msg: "At least one image is required",
                    param: "images",
                    location: "body",
                },
            ],
        });
    } else if (req.files.length < 1) {
        req.files.forEach((file) => {
            fs.unlink(file.path, (err) => {
                if (err)
                    fs.writeFileSync(`files-not-deleted.txt`, file.path + "\n");
            });
        });

        return res.status(400).json({
            errors: [
                {
                    msg: "At least one image is required",
                    param: "images",
                    location: "body",
                },
            ],
        });
    }

    // Undo uploaded images if errors exist in form validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.files.forEach((file) => {
            fs.unlink(file.path, (err) => {
                if (err)
                    fs.writeFileSync(`files-not-deleted.txt`, file.path + "\n");
            });
        });

        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Extract book data from request body
        const {
            title,
            description,
            authors,
            price,
            publisher,
            publishDate,
            inStock,
            pages,
            language,
            categories,
            tags,
        } = req.body;

        // Get paths of uploaded images
        const images = req.files.map((file) => file.path);

        // Create new book object
        const book = new Book({
            title,
            description,
            authors,
            price,
            publisher,
            publishDate,
            inStock,
            pages,
            language,
            categories,
            tags,
            images,
        });

        // Save new book object to database
        const newBook = await book.save();
        res.status(201).json({ message: "Book sucessfully added" });
    } catch (err) {
        res.status(500).json({ message: "Server error 0x000b3" });
    }
};

// Update a book
const update = async (req, res) => {
    // Undo uploaded images if errors exist in form validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.files.forEach((file) => {
            fs.unlink(file.path, (err) => {
                if (err)
                    fs.writeFileSync(`files-not-deleted.txt`, file.path + "\n");
            });
        });
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            title,
            description,
            authors,
            price,
            publisher,
            publishDate,
            inStock,
            pages,
            language,
            categories,
            tags,
            toDelete,
        } = req.body;

        // Check book trying to update exist or not
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const alreadyStoredImages = book.images;
        const imagesFromMulter = req.files.map((file) => file.path);
        let validFilesToDelete = [];

        if (toDelete) {
            // Filter Valid Images (image is the part of its own book or not)
            toDelete.forEach((imageUrl) => {
                if (book.images.includes(imageUrl)) {
                    validFilesToDelete.push(imageUrl);
                }
            });

            // Terminate process if sum of deleting, already exist and adding more images count > 3
            if (
                alreadyStoredImages.length +
                    imagesFromMulter.length -
                    validFilesToDelete.length >
                3
            ) {
                req.files.forEach((file) => {
                    fs.unlink(file.path, (err) => {
                        if (err)
                            fs.writeFileSync(
                                `files-not-deleted.txt`,
                                file.path + "\n"
                            );
                    });
                });

                return res.status(400).json({
                    errors: [
                        {
                            msg: "You can only add upto 3 images",
                            param: "images",
                            location: "body",
                        },
                    ],
                });
            } else if (
                alreadyStoredImages.length +
                    imagesFromMulter.length -
                    validFilesToDelete.length <
                1
            ) {
                req.files.forEach((file) => {
                    fs.unlink(file.path, (err) => {
                        if (err)
                            fs.writeFileSync(
                                `files-not-deleted.txt`,
                                file.path + "\n"
                            );
                    });
                });

                return res.status(400).json({
                    errors: [
                        {
                            msg: "At least one image is required",
                            param: "images",
                            location: "body",
                        },
                    ],
                });
            }
        } else {
            if (alreadyStoredImages.length + imagesFromMulter.length > 3) {
                req.files.forEach((file) => {
                    fs.unlink(file.path, (err) => {
                        if (err)
                            fs.writeFileSync(
                                `files-not-deleted.txt`,
                                file.path + "\n"
                            );
                    });
                });

                return res.status(400).json({
                    errors: [
                        {
                            msg: "You can only add upto 3 images",
                            param: "images",
                            location: "body",
                        },
                    ],
                });
            }
        }

        let filteredImages = [];
        // Delete book images from server if any
        if (validFilesToDelete.length !== 0) {
            validFilesToDelete.forEach((imageUrl) => {
                fs.unlink(imageUrl, (err) => {
                    if (err)
                        fs.writeFileSync(
                            `files-not-deleted.txt`,
                            file.path + "\n"
                        );
                });
            });
            filteredImages = alreadyStoredImages.filter(
                (url) => !toDelete.includes(url)
            );
        } else {
            filteredImages = [...alreadyStoredImages];
        }

        const updatedData = {
            title,
            description,
            authors,
            price,
            publisher,
            publishDate,
            inStock,
            pages,
            language,
            categories,
            tags,
            images: [...filteredImages, ...imagesFromMulter],
        };

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json({ message: "Book successfully updated" });
    } catch (err) {
        if (err.reason.toString().includes("string of 24 hex characters")) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(500).json({ message: "Server error 0x000b4" });
    }
};

// Delete a book
const drop = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Delete book images from server
        book.images.forEach((imageUrl) => {
            fs.unlink(imageUrl, (err) => {
                if (err)
                    fs.writeFileSync(`files-not-deleted.txt`, file.path + "\n");
            });
        });

        // Delete book document from database
        const result = await Book.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book successfully deleted" });
    } catch (err) {
        if (err) {
            if (err.reason.toString().includes("string of 24 hex characters")) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.status(500).json({ message: "Server error 0x000b5" });
        }
    }
};

module.exports = { fetchAll, fetch, create, update, drop };
