import Link from "next/link";
import { BillingStatus, PaymentStatus, ProjectStatus } from "@prisma/client";
import { AlertCircle, CalendarClock, CircleDollarSign, ClipboardList } from "lucide-react";
import { Card, PageHeader, Badge, ButtonLink } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { projectStatusLabels } from "@/lib/labels";

export default async function DashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const soon = new Date();
  soon.setDate(now.getDate() + 14);

  const [projectCount, activeCount, unbilledCount, invoiceProjects, unpaidProjects, nearDueProjects, projects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: [ProjectStatus.IN_PROGRESS, ProjectStatus.WAITING_REVIEW] } } }),
    prisma.project.count({ where: { billingStatus: { not: BillingStatus.BILLED } } }),
    prisma.project.findMany({
      where: { dueDate: { gte: monthStart, lte: monthEnd } },
      select: { amount: true },
    }),
    prisma.project.findMany({
      where: { paymentStatus: { not: PaymentStatus.PAID } },
      select: { amount: true },
    }),
    prisma.project.findMany({
      where: { dueDate: { gte: now, lte: soon }, paymentStatus: { not: PaymentStatus.PAID } },
      include: { client: true },
      orderBy: { dueDate: "asc" },
      take: 6,
    }),
    prisma.project.findMany({
      include: { client: true },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
      take: 30,
    }),
  ]);

  const invoiceTotal = invoiceProjects.reduce((sum, project) => sum + project.amount, 0);
  const unpaidTotal = unpaidProjects.reduce((sum, project) => sum + project.amount, 0);

  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description="案件、売上、未入金、近い納期をひと目で確認できます。"
        action={<ButtonLink href="/projects/new">案件を追加</ButtonLink>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="進行中案件" value={`${activeCount}件`} detail={`全${projectCount}件`} icon={<ClipboardList className="h-5 w-5" />} />
        <MetricCard label="未請求" value={`${unbilledCount}件`} detail="請求準備が必要な案件" icon={<AlertCircle className="h-5 w-5" />} />
        <MetricCard label="今月の売上見込み" value={formatCurrency(invoiceTotal)} detail="納期が今月の案件合計" icon={<CalendarClock className="h-5 w-5" />} />
        <MetricCard label="未入金額" value={formatCurrency(unpaidTotal)} detail="入金待ち・一部入金を含む" icon={<CircleDollarSign className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-950">納期が近い案件</h2>
            <Badge tone="accent">14日以内</Badge>
          </div>
          <div className="mt-4 grid gap-3">
            {nearDueProjects.length === 0 ? (
              <p className="text-sm text-gray-500">直近14日以内の納期はありません。</p>
            ) : (
              nearDueProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="rounded-md border border-gray-200 bg-gray-50/60 p-4 transition hover:border-gray-300 hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-950">{project.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{project.client.name}</p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-semibold text-gray-800">{formatDate(project.dueDate)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-gray-950">ステータス別の案件一覧</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-2 py-2 font-medium">ステータス</th>
                  <th className="px-2 py-2 font-medium">案件名</th>
                  <th className="px-2 py-2 font-medium">クライアント</th>
                  <th className="px-2 py-2 font-medium">納期</th>
                  <th className="px-2 py-2 text-right font-medium">金額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3"><Badge tone={statusTone(project.status)}>{projectStatusLabels[project.status]}</Badge></td>
                    <td className="px-2 py-3"><Link className="font-medium text-gray-950 hover:text-accent-700" href={`/projects/${project.id}`}>{project.title}</Link></td>
                    <td className="px-2 py-3 text-gray-600">{project.client.name}</td>
                    <td className="px-2 py-3 text-gray-600">{formatDate(project.dueDate)}</td>
                    <td className="px-2 py-3 text-right font-medium">{formatCurrency(project.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-gray-950 sm:text-3xl">{value}</p>
          <p className="mt-2 text-xs leading-5 text-gray-500">{detail}</p>
        </div>
        <div className="rounded-md border border-accent-100 bg-accent-50 p-2 text-accent-700">{icon}</div>
      </div>
    </Card>
  );
}

function statusTone(status: ProjectStatus) {
  if (status === ProjectStatus.IN_PROGRESS || status === ProjectStatus.WAITING_REVIEW) return "accent";
  if (status === ProjectStatus.PAID) return "success";
  if (status === ProjectStatus.NOT_STARTED) return "neutral";
  return "warning";
}
