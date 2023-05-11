const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/authenticateAdmin")
const authenticateUser = require("../middleware/authenticateUser")
const calculator = require("../middleware/calculator")
const validationRules = require("../middleware/orderValidationRules")
const { create, fetchAll, fetch, update, drop } = require("../controller/orderController");
const { apply } = require("../controller/couponController");

router.get('/admin/fetchAll', authenticateAdmin, fetchAll);
router.get('/fetchAll', authenticateUser, fetchAll);
router.get('/admin/fetch/:id', authenticateAdmin, fetch);
router.get('/fetch/:id', authenticateUser, fetch);
router.post('/create', validationRules, authenticateUser, calculator, create);
router.put('/admin/update/:id', authenticateAdmin, update);
router.delete('/admin/delete/:id', authenticateAdmin, drop);

module.exports = router;