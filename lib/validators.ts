import { BillingStatus, PaymentStatus, ProjectStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .optional()
  .transform((value) => (value ? new Date(value) : null));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null)
  .pipe(z.string().url("URLの形式で入力してください").nullable());

export const projectSchema = z.object({
  title: z.string().trim().min(1, "案件名は必須です").max(120),
  clientName: z.string().trim().min(1, "クライアント名は必須です").max(120),
  amount: z.coerce.number().int().min(0, "契約金額は0以上で入力してください"),
  dueDate: optionalDate,
  status: z.nativeEnum(ProjectStatus),
  billingStatus: z.nativeEnum(BillingStatus),
  paymentStatus: z.nativeEnum(PaymentStatus),
  memo: z.string().trim().optional().transform((value) => value || null),
  fileUrl: optionalUrl,
  referenceUrl: optionalUrl,
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, "タスク名は必須です").max(120),
  dueDate: optionalDate,
  memo: z.string().trim().optional().transform((value) => value || null),
});

export const settingsSchema = z.object({
  businessName: z.string().trim().max(120).optional().default(""),
  ownerName: z.string().trim().max(120).optional().default(""),
  postalCode: z.string().trim().max(20).optional().transform((value) => value || null),
  address: z.string().trim().max(240).optional().transform((value) => value || null),
  phone: z.string().trim().max(40).optional().transform((value) => value || null),
  email: z.string().trim().email("メール形式で入力してください").optional().or(z.literal("")).transform((value) => value || null),
  invoicePrefix: z.string().trim().max(20).optional().default("INV"),
  bankName: z.string().trim().max(80).optional().transform((value) => value || null),
  bankBranch: z.string().trim().max(80).optional().transform((value) => value || null),
  bankAccount: z.string().trim().max(80).optional().transform((value) => value || null),
  bankHolder: z.string().trim().max(80).optional().transform((value) => value || null),
  taxRate: z.coerce.number().int().min(0).max(100),
  invoiceNote: z.string().trim().max(500).optional().transform((value) => value || null),
});
