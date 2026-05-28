import {
  Building2,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  LogOut,
  Mail,
  Moon,
  Phone,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import type { DocumentVerification, Employee } from "../../types/dashboard";
import { getDocumentBadgeLabel, getInitials } from "./DashboardUI";

export function ProfileTab({
  employee,
  authUser,
  documentStatus,
  isDarkMode,
  toggleDarkMode,
  fetchDashboard,
  handleLogout,
}: {
  employee: Employee | null;
  authUser: any;
  documentStatus: DocumentVerification | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fetchDashboard: () => void;
  handleLogout: () => void;
}) {
  const name = employee?.name || authUser?.name || "Employee";
  const email = employee?.email || authUser?.email || "-";
  const verified = documentStatus?.status === "VERIFIED";

  return (
    <div className="-mx-4 -mt-6 min-h-[calc(100dvh-88px)] bg-[#f6f8fc] dark:bg-slate-950">
      <section className="relative bg-[#061b3d] px-5 pb-24 pt-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.35),transparent_32%)]" />

        <div className="relative flex items-center justify-between">
          <h1 className="text-[17px] font-black tracking-tight">
            Profile & Settings
          </h1>

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Settings size={18} />
          </button>
        </div>

        <div className="relative mt-8 flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-[22px] font-black text-blue-700 shadow-lg">
            {getInitials(name)}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[22px] font-black">{name}</h2>
            <p className="mt-1 truncate text-[13px] font-medium text-blue-100">
              {email}
            </p>

            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-black text-white ${
                verified ? "bg-emerald-600" : "bg-orange-500"
              }`}
            >
              <CheckCircle2 size={12} />
              {verified
                ? "Verified"
                : getDocumentBadgeLabel(documentStatus?.status)}
            </span>
          </div>
        </div>
      </section>

      <section className="relative -mt-16 px-4 pb-6">
        <SectionCard title="Employer Details">
          <ProfileMenuRow
            icon={<UserRound size={18} />}
            title="Personal Info"
            subtitle="Employee profile details"
            value={employee?.status}
          />

          <ProfileMenuRow
            icon={<Building2 size={18} />}
            title="Company"
            subtitle={employee?.employer?.companyName || "Your Company"}
          />

          <ProfileMenuRow
            icon={<Mail size={18} />}
            title="Email"
            subtitle={email}
          />

          <ProfileMenuRow
            icon={<Phone size={18} />}
            title="Phone"
            subtitle={employee?.phone || "-"}
          />

          <ProfileMenuRow
            icon={<ShieldCheck size={18} />}
            title="Activation"
            subtitle={employee?.activationStatus || "-"}
          />

          <ProfileMenuRow
            icon={<FileCheck2 size={18} />}
            title="Documents"
            subtitle={
              verified
                ? "Verified"
                : getDocumentBadgeLabel(documentStatus?.status)
            }
            statusTone={verified ? "green" : "orange"}
          />
        </SectionCard>

        <SectionCard title="Preferences" className="mt-4">
          <button
            onClick={toggleDarkMode}
            className="flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </span>

              <div>
                <p className="text-[14px] font-black text-slate-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Change app appearance
                </p>
              </div>
            </div>

            <span
              className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                isDarkMode ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition ${
                  isDarkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </span>
          </button>

          <button
            onClick={fetchDashboard}
            className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-4 text-left dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <RefreshCcw size={18} />
              </span>

              <div>
                <p className="text-[14px] font-black text-slate-900 dark:text-white">
                  Refresh
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Sync latest account details
                </p>
              </div>
            </div>

            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </SectionCard>

        <button
          onClick={handleLogout}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[1rem] bg-white text-[14px] font-black text-red-600 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </section>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="mb-2 px-1 text-[13px] font-black text-slate-900 dark:text-white">
        {title}
      </h2>

      <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-xl shadow-slate-200/80 ring-1 ring-slate-100 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        {children}
      </div>
    </div>
  );
}

function ProfileMenuRow({
  icon,
  title,
  subtitle,
  value,
  statusTone,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value?: string | null;
  statusTone?: "green" | "orange";
}) {
  const statusClass =
    statusTone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : statusTone === "orange"
      ? "bg-orange-50 text-orange-700"
      : "bg-blue-50 text-blue-700";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-[14px] font-black text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {value ? (
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
          {value}
        </span>
      ) : statusTone ? (
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass}`}
        >
          {subtitle}
        </span>
      ) : (
        <ChevronRight size={18} className="shrink-0 text-slate-400" />
      )}
    </div>
  );
}
