const express = require("express");
const couponValidationRules = require("../middleware/couponValidationRules");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const authenticateUser = require("../middleware/authenticateUser");
const calculator = require("../middleware/calculator");
const { create, fetchAll, fetch, update, drop, apply } = require("../controller/couponController");

const router = express.Router();

router.post("/create", couponValidationRules, authenticateAdmin, create);
router.get("/fetchAll", authenticateAdmin, fetchAll);
router.get("/fetch/:code", authenticateAdmin, fetch);
router.put("/update/:code", couponValidationRules, authenticateAdmin, update);
router.delete("/delete/:code", authenticateAdmin, drop);
router.post("/apply", authenticateUser, calculator, apply);


module.exports = router;
