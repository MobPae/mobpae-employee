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
import { FileInput, formatAmount } from "./DashboardUI";

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
    <div className="space-y-4">
      <header>
        <p className="text-[12px] font-bold text-blue-600 dark:text-blue-300">
          Salary Advance
        </p>
        <h1 className="mt-1 text-[24px] font-black tracking-tight">
          Request Money
        </h1>
        <p className="mt-1 text-[12px] font-medium text-slate-400">
          Verify documents and request from your available limit.
        </p>
      </header>

      <DocumentHeroCard
        status={status}
        remarks={documentStatus?.adminRemarks}
      />

      {shouldUploadDocuments && (
        <form onSubmit={handleUploadDocuments}>
          <section className="rounded-[1.55rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-black">Upload Documents</h2>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  Aadhaar, PAN and bank statement required
                </p>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <UploadCloud size={19} />
              </span>
            </div>

            <div className="grid gap-3">
              <FileInput
                label="Aadhaar"
                file={aadhaarFile}
                onChange={(file) => {
                  setAadhaarFile(file);
                  clearError();
                }}
              />

              <FileInput
                label="PAN"
                file={panFile}
                onChange={(file) => {
                  setPanFile(file);
                  clearError();
                }}
              />

              <FileInput
                label="Bank statement"
                file={bankStatementFile}
                onChange={(file) => {
                  setBankStatementFile(file);
                  clearError();
                }}
              />
            </div>

            <button
              type="submit"
              disabled={uploadingDocs}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[1rem] bg-blue-600 px-4 text-[13px] font-black text-white shadow-md shadow-blue-600/20 disabled:opacity-60"
            >
              {uploadingDocs && <Loader2 className="animate-spin" size={15} />}
              {uploadingDocs ? "Uploading..." : "Submit Documents"}
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
        <section className="rounded-[1.55rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-black">Advance Amount</h2>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                Available {formatAmount(employee?.availableLimit)}
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              <Wallet size={19} />
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

          <div className="relative mt-4">
            <IndianRupee
              className="absolute left-4 top-3.5 text-slate-400"
              size={16}
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
              className="h-11 w-full rounded-[1rem] border border-slate-200 bg-slate-50 pl-10 pr-4 text-[14px] font-bold outline-none placeholder:text-[12px] placeholder:font-semibold placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
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
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[1rem] bg-blue-600 px-4 text-[13px] font-black text-white shadow-md shadow-blue-600/20 disabled:bg-slate-300 disabled:text-slate-500 dark:bg-blue-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
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

  const icon = verified ? (
    <CheckCircle2 size={22} />
  ) : rejected ? (
    <XCircle size={22} />
  ) : pending ? (
    <Clock3 size={22} />
  ) : (
    <FileCheck2 size={22} />
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
    : "Upload your Aadhaar, PAN and bank statement to unlock advance request.";

  return (
    <section className="overflow-hidden rounded-[1.55rem] bg-[#061b3d] p-4 text-white shadow-xl shadow-blue-950/15">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-black">{title}</p>
          <p className="mt-1 text-[11px] leading-5 text-blue-100">{text}</p>
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
    <div className={`mt-4 flex gap-3 rounded-[1rem] p-3 ${toneClass}`}>
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
