import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessageWithFile,
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  async function handleSendMessage({ message, chatId, file }) {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = file
        ? await sendMessageWithFile({ message, chat: chatId, file })
        : await sendMessage({ message, chat: chatId });

      const { chat, aiMessage, userFile } = data;
      const activeChatId = chatId || chat._id;

      if (!chatId) {
        dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
      }

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: message,
          role: "user",
          userFile: userFile || null,
        }),
      );

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );

      dispatch(setCurrentChatId(activeChatId));
      return data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to send message.";

      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chatsArg) {
    const source = chatsArg || chats;
    if (source[chatId]?.messages.length === 0) {
      const data = await getMessages(chatId);
      const formattedMessages = data.messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
        userFile: msg.userFile || null,
      }));
      dispatch(addMessages({ chatId, messages: formattedMessages }));
    }
    dispatch(setCurrentChatId(chatId));
  }

  // Clear active chat → shows empty state
  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  // Call DELETE API → remove from Redux → toast
  async function handleDeleteChat(chatId) {
    try {
      await deleteChat(chatId);
      const updated = { ...chats };
      delete updated[chatId];
      dispatch(setChats(updated));
      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
      }
      toast.success("Thread deleted");
    } catch (err) {
      toast.error("Failed to delete thread", err);
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
    handleDeleteChat,
  };
};
