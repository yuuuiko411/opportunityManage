import { Card, PageHeader } from "@/components/ui";
import { ProjectForm } from "@/components/project-form";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="案件新規作成" description="受注後に必要な情報をまとめて登録します。" />
      <Card>
        <ProjectForm />
      </Card>
    </>
  );
}
