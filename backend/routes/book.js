const express = require("express");
const router = express.Router();
// const { validationResult } = require("express-validator");
const validationRules = require("../middleware/bookValidatonRules");
const { fetch, fetchAll, create, update, drop } = require("../controller/bookController");
const upload = require("../middleware/upload");

router.get("/fetchAll", fetchAll);
router.get("/fetch/:id", fetch);
router.post("/create", upload, validationRules, create);
router.put("/update/:id", upload, validationRules, update);
router.delete("/delete/:id", drop);

module.exports = router;
