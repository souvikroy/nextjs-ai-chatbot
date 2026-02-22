# Next.js AI Chatbot

A powerful, full-stack AI chatbot template built with Next.js, featuring real-time streaming, multi-model support, interactive artifacts, and advanced document processing capabilities.

## Features

- **Next.js App Router**: Advanced routing and performance optimizations.
- **AI SDK**: Unified API for text generation, structured objects, and tool calls.
- **Multi-Model Support**: OpenAI, Anthropic, Google, xAI, and more.
- **Interactive Artifacts**: Side-by-side display for code, text, and data structures.
- **Document Processing**: Advanced PDF, DOCX, and CSV parsing.
- **Data Persistence**: Postgres with Drizzle ORM and Redis for stream state.
- **Authentication**: Secure login via Auth.js.

## Running Locally

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Set up environment variables**: Copy `.env.example` to `.env.local` and fill in your keys.
4. **Setup database**:
   ```bash
   pnpm db:migrate
   ```
5. **Start the development server**:
   ```bash
   pnpm dev
   ```

Your app should now be running on [localhost:3000](http://localhost:3000).

## Architecture Overview

The application uses a distributed, serverless architecture:
- **Client Layer**: React Server and Client Components with custom hooks.
- **API Layer**: Next.js App Router with Vercel AI SDK Core.
- **Service Layer**: Multiple LLM providers, Redis for session state, and Postgres for persistent data.

For more details on the implementation of specialized tools like Reasoning or Artifacts, see the `lib/ai` directory.
