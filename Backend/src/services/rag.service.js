import { Pinecone } from "@pinecone-database/pinecone";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

let pineconeClient = null;
let pineconeIndex = null;
let embeddings = null;

function getPineconeIndex() {
  if (!process.env.PINECONE_API_KEY) {
    console.warn("PINECONE_API_KEY is not configured in .env");
    return null;
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  if (!pineconeIndex) {
    const indexName = process.env.PINECONE_INDEX || "cohort-2-rag";
    pineconeIndex = pineconeClient.index(indexName);
  }

  return pineconeIndex;
}

function getEmbeddings() {
  if (!embeddings && process.env.MISTRAL_API_KEY) {
    embeddings = new MistralAIEmbeddings({
      apiKey: process.env.MISTRAL_API_KEY,
      model: "mistral-embed",
    });
  }
  return embeddings;
}

/**
 * Split text into semantic chunks and upsert to Pinecone vector database
 */
export async function indexDocument({ text, chatId, userId, documentName }) {
  if (!text || typeof text !== "string" || !text.trim()) return null;

  try {
    const index = getPineconeIndex();
    const embedder = getEmbeddings();

    if (!index || !embedder) {
      console.warn("RAG indexing skipped: Pinecone or Mistral embeddings not initialized.");
      return null;
    }

    // 1. Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunks = await splitter.splitText(text);

    if (!chunks || chunks.length === 0) return null;

    // 2. Generate embeddings in batch
    const docs = await Promise.all(
      chunks.map(async (chunk, i) => {
        const embedding = await embedder.embedQuery(chunk);
        return {
          id: `doc-${chatId || "global"}-${i}-${Date.now().toString(36)}`,
          values: embedding,
          metadata: {
            text: chunk,
            chatId: chatId ? String(chatId) : "",
            userId: userId ? String(userId) : "",
            documentName: documentName || "Document",
            chunkIndex: i,
          },
        };
      })
    );

    // 3. Upsert records to Pinecone
    await index.upsert({ records: docs });
    console.log(`Successfully indexed ${docs.length} chunks into Pinecone for document "${documentName}".`);

    return {
      indexedChunks: docs.length,
      documentName,
    };
  } catch (error) {
    console.error("Error in indexDocument RAG:", error);
    return null;
  }
}

/**
 * Query Pinecone vector database to retrieve top matching context chunks
 */
export async function queryRag({ query, chatId, topK = 3 }) {
  if (!query || typeof query !== "string" || !query.trim()) return [];

  try {
    const index = getPineconeIndex();
    const embedder = getEmbeddings();

    if (!index || !embedder) {
      return [];
    }

    // 1. Embed query
    const queryEmbedding = await embedder.embedQuery(query);

    // 2. Query index with optional chatId filter
    const queryOptions = {
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    };

    if (chatId) {
      queryOptions.filter = {
        chatId: { $eq: String(chatId) },
      };
    }

    let result = await index.query(queryOptions);

    // Fallback without filter if no matches found with strict chatId
    if ((!result.matches || result.matches.length === 0) && chatId) {
      delete queryOptions.filter;
      result = await index.query(queryOptions);
    }

    const matches = (result.matches || []).map((m) => ({
      score: m.score,
      text: m.metadata?.text || "",
      documentName: m.metadata?.documentName || "Document",
      chunkIndex: m.metadata?.chunkIndex,
    }));

    return matches;
  } catch (error) {
    console.error("Error querying RAG from Pinecone:", error);
    return [];
  }
}
