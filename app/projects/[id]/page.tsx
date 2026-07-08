import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink, Trash2 } from "lucide-react";
import { createTask, deleteProject, deleteTask, toggleTask } from "@/app/actions";
import { Badge, ButtonLink, Card, Field, PageHeader, SubmitButton, TextArea, TextInput } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { billingStatusLabels, paymentStatusLabels, projectStatusLabels } from "@/lib/labels";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { client: true, tasks: { orderBy: [{ completed: "asc" }, { dueDate: "asc" }] } },
  });
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        description={`${project.client.name} / ${formatCurrency(project.amount)}`}
        action={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/projects/${project.id}/invoice`} variant="secondary">請求書</ButtonLink>
            <ButtonLink href={`/projects/${project.id}/delivery-note`} variant="secondary">納品書</ButtonLink>
            <ButtonLink href={`/projects/${project.id}/edit`}>編集</ButtonLink>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <Card>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="進捗" value={<Badge>{projectStatusLabels[project.status]}</Badge>} />
              <Info label="請求状況" value={billingStatusLabels[project.billingStatus]} />
              <Info label="入金状況" value={paymentStatusLabels[project.paymentStatus]} />
              <Info label="納期" value={formatDate(project.dueDate)} />
              <Info label="作成日" value={formatDate(project.createdAt)} />
              <Info label="更新日" value={formatDate(project.updatedAt)} />
            </div>
            {project.memo ? <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-700 whitespace-pre-wrap">{project.memo}</div> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              {project.fileUrl ? <External href={project.fileUrl} label="ファイルURL" /> : null}
              {project.referenceUrl ? <External href={project.referenceUrl} label="参考URL" /> : null}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold">タスク</h2>
            <div className="mt-4 grid gap-3">
              {project.tasks.length === 0 ? <p className="text-sm text-gray-500">タスクはまだありません。</p> : null}
              {project.tasks.map((task) => (
                <div key={task.id} className="flex flex-col gap-3 rounded-md border border-gray-200 bg-gray-50/70 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <form action={toggleTask.bind(null, task.id, !task.completed, project.id)}>
                      <button className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100" aria-label="完了状態を切り替え">
                        {task.completed ? <Check className="h-4 w-4" /> : null}
                      </button>
                    </form>
                    <div>
                      <p className={task.completed ? "font-medium text-gray-400 line-through" : "font-medium text-gray-950"}>{task.title}</p>
                      <p className="mt-1 text-sm text-gray-500">期限: {formatDate(task.dueDate)}</p>
                      {task.memo ? <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{task.memo}</p> : null}
                    </div>
                  </div>
                  <form action={deleteTask.bind(null, task.id, project.id)}>
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50" aria-label="タスク削除">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 self-start">
          <Card>
            <h2 className="text-base font-semibold">タスク追加</h2>
            <form action={createTask.bind(null, project.id)} className="mt-4 grid gap-4">
              <Field label="タスク名"><TextInput name="title" required /></Field>
              <Field label="期限"><TextInput name="dueDate" type="date" /></Field>
              <Field label="メモ"><TextArea name="memo" /></Field>
              <SubmitButton>追加する</SubmitButton>
            </form>
          </Card>
          <Card>
            <h2 className="text-base font-semibold">削除</h2>
            <p className="mt-2 text-sm text-gray-600">案件を削除すると、関連タスクや帳票データも削除されます。</p>
            <form action={deleteProject.bind(null, project.id)} className="mt-4">
              <SubmitButton variant="danger">案件を削除</SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-gray-950">{value}</div>
    </div>
  );
}

function External({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} target="_blank" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
      {label}<ExternalLink className="h-4 w-4" />
    </Link>
  );
}
