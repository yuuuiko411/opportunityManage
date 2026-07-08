import Link from "next/link";
import { BillingStatus, PaymentStatus, ProjectStatus } from "@prisma/client";
import { Filter, Search } from "lucide-react";
import { ButtonLink, Card, PageHeader, SelectInput, TextInput, Badge } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { billingStatusLabels, paymentStatusLabels, projectStatusLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const status = params.status as ProjectStatus | undefined;
  const billingStatus = params.billingStatus as BillingStatus | undefined;
  const paymentStatus = params.paymentStatus as PaymentStatus | undefined;
  const dueFrom = params.dueFrom ? new Date(params.dueFrom) : undefined;
  const dueTo = params.dueTo ? new Date(params.dueTo) : undefined;

  const projects = await prisma.project.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [{ title: { contains: q } }, { client: { name: { contains: q } } }],
            }
          : {},
        status ? { status } : {},
        billingStatus ? { billingStatus } : {},
        paymentStatus ? { paymentStatus } : {},
        dueFrom || dueTo ? { dueDate: { gte: dueFrom, lte: dueTo } } : {},
      ],
    },
    include: { client: true, tasks: true },
    orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <>
      <PageHeader
        title="案件一覧"
        description="検索と絞り込みで、必要な案件にすぐ移動できます。"
        action={<ButtonLink href="/projects/new">新規作成</ButtonLink>}
      />
      <Card className="mb-5">
        <form className="grid gap-3 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <TextInput name="q" placeholder="案件名・クライアント名" defaultValue={q ?? ""} className="pl-9" />
          </div>
          <SelectInput name="status" defaultValue={status ?? ""}>
            <option value="">ステータスすべて</option>
            {Object.entries(projectStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
          <SelectInput name="billingStatus" defaultValue={billingStatus ?? ""}>
            <option value="">請求状況すべて</option>
            {Object.entries(billingStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
          <SelectInput name="paymentStatus" defaultValue={paymentStatus ?? ""}>
            <option value="">入金状況すべて</option>
            {Object.entries(paymentStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
          <div className="grid grid-cols-2 gap-2">
            <TextInput name="dueFrom" type="date" defaultValue={params.dueFrom ?? ""} />
            <TextInput name="dueTo" type="date" defaultValue={params.dueTo ?? ""} />
          </div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800 lg:col-start-6">
            <Filter className="h-4 w-4" />
            絞り込み
          </button>
        </form>
      </Card>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500">案件がありません。</p>
          </Card>
        ) : (
          projects.map((project) => {
            const incompleteTasks = project.tasks.filter((task) => !task.completed).length;
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-soft transition hover:border-gray-300 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-semibold text-gray-950">{project.title}</h2>
                      <Badge tone={statusTone(project.status)}>{projectStatusLabels[project.status]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{project.client.name}</p>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:min-w-[680px] lg:grid-cols-5">
                    <ProjectMeta label="金額" value={formatCurrency(project.amount)} strong />
                    <ProjectMeta label="納期" value={formatDate(project.dueDate)} />
                    <ProjectMeta
                      label="請求状況"
                      value={
                        <Badge tone={billingTone(project.billingStatus)}>
                          {billingStatusLabels[project.billingStatus]}
                        </Badge>
                      }
                    />
                    <ProjectMeta
                      label="入金状況"
                      value={
                        <Badge tone={paymentTone(project.paymentStatus)}>
                          {paymentStatusLabels[project.paymentStatus]}
                        </Badge>
                      }
                    />
                    <ProjectMeta label="未完了タスク" value={`${incompleteTasks}件`} />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

function ProjectMeta({ label, value, strong = false }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="rounded-md bg-gray-50 px-3 py-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className={strong ? "mt-1 font-semibold text-gray-950" : "mt-1 font-medium text-gray-800"}>{value}</div>
    </div>
  );
}

function statusTone(status: ProjectStatus) {
  if (status === ProjectStatus.IN_PROGRESS || status === ProjectStatus.WAITING_REVIEW) return "accent";
  if (status === ProjectStatus.PAID) return "success";
  if (status === ProjectStatus.NOT_STARTED) return "neutral";
  return "warning";
}

function billingTone(status: BillingStatus) {
  if (status === BillingStatus.BILLED) return "success";
  if (status === BillingStatus.BILLING_PLANNED) return "accent";
  return "warning";
}

function paymentTone(status: PaymentStatus) {
  if (status === PaymentStatus.PAID) return "success";
  if (status === PaymentStatus.PARTIAL) return "accent";
  return "warning";
}
