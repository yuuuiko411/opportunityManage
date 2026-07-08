# freelance-project-manager

個人事業主・フリーランス向けの案件管理アプリです。案件、クライアント、タスク、請求状況、入金状況をローカル環境で管理し、案件ごとの請求書・納品書プレビューと印刷にも対応します。

## アプリ概要

- Next.js App Router と React 19 で構築されたWebアプリケーションです。
- Prisma ORM と SQLite を使い、案件・クライアント・タスク・事業者設定を管理します。
- ダッシュボードでは進行中案件、未請求件数、今月納期の金額、未入金額、納期が近い案件を確認できます。
- 案件一覧では案件名・クライアント名による検索、進捗・請求・入金ステータス、納期範囲による絞り込みができます。
- 案件詳細ではタスクの追加、完了切り替え、削除、請求書・納品書プレビューへの遷移ができます。
- 設定画面では請求書・納品書に表示する事業者情報、消費税率、振込先、備考を管理します。

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Prisma
- SQLite
- Tailwind CSS
- ESLint / Prettier
- Node.js test runner

## フォルダ構成

```text
.
├── app/                  # Next.js App Router の画面、レイアウト、Server Actions
│   ├── projects/         # 案件一覧、登録、詳細、編集、請求書、納品書
│   ├── settings/         # 事業者設定
│   ├── actions.ts        # 案件・タスク・設定を更新する Server Actions
│   ├── globals.css       # グローバルスタイル
│   ├── layout.tsx        # 共通レイアウト
│   └── page.tsx          # ダッシュボード
├── components/           # UI部品、案件フォーム、帳票プレビュー、印刷ボタン
├── lib/                  # Prisma Client、表示ラベル、日付・金額整形、バリデーション
├── prisma/               # Prisma schema とマイグレーション
├── scripts/              # DB初期化などの補助スクリプト
├── docs/                 # 仕様・設計・DB設計ドキュメント
└── .github/workflows/    # GitHub Actions のCI設定
```

## セットアップ

```bash
npm ci
npm run db:init
npm run dev
```

開発サーバー起動後、ブラウザで `http://localhost:3100` を開きます。
ローカル開発時のアプリケーションURLは `.env` に `NEXT_PUBLIC_APP_URL=http://localhost:3100` を設定してください。

## 主なコマンド

```bash
npm run dev            # 開発サーバーを起動
npm run build          # 本番ビルド
npm run start          # 本番サーバーを起動
npm run typecheck      # TypeScript の型チェック
npm run lint           # ESLint
npm run format:check   # Prettier のフォーマット確認
npm test               # テスト実行
npm run prisma:studio  # Prisma Studio を起動
```

## CI

GitHub Actions runs CI when a pull request is opened or updated, and when changes are pushed to `main` or `develop`.

GitHub Actions のCIは、プルリクエストの作成・更新時、および `main` または `develop` へのプッシュ時に実行されます。

The `Frontend Quality Checks` job uses Node.js 20, installs dependencies with `npm ci`, restores the npm cache, generates the Prisma Client, and runs:

`Frontend Quality Checks` ジョブでは Node.js 20 を使用し、`npm ci` で依存関係をインストールします。npmキャッシュを復元し、Prisma Client を生成したうえで、次のチェックを実行します。

- TypeScript type checking with `npm run typecheck`
  - `npm run typecheck` による TypeScript 型チェック
- ESLint with `npm run lint`
  - `npm run lint` による ESLint チェック
- Prettier formatting verification with `npm run format:check`
  - `npm run format:check` による Prettier フォーマット確認
- Tests with `npm test`
  - `npm test` によるテスト実行
- Production build verification with `npm run build`
  - `npm run build` による本番ビルド確認
