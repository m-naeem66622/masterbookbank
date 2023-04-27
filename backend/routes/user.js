const express = require("express");
const router = express.Router();
const { signupValidationRules, signinValidationRules, updateValidationRules } = require("../middleware/userValidationRules");
// const {signinValidationRules} = require("../middleware/adminValidationRules");
const authenticateUser = require("../middleware/authenticateUser")
const { signin, signup, fetch, update } = require("../controller/userController");

router.post("/user/signup", signupValidationRules, signup);
router.post("/user/signin", signinValidationRules, signin);
router.put("/user/update", authenticateUser, updateValidationRules, update);
router.post("/user", authenticateUser, fetch);

module.exports = router;
