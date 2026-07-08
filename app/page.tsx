import Link from "next/link";
import { PaymentStatus, ProjectStatus } from "@prisma/client";
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

  const [projectCount, activeCount, invoiceProjects, unpaidProjects, nearDueProjects, projects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: [ProjectStatus.IN_PROGRESS, ProjectStatus.WAITING_REVIEW] } } }),
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
        <Card>
          <p className="text-sm text-gray-600">案件数</p>
          <p className="mt-2 text-3xl font-semibold">{projectCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">進行中の案件数</p>
          <p className="mt-2 text-3xl font-semibold">{activeCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">今月の請求予定額</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(invoiceTotal)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">未入金額</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(unpaidTotal)}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <h2 className="text-base font-semibold">納期が近い案件</h2>
          <div className="mt-4 grid gap-3">
            {nearDueProjects.length === 0 ? (
              <p className="text-sm text-gray-500">直近14日以内の納期はありません。</p>
            ) : (
              nearDueProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-950">{project.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{project.client.name}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{formatDate(project.dueDate)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">ステータス別の案件一覧</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="py-2 font-medium">ステータス</th>
                  <th className="py-2 font-medium">案件名</th>
                  <th className="py-2 font-medium">クライアント</th>
                  <th className="py-2 font-medium">納期</th>
                  <th className="py-2 text-right font-medium">金額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="py-3"><Badge>{projectStatusLabels[project.status]}</Badge></td>
                    <td className="py-3"><Link className="font-medium text-gray-950 hover:text-accent-700" href={`/projects/${project.id}`}>{project.title}</Link></td>
                    <td className="py-3 text-gray-600">{project.client.name}</td>
                    <td className="py-3 text-gray-600">{formatDate(project.dueDate)}</td>
                    <td className="py-3 text-right">{formatCurrency(project.amount)}</td>
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
