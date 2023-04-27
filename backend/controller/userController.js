const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, phoneNumber, shippingAddress } = req.body;

        // Check whether the user already exist or not
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({ errors: [{ msg: "Email already exist", param: "email" }] });
        }

        // Salt and Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        // Saving user data into the database
        user = await User.create({
            name, email, password: secPass, phoneNumber, shippingAddress
        });

        // Get User ID to authenticate token
        const data = {
            user: { id: user.id }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ authToken })
    } catch (err) {
        console.log(err)
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
            return res.status(400).send({ errors: [{ msg: "Wrong credentials! Try again.", param: "email" }] });
        }

        const secPass = bcrypt.compareSync(password, user.password);
        if (!secPass) {
            return res.status(400).send({ errors: [{ msg: "Wrong credentials! Try again.", param: "password" }] });
        }

        // Get User ID to authenticate token
        const data = {
            user: { id: user.id, }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.send({ authToken });
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
        const { password, phoneNumber, shippingAddress, oldPassword } = req.body;

        // Check whether the user already exist or not
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).send({ message: "Access denied" });
        }

        let toUpdate = {};

        if (oldPassword && password) {
            const passwordMatch1 = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch1) {
                return res.status(400).send({ errors: [{ msg: "Old password is incorrect", param: "oldPassword" }] });
            }

            const passwordMatch2 = await bcrypt.compare(password, user.password);
            if (passwordMatch2) {
                return res.status(400).send({ errors: [{ msg: "Old password and new password are the same.", param: "oldPassword" }] });
            }

            // Salt and Hash the password
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);
            toUpdate = { password: secPass };
            console.log(password);
        }

        toUpdate = { ...toUpdate, phoneNumber, shippingAddress };

        // console.log(toUpdate);

        // Updating user data into the database
        // User.updateOne({ _id: req.user.id }, { $set: toUpdate });
        // const updated = await User.updateOne(
        //     { _id: req.user.id },
        //     { $set: { phoneNumber: toUpdate.phoneNumber }, $mergeObjects: { shippingAddress: toUpdate.shippingAddress } }
        // );
        if (toUpdate.password) {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { password: toUpdate.password, phoneNumber: toUpdate.phoneNumber, shippingAddress: toUpdate.shippingAddress } }
            );
            console.log("with password");
        } else {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { phoneNumber: toUpdate.phoneNumber, shippingAddress: toUpdate.shippingAddress } }
            );
        }


        // res.json({ authToken })
        res.json({ message: "User sucessfully updated" });
    } catch (err) {
        console.log(err)
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


module.exports = { signin, signup, fetch, update }
