interface SidebarNavProps {
  activeView: 'dashboard' | 'candidate' | 'interviews' | 'setup' | 'room' | 'report';
  onNavigate: (view: string) => void;
  candidateName: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'candidate', label: 'Candidate', icon: 'person' },
  { id: 'interviews', label: 'Interviews', icon: 'forum' },
  { id: 'setup', label: 'Setup', icon: 'settings' },
  { id: 'room', label: 'Interview Room', icon: 'smart_toy' },
  { id: 'report', label: 'Report', icon: 'assessment' },
] as const;

export function SidebarNav({ activeView, onNavigate, candidateName }: SidebarNavProps) {
  return (
    <aside className="w-[260px] border-r border-[#383430] bg-[#191512] p-4 hidden lg:block">
      <div className="mb-6 border-b border-[#383430] pb-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#a08d80]">Current focus</div>
        <div className="mt-2 text-sm font-bold text-[#e9e1dc]">{candidateName}</div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                isActive ? 'bg-[#2a221a] text-[#ffc499] border border-[#534439]' : 'text-[#d8c2b5] hover:bg-[#221f1c]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
