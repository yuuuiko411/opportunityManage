import { updateSettings } from "@/app/actions";
import { Card, Field, PageHeader, SubmitButton, TextArea, TextInput } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const setting = await prisma.businessSetting.findUnique({ where: { id: "default" } });

  return (
    <>
      <PageHeader title="設定" description="請求書・納品書に表示する事業者情報と振込先を保存します。" />
      <Card>
        <form action={updateSettings} className="grid gap-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="屋号・事業者名">
              <TextInput name="businessName" defaultValue={setting?.businessName ?? ""} />
            </Field>
            <Field label="代表者名">
              <TextInput name="ownerName" defaultValue={setting?.ownerName ?? ""} />
            </Field>
            <Field label="郵便番号">
              <TextInput name="postalCode" defaultValue={setting?.postalCode ?? ""} />
            </Field>
            <Field label="住所">
              <TextInput name="address" defaultValue={setting?.address ?? ""} />
            </Field>
            <Field label="電話番号">
              <TextInput name="phone" defaultValue={setting?.phone ?? ""} />
            </Field>
            <Field label="メール">
              <TextInput name="email" type="email" defaultValue={setting?.email ?? ""} />
            </Field>
            <Field label="請求書番号プレフィックス">
              <TextInput name="invoicePrefix" defaultValue={setting?.invoicePrefix ?? "INV"} />
            </Field>
            <Field label="消費税率 (%)">
              <TextInput name="taxRate" type="number" min={0} max={100} defaultValue={setting?.taxRate ?? 10} />
            </Field>
            <Field label="銀行名">
              <TextInput name="bankName" defaultValue={setting?.bankName ?? ""} />
            </Field>
            <Field label="支店名">
              <TextInput name="bankBranch" defaultValue={setting?.bankBranch ?? ""} />
            </Field>
            <Field label="口座番号">
              <TextInput name="bankAccount" defaultValue={setting?.bankAccount ?? ""} />
            </Field>
            <Field label="口座名義">
              <TextInput name="bankHolder" defaultValue={setting?.bankHolder ?? ""} />
            </Field>
          </div>
          <Field label="帳票備考">
            <TextArea name="invoiceNote" defaultValue={setting?.invoiceNote ?? ""} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton>保存する</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
