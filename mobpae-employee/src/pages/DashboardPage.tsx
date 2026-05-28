// import { useEffect, useMemo, useState } from "react";
// import type { FormEvent } from "react";
// import {
//   Bell,
//   Building2,
//   CheckCircle2,
//   Clock3,
//   FileCheck2,
//   FileText,
//   Home,
//   IndianRupee,
//   Loader2,
//   LogOut,
//   Moon,
//   Plus,
//   RefreshCcw,
//   Sun,
//   UploadCloud,
//   User,
//   Wallet,
//   XCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../services/api";
// import { getAuthUser, removeToken } from "../services/auth";

// type Employee = {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
//   salaryInHand?: number;
//   preApprovedLimit?: number;
//   availableLimit?: number;
//   status?: string;
//   activationStatus?: string;
//   employer?: { companyName?: string };
// };

// type AdvanceRequest = {
//   id: string;
//   amount: number;
//   status: string;
//   requestMonth?: number;
//   requestYear?: number;
//   createdAt?: string;
//   employerRemarks?: string;
//   repayment?: {
//     amount?: number;
//     status?: string;
//     dueDate?: string;
//   };
// };

// type DocumentStatus =
//   | "NOT_UPLOADED"
//   | "PENDING_VERIFICATION"
//   | "VERIFIED"
//   | "REJECTED";

// type DocumentVerification = {
//   id?: string;
//   status: DocumentStatus;
//   message?: string;
//   adminRemarks?: string;
// };

// type Tab = "HOME" | "REQUEST" | "HISTORY" | "PROFILE";

// export function DashboardPage() {
//   const navigate = useNavigate();
//   const authUser = getAuthUser();

//   const [employee, setEmployee] = useState<Employee | null>(null);
//   const [requests, setRequests] = useState<AdvanceRequest[]>([]);
//   const [documentStatus, setDocumentStatus] =
//     useState<DocumentVerification | null>(null);

//   const [amount, setAmount] = useState("");
//   const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
//   const [panFile, setPanFile] = useState<File | null>(null);
//   const [bankStatementFile, setBankStatementFile] = useState<File | null>(null);

//   const [activeTab, setActiveTab] = useState<Tab>("HOME");
//   const [loading, setLoading] = useState(true);
//   const [requesting, setRequesting] = useState(false);
//   const [uploadingDocs, setUploadingDocs] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("mobpae_employee_theme");
//     const shouldUseDark = savedTheme === "dark";
//     setIsDarkMode(shouldUseDark);
//     document.documentElement.classList.toggle("dark", shouldUseDark);
//   }, []);

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   function toggleDarkMode() {
//     const next = !isDarkMode;
//     setIsDarkMode(next);
//     localStorage.setItem("mobpae_employee_theme", next ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", next);
//   }

//   function unwrap(response: any) {
//     return (
//       response?.data?.data?.data ||
//       response?.data?.data?.items ||
//       response?.data?.data ||
//       response?.data ||
//       null
//     );
//   }

//   function unwrapList(response: any) {
//     const data = unwrap(response);
//     return Array.isArray(data) ? data : [];
//   }

//   async function fetchDashboard() {
//     setLoading(true);
//     setError("");

//     try {
//       const [employeeRes, requestsRes, documentRes] = await Promise.all([
//         api.get(`/employees/${authUser?.employeeId}`),
//         api.get("/advance-requests"),
//         api.get("/employee-documents/me"),
//       ]);

//       setEmployee(unwrap(employeeRes));
//       setRequests(unwrapList(requestsRes));
//       setDocumentStatus(unwrap(documentRes));
//     } catch {
//       setError("Unable to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const activeRequest = requests.find(
//     (item) =>
//       ["PENDING", "APPROVED"].includes(item.status) &&
//       item.repayment?.status !== "PAID"
//   );

//   const isRequestBlocked = Boolean(activeRequest);
//   const isDocumentVerified = documentStatus?.status === "VERIFIED";
//   const shouldUploadDocuments =
//     documentStatus?.status === "NOT_UPLOADED" ||
//     documentStatus?.status === "REJECTED";
//   const isDocumentPending = documentStatus?.status === "PENDING_VERIFICATION";
//   const latestRequest = requests[0];

//   const summary = useMemo(() => {
//     return {
//       pending: requests.filter((item) => item.status === "PENDING").length,
//       approved: requests.filter((item) => item.status === "APPROVED").length,
//       rejected: requests.filter((item) => item.status === "REJECTED").length,
//     };
//   }, [requests]);

//   function formatAmount(value?: number) {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(Number(value || 0));
//   }

//   function getInitials(name?: string) {
//     if (!name) return "ME";

//     return name
//       .split(" ")
//       .map((item) => item[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase();
//   }

//   function getGreeting() {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good morning";
//     if (hour < 17) return "Good afternoon";
//     return "Good evening";
//   }

//   function getDocumentBadgeLabel(status?: DocumentStatus) {
//     switch (status) {
//       case "VERIFIED":
//         return "Verified";
//       case "PENDING_VERIFICATION":
//         return "In review";
//       case "REJECTED":
//         return "Needs update";
//       default:
//         return "Verify document";
//     }
//   }

//   function getStatusClass(status?: string) {
//     switch (status) {
//       case "APPROVED":
//       case "VERIFIED":
//         return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
//       case "REJECTED":
//       case "CANCELLED":
//         return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300";
//       case "PENDING":
//       case "PENDING_VERIFICATION":
//         return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
//       default:
//         return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
//     }
//   }

//   async function handleUploadDocuments(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!aadhaarFile || !panFile || !bankStatementFile) {
//       setError("Please upload Aadhaar, PAN and bank statement.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("aadhaar", aadhaarFile);
//     formData.append("pan", panFile);
//     formData.append("bankStatement", bankStatementFile);

//     setUploadingDocs(true);

//     try {
//       await api.post("/employee-documents/me/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setAadhaarFile(null);
//       setPanFile(null);
//       setBankStatementFile(null);
//       setSuccess("Documents uploaded. Waiting for verification.");
//       await fetchDashboard();

//       setTimeout(() => {
//         setSuccess("");
//       }, 3000);
//     } catch (err: any) {
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Unable to upload documents";

//       setError(Array.isArray(message) ? message[0] : message);
//     } finally {
//       setUploadingDocs(false);
//     }
//   }

//   async function handleRequestAdvance(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (isRequestBlocked) return;

//     if (!isDocumentVerified) {
//       setError("Document verification is required before requesting advance.");
//       return;
//     }

//     const requestAmount = Number(amount);

//     if (!authUser?.employeeId) {
//       setError("Employee ID not found. Please login again.");
//       return;
//     }

//     if (!requestAmount || requestAmount <= 0) {
//       setError("Enter a valid amount.");
//       return;
//     }

//     if (requestAmount > Number(employee?.availableLimit || 0)) {
//       setError("Requested amount exceeds available limit.");
//       return;
//     }

//     setRequesting(true);

//     try {
//       await api.post("/advance-requests", {
//         employeeId: authUser.employeeId,
//         amount: requestAmount,
//       });

//       setAmount("");
//       setSuccess("Advance request submitted successfully.");
//       await fetchDashboard();
//       setActiveTab("HOME");
//     } catch (err: any) {
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Unable to submit request";

//       setError(Array.isArray(message) ? message[0] : message);
//     } finally {
//       setRequesting(false);
//     }
//   }

//   function handleLogout() {
//     removeToken();
//     navigate("/login", { replace: true });
//   }

//   if (loading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#f6f8fc] p-6 dark:bg-slate-950">
//         <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
//           <Loader2 className="animate-spin text-blue-600" size={16} />
//           Loading...
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-[#f6f8fc] pb-24 text-slate-950 dark:bg-slate-950 dark:text-white">
//       <div className="mx-auto max-w-md px-4 pt-6">
//         {success && <Alert type="success" message={success} />}
//         {error && <Alert type="error" message={error} />}

//         {activeTab === "HOME" && (
//           <div className="space-y-4">
//             <header className="flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <h1 className="text-[24px] font-semibold tracking-tight">
//                   Hi, {employee?.name || authUser?.name || "Employee"} 👋
//                 </h1>

//                 <p className="mt-1 text-[14px] font-medium text-slate-500 dark:text-slate-400">
//                   {getGreeting()}
//                 </p>

//                 <div className="mt-2.5 flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
//                   <Building2 size={15} />
//                   <span className="truncate">
//                     {employee?.employer?.companyName || "Your Company"}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex shrink-0 items-center gap-3">
//                 <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//                   <Bell size={18} />
//                   <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
//                 </button>

//                 <button
//                   onClick={() => setActiveTab("PROFILE")}
//                   className="flex h-13 w-13 items-center justify-center rounded-full bg-blue-50 px-4 py-4 text-base font-bold text-blue-600 shadow-sm ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
//                 >
//                   {getInitials(employee?.name || authUser?.name)}
//                 </button>
//               </div>
//             </header>

//             <section className="overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e40af] text-white shadow-lg shadow-blue-900/15">
//               <div className="grid grid-cols-[1fr_auto] gap-2 p-4">
//                 <div>
//                   <p className="text-[12px] font-semibold text-blue-100">
//                     Available Limit
//                   </p>

//                   <h2 className="mt-2 text-[30px] font-bold tracking-tight">
//                     {formatAmount(employee?.availableLimit)}
//                   </h2>

//                   <p className="mt-2 text-[12px] font-medium text-blue-100">
//                     Pre-approved{" "}
//                     <span className="font-bold text-white">
//                       {formatAmount(employee?.preApprovedLimit)}
//                     </span>
//                   </p>

//                   <button
//                     onClick={() => setActiveTab("REQUEST")}
//                     className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-[11px] font-bold text-blue-700 shadow-sm active:scale-95"
//                   >
//                     <Wallet size={14} />
//                     Request Advance
//                   </button>
//                 </div>

//                 <WalletIllustration />
//               </div>

//               <div className="border-t border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
//                       <FileCheck2 size={17} />
//                     </span>

//                     <div>
//                       <p className="text-[11px] font-semibold text-blue-100">
//                         Document Status
//                       </p>

//                       <p className="mt-0.5 text-[13px] font-bold text-white">
//                         {getDocumentBadgeLabel(documentStatus?.status)}
//                       </p>
//                     </div>
//                   </div>

//                   {isDocumentVerified && (
//                     <CheckCircle2 size={21} className="text-white" />
//                   )}
//                 </div>
//               </div>
//             </section>

//             <section>
//               <h2 className="mb-3 text-[15px] font-bold tracking-tight">
//                 Quick Overview
//               </h2>

//               <div className="grid grid-cols-3 gap-2.5">
//                 <MetricCard
//                   label="Salary"
//                   value={formatAmount(employee?.salaryInHand)}
//                   icon={<Wallet size={17} />}
//                   tone="blue"
//                 />

//                 <MetricCard
//                   label="Requests"
//                   value={`${requests.length}`}
//                   icon={<FileText size={17} />}
//                   tone="purple"
//                 />

//                 <MetricCard
//                   label="Active"
//                   value={activeRequest ? "1" : "0"}
//                   icon={<Clock3 size={17} />}
//                   tone="orange"
//                 />
//               </div>
//             </section>

//             <section>
//               <div className="mb-3 flex items-center justify-between">
//                 <h2 className="text-[15px] font-bold tracking-tight">
//                   Recent Activity
//                 </h2>

//                 <button
//                   onClick={() => setActiveTab("HISTORY")}
//                   className="text-[12px] font-bold text-blue-600 dark:text-blue-300"
//                 >
//                   View All
//                 </button>
//               </div>

//               <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//                 {latestRequest ? (
//                   <RequestRow
//                     item={latestRequest}
//                     formatAmount={formatAmount}
//                   />
//                 ) : (
//                   <EmptyState text="No advance request yet." />
//                 )}
//               </div>
//             </section>
//           </div>
//         )}

//         {activeTab === "REQUEST" && (
//           <div className="space-y-4">
//             <PageHeader title="Request" subtitle="Salary advance" />

//             <VerificationCard
//               status={documentStatus?.status || "NOT_UPLOADED"}
//               remarks={documentStatus?.adminRemarks}
//             />

//             {shouldUploadDocuments && (
//               <form onSubmit={handleUploadDocuments}>
//                 <section className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//                   <div className="mb-4 flex items-center justify-between">
//                     <div>
//                       <h2 className="text-sm font-semibold">
//                         Upload documents
//                       </h2>
//                       <p className="mt-1 text-[11px] text-slate-400">
//                         PDF, PNG, JPG or JPEG only
//                       </p>
//                     </div>

//                     <UploadCloud size={20} className="text-blue-600" />
//                   </div>

//                   <div className="grid gap-3">
//                     <FileInput
//                       label="Aadhaar"
//                       file={aadhaarFile}
//                       onChange={(file) => {
//                         setAadhaarFile(file);
//                         setError("");
//                       }}
//                     />

//                     <FileInput
//                       label="PAN"
//                       file={panFile}
//                       onChange={(file) => {
//                         setPanFile(file);
//                         setError("");
//                       }}
//                     />

//                     <FileInput
//                       label="Bank statement"
//                       file={bankStatementFile}
//                       onChange={(file) => {
//                         setBankStatementFile(file);
//                         setError("");
//                       }}
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={uploadingDocs}
//                     className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-blue-500/20 disabled:opacity-60"
//                   >
//                     {uploadingDocs && (
//                       <Loader2 className="animate-spin" size={15} />
//                     )}
//                     {uploadingDocs ? "Uploading..." : "Submit documents"}
//                   </button>
//                 </section>
//               </form>
//             )}

//             {isDocumentPending && (
//               <Alert
//                 type="success"
//                 message="Documents are under verification. Advance request will unlock after admin approval."
//               />
//             )}

//             <form onSubmit={handleRequestAdvance}>
//               <section className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-sm font-semibold">Advance amount</h2>
//                     <p className="mt-1 text-[11px] text-slate-400">
//                       Available {formatAmount(employee?.availableLimit)}
//                     </p>
//                   </div>

//                   <Wallet size={20} className="text-blue-600" />
//                 </div>

//                 {!isDocumentVerified && (
//                   <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
//                     Complete document verification before requesting.
//                   </p>
//                 )}

//                 {isRequestBlocked && (
//                   <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
//                     Your current request is under review. You can request again
//                     after repayment is cleared.
//                   </p>
//                 )}

//                 <div className="relative mt-4">
//                   <IndianRupee
//                     className="absolute left-4 top-3 text-slate-400"
//                     size={16}
//                   />

//                   <input
//                     value={amount}
//                     onChange={(event) => setAmount(event.target.value)}
//                     type="number"
//                     min="1"
//                     max={employee?.availableLimit || 0}
//                     placeholder={
//                       isRequestBlocked
//                         ? "Request already submitted"
//                         : !isDocumentVerified
//                         ? "Verification required"
//                         : "Enter amount"
//                     }
//                     disabled={isRequestBlocked || !isDocumentVerified}
//                     className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={
//                     requesting ||
//                     isRequestBlocked ||
//                     !isDocumentVerified ||
//                     Number(employee?.availableLimit || 0) <= 0
//                   }
//                   className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-blue-500/20 disabled:bg-slate-300 disabled:text-slate-500 dark:bg-blue-500 dark:text-white dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
//                 >
//                   {requesting && <Loader2 className="animate-spin" size={15} />}
//                   {requesting
//                     ? "Submitting..."
//                     : isRequestBlocked
//                     ? "Request already submitted"
//                     : !isDocumentVerified
//                     ? "Verification required"
//                     : "Submit request"}
//                 </button>
//               </section>
//             </form>
//           </div>
//         )}

//         {activeTab === "HISTORY" && (
//           <div className="space-y-4">
//             <PageHeader title="History" subtitle="Your advance requests" />

//             <section className="grid grid-cols-3 gap-2">
//               <MiniStat label="Pending" value={summary.pending} />
//               <MiniStat label="Approved" value={summary.approved} />
//               <MiniStat label="Rejected" value={summary.rejected} />
//             </section>

//             <section className="space-y-3">
//               {requests.map((item) => (
//                 <RequestCard
//                   key={item.id}
//                   item={item}
//                   formatAmount={formatAmount}
//                   getStatusClass={getStatusClass}
//                 />
//               ))}

//               {requests.length === 0 && (
//                 <EmptyState text="No advance requests yet." />
//               )}
//             </section>
//           </div>
//         )}

//         {activeTab === "PROFILE" && (
//           <div className="space-y-4">
//             <PageHeader title="Profile" subtitle="Account settings" />

//             <section className="rounded-[1.5rem] bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600 dark:bg-blue-500/10">
//                 {getInitials(employee?.name || authUser?.name)}
//               </div>

//               <h2 className="mt-3 text-lg font-semibold">
//                 {employee?.name || authUser?.name || "Employee"}
//               </h2>

//               <p className="mt-1 text-xs text-slate-400">{employee?.email}</p>

//               <div className="mt-5 grid gap-2 text-left">
//                 <ProfileRow
//                   label="Company"
//                   value={employee?.employer?.companyName}
//                 />
//                 <ProfileRow label="Status" value={employee?.status} />
//                 <ProfileRow
//                   label="Activation"
//                   value={employee?.activationStatus}
//                 />
//                 <ProfileRow
//                   label="Document Status"
//                   value={getDocumentBadgeLabel(documentStatus?.status)}
//                 />
//               </div>

//               <button
//                 onClick={toggleDarkMode}
//                 className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
//               >
//                 <span className="flex items-center gap-2">
//                   {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
//                   Dark mode
//                 </span>

//                 <span
//                   className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
//                     isDarkMode ? "bg-blue-600" : "bg-slate-300"
//                   }`}
//                 >
//                   <span
//                     className={`h-4 w-4 rounded-full bg-white transition ${
//                       isDarkMode ? "translate-x-5" : "translate-x-0"
//                     }`}
//                   />
//                 </span>
//               </button>

//               <div className="mt-3 grid grid-cols-2 gap-2">
//                 <button
//                   onClick={fetchDashboard}
//                   className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
//                 >
//                   <RefreshCcw size={14} />
//                   Refresh
//                 </button>

//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-3 py-3 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-300"
//                 >
//                   <LogOut size={14} />
//                   Logout
//                 </button>
//               </div>
//             </section>
//           </div>
//         )}
//       </div>

//       <BottomNav
//         activeTab={activeTab}
//         setActiveTab={(tab) => {
//           setSuccess("");
//           setError("");
//           setActiveTab(tab);
//         }}
//       />
//     </main>
//   );
// }

// function WalletIllustration() {
//   return (
//     <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-white/15">
//       <div className="relative">
//         <div className="absolute -top-5 left-3 flex gap-1">
//           <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-[10px] font-bold text-blue-900">
//             ₹
//           </span>
//           <span className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-blue-900">
//             ₹
//           </span>
//         </div>

//         <div className="relative h-12 w-16 rounded-xl bg-white shadow-lg shadow-blue-950/20">
//           <div className="absolute right-0 top-3.5 h-6 w-7 rounded-l-lg bg-blue-100">
//             <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-300" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MetricCard({
//   icon,
//   label,
//   value,
//   tone,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   tone: "blue" | "purple" | "orange";
// }) {
//   const toneClass = {
//     blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
//     purple:
//       "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
//     orange:
//       "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
//   }[tone];

//   return (
//     <div className="rounded-[1.3rem] bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//       <div
//         className={`mx-auto flex h-9 w-9 items-center justify-center rounded-2xl ${toneClass}`}
//       >
//         {icon}
//       </div>

//       <p className="mt-3 text-[10px] font-medium text-slate-400">{label}</p>
//       <h3 className="mt-1 truncate text-[13px] font-bold">{value}</h3>
//     </div>
//   );
// }

// function VerificationCard({
//   status,
//   remarks,
// }: {
//   status: DocumentStatus;
//   remarks?: string | null;
// }) {
//   const verified = status === "VERIFIED";
//   const rejected = status === "REJECTED";
//   const pending = status === "PENDING_VERIFICATION";

//   return (
//     <section className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//       <div className="flex items-start gap-3">
//         <div
//           className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
//             verified
//               ? "bg-emerald-50 text-emerald-600"
//               : rejected
//               ? "bg-red-50 text-red-600"
//               : pending
//               ? "bg-amber-50 text-amber-600"
//               : "bg-blue-50 text-blue-600"
//           }`}
//         >
//           {verified ? (
//             <CheckCircle2 size={19} />
//           ) : rejected ? (
//             <XCircle size={19} />
//           ) : pending ? (
//             <Clock3 size={19} />
//           ) : (
//             <FileCheck2 size={19} />
//           )}
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="text-sm font-semibold">Document verification</p>
//           <p className="mt-1 text-[11px] leading-5 text-slate-400">
//             {verified
//               ? "Your documents are verified. You can request advance."
//               : rejected
//               ? remarks || "Documents need an update. Please upload again."
//               : pending
//               ? "Documents submitted. Waiting for admin verification."
//               : "Upload documents once to unlock advance requests."}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

// function RequestRow({
//   item,
//   formatAmount,
// }: {
//   item: AdvanceRequest;
//   formatAmount: (value?: number) => string;
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
//       <div>
//         <p className="text-sm font-semibold">{formatAmount(item.amount)}</p>
//         <p className="mt-1 text-[11px] text-slate-400">
//           {item.createdAt
//             ? new Date(item.createdAt).toLocaleDateString()
//             : `${item.requestMonth || "-"} / ${item.requestYear || "-"}`}
//         </p>
//       </div>

//       <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
//         {item.status}
//       </span>
//     </div>
//   );
// }

// function RequestCard({
//   item,
//   formatAmount,
//   getStatusClass,
// }: {
//   item: AdvanceRequest;
//   formatAmount: (value?: number) => string;
//   getStatusClass: (status?: string) => string;
// }) {
//   return (
//     <div className="rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-base font-semibold">{formatAmount(item.amount)}</p>
//           <p className="mt-1 text-[11px] text-slate-400">
//             {item.createdAt
//               ? new Date(item.createdAt).toLocaleDateString()
//               : `${item.requestMonth || "-"} / ${item.requestYear || "-"}`}
//           </p>
//         </div>

//         <span
//           className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClass(
//             item.status
//           )}`}
//         >
//           {item.status}
//         </span>
//       </div>

//       {item.repayment && (
//         <p className="mt-3 text-[11px] font-medium text-slate-400">
//           Repayment {formatAmount(item.repayment.amount)} •{" "}
//           {item.repayment.status || "-"}
//         </p>
//       )}
//     </div>
//   );
// }

// function MiniStat({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="rounded-[1.2rem] bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
//       <p className="text-[10px] font-medium text-slate-400">{label}</p>
//       <h3 className="mt-1 text-lg font-semibold">{value}</h3>
//     </div>
//   );
// }

// function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
//   return (
//     <header>
//       <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>
//       <h1 className="mt-0.5 text-[22px] font-semibold tracking-tight">
//         {title}
//       </h1>
//     </header>
//   );
// }

// function ProfileRow({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
//       <span className="text-[11px] font-medium text-slate-400">{label}</span>
//       <span className="max-w-[180px] truncate text-xs font-bold text-slate-800 dark:text-white">
//         {value || "-"}
//       </span>
//     </div>
//   );
// }

// function FileInput({
//   label,
//   file,
//   onChange,
// }: {
//   label: string;
//   file: File | null;
//   onChange: (file: File | null) => void;
// }) {
//   return (
//     <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-950">
//       <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
//         <FileText size={15} className="shrink-0 text-blue-600" />

//         <span className="min-w-0">
//           <span className="block">{label}</span>

//           {file ? (
//             <span className="mt-0.5 block max-w-[180px] truncate text-[10px] font-semibold text-emerald-600">
//               {file.name}
//             </span>
//           ) : (
//             <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
//               PDF, PNG, JPG
//             </span>
//           )}
//         </span>
//       </span>

//       <input
//         type="file"
//         accept=".pdf,.png,.jpg,.jpeg"
//         onChange={(event) => {
//           const selectedFile = event.target.files?.[0] || null;
//           onChange(selectedFile);
//         }}
//         className="hidden"
//       />

//       <span
//         className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
//           file
//             ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
//             : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
//         }`}
//       >
//         {file ? "Selected" : "Choose"}
//       </span>
//     </label>
//   );
// }

// function Alert({
//   type,
//   message,
// }: {
//   type: "success" | "error";
//   message: string;
// }) {
//   return (
//     <div
//       className={`mb-3 rounded-2xl px-4 py-3 text-xs font-semibold ${
//         type === "success"
//           ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
//           : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
//       }`}
//     >
//       {message}
//     </div>
//   );
// }

// function EmptyState({ text }: { text: string }) {
//   return (
//     <div className="rounded-2xl bg-slate-50 p-5 text-center text-xs font-medium text-slate-400 dark:bg-slate-800">
//       {text}
//     </div>
//   );
// }

// function BottomNav({
//   activeTab,
//   setActiveTab,
// }: {
//   activeTab: Tab;
//   setActiveTab: (tab: Tab) => void;
// }) {
//   const items = [
//     { label: "Home", value: "HOME" as Tab, icon: Home },
//     { label: "Request", value: "REQUEST" as Tab, icon: Plus },
//     { label: "History", value: "HISTORY" as Tab, icon: Clock3 },
//     { label: "Profile", value: "PROFILE" as Tab, icon: User },
//   ];

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 px-5 pb-3">
//       <div className="mx-auto grid max-w-[360px] grid-cols-4 rounded-[1.25rem] border border-slate-100 bg-white/95 p-1.5 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none">
//         {items.map((item) => {
//           const Icon = item.icon;
//           const active = activeTab === item.value;

//           return (
//             <button
//               key={item.value}
//               onClick={() => setActiveTab(item.value)}
//               className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5 text-[9px] font-bold transition ${
//                 active ? "text-blue-600" : "text-slate-400"
//               }`}
//             >
//               <Icon size={16} strokeWidth={active ? 2.8 : 2.2} />
//               {item.label}

//               {active && (
//                 <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-600" />
//               )}
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }

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
    setLoading(true);
    setError("");

    try {
      const [employeeRes, requestsRes, documentRes] = await Promise.all([
        api.get(`/employees/${authUser?.employeeId}`),
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

      setTimeout(() => setSuccess(""), 3000);
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] pb-24 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-md px-4 pt-6">
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

      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSuccess("");
          setError("");
          setActiveTab(tab);
        }}
      />
    </main>
  );
}
