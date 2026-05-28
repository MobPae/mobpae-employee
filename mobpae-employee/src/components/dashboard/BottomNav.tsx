import { Clock3, Home, Plus, User } from "lucide-react";
import type { Tab } from "../../types/dashboard";

export function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const items = [
    { label: "Home", value: "HOME" as Tab, icon: Home },
    { label: "Request", value: "REQUEST" as Tab, icon: Plus },
    { label: "History", value: "HISTORY" as Tab, icon: Clock3 },
    { label: "Profile", value: "PROFILE" as Tab, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 px-5 pb-3">
      <div className="mx-auto grid max-w-[360px] grid-cols-4 rounded-[1.25rem] border border-slate-100 bg-white/95 p-1.5 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5 text-[9px] font-bold transition ${
                active ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.8 : 2.2} />
              {item.label}

              {active && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
