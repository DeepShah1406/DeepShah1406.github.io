# Company RAG Chatbot

> [!ACHIEVEMENT]
> GitHub: [DeepShah1406/Company_RAG_Chatbot](https://github.com/DeepShah1406/Company_RAG_Chatbot)

## Overview
A production-ready corporate AI assistant that replaces generic LLM responses with information strictly retrieved from a company’s verified knowledge base (handbooks, policies, and service documents).

## Tech Stack
- **Framework**: FastAPI (Backend) & Streamlit (Frontend).
- **Orchestration**: LangChain.
- **LLM**: Groq (Llama-3.3-70b).
- **Vector Store**: ChromaDB.
- **Features**: PDF conversion for conversation logs.

## Key Features
- **Conversational Memory**: Maintains multi-turn context using `ConversationBufferMemory`.
- **Dual Access**: Provides both a web UI and a REST API for integration into existing company tools.
- **Onboarding Flow**: Includes an intake questionnaire to personalize the AI's assistance.
- **PDF Export**: Generates a downloadable PDF transcript of the session for compliance.

---
[[GenAI_RAG]] | [[College_RAG_Chatbot]]
