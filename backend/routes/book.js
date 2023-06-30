const express = require("express");
const router = express.Router();
const {forAddingModifying, forRequestingBook} = require("../middleware/bookValidatonRules");
const { fetch, fetchAll, create, update, drop } = require("../controller/bookController");
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authenticateAdmin");

router.get("/fetchAll", forRequestingBook, fetchAll);
router.get("/fetch/:id", fetch);
router.post("/create", authenticate, upload, forAddingModifying, create);
router.put("/update/:id", authenticate, upload, forAddingModifying, update);
router.delete("/delete/:id", authenticate, drop);

module.exports = router;
