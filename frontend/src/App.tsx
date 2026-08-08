import React, { useState } from 'react';
import { CANDIDATES_DATA } from '@/data/candidates';
import { CandidateProfile, InterviewFeedback, InterviewMessage } from '@/types';
import { TopNav } from '@/components/TopNav';
import { SidebarNav } from '@/components/SidebarNav';
import { DashboardView } from '@/components/DashboardView';
import { CandidateIntelligenceView } from '@/components/CandidateIntelligenceView';
import { InterviewsLandingView } from '@/components/InterviewsLandingView';
import { InterviewSetupView } from '@/components/InterviewSetupView';
import { InterviewRoomView } from '@/components/InterviewRoomView';
import { AssessmentReportView } from '@/components/AssessmentReportView';

export default function App() {
  const [candidates] = useState<CandidateProfile[]>(CANDIDATES_DATA);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile>(CANDIDATES_DATA[0]);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'candidates' | 'interviews' | 'analytics'>('dashboard');
  // Internal View State
  const [activeView, setActiveView] = useState<'dashboard' | 'candidate' | 'interviews' | 'setup' | 'room' | 'report'>('dashboard');

  // Completed Session Data stored per candidate ID
  const [candidateFeedbacks, setCandidateFeedbacks] = useState<Record<string, InterviewFeedback>>({});
  const [candidateTranscripts, setCandidateTranscripts] = useState<Record<string, InterviewMessage[]>>({});

  const handleTabChange = (tab: 'dashboard' | 'candidates' | 'interviews' | 'analytics') => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      setActiveView('dashboard');
    } else if (tab === 'candidates') {
      setActiveView('candidate');
    } else if (tab === 'interviews') {
      setActiveView('interviews');
    } else if (tab === 'analytics') {
      setActiveView('report');
    }
  };

  const handleSidebarNavigate = (view: string) => {
    if (view === 'dashboard') {
      setActiveTab('dashboard');
      setActiveView('dashboard');
    } else if (view === 'candidate') {
      setActiveTab('candidates');
      setActiveView('candidate');
    } else if (view === 'interviews') {
      setActiveTab('interviews');
      setActiveView('interviews');
    } else if (view === 'setup') {
      setActiveView('setup');
    } else if (view === 'room') {
      setActiveView('room');
    } else if (view === 'report') {
      setActiveTab('analytics');
      setActiveView('report');
    }
  };

  const handleFinishInterview = (feedback?: InterviewFeedback, transcript?: InterviewMessage[]) => {
    if (feedback) {
      setCandidateFeedbacks(prev => ({ ...prev, [selectedCandidate.member.id]: feedback }));
    }
    if (transcript) {
      setCandidateTranscripts(prev => ({ ...prev, [selectedCandidate.member.id]: transcript }));
    }
    setActiveView('report');
    setActiveTab('analytics');
  };

  return (
    <div className="min-h-screen bg-[#161310] text-[#e9e1dc] flex flex-col font-body">
      {/* Top Header */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        selectedCandidate={selectedCandidate}
        onSelectCandidate={(cand) => setSelectedCandidate(cand)}
        allCandidates={candidates}
      />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <SidebarNav
          activeView={activeView}
          onNavigate={handleSidebarNavigate}
          candidateName={selectedCandidate.member.name}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeView === 'dashboard' && (
            <DashboardView
              candidates={candidates}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              onNavigateToCandidate={() => {
                setActiveTab('candidates');
                setActiveView('candidate');
              }}
              onNavigateToInterview={() => {
                setActiveTab('interviews');
                setActiveView('setup');
              }}
            />
          )}

          {activeView === 'candidate' && (
            <CandidateIntelligenceView
              candidate={selectedCandidate}
              onProceedToSetup={() => setActiveView('setup')}
            />
          )}

          {activeView === 'interviews' && (
            <InterviewsLandingView
              candidate={selectedCandidate}
              onStartInterview={() => setActiveView('setup')}
            />
          )}

          {activeView === 'setup' && (
            <InterviewSetupView
              candidate={selectedCandidate}
              onBeginInterview={() => setActiveView('room')}
              onReturnToDashboard={() => setActiveView('candidate')}
            />
          )}

          {activeView === 'room' && (
            <InterviewRoomView
              candidate={selectedCandidate}
              onFinishInterview={handleFinishInterview}
              onExitSession={() => setActiveView('candidate')}
            />
          )}

          {activeView === 'report' && (
            <AssessmentReportView
              candidate={selectedCandidate}
              feedback={candidateFeedbacks[selectedCandidate.member.id]}
              transcript={candidateTranscripts[selectedCandidate.member.id]}
              onRestartSession={() => setActiveView('setup')}
              onReturnToProfile={() => setActiveView('candidate')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
