import React, { useState } from 'react';
import { CandidateProfile } from '@/types';
import { CandidateAvatar } from './CandidateAvatar';

interface InterviewSetupViewProps {
  candidate: CandidateProfile;
  onBeginInterview: () => void;
  onReturnToDashboard: () => void;
}

export const InterviewSetupView: React.FC<InterviewSetupViewProps> = ({
  candidate,
  onBeginInterview,
  onReturnToDashboard
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Compute dynamic technical coverage topics based on selected candidate
  const getCoverageTopics = (cand: CandidateProfile) => {
    const baseTopics = [
      { name: "Embeddings", day: "Day 7", keywords: ["embedding"] },
      { name: "Vector Search", day: "Day 8-9", keywords: ["vector", "index"] },
      { name: "Retrieval Engine", day: "Day 10", keywords: ["retrieval", "matching", "rag"] },
      { name: "Prompt Engineering", day: "Day 12-13", keywords: ["prompt", "function calling", "structured"] },
      { name: "Fine-Tuning", day: "Day 14-15", keywords: ["fine-tuning", "lora"] },
      { name: "Agentic AI", day: "Day 21-22", keywords: ["agent", "multi-agent"] },
      { name: "MCP Protocol", day: "Day 23", keywords: ["mcp", "protocol"] },
      { name: "Deployment", day: "Day 28", keywords: ["docker", "kubernetes", "deployment", "container"] },
      { name: "Observability & Monitoring", day: "Day 29", keywords: ["monitoring", "logging", "observability"] }
    ];

    const skippedMissions = cand.missions ? cand.missions.filter(m => m.skipped || (!m.passed && m.attempts > 3)) : [];
    const probeTexts = (cand.probeAreas || []).map(p => (p.title + " " + p.description).toLowerCase());

    return baseTopics.map(t => {
      const isSkippedInMissions = skippedMissions.some(m => 
        t.keywords.some(k => m.title.toLowerCase().includes(k)) ||
        (t.day.includes("29") && m.day === 29) ||
        (t.day.includes("28") && m.day === 28) ||
        (t.day.includes("8") && m.day === 8)
      );

      const isProbedInAreas = probeTexts.some(pText => t.keywords.some(k => pText.includes(k)));

      const isFocus = isSkippedInMissions || isProbedInAreas;

      return {
        name: t.name,
        day: t.day,
        status: isFocus ? "Focus Area (Skipped / Drilling)" : "Covered"
      };
    });
  };

  const coverageTopics = getCoverageTopics(candidate);
  const focusTopic = coverageTopics.find(t => t.status.includes('Focus Area'))?.name || 'bypassed modules';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#383430] pb-4">
        <button
          onClick={onReturnToDashboard}
          className="text-xs font-semibold text-[#a08d80] hover:text-[#ffc499] transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Return to Candidate Intelligence
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#a08d80]">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Interviewer ID: #SIM-882-X</span>
          <span className="text-[#383430]">|</span>
          <span className="text-[#ffc499]">Status: Optimized</span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1c1815] border border-[#534439] p-6 rounded-2xl">
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 bg-[#383430] border border-[#534439] px-3 py-1 rounded-full text-xs font-semibold text-[#ffc499]">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Custom Session Parameters Generated
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e9e1dc]">
            Your Interview Is Ready
          </h1>
          <p className="text-sm text-[#d8c2b5] max-w-3xl leading-relaxed">
            We've custom-built this technical simulation based on <strong className="text-[#ffc499]">{candidate.member.name}</strong>'s learning history in LLM Application Development. Review session parameters and behavioral logic before starting.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#221f1c] p-4 rounded-xl border border-[#383430] shrink-0">
          <CandidateAvatar name={candidate.member.name} size="lg" />
          <div>
            <div className="text-sm font-bold text-[#e9e1dc]">{candidate.member.name}</div>
            <div className="text-xs text-[#a08d80]">{candidate.member.jobRole}</div>
          </div>
        </div>
      </div>

      {/* Coverage Badges */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-3">
        <div className="text-xs font-bold text-[#a08d80] uppercase tracking-wider flex items-center justify-between">
          <span>Target Technical Coverage</span>
          <span className="text-[#ffc499]">Click a topic to view cohort context</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {coverageTopics.map((topic, idx) => {
            const isFocus = topic.status.includes('Focus Area');
            return (
              <button
                key={idx}
                onClick={() => setSelectedTopic(selectedTopic === topic.name ? null : topic.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                  isFocus
                    ? 'bg-[#2a221a] text-[#f4a261] border-[#f4a261]/50 shadow-md ring-1 ring-[#f4a261]/30'
                    : selectedTopic === topic.name
                    ? 'bg-[#383430] text-[#ffc499] border-[#ffc499]'
                    : 'bg-[#221f1c] text-[#d8c2b5] border-[#383430] hover:border-[#534439]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>{topic.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({topic.day})</span>
              </button>
            );
          })}
        </div>

        {selectedTopic && (
          <div className="bg-[#221f1c] border border-[#ffc499]/30 rounded-xl p-3 text-xs text-[#d8c2b5] mt-2 animate-in fade-in">
            <strong className="text-[#ffc499]">{selectedTopic}:</strong> Selected for active adaptive questioning. The AI interviewer will probe architectural choices, performance bottlenecks, and edge cases.
          </div>
        )}
      </div>

      {/* Grid: Session Parameters & Behavioral Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Parameters Card */}
        <div className="lg:col-span-2 bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#383430] pb-3">
            <span className="material-symbols-outlined text-[#ffc499]">tune</span>
            <h3 className="text-lg font-bold text-[#e9e1dc]">Session Parameters</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-[#221f1c] border border-[#383430] p-3 rounded-xl">
              <div className="text-[10px] text-[#a08d80] uppercase font-bold mb-1">Duration</div>
              <div className="text-base font-bold text-[#e9e1dc]">8+ Questions</div>
              <div className="text-[10px] text-[#a08d80]">~25-30 Mins</div>
            </div>

            <div className="bg-[#221f1c] border border-[#383430] p-3 rounded-xl">
              <div className="text-[10px] text-[#a08d80] uppercase font-bold mb-1">Simulated Window</div>
              <div className="text-base font-bold text-[#e9e1dc]">4+ Days Case</div>
              <div className="text-[10px] text-[#a08d80]">Real Cohort Days</div>
            </div>

            <div className="bg-[#221f1c] border border-[#383430] p-3 rounded-xl">
              <div className="text-[10px] text-[#a08d80] uppercase font-bold mb-1">Difficulty</div>
              <div className="text-base font-bold text-[#f4a261]">Adaptive</div>
              <div className="text-[10px] text-[#a08d80]">Levels 1 to 4</div>
            </div>

            <div className="bg-[#221f1c] border border-[#383430] p-3 rounded-xl">
              <div className="text-[10px] text-[#a08d80] uppercase font-bold mb-1">Communication</div>
              <div className="text-base font-bold text-[#e9e1dc]">Conversational</div>
              <div className="text-[10px] text-[#a08d80]">+ Code & Architecture</div>
            </div>
          </div>

          {/* Quote / Context Box */}
          <div className="bg-[#221f1c] border-l-4 border-[#ffc499] p-4 rounded-r-xl space-y-1">
            <div className="text-xs font-bold text-[#ffc499] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">format_quote</span>
              Agent Behavioral Instruction
            </div>
            <p className="text-xs text-[#d8c2b5] leading-relaxed">
              "The agent will adjust its technical depth based on your initial responses. Bypassed cohort modules (such as {focusTopic}) will be prioritized during turns 3-5 to assess real-world production readiness."
            </p>
          </div>

          {/* Behavioral Logic Diagram */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-[#a08d80] uppercase tracking-wider">
              Adaptive Branching Logic Flow
            </div>

            <div className="bg-[#161310] border border-[#383430] rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-center">
                {/* Flow Step 1 */}
                <div className="bg-[#221f1c] border border-[#534439] p-3 rounded-xl">
                  <span className="text-[10px] font-mono text-[#a08d80]">STEP 01</span>
                  <div className="text-xs font-bold text-[#e9e1dc]">START (Question 1)</div>
                  <div className="text-[10px] text-[#d8c2b5]">Baseline RAG Query</div>
                </div>

                {/* Flow Step 2 */}
                <div className="bg-[#2b2723] border border-[#ffc499]/50 p-3 rounded-xl">
                  <span className="text-[10px] font-mono text-[#ffc499]">ANALYSIS</span>
                  <div className="text-xs font-bold text-[#e9e1dc]">AI Scoring Engine</div>
                  <div className="text-[10px] text-[#ffc499]">Evaluates depth & precision</div>
                </div>

                {/* Flow Step 3 */}
                <div className="space-y-2">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-2 rounded-lg text-[11px] text-emerald-300 font-medium">
                    Strong Answer → Level 3-4 Architecture
                  </div>
                  <div className="bg-amber-950/40 border border-amber-500/40 p-2 rounded-lg text-[11px] text-amber-300 font-medium">
                    Conceptual Gap → Level 1-2 Foundational Drill
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Pro-Tip & Production Context */}
        <div className="space-y-6">
          {/* Pro Tip Box */}
          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#ffc499]">
              <span className="material-symbols-outlined">lightbulb</span>
              <h4 className="text-sm font-bold text-[#e9e1dc]">Interview Pro-Tip</h4>
            </div>
            <p className="text-xs text-[#d8c2b5] leading-relaxed">
              Treat the agent like a senior principal architect. Feel free to ask for clarification, specify assumptions, or propose alternative system designs with code snippets.
            </p>
          </div>

          {/* Context Card: Production RAG Systems */}
          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-bold text-[#a08d80] uppercase tracking-wider flex items-center justify-between">
              <span>Target Architecture</span>
              <span className="material-symbols-outlined text-sm text-[#ffc499]">account_tree</span>
            </div>
            <div className="bg-[#221f1c] border border-[#383430] p-4 rounded-xl space-y-2 text-center">
              <div className="text-xs font-bold text-[#e9e1dc]">Production RAG & Agent Pipeline</div>
              <div className="text-[10px] text-[#a08d80] font-mono">
                [Client] → [Query Router] → [Vector DB / SQL] → [LLM + MCP] → [Guardrails]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#e9e1dc]">Ready to begin simulation?</div>
          <div className="text-xs text-[#a08d80]">Session progress and candidate transcript will be saved to recruiter records.</div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReturnToDashboard}
            className="px-5 py-3 rounded-xl text-xs font-semibold text-[#d8c2b5] hover:bg-[#221f1c] border border-[#534439] transition-colors w-full sm:w-auto text-center"
          >
            Review Curriculum Map
          </button>

          <button
            onClick={onBeginInterview}
            className="bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] font-extrabold py-3.5 px-8 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span>Begin Technical Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
