import React from 'react';
import { CandidateProfile } from '@/types';
import { CandidateAvatar } from './CandidateAvatar';
import { CohortIQLogo } from './CohortIQLogo';
import LiquidEther from './LiquidEther';

interface WelcomeViewProps {
  onEnter: () => void;
  candidates: CandidateProfile[];
  onSelectCandidate: (cand: CandidateProfile) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onEnter,
  candidates,
  onSelectCandidate,
  theme,
  onToggleTheme
}) => {
  const topCandidates = candidates.slice(0, 3);
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen w-full flex flex-col font-body relative transition-colors duration-200 ${
      isLight ? 'bg-[#f0f4f9] text-[#0f172a] selection:bg-blue-200' : 'bg-[#161310] text-[#e9e1dc] selection:bg-[#ffc499]/30'
    }`}>
      {/* Background Interactive Layer (Contained to prevent side scroll) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute inset-0 z-0 pointer-events-auto transition-opacity duration-300 ${
          isLight ? 'opacity-40' : 'opacity-75'
        }`}>
          <LiquidEther
            colors={isLight 
              ? ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'] 
              : ['#ffc499', '#f4a261', '#e76f51']
            }
            mouseForce={10}
            cursorSize={120}
            isViscous={true}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={1.1}
            autoIntensity={2.8}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Dynamic Ambient Background Glows */}
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-blue-400/10' : 'bg-[#f4a261]/15'
        }`} />
        <div className={`absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full blur-[120px] pointer-events-none ${
          isLight ? 'bg-sky-400/10' : 'bg-[#ffc499]/10'
        }`} />
        <div className={`absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-indigo-300/15' : 'bg-[#2a221a]/80'
        }`} />
      </div>

      {/* Top Header Bar */}
      <header className={`w-full border-b sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm backdrop-blur-md ${
        isLight 
          ? 'bg-white/85 border-slate-200/80 text-slate-900' 
          : 'bg-[#161310]/95 border-[#383430]/70 text-[#e9e1dc]'
      }`}>
        <CohortIQLogo
          theme={theme}
          size="md"
          showBadge={true}
          showSubtitle={true}
        />

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-medium cursor-pointer ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-slate-300 shadow-sm' 
                : 'bg-[#1c1815] border-[#383430] text-[#d8c2b5] hover:text-[#ffc499] hover:border-[#534439]'
            }`}
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-lg">
              {isLight ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="hidden md:inline">{isLight ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Quick Start Top CTA */}
          <button
            onClick={onEnter}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] ${
              isLight 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25' 
                : 'bg-gradient-to-r from-[#ffc499] to-[#f4a261] text-[#161310] hover:shadow-[#ffc499]/25'
            }`}
          >
            <span>Open Main Page</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Main Start Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center gap-16 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold shadow-inner ${
            isLight 
              ? 'bg-blue-50/90 border-blue-200 text-blue-700' 
              : 'bg-[#2a221a] border-[#534439] text-[#ffc499]'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-ping ${isLight ? 'bg-blue-600' : 'bg-[#f4a261]'}`} />
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Next-Generation Technical Recruitment Engine</span>
          </div>

          <h1 className={`font-header text-4xl sm:text-6xl font-black tracking-tight leading-tight ${
            isLight ? 'text-slate-900' : 'text-[#e9e1dc]'
          }`}>
            Assess Engineers with <br className="hidden sm:inline" />
            <span className={`text-transparent bg-clip-text ${
              isLight 
                ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500' 
                : 'bg-gradient-to-r from-[#ffc499] via-[#f4a261] to-[#e76f51]'
            }`}>
              Precision AI Intelligence
            </span>
          </h1>

          <p className={`text-base sm:text-xl leading-relaxed max-w-3xl mx-auto font-normal ${
            isLight ? 'text-slate-600' : 'text-[#d8c2b5]'
          }`}>
            CohortIQ combines 360° candidate behavioral metrics, hands-on curriculum signals, and real-time AI audio technical interviews into one seamless platform.
          </p>

          {/* PRIMARY ENTER BUTTON & ACTIONS */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={onEnter}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group border ${
                isLight 
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white border-blue-400/30 shadow-blue-500/25 hover:shadow-blue-500/40' 
                  : 'bg-gradient-to-r from-[#ffc499] via-[#f4a261] to-[#e76f51] text-[#161310] border-white/20 shadow-[#ffc499]/25 hover:shadow-[#ffc499]/40'
              }`}
            >
              <span className="tracking-wide">ENTER MAIN APPLICATION</span>
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">
                east
              </span>
            </button>

            <button
              onClick={() => {
                if (candidates[0]) onSelectCandidate(candidates[0]);
                onEnter();
              }}
              className={`w-full sm:w-auto px-7 py-4 rounded-2xl border font-semibold text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm ${
                isLight 
                  ? 'bg-white/90 border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-blue-400' 
                  : 'bg-[#1c1815]/80 border-[#534439] text-[#e9e1dc] hover:bg-[#221f1c] hover:border-[#ffc499]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isLight ? 'text-blue-600' : 'text-[#ffc499]'}`}>explore</span>
              <span>Browse Candidates</span>
            </button>
          </div>
        </div>

        {/* PLATFORM HIGHLIGHT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 transition-all ${
            isLight 
              ? 'bg-white/90 border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' 
              : 'bg-gradient-to-b from-[#1c1815] to-[#191512] border-[#383430] hover:border-[#ffc499]/40 tech-glow'
          }`}>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
              isLight 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-[#ffc499]/10 border-[#ffc499]/20 text-[#ffc499]'
            }`}>
              <span className="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <h3 className={`font-header text-xl font-bold ${isLight ? 'text-slate-900' : 'text-[#e9e1dc]'}`}>
              Candidate Intelligence
            </h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a08d80]'}`}>
              Deep analytics on candidate coding speed, mission pass rates, first-try completion ratios, and technical domain strength.
            </p>
            <div className={`pt-2 text-xs font-semibold flex items-center gap-1 ${isLight ? 'text-blue-600' : 'text-[#ffc499]'}`}>
              <span>View Cohort Signals</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 transition-all ${
            isLight 
              ? 'bg-white/90 border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' 
              : 'bg-gradient-to-b from-[#1c1815] to-[#191512] border-[#383430] hover:border-[#ffc499]/40 tech-glow'
          }`}>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
              isLight 
                ? 'bg-amber-50 border-amber-200 text-amber-600' 
                : 'bg-[#f4a261]/10 border-[#f4a261]/20 text-[#f4a261]'
            }`}>
              <span className="material-symbols-outlined text-2xl">record_voice_over</span>
            </div>
            <h3 className={`font-header text-xl font-bold ${isLight ? 'text-slate-900' : 'text-[#e9e1dc]'}`}>
              Live AI Interviewer
            </h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a08d80]'}`}>
              Conduct real-time interactive technical interviews with AI audio speech, code execution sandboxes, and adaptive probing questions.
            </p>
            <div className={`pt-2 text-xs font-semibold flex items-center gap-1 ${isLight ? 'text-amber-600' : 'text-[#f4a261]'}`}>
              <span>Interactive Session</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 transition-all ${
            isLight 
              ? 'bg-white/90 border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' 
              : 'bg-gradient-to-b from-[#1c1815] to-[#191512] border-[#383430] hover:border-[#ffc499]/40 tech-glow'
          }`}>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
              isLight 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                : 'bg-[#e76f51]/10 border-[#e76f51]/20 text-[#e76f51]'
            }`}>
              <span className="material-symbols-outlined text-2xl">assessment</span>
            </div>
            <h3 className={`font-header text-xl font-bold ${isLight ? 'text-slate-900' : 'text-[#e9e1dc]'}`}>
              Assessment Reports
            </h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a08d80]'}`}>
              Instant comprehensive hiring reports detailing execution efficiency, code quality metrics, technical risks, and interview transcripts.
            </p>
            <div className={`pt-2 text-xs font-semibold flex items-center gap-1 ${isLight ? 'text-emerald-600' : 'text-[#e76f51]'}`}>
              <span>Exportable Analytics</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </div>
          </div>
        </div>

        {/* FEATURED CANDIDATES QUICK SELECT */}
        <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-md ${
          isLight 
            ? 'bg-white/95 border-slate-200 text-slate-900' 
            : 'bg-[#1c1815]/90 border-[#383430] text-[#e9e1dc]'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-header text-2xl font-bold flex items-center gap-2">
                <span className={`material-symbols-outlined ${isLight ? 'text-blue-600' : 'text-[#ffc499]'}`}>group</span>
                <span>Active Candidates in Pool</span>
              </h2>
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>
                Select a candidate to review their profile or launch their live interview evaluation directly.
              </p>
            </div>
            <button
              onClick={onEnter}
              className={`text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer ${
                isLight ? 'text-blue-600' : 'text-[#ffc499]'
              }`}
            >
              <span>View All {candidates.length} Candidates</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topCandidates.map((cand) => (
              <div
                key={cand.member.id}
                onClick={() => {
                  onSelectCandidate(cand);
                  onEnter();
                }}
                className={`border rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-4 group ${
                  isLight 
                    ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900 hover:border-blue-300' 
                    : 'bg-[#221f1c] hover:bg-[#2b2723] border-[#383430] text-[#e9e1dc] hover:border-[#ffc499]/50'
                }`}
              >
                <CandidateAvatar
                  name={cand.member.name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate transition-colors ${
                    isLight ? 'group-hover:text-blue-600 text-slate-900' : 'group-hover:text-[#ffc499] text-[#e9e1dc]'
                  }`}>
                    {cand.member.name}
                  </h4>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>
                    {cand.member.jobRole}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-mono font-semibold ${
                      isLight 
                        ? 'bg-blue-100/70 text-blue-700' 
                        : 'bg-[#ffc499]/10 text-[#ffc499]'
                    }`}>
                      {cand.signals?.missionsCompleted ?? 28}/31 Modules
                    </span>
                  </div>
                </div>
                <span className={`material-symbols-outlined group-hover:translate-x-1 transition-all ${
                  isLight ? 'text-slate-400 group-hover:text-blue-600' : 'text-[#a08d80] group-hover:text-[#ffc499]'
                }`}>
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* METRICS BANNER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className={`p-4 rounded-2xl border shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#1c1815] border-[#383430]'
          }`}>
            <p className={`text-2xl sm:text-3xl font-black font-header ${isLight ? 'text-blue-600' : 'text-[#ffc499]'}`}>31</p>
            <p className={`text-xs uppercase tracking-wider mt-1 font-semibold ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>Evaluation Modules</p>
          </div>
          <div className={`p-4 rounded-2xl border shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#1c1815] border-[#383430]'
          }`}>
            <p className={`text-2xl sm:text-3xl font-black font-header ${isLight ? 'text-amber-600' : 'text-[#f4a261]'}`}>Real-time</p>
            <p className={`text-xs uppercase tracking-wider mt-1 font-semibold ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>AI Voice & Code Sandbox</p>
          </div>
          <div className={`p-4 rounded-2xl border shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#1c1815] border-[#383430]'
          }`}>
            <p className={`text-2xl sm:text-3xl font-black font-header ${isLight ? 'text-indigo-600' : 'text-[#e76f51]'}`}>360°</p>
            <p className={`text-xs uppercase tracking-wider mt-1 font-semibold ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>Behavioral Signals</p>
          </div>
          <div className={`p-4 rounded-2xl border shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#1c1815] border-[#383430]'
          }`}>
            <p className={`text-2xl sm:text-3xl font-black font-header ${isLight ? 'text-emerald-600' : 'text-[#ffc499]'}`}>100%</p>
            <p className={`text-xs uppercase tracking-wider mt-1 font-semibold ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>Automated Insights</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className={`w-full border-t py-6 px-6 text-center text-xs ${
        isLight ? 'bg-white/80 border-slate-200 text-slate-500' : 'bg-[#161310] border-[#383430]/70 text-[#a08d80]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CohortIQ. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onEnter} className={`hover:underline transition-colors cursor-pointer ${
              isLight ? 'text-blue-600' : 'text-[#ffc499]'
            }`}>
              Launch Platform
            </button>
            <span>•</span>
            <span>Enterprise Tech Assessment</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
