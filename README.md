# Perplexity AI Clone

A full-stack AI research and answer engine featuring real-time web search, Pinecone vector RAG, multimodal document/image analysis, and a clean "scholar's parchment" user interface.

## Features

- **AI Search & Reasoning**: Intelligent question answering powered by Mistral AI (`mistral-medium`) with LangChain agent orchestration.
- **Retrieval-Augmented Generation (RAG)**: Semantic vector search powered by Pinecone DB (`@pinecone-database/pinecone`), Mistral embeddings (`mistral-embed`), and `RecursiveCharacterTextSplitter`.
- **Live Internet Search**: Real-time web retrieval tool integration via Tavily Search API for up-to-date answers and citations.
- **Multimodal File & Image Analysis**: 
  - Vision analysis for images (PNG, JPEG, WebP) powered by Google Gemini (`gemini-2.5-flash`).
  - Document parsing and contextual querying for PDF (`pdf-parse`), DOCX (`mammoth`), and TXT files.
  - Image hosting and media upload pipeline backed by ImageKit.
- **Real-Time Communication**: WebSocket connection powered by Socket.IO for live bidirectional communication.
- **Automated Thread Titling**: Automatic semantic 2–4 word title generation for conversations using AI summarization.
- **Authentication & Security**: Email/password authentication with bcrypt, JWT stored in HTTP-only cookies, and Nodemailer email verification.
- **Perplexity UI & Design System**: 
  - "Scholar's parchment" aesthetic with exact design tokens (`#faf8f5` canvas, `#fdfbfa` cards, `#016a71` deep teal accents, `#27251e` ink typography).
  - Model switcher with support for multiple AI model presets.
  - Typewriter text streaming with structured markdown formatting (code syntax highlighting, tables, blockquotes).
  - Speech-to-text voice input via Web Speech API and file attachment previews.
  - Full thread management (history, deletion, auto-scrolling, shareable links).

## Tech Stack

### Frontend
- **Framework & Core**: React `19.1.1`, Vite `7.1.7`, React Router `7.13.1`
- **State Management**: Redux Toolkit `@reduxjs/toolkit` `2.11.2`, `react-redux` `9.2.0`
- **Styling**: Tailwind CSS `4.2.1` with `@tailwindcss/vite` `4.2.1`
- **Animation & Transitions**: Framer Motion `12.38.0`
- **Markdown & Code**: `react-markdown` `10.1.0`, `remark-gfm` `4.0.1`
- **Networking & Realtime**: `axios` `1.13.6`, `socket.io-client` `4.8.3`, `react-hot-toast` `2.6.0`

### Backend
- **Runtime & Server**: Node.js (ES Modules), Express `5.2.1`
- **Database & Vector DB**: MongoDB with Mongoose `9.3.0`, Pinecone `@pinecone-database/pinecone` `6.1.4`
- **AI & Agent Orchestration**: `langchain` `1.2.32`, `@langchain/google-genai` `2.1.25`, `@langchain/mistralai` `1.0.7`, `@langchain/openai` `1.2.13`, `@langchain/textsplitters` `1.0.1`, `@tavily/core` `0.7.2`, `zod` `4.3.6`
- **File Processing & Media**: `multer` `2.1.1`, `imagekit` `6.0.0`, `pdf-parse` `2.4.5`, `mammoth` `1.12.0`
- **Authentication & Email**: `jsonwebtoken` `9.0.3`, `bcryptjs` `3.0.3`, `nodemailer` `8.0.2`, `cookie-parser` `1.4.7`
- **Validation & Realtime**: `express-validator` `7.3.1`, `morgan` `1.10.1`, `socket.io` `4.8.3`

## Project Structure

```
.
├── Backend/
│   ├── server.js                  # HTTP server, socket initialization, DB connection
│   ├── package.json               # Backend dependencies and scripts
│   └── src/
│       ├── app.js                 # Express app config, middleware, routes
│       ├── config/                # Database and service configs
│       ├── controllers/           # Auth and chat request handlers
│       ├── middlewares/           # JWT auth and file upload middlewares
│       ├── models/                # Mongoose schemas (User, Chat, Message)
│       ├── routes/                # API endpoints (/api/auth, /api/chats)
│       ├── services/              # AI (Gemini/Mistral), RAG (Pinecone), Tavily search, file parsing
│       ├── sockets/               # Socket.IO connection handlers
│       └── validators/            # Express-validator schemas
└── Frontend/
    ├── index.html                 # HTML entry point and font configurations
    ├── vite.config.js             # Vite build configuration with Tailwind plugin
    ├── package.json               # Frontend dependencies and scripts
    └── src/
        ├── main.jsx               # React DOM root render
        ├── app/                   # App routes, Redux store, and global CSS tokens
        └── features/
            ├── auth/              # Auth slice, API services, Login, Register, Protected route
            └── chat/              # Chat slice, hooks, Dashboard, Profile, Feed, Input, Sidebar
```

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or MongoDB Atlas)
- Pinecone Vector DB account & index

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

## Environment Variables / Config

Create a `.env` file in the `Backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/perplexity
JWT_SECRET=your_jwt_secret_key

# AI & Search API Keys
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

# Pinecone Vector DB (RAG)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=cohort-2-rag

# ImageKit (Media Uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Email Verification (Nodemailer)
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_app_password
```

## Usage

### Run Locally

1. **Start Backend Server** (Port 3000):
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start Frontend Server** (Port 5173):
   ```bash
   cd Frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

### Production Build

```bash
cd Frontend
npm run build
```

## Testing

> Currently, automated test suites are not configured in `Backend/package.json` (`echo "Error: no test specified"`). Test verification is performed via `npm run build` on the frontend and manual API/browser testing.

## License

ISC
