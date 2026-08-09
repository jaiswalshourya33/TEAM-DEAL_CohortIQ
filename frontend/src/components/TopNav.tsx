import React, { useState, useEffect } from 'react';
import { CandidateProfile } from '../types';
import { CandidateAvatar } from './CandidateAvatar';
import { CohortIQLogo } from './CohortIQLogo';

export interface NotificationItem {
  id: string;
  candidateId: string;
  candidateName: string;
  title: string;
  desc: string;
  time: string;
  type: 'report' | 'alert' | 'warning' | 'info';
  read: boolean;
}

function generateCandidateNotifications(candidates: CandidateProfile[]): NotificationItem[] {
  const result: NotificationItem[] = [];

  candidates.forEach((cand, idx) => {
    const passed = cand.missions ? cand.missions.filter(m => m.passed).length : 28;
    const skipped = cand.missions ? cand.missions.filter(m => m.skipped).length : 0;
    const firstTry = cand.signals?.missionsFirstTry ?? 20;

    // Assessment notification
    result.push({
      id: `report-${cand.member.id}`,
      candidateId: cand.member.id,
      candidateName: cand.member.name,
      title: `${cand.member.name} • Assessment Complete`,
      desc: `${cand.member.name} (${cand.member.jobRole}) completed evaluation with ${Math.round((passed / 31) * 100)}% execution score.`,
      time: `${(idx + 1) * 12}m ago`,
      type: 'report',
      read: idx > 1
    });

    // Warning or Alert notification per candidate
    if (skipped > 0) {
      result.push({
        id: `warning-${cand.member.id}`,
        candidateId: cand.member.id,
        candidateName: cand.member.name,
        title: `${cand.member.name} • Skipped Module Alert`,
        desc: `Candidate skipped ${skipped} curriculum module(s). Targeted AI interview recommended.`,
        time: `${(idx + 1) * 35}m ago`,
        type: 'warning',
        read: idx > 0
      });
    } else if (firstTry >= 25) {
      result.push({
        id: `alert-${cand.member.id}`,
        candidateId: cand.member.id,
        candidateName: cand.member.name,
        title: `${cand.member.name} • Top 5% Performer`,
        desc: `Achieved ${firstTry} first-try module passes across the 31-day AI engineering cohort.`,
        time: `${(idx + 1) * 2}h ago`,
        type: 'alert',
        read: idx > 1
      });
    }
  });

  return result;
}

interface TopNavProps {
  activeTab: 'dashboard' | 'candidates' | 'interviews' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'candidates' | 'interviews' | 'analytics') => void;
  selectedCandidate: CandidateProfile;
  onSelectCandidate: (candidate: CandidateProfile) => void;
  allCandidates: CandidateProfile[];
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onGoToWelcome?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  selectedCandidate,
  onSelectCandidate,
  allCandidates,
  theme = 'dark',
  onToggleTheme,
  onGoToWelcome
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'active'>('all');
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    generateCandidateNotifications(allCandidates)
  );

  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setNotifications(generateCandidateNotifications(allCandidates));
  }, [allCandidates]);

  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === 'active') {
      return n.candidateId === selectedCandidate.member.id;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    const target = allCandidates.find(c => c.member.id === item.candidateId);
    if (target) {
      onSelectCandidate(target);
    }
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setShowNotifications(false);
    setActiveTab('candidates');
  };

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setShowSettings(false);
    }, 1200);
  };

  const isLight = theme === 'light';

  return (
    <header className={`backdrop-blur-md border-b sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-200 ${
      isLight 
        ? 'bg-white/90 border-slate-200/80 text-slate-900 shadow-sm' 
        : 'bg-[#161310]/95 border-[#383430] text-[#e9e1dc]'
    }`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4 sm:gap-6">
        {/* Left Section: Brand & Segmented Nav */}
        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
          <CohortIQLogo
            theme={theme}
            size="md"
            showBadge={true}
            showSubtitle={false}
            onClick={onGoToWelcome ? onGoToWelcome : () => setActiveTab('dashboard')}
          />

          {/* Segmented Tab Navigation Bar */}
          <nav className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-xl border transition-colors ${
            isLight
              ? 'bg-slate-100/80 border-slate-200'
              : 'bg-[#1c1815] border-[#383430]'
          }`}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'candidates', label: 'Candidates', icon: 'group' },
              { id: 'interviews', label: 'Interviews', icon: 'forum' },
              { id: 'analytics', label: 'Reports', icon: 'analytics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? isLight
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                      : 'bg-[#383430] text-[#ffc499] shadow-sm ring-1 ring-[#ffc499]/30'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      : 'text-[#a08d80] hover:text-[#e9e1dc] hover:bg-[#221f1c]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section: Candidate Selector, Theme & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Candidate Switcher Pill */}
          <div className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs transition-colors border ${
            isLight
              ? 'bg-slate-100/80 border-slate-200 hover:border-slate-300'
              : 'bg-[#1c1815] border-[#383430] hover:border-[#534439]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className={`text-[11px] uppercase tracking-wider font-semibold hidden lg:inline ${
              isLight ? 'text-slate-500' : 'text-[#a08d80]'
            }`}>Active Candidate:</span>
            <select
              value={selectedCandidate.member.id}
              onChange={(e) => {
                const found = allCandidates.find(c => c.member.id === e.target.value);
                if (found) onSelectCandidate(found);
              }}
              className={`bg-transparent font-bold focus:outline-none cursor-pointer text-xs ${
                isLight ? 'text-slate-900' : 'text-[#e9e1dc]'
              }`}
            >
              {allCandidates.map(c => (
                <option key={c.member.id} value={c.member.id} className={isLight ? 'bg-white text-slate-900' : 'bg-[#1c1815] text-[#e9e1dc]'}>
                  {c.member.name} ({c.member.jobRole})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs transition-all cursor-pointer border shadow-sm ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-slate-300'
                  : 'bg-[#1c1815] border-[#383430] text-[#e9e1dc] hover:border-[#ffc499]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-base ${isLight ? 'text-blue-600' : 'text-[#ffc499]'}`}>
                {isLight ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="font-semibold text-[11px] hidden sm:inline">
                {isLight ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          )}

          {/* Icon Actions */}
          <div className={`flex items-center gap-2.5 border-l pl-3 sm:pl-4 relative ${
            isLight ? 'border-slate-200' : 'border-[#383430]'
          }`}>
            {/* Notification Icon & Dropdown */}
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowSettings(false);
                }}
                className={`transition-colors p-2 rounded-xl relative cursor-pointer flex items-center justify-center ${
                  showNotifications
                    ? isLight ? 'bg-slate-200 text-blue-600' : 'bg-[#383430] text-[#ffc499]'
                    : isLight ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100' : 'text-[#a08d80] hover:text-[#ffc499] hover:bg-[#221f1c]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">notifications</span>
                {unreadCount > 0 && (
                  <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ${
                    isLight ? 'bg-blue-600 ring-white' : 'bg-[#f4a261] ring-[#161310]'
                  }`}></span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl p-4 z-50 space-y-3 border animate-fade-in ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                    : 'bg-[#1c1815] border-[#534439] text-[#e9e1dc]'
                }`}>
                  {/* Header Bar */}
                  <div className={`flex items-center justify-between border-b pb-2.5 ${
                    isLight ? 'border-slate-100' : 'border-[#383430]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${isLight ? 'text-blue-600' : 'text-[#ffc499]'}`}>notifications_active</span>
                      <span className="text-xs font-bold">Recruiter Notifications</span>
                      {unreadCount > 0 && (
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isLight
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-[#f4a261]/20 text-[#f4a261] border-[#f4a261]/30'
                        }`}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className={`text-[10px] hover:underline font-semibold cursor-pointer ${
                          isLight ? 'text-blue-600' : 'text-[#f4a261]'
                        }`}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#161310] border-[#383430]'
                  }`}>
                    <button
                      onClick={() => setNotificationFilter('all')}
                      className={`flex-1 text-[11px] font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        notificationFilter === 'all'
                          ? isLight ? 'bg-white text-blue-600 shadow-sm' : 'bg-[#383430] text-[#ffc499]'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#a08d80]'
                      }`}
                    >
                      All Candidates ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotificationFilter('active')}
                      className={`flex-1 text-[11px] font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        notificationFilter === 'active'
                          ? isLight ? 'bg-white text-blue-600 shadow-sm' : 'bg-[#383430] text-[#ffc499]'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#a08d80]'
                      }`}
                    >
                      Active ({selectedCandidate.member.name.split(' ')[0]})
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {filteredNotifications.length === 0 ? (
                      <div className={`p-4 text-center text-xs ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>
                        No notifications for this filter.
                      </div>
                    ) : (
                      filteredNotifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all cursor-pointer group ${
                            isLight
                              ? n.read
                                ? 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100 hover:border-blue-300'
                                : 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                              : n.read
                                ? 'bg-[#161310] border-[#383430] opacity-80 hover:opacity-100 hover:border-[#ffc499]/50'
                                : 'bg-[#221f1c] border-[#ffc499]/30 hover:border-[#ffc499]/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <CandidateAvatar name={n.candidateName} size="xs" />
                            <div className="flex-1 min-w-0">
                              <div className={`flex items-center justify-between font-bold transition-colors ${
                                isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-[#e9e1dc] group-hover:text-[#ffc499]'
                              }`}>
                                <span className="truncate">{n.title}</span>
                                <span className={`text-[10px] font-normal shrink-0 ml-1 ${
                                  isLight ? 'text-slate-400' : 'text-[#a08d80]'
                                }`}>{n.time}</span>
                              </div>
                              <p className={`text-[11px] leading-relaxed line-clamp-2 mt-0.5 ${
                                isLight ? 'text-slate-600' : 'text-[#d8c2b5]'
                              }`}>{n.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Candidate Header Profile Avatar */}
            <button
              onClick={() => setActiveTab('candidates')}
              title={`Active Profile: ${selectedCandidate.member.name} (${selectedCandidate.member.jobRole})`}
              className="relative cursor-pointer group focus:outline-none transition-transform active:scale-95 flex items-center p-0.5"
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

