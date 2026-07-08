"use server";

import { BillingStatus, PaymentStatus, ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { projectSchema, settingsSchema, taskSchema } from "@/lib/validators";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function projectInput(formData: FormData) {
  return {
    title: formValue(formData, "title"),
    clientName: formValue(formData, "clientName"),
    amount: formValue(formData, "amount"),
    dueDate: formValue(formData, "dueDate"),
    status: formValue(formData, "status") as ProjectStatus,
    billingStatus: formValue(formData, "billingStatus") as BillingStatus,
    paymentStatus: formValue(formData, "paymentStatus") as PaymentStatus,
    memo: formValue(formData, "memo"),
    fileUrl: formValue(formData, "fileUrl"),
    referenceUrl: formValue(formData, "referenceUrl"),
  };
}

export async function createProject(formData: FormData) {
  const data = projectSchema.parse(projectInput(formData));
  const client = await prisma.client.upsert({
    where: { name: data.clientName },
    update: {},
    create: { name: data.clientName },
  });

  const project = await prisma.project.create({
    data: {
      title: data.title,
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status,
      billingStatus: data.billingStatus,
      paymentStatus: data.paymentStatus,
      memo: data.memo,
      fileUrl: data.fileUrl,
      referenceUrl: data.referenceUrl,
      clientId: client.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const data = projectSchema.parse(projectInput(formData));
  const client = await prisma.client.upsert({
    where: { name: data.clientName },
    update: {},
    create: { name: data.clientName },
  });

  await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status,
      billingStatus: data.billingStatus,
      paymentStatus: data.paymentStatus,
      memo: data.memo,
      fileUrl: data.fileUrl,
      referenceUrl: data.referenceUrl,
      clientId: client.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/projects");
}

export async function createTask(projectId: string, formData: FormData) {
  const data = taskSchema.parse({
    title: formValue(formData, "title"),
    dueDate: formValue(formData, "dueDate"),
    memo: formValue(formData, "memo"),
  });

  await prisma.task.create({
    data: {
      title: data.title,
      dueDate: data.dueDate,
      memo: data.memo,
      projectId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function toggleTask(taskId: string, completed: boolean, projectId: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { completed },
  });
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTask(taskId: string, projectId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(`/projects/${projectId}`);
}

export async function updateSettings(formData: FormData) {
  const data = settingsSchema.parse({
    businessName: formValue(formData, "businessName"),
    ownerName: formValue(formData, "ownerName"),
    postalCode: formValue(formData, "postalCode"),
    address: formValue(formData, "address"),
    phone: formValue(formData, "phone"),
    email: formValue(formData, "email"),
    invoicePrefix: formValue(formData, "invoicePrefix"),
    bankName: formValue(formData, "bankName"),
    bankBranch: formValue(formData, "bankBranch"),
    bankAccount: formValue(formData, "bankAccount"),
    bankHolder: formValue(formData, "bankHolder"),
    taxRate: formValue(formData, "taxRate"),
    invoiceNote: formValue(formData, "invoiceNote"),
  });

  await prisma.businessSetting.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  revalidatePath("/settings");
  revalidatePath("/projects");
}
