const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/")
    },
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        callback(null, Date.now() + ext);
    }
});

const fileFilter = (req, file, callback) => {
    const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        // Creating own Error to send as JSON
        const error = new Error("File type not supported");
        callback(error, false);
    }
};

const upload = multer({ storage, fileFilter }).array("images", 3);

const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (error) {
        // if (error instanceof multer.MulterError) {
        if (error) {
            // Check our created errors occur or not
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({ errors: [{ msg: "You can only add upto 3 images", param: "images", location: "body" }] });
            } else if (error.message === "File type not supported") {
                return res.status(400).json({ errors: [{ msg: error.message, param: "images", location: "body" }] });
            }

            return res.status(500).json({ message: "Server error 0x000e1" });
        }

        next();
    });
}

module.exports = uploadMiddleware