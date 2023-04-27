const { body } = require("express-validator");

const signinValidationRules = [
    body("username").exists().withMessage("Username cannot be empty.").isLength({ min: 5 }).withMessage("Username must be at least 5 characters").matches(/^[a-zA-Z0-9._-]{3,}$/).withMessage("Invalid username"),
    body("password").exists().withMessage("Password cannot be empty").trim().isLength({ min: 8 }).withMessage("Password must contain atleast 8 characters")
    // .isStrongPassword().withMessage("Password must be strong")
];

const signupValidationRules = [
    body("name").exists().withMessage("Name cannot be empty").trim().isLength({ min: 5 }).withMessage("Name must be atleast 5 characters long"),
    body("username").exists().withMessage("Username cannot be empty.").isLength({ min: 5 }).withMessage("Username must be at least 5 characters").matches(/^[a-zA-Z0-9._-]{3,}$/).withMessage("Invalid username"),
    body("password").exists().withMessage("Password cannot be empty").trim().isLength({ min: 8 }).withMessage("Password must contain atleast 8 characters"),
    body('confirmPassword').exists().withMessage('Confirm Password cannot be empty').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm Password does not match Password');
        }
        return true;
    }),
    // .isStrongPassword().withMessage("Password must be strong")
];

module.exports = { signinValidationRules, signupValidationRules };