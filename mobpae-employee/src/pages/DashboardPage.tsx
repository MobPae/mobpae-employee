import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getAuthUser, removeToken } from "../services/auth";
import type {
  AdvanceRequest,
  DocumentVerification,
  Employee,
  Tab,
} from "../types/dashboard";
import { Alert, LoadingScreen } from "../components/dashboard/DashboardUI";
import { BottomNav } from "../components/dashboard/BottomNav";
import { HomeTab } from "../components/dashboard/HomeTab";
import { RequestTab } from "../components/dashboard/RequestTab";
import { HistoryTab } from "../components/dashboard/HistoryTab";
import { ProfileTab } from "../components/dashboard/ProfileTab";

export function DashboardPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [requests, setRequests] = useState<AdvanceRequest[]>([]);
  const [documentStatus, setDocumentStatus] =
    useState<DocumentVerification | null>(null);

  const [amount, setAmount] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [bankStatementFile, setBankStatementFile] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("HOME");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("mobpae_employee_theme");
    const shouldUseDark = savedTheme === "dark";

    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleDarkMode() {
    const next = !isDarkMode;

    setIsDarkMode(next);
    localStorage.setItem("mobpae_employee_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

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
    if (!authUser?.employeeId) {
      setError("Employee ID not found. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [employeeRes, requestsRes, documentRes] = await Promise.all([
        api.get(`/employees/${authUser.employeeId}`),
        api.get("/advance-requests"),
        api.get("/employee-documents/me"),
      ]);

      setEmployee(unwrap(employeeRes));
      setRequests(unwrapList(requestsRes));
      setDocumentStatus(unwrap(documentRes));
    } catch {
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const activeRequest = requests.find(
    (item) =>
      ["PENDING", "APPROVED"].includes(item.status) &&
      item.repayment?.status !== "PAID"
  );

  const isRequestBlocked = Boolean(activeRequest);
  const isDocumentVerified = documentStatus?.status === "VERIFIED";

  const shouldUploadDocuments =
    !documentStatus ||
    documentStatus?.status === "NOT_UPLOADED" ||
    documentStatus?.status === "REJECTED";

  const isDocumentPending = documentStatus?.status === "PENDING_VERIFICATION";
  const latestRequest = requests[0];

  const summary = useMemo(() => {
    return {
      pending: requests.filter((item) => item.status === "PENDING").length,
      approved: requests.filter((item) => item.status === "APPROVED").length,
      rejected: requests.filter((item) => item.status === "REJECTED").length,
    };
  }, [requests]);

  async function handleUploadDocuments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!aadhaarFile || !panFile || !bankStatementFile) {
      setError("Please upload Aadhaar, PAN and bank statement.");
      return;
    }

    const formData = new FormData();
    formData.append("aadhaar", aadhaarFile);
    formData.append("pan", panFile);
    formData.append("bankStatement", bankStatementFile);

    setUploadingDocs(true);

    try {
      await api.post("/employee-documents/me/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAadhaarFile(null);
      setPanFile(null);
      setBankStatementFile(null);
      setSuccess("Documents uploaded. Waiting for verification.");

      await fetchDashboard();

      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to upload documents";

      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setUploadingDocs(false);
    }
  }

  async function handleRequestAdvance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isRequestBlocked) return;

    if (!isDocumentVerified) {
      setError("Document verification is required before requesting advance.");
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
      setActiveTab("HOME");

      window.setTimeout(() => setSuccess(""), 3000);
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

  function handleTabChange(tab: Tab) {
    setSuccess("");
    setError("");
    setActiveTab(tab);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-md px-5 pb-32 pt-6">
        {success && <Alert type="success" message={success} />}
        {error && <Alert type="error" message={error} />}

        {activeTab === "HOME" && (
          <HomeTab
            employee={employee}
            authUser={authUser}
            requests={requests}
            documentStatus={documentStatus}
            latestRequest={latestRequest}
            activeRequest={activeRequest}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "REQUEST" && (
          <RequestTab
            employee={employee}
            documentStatus={documentStatus}
            amount={amount}
            setAmount={setAmount}
            aadhaarFile={aadhaarFile}
            setAadhaarFile={setAadhaarFile}
            panFile={panFile}
            setPanFile={setPanFile}
            bankStatementFile={bankStatementFile}
            setBankStatementFile={setBankStatementFile}
            shouldUploadDocuments={shouldUploadDocuments}
            isDocumentPending={isDocumentPending}
            isDocumentVerified={isDocumentVerified}
            isRequestBlocked={isRequestBlocked}
            uploadingDocs={uploadingDocs}
            requesting={requesting}
            handleUploadDocuments={handleUploadDocuments}
            handleRequestAdvance={handleRequestAdvance}
            clearError={() => setError("")}
          />
        )}

        {activeTab === "HISTORY" && (
          <HistoryTab requests={requests} summary={summary} />
        )}

        {activeTab === "PROFILE" && (
          <ProfileTab
            employee={employee}
            authUser={authUser}
            documentStatus={documentStatus}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            fetchDashboard={fetchDashboard}
            handleLogout={handleLogout}
          />
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </main>
  );
}
