import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ADD this new function: original sendMessage below is unchanged
export async function sendMessageWithFile({ message, chat, file }) {
  const formData = new FormData();
  formData.append("message", message);
  if (chat) formData.append("chat", chat);
  if (file) formData.append("file", file);

  const response = await api.post("/api/chats/message", formData);
  return response.data;
}

// UNCHANGED: keep exactly as is
export const sendMessage = async ({ message, chat }) => {
  try {
    const response = await api.post("/api/chats/message", { message, chat });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getChats = async () => {
  const response = await api.get("api/chats/");
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/api/chats/${chatId}/messages`);
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/api/chats/delete/${chatId}`);
  return response.data;
};
