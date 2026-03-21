import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null,
    chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const currentChatId = chatId || chat._id;
  const userMessage = await messageModel.create({
    chat: currentChatId,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: currentChatId });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    title,
    chat: chat || { _id: chatId },
    aiMessage,
  });
}

export async function getChats(req, res) {
  const user = req.user;

  const chats = await chatModel.find({ user: user.id });

  res.status(200).json({
    message: "Chat retrived successfully.",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({
    message: "Messages retrived successfully.",
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findByIdAndDelete({
    _id : chatId,
    user : req.user.id
  })

  await messageModel.deleteMany({
    chat : chatId
  })

  if(!chat){
    res.status(404).json({
      message : "Chat not found!"
    })
  }

  res.status(200).json({
    messsage : "Chat deleted successfully."
  })
}
