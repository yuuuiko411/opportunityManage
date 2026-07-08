# 案件管理ツール 設計書

## 1. システム構成

本アプリケーションは、Next.js App Router、React Server Components、Server Actions、Prisma、SQLiteで構成されています。

```text
Browser
  |
  | HTTP
  v
Next.js App Router
  |
  | Server Components / Server Actions
  v
Prisma Client
  |
  v
SQLite
```

## 2. 技術スタック

| 領域 | 採用技術 |
| --- | --- |
| フレームワーク | Next.js 15 |
| UI | React 19 |
| スタイリング | Tailwind CSS |
| DBアクセス | Prisma |
| データベース | SQLite |
| バリデーション | Zod |
| アイコン | lucide-react |
| 言語 | TypeScript |

## 3. ディレクトリ構成

```text
app/
  actions.ts                    Server Actions
  layout.tsx                    共通レイアウト
  page.tsx                      ダッシュボード
  projects/
    page.tsx                    案件一覧
    new/page.tsx                案件新規作成
    [id]/page.tsx               案件詳細
    [id]/edit/page.tsx          案件編集
    [id]/invoice/page.tsx       請求書プレビュー
    [id]/delivery-note/page.tsx 納品書プレビュー
  settings/page.tsx             設定
components/
  ui.tsx                        共通UI部品
  project-form.tsx              案件フォーム
  document-preview.tsx          請求書・納品書プレビュー
  print-button.tsx              印刷ボタン
lib/
  prisma.ts                     Prisma Clientのシングルトン
  validators.ts                 Zodスキーマ
  labels.ts                     enum表示ラベル
  format.ts                     金額・日付フォーマット
prisma/
  schema.prisma                 Prismaスキーマ
  migrations/000_init/          初期DDL
scripts/
  init-db.mjs                   SQLite初期化スクリプト
```

## 4. 主要コンポーネント

### 4.1 App Routerページ

ページコンポーネントは基本的にServer Componentとして実装されています。DBからの読み取りはページ内でPrismaを直接呼び出します。

- `app/page.tsx`: ダッシュボード指標と案件一覧を取得
- `app/projects/page.tsx`: 検索条件を `searchParams` から取得し、案件を絞り込み
- `app/projects/[id]/page.tsx`: 案件詳細とタスク一覧を取得
- `app/settings/page.tsx`: 事業者設定を取得

### 4.2 Server Actions

`app/actions.ts` に更新系処理を集約しています。

| 関数 | 役割 |
| --- | --- |
| `createProject` | 案件作成、クライアントupsert、詳細画面へリダイレクト |
| `updateProject` | 案件更新、クライアントupsert、詳細画面へリダイレクト |
| `deleteProject` | 案件削除、一覧画面へリダイレクト |
| `createTask` | タスク作成 |
| `toggleTask` | タスク完了状態の切り替え |
| `deleteTask` | タスク削除 |
| `updateSettings` | 事業者設定のupsert |

更新後は `revalidatePath` により関連ページのキャッシュを再検証します。

### 4.3 共通UI

`components/ui.tsx` に以下の軽量コンポーネントを定義しています。

- `PageHeader`
- `Card`
- `ButtonLink`
- `SubmitButton`
- `TextInput`
- `SelectInput`
- `TextArea`
- `Field`
- `Badge`

フォーム部品はブラウザ標準の入力要素をベースにTailwind CSSでスタイルを統一しています。

### 4.4 案件フォーム

`components/project-form.tsx` は新規作成と編集を兼用します。

- `project` が渡された場合は編集モード
- `project` がない場合は新規作成モード
- Server Actionは `createProject` または `updateProject.bind(null, project.id)` を利用

### 4.5 帳票プレビュー

`components/document-preview.tsx` は請求書と納品書を兼用します。

- `type: "invoice"` の場合は請求書
- `type: "delivery"` の場合は納品書
- 消費税は `Math.floor(project.amount * (taxRate / 100))` で算出
- 合計金額は `project.amount + tax`
- 印刷時はCSSの `@media print` によりナビゲーションや操作ボタンを非表示

## 5. データフロー

### 5.1 案件登録

```text
案件新規作成画面
  -> ProjectForm
  -> createProject Server Action
  -> Zod validation
  -> Client upsert
  -> Project create
  -> revalidatePath
  -> /projects/[id] へ redirect
```

### 5.2 案件更新

```text
案件編集画面
  -> ProjectForm
  -> updateProject Server Action
  -> Zod validation
  -> Client upsert
  -> Project update
  -> revalidatePath
  -> /projects/[id] へ redirect
```

### 5.3 タスク追加・更新

```text
案件詳細画面
  -> createTask / toggleTask / deleteTask
  -> Task create/update/delete
  -> revalidatePath(/projects/[id])
```

### 5.4 設定更新

```text
設定画面
  -> updateSettings Server Action
  -> Zod validation
  -> BusinessSetting upsert(id = "default")
  -> revalidatePath
```

## 6. DB設計方針

- クライアントと案件は1対多
- 案件とタスクは1対多
- 案件と請求書は1対多のモデル定義
- 案件と納品書は1対多のモデル定義
- 事業者設定は `id = "default"` の単一レコード
- 案件削除時は関連データをcascade delete

詳細は `docs/database.md` を参照してください。

## 7. エラーハンドリング

- 存在しない案件IDにアクセスした場合は `notFound()` を呼び出します。
- フォーム入力はZodで検証します。
- Prisma Clientのログは開発環境では `error` と `warn`、本番環境では `error` のみ出力します。

## 8. セキュリティ設計

現状はローカル利用を前提としており、認証・認可は実装されていません。

外部公開する場合に必要な追加設計:

- ログイン認証
- ユーザーごとのデータ分離
- CSRFや権限チェックの明示
- ファイルURL、参考URLの表示ポリシー
- DBバックアップと復元手順

## 9. 運用設計

### 9.1 初期化

`.env` に `DATABASE_URL` を定義し、SQLite DBを初期化します。

```bash
npm run db:init
npm run prisma:generate
```

### 9.2 開発起動

```bash
npm run dev
```

### 9.3 ビルド

```bash
npm run build
```

## 10. 既知の課題

- `Invoice` と `DeliveryNote` の永続化処理は未実装です。
- 請求書番号の自動採番は未実装です。
- クライアント詳細編集画面はありません。
- 案件削除・タスク削除に確認ダイアログはありません。
- テストコードは未整備です。
