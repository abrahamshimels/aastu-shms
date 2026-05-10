const jwt = require("jsonwebtoken");
const {
  sendMessage,
  listUserConversations,
  getConversationMessages,
  getDashboardHelp,
} = require("../services/ai/chatService");

const attachOptionalUser = (req) => {
  const token = req.headers.authorization;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.KEY);
  } catch (error) {
    return null;
  }
};

const postChat = async (req, res) => {
  try {
    const user = attachOptionalUser(req);
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required',
        code: 'EMPTY_MESSAGE' 
      });
    }

    const response = await sendMessage({
      message,
      conversationId,
      user,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("[AI] Chat error:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0]
    });
    res.status(400).json({ 
      error: error.message || "Failed to process AI chat",
      code: error.code || 'CHAT_ERROR',
      conversationId: req.body?.conversationId
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const user = attachOptionalUser(req);
    if (!user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const rows = await listUserConversations(user);
    res.status(200).json(rows);
  } catch (error) {
    console.error("AI conversation list error:", error.message);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const rows = await getConversationMessages(conversationId);
    res.status(200).json(rows);
  } catch (error) {
    console.error("AI message list error:", error.message);
    res.status(500).json({ message: "Failed to fetch conversation messages" });
  }
};

const getDashboardAssist = async (req, res) => {
  try {
    const user = attachOptionalUser(req);
    const { pageName, actionName, contextSummary } = req.body;

    if (!pageName || !actionName) {
      return res.status(400).json({ 
        error: 'pageName and actionName are required',
        code: 'MISSING_PARAMS'
      });
    }

    const response = await getDashboardHelp({
      user,
      pageName,
      actionName,
      contextSummary,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("[AI] Dashboard help error:", {
      message: error.message,
      code: error.code,
      pageName: req.body?.pageName,
      actionName: req.body?.actionName
    });
    res.status(400).json({ 
      error: error.message || "Failed to process dashboard AI help",
      code: error.code || 'DASHBOARD_HELP_ERROR'
    });
  }
};

module.exports = {
  postChat,
  getConversations,
  getMessages,
  getDashboardAssist,
};
