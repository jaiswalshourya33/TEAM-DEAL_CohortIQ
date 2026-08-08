import React, { useState } from 'react';
import { CandidateProfile, InterviewFeedback, InterviewMessage } from '@/types';
import { getCandidateReport } from '@/data/candidateReports';
import { CandidateAvatar } from './CandidateAvatar';

interface AssessmentReportViewProps {
  candidate: CandidateProfile;
  feedback?: InterviewFeedback;
  transcript?: InterviewMessage[];
  onRestartSession: () => void;
  onReturnToProfile: () => void;
}

export const AssessmentReportView: React.FC<AssessmentReportViewProps> = ({
  candidate,
  feedback,
  transcript,
  onRestartSession,
  onReturnToProfile
}) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLinkToast, setCopiedLinkToast] = useState(false);
  const [copiedSummaryToast, setCopiedSummaryToast] = useState(false);

  // Retrieve candidate-specific assessment data (live interview feedback takes priority if present)
  const activeReport = getCandidateReport(candidate, feedback, transcript);
  const report = activeReport.feedback;
  const activeTranscript = activeReport.transcript;

  const scores = report.scores || {
    overall: 75,
    technicalUnderstanding: 75,
    depthOfReasoning: 75,
    systemDesign: 75,
    practicalApplication: 75,
    communication: 75
  };

  const shareableUrl = typeof window !== 'undefined' ? `${window.location.origin}/report/${candidate.member.id}` : `https://cohortiq.dev/report/${candidate.member.id}`;

  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl).then(() => {
        setCopiedLinkToast(true);
        setTimeout(() => setCopiedLinkToast(false), 2500);
      }).catch(() => {});
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl).then(() => {
        setCopiedLinkToast(true);
        setTimeout(() => setCopiedLinkToast(false), 2500);
      });
    }
  };

  const handleCopySummary = () => {
    const summaryText = `CohortIQ Assessment Report for ${candidate.member.name} (${candidate.member.jobRole})\nOverall Score: ${scores.overall}/100 - ${scores.overall >= 80 ? 'Strong Competency (Recommended for Hire)' : 'Moderate Competency'}\n\nSummary:\n${report.summary}\n\nKey Strengths:\n${report.strengths.map(s => `- ${s}`).join('\n')}\n\nReport Link: ${shareableUrl}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopiedSummaryToast(true);
        setTimeout(() => setCopiedSummaryToast(false), 2500);
      });
    }
  };

  const handlePrintReport = () => {
    setIsShareModalOpen(false);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 150);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 print-report-area">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#383430] pb-4">
        <div>
          <button
            onClick={onReturnToProfile}
            className="text-xs font-semibold text-[#a08d80] hover:text-[#ffc499] transition-colors flex items-center gap-1 mb-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Candidate Profile
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e9e1dc]">
            Assessment Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenShareModal}
            className="bg-[#221f1c] hover:bg-[#383430] text-[#e9e1dc] text-xs font-semibold px-4 py-2 rounded-xl border border-[#534439] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>Share Report</span>
          </button>

          <button
            onClick={onRestartSession}
            className="bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* Hero Score Card */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 sm:p-8 relative overflow-hidden tech-glow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <CandidateAvatar name={candidate.member.name} size="lg" />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-0.5 rounded-full mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Assessment Completed
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#e9e1dc]">
                {candidate.member.name}
              </h2>
              <div className="text-xs text-[#a08d80] flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span>Role: {candidate.member.jobRole}</span>
                <span>•</span>
                <span>Candidate ID: {candidate.member.id}</span>
                <span>•</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Big Score Ring */}
          <div className="flex items-center gap-6 bg-[#221f1c] border border-[#534439] p-4 rounded-2xl">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center score-ring">
              <div className="w-20 h-20 rounded-full bg-[#1c1815] flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[#ffc499]">{scores.overall}</span>
                <span className="text-[9px] text-[#a08d80] uppercase">/ 100</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#a08d80] uppercase mb-1">Overall Assessment</div>
              <div className="text-sm font-bold text-[#e9e1dc]">Strong Competency</div>
              <div className="text-xs text-emerald-400 font-medium">Recommended for Hire</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Domain ScoreCards Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#e9e1dc] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffc499]">fact_check</span>
          Technical Competency Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#1c1815] border border-[#534439] p-4 rounded-xl text-center space-y-1">
            <div className="text-[10px] font-bold text-[#a08d80] uppercase">Technical Understanding</div>
            <div className="text-2xl font-black text-[#ffc499]">{scores.technicalUnderstanding}</div>
            <div className="text-[10px] text-[#a08d80]">Out of 100</div>
          </div>

          <div className="bg-[#1c1815] border border-[#534439] p-4 rounded-xl text-center space-y-1">
            <div className="text-[10px] font-bold text-[#a08d80] uppercase">Depth of Reasoning</div>
            <div className="text-2xl font-black text-[#ffc499]">{scores.depthOfReasoning}</div>
            <div className="text-[10px] text-[#a08d80]">Out of 100</div>
          </div>

          <div className="bg-[#1c1815] border border-[#534439] p-4 rounded-xl text-center space-y-1">
            <div className="text-[10px] font-bold text-[#a08d80] uppercase">System Design</div>
            <div className="text-2xl font-black text-[#f4a261]">{scores.systemDesign}</div>
            <div className="text-[10px] text-[#a08d80]">Out of 100</div>
          </div>

          <div className="bg-[#1c1815] border border-[#534439] p-4 rounded-xl text-center space-y-1">
            <div className="text-[10px] font-bold text-[#a08d80] uppercase">Practical Application</div>
            <div className="text-2xl font-black text-[#ffc499]">{scores.practicalApplication}</div>
            <div className="text-[10px] text-[#a08d80]">Out of 100</div>
          </div>

          <div className="bg-[#1c1815] border border-[#534439] p-4 rounded-xl text-center space-y-1">
            <div className="text-[10px] font-bold text-[#a08d80] uppercase">Communication</div>
            <div className="text-2xl font-black text-[#ffc499]">{scores.communication}</div>
            <div className="text-[10px] text-[#a08d80]">Out of 100</div>
          </div>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-3">
        <div className="text-xs font-bold text-[#a08d80] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffc499] text-base">description</span>
          Executive Summary
        </div>
        <p className="text-sm text-[#d8c2b5] leading-relaxed">
          {report.summary}
        </p>
      </div>

      {/* Strengths, Gaps, and Next Steps Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="material-symbols-outlined">thumb_up</span>
            <h4 className="text-base font-bold text-[#e9e1dc]">Key Strengths</h4>
          </div>

          <div className="space-y-3">
            {report.strengths.map((str, idx) => (
              <div key={idx} className="bg-[#221f1c] border border-[#383430] p-3 rounded-xl text-xs text-[#d8c2b5] flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5">check_circle</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#f4a261]">
            <span className="material-symbols-outlined">warning</span>
            <h4 className="text-base font-bold text-[#e9e1dc]">Areas for Improvement</h4>
          </div>

          <div className="space-y-3">
            {report.gaps.map((gap, idx) => (
              <div key={idx} className="bg-[#2a221a] border border-[#f4a261]/30 p-3 rounded-xl text-xs text-[#d8c2b5] flex items-start gap-2">
                <span className="material-symbols-outlined text-[#f4a261] text-sm mt-0.5">error</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#ffc499]">
            <span className="material-symbols-outlined">auto_stories</span>
            <h4 className="text-base font-bold text-[#e9e1dc]">Recommended Next Steps</h4>
          </div>

          <div className="space-y-3">
            {report.next.map((nxt, idx) => (
              <div key={idx} className="bg-[#221f1c] border border-[#383430] p-3 rounded-xl text-xs text-[#d8c2b5] flex items-start gap-2">
                <span className="material-symbols-outlined text-[#ffc499] text-sm mt-0.5">arrow_right_alt</span>
                <span>{nxt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Accordion */}
      {activeTranscript && activeTranscript.length > 0 && (
        <div className="bg-[#1c1815] border border-[#534439] rounded-2xl overflow-hidden">
          <button
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-[#221f1c] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc499]">forum</span>
              <h3 className="text-base font-bold text-[#e9e1dc]">View Full Interview Transcript</h3>
            </div>
            <span className="material-symbols-outlined text-[#a08d80]">
              {isTranscriptOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isTranscriptOpen && (
            <div className="p-6 border-t border-[#383430] space-y-4 max-h-96 overflow-y-auto bg-[#161310]">
              {activeTranscript.map((msg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[11px] font-bold text-[#ffc499]">
                    {msg.sender === 'ai' ? 'Interviewer' : candidate.member.name} ({msg.timestamp}):
                  </div>
                  <p className="text-xs text-[#d8c2b5] bg-[#221f1c] p-3 rounded-xl border border-[#383430] whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onReturnToProfile}
          className="bg-[#221f1c] hover:bg-[#383430] text-[#e9e1dc] text-xs font-bold px-6 py-3 rounded-xl border border-[#534439] transition-colors cursor-pointer"
        >
          Return to Candidate Profile
        </button>

        <button
          onClick={onRestartSession}
          className="bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] text-xs font-extrabold px-8 py-3 rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Practice Next Interview</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Share Report Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1815] border border-[#534439] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#383430] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f4a261]/10 text-[#f4a261] border border-[#f4a261]/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">share</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#e9e1dc]">Share Assessment Report</h3>
                  <p className="text-xs text-[#a08d80]">{candidate.member.name} • {candidate.member.jobRole}</p>
                </div>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-[#a08d80] hover:text-[#e9e1dc] p-1.5 rounded-xl hover:bg-[#221f1c] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Score Highlight Card */}
            <div className="bg-[#221f1c] border border-[#383430] p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CandidateAvatar name={candidate.member.name} size="sm" />
                <div>
                  <div className="text-xs font-bold text-[#e9e1dc]">{candidate.member.name}</div>
                  <div className="text-[10px] text-[#a08d80]">Candidate ID: {candidate.member.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-[#ffc499]">{scores.overall} / 100</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Assessment Complete</div>
              </div>
            </div>

            {/* Link Input Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#d8c2b5] block">
                Shareable Candidate Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 bg-[#161310] border border-[#534439] rounded-xl px-3.5 py-2 text-xs font-mono text-[#ffc499] focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-[#f4a261] hover:bg-[#e76f51] text-[#161310] text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedLinkToast ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLinkToast ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleCopySummary}
                className="p-3 bg-[#221f1c] hover:bg-[#2b2723] border border-[#383430] hover:border-[#ffc499]/50 rounded-xl transition-all text-left space-y-1 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[#ffc499]">
                  <span className="material-symbols-outlined text-base">description</span>
                  {copiedSummaryToast && <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>}
                </div>
                <div className="text-xs font-bold text-[#e9e1dc] group-hover:text-[#ffc499] transition-colors">
                  Copy Summary
                </div>
                <div className="text-[10px] text-[#a08d80]">Formatted for Slack & Email</div>
              </button>

              <button
                onClick={handlePrintReport}
                className="p-3 bg-[#221f1c] hover:bg-[#2b2723] border border-[#383430] hover:border-[#ffc499]/50 rounded-xl transition-all text-left space-y-1 group cursor-pointer"
              >
                <div className="text-[#ffc499]">
                  <span className="material-symbols-outlined text-base">print</span>
                </div>
                <div className="text-xs font-bold text-[#e9e1dc] group-hover:text-[#ffc499] transition-colors">
                  Print / Export PDF
                </div>
                <div className="text-[10px] text-[#a08d80]">Save printer or PDF file</div>
              </button>

              <a
                href={`mailto:?subject=${encodeURIComponent(`CohortIQ Candidate Report: ${candidate.member.name}`)}&body=${encodeURIComponent(`Check out the assessment report for ${candidate.member.name}: ${shareableUrl}`)}`}
                className="p-3 bg-[#221f1c] hover:bg-[#2b2723] border border-[#383430] hover:border-[#ffc499]/50 rounded-xl transition-all text-left space-y-1 group block cursor-pointer"
              >
                <div className="text-[#ffc499]">
                  <span className="material-symbols-outlined text-base">mail</span>
                </div>
                <div className="text-xs font-bold text-[#e9e1dc] group-hover:text-[#ffc499] transition-colors">
                  Email Team
                </div>
                <div className="text-[10px] text-[#a08d80]">Send via default mail app</div>
              </a>
            </div>

            {/* Toast Notification */}
            {(copiedLinkToast || copiedSummaryToast) && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 animate-fade-in font-semibold">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{copiedLinkToast ? 'Report URL copied to clipboard!' : 'Executive summary copied to clipboard!'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
