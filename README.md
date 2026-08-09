# 🤖 CohortIQ — AI Technical Interview Agent

> **Personalized technical interviews powered by your learning journey.**

**CohortIQ** is an AI-powered technical interview platform designed for learners completing a 31-day Enterprise AI Engineering Cohort.

Instead of conducting the same static interview for every candidate, CohortIQ analyzes each candidate's **curriculum progress, completed missions, attempts, skipped topics, learning signals, role, and experience** to create a personalized technical interview.

The AI interviewer dynamically adapts its questions based on the candidate's previous answers, maintains conversation context, explores technical depth through follow-up questions, and generates an actionable interview report at the end.

---

## 🚀 Live Demo

### 🌐🔗 Live Demo 

---

# 🎯 Problem Statement

The AI Cohort is a 31-day Enterprise AI Engineering program covering modern AI engineering concepts including:

* Retrieval-Augmented Generation (RAG)
* Vector Databases
* Embeddings
* Prompt Engineering
* Agentic AI
* Model Context Protocol (MCP)
* AI Deployment
* Production AI Systems

After completing the cohort, learners should be able to explain the systems they built and the engineering decisions behind them.

However, one of the major challenges is preparing for technical interviews and effectively communicating this knowledge.

Traditional interview preparation systems generally follow a static question-and-answer format and do not understand what an individual candidate has actually learned.

### Our Solution

**Intervia turns the candidate's learning journey into a personalized technical interview.**

Instead of:

```text
Question 1
Question 2
Question 3
Question 4
...
```

CohortIQ follows:

```text
Candidate Learning Journey
          ↓
Curriculum Analysis
          ↓
Personalized Interview Plan
          ↓
AI Technical Interview
          ↓
Answer Evaluation
          ↓
Adaptive Follow-up
          ↓
Final Interview Assessment
```

---

# ✨ Key Features

## 🧠 Candidate-Aware Interviewing

CohortIQ analyzes each candidate's individual learning journey, including:

* Completed missions
* Failed missions
* Skipped topics
* Mission attempts
* Learning signals
* Cohort progress
* Job role
* Years of experience
* Education

The interview strategy is therefore different for different candidates.

---

## 🎯 Personalized Interview Planning

The complete 31-day curriculum acts as the knowledge base for the interviewer.

The system identifies relevant curriculum areas for each candidate rather than forcing every candidate through:

```text
Day 1 → Day 2 → Day 3 → ... → Day 31
```

Instead:

```text
Candidate Profile
      ↓
Learning Journey
      ↓
Relevant Curriculum Topics
      ↓
Candidate-Specific Interview Plan
```

The starting topic and subsequent topics can differ between candidates.

---

## 🤖 Adaptive AI Interviewer

CohortIQ conducts a conversational, multi-turn technical interview.

The next question depends on:

* Candidate's previous answer
* Technical correctness
* Depth of explanation
* Missing concepts
* Reasoning ability
* Current topic
* Candidate experience
* Interview coverage

For example:

```text
Strong Answer
      ↓
Deeper Architecture Question
```

```text
Partial Answer
      ↓
Conceptual Follow-up
```

```text
Weak Answer
      ↓
Fundamental Clarification
```

This makes the interview feel like a real technical discussion rather than a scripted questionnaire.

---

## 🔄 Intelligent Follow-Up Questions

The AI can remain within the same topic when deeper probing is useful.

Example:

> **Question:** How would you design retrieval for a RAG system?

Candidate answers.

> **Follow-up:** How would you evaluate whether the retrieved context is actually relevant?

Candidate answers again.

> **Deeper follow-up:** What would you change if semantic retrieval consistently returned irrelevant documents?

The conversation evolves naturally based on the candidate's responses.

---

## 📚 Curriculum-Aware Assessment

The interviewer is grounded in the supplied 31-day curriculum.

The curriculum includes:

* Modules
* Daily topics
* Learning objectives
* Tools
* Technical concepts

Intervia uses these curriculum objectives to generate relevant technical questions.

---

## 📊 Learning Journey Analysis

Candidate learning signals are treated as contextual information.

For example:

```text
Completed Topic
      ↓
Potential assessment area

Multiple Attempts
      ↓
Potential area for deeper probing

Failed Mission
      ↓
Potential knowledge gap

Skipped Topic
      ↓
Possible learning recommendation
```

Importantly, attempts and mission outcomes are **signals**, not direct measures of technical ability.

The actual interview answers determine interview performance.

---

## 🎚️ Experience-Aware Difficulty

The interview can adapt its technical depth according to the candidate's experience.

### Early-career candidate

```text
Concepts
   ↓
Implementation
   ↓
Practical Application
```

### Experienced candidate

```text
Concepts
   ↓
Implementation
   ↓
Architecture
   ↓
Trade-offs
   ↓
Scalability
   ↓
Production Scenarios
```

Experience influences question depth, not the candidate's actual competence score.

---

## 💬 Conversational Interview Context

The system maintains the interview session using a `sessionId`.

The interviewer remembers:

* Previous questions
* Candidate answers
* Topics already covered
* Curriculum days covered
* Previous evaluations
* Current interview state

This allows the interview to continue naturally across multiple turns.

---

# 📋 Interview Requirements

Intervia satisfies the core challenge requirements:

| Requirement              | Implementation                       |
| ------------------------ | ------------------------------------ |
| Conversational interview | Multi-turn AI interviewer            |
| Minimum 8 questions      | Session-level question tracking      |
| 4+ curriculum days       | Dynamic curriculum coverage tracking |
| Intelligent follow-ups   | Answer-aware question generation     |
| Conversation context     | Session-based interview state        |
| Personalized interview   | Candidate learning journey           |
| Structured feedback      | Automated interview report           |
| HTTP endpoint            | `POST /api/interview`                |

---

# 📈 Interview Report

The final report is generated from the **actual interview**, not simply from the candidate's curriculum progress.

The report considers:

```text
Questions Asked
      +
Candidate Answers
      +
Answer Evaluations
      +
Topics Assessed
      +
Curriculum Days Covered
      +
Technical Depth
      +
Follow-up Performance
      ↓
Personalized Interview Report
```

### Report Includes

#### Overall Assessment

A concise evaluation of the candidate's actual interview performance.

#### Strengths

Technical areas where the candidate demonstrated strong understanding.

#### Gaps

Concepts where the candidate demonstrated incomplete understanding, technical errors, or insufficient depth.

#### Recommended Next Steps

Actionable recommendations connected to relevant curriculum topics.

#### Assessed Curriculum

The report shows which curriculum days/topics were actually assessed.

#### Interview Transcript

The candidate can review:

* Questions
* Answers
* Topics
* Interview outcomes

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │   Candidate Profile  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Learning Journey     │
                         │ Analysis             │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐            ┌──────────────────┐
          │ Candidate Data   │            │ 31-Day Curriculum│
          └────────┬─────────┘            └────────┬─────────┘
                   │                               │
                   └───────────────┬───────────────┘
                                   ▼
                         ┌──────────────────────┐
                         │ Interview Planner    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ AI Interview Agent   │
                         └──────────┬───────────┘
                                    │
                              Question
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Candidate Answer     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Answer Evaluator     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Follow-up Generator  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                              Next Question
                                    │
                                    ▼
                              8+ Questions
                                    │
                                    ▼
                           4+ Curriculum Days
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Feedback Generator   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Interview Report     │
                         └──────────────────────┘
```

---

# 🖥️ Application Screens

## 1. Landing Page

Introduces the AI Interview Agent and explains the personalized interview experience.

### Highlights

* AI-powered interviewing
* Curriculum-aware assessment
* Adaptive questioning
* Personalized feedback
* 31-day cohort intelligence

---

## 2. Candidate Profile

Displays the candidate's learning journey.

### Includes

* Candidate information
* Job role
* Experience
* Education
* Cohort progress
* Mission statistics
* Curriculum map
* Learning signals
* Areas worth probing

---

## 3. Interview Setup

Provides a personalized interview briefing.

### Includes

* Candidate information
* Interview coverage
* Relevant technical topics
* Question count
* Adaptive difficulty
* Curriculum coverage

---

## 4. Interview Room

The core AI interview experience.

### Includes

* AI interviewer
* Technical questions
* Candidate response interface
* Live interview progress
* Current curriculum topic
* Curriculum coverage
* Adaptive follow-ups
* Loading and processing states

---

## 5. Interview Report

Provides a complete post-interview assessment.

### Includes

* Overall assessment
* Technical scores
* Strengths
* Gaps
* Recommended next steps
* Assessed curriculum topics
* Interview transcript

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS / Tailwind CSS
* Responsive UI

### Backend

* Node.js
* Express.js
* REST API

### AI

* Gemini / LLM-based interviewer
* Candidate-aware question generation
* Answer evaluation
* Adaptive follow-up generation
* Feedback generation

### Data

* JSON-based curriculum
* JSON-based candidate profiles
* Session-based interview state

### API

```text
POST /api/interview
```

---

# 🔐 Environment Variables

Create a `.env` file locally:

```env
GEMINI_API_KEY=your_gemini_api_key
```

**Never commit `.env` or API keys to GitHub.**

Use `.env.example` to document required environment variables.

---

# ⚙️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/jaiswalshourya33/TEAM-DEAL_CohortIQ.git
cd TEAM-DEAL_CohortIQ
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env
```

and add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Start development server

```bash
npm run dev:backend  # runs backend
npm run dev:frontend  # runs frontend
```

### 5. Open the application

```text
http://localhost:5173
```

---

# 🔌 API

## Start / Continue Interview

```http
POST /api/interview
```

### Start Interview

```json
{
  "sessionId": "candidate-session-001",
  "candidate": {}
}
```

### Submit Answer

```json
{
  "sessionId": "candidate-session-001",
  "message": "Candidate's technical answer"
}
```

### Response

```json
{
  "reply": "Next interview question...",
  "done": false
}
```

### Interview Completion

```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "...",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}
```

---

# 🧠 What Makes Intervia Different?

### Traditional Interview System

```text
Candidate
    ↓
Fixed Question Bank
    ↓
Same Questions
    ↓
Fixed Evaluation
    ↓
Generic Result
```

### Intervia

```text
Candidate
    ↓
Learning Journey Analysis
    ↓
Personalized Interview Plan
    ↓
Adaptive AI Question
    ↓
Candidate Answer
    ↓
Answer Evaluation
    ↓
Intelligent Follow-up
    ↓
Personalized Assessment
```

The system doesn't just ask:

> **"What do you know?"**

It asks:

> **"What should I assess based on what you learned, and what should I ask next based on how you answered?"**

---

# 🎯 Design Philosophy

CohortIQ is designed around three principles:

### 1. The curriculum determines what can be assessed.

The 31-day curriculum provides the technical knowledge space.

### 2. The candidate's learning journey determines what should be assessed.

Completed, skipped, failed, and repeated missions provide contextual signals.

### 3. The candidate's answers determine what should be asked next.

The AI adapts throughout the conversation.

```text
Learning Journey
      ↓
Interview Plan
      ↓
Interview Performance
      ↓
Personalized Feedback
```

---

# 🚧 Future Enhancements

Potential future improvements include:

* Voice-based interviews
* Real-time coding challenges
* Code execution during interviews
* Persistent candidate history
* Advanced vector-based curriculum retrieval
* Interview benchmarking
* Multi-model evaluation
* Recruiter dashboard
* Interview analytics
* Interview difficulty calibration
* Exportable interview reports
* Role-specific interview tracks

---

# 👥 Team Collaboration

This project was developed collaboratively by:

## **Team DEAL**

### Contributors:

1. Shourya Jaiswal
2. Parv Chaudhary


The architecture was designed to allow multiple contributors to work independently across the frontend, backend, AI orchestration, and data layers.

---

# 🏆 Hackathon Objective

Intervia aims to demonstrate how modern AI engineering techniques can transform a static technical assessment into a **dynamic, personalized, context-aware interview experience**.

The goal is not simply to build another chatbot.

The goal is to build an AI interviewer capable of understanding:

```text
WHO the candidate is
        +
WHAT they learned
        +
WHAT they struggled with
        +
HOW they answer
        ↓
WHAT should be asked next
```

---

# 📜 License

This project was developed as part of the AI Cohort hackathon challenge.

The curriculum and candidate datasets provided for the challenge are synthetic and intended solely for the hackathon.
