const User = require("../models/userSchema");
const auth = require("../firebase/firebase-admin");

// Middleware functin used where login is required
const authenticateUser = async (req, res, next) => {
    try {
        // Get authentication token from header
        const idToken = req.header("idToken");

        // Check whether the idToken exist or not
        if (!idToken) {
            return res.status(401).send({ message: "Access denied 0x00aa1" });
        }

        // Verify the token and get payload from it
        const decodedToken = await auth.verifyIdToken(idToken);

        const user = await User.findById(decodedToken.uid);
        if (!user) {
            return res.status(401).send({ message: "Access denied 0x00aa2" });
        }

        // Set the user id and shipping address to request
        req.user = {
            id: decodedToken.uid,
            shippingAddress: user.shippingAddress,
            phoneNumber: user.phoneNumber,
        };

        next();
    } catch (error) {
        return res
            .status(401)
            .send({ error: "Access denied 0x00aa3", code: error.code });
    }
};

module.exports = authenticateUser;
