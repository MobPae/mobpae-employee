import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Loader2,
  Wallet,
  XCircle,
} from "lucide-react";
import type { AdvanceRequest, DocumentStatus } from "../../types/dashboard";

export function formatAmount(value?: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function getInitials(name?: string) {
  if (!name) return "ME";

  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getDocumentBadgeLabel(status?: DocumentStatus) {
  switch (status) {
    case "VERIFIED":
      return "Verified";
    case "PENDING_VERIFICATION":
      return "In review";
    case "REJECTED":
      return "Needs update";
    default:
      return "Verify document";
  }
}

export function getStatusClass(status?: string) {
  switch (status) {
    case "APPROVED":
    case "VERIFIED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "REJECTED":
    case "CANCELLED":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300";
    case "PENDING":
    case "PENDING_VERIFICATION":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    default:
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
  }
}

export function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fc] p-6 dark:bg-slate-950">
      <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        <Loader2 className="animate-spin text-blue-600" size={16} />
        Loading...
      </div>
    </main>
  );
}

export function Alert({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`mb-3 rounded-2xl px-4 py-3 text-xs font-semibold ${
        type === "success"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
      }`}
    >
      {message}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 text-center text-xs font-medium text-slate-400 dark:bg-slate-800">
      {text}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header>
      <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>
      <h1 className="mt-0.5 text-[22px] font-semibold tracking-tight">
        {title}
      </h1>
    </header>
  );
}

export function WalletIllustration() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-white/10">
      <div className="relative">
        <div className="absolute -top-5 left-3 flex gap-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-[10px] font-bold text-blue-900">
            ₹
          </span>
          <span className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-blue-900">
            ₹
          </span>
        </div>

        <div className="relative h-12 w-16 rounded-xl bg-white shadow-lg shadow-blue-950/20">
          <div className="absolute right-0 top-3.5 h-6 w-7 rounded-l-lg bg-blue-100">
            <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "purple" | "orange";
}) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    purple:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
  }[tone];

  return (
    <div className="rounded-[1.3rem] bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-2xl ${toneClass}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-[10px] font-medium text-slate-400">{label}</p>
      <h3 className="mt-1 truncate text-[13px] font-bold">{value}</h3>
    </div>
  );
}

export function HomeActionCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-[110px] rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
        {icon}
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-400">{label}</p>
      <h3 className="mt-1 truncate text-[13px] font-black text-slate-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

export function HomeInfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-[12px] font-black text-slate-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export function VerificationCard({
  status,
  remarks,
}: {
  status: DocumentStatus;
  remarks?: string | null;
}) {
  const verified = status === "VERIFIED";
  const rejected = status === "REJECTED";
  const pending = status === "PENDING_VERIFICATION";

  return (
    <section className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            verified
              ? "bg-emerald-50 text-emerald-600"
              : rejected
              ? "bg-red-50 text-red-600"
              : pending
              ? "bg-amber-50 text-amber-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {verified ? (
            <CheckCircle2 size={19} />
          ) : rejected ? (
            <XCircle size={19} />
          ) : pending ? (
            <Clock3 size={19} />
          ) : (
            <FileCheck2 size={19} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Document verification</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            {verified
              ? "Your documents are verified. You can request advance."
              : rejected
              ? remarks || "Documents need an update. Please upload again."
              : pending
              ? "Documents submitted. Waiting for admin verification."
              : "Upload documents once to unlock advance requests."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function RequestRow({ item }: { item: AdvanceRequest }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
      <div>
        <p className="text-sm font-semibold">{formatAmount(item.amount)}</p>
        <p className="mt-1 text-[11px] text-slate-400">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : `${item.requestMonth || "-"} / ${item.requestYear || "-"}`}
        </p>
      </div>

      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        {item.status}
      </span>
    </div>
  );
}

export function RequestCard({ item }: { item: AdvanceRequest }) {
  return (
    <div className="rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold">{formatAmount(item.amount)}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : `${item.requestMonth || "-"} / ${item.requestYear || "-"}`}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClass(
            item.status
          )}`}
        >
          {item.status}
        </span>
      </div>

      {item.repayment && (
        <p className="mt-3 text-[11px] font-medium text-slate-400">
          Repayment {formatAmount(item.repayment.amount)} •{" "}
          {item.repayment.status || "-"}
        </p>
      )}
    </div>
  );
}

export function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.2rem] bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <p className="text-[10px] font-medium text-slate-400">{label}</p>
      <h3 className="mt-1 text-lg font-semibold">{value}</h3>
    </div>
  );
}

export function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      <span className="max-w-[180px] truncate text-xs font-bold text-slate-800 dark:text-white">
        {value || "-"}
      </span>
    </div>
  );
}

export function FileInput({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-950">
      <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <FileText size={15} className="shrink-0 text-blue-600" />

        <span className="min-w-0">
          <span className="block">{label}</span>

          {file ? (
            <span className="mt-0.5 block max-w-[180px] truncate text-[10px] font-semibold text-emerald-600">
              {file.name}
            </span>
          ) : (
            <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
              PDF, PNG, JPG
            </span>
          )}
        </span>
      </span>

      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] || null;
          onChange(selectedFile);
        }}
        className="hidden"
      />

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
          file
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
        }`}
      >
        {file ? "Selected" : "Choose"}
      </span>
    </label>
  );
}
