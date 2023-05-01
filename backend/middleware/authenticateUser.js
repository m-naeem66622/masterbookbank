const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/userSchema");

// Middleware functin used where login is required
const authenticateUser = async (req, res, next) => {
    try {
        // Get authentication token from header
        const authToken = req.header("authToken");

        // Check whether the authToken exist or not
        if (!authToken) {
            return res.status(401).send({ message: "Access denied 0x00aa1" });
        }

        // Verify the token and get payload from it
        const data = jwt.verify(authToken, JWT_SECRET);

        const user = await User.findById(data.user.id);
        if (!user) {
            return res.status(401).send({ message: "Access denied 0x00aa2" });
        }

        // Set the user id to request
        req.user = data.user;

        next();

    } catch (error) {
        return res.status(401).send({ error: "Access denied 0x00aa3" });
    }
}

module.exports = authenticateUser;