export type Employee = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  salaryInHand?: number;
  preApprovedLimit?: number;
  availableLimit?: number;
  status?: string;
  activationStatus?: string;
  employer?: { companyName?: string };
};

export type AdvanceRequest = {
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

export type DocumentStatus =
  | "NOT_UPLOADED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED";

export type DocumentVerification = {
  id?: string;
  status: DocumentStatus;
  message?: string;
  adminRemarks?: string;
};

export type Tab = "HOME" | "REQUEST" | "HISTORY" | "PROFILE";
