import {
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { AdvanceRequest } from "../../types/dashboard";
import { EmptyState, formatAmount } from "./DashboardUI";

export function HistoryTab({
  requests,
  summary,
}: {
  requests: AdvanceRequest[];
  summary: {
    pending: number;
    approved: number;
    rejected: number;
  };
}) {
  const totalAmount = requests.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[12px] font-bold text-blue-600 dark:text-blue-300">
          Activity
        </p>
        <h1 className="mt-1 text-[24px] font-black tracking-tight">
          Request History
        </h1>
        <p className="mt-1 text-[12px] font-medium text-slate-400">
          Track your salary advance requests and repayment status.
        </p>
      </header>

      <section className="rounded-[1.55rem] bg-[#061b3d] p-4 text-white shadow-xl shadow-blue-950/15">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-blue-100">
              Total Requested
            </p>
            <h2 className="mt-2 text-[28px] font-black tracking-tight">
              {formatAmount(totalAmount)}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-blue-100">
              Across {requests.length} request{requests.length === 1 ? "" : "s"}
            </p>
          </div>

          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
            <TrendingUp size={22} />
          </span>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        <HistoryStat
          label="Pending"
          value={summary.pending}
          icon={<Clock3 size={16} />}
          tone="amber"
        />

        <HistoryStat
          label="Approved"
          value={summary.approved}
          icon={<CheckCircle2 size={16} />}
          tone="green"
        />

        <HistoryStat
          label="Rejected"
          value={summary.rejected}
          icon={<XCircle size={16} />}
          tone="red"
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-black tracking-tight">
            All Requests
          </h2>

          <span className="text-[11px] font-bold text-slate-400">
            {requests.length} total
          </span>
        </div>

        <div className="space-y-3">
          {requests.map((item) => (
            <HistoryRequestCard key={item.id} item={item} />
          ))}

          {requests.length === 0 && (
            <EmptyState text="No advance requests yet." />
          )}
        </div>
      </section>
    </div>
  );
}

function HistoryStat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "amber" | "green" | "red";
}) {
  const toneClass = {
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    green:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  }[tone];

  return (
    <div className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClass}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-400">{label}</p>
      <h3 className="mt-1 text-[18px] font-black text-slate-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

function HistoryRequestCard({ item }: { item: AdvanceRequest }) {
  const statusClass = getStatusStyle(item.status);

  return (
    <div className="rounded-[1.35rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <FileText size={18} />
          </span>

          <div className="min-w-0">
            <p className="text-[15px] font-black text-slate-950 dark:text-white">
              {formatAmount(item.amount)}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : `${item.requestMonth || "-"} / ${item.requestYear || "-"}`}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass}`}
        >
          {item.status}
        </span>
      </div>

      {item.repayment && (
        <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-300">
            Repayment: {formatAmount(item.repayment.amount)} •{" "}
            {item.repayment.status || "-"}
          </p>

          {item.repayment.dueDate && (
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              Due {new Date(item.repayment.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function getStatusStyle(status?: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "REJECTED":
    case "CANCELLED":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300";
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    default:
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
  }
}
