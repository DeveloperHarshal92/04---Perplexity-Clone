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
  model: "gemini-2.5-flash",
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
      // LangChain's Google GenAI integration accepts standard image content
      // blocks, which are converted into Gemini inlineData parts.
      const lastMessage = messages[messages.length - 1];

      const humanMessageContent = [
        {
          type: "text",
          text: lastMessage.content || "Please describe and analyze this image.",
        },
        {
          type: "image",
          source_type: "base64",
          data: processedFile.base64,
          mime_type: processedFile.type,
        },
      ];

      const historyMessages = messages
        .slice(0, -1)
        .map((msg) => {
          if (msg.role === "user") return new HumanMessage(msg.content);
          if (msg.role === "ai") return new AIMessage(msg.content);
          return null;
        })
        .filter(Boolean);

      console.log("IMAGE SIZE:", processedFile.base64.length);

      const response = await geminiModel.invoke([
        new SystemMessage(
          `You are a helpful and precise assistant.
          When an image is provided, carefully analyze and describe it in detail.
          Answer any questions about the image accurately.`
        ),
        ...historyMessages,
        new HumanMessage(humanMessageContent),
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
    console.error(
      "FULL ERROR:",
      JSON.stringify(
        {
          name: error?.name,
          message: error?.message,
          code: error?.code,
          status: error?.status,
          details: error?.details,
          cause: error?.cause,
        },
        null,
        2
      )
    );
    console.error(error?.stack);
    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
  }
}

// ── generateChatTitle ────────────────────────────────────────────────────────
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

    // Validate that response has text and it's not empty
    const title = response?.text?.trim();
    
    if (!title) {
      console.warn("Mistral returned empty title, using fallback from user message");
      // Fallback: use first 50 chars of the user message as title
      return message.trim().substring(0, 50) || "New Chat";
    }

    console.log("Generated title:", title);
    return title;
  } catch (error) {
    console.error("Error generating chat title:", error?.message);
    // Fallback: use first 50 chars of the user message as title
    return message.trim().substring(0, 50) || "New Chat";
  }
}
