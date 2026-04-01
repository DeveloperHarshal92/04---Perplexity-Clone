import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true
    },
    content: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },
    aiContext: {
      type: String,
      default: ""
    },
    userFile: {
      name: {
        type: String,
        default: null
      },
      type: {
        type: String,
        default: null
      },
      url: {
        type: String,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
