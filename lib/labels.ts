import { BillingStatus, PaymentStatus, ProjectStatus } from "@prisma/client";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  WAITING_REVIEW: "確認待ち",
  DELIVERED: "納品済み",
  INVOICED: "請求済み",
  PAID: "入金済み",
};

export const billingStatusLabels: Record<BillingStatus, string> = {
  NOT_BILLED: "未請求",
  BILLING_PLANNED: "請求予定",
  BILLED: "請求済み",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  UNPAID: "未入金",
  PARTIAL: "一部入金",
  PAID: "入金済み",
};
