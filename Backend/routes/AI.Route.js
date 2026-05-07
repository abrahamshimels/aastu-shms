const express = require("express");
const router = express.Router();
const {
  postChat,
  getConversations,
  getMessages,
} = require("../controllers/AI.controller");

router.post("/chat", postChat);
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId/messages", getMessages);

module.exports = router;
