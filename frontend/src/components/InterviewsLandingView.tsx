import React, { useState } from 'react';
import { CandidateProfile } from '@/types';
import { CandidateAvatar } from './CandidateAvatar';

interface InterviewsLandingViewProps {
  candidate: CandidateProfile;
  onStartInterview: () => void;
}

export const InterviewsLandingView: React.FC<InterviewsLandingViewProps> = ({
  candidate,
  onStartInterview
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'context' | 'scoring'>('architecture');

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#221f1c] to-[#161310] border border-[#534439] rounded-3xl p-8 sm:p-12 overflow-hidden text-center tech-glow">
        <div className="absolute inset-0 fine-grid-bg opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f4a261]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-[#383430] border border-[#534439] px-4 py-1.5 rounded-full text-xs font-semibold text-[#ffc499]">
            <span className="w-2 h-2 rounded-full bg-[#f4a261] pulse-dot"></span>
            V2.4 Intelligence Engine Active
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#e9e1dc] tracking-tight leading-tight">
            Your learning journey.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc499] via-[#f4a261] to-[#e76f51]">
              Your technical interview.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#d8c2b5] leading-relaxed max-w-2xl mx-auto">
            An adaptive AI interviewer that understands what {candidate.member.name} learned across the 31-day AI Engineering Cohort and challenges them accordingly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartInterview}
              className="w-full sm:w-auto bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] font-extrabold py-3.5 px-8 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 text-base cursor-pointer"
            >
              <span>Start Technical Interview</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            <button
              onClick={() => setShowHowItWorks(true)}
              className="w-full sm:w-auto bg-[#2b2723] hover:bg-[#383430] text-[#e9e1dc] font-semibold py-3.5 px-6 rounded-xl border border-[#534439] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg text-[#ffc499]">info</span>
              <span>Explore How It Works</span>
            </button>
          </div>

          {/* How It Works Modal */}
          {showHowItWorks && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-left">
              <div className="bg-[#1c1815] border border-[#534439] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#383430] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#383430] flex items-center justify-center text-[#ffc499]">
                      <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#e9e1dc]">How LogicFlow AI Interviews Work</h3>
                      <p className="text-xs text-[#a08d80]">Behind the scenes of cohort-aware technical probing</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHowItWorks(false)}
                    className="text-[#a08d80] hover:text-[#e9e1dc] p-1.5 rounded-lg hover:bg-[#221f1c] transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Navigation Tabs inside Modal */}
                <div className="flex border-b border-[#383430] gap-4">
                  {[
                    { id: 'architecture', label: '1. Adaptive Engine' },
                    { id: 'context', label: '2. Cohort Memory Ingestion' },
                    { id: 'scoring', label: '3. Multi-Dimension Scoring' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-2 text-xs font-bold transition-all ${
                        activeTab === tab.id
                          ? 'text-[#ffc499] border-b-2 border-[#ffc499]'
                          : 'text-[#a08d80] hover:text-[#d8c2b5]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'architecture' && (
                  <div className="space-y-4 text-xs text-[#d8c2b5] leading-relaxed">
                    <div className="bg-[#221f1c] border border-[#383430] p-4 rounded-xl space-y-2">
                      <div className="font-bold text-[#ffc499] text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">psychology</span>
                        Real-Time Dynamic Difficulty Branching
                      </div>
                      <p>
                        The AI interviewer does not follow a static linear script. In the first turn, it presents an open-ended architectural problem (e.g., vector ingestion pipelines, RAG caching, or MCP tool calls).
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[#a08d80]">
                        <li><strong className="text-[#e9e1dc]">If answer is strong:</strong> Advances to high-concurrency SLA probes, distributed state, and failure recovery.</li>
                        <li><strong className="text-[#e9e1dc]">If answer shows gaps:</strong> Gently pivots to diagnostic questions to verify underlying fundamentals.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'context' && (
                  <div className="space-y-4 text-xs text-[#d8c2b5] leading-relaxed">
                    <div className="bg-[#221f1c] border border-[#383430] p-4 rounded-xl space-y-2">
                      <div className="font-bold text-[#ffc499] text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">database</span>
                        Cohort Activity Ingestion
                      </div>
                      <p>
                        Prior to starting an interview with <span className="text-[#ffc499] font-semibold">{candidate.member.name}</span>, the engine analyzes:
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-[#161310] p-2.5 rounded-lg border border-[#383430]">
                          <div className="font-bold text-[#e9e1dc]">31 Daily Modules</div>
                          <div className="text-[10px] text-[#a08d80]">Pass rate & attempt counts per topic</div>
                        </div>
                        <div className="bg-[#161310] p-2.5 rounded-lg border border-[#383430]">
                          <div className="font-bold text-[#e9e1dc]">Skipped Exercises</div>
                          <div className="text-[10px] text-[#a08d80]">e.g. Day 29 Observability or Day 28 Docker</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'scoring' && (
                  <div className="space-y-4 text-xs text-[#d8c2b5] leading-relaxed">
                    <div className="bg-[#221f1c] border border-[#383430] p-4 rounded-xl space-y-2">
                      <div className="font-bold text-[#ffc499] text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">fact_check</span>
                        Instant Competency Evaluation
                      </div>
                      <p>
                        Once completed, the Gemini AI evaluator scores responses across 5 core dimensions: Technical Understanding, Depth of Reasoning, System Design, Practical Application, and Technical Communication.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowHowItWorks(false)}
                    className="bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] font-extrabold px-6 py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#383430] text-center">
            <div>
              <div className="text-xl font-bold text-[#ffc499]">31 Days</div>
              <div className="text-xs text-[#a08d80]">Cohort Depth</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#ffc499]">8 Modules</div>
              <div className="text-xs text-[#a08d80]">Curriculum Nodes</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#f4a261]">Adaptive AI</div>
              <div className="text-xs text-[#a08d80]">Real-Time Branching</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#ffc499]">8+ Questions</div>
              <div className="text-xs text-[#a08d80]">Probing Engine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Node Graph Visualization */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#e9e1dc] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc499]">hub</span>
              LogicFlow Engine Architecture
            </h3>
            <p className="text-xs text-[#a08d80]">How candidate signals feed into the adaptive technical interviewer</p>
          </div>
          <span className="text-xs font-mono text-[#f4a261] bg-[#383430] px-3 py-1 rounded-full border border-[#534439]">
            Context Injected: {candidate.member.name}
          </span>
        </div>

        {/* Node Graph Canvas */}
        <div className="relative bg-[#161310] border border-[#383430] rounded-xl p-6 overflow-x-auto min-w-[700px]">
          <div className="grid grid-cols-5 gap-4 items-center text-center relative z-10">
            {/* Step 1: Candidate Profile */}
            <div className="bg-[#221f1c] border border-[#534439] p-4 rounded-xl shadow space-y-2 flex flex-col items-center justify-center">
              <CandidateAvatar name={candidate.member.name} size="md" />
              <div className="text-xs font-bold text-[#e9e1dc]">{candidate.member.name}</div>
              <div className="text-[10px] text-[#a08d80]">30 Missions Done</div>
            </div>

            {/* Step 2: Learning Signals */}
            <div className="bg-[#221f1c] border border-[#534439] p-4 rounded-xl shadow space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#383430] flex items-center justify-center text-[#ffc499] mx-auto">
                <span className="material-symbols-outlined text-lg">analytics</span>
              </div>
              <div className="text-xs font-bold text-[#e9e1dc]">Learning Signals</div>
              <div className="text-[10px] text-[#f4a261]">Day 29 Anomaly</div>
            </div>

            {/* Step 3: AI Interviewer Core (Hub with Audio Wave) */}
            <div className="bg-gradient-to-b from-[#2b2723] to-[#1c1815] border-2 border-[#ffc499] p-5 rounded-2xl shadow-xl space-y-3 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffc499] text-[#161310] font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                AI Engine
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ffc499]/20 flex items-center justify-center text-[#ffc499] mx-auto pulse-dot">
                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
              </div>
              <div className="text-xs font-black text-[#e9e1dc]">Adaptive AI Interviewer</div>
              <div className="flex justify-center items-center gap-1">
                <span className="w-1 h-3 bg-[#ffc499] rounded animate-bounce"></span>
                <span className="w-1 h-5 bg-[#f4a261] rounded animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-2 bg-[#ffc499] rounded animate-bounce [animation-delay:0.4s]"></span>
                <span className="w-1 h-4 bg-[#f4a261] rounded animate-bounce [animation-delay:0.1s]"></span>
              </div>
            </div>

            {/* Step 4: Adaptive Questions */}
            <div className="bg-[#221f1c] border border-[#534439] p-4 rounded-xl shadow space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#383430] flex items-center justify-center text-[#ffc499] mx-auto">
                <span className="material-symbols-outlined text-lg">quiz</span>
              </div>
              <div className="text-xs font-bold text-[#e9e1dc]">Adaptive Probe</div>
              <div className="text-[10px] text-[#a08d80]">Real-Time Branching</div>
            </div>

            {/* Step 5: Technical Feedback */}
            <div className="bg-[#221f1c] border border-[#534439] p-4 rounded-xl shadow space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#383430] flex items-center justify-center text-[#ffc499] mx-auto">
                <span className="material-symbols-outlined text-lg">grade</span>
              </div>
              <div className="text-xs font-bold text-[#e9e1dc]">Report & Scores</div>
              <div className="text-[10px] text-emerald-400">5 Competencies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bento Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-[#e9e1dc] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffc499]">verified</span>
          Engineered for Technical Depth
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-3 tech-glow">
            <div className="w-10 h-10 rounded-xl bg-[#383430] flex items-center justify-center text-[#ffc499]">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <h4 className="text-base font-bold text-[#e9e1dc]">Adaptive Interviews</h4>
            <p className="text-xs text-[#d8c2b5] leading-relaxed">
              Dynamically branches question difficulty based on the candidate's initial answers. Strong answers unlock architecture challenges; gaps trigger fundamental drills.
            </p>
          </div>

          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-3 tech-glow">
            <div className="w-10 h-10 rounded-xl bg-[#383430] flex items-center justify-center text-[#ffc499]">
              <span className="material-symbols-outlined text-xl">folder_managed</span>
            </div>
            <h4 className="text-base font-bold text-[#e9e1dc]">Cohort-Aware Context</h4>
            <p className="text-xs text-[#d8c2b5] leading-relaxed">
              Incorporate 31 days of commit history, module pass rates, and skipped exercises into the agent's memory for hyper-targeted technical probing.
            </p>
          </div>

          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-3 tech-glow">
            <div className="w-10 h-10 rounded-xl bg-[#383430] flex items-center justify-center text-[#ffc499]">
              <span className="material-symbols-outlined text-xl">insights</span>
            </div>
            <h4 className="text-base font-bold text-[#e9e1dc]">Actionable Feedback</h4>
            <p className="text-xs text-[#d8c2b5] leading-relaxed">
              Receive a comprehensive post-interview assessment report with 5 core domain scorecards, strengths, conceptual gaps, and direct curriculum links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
