const { body } = require("express-validator");

const signinValidationRules = [
    body("email").exists().withMessage("Username cannot be empty.").isEmail().withMessage("Email is invalid"),
    body("password").exists().withMessage("Password cannot be empty").trim().isLength({ min: 8 }).withMessage("Password must contain atleast 8 characters")
    // .isStrongPassword().withMessage("Password must be strong")
];

const signupValidationRules = [
    body("name").exists().withMessage("Name cannot be empty").trim().isLength({ min: 5 }).withMessage("Name must be atleast 5 characters long"),
    body("email").exists().withMessage("Email cannot be empty.").isEmail().withMessage("Email is invalid"),
    body("phoneNumber").exists().withMessage("Phone number cannot be empty.").isNumeric().withMessage("Phone number is invalid"),
    body("password").exists().withMessage("Password cannot be empty").trim().isLength({ min: 8 }).withMessage("Password must contain atleast 8 characters"),
    body('confirmPassword').exists().withMessage('Confirm Password cannot be empty').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm Password does not match Password');
        }
        return true;
    }),
    body('shippingAddress.country').not().isEmpty().withMessage('Country is required').isString().withMessage('Country must be a string').trim(),
    body('shippingAddress.state').not().isEmpty().withMessage('State/Province is required').isString().withMessage('State/Province must be a string').trim(),
    body('shippingAddress.city').not().isEmpty().withMessage('City is required').isString().withMessage('City must be a string').trim(),
    body('shippingAddress.address').not().isEmpty().withMessage('Address is required').isString().withMessage('Address must be a string').trim(),
    body('shippingAddress.postalCode').not().isEmpty().withMessage('Postal code is required').isString().withMessage('Postal code must be a string').trim(),
    // .isStrongPassword().withMessage("Password must be strong")
];

const updateValidationRules = [
    body("phoneNumber").exists().withMessage("Phone number cannot be empty.").isNumeric().withMessage("Phone number is invalid"),
    body('oldPassword').custom((value, { req }) => {
        if (req.body.password || req.body.confirmPassword) {
            if (!value) {
                throw new Error('Old password is required');
            }
        }
        return true;
    }),
    body('password').custom((value, { req }) => {
        if (req.body.oldPassword) {
            if (!value) {
                throw new Error('New password is required');
            }
            if (value !== req.body.confirmPassword) {
                throw new Error('New password and confirm new password do not match.');
            }
        }
        return true;
    }),
    body('shippingAddress.country').not().isEmpty().withMessage('Country is required').isString().withMessage('Country must be a string').trim(),
    body('shippingAddress.state').not().isEmpty().withMessage('State/Province is required').isString().withMessage('State/Province must be a string').trim(),
    body('shippingAddress.city').not().isEmpty().withMessage('City is required').isString().withMessage('City must be a string').trim(),
    body('shippingAddress.address').not().isEmpty().withMessage('Address is required').isString().withMessage('Address must be a string').trim(),
    body('shippingAddress.postalCode').not().isEmpty().withMessage('Postal code is required').isString().withMessage('Postal code must be a string').trim(),
    // .isStrongPassword().withMessage("Password must be strong")
];

module.exports = { signinValidationRules, signupValidationRules, updateValidationRules };