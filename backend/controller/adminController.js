const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, username, password } = req.body;

        // Check whether the admin already exist or not
        let admin = await Admin.findOne({ username });
        if (admin) {
            return res.status(400).send({ errors: [{ msg: "Username already exist", param: "username" }] });
        }

        // Salt and Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        // Saving admin data into the database
        admin = await Admin.create({
            name, username, password: secPass
        });

        // Get Admin ID to authenticate token
        const data = {
            admin: { id: admin.id }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ authToken })
    } catch (error) {
        res.status(500).json({ message: "Server error 0x000a1" });
    }
};

const signin = async (req, res) => {
    // If data entered by admin contains errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    try {

        // Get admin information from request body
        const { username, password } = req.body;

        // Check whether the username or password correct or not
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).send({ errors: [{ msg: "Wrong credentials! Try again.", param: "username" }] });
        }

        const secPass = bcrypt.compareSync(password, admin.password);
        if (!secPass) {
            return res.status(400).send({ errors: [{ msg: "Wrong credentials! Try again.", param: "password" }] });
        }

        // Get Admin ID to authenticate token
        const data = {
            admin: { id: admin.id, }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.send({ authToken });
    } catch (error) {
        return res.status(500).send({ message: "Server error 0x000a2" });
    }
};


const fetch = async (req, res) => {
    try {
        // Get admin id from middleware function
        if (!req.admin) {
            return res.status(404).send({ message: "Admin not found 1" });
        }
        const userID = req.admin.id;

        // Get admin details from its id except password
        const data = await Admin.findById(userID).select("-password");

        if (!data) {
            return res.status(404).send({ message: "Admin not found" });
        }

        res.send({ data });
    } catch (error) {
        return res.status(500).send({ message: "Server error 0x000a3" });
    }
};


module.exports = { signin, signup, fetch }
