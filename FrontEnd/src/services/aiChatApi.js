import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
if (!baseURL) throw new Error("REACT_APP_BASE_URL is not defined in .env");

const buildHeaders = (token) => {
  const headerToken = token || localStorage.getItem("token");
  return headerToken ? { Authorization: headerToken } : {};
};

export const sendChatMessage = async ({ message, conversationId, token }) => {
  try {
    const response = await axios.post(
      `${baseURL}/ai/chat`,
      { message, conversationId },
      { headers: buildHeaders(token) },
    );
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Failed to send message';
    console.error('[AI Chat] Error:', { message: errorMsg, status: error.response?.status });
    throw new Error(errorMsg);
  }
};

export const getConversations = async (token) => {
  const response = await axios.get(`${baseURL}/ai/conversations`, {
    headers: buildHeaders(token),
  });
  return response.data;
};

export const getConversationMessages = async (conversationId, token) => {
  const response = await axios.get(
    `${baseURL}/ai/conversations/${conversationId}/messages`,
    {
      headers: buildHeaders(token),
    },
  );
  return response.data;
};

export const getDashboardAiHelp = async ({ pageName, actionName, contextSummary, token }) => {
  try {
    const response = await axios.post(
      `${baseURL}/ai/dashboard-help`,
      { pageName, actionName, contextSummary },
      { headers: buildHeaders(token) },
    );
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Failed to get AI help';
    console.error('[Dashboard AI Help] Error:', { message: errorMsg, pageName, actionName });
    throw new Error(errorMsg);
  }
};
