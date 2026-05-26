import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  IndianRupee,
  Loader2,
  LogOut,
  RefreshCcw,
  Send,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getAuthUser, removeToken } from "../services/auth";

type Employee = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  salaryInHand?: number;
  preApprovedLimit?: number;
  availableLimit?: number;
  status?: string;
  activationStatus?: string;
  employer?: {
    companyName?: string;
  };
};

type AdvanceRequest = {
  id: string;
  amount: number;
  status: string;
  requestMonth?: number;
  requestYear?: number;
  createdAt?: string;
  employerRemarks?: string;
  repayment?: {
    amount?: number;
    status?: string;
    dueDate?: string;
  };
};

export function DashboardPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [requests, setRequests] = useState<AdvanceRequest[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function unwrap(response: any) {
    return (
      response?.data?.data?.data ||
      response?.data?.data?.items ||
      response?.data?.data ||
      response?.data ||
      null
    );
  }

  function unwrapList(response: any) {
    const data = unwrap(response);
    return Array.isArray(data) ? data : [];
  }

  async function fetchDashboard() {
    setLoading(true);
    setError("");

    try {
      const [employeeRes, requestsRes] = await Promise.all([
        api.get(`/employees/${authUser?.employeeId}`),
        api.get("/advance-requests"),
      ]);

      setEmployee(unwrap(employeeRes));
      setRequests(unwrapList(requestsRes));
    } catch {
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = useMemo(() => {
    return {
      pending: requests.filter((item) => item.status === "PENDING").length,
      approved: requests.filter((item) => item.status === "APPROVED").length,
      rejected: requests.filter((item) => item.status === "REJECTED").length,
    };
  }, [requests]);

  const activeRequest = requests.find(
    (item) =>
      ["PENDING", "APPROVED"].includes(item.status) &&
      item.repayment?.status !== "PAID"
  );

  const isRequestBlocked = Boolean(activeRequest);

  function formatAmount(value?: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  }

  async function handleRequestAdvance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isRequestBlocked) {
      setError(
        "You already have an active advance request. Please clear repayment before requesting again."
      );
      return;
    }

    const requestAmount = Number(amount);

    if (!authUser?.employeeId) {
      setError("Employee ID not found. Please login again.");
      return;
    }

    if (!requestAmount || requestAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (requestAmount > Number(employee?.availableLimit || 0)) {
      setError("Requested amount exceeds available limit.");
      return;
    }

    setRequesting(true);

    try {
      await api.post("/advance-requests", {
        employeeId: authUser.employeeId,
        amount: requestAmount,
      });

      setAmount("");
      setSuccess("Advance request submitted successfully.");
      await fetchDashboard();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to submit request";

      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setRequesting(false);
    }
  }

  function handleLogout() {
    removeToken();
    navigate("/login", { replace: true });
  }

  function getStatusClass(status?: string) {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-soft p-4 text-dark">
        <div className="flex items-center gap-2 rounded-[1.5rem] bg-white p-6 text-sm font-semibold text-slate-500 shadow-soft">
          <Loader2 className="animate-spin text-primary" size={18} />
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-soft p-4 text-dark md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-soft md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-200">
                Employee Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-black">
                Hi, {employee?.name || authUser?.name || "Employee"}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                View your available salary advance limit, submit a request, and
                track your request status.
              </p>
              <p className="mt-3 text-sm font-semibold text-blue-100">
                {employee?.employer?.companyName || "Your Company"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchDashboard}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </section>

        {success && (
          <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-[1.5rem] border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <LimitCard
            title="Salary In Hand"
            value={formatAmount(employee?.salaryInHand)}
          />

          <LimitCard
            title="Pre-approved Limit"
            value={formatAmount(employee?.preApprovedLimit)}
          />

          <LimitCard
            title={
              isRequestBlocked ? "Available Limit Locked" : "Available Limit"
            }
            value={formatAmount(employee?.availableLimit)}
            highlight
            disabled={isRequestBlocked}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleRequestAdvance}
            className="rounded-[1.5rem] bg-white p-6 shadow-soft"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <Wallet size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black">Request Advance</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter amount within your available limit.
            </p>

            {isRequestBlocked && (
              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                You already have an active advance request. New requests are
                blocked until repayment is cleared.
              </div>
            )}

            <label className="mt-6 block">
              <span className="text-sm font-bold text-slate-700">Amount</span>
              <div className="relative mt-2">
                <IndianRupee
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  min="1"
                  max={employee?.availableLimit || 0}
                  placeholder={
                    isRequestBlocked
                      ? "Blocked until active request is cleared"
                      : "Enter amount"
                  }
                  disabled={isRequestBlocked}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={
                requesting ||
                isRequestBlocked ||
                Number(employee?.availableLimit || 0) <= 0
              }
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {requesting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              {requesting
                ? "Submitting..."
                : isRequestBlocked
                ? "Request Blocked"
                : "Submit Request"}
            </button>
          </form>

          <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-black">Request Summary</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Pending" value={summary.pending} />
              <MiniStat label="Approved" value={summary.approved} />
              <MiniStat label="Rejected" value={summary.rejected} />
            </div>

            <div className="mt-6 grid gap-3">
              {requests.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        {formatAmount(item.amount)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : `${item.requestMonth || "-"} / ${
                              item.requestYear || "-"
                            }`}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.repayment && (
                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      Repayment: {formatAmount(item.repayment.amount)} •{" "}
                      {item.repayment.status || "-"}
                      {item.repayment.dueDate
                        ? ` • Due ${new Date(
                            item.repayment.dueDate
                          ).toLocaleDateString()}`
                        : ""}
                    </p>
                  )}

                  {item.employerRemarks && (
                    <p className="mt-2 text-xs text-slate-500">
                      Remarks: {item.employerRemarks}
                    </p>
                  )}
                </div>
              ))}

              {requests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                  No advance requests yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LimitCard({
  title,
  value,
  highlight,
  disabled,
}: {
  title: string;
  value: string;
  highlight?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] p-5 shadow-soft ${
        disabled
          ? "border border-slate-200 bg-slate-100 text-slate-400"
          : highlight
          ? "bg-primary text-white"
          : "bg-white text-slate-950"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          disabled
            ? "text-slate-400"
            : highlight
            ? "text-blue-100"
            : "text-slate-500"
        }`}
      >
        {title}
      </p>
      <h3 className="mt-3 text-2xl font-black">{value}</h3>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <h3 className="mt-2 text-2xl font-black text-slate-950">{value}</h3>
    </div>
  );
}
