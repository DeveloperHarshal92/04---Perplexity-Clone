import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import { useDispatch } from "react-redux";
import {
  addNewMessage,
  createNewChat,
  setChats,
  setCurrentChatId,
  setLoading,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));

      const data = await sendMessage({ message, chatId });

      console.log("API SUCCESS:", data);

      const { chat, aiMessage } = data;

      if (!chatId) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      dispatch(
        addNewMessage({
          chatId: chatId || chat._id,
          content: message,
          role: "user",
        }),
      );

      dispatch(
        addNewMessage({
          chatId: chatId || chat._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );

      dispatch(setCurrentChatId(chat._id));
    } catch (err) {
      console.error("API FAILED:", err.response?.data || err.message);

      // 👇 show something in UI instead of silence
      alert("AI is rate limited. Try again in a few seconds.");
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
  };
};
