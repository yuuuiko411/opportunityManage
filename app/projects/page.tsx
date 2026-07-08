import Link from "next/link";
import { BillingStatus, PaymentStatus, ProjectStatus } from "@prisma/client";
import { ButtonLink, Card, PageHeader, SelectInput, TextInput, Badge } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { billingStatusLabels, paymentStatusLabels, projectStatusLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
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
              OR: [
                { title: { contains: q } },
                { client: { name: { contains: q } } },
              ],
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
      <PageHeader title="案件一覧" description="検索と絞り込みで、必要な案件にすぐ移動できます。" action={<ButtonLink href="/projects/new">新規作成</ButtonLink>} />
      <Card className="mb-5">
        <form className="grid gap-3 lg:grid-cols-6">
          <TextInput name="q" placeholder="案件名・クライアント名" defaultValue={q ?? ""} className="lg:col-span-2" />
          <SelectInput name="status" defaultValue={status ?? ""}>
            <option value="">ステータスすべて</option>
            {Object.entries(projectStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </SelectInput>
          <SelectInput name="billingStatus" defaultValue={billingStatus ?? ""}>
            <option value="">請求状況すべて</option>
            {Object.entries(billingStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </SelectInput>
          <SelectInput name="paymentStatus" defaultValue={paymentStatus ?? ""}>
            <option value="">入金状況すべて</option>
            {Object.entries(paymentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </SelectInput>
          <div className="grid grid-cols-2 gap-2">
            <TextInput name="dueFrom" type="date" defaultValue={params.dueFrom ?? ""} />
            <TextInput name="dueTo" type="date" defaultValue={params.dueTo ?? ""} />
          </div>
          <button className="min-h-10 rounded-md bg-gray-950 px-4 text-sm font-medium text-white lg:col-start-6">絞り込み</button>
        </form>
      </Card>

      <div className="grid gap-3">
        {projects.length === 0 ? (
          <Card><p className="text-sm text-gray-500">案件がありません。</p></Card>
        ) : (
          projects.map((project) => {
            const incompleteTasks = project.tasks.filter((task) => !task.completed).length;
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="rounded-lg border border-gray-200 bg-white p-4 shadow-soft hover:border-gray-300">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-950">{project.title}</h2>
                      <Badge>{projectStatusLabels[project.status]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{project.client.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4 lg:min-w-[560px]">
                    <div><p className="text-gray-500">金額</p><p className="font-medium">{formatCurrency(project.amount)}</p></div>
                    <div><p className="text-gray-500">納期</p><p className="font-medium">{formatDate(project.dueDate)}</p></div>
                    <div><p className="text-gray-500">請求/入金</p><p className="font-medium">{billingStatusLabels[project.billingStatus]} / {paymentStatusLabels[project.paymentStatus]}</p></div>
                    <div><p className="text-gray-500">未完了タスク</p><p className="font-medium">{incompleteTasks}</p></div>
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
