const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware functin used where login is required
const authenticateUser = (req, res, next) => {
    try {
        // Get authentication token from header
        const authToken = req.header("authToken");

        // Check whether the authToken exist or not
        if (!authToken) {
            return res.status(401).send({ message: "Access denied 0x00aa1" });
        }

        // Verify the token and get payload from it
        const data = jwt.verify(authToken, JWT_SECRET);

        // Set the user id to request
        req.user = data.user;

        next();

    } catch (error) {
        return res.status(401).send({ error: "Access denied 0x00aa2" });
    }
}

module.exports = authenticateUser;