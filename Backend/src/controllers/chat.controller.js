import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { processFile } from "../services/file.service.js";
import { indexDocument } from "../services/rag.service.js";

export async function sendMessage(req, res) {
  try {
    const inputMessage = typeof req.body.message === "string" ? req.body.message : "";
    const { chat: chatId } = req.body;
    const file = req.file;

    let title = null,
      chat = null;
    let processedFile = null;

    // ── Process file if attached ──────────────────────────────────────────────
    if (file) {
      processedFile = await processFile(file);
    }

    const userFile = processedFile
      ? {
          name: processedFile.name,
          type: processedFile.type,
          url: processedFile.strategy === "imagekit" ? processedFile.url : null,
        }
      : null;

    // ── Create new chat if no chatId ──────────────────────────────────────────
    if (!chatId) {
      const titleSource =
        inputMessage.trim() || (processedFile ? `Discuss ${processedFile.name}` : "New chat");

      title = await generateChatTitle(titleSource);
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    }

    const currentChatId = chatId || chat._id;

    // ── RAG: Index parsed document chunks into Pinecone in background ─────────
    if (processedFile?.strategy === "parsed" && processedFile?.rawText) {
      indexDocument({
        text: processedFile.rawText,
        chatId: currentChatId,
        userId: req.user.id,
        documentName: processedFile.name,
      }).catch((err) => console.error("RAG indexing error:", err));
    }

    // ── Save user message to DB ───────────────────────────────────────────────
    await messageModel.create({
      chat: currentChatId,
      content: inputMessage,
      aiContext: processedFile?.strategy === "parsed" ? processedFile.aiContext : "",
      userFile,
      role: "user",
    });

    // ── Fetch full message history for context ────────────────────────────────
    const messages = await messageModel.find({ chat: currentChatId }).sort({ createdAt: 1, _id: 1 });

    const messagesForAI = messages.map((msg) => {
      const messageObject = msg.toObject();
      const contentParts = [messageObject.content];

      if (messageObject.role === "user" && messageObject.aiContext) {
        contentParts.push(messageObject.aiContext);
      }

      return {
        ...messageObject,
        content: contentParts.filter(Boolean).join("\n\n"),
      };
    });

    // ── Call AI — pass processedFile and currentChatId for RAG ────────────────
    const result = await generateResponse(messagesForAI, processedFile, currentChatId);

    // ── Save AI response to DB ────────────────────────────────────────────────
    const aiMessage = await messageModel.create({
      chat: currentChatId,
      content: result,
      role: "ai",
    });

    res.status(201).json({
      title,
      chat: chat || { _id: chatId },
      aiMessage,
      userFile,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      message: "An error occurred while processing your request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// ── All other controllers unchanged ──────────────────────────────────────────

export async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel.find({ user: user.id });
  res.status(200).json({
    message: "Chat retrieved successfully.",
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
    return res.status(404).json({ message: "Chat not found" });
  }

  const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1, _id: 1 });

  res.status(200).json({
    message: "Messages retrieved successfully.",
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findByIdAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await messageModel.deleteMany({ chat: chatId });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found!" });
  }

  res.status(200).json({ message: "Chat deleted successfully." });
}
