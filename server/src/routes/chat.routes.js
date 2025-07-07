const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

// Send a message
router.post("/", chatController.sendMessage);

// Get messages between a student and a teacher
router.get("/conversation/:senderId/:recipientId", chatController.getConversation);

module.exports = router;
