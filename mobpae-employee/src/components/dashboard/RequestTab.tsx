import type { FormEvent } from "react";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  IndianRupee,
  Loader2,
  ShieldCheck,
  UploadCloud,
  Wallet,
  XCircle,
} from "lucide-react";
import type {
  DocumentStatus,
  DocumentVerification,
  Employee,
} from "../../types/dashboard";
import { formatAmount } from "./DashboardUI";

export function RequestTab({
  employee,
  documentStatus,
  amount,
  setAmount,
  aadhaarFile,
  setAadhaarFile,
  panFile,
  setPanFile,
  bankStatementFile,
  setBankStatementFile,
  shouldUploadDocuments,
  isDocumentPending,
  isDocumentVerified,
  isRequestBlocked,
  uploadingDocs,
  requesting,
  handleUploadDocuments,
  handleRequestAdvance,
  clearError,
}: {
  employee: Employee | null;
  documentStatus: DocumentVerification | null;
  amount: string;
  setAmount: (value: string) => void;
  aadhaarFile: File | null;
  setAadhaarFile: (file: File | null) => void;
  panFile: File | null;
  setPanFile: (file: File | null) => void;
  bankStatementFile: File | null;
  setBankStatementFile: (file: File | null) => void;
  shouldUploadDocuments: boolean;
  isDocumentPending: boolean;
  isDocumentVerified: boolean;
  isRequestBlocked: boolean;
  uploadingDocs: boolean;
  requesting: boolean;
  handleUploadDocuments: (event: FormEvent<HTMLFormElement>) => void;
  handleRequestAdvance: (event: FormEvent<HTMLFormElement>) => void;
  clearError: () => void;
}) {
  const status = (documentStatus?.status || "NOT_UPLOADED") as DocumentStatus;

  return (
    <div className="space-y-3">
      {!isDocumentVerified && <DocumentStepper />}

      <header className={isDocumentVerified ? "pt-1" : "-mt-1"}>
        <h1 className="text-[23px] font-black tracking-tight">
          {isDocumentVerified ? "Request Advance" : "Almost there!"}
        </h1>

        <p className="mt-1 text-[12px] font-medium leading-5 text-slate-500 dark:text-slate-400">
          {isDocumentVerified
            ? "Enter the amount you need from your available limit."
            : "Upload your documents below to verify your identity."}
        </p>
      </header>

      <DocumentHeroCard
        status={status}
        remarks={documentStatus?.adminRemarks}
      />

      {shouldUploadDocuments && (
        <form onSubmit={handleUploadDocuments}>
          <section className="rounded-[1.35rem] bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-black">Required Documents</h2>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  PDF, PNG, JPG accepted
                </p>
              </div>

              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <UploadCloud size={17} />
              </span>
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-slate-100 dark:border-slate-800">
              <CompactFileInput
                label="Aadhaar"
                description="Upload Aadhaar card"
                file={aadhaarFile}
                onChange={(file) => {
                  setAadhaarFile(file);
                  clearError();
                }}
              />

              <CompactFileInput
                label="PAN"
                description="Upload PAN card"
                file={panFile}
                onChange={(file) => {
                  setPanFile(file);
                  clearError();
                }}
              />

              <CompactFileInput
                label="Bank Statement"
                description="Latest bank statement"
                file={bankStatementFile}
                onChange={(file) => {
                  setBankStatementFile(file);
                  clearError();
                }}
                last
              />
            </div>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-400">
              <ShieldCheck size={12} />
              Your data is encrypted and secure
            </p>

            <button
              type="submit"
              disabled={uploadingDocs}
              className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-[14px] bg-blue-600 px-4 text-[12px] font-black text-white shadow-md shadow-blue-600/20 disabled:opacity-60"
            >
              {uploadingDocs && <Loader2 className="animate-spin" size={15} />}
              {uploadingDocs ? "Uploading..." : "Upload Documents"}
            </button>
          </section>
        </form>
      )}

      {isDocumentPending && (
        <InfoBanner
          icon={<Clock3 size={17} />}
          title="Documents under review"
          text="Advance request will unlock after admin approval."
          tone="amber"
        />
      )}

      <form onSubmit={handleRequestAdvance}>
        <section className="rounded-[1.35rem] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-black">Advance Amount</h2>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Available {formatAmount(employee?.availableLimit)}
              </p>
            </div>

            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              <Wallet size={18} />
            </span>
          </div>

          {!isDocumentVerified && (
            <InfoBanner
              icon={<ShieldCheck size={17} />}
              title="Verification required"
              text="Complete document verification before requesting advance."
              tone="blue"
            />
          )}

          {isRequestBlocked && (
            <InfoBanner
              icon={<Clock3 size={17} />}
              title="Request already submitted"
              text="You can request again after repayment is cleared."
              tone="blue"
            />
          )}

          <div className="relative mt-3">
            <IndianRupee
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />

            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="1"
              max={employee?.availableLimit || 0}
              placeholder={
                isRequestBlocked
                  ? "Request already submitted"
                  : !isDocumentVerified
                  ? "Verification required"
                  : "Enter amount"
              }
              disabled={isRequestBlocked || !isDocumentVerified}
              className="h-10 w-full rounded-[14px] border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13px] font-bold outline-none placeholder:text-[12px] placeholder:font-semibold placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
            />
          </div>

          <button
            type="submit"
            disabled={
              requesting ||
              isRequestBlocked ||
              !isDocumentVerified ||
              Number(employee?.availableLimit || 0) <= 0
            }
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[14px] bg-blue-600 px-4 text-[12px] font-black text-white shadow-md shadow-blue-600/20 disabled:bg-slate-300 disabled:text-slate-500 dark:bg-blue-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            {requesting && <Loader2 className="animate-spin" size={15} />}
            {requesting
              ? "Submitting..."
              : isRequestBlocked
              ? "Request already submitted"
              : !isDocumentVerified
              ? "Verification required"
              : "Submit Request"}
          </button>
        </section>
      </form>
    </div>
  );
}

function DocumentStepper() {
  return (
    <section className="pt-1">
      <h2 className="text-center text-[16px] font-black">Verify You First</h2>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
        <StepCircle active done label="Identity" />
        <div className="h-px bg-blue-600" />
        <StepCircle active label="Documents" />
        <div className="h-px bg-slate-200 dark:bg-slate-800" />
        <StepCircle label="Review" />
      </div>
    </section>
  );
}

function StepCircle({
  active,
  done,
  label,
}: {
  active?: boolean;
  done?: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
        }`}
      >
        {done ? <CheckCircle2 size={15} /> : label === "Documents" ? "2" : "3"}
      </span>

      <span className="mt-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

function CompactFileInput({
  label,
  description,
  file,
  onChange,
  last,
}: {
  label: string;
  description: string;
  file: File | null;
  onChange: (file: File | null) => void;
  last?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 bg-white px-3 py-2.5 transition active:scale-[0.99] dark:bg-slate-900 ${
        last ? "" : "border-b border-slate-100 dark:border-slate-800"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
          <FileCheck2 size={16} />
        </span>

        <span className="min-w-0">
          <span className="block text-[13px] font-black text-slate-900 dark:text-white">
            {label}
          </span>

          <span
            className={`mt-0.5 block max-w-[170px] truncate text-[10px] font-semibold ${
              file ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {file ? file.name : description}
          </span>
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
        className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black ${
          file
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "bg-slate-50 text-blue-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
        }`}
      >
        {file ? "Selected" : "Upload"}
      </span>
    </label>
  );
}

function DocumentHeroCard({
  status,
  remarks,
}: {
  status: DocumentStatus;
  remarks?: string | null;
}) {
  const verified = status === "VERIFIED";
  const rejected = status === "REJECTED";
  const pending = status === "PENDING_VERIFICATION";

  if (status === "NOT_UPLOADED") return null;

  const icon = verified ? (
    <CheckCircle2 size={20} />
  ) : rejected ? (
    <XCircle size={20} />
  ) : pending ? (
    <Clock3 size={20} />
  ) : (
    <FileCheck2 size={20} />
  );

  const title = verified
    ? "Documents Verified"
    : rejected
    ? "Documents Rejected"
    : pending
    ? "Verification Pending"
    : "Verify Your Documents";

  const text = verified
    ? "You can now request salary advance."
    : rejected
    ? remarks || "Please upload your documents again."
    : pending
    ? "Your documents are submitted and waiting for admin approval."
    : "Upload Aadhaar, PAN and bank statement to unlock advance request.";

  return (
    <section className="overflow-hidden rounded-[1.35rem] bg-[#061b3d] p-3.5 text-white shadow-xl shadow-blue-950/15">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-black">{title}</p>
          <p className="mt-0.5 text-[11px] leading-4 text-blue-100">{text}</p>
        </div>
      </div>
    </section>
  );
}

function InfoBanner({
  icon,
  title,
  text,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone: "blue" | "amber";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
      : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";

  return (
    <div className={`mt-3 flex gap-2.5 rounded-[14px] p-2.5 ${toneClass}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>

      <div>
        <p className="text-[12px] font-black">{title}</p>
        <p className="mt-0.5 text-[11px] font-semibold leading-4 opacity-80">
          {text}
        </p>
      </div>
    </div>
  );
}
