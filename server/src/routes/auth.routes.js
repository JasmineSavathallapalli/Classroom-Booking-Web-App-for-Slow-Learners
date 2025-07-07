const express = require("express");
const { verifySession } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/verify", verifySession);

module.exports = router;
