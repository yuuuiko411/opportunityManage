import { BillingStatus, PaymentStatus, Project, ProjectStatus, Client } from "@prisma/client";
import { createProject, updateProject } from "@/app/actions";
import { Field, SelectInput, SubmitButton, TextArea, TextInput } from "@/components/ui";
import { billingStatusLabels, paymentStatusLabels, projectStatusLabels } from "@/lib/labels";
import { dateInputValue } from "@/lib/format";

type ProjectWithClient = Project & { client: Client };

export function ProjectForm({ project }: { project?: ProjectWithClient }) {
  const action = project ? updateProject.bind(null, project.id) : createProject;

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="案件名">
          <TextInput name="title" required defaultValue={project?.title ?? ""} />
        </Field>
        <Field label="クライアント名">
          <TextInput name="clientName" required defaultValue={project?.client.name ?? ""} />
        </Field>
        <Field label="契約金額">
          <TextInput name="amount" type="number" min={0} required defaultValue={project?.amount ?? 0} />
        </Field>
        <Field label="納期">
          <TextInput name="dueDate" type="date" defaultValue={dateInputValue(project?.dueDate)} />
        </Field>
        <Field label="進捗ステータス">
          <SelectInput name="status" defaultValue={project?.status ?? ProjectStatus.NOT_STARTED}>
            {Object.entries(projectStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="請求状況">
          <SelectInput name="billingStatus" defaultValue={project?.billingStatus ?? BillingStatus.NOT_BILLED}>
            {Object.entries(billingStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="入金状況">
          <SelectInput name="paymentStatus" defaultValue={project?.paymentStatus ?? PaymentStatus.UNPAID}>
            {Object.entries(paymentStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="ファイルURL">
          <TextInput name="fileUrl" type="url" defaultValue={project?.fileUrl ?? ""} placeholder="https://..." />
        </Field>
        <Field label="参考URL">
          <TextInput name="referenceUrl" type="url" defaultValue={project?.referenceUrl ?? ""} placeholder="https://..." />
        </Field>
      </div>
      <Field label="メモ">
        <TextArea name="memo" defaultValue={project?.memo ?? ""} />
      </Field>
      <div className="flex justify-end">
        <SubmitButton>{project ? "更新する" : "登録する"}</SubmitButton>
      </div>
    </form>
  );
}
