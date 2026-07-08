import { BusinessSetting, Project, Client } from "@prisma/client";
import { ButtonLink } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/format";
import { PrintButton } from "@/components/print-button";

type ProjectWithClient = Project & { client: Client };

export function DocumentPreview({
  type,
  project,
  setting,
}: {
  type: "invoice" | "delivery";
  project: ProjectWithClient;
  setting: BusinessSetting | null;
}) {
  const taxRate = setting?.taxRate ?? 10;
  const tax = Math.floor(project.amount * (taxRate / 100));
  const total = project.amount + tax;
  const payLimit = project.dueDate ?? new Date();

  return (
    <div>
      <div className="no-print mb-5 flex justify-between gap-3">
        <ButtonLink href={`/projects/${project.id}`} variant="secondary">
          案件へ戻る
        </ButtonLink>
        <PrintButton />
      </div>
      <article className="print-page mx-auto min-h-[900px] max-w-[820px] rounded-lg border border-gray-200 bg-white p-8 shadow-soft sm:p-12">
        <div className="flex items-start justify-between gap-8 border-b border-gray-900 pb-8">
          <div>
            <h1 className="text-3xl font-semibold">{type === "invoice" ? "請求書" : "納品書"}</h1>
            <p className="mt-4 text-sm text-gray-600">発行日: {formatDate(new Date())}</p>
          </div>
          <div className="text-right text-sm leading-7 text-gray-700">
            <p className="font-semibold text-gray-950">
              {setting?.businessName || setting?.ownerName || "自社名未設定"}
            </p>
            {setting?.postalCode ? <p>〒{setting.postalCode}</p> : null}
            {setting?.address ? <p>{setting.address}</p> : null}
            {setting?.phone ? <p>TEL: {setting.phone}</p> : null}
            {setting?.email ? <p>{setting.email}</p> : null}
          </div>
        </div>

        <section className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">{type === "invoice" ? "請求先" : "納品先"}</p>
            <p className="mt-2 border-b border-gray-300 pb-2 text-xl font-semibold">{project.client.name} 御中</p>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">{type === "invoice" ? "ご請求金額" : "納品金額"}</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(total)}</p>
          </div>
        </section>

        <section className="mt-10">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-gray-900">
              <tr>
                <th className="py-3 font-semibold">項目</th>
                <th className="py-3 text-right font-semibold">金額</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4">{project.title}</td>
                <td className="py-4 text-right">{formatCurrency(project.amount)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4">消費税 ({taxRate}%)</td>
                <td className="py-4 text-right">{formatCurrency(tax)}</td>
              </tr>
              <tr>
                <td className="py-4 text-right font-semibold">合計</td>
                <td className="py-4 text-right text-xl font-semibold">{formatCurrency(total)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {type === "invoice" ? (
          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-semibold">支払期限</h2>
              <p className="mt-2 text-sm">{formatDate(payLimit)}</p>
            </div>
            <div>
              <h2 className="font-semibold">振込先</h2>
              <div className="mt-2 text-sm leading-7">
                <p>
                  {setting?.bankName ?? ""} {setting?.bankBranch ?? ""}
                </p>
                <p>{setting?.bankAccount ?? ""}</p>
                <p>{setting?.bankHolder ?? ""}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-10">
            <h2 className="font-semibold">納品内容</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{project.memo || `${project.title} 一式`}</p>
          </section>
        )}

        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="font-semibold">備考</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {setting?.invoiceNote || "ご確認のほどよろしくお願いいたします。"}
          </p>
        </section>
      </article>
    </div>
  );
}
