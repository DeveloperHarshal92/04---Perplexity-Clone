# Perplexus AI Full-Stack Answer Engine 🧠⚡

A modern AI-powered conversational search and research engine combining LangChain agent orchestration, live Tavily web retrieval, Pinecone vector RAG, multimodal document/vision analysis, and real-time streaming over WebSockets.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/DeveloperHarshal92/04---Perplexity-Clone.git)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react)](https://react.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-Orchestration-1C3C3C?style=flat)](https://js.langchain.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000000?style=flat)](https://www.pinecone.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)](https://mongoosejs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Streaming-010101?style=flat&logo=socket.io)](https://socket.io/)

---

## 🌟 Key Features

- **Multi-Engine AI Synthesis**: Queries orchestrated through LangChain leveraging Mistral AI, OpenAI, and Google Gemini for deep reasoning and synthesis.
- **Hybrid Vector RAG**: Semantic vector retrieval using Pinecone DB, Recursive Character Text Chunking, and high-dimensional embeddings.
- **Live Internet Grounding**: Real-time web retrieval using Tavily Search API for up-to-the-minute web citations and source transparency.
- **Multimodal Document & Vision Parsing**:
  - Image comprehension via Google Gemini (`gemini-2.5-flash`).
  - Document ingestion for PDF (`pdf-parse`) and DOCX (`mammoth`) files.
  - Image hosting and CDN asset management via ImageKit.
- **Real-Time Token Streaming**: Low-latency bidirectional socket streaming with typewriter markdown rendering, code highlighting, and auto-generated thread titling.
- **Perplexus "Scholar's Parchment" UI**:
  - Calibrated warm parchment aesthetic (`#faf8f5` canvas, `#016a71` deep teal accents, `#27251e` ink typography, and custom editorial serif logo mark).
  - Voice query integration via Web Speech API and dynamic model selector.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 7, React Router 7
- **State Management**: Redux Toolkit, React-Redux
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion
- **Markdown & UI**: React-Markdown, Remark-GFM, Lucide React, React Hot Toast
- **Networking & Real-Time**: Socket.io-client, Axios

### Backend
- **Server Runtime**: Node.js, Express v5
- **AI & Agent Orchestration**: LangChain, `@langchain/google-genai`, `@langchain/mistralai`, `@langchain/openai`, `@langchain/textsplitters`, `@tavily/core`, Zod
- **Vector Database**: Pinecone Database (`@pinecone-database/pinecone`)
- **Document & Media Processors**: PDF-Parse, Mammoth (DOCX), Multer, ImageKit
- **Database & Auth**: MongoDB, Mongoose v9, JWT, Bcryptjs, Nodemailer, Cookie-Parser

---

## 📁 Repository Architecture

```
04 - Perplexity/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB & third-party service configs
│   │   ├── controllers/     # Auth & Chat controllers
│   │   ├── middlewares/     # JWT authentication & Multer uploads
│   │   ├── models/          # User, Chat, Message Mongoose models
│   │   ├── routes/          # Express API routes
│   │   ├── services/        # AI (Gemini/Mistral), RAG (Pinecone), Tavily search, Mail
│   │   ├── sockets/         # Socket.io live streaming handlers
│   │   └── validators/      # Express-validator schemas
│   ├── server.js            # Server entry point
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── app/             # Redux store & router setup
    │   ├── features/
    │   │   ├── auth/        # Auth slice, login, register, protected wrapper
    │   │   └── chat/        # Chat slice, socket service, typewriter hook, feed, sidebar
    │   ├── main.jsx
    │   └── app/index.css
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI
- Pinecone API Key & Index
- API Keys: Gemini, Mistral, Tavily, ImageKit

### 1. Configure & Run Backend
```bash
cd Backend
npm install
```
Create `.env` in `Backend/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
```
Start backend:
```bash
npm run dev
```

### 2. Configure & Run Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

---

## 📡 API & Socket Overview

| Channel / Route | Type | Description |
| :--- | :--- | :--- |
| `/api/auth/login` | HTTP POST | Authenticate user session |
| `/api/chats` | HTTP GET/POST | Fetch user conversations / Create thread |
| `join_room` | Socket Event | Join real-time streaming thread |
| `send_message` | Socket Event | Dispatch prompt for live RAG + LLM streaming |
| `receive_chunk` | Socket Event | Receive streamed tokens with markdown chunks |

---

## 📄 License
ISC License. Built for portfolio showcase.
