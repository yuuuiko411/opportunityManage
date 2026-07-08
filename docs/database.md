# 案件管理ツール DB設計書

## 1. 概要

本アプリケーションはSQLiteを利用し、Prismaでスキーマ管理します。

DB接続文字列は `.env` の `DATABASE_URL` で指定します。

## 2. ER概要

```text
Client 1 --- N Project 1 --- N Task
                    |
                    + --- N Invoice
                    |
                    + --- N DeliveryNote

BusinessSetting は単一レコード
```

## 3. テーブル定義

### 3.1 Client

クライアント情報を管理します。

| カラム | 型 | 必須 | 概要 |
| --- | --- | --- | --- |
| `id` | String | yes | 主キー、cuid |
| `name` | String | yes | クライアント名、一意 |
| `email` | String | no | メールアドレス |
| `phone` | String | no | 電話番号 |
| `address` | String | no | 住所 |
| `createdAt` | DateTime | yes | 作成日時 |
| `updatedAt` | DateTime | yes | 更新日時 |

制約:

- `name` はunique

### 3.2 Project

案件情報を管理します。

| カラム | 型 | 必須 | 概要 |
| --- | --- | --- | --- |
| `id` | String | yes | 主キー、cuid |
| `title` | String | yes | 案件名 |
| `amount` | Int | yes | 契約金額、初期値0 |
| `dueDate` | DateTime | no | 納期 |
| `status` | ProjectStatus | yes | 進捗ステータス |
| `billingStatus` | BillingStatus | yes | 請求ステータス |
| `paymentStatus` | PaymentStatus | yes | 入金ステータス |
| `memo` | String | no | メモ |
| `fileUrl` | String | no | ファイルURL |
| `referenceUrl` | String | no | 参考URL |
| `clientId` | String | yes | Client外部キー |
| `createdAt` | DateTime | yes | 作成日時 |
| `updatedAt` | DateTime | yes | 更新日時 |

インデックス:

- `clientId`
- `status`
- `billingStatus`
- `paymentStatus`
- `dueDate`

リレーション:

- `Client` に属します。
- `Task`、`Invoice`、`DeliveryNote` を複数持ちます。
- クライアント削除時は関連案件も削除されます。

### 3.3 Task

案件に紐づく作業タスクを管理します。

| カラム | 型 | 必須 | 概要 |
| --- | --- | --- | --- |
| `id` | String | yes | 主キー、cuid |
| `title` | String | yes | タスク名 |
| `dueDate` | DateTime | no | 期限 |
| `completed` | Boolean | yes | 完了状態、初期値false |
| `memo` | String | no | メモ |
| `projectId` | String | yes | Project外部キー |
| `createdAt` | DateTime | yes | 作成日時 |
| `updatedAt` | DateTime | yes | 更新日時 |

インデックス:

- `projectId`
- `completed`

リレーション:

- `Project` に属します。
- 案件削除時は関連タスクも削除されます。

### 3.4 Invoice

請求書データを管理するためのテーブルです。

現状の画面では請求書レコードの作成・更新は行っていません。将来的な帳票保存用のモデルとして定義されています。

| カラム | 型 | 必須 | 概要 |
| --- | --- | --- | --- |
| `id` | String | yes | 主キー、cuid |
| `issueDate` | DateTime | yes | 発行日 |
| `dueDate` | DateTime | no | 支払期限 |
| `subtotal` | Int | yes | 小計 |
| `tax` | Int | yes | 消費税 |
| `total` | Int | yes | 合計 |
| `payee` | String | no | 振込先・支払先 |
| `note` | String | no | 備考 |
| `projectId` | String | yes | Project外部キー |
| `createdAt` | DateTime | yes | 作成日時 |
| `updatedAt` | DateTime | yes | 更新日時 |

### 3.5 DeliveryNote

納品書データを管理するためのテーブルです。

現状の画面では納品書レコードの作成・更新は行っていません。将来的な帳票保存用のモデルとして定義されています。

| カラム | 型 | 必須 | 概要 |
| --- | --- | --- | --- |
| `id` | String | yes | 主キー、cuid |
| `issueDate` | DateTime | yes | 発行日 |
| `note` | String | no | 備考 |
| `projectId` | String | yes | Project外部キー |
| `createdAt` | DateTime | yes | 作成日時 |
| `updatedAt` | DateTime | yes | 更新日時 |

### 3.6 BusinessSetting

請求書・納品書に表示する事業者情報を管理します。

| カラム | 型 | 必須 | 概要 |
| --- | --- | --- | --- |
| `id` | String | yes | 主キー、通常は `default` |
| `businessName` | String | yes | 屋号・事業者名 |
| `ownerName` | String | yes | 代表者名 |
| `postalCode` | String | no | 郵便番号 |
| `address` | String | no | 住所 |
| `phone` | String | no | 電話番号 |
| `email` | String | no | メールアドレス |
| `invoicePrefix` | String | yes | 請求書番号プレフィックス |
| `bankName` | String | no | 銀行名 |
| `bankBranch` | String | no | 支店名 |
| `bankAccount` | String | no | 口座番号 |
| `bankHolder` | String | no | 口座名義 |
| `taxRate` | Int | yes | 消費税率 |
| `invoiceNote` | String | no | 帳票備考 |
| `createdAt` | DateTime | yes | 作成日時 |
| `updatedAt` | DateTime | yes | 更新日時 |

## 4. enum定義

### 4.1 ProjectStatus

| 値 | 意味 |
| --- | --- |
| `NOT_STARTED` | 未着手 |
| `IN_PROGRESS` | 進行中 |
| `WAITING_REVIEW` | 確認待ち |
| `DELIVERED` | 納品済み |
| `INVOICED` | 請求済み |
| `PAID` | 入金済み |

### 4.2 BillingStatus

| 値 | 意味 |
| --- | --- |
| `NOT_BILLED` | 未請求 |
| `BILLING_PLANNED` | 請求予定 |
| `BILLED` | 請求済み |

### 4.3 PaymentStatus

| 値 | 意味 |
| --- | --- |
| `UNPAID` | 未入金 |
| `PARTIAL` | 一部入金 |
| `PAID` | 入金済み |

## 5. 初期データ

初期マイグレーションでは、`BusinessSetting` に `id = default` のレコードを作成します。

```sql
INSERT OR IGNORE INTO "BusinessSetting" ("id", "businessName", "ownerName", "invoicePrefix", "taxRate")
VALUES ('default', '', '', 'INV', 10);
```

## 6. 削除仕様

- `Client` を削除すると、関連する `Project` が削除されます。
- `Project` を削除すると、関連する `Task`、`Invoice`、`DeliveryNote` が削除されます。

現在のUIではクライアント単体削除は提供しておらず、主に案件削除が利用されます。
