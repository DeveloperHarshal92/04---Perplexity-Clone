import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  AIMessage,
  createAgent,
  HumanMessage,
  SystemMessage,
  tool,
} from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

// ── Models ────────────────────────────────────────────────────────────────────

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", // upgraded: gemini-flash-latest is deprecated
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-medium",
  apiKey: process.env.MISTRAL_API_KEY,
});

// ── Tools ─────────────────────────────────────────────────────────────────────

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the Internet",
  schema: z.object({
    query: z.string().describe("The search query to look up on internet."),
  }),
});

const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
});

// ── generateResponse ──────────────────────────────────────────────────────────
//
// processedFile is the object returned by file.service.js — shape:
//   { strategy: "imagekit", url, name, type, aiContext }  ← image
//   { strategy: "parsed",   name, type, aiContext }       ← document
//   null                                                   ← text-only
//
export async function generateResponse(messages, processedFile = null) {
  try {

  // ── CASE 1: Image attached → use Gemini (vision capable) ──────────────────
  if (processedFile?.strategy === "imagekit") {

    // Build the last user message as a multimodal content array
    // LangChain's HumanMessage accepts { type, image_url } for vision
    const lastMessage = messages[messages.length - 1];

    const humanMessageContent = [
      {
        type: "image_url",
        image_url: processedFile.url, // ImageKit CDN URL
      },
      {
        type: "text",
        text: lastMessage.content || "Please describe and analyze this image.",
      },
    ];

    const historyMessages = messages.slice(0, -1).map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai") return new AIMessage(msg.content);
    });

    const response = await geminiModel.invoke([
      new SystemMessage(
        `You are a helpful and precise assistant. 
        When an image is provided, carefully analyze and describe it in detail. 
        Answer any questions about the image accurately.`
      ),
      ...historyMessages,
      new HumanMessage({ content: humanMessageContent }),
    ]);

    return response.text;
  }

  // ── CASE 2: Document attached (PDF, DOCX, TXT) → use agent with text ──────
  // The document text is already injected into the last message's content
  // by chat.controller.js via aiPrompt, so the agent handles it as plain text.
  if (processedFile?.strategy === "parsed") {
    const response = await agent.invoke({
      messages: [
        new SystemMessage(
          `You are a helpful and precise assistant. 
          The user has shared a document — its content has been extracted and appended to their message. 
          Read the document content carefully and answer based on it.
          If the question also requires up-to-date information, use the searchInternet tool.`
        ),
        ...messages.map((msg) => {
          if (msg.role === "user") return new HumanMessage(msg.content);
          if (msg.role === "ai") return new AIMessage(msg.content);
        }),
      ],
    });
    return response.messages[response.messages.length - 1].text;
  }

  // ── CASE 3: Text only → original agent behavior, completely unchanged ──────
  const response = await agent.invoke({
    messages: [
      new SystemMessage(
        `You are a helpful and precise assistant for answering questions.
        If you don't know the answer, say you don't know. 
        If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.`
      ),
      ...messages.map((msg) => {
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "ai") return new AIMessage(msg.content);
      }),
    ],
  });
  return response.messages[response.messages.length - 1].text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
  }
}

// ── generateChatTitle — completely unchanged ──────────────────────────────────
export async function generateChatTitle(message) {
  try {
    const response = await mistralModel.invoke([
      new SystemMessage(
        `You are a helpful assistant that generates concise and descriptive titles for chat conversations.
        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.`
      ),
      new HumanMessage(
        `Generate a title for a chat conversation based on the following first message: ${message}`
      ),
    ]);

    return response.text;
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat"; // Fallback title
  }
}