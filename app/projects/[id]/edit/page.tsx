import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/ui";
import { ProjectForm } from "@/components/project-form";
import { prisma } from "@/lib/prisma";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { client: true } });
  if (!project) notFound();

  return (
    <>
      <PageHeader title="案件編集" description="案件情報、請求状況、入金状況を更新します。" />
      <Card>
        <ProjectForm project={project} />
      </Card>
    </>
  );
}
