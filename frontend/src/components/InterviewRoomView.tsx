import React, { useState, useEffect, useRef } from 'react';
import { CandidateProfile, InterviewMessage, InterviewFeedback } from '@/types';

interface InterviewRoomViewProps {
  candidate: CandidateProfile;
  onFinishInterview: (feedback?: InterviewFeedback, transcript?: InterviewMessage[]) => void;
  onExitSession: () => void;
}

export const InterviewRoomView: React.FC<InterviewRoomViewProps> = ({
  candidate,
  onFinishInterview,
  onExitSession
}) => {
  const [sessionId] = useState(() => `LF-${Math.floor(1000 + Math.random() * 9000)}-X`);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(6);
  const getCandidateInitialTopic = (cand: CandidateProfile) => {
    const nonSkipped = cand.missions?.filter(m => !m.skipped) || [];
    const startingMission = nonSkipped[0] || cand.missions?.[0];
    return startingMission ? `Day ${startingMission.day}: ${startingMission.title}` : 'Technical Assessment';
  };

  const [currentTopic, setCurrentTopic] = useState<string>(() => getCandidateInitialTopic(candidate));
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [planNodes, setPlanNodes] = useState<Array<{ dayNumber: number; title: string }>>([]);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...selected]);
    }
    if (e.target) e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format elapsed time as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Initial interview boot call to /api/interview
  useEffect(() => {
    let isMounted = true;
    async function initInterview() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            candidate
          })
        });

        const data = await res.json();
        if (isMounted) {
          const startingTopic = data.topic || getCandidateInitialTopic(candidate);
          const firstAiMsg: InterviewMessage = {
            id: '1',
            sender: 'ai',
            text: data.reply || `Welcome ${candidate.member.name}. Let's begin your personalized technical interview tailored to your AI Cohort journey.\n\nTo start with ${startingTopic}: How do you approach key technical design choices and trade-offs in this module?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            questionNumber: data.questionNumber || 1,
            topic: startingTopic,
            difficulty: data.difficulty || 'Intermediate'
          };
          setMessages([firstAiMsg]);
          if (data.questionNumber) setQuestionNum(data.questionNumber);
          if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
          if (data.topic) setCurrentTopic(data.topic);
          if (data.difficulty) setDifficulty(data.difficulty);
          if (data.interviewPlan?.targetDays) setPlanNodes(data.interviewPlan.targetDays);
        }
      } catch (err) {
        console.error('Error starting interview session:', err);
        if (isMounted) {
          const startingTopic = getCandidateInitialTopic(candidate);
          setMessages([
            {
              id: '1',
              sender: 'ai',
              text: `Welcome ${candidate.member.name}. Let's begin your personalized technical interview tailored to your AI Cohort journey.\n\nTo start with ${startingTopic}: How do you approach key technical design choices and trade-offs in this module?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              questionNumber: 1,
              topic: startingTopic
            }
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initInterview();
    return () => { isMounted = false; };
  }, [sessionId, candidate]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send candidate answer to backend
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && attachedFiles.length === 0) || isLoading) return;

    const rawInput = inputText.trim();
    const currentAttachments = attachedFiles.map(f => ({
      name: f.name,
      size: formatFileSize(f.size),
      type: f.type
    }));

    const userMsgText = rawInput || (currentAttachments.length > 0 ? `Attached ${currentAttachments.length} file(s)` : '');

    setInputText('');
    setAttachedFiles([]);

    const userMsg: InterviewMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const apiPayloadMessage = currentAttachments.length > 0
      ? `${userMsgText}\n\n[Attached Files: ${currentAttachments.map(a => a.name).join(', ')}]`
      : userMsgText;

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: apiPayloadMessage
        })
      });

      const data = await res.json();

      if (data.done) {
        const finalAiMsg: InterviewMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply || "Interview session completed successfully.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedMessages = [...messages, userMsg, finalAiMsg];
        setMessages(updatedMessages);

        // Transition to assessment report
        setTimeout(() => {
          onFinishInterview(data.feedback, updatedMessages);
        }, 1200);
      } else {
        const nextAiMsg: InterviewMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questionNumber: data.questionNumber,
          topic: data.topic,
          difficulty: data.difficulty
        };
        setMessages(prev => [...prev, nextAiMsg]);
        if (data.questionNumber) setQuestionNum(data.questionNumber);
        if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
        if (data.topic) setCurrentTopic(data.topic);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const fallbackAiMsg: InterviewMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Thank you for that explanation. Now moving forward: how do you manage token limits and latency when orchestrating multi-agent systems via LangChain or Model Context Protocol?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionNumber: questionNum + 1
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
      setQuestionNum(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8 min-h-[calc(100vh-100px)] flex flex-col">
      {/* Live Header Bar */}
      <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#2a221a] px-3 py-1 rounded-full border border-red-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Session Live</span>
          </div>
          <span className="text-xs font-mono text-[#a08d80]">ID: {sessionId}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-[#221f1c] px-3 py-1.5 rounded-xl border border-[#383430] text-xs font-mono text-[#ffc499]">
            <span className="material-symbols-outlined text-sm">timer</span>
            <span>TIME ELAPSED: {formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => onFinishInterview(undefined, messages)}
            className="bg-[#383430] hover:bg-[#534439] text-[#ffc499] text-xs font-bold px-3.5 py-1.5 rounded-xl border border-[#534439] transition-colors"
          >
            Wrap Up Session
          </button>

          <button
            onClick={onExitSession}
            className="text-xs text-[#a08d80] hover:text-[#e9e1dc] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Exit
          </button>
        </div>
      </div>

      {/* Main Grid: Context Sidebar + Live Chat Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left Sidebar: Session Context & Curriculum Progress */}
        <div className="lg:col-span-1 space-y-4">
          {/* Current Question Context Card */}
          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold text-[#a08d80] uppercase tracking-wider flex items-center justify-between border-b border-[#383430] pb-2">
              <span>Current Context</span>
              <span className="material-symbols-outlined text-sm text-[#ffc499]">psychology</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-[#a08d80] uppercase font-bold">Progress</div>
                <div className="text-lg font-black text-[#e9e1dc]">
                  Question 0{questionNum} <span className="text-xs text-[#a08d80] font-normal">/ 0{totalQuestions}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#a08d80] uppercase font-bold">Active Topic</div>
                <div className="text-xs font-bold text-[#ffc499]">{currentTopic}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-[#221f1c] border border-[#383430] p-2 rounded-lg">
                  <div className="text-[9px] text-[#a08d80] uppercase">Difficulty</div>
                  <div className="text-xs font-bold text-[#f4a261]">{difficulty}</div>
                </div>
                <div className="bg-[#221f1c] border border-[#383430] p-2 rounded-lg">
                  <div className="text-[9px] text-[#a08d80] uppercase">Depth</div>
                  <div className="text-xs font-bold text-[#ffc499]">Level 3 (Follow-up)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Coverage Tracker */}
          <div className="bg-[#1c1815] border border-[#534439] rounded-2xl p-5 space-y-3 hidden sm:block">
            <div className="text-xs font-bold text-[#a08d80] uppercase tracking-wider">
              Cohort Node Probing
            </div>

            <div className="space-y-2 text-xs">
              {(() => {
                const activeNodes = planNodes.length > 0
                  ? planNodes.slice(0, 6).map((t, idx) => ({
                      step: idx + 1,
                      dayNumber: t.dayNumber,
                      label: `Day ${t.dayNumber}: ${t.title}`
                    }))
                  : (candidate.missions?.filter(m => !m.skipped) || []).slice(0, 6).map((m, idx) => ({
                      step: idx + 1,
                      dayNumber: m.day,
                      label: `Day ${m.day}: ${m.title}`
                    }));

                const currentDayMatch = currentTopic.match(/Day (\d+)/i);
                const activeDayNum = currentDayMatch ? parseInt(currentDayMatch[1], 10) : 0;
                const activeNodeIndex = activeNodes.findIndex(n => n.dayNumber === activeDayNum);

                return activeNodes.map((node, idx) => {
                  const isActive = activeNodeIndex !== -1 ? idx === activeNodeIndex : questionNum === node.step;
                  const isVerified = activeNodeIndex !== -1 ? idx < activeNodeIndex : questionNum > node.step;

                  return (
                    <div
                      key={node.step}
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#2b2723] border border-[#ffc499]/50 text-[#ffc499]'
                          : isVerified
                          ? 'bg-[#221f1c] text-emerald-400'
                          : 'bg-[#221f1c] text-[#a08d80]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isVerified && (
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                        )}
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#f4a261] animate-ping shrink-0"></span>
                        )}
                        {!isVerified && !isActive && (
                          <span className="material-symbols-outlined text-sm">radio_button_unchecked</span>
                        )}
                        <span className={`truncate ${isActive ? 'font-bold' : ''}`}>{node.label}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold shrink-0 ml-1">
                        {isVerified ? 'Verified' : isActive ? 'ACTIVE' : 'Queued'}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Right Canvas: Chat Stream */}
        <div className="lg:col-span-3 bg-[#1c1815] border border-[#534439] rounded-2xl flex flex-col h-[620px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* System Init Pill */}
            <div className="text-center my-2">
              <span className="bg-[#221f1c] border border-[#383430] text-[11px] font-mono text-[#a08d80] px-3 py-1 rounded-full">
                Interview session {sessionId} initialized • Context injected for {candidate.member.name}
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#ffc499]">
                    {msg.sender === 'ai' ? 'LogicFlow AI Interrogator' : candidate.member.name}
                  </span>
                  <span className="text-[10px] text-[#a08d80]">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#f4a261] text-[#161310] font-medium rounded-tr-none shadow-md'
                      : 'bg-[#221f1c] border border-[#534439] text-[#e9e1dc] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#161310]/20 space-y-1.5">
                      {msg.attachments.map((att, attIdx) => (
                        <div
                          key={attIdx}
                          className="flex items-center gap-2 bg-[#161310]/15 p-2 rounded-lg text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm">attachment</span>
                          <span className="underline truncate">{att.name}</span>
                          <span className="text-[10px] opacity-80">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Typing / Generating Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#ffc499]">LogicFlow AI Interrogator</span>
                </div>
                <div className="bg-[#221f1c] border border-[#534439] p-4 rounded-2xl rounded-tl-none flex items-center gap-3 text-xs text-[#a08d80]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ffc499] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-[#f4a261] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#ffc499] animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span>Processing semantic similarity & evaluating response depth...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Bar */}
          <div className="border-t border-[#383430] p-4 bg-[#161310] space-y-3">
            <form onSubmit={handleSendMessage} className="space-y-3">
              {/* Attached Files Chips Bar */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-[#1c1815] rounded-xl border border-[#383430]">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#221f1c] text-[#e9e1dc] text-xs px-3 py-1.5 rounded-lg border border-[#534439] shadow-sm animate-fade-in"
                    >
                      <span className="material-symbols-outlined text-sm text-[#ffc499]">description</span>
                      <span className="font-semibold max-w-[150px] truncate">{file.name}</span>
                      <span className="text-[10px] text-[#a08d80]">({formatFileSize(file.size)})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-[#a08d80] hover:text-rose-400 p-0.5 ml-1 transition-colors cursor-pointer"
                        title="Remove attachment"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={isCodeMode ? 4 : 2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isCodeMode
                      ? "Paste Python / TypeScript snippet or architectural code..."
                      : "Type your response... (Press Cmd+Enter to submit)"
                  }
                  className={`w-full bg-[#221f1c] border border-[#534439] rounded-xl p-3 text-sm text-[#e9e1dc] placeholder-[#a08d80] focus:outline-none focus:border-[#ffc499] ${
                    isCodeMode ? 'font-mono text-xs bg-[#1a1714]' : ''
                  }`}
                />

                <div className="absolute bottom-3 right-3 text-[10px] text-[#a08d80] font-mono">
                  {inputText.length} / 2000
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCodeMode(!isCodeMode)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                      isCodeMode
                        ? 'bg-[#ffc499] text-[#161310] font-bold border-[#ffc499]'
                        : 'bg-[#221f1c] text-[#d8c2b5] border-[#534439] hover:bg-[#383430]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    <span>Code Snippet</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFileClick}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                      attachedFiles.length > 0
                        ? 'bg-[#ffc499]/20 text-[#ffc499] border-[#ffc499]/50 font-bold'
                        : 'bg-[#221f1c] hover:bg-[#383430] text-[#d8c2b5] border-[#534439]'
                    }`}
                    title="Attach files to your response"
                  >
                    <span className="material-symbols-outlined text-sm">attach_file</span>
                    <span>Attach File {attachedFiles.length > 0 ? `(${attachedFiles.length})` : ''}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.json,.py,.ts,.tsx,.js,.csv,.png,.jpg,.jpeg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={(!inputText.trim() && attachedFiles.length === 0) || isLoading}
                  className="bg-[#f4a261] hover:bg-[#e76f51] disabled:opacity-50 text-[#161310] font-bold py-2 px-6 rounded-xl transition-all shadow flex items-center gap-2 text-xs cursor-pointer"
                >
                  <span>Submit Response</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
