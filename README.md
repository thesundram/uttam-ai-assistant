# 🤖 Uttam AI Assistant — Premium Industrial Intelligence

Uttam AI is a high-performance, premium AI chatbot designed specifically for **Uttam Innovative Solution Pvt. Ltd. (UISPL)** and **Uttam Galva Steels Ltd.** It bridges the gap between industrial steel expertise and cutting-edge AI technology.

![Uttam AI Logo](/public/uttam_ai_logo.png)

## 🚀 Powerful AI Engines
The assistant leverages two world-class AI technologies to provide accurate and real-time information:
1.  **Groq (Llama 3.3 Engine)**: Provides near-instant, intelligent responses with deep industrial knowledge.
2.  **Tavily AI (Web Search)**: Integrated real-time web search to fetch current steel prices, news, and market data.

---

## ✨ Key Features & Skills

### 🌐 Intelligent Interaction
- **Web Search Integration**: Real-time internet access for the latest news and data.
- **Real-time Streaming**: "Liquid" text flow with a professional blinking cursor (ChatGPT style).
- **Voice Capabilities**: 
  - **Speech-to-Text**: High-accuracy voice input.
  - **Text-to-Speech**: Natural **Indian-accented** voice output.

### 💎 Premium UI/UX
- **Mobile Optimized**: 100% full-screen "Drawer" layout for a native app feel on smartphones.
- **Glassmorphism Design**: Sleek, modern interface with smooth Framer Motion animations.
- **Theme Switching**: Seamless transition between sophisticated Dark Mode and clean Light Mode.
- **Interactive Elements**: Message reactions (👍/👎), unread badges, and sound effects.

### 🛠️ Utility Features
- **Export Chat**: Download full conversations as `.txt` files for record-keeping.
- **Character Counter**: Real-time tracking of the 500-character input limit.
- **Quick Replies**: Smart suggestions to start conversations instantly.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **AI Orchestration**: Vercel AI SDK
- **Icons**: Lucide React
- **Markdown**: React Markdown with GFM

---

## 🚀 Getting Started

### 1. Installation
First, clone the repository and install the dependencies:
```bash
npm install
# or
pnpm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your API keys:
```env
OPENAI_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```
*(Note: We use Groq as the provider, which is compatible with the OpenAI SDK format)*

### 3. Development Server
Run the project locally:
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to see the assistant in action.

---

## 🛠️ Advanced Agentic Skills Used
This project was crafted using specialized development modules. You can add these skills to your own environment using the following commands:

- **Chat SDK (`chat-sdk`)**: Core multi-platform chat logic.
  ```bash
  npx skills add https://github.com/vercel/chat --skill chat-sdk
  ```
- **Frontend Design (`frontend-design`)**: Distinctive, production-grade interfaces.
  ```bash
  npx skills add https://github.com/anthropics/skills --skill frontend-design
  ```
- **Grill Me (`grill-me`)**: Stress-testing plans and designs.
  ```bash
  npx skills add https://github.com/mattpocock/skills --skill grill-me
  ```
- **Subagent-Driven Development (`subagent-driven-development`)**: Executing plans with specialized subagents.
  ```bash
  npx skills add https://github.com/obra/superpowers --skill subagent-driven-development
  ```
- **Premium Frontend UI**: Implemented immersive motion and high-performance typography.
- **Web Design Guidelines**: Accessibility and UX best practices.

---

## 🏗️ Project Structure
- `/components/ChatWidget.tsx`: The core UI and logic for the AI assistant.
- `/app/api/chat/route.ts`: Backend API route for AI and Web Search orchestration.
- `/lib/company-knowledge.ts`: The "Brain" containing 30+ years of Uttam Group expertise.
- `/public/`: Static assets including logos and interaction sounds.

---

## 🛡️ Branding Policy
This project is strictly branded as **Uttam AI**. All underlying technologies (Groq, Llama, Meta) are internal and never disclosed in the user interface to maintain a unified corporate identity.

---
**Powered by Uttam Innovative Solution Pvt. Ltd.** 🚀🦾
