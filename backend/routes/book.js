const express = require("express");
const router = express.Router();
// const { validationResult } = require("express-validator");
const validationRules = require("../middleware/bookValidatonRules");
const { fetch, fetchAll, create, update, drop } = require("../controller/bookController");
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authenticateAdmin");

router.get("/fetchAll",authenticate, fetchAll);
router.get("/fetch/:id",authenticate, fetch);
router.post("/create",authenticate, upload, validationRules, create);
router.put("/update/:id",authenticate, upload, validationRules, update);
router.delete("/delete/:id",authenticate, drop);

module.exports = router;
