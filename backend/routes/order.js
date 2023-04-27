const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/authenticateAdmin")
const { fetchAll, fetch, update, drop } = require("../controller/orderController");

router.get('/orders', authenticateAdmin, fetchAll);
router.get('/orders/:id', authenticateAdmin, fetch);
router.put('/orders/:id', authenticateAdmin, update);
router.delete('/orders/:id', authenticateAdmin, drop);

module.exports = router;