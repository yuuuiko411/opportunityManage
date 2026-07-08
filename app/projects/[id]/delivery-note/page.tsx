import { notFound } from "next/navigation";
import { DocumentPreview } from "@/components/document-preview";
import { prisma } from "@/lib/prisma";

export default async function DeliveryNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, setting] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { client: true } }),
    prisma.businessSetting.findUnique({ where: { id: "default" } }),
  ]);
  if (!project) notFound();
  return <DocumentPreview type="delivery" project={project} setting={setting} />;
}
