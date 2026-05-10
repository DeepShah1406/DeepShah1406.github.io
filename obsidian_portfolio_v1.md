# Obsidian Portfolio Structure: AI/ML & Automation Focus

## 1. Core Experience Concept
The site behaves like a private knowledge vault. The visitor is not “navigating a portfolio”; they are opening notes inside a "Second Brain."

### Key Interface Elements
- **Left Panel:** Vault hierarchy (Folders 00-05).
- **Center Editor:** Markdown content renderer with support for Callouts and Mermaid diagrams.
- **Right Panel:** Metadata (Properties), Backlinks, and "Related Notes" (auto-suggested via shared tags).
- **Graph View:** Interactive D3.js node-link visualization.
- **Command Palette (Ctrl+K):** Power-user search and quick actions.

---

## 2. Updated Note Architecture

### 00 - Identity
- **Identity.md**: The entry point (Open by default). Mission statement, core mindset, and a summary of high-impact domains. Includes a "Download Resume" command hint.
- **Resume_Snapshot.md**: A cleaner, high-level overview for quick scanning.

### 01 - Skills (Core Stack)
- **Python.md**: Focus on libraries like OpenCV, YOLO, and Pandas. Node weight: High.
- **GenAI_RAG.md**: Experience with LLMs, vector databases, and retrieval logic.
- **Automation.md**: Heavy focus on n8n, API orchestration, and workflow efficiency.
- **Linux_Docker.md**: Self-hosting, headless server management, and containerization.

### 02 - Builds (Project Vault)
- **Railway_Safety_AI.md**: Detailed breakdown of the computer vision solution. Includes Mermaid.js flowcharts.
- **Autism_ML_Study.md**: Methodology and outcomes of the ML detection project.
- **Mental_Health_Chatbot.md**: Architecture of the RAG-based support system.
- **n8n_Business_Automations.md**: Collection of specific workflow optimizations.

### 03 - Logs & Experience
- **Experience_Log.md**: Structured chronological history (e.g., KERYAR, PI Industries).
- **Execution_Logs.md**: Raw, technical "field notes" from complex builds.

### 04 - Proof & Impact
- **Impact_Record.md**: Quantifiable wins (e.g., "reduced processing time by 40%").
- **Certifications.md**: Links to credentials and digital badges.

### 05 - Access
- **Contact_Node.md**: The "Open Channel" terminal-style contact interface. Supports `whoami`, `mail`, and `clear` commands.

---

## 3. Interaction & UX Design
- **Mobile First:** Sidebars collapse into a drawer; default view is single-column Reading Mode.
- **Graph Nodes:** Use SVG icons for technical nodes (Python, Docker). Node size determined by project count.
- **Custom Callouts:** Supports `> [!ACHIEVEMENT]` and `> [!TECH_STACK]` for visual emphasis.
- **Focus Mode:** Keyboard shortcut to toggle sidebars for immersive reading.

---

## 4. Technical Stack (React)
- **Core:** React, TypeScript, Tailwind CSS.
- **State:** Zustand (Global UI state, active tabs).
- **Graph:** D3.js (Force-directed graph).
- **Markdown:** React Markdown + Remark-Gfm + Rehype-Highlight.
- **Animation:** Framer Motion (Spring transitions for sidebar).
