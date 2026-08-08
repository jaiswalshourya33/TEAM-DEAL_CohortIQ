import React, { useState } from 'react';
import { CandidateProfile } from '@/types';
import { COHORT_MODULES } from '@/data/cohort';
import { AddNoteModal } from './AddNoteModal';

interface CandidateIntelligenceViewProps {
  candidate: CandidateProfile;
  onProceedToSetup: () => void;
}

export const CandidateIntelligenceView: React.FC<CandidateIntelligenceViewProps> = ({
  candidate,
  onProceedToSetup
}) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [customNotes, setCustomNotes] = useState<string[]>([]);

  // Dynamic assessment status calculations
  const totalMissions = 31;
  const passedMissions = candidate.missions ? candidate.missions.filter(m => m.passed).length : (candidate.signals.missionsCompleted || 30);
  const skippedMissions = candidate.missions ? candidate.missions.filter(m => m.skipped).length : Math.max(0, totalMissions - passedMissions);
  const cohortScorePercent = Math.round((passedMissions / totalMissions) * 100);

  const handleAddNote = (noteText: string) => {
    setCustomNotes(prev => [...prev, noteText]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#383430] pb-4">
        <div>
          <button className="text-xs font-semibold text-[#a08d80] hover:text-[#ffc499] transition-colors flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Pipeline
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e9e1dc] flex items-center gap-3">
            Candidate Intelligence
            <span className="text-xs font-medium bg-[#383430] text-[#ffc499] px-2.5 py-1 rounded-full border border-[#534439]">
              ID: {candidate.member.id}
            </span>
          </h1>
        </div>

        <button
          onClick={onProceedToSetup}
          className="bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>Continue to Interview Setup</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Main Hero Grid: Profile & Assessment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Profile Hero Card */}
        <div className="lg:col-span-2 bg-[#1c1815] border border-[#534439] rounded-2xl p-6 relative overflow-hidden tech-glow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc499]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={candidate.member.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCXG1I42ZZjZtFY0oR3jsr_m4znODLT1uMRX9zeSvpv4buzkj7lSvrRFOUTAUfjOtKg9xFNKkWOu87N0vacZI2X3wbiiGEYVYhUaJP6dZaIVjZ7gDrgx1v1aUjf7lhDQKTvxtPC8o3Y_0QX-oHFuH2PBkYX85tzPJzUn17GBbJZF6UboKAMfF5iIOIfSGofWKFyiU8IeSdBXyBXp0fXG_ZhZFCOh2Qw4N8x6d1QSYDUhTtq71QaRw5s"}
                alt={candidate.member.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#ffc499]"
              />
              <span className="absolute -bottom-2 -right-2 bg-[#f4a261] text-[#161310] font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                {candidate.signals.matchScore || 'Top 5% Match'}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-[#e9e1dc]">{candidate.member.name}</h2>
                <span className="bg-[#383430] text-[#f4a261] text-xs font-semibold px-2.5 py-0.5 rounded-md border border-[#534439]">
                  {candidate.member.jobRole}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#d8c2b5] pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffc499] text-base">work_history</span>
                  <span>{candidate.member.yearsExperience} Years Exp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffc499] text-base">school</span>
                  <span>{candidate.member.education}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffc499] text-base">location_on</span>
                  <span>Remote (EST)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Status Card */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#a08d80] uppercase tracking-wider">Assessment Status</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {candidate.member.status}
              </span>
            </div>
            <div className="text-3xl font-black text-[#e9e1dc] mb-1">{cohortScorePercent}%</div>
            <div className="text-xs text-[#a08d80] mb-4">Overall Cohort Execution Score</div>

            {/* Progress Bar */}
            <div className="w-full bg-[#383430] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#f4a261] to-[#ffc499] h-full rounded-full transition-all duration-500"
                style={{ width: `${cohortScorePercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#383430] flex justify-between items-center text-xs text-[#d8c2b5]">
            <span>{passedMissions} / {totalMissions} Modules Passed</span>
            <span className="text-[#ffc499] font-semibold">
              {skippedMissions > 0 ? `${skippedMissions} Skipped` : 'All Passed'}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#1c1815] border border-[#534439] rounded-xl p-4">
          <div className="text-xs text-[#a08d80] font-medium mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#ffc499]">calendar_today</span>
            Commit Days
          </div>
          <div className="text-xl font-bold text-[#e9e1dc]">
            {candidate.signals.commitDays} <span className="text-xs font-normal text-[#a08d80]">/ 31 Days</span>
          </div>
        </div>

        <div className="bg-[#1c1815] border border-[#534439] rounded-xl p-4">
          <div className="text-xs text-[#a08d80] font-medium mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#ffc499]">task_alt</span>
            Missions Completed
          </div>
          <div className="text-xl font-bold text-[#e9e1dc]">
            {candidate.signals.missionsCompleted} <span className="text-xs font-normal text-[#a08d80]">/ 31</span>
          </div>
        </div>

        <div className="bg-[#1c1815] border border-[#534439] rounded-xl p-4">
          <div className="text-xs text-[#a08d80] font-medium mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#ffc499]">stars</span>
            First-Try Success
          </div>
          <div className="text-xl font-bold text-[#e9e1dc]">
            {candidate.signals.missionsFirstTry} <span className="text-xs font-normal text-[#a08d80]">Missions</span>
          </div>
        </div>

        <div className="bg-[#1c1815] border border-[#534439] rounded-xl p-4">
          <div className="text-xs text-[#a08d80] font-medium mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#ffc499]">speed</span>
            Efficiency Score
          </div>
          <div className="text-xl font-bold text-[#f4a261]">
            {candidate.signals.efficiencyScore || 'High'}
          </div>
        </div>
      </div>

      {/* Bento Row: Learning Signals & Areas Worth Probing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Signals Card */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#ffc499] text-xl">psychology_alt</span>
            <h3 className="text-lg font-bold text-[#e9e1dc]">Learning Signals</h3>
          </div>

          <div className="space-y-3">
            {(candidate.learningSignals || [
              "High Consistency: Regular commit patterns across 28 active cohort days.",
              "Strong AI Fundamentals: Rapid mastery of embeddings and vector database search.",
              "Iterative Prompt Engineering: Refine system prompts through systematic trial.",
              "Production Focus: High attention to API security and schema validation."
            ]).map((signal, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#221f1c] p-3 rounded-xl border border-[#383430]">
                <span className="material-symbols-outlined text-emerald-400 text-lg mt-0.5">check_circle</span>
                <p className="text-xs sm:text-sm text-[#d8c2b5] leading-relaxed">{signal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas Worth Probing Card */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f4a261] text-xl">warning</span>
                <h3 className="text-lg font-bold text-[#e9e1dc]">Areas Worth Probing</h3>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="text-xs bg-[#383430] hover:bg-[#534439] text-[#ffc499] font-medium px-3 py-1.5 rounded-lg border border-[#534439] flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                Add Interview Note
              </button>
            </div>

            {/* Default Probe Area */}
            {candidate.probeAreas && candidate.probeAreas.length > 0 ? (
              candidate.probeAreas.map((probe, idx) => (
                <div key={idx} className="bg-[#2a221a] border border-[#f4a261]/30 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#f4a261] bg-[#f4a261]/10 px-2 py-0.5 rounded">
                      {probe.dayBadge || 'ANOMALY DETECTED'}
                    </span>
                    <span className="text-[10px] text-[#a08d80] uppercase tracking-wider">{probe.tag || 'Skipped Module'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#e9e1dc] mb-1">{probe.title}</h4>
                  <p className="text-xs text-[#d8c2b5] leading-relaxed">{probe.description}</p>
                </div>
              ))
            ) : (
              <div className="bg-[#2a221a] border border-[#f4a261]/30 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#f4a261] bg-[#f4a261]/10 px-2 py-0.5 rounded">
                    DAY 29 ANOMALY
                  </span>
                  <span className="text-[10px] text-[#a08d80] uppercase tracking-wider">Observability & Monitoring</span>
                </div>
                <h4 className="text-sm font-bold text-[#e9e1dc] mb-1">Production Monitoring & Logging Setup</h4>
                <p className="text-xs text-[#d8c2b5] leading-relaxed">
                  Candidate bypassed the core exercises for production monitoring setup. Recommend drilling down on logging strategies, metric instrumentation, and Prometheus alerting.
                </p>
              </div>
            )}

            {/* Custom Recruiter Notes */}
            {customNotes.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="text-xs font-bold text-[#ffc499]">Recruiter Interview Notes:</div>
                {customNotes.map((note, idx) => (
                  <div key={idx} className="bg-[#221f1c] border border-[#534439] rounded-lg p-2.5 text-xs text-[#d8c2b5] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#ffc499] text-sm mt-0.5">sticky_note_2</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#383430]">
            <p className="text-[11px] text-[#a08d80] italic">
              Note: This context is automatically injected into the AI Interview Agent's system prompt to generate tailored technical questions.
            </p>
          </div>
        </div>
      </div>

      {/* Cohort Curriculum Map Card */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#e9e1dc] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc499]">account_tree</span>
              Curriculum Execution Map
            </h3>
            <p className="text-xs text-[#a08d80]">8 Modules Analysed across 31 Cohort Days</p>
          </div>
          <span className="text-xs text-[#ffc499] font-mono bg-[#383430] px-3 py-1 rounded-full border border-[#534439]">
            Cohort Status: Active
          </span>
        </div>

        {/* Modules Horizontal Node List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {COHORT_MODULES.map((mod) => {
            const isSkippedMod = (candidate.missions && candidate.missions.some(m => m.skipped && mod.days.includes(m.day))) ||
              (candidate.probeAreas && candidate.probeAreas.some(p => mod.days.some(d => p.dayBadge?.includes(`DAY ${d}`)) || p.title.toLowerCase().includes(mod.title.toLowerCase())));
            return (
              <div
                key={mod.n}
                className={`p-4 rounded-xl border transition-all ${
                  isSkippedMod
                    ? 'bg-[#2a221a] border-[#f4a261]/50'
                    : 'bg-[#221f1c] border-[#383430] hover:border-[#ffc499]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#a08d80] font-mono">
                    MODULE 0{mod.n}
                  </span>
                  {isSkippedMod ? (
                    <span className="material-symbols-outlined text-[#f4a261] text-base" title="Anomaly Detected">
                      error
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-emerald-400 text-base">
                      check_circle
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#e9e1dc] line-clamp-1 mb-1">{mod.title}</h4>
                <div className="text-[10px] text-[#a08d80] flex justify-between items-center">
                  <span>Days: {mod.days.join(', ')}</span>
                  <span className={isSkippedMod ? 'text-[#f4a261] font-bold' : 'text-emerald-400'}>
                    {isSkippedMod ? 'Attention' : 'Passed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        candidateName={candidate.member.name}
        onAddNote={handleAddNote}
      />
    </div>
  );
};
