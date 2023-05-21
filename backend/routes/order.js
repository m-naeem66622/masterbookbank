const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/authenticateAdmin")
const authenticateUser = require("../middleware/authenticateUser")
const calculator = require("../middleware/calculator")
const {createValidationRules, updateValidationRules} = require("../middleware/orderValidationRules")
const { create, fetchAll, fetch, update, drop } = require("../controller/orderController");

router.get('/admin/fetchAll', authenticateAdmin, fetchAll);
router.get('/fetchAll', authenticateUser, fetchAll);
router.get('/admin/fetch/:id', authenticateAdmin, fetch);
router.get('/fetch/:id', authenticateUser, fetch);
router.post('/create', createValidationRules, authenticateUser, calculator, create);
router.put('/admin/update/:id',updateValidationRules, authenticateAdmin, update);
router.put('/update/:id',updateValidationRules, authenticateUser, update);
router.delete('/admin/delete/:id', authenticateAdmin, drop);

module.exports = router;