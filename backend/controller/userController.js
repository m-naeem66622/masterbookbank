const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const adminAuth = require("../firebase/firebase-admin");

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { uid, name, email, password, phoneNumber, shippingAddress } =
            req.body;
        const { signupWith, check, create } = req.query;
        console.log(req.query);

        // Check whether the user already exist or not
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({
                errors: [{ msg: "Email already exist", param: "email" }],
            });
        }

        user = await User.findOne({ phoneNumber });
        if (user) {
            return res.status(400).send({
                errors: [
                    { msg: "Phone number already exist", param: "phoneNumber" },
                ],
            });
        }

        if (check && check === "true") {
            return res.send({ message: "Credentials successfully checked." });
        }

        // Salt and Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        if (!signupWith || create !== "true") {
            return res
                .status(400)
                .send({ errors: [{ msg: "Bad request. Try again" }] });
        }

        // Saving user data into the database
        user = await User.create({
            _id: uid,
            name,
            email,
            password: secPass,
            phoneNumber,
            shippingAddress,
        });

        const userDetails = { ...user._doc };
        delete userDetails.password;

        // Create and Send custom token to firebase for signin
        let customToken;
        if (signupWith === "email") {
            customToken = await adminAuth.createCustomToken(user.id);
            return res.send({ customToken, userDetails });
        }

        res.send({ userDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error 0x000d1" });
    }
};

const signin = async (req, res) => {
    // If data entered by user contains errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    try {
        // Get user information from request body
        const { email, password } = req.body;

        // Check whether the username or password correct or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                errors: [
                    {
                        msg: "Wrong credentials! Try again.",
                        param: "email",
                    },
                ],
            });
        }

        const secPass = await bcrypt.compare(password, user.password);
        if (!secPass) {
            return res.status(400).send({
                errors: [
                    {
                        msg: "Wrong credentials! Try again.",
                        param: "password",
                    },
                ],
            });
        }

        const customToken = await adminAuth.createCustomToken(user.id);

        res.send({ customToken });
    } catch (error) {
        return res.status(500).send({ message: "Server error 0x000d2" });
    }
};

const update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { password, phoneNumber, shippingAddress, oldPassword } =
            req.body;

        // Check whether the user already exist or not
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).send({ message: "Access denied" });
        }

        let toUpdate = {};

        if (oldPassword && password) {
            const passwordMatch1 = await bcrypt.compare(
                oldPassword,
                user.password
            );
            if (!passwordMatch1) {
                return res.status(400).send({
                    errors: [
                        {
                            msg: "Old password is incorrect",
                            param: "oldPassword",
                        },
                    ],
                });
            }

            const passwordMatch2 = await bcrypt.compare(
                password,
                user.password
            );
            if (passwordMatch2) {
                return res.status(400).send({
                    errors: [
                        {
                            msg: "Old password and new password are the same.",
                            param: "oldPassword",
                        },
                    ],
                });
            }

            // Salt and Hash the password
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);
            toUpdate = { password: secPass };
        }

        toUpdate = { ...toUpdate, phoneNumber, shippingAddress };

        if (toUpdate.password) {
            await User.updateOne(
                { _id: req.user.id },
                {
                    $set: {
                        password: toUpdate.password,
                        phoneNumber: toUpdate.phoneNumber,
                        shippingAddress: toUpdate.shippingAddress,
                    },
                }
            );
        } else {
            await User.updateOne(
                { _id: req.user.id },
                {
                    $set: {
                        phoneNumber: toUpdate.phoneNumber,
                        shippingAddress: toUpdate.shippingAddress,
                    },
                }
            );
        }

        res.json({ message: "User sucessfully updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000d3" });
    }
};

const fetch = async (req, res) => {
    try {
        // Get user id from middleware function
        if (!req.user) {
            return res.status(404).send({ message: "User not found" });
        }
        const userID = req.user.id;

        // Get user details from its id except password
        const data = await User.findById(userID).select("-password");

        if (!data) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ data });
    } catch (error) {
        return res.status(500).send({ message: "Server error 0x000d4" });
    }
};

module.exports = { signin, signup, fetch, update };
