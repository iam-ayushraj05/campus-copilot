# CampusCopilot — Personal AI College Workspace & Developer Copilot

> **CampusCopilot** is an intelligent, privacy-first personal AI assistant built specifically for Computer Science and Engineering students. It unifies course notes, code debugging, deadline tracking, and active recall study sessions into a single context-aware workspace.

---

## 🚀 What Problem Does CampusCopilot Solve?

College students navigate fragmented productivity tools daily: note-taking in Notion/PDFs, debugging on LeetCode/VSCode, deadline management on Google Calendar, and study queries on ChatGPT. 

Generic AI chatbots lack context about a student's actual syllabus, upcoming exam schedules, coding weaknesses, or assignment due dates. **CampusCopilot solves this fragmentation by unifying student context into one intelligent agent:**

> *"CampusCopilot understands what I'm studying, what concepts I'm struggling with, what deadlines I have coming up, and what I should work on next."*

---

## ✨ Key Features

1. **Dashboard & Dynamic Recommendation Engine**:
   - Computes real-time **Next Best Move** recommendations based on urgent exams ($\le 4$ days left), pending assignments due tomorrow, or lowest-accuracy weak concepts.
   - Live developer stats: Study time, quiz accuracy, problems solved, topics mastered, and streak days.

2. **StudyBuddy (Grounded RAG Workspace)**:
   - Operates in 4 distinct learning modes:
     - **ASK**: Direct concise answers to technical questions.
     - **TEACH**: Progressive, step-by-step educational explanations.
     - **QUIZ**: Active recall questions with automatic evaluation and confidence score tracking.
     - **STUCK**: Breakdown using analogies, diagrams, and intuitive examples.
   - Powered by grounded in-browser RAG retrieval over student uploaded notes and PDFs (`.pdf`, `.txt`).

3. **CodeExplain IDE Workspace**:
   - IDE-inspired workspace with multi-language support (Python 3, Java 17, C++ 20, JavaScript, C).
   - Structured diagnostic analysis: *What Happened*, *Why It Happened*, *Where*, *How to Fix*, and *Learn This*.
   - **Interactive Practice**: Automatically generates targeted practice problems based on code errors and evaluates submitted solutions.

4. **Campus Planner**:
   - Urgent exam tracking and assignment deadline management.
   - **AI Study Plan Generator**: Generates 2.5-hour time-blocked study schedules based on upcoming exams and weak topics, with 1-click **Add Plan to Planner** sync.

5. **Personal Learning Profile**:
   - Single source of truth tracking student progress over time.
   - Dynamic AI Learning Insights generated live from current study hours, quiz accuracy, and weak concepts.

6. **Local Open-Weight AI & Privacy**:
   - Native integration with **Ollama** running **Llama 3.1 8B Instruct** locally on port 11434.
   - 100% private: Course notes and code snippets never leave the user's local machine.
   - Transparent **Demo Fallback Mode** if local Ollama is disconnected.

---

## 🏗️ Architecture & RAG Pipeline

```
                              STUDENT WORKSPACE
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        Study & Code Context                    Planner & Deadlines
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                          AI Service Abstraction
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
[Local Ollama Engine]                                 [Demo Fallback Engine]
 (http://localhost:11434)                             (Structured Heuristic Logic)
  • Llama 3.1 8B Instruct                             • 100% Reliable Judge Mode
```

### Grounded RAG Pipeline:
```
Uploaded Notes (.pdf / .txt)
     │
     ▼
In-Browser Vector Chunking (300-char overlapping windows)
     │
     ▼
Keyword & Vector Cosine Similarity Retrieval
     │
     ▼
Augmented Prompt + Retrieved Source Snippets
     │
     ▼
Grounded AI Explanation with Document Citations
```

---

## 🛠️ Technology Stack

- **Core & UI Framework**: React 19, TypeScript
- **Build Tooling**: Vite 8
- **Styling**: Vanilla CSS with modern developer design tokens (glassmorphism, dark IDE themes, responsive CSS grid)
- **Icons**: Lucide React
- **AI Model Engine**: Ollama (`http://localhost:11434`) running `llama3.1:8b`
- **Vector Search Engine**: Client-side RAG indexing pipeline (`ragService.ts`)
- **Persistence**: Single source of truth `localStorage` state engine (`campus_copilot_state_v3`)

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) [Ollama](https://ollama.com/) for local AI execution

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/dev_challenge_1.git
cd Dev_challenge_1

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Setting Up Local AI (Ollama)
```bash
# Install and start Ollama
ollama serve

# Pull Llama 3.1 model
ollama pull llama3.1
```
Navigate to **Settings** in CampusCopilot to verify `REAL LOCAL AI` status. If Ollama is unavailable, CampusCopilot automatically runs in **Demo Fallback Mode**.

---

## 🛡️ Hackathon Judge Readiness FAQ

1. **What real student problem does CampusCopilot solve?**
   It solves tool fragmentation by combining notes, code debugging, planner deadlines, and study stats into a context-aware assistant.

2. **Why is AI necessary?**
   Standard study apps cannot unroll code stack traces, adaptively ask active recall quiz questions, or dynamically generate time-blocked study schedules based on weak topics.

3. **Why use an open-weight model?**
   College students handle private assignment drafts and exam prep notes. Open-weight local models (Llama 3.1 via Ollama) ensure zero data leakage, zero API fees, and offline availability.

4. **What does StudyBuddy do that ChatGPT does not?**
   StudyBuddy uses grounded RAG over uploaded student PDFs, cite exact document sections, and operates in 4 distinct educational modes (ASK, TEACH, QUIZ, STUCK).

5. **What happens if Ollama is not installed?**
   CampusCopilot seamlessly falls back to **Demo Mode** with structured AI responses so judges can evaluate every flow without setup hassle.

---

## 📄 License

Distributed under the MIT License. Built for Hacktoberfest / Dev Challenge 2026.
