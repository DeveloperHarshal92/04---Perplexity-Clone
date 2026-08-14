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
import { queryRag } from "./rag.service.js";

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

const searchKnowledgeBaseTool = tool(
  async ({ query }) => {
    try {
      const matches = await queryRag({ query, topK: 4 });
      if (!matches || matches.length === 0) {
        return "No relevant document chunks found in the knowledge base.";
      }
      return matches
        .map((m, i) => `[Source ${i + 1}: ${m.documentName}] (Relevance Score: ${m.score?.toFixed(2) || "N/A"})\n${m.text}`)
        .join("\n\n---\n\n");
    } catch (err) {
      console.error("Error in searchKnowledgeBaseTool:", err);
      return "Could not retrieve documents from knowledge base at this time.";
    }
  },
  {
    name: "searchKnowledgeBase",
    description: "Search uploaded user documents and PDF/Word/TXT files in the Pinecone vector knowledge base for relevant context.",
    schema: z.object({
      query: z.string().describe("The search query or keyword phrase to find relevant context in uploaded documents."),
    }),
  }
);

const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool, searchKnowledgeBaseTool],
});

// ── generateResponse ──────────────────────────────────────────────────────────

export async function generateResponse(messages, processedFile = null, chatId = null) {
  try {
    const lastMessage = messages[messages.length - 1];
    const lastMessageText = typeof lastMessage?.content === "string" ? lastMessage.content : "";

    // Query RAG for matching semantic chunks from Pinecone
    let ragContext = "";
    if (lastMessageText.trim()) {
      try {
        const ragMatches = await queryRag({ query: lastMessageText, chatId, topK: 3 });
        if (ragMatches && ragMatches.length > 0) {
          ragContext = "\n\nRetrieved Knowledge Base Context (RAG):\n" +
            ragMatches.map((m, i) => `[Context ${i + 1} from ${m.documentName}]:\n${m.text}`).join("\n\n");
        }
      } catch (err) {
        console.error("RAG context query skipped:", err.message);
      }
    }

    // ── CASE 1: Image attached → use Gemini (vision capable) ──────────────────
    if (processedFile?.strategy === "imagekit") {
      const humanMessageContent = [
        {
          type: "text",
          text: lastMessageText || "Please describe and analyze this image.",
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

    // ── CASE 2: Document attached (PDF, DOCX, TXT) → use agent with document text & RAG ──
    if (processedFile?.strategy === "parsed") {
      const systemPrompt = `You are a helpful, authoritative and precise research assistant.
The user shared a document: "${processedFile.name}". Its content has been processed into the knowledge base.
${ragContext ? ragContext : ""}
Carefully answer the user's questions based on the document.
If the question also requires external or real-time information, use the searchInternet tool.
If you need additional context from indexed documents, use the searchKnowledgeBase tool.`;

      const response = await agent.invoke({
        messages: [
          new SystemMessage(systemPrompt),
          ...messages.map((msg) => {
            if (msg.role === "user") return new HumanMessage(msg.content);
            if (msg.role === "ai") return new AIMessage(msg.content);
          }),
        ],
      });
      return response.messages[response.messages.length - 1].text;
    }

    // ── CASE 3: Text only → agent with Internet & RAG Knowledge Base ───────────
    const systemPrompt = `You are a helpful and precise assistant for answering questions.
${ragContext ? ragContext : ""}
If the question relates to user uploaded files or previous documents, use the "searchKnowledgeBase" tool.
If the question requires up-to-date real-time information, use the "searchInternet" tool to get the latest info from the web.
Synthesize your answer clearly with structured markdown.`;

    const response = await agent.invoke({
      messages: [
        new SystemMessage(systemPrompt),
        ...messages.map((msg) => {
          if (msg.role === "user") return new HumanMessage(msg.content);
          if (msg.role === "ai") return new AIMessage(msg.content);
        }),
      ],
    });
    return response.messages[response.messages.length - 1].text;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "I apologize, but I am having trouble processing your request right now. Please try again.";
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

    return response.text;
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat";
  }
}
