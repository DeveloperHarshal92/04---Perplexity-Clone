import { Router } from "express";
import {
    deleteChat,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authUser,upload.single("file"),sendMessage);

chatRouter.get("/", authUser, getChats);

chatRouter.get("/:chatId/messages", authUser, getMessages);

chatRouter.delete("/delete/:chatId/",authUser,deleteChat)

export default chatRouter;
