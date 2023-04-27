const express = require("express");
const router = express.Router();
const { signupValidationRules, signinValidationRules } = require("../middleware/adminValidationRules");
// const {signinValidationRules} = require("../middleware/adminValidationRules");
const authenticateAdmin = require("../middleware/authenticateAdmin")
const { signin, signup, fetch } = require("../controller/adminController");

router.post("/admin/signup", signupValidationRules, signup);
router.post("/admin/signin", signinValidationRules, signin);
router.post("/admin", authenticateAdmin, fetch);

module.exports = router;
