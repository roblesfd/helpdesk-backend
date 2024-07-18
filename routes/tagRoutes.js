const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.route("/").get(tagController.getTags).post(tagController.createTag);
router.route("/:id").delete(tagController.deleteTag);

module.exports = router;
