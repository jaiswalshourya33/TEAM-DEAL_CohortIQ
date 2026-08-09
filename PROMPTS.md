# CohortIQ — Prompt History

> Consolidated prompt history used while designing and building the AI Interview Agent website.
>
> **Team:** DEAL  
> **Project:** CohortIQ — AI Technical Interview Agent

---

## 1. Original Problem Statement / Project Understanding

### Prompt

The AI Cohort is a 31-day enterprise AI engineering program covering modern AI topics including:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Prompt Engineering
- Agentic AI
- Model Context Protocol (MCP)
- AI Deployment
- Production AI Systems

After completing the cohort, learners should be able to confidently explain the systems they built and the engineering decisions behind them.

However, preparing for technical interviews and effectively communicating this knowledge remains one of the biggest challenges.

The task is to build an AI Interview Agent that conducts personalized technical interviews based on a candidate's learning journey throughout the cohort.

The interview should:

- Assess the candidate's understanding of completed concepts.
- Adapt naturally throughout the conversation.
- Ask intelligent follow-up questions.
- Maintain context across the interview.
- Provide actionable feedback at the end.
- Feel like a real technical interview rather than a scripted questionnaire.

Resources provided:

1. Curriculum JSON
   - Modules
   - Daily topics
   - Learning objectives
   - Tools used throughout the program

2. Candidate Profiles
   - Completed missions
   - Attempts
   - Skipped topics
   - Learning signals

3. Technical Specification
   - Required API contract
   - Submission requirements
   - Request/response formats

Minimum requirements:

- Minimum 8 questions.
- At least 4 different curriculum days.
- Follow-up questions based on previous responses.
- Conversation context.
- Structured feedback.
- Required HTTP endpoint.

The website should include all fields and functionality required by the problem statement.

---

## 2. Initial Website Architecture

### Prompt

Create a complete website architecture for the AI Interview Agent based on the problem statement and supplied Curriculum, Candidate Profiles, and Technical Specification.

Determine:

- All pages required.
- Components required.
- Frontend architecture.
- Backend architecture.
- AI interview-agent architecture.
- Candidate personalization flow.
- Interview flow.
- Report generation flow.
- API requirements.
- Data flow between frontend, backend, curriculum, candidate data, and AI.
- Recommended project folder structure.

The website should feel like a complete AI technical interview product rather than a simple questionnaire.

---

## 3. Frontend Folder Structure

### Prompt

Use the following frontend folder structure:

```text
frontend/
│
├── src/
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── CandidateProfile.jsx
│   │   ├── InterviewSetup.jsx
│   │   ├── InterviewRoom.jsx
│   │   └── InterviewReport.jsx
│   │
│   ├── components/
│   │   ├── CandidateCard.jsx
│   │   ├── CurriculumMap.jsx
│   │   ├── InterviewMessage.jsx
│   │   ├── AnswerInput.jsx
│   │   ├── InterviewProgress.jsx
│   │   ├── TopicBadge.jsx
│   │   ├── ScoreCard.jsx
│   │   └── FeedbackCard.jsx
│   │
│   ├── services/
│   │   └── interviewApi.js
│   │
│   ├── context/
│   │   └── InterviewContext.jsx
│   │
│   ├── hooks/
│   │   └── useInterview.js
│   │
│   ├── data/
│   │   └── candidates.json
│   │
│   └── App.jsx
```

Generate the frontend design in Google Stitch.

The website should be:

- Fancy.
- Modern.
- Innovative.
- Eye-catching.
- Professional.
- Designed for an AI technical interview product.
- Different from a generic chatbot.
- Fully aligned with the problem statement.
- Complete across all required screens.

Do not break the specified folder structure.

---

## 4. Visual Design / Color Palette

### Prompt

Use a distinctive warm color palette rather than a typical blue/purple AI interface.

The requested palette is:

**Warm Midnight + Amber + Burnt Orange + Cream**

Use the palette intelligently throughout:

- Backgrounds
- Cards
- Buttons
- Highlights
- Progress indicators
- Interview states
- Badges
- Charts
- Report sections
- Hover effects
- Navigation

The interface should feel premium, warm, modern, and technically sophisticated.

Do not make the design look like a generic AI dashboard.

Suggested palette:

```text
Warm Midnight  #171411
Deep Cocoa     #211B17
Amber Gold     #F4A261
Burnt Orange   #E76F51
Terracotta     #C65D3A
Warm Cream     #FFE8C2
Warm White     #FFF8F0
Warm Gray      #B8AAA0
Warm Charcoal  #3A302A
Soft Sage      #7FB685
Golden Amber   #E9C46A
Muted Red      #C8554D
```

---

## 5. Google AI Studio Full-Stack Implementation Prompt

### Prompt

The existing Stitch-generated frontend is already approved.

Treat the current frontend as the visual source of truth.

Do not redesign it.

Do not replace it with a generic UI.

Do not arbitrarily rename or move files.

Implement the backend around the existing frontend.

Use:

```text
Existing Stitch UI
        ↓
React State
        ↓
POST /api/interview
        ↓
Interview Session
        ↓
Candidate + Curriculum
        ↓
AI Interview Agent
        ↓
Adaptive Questions
        ↓
Answer Evaluation
        ↓
8+ Questions / 4+ Days
        ↓
Structured Feedback
        ↓
Existing Interview Report UI
```

The project should:

- Read the supplied curriculum.
- Read the supplied candidate profiles.
- Respect the Technical Specification.
- Maintain interview state using sessionId.
- Generate adaptive technical questions.
- Generate follow-ups.
- Evaluate candidate answers.
- Ensure minimum 8 questions.
- Ensure at least 4 different curriculum days.
- Generate structured final feedback.
- Keep API keys server-side.
- Use environment variables.
- Handle loading and API errors.
- Keep frontend/backend responsibilities separated.

Recommended backend structure:

```text
backend/
├── src/
│   ├── routes/
│   │   └── interview.routes.js
│   ├── controllers/
│   │   └── interview.controller.js
│   ├── services/
│   │   ├── candidate.service.js
│   │   ├── curriculum.service.js
│   │   ├── session.service.js
│   │   └── retrieval.service.js
│   ├── agent/
│   │   ├── interviewPlanner.js
│   │   ├── questionGenerator.js
│   │   ├── answerEvaluator.js
│   │   ├── followupGenerator.js
│   │   └── feedbackGenerator.js
│   ├── prompts/
│   │   ├── planner.prompt.js
│   │   ├── interviewer.prompt.js
│   │   ├── evaluator.prompt.js
│   │   └── feedback.prompt.js
│   ├── data/
│   │   ├── curriculum.json
│   │   └── candidates.json
│   └── server.js
└── package.json
```

The frontend should use:

```text
src/services/interviewApi.js
```

for interview API calls and:

```text
InterviewContext.jsx
useInterview.js
```

for shared interview state.

---

## 6. Personalization Logic Correction

### Prompt

The current implementation is incorrectly treating the curriculum as a fixed sequence.

Do not make every candidate follow:

```text
Day 1 → Day 2 → Day 3 → ... → Day 31
```

The 31-day curriculum is the knowledge base, not a fixed questionnaire.

Instead:

```text
Candidate Profile
        +
Learning Journey
        +
Completed Missions
        +
Attempts
        +
Skipped Topics
        +
Failed Missions
        +
Learning Signals
        +
Role
        +
Experience
        +
Curriculum
        ↓
Candidate-Specific Interview Plan
        ↓
Adaptive Interview
```

The interview should primarily assess completed learning while using failed/repeated missions as signals for deeper probing.

Skipped topics should not be treated as mastered.

Attempts should be treated as learning signals, not direct evidence of skill.

The starting topic should be selected based on candidate relevance rather than blindly forcing Day 1.

Do not use:

```javascript
currentDay = 1;
```

as a universal strategy.

Do not use:

```javascript
currentDay++;
```

as the primary interview progression mechanism.

Do not iterate sequentially through the entire curriculum.

Instead generate an internal plan containing:

```javascript
{
  candidateId,
  selectedDays,
  selectedTopics,
  priorityAreas,
  startingDay,
  difficulty,
  minimumQuestions: 8,
  minimumDays: 4
}
```

The plan must be generated separately for each candidate.

---

## 7. Candidate-Aware Adaptive Interview

### Prompt

Every candidate should receive a personalized technical interview.

Use:

```text
Candidate Profile
+
Candidate Curriculum Progress
+
Completed Missions
+
Failed Missions
+
Skipped Missions
+
Mission Attempts
+
Learning Signals
+
Job Role
+
Years of Experience
+
31-Day Curriculum
```

to create the interview plan.

Completed topics should generally have higher interview relevance.

Failed and repeated-attempt topics may be used for deeper probing.

Skipped topics should generally have lower interview priority and can become recommendations.

Job role should influence topic relevance.

Experience should influence question depth.

Do not use experience as the candidate's technical score.

The interviewer should adapt after every answer:

```text
Question
   ↓
Candidate Answer
   ↓
Evaluate Answer
   ↓
Identify Strengths / Gaps / Misconceptions
   ↓
Choose Next Best Question
```

The next question may:

- Probe deeper into the same topic.
- Move to another relevant curriculum day.
- Become easier if the candidate is struggling.
- Become more architectural if the candidate demonstrates strong understanding.

Do not force exactly one question per curriculum day.

Do not use a static question sequence.

Prevent duplicate questions.

Maintain:

```javascript
askedQuestions
coveredDays
coveredTopics
questionCount
conversation
evaluations
```

The interview must end only after:

```text
questionCount >= 8
AND
uniqueCoveredDays >= 4
```

---

## 8. Interview Report Personalization

### Prompt

The final report must be generated from the interview that was actually conducted.

Do not generate a generic report from the candidate profile.

The report must use:

```text
Candidate Profile
+
Actual Questions Asked
+
Candidate's Actual Answers
+
Answer Evaluations
+
Curriculum Days Assessed
+
Topics Discussed
+
Follow-up Performance
+
Technical Depth
+
Final Interview Outcome
```

The final report should contain:

- Overall summary.
- Strengths demonstrated during the interview.
- Gaps demonstrated during the interview.
- Actionable next steps.
- Assessed curriculum days/topics.
- Interview transcript.
- Optional score dimensions based on actual interview performance.

Keep these concepts separate:

```text
Learning Journey
    ↓
What the candidate completed/skipped

Interview Plan
    ↓
What the AI chose to assess

Interview Performance
    ↓
What the candidate actually demonstrated
```

The report must be primarily based on **Interview Performance**.

Do not claim a candidate is strong in a topic that was never assessed.

Do not turn skipped topics directly into interview gaps.

Skipped or incomplete topics can appear as learning recommendations.

If numerical scores are used, they must come from actual interview performance, not cohort completion percentage.

---

## 9. Report Generation Example

### Prompt

If the interview assessed:

```text
Day 10 — Retrieval
Day 12 — Prompt Engineering
Day 22 — Agentic AI
Day 23 — MCP
Day 28 — Deployment
```

and the candidate performed differently across those topics, generate a report reflecting that exact interview.

For example:

```text
Overall Assessment

The candidate demonstrated strong understanding of retrieval architecture
and agent orchestration. Prompt engineering was conceptually sound but
lacked depth in evaluation methodology. MCP architecture showed limited
technical depth.

Strengths:
- Strong retrieval reasoning.
- Good understanding of agent orchestration.
- Clear practical explanations.

Gaps:
- Limited depth in MCP architecture.
- Some gaps in production deployment reasoning.

Next Steps:
- Review Day 23 — MCP.
- Practice MCP tool integration scenarios.
- Revisit Day 28 — Deployment.
```

Do not use this as fixed text. Generate equivalent feedback from the actual interview.

---

## 10. GitHub / Environment Configuration

### Prompt

Prepare the project for GitHub without exposing API keys.

Use the existing `.gitignore` and `.env.example` files if already present.

The real `.env` file must remain local.

`.env.example` should contain placeholders such as:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Never commit:

```text
.env
```

The project should be testable locally with:

```bash
npm install
npm run dev
```

API keys must remain server-side.

---

## 11. Project Branding

### Prompt

Create a product identity for the AI interview platform.

Preferred product name:

**Intervia**

Positioning:

> Personalized technical interviews powered by your learning journey.

The visual identity should communicate:

- AI
- Technical assessment
- Intelligence
- Personalization
- Modern engineering
- Premium product quality

Avoid generic names such as "AI Interviewer" or "Mock Interview Bot" in the product branding.

---

## 12. README Requirements

### Prompt

Create a concise, professional GitHub README for the project.

The README should include:

- Project name: Intervia
- Short project description
- Live demo link
- Problem statement
- Key features
- Personalized interview flow
- Adaptive questioning
- Curriculum-aware assessment
- Candidate-aware interview planning
- Interview report
- Tech stack
- Local setup
- API information
- Team collaboration
- Team name: DEAL
- Contributor credits
- Hackathon/project note

Use a concise structure suitable for a real GitHub project.

Do not invent a live URL or contributor names.

Use placeholders until actual values are supplied.

---

## 13. Final Product Principle

### Prompt

The final product should follow this core principle:

> **The learning journey determines what to ask.  
> The candidate's answers determine what to ask next.  
> The interview determines what the candidate should improve.**

The final system should feel like an intelligent technical interviewer rather than:

- A static questionnaire.
- A generic chatbot.
- A curriculum viewer.
- A candidate profile dashboard with canned questions.

The complete architecture should be:

```text
Candidate
   ↓
Learning Journey Analysis
   ↓
Candidate-Specific Interview Plan
   ↓
Adaptive AI Interview
   ↓
Answer Evaluation
   ↓
Intelligent Follow-up
   ↓
8+ Questions / 4+ Curriculum Days
   ↓
Interview Performance Analysis
   ↓
Personalized Interview Report
```

---

## 14. Vibe Coding / AI-Assisted Development Tools Used

### Project Development Workflow

This project was developed using an AI-assisted / vibe-coding workflow. Multiple AI and development tools were used throughout the ideation, design, implementation, debugging, documentation, and refinement stages.

Tools Used

#### 1. ChatGPT

Used for:

- Understanding and breaking down the problem statement.

- Designing the overall system architecture.

- Planning frontend and backend folder structures.

- Reasoning about candidate personalization.

- Designing the adaptive interview flow.

- Designing interview-report generation.

- Creating implementation prompts for other AI coding tools.

- Debugging and troubleshooting development issues.

- Reviewing architectural decisions.

- Git/GitHub workflow guidance.

- README and project documentation generation.

- Prompt engineering and refinement.

ChatGPT was primarily used as an architecture, reasoning, prompt-engineering, debugging, and development assistant.

#### 2. Google Stitch

Used for:

Generating the initial frontend UI.

Designing the application screens.

Exploring the visual direction of the product.

Creating the page layouts and component structure.

Establishing the visual language for the interview experience.

Iterating on the UI and UX.

The Stitch-generated frontend was treated as the primary visual reference for the application.

#### 3. Google AI Studio

Used for:

AI-assisted application generation.

Integrating the Gemini-powered interview functionality.

Connecting the frontend and backend.

Working with the supplied curriculum and candidate data.

Implementing the interview-agent workflow.

Generating and refining application logic.

Local development setup and environment configuration.

Google AI Studio was used as an important part of the AI-assisted implementation workflow.

### 4. Antigravity

Used for:

AI-assisted coding and implementation.

Refining the existing application rather than rebuilding it.

Implementing candidate-specific interview orchestration.

Improving adaptive question generation.

Connecting candidate learning signals to interview planning.

Implementing interview evaluation logic.

Generating interview reports from actual interview performance.

Debugging and modifying the existing codebase.

Maintaining the existing frontend architecture while extending functionality.

Antigravity was used as the primary AI coding and implementation assistant during later development iterations.

#### 5. Google Gemini

Used as the underlying generative AI capability for:

Technical question generation.

Candidate-aware question generation.

Follow-up question generation.

Answer evaluation.

Adaptive interview progression.

Technical reasoning assessment.

Final interview feedback generation.

Gemini powers the conversational intelligence of the AI interviewer.

#### 6. VS Code

Used for:

Local development.

Code inspection.

Debugging.

Running the application.

Managing the project structure.

Environment-variable configuration.

Git/GitHub integration.

Testing frontend and backend behavior.

#### 7. Git & GitHub

Used for:

Version control.

Branch management.

Collaboration.

Code review.

Project backup and sharing.

Team-based development.

API keys and secrets are excluded from version control using .gitignore.

#### 8. Node.js / npm

Used for:

Backend runtime.

Dependency management.

Running the development environment.

Building and serving the application.

#### 9. React + Vite

Used for:

Frontend application development.

Component-based UI.

Interview state management.

Candidate profile presentation.

Interview room.

Interview progress.

Interview report.

#### 10. Express.js

Used for:

Backend HTTP server.

Interview API.

Connecting the frontend with the AI interview agent.

Maintaining interview sessions.

Processing candidate responses.

AI-Assisted / Vibe Coding Workflow

The project followed an iterative AI-assisted development process:

Problem Statement
       ↓
ChatGPT
Architecture + Planning
       ↓
Google Stitch
UI / UX Generation
       ↓
Google AI Studio
Initial AI-Assisted Implementation
       ↓
VS Code
Local Development + Testing
       ↓
Antigravity
Code Refinement + Feature Implementation
       ↓
Google Gemini
Interview Intelligence
       ↓
ChatGPT + Antigravity
Debugging + Optimization
       ↓
Git / GitHub
Version Control + Collaboration

The development process was iterative rather than completely generated in one step.

AI tools were used to accelerate:

Ideation

Architecture

UI generation

Coding

Refactoring

Debugging

Prompt engineering

Testing

Documentation

Human/team decisions were still used to determine the product requirements, architecture, feature priorities, UI direction, and final implementation.

Prompt Engineering as Part of the Development

Prompt engineering was an important part of the project.

Different prompts were created for different responsibilities:

Problem Understanding
        ↓
Architecture Prompt
        ↓
UI / Stitch Prompt
        ↓
Full-Stack Implementation Prompt
        ↓
Personalization Prompt
        ↓
Adaptive Interview Prompt
        ↓
Interview Evaluation Prompt
        ↓
Report Generation Prompt
        ↓
Documentation Prompt

This allowed the AI tools to work with clear responsibilities instead of relying on one large generic instruction.

Human + AI Development Model

The project follows a human-in-the-loop vibe-coding workflow:

Human Decision
      ↓
AI Generation
      ↓
Human Review
      ↓
Testing
      ↓
AI Refinement
      ↓
Human Validation
      ↓
Final Implementation

AI tools were used as development accelerators and engineering assistants, while the team remained responsible for evaluating outputs, selecting the architecture, testing functionality, and deciding which changes should be incorporated.

---

### Notes

The curriculum and candidate profiles are synthetic challenge data.

The Technical Specification is authoritative for the API contract.

The existing Stitch frontend should remain visually intact.

Backend logic should be modified without unnecessarily changing the UI.

API keys must never be committed.

Personalization should be based on meaningful candidate data, not random topic selection.
