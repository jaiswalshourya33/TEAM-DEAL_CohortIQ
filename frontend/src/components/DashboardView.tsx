import React, { useState } from 'react';
import { CandidateProfile } from '@/types';

interface DashboardViewProps {
  candidates: CandidateProfile[];
  onSelectCandidate: (candidate: CandidateProfile) => void;
  onNavigateToCandidate: () => void;
  onNavigateToInterview: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  candidates,
  onSelectCandidate,
  onNavigateToCandidate,
  onNavigateToInterview
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate cohort metrics
  const totalCandidates = candidates.length;
  const avgCohortScore = Math.round(
    candidates.reduce((acc, c) => {
      const passed = c.missions ? c.missions.filter(m => m.passed).length : (c.signals.missionsCompleted || 30);
      return acc + (passed / 31) * 100;
    }, 0) / totalCandidates
  );

  const totalInterviews = 24;
  const topPerformers = candidates.filter(c => {
    const passed = c.missions ? c.missions.filter(m => m.passed).length : 30;
    return (passed / 31) >= 0.9;
  }).length;

  const filteredCandidates = candidates.filter(c => {
    const matchesRole = roleFilter === 'all' || c.member.jobRole.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesSearch = c.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.member.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.member.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Modules summary
  const moduleHealth = [
    { name: "Embeddings & Vector Search", days: "Days 1-9", passRate: "92%", status: "Strong" },
    { name: "RAG & Context Windows", days: "Days 10-11", passRate: "88%", status: "Strong" },
    { name: "Prompting & Structured Output", days: "Days 12-13", passRate: "79%", status: "Moderate" },
    { name: "Fine-Tuning (LoRA)", days: "Days 14-15", passRate: "71%", status: "Needs Review" },
    { name: "Agentic Workflows & MCP", days: "Days 21-23", passRate: "85%", status: "Strong" },
    { name: "Security & Guardrails", days: "Day 27", passRate: "65%", status: "High Risk" },
    { name: "Docker & K8s Deployment", days: "Day 28", passRate: "68%", status: "High Risk" },
    { name: "Observability & Tracing", days: "Day 29", passRate: "54%", status: "Critical Focus" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#221f1c] via-[#2a221a] to-[#1c1815] border border-[#534439] rounded-3xl p-6 sm:p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#f4a261]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#383430] border border-[#534439] px-3 py-1 rounded-full text-xs font-bold text-[#ffc499]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            AI Engineering Cohort #4 • Live Analytics
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#e9e1dc] tracking-tight">
            Cohort Talent Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#d8c2b5] leading-relaxed">
            Monitor candidate progress, identify system architecture knowledge gaps, and launch targeted AI technical interviews.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto relative z-10 shrink-0 max-w-full">
          <button
            onClick={onNavigateToInterview}
            className="flex-1 sm:flex-none bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] font-extrabold px-4 sm:px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">forum</span>
            <span>Launch AI Interview</span>
          </button>
          <button
            onClick={onNavigateToCandidate}
            className="flex-1 sm:flex-none bg-[#221f1c] hover:bg-[#383430] text-[#e9e1dc] font-bold px-4 sm:px-5 py-3 rounded-xl border border-[#534439] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">person_search</span>
            <span>Inspect Candidates</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1c1815] border border-[#534439] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-[#a08d80]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Candidates</span>
            <span className="material-symbols-outlined text-lg text-[#ffc499]">group</span>
          </div>
          <div className="text-3xl font-black text-[#e9e1dc]">{totalCandidates}</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>100% active in cohort</span>
          </div>
        </div>

        <div className="bg-[#1c1815] border border-[#534439] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-[#a08d80]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Cohort Completion</span>
            <span className="material-symbols-outlined text-lg text-[#f4a261]">verified</span>
          </div>
          <div className="text-3xl font-black text-[#ffc499]">{avgCohortScore}%</div>
          <div className="text-[10px] text-[#a08d80]">31 modules evaluated</div>
        </div>

        <div className="bg-[#1c1815] border border-[#534439] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-[#a08d80]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Tier Engineers</span>
            <span className="material-symbols-outlined text-lg text-emerald-400">workspace_premium</span>
          </div>
          <div className="text-3xl font-black text-emerald-400">{topPerformers}</div>
          <div className="text-[10px] text-[#a08d80]">≥90% module pass rate</div>
        </div>

        <div className="bg-[#1c1815] border border-[#534439] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-[#a08d80]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews Completed</span>
            <span className="material-symbols-outlined text-lg text-[#ffc499]">analytics</span>
          </div>
          <div className="text-3xl font-black text-[#e9e1dc]">{totalInterviews}</div>
          <div className="text-[10px] text-[#f4a261]">AI Probing Sessions</div>
        </div>
      </div>

      {/* Main Grid: Candidate Roster & Module Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidate Table (2 Cols) */}
        <div className="lg:col-span-2 bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#e9e1dc] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc499]">badge</span>
                Cohort Candidates
              </h3>
              <p className="text-xs text-[#a08d80]">Select a candidate to view intelligence or start their assessment</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search name/role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#161310] border border-[#383430] rounded-xl px-3 py-1.5 text-xs text-[#e9e1dc] placeholder-[#a08d80] focus:outline-none focus:border-[#ffc499]"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#161310] border border-[#383430] rounded-xl px-3 py-1.5 text-xs text-[#e9e1dc] focus:outline-none focus:border-[#ffc499]"
              >
                <option value="all">All Roles</option>
                <option value="data">Data Engineer</option>
                <option value="backend">Backend</option>
                <option value="ai">AI / ML</option>
                <option value="devops">DevOps</option>
              </select>
            </div>
          </div>

          {/* Roster List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredCandidates.map((cand) => {
              const passedMissions = cand.missions ? cand.missions.filter(m => m.passed).length : 30;
              const pct = Math.round((passedMissions / 31) * 100);
              const isCritical = pct < 70;

              return (
                <div
                  key={cand.member.id}
                  onClick={() => {
                    onSelectCandidate(cand);
                    onNavigateToCandidate();
                  }}
                  className="group bg-[#221f1c] hover:bg-[#2b2723] border border-[#383430] hover:border-[#ffc499]/50 p-4 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.member.avatarUrl}
                      alt={cand.member.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#534439]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#e9e1dc] group-hover:text-[#ffc499] transition-colors">
                          {cand.member.name}
                        </span>
                        <span className="text-[10px] text-[#a08d80] font-mono">({cand.member.id})</span>
                      </div>
                      <div className="text-xs text-[#a08d80]">
                        {cand.member.jobRole} • {cand.member.yearsExperience} yrs exp
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Completion Score */}
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#e9e1dc]">{pct}% Cohort</div>
                      <div className="w-24 bg-[#161310] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${isCritical ? 'bg-amber-500' : 'bg-emerald-400'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                        cand.member.status === 'ACTIVE_PARTICIPANT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#383430] text-[#d8c2b5] border-[#534439]'
                      }`}>
                        {cand.member.status.replace('_', ' ')}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(cand);
                          onNavigateToInterview();
                        }}
                        className="bg-[#f4a261]/10 hover:bg-[#f4a261] text-[#f4a261] hover:text-[#161310] p-2 rounded-lg border border-[#f4a261]/30 transition-all"
                        title="Start Interview with this Candidate"
                      >
                        <span className="material-symbols-outlined text-sm">forum</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cohort Module Health Panel (1 Col) */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#e9e1dc] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc499]">donut_large</span>
              Cohort Module Health
            </h3>
            <p className="text-xs text-[#a08d80]">Pass rate across 31-day curriculum nodes</p>
          </div>

          <div className="space-y-3">
            {moduleHealth.map((mod, idx) => (
              <div key={idx} className="bg-[#221f1c] border border-[#383430] p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#e9e1dc]">{mod.name}</span>
                  <span className="font-mono text-[#ffc499]">{mod.passRate}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#a08d80]">
                  <span>{mod.days}</span>
                  <span className={`font-semibold ${
                    mod.status === 'Critical Focus' || mod.status === 'High Risk' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {mod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
