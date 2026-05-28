import {
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type {
  AdvanceRequest,
  DocumentVerification,
  Employee,
  Tab,
} from "../../types/dashboard";
import {
  EmptyState,
  formatAmount,
  getDocumentBadgeLabel,
  getGreeting,
  getInitials,
  HomeActionCard,
  HomeInfoPill,
  RequestRow,
  WalletIllustration,
} from "./DashboardUI";

export function HomeTab({
  employee,
  authUser,
  requests,
  documentStatus,
  latestRequest,
  activeRequest,
  setActiveTab,
}: {
  employee: Employee | null;
  authUser: any;
  requests: AdvanceRequest[];
  documentStatus: DocumentVerification | null;
  latestRequest?: AdvanceRequest;
  activeRequest?: AdvanceRequest;
  setActiveTab: (tab: Tab) => void;
}) {
  const verified = documentStatus?.status === "VERIFIED";

  return (
    <div className="-mx-4 -mt-6 pb-24">
      <section className="relative h-[245px] overflow-hidden bg-[#061b3d] px-5 pt-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.18),transparent_32%)]" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-blue-100">
              {getGreeting()}
            </p>

            <h1 className="mt-1 text-[23px] font-bold tracking-tight">
              Hi, {employee?.name || authUser?.name || "Employee"} 👋
            </h1>

            <div className="mt-3 flex max-w-[235px] items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-bold text-blue-50">
              <Building2 size={13} />
              <span className="truncate">
                {employee?.employer?.companyName || "Your Company"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-300" />
            </button>

            <button
              onClick={() => setActiveTab("PROFILE")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-[13px] font-black text-white shadow-lg shadow-blue-950/25"
            >
              {getInitials(employee?.name || authUser?.name)}
            </button>
          </div>
        </div>
      </section>

      <div className="relative -mt-[94px] space-y-4 px-4">
        <section className="overflow-hidden rounded-[26px] bg-white shadow-xl shadow-slate-200/80 ring-1 ring-slate-100 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
          <div className="grid grid-cols-[1fr_96px] gap-3 p-5">
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate-400">
                Available Limit
              </p>

              <h2 className="mt-3 text-[32px] font-black tracking-tight text-slate-950 dark:text-white">
                {formatAmount(employee?.availableLimit)}
              </h2>

              <div className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                Pre-approved: {formatAmount(employee?.preApprovedLimit)}
              </div>

              <button
                onClick={() => setActiveTab("REQUEST")}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-[12px] font-black text-white shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Wallet size={15} />
                Request Advance
              </button>
            </div>

            <div className="flex h-[164px] items-center justify-center rounded-[24px] bg-[#061b3d]">
              <WalletIllustration />
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <HomeInfoPill
                icon={<FileCheck2 size={16} />}
                label="Document"
                value={getDocumentBadgeLabel(documentStatus?.status)}
              />

              {verified ? (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 size={14} />
                  Verified
                </span>
              ) : (
                <button
                  onClick={() => setActiveTab("REQUEST")}
                  className="shrink-0 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2.5">
          <HomeActionCard
            label="Salary"
            value={formatAmount(employee?.salaryInHand)}
            icon={<Wallet size={17} />}
          />

          <HomeActionCard
            label="Requests"
            value={`${requests.length}`}
            icon={<FileText size={17} />}
          />

          <HomeActionCard
            label="Active"
            value={activeRequest ? "1" : "0"}
            icon={<Clock3 size={17} />}
          />
        </section>

        {activeRequest && (
          <section className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-black tracking-tight">
                  Active Advance
                </h2>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Current request status
                </p>
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <ShieldCheck size={17} />
              </span>
            </div>

            <RequestRow item={activeRequest} />
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-black tracking-tight">
              Recent Activity
            </h2>

            <button
              onClick={() => setActiveTab("HISTORY")}
              className="text-[12px] font-black text-blue-600 dark:text-blue-300"
            >
              View All
            </button>
          </div>

          <div className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            {latestRequest ? (
              <RequestRow item={latestRequest} />
            ) : (
              <EmptyState text="No advance request yet." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
