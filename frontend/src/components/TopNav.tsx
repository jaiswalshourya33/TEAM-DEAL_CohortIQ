import React, { useState } from 'react';
import { CandidateProfile } from '../types';
import { CandidateAvatar } from './CandidateAvatar';

interface TopNavProps {
  activeTab: 'dashboard' | 'candidates' | 'interviews' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'candidates' | 'interviews' | 'analytics') => void;
  selectedCandidate: CandidateProfile;
  onSelectCandidate: (candidate: CandidateProfile) => void;
  allCandidates: CandidateProfile[];
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  selectedCandidate,
  onSelectCandidate,
  allCandidates,
  theme = 'dark',
  onToggleTheme
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Assessment Report Generated",
      desc: "Sarah Johnson completed 20-min technical interview. Overall score: 88%.",
      time: "10 mins ago",
      type: "report",
      read: false
    },
    {
      id: 2,
      title: "Top 1% Cohort Score Alert",
      desc: "Emily Chen achieved 30 first-try completions in 31 days.",
      time: "1 hour ago",
      type: "alert",
      read: false
    },
    {
      id: 3,
      title: "Skipped Module Warning",
      desc: "David Miller skipped Day 28 Docker deployment module.",
      time: "2 hours ago",
      type: "warning",
      read: false
    }
  ]);

  // Settings State
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [interviewRigor, setInterviewRigor] = useState("adaptive");
  const [questionCount, setQuestionCount] = useState(8);
  const [audioVoiceEnabled, setAudioVoiceEnabled] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setShowSettings(false);
    }, 1200);
  };

  return (
    <header className="bg-[#161310]/95 backdrop-blur-md border-b border-[#383430] sticky top-0 z-50 w-full px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        {/* Left Section: Brand & Segmented Nav */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div 
            onClick={() => setActiveTab('candidates')} 
            className="text-xl font-extrabold text-[#ffc499] flex items-center gap-2 cursor-pointer group tracking-tight"
          >
            <span className="material-symbols-outlined text-[#ffc499] group-hover:rotate-90 transition-transform duration-300">
              schema
            </span>
            <span>CohortIQ</span>
          </div>

          {/* Segmented Tab Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1c1815] p-1 rounded-xl border border-[#383430]">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'candidates', label: 'Candidates', icon: 'group' },
              { id: 'interviews', label: 'Interviews', icon: 'forum' },
              { id: 'analytics', label: 'Reports', icon: 'analytics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#383430] text-[#ffc499] shadow-sm ring-1 ring-[#ffc499]/30'
                    : 'text-[#a08d80] hover:text-[#e9e1dc] hover:bg-[#221f1c]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section: Candidate Selector, Search & Profile */}
        <div className="flex items-center gap-3">
          {/* Candidate Switcher Pill */}
          <div className="flex items-center bg-[#1c1815] border border-[#383430] hover:border-[#534439] rounded-xl px-3 py-1.5 text-xs transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="text-[#a08d80] text-[11px] uppercase tracking-wider font-semibold ml-1.5 hidden lg:inline">Active Candidate:</span>
            <select
              value={selectedCandidate.member.id}
              onChange={(e) => {
                const found = allCandidates.find(c => c.member.id === e.target.value);
                if (found) onSelectCandidate(found);
              }}
              className="bg-transparent text-[#e9e1dc] font-bold focus:outline-none cursor-pointer text-xs ml-1"
            >
              {allCandidates.map(c => (
                <option key={c.member.id} value={c.member.id} className="bg-[#1c1815] text-[#e9e1dc]">
                  {c.member.name} ({c.member.jobRole})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Switch to Bluish Light Theme' : 'Switch to Dark Theme'}
              className="flex items-center gap-1.5 bg-[#1c1815] border border-[#383430] hover:border-[#ffc499]/50 rounded-xl px-3 py-1.5 text-xs text-[#e9e1dc] transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <span className="material-symbols-outlined text-base text-[#ffc499]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="font-semibold text-[11px] hidden sm:inline">
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </span>
            </button>
          )}

          {/* Icon Actions */}
          <div className="flex items-center gap-1.5 border-l border-[#383430] pl-2 relative">
            {/* Notification Icon & Dropdown */}
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowSettings(false);
                }}
                className={`transition-colors p-1.5 rounded-lg relative cursor-pointer ${
                  showNotifications ? 'bg-[#383430] text-[#ffc499]' : 'text-[#a08d80] hover:text-[#ffc499] hover:bg-[#221f1c]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#f4a261] rounded-full ring-2 ring-[#161310]"></span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1c1815] border border-[#534439] rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#383430] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#ffc499]">notifications_active</span>
                      <span className="text-xs font-bold text-[#e9e1dc]">Recruiter Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-[#f4a261] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                          n.read
                            ? 'bg-[#161310] border-[#383430] opacity-70'
                            : 'bg-[#221f1c] border-[#ffc499]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[#e9e1dc]">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[#a08d80] font-normal">{n.time}</span>
                        </div>
                        <p className="text-[#d8c2b5] text-[11px] leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Candidate Header Profile Avatar */}
            <button
              onClick={() => setActiveTab('candidates')}
              title={`Active Profile: ${selectedCandidate.member.name} (${selectedCandidate.member.jobRole})`}
              className="relative ml-1 cursor-pointer group focus:outline-none transition-transform active:scale-95 flex items-center"
            >
              <CandidateAvatar
                name={selectedCandidate.member.name}
                size="sm"
                showOnlineStatus={true}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

