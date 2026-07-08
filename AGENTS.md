# AIエージェントへの制約事項
- ファイルを保存する際は、必ず「BOMなしUTF-8」を維持すること。
- 文字化け（U+FFFD）やBOMの異常な混入を検知した場合は、自動修正を試みずに即座に処理を中断し、人間に報告（Stop & Report）すること。
- Windows環境では、ファイルはUTF-8として扱うこと。
- 日本語コメントや日本語UI文言が文字化けして見える場合でも、PowerShellのコンソール出力だけが文字化けしている可能性を考慮し、実ファイルをUTF-8として読み直して確認すること。
- 実ファイルをUTF-8として読み直してもU+FFFDや不正なBOM混入が確認できる場合のみ、文字化けとしてStop & Reportすること。

# Git / GitHub 命名規則

このリポジトリで作業する場合、Codexは必ず以下のGit命名規則に従うこと。

## ブランチ名

形式:

```
<type>/<scope>-<description>
```

例:

```
feature/auth-login
fix/outfits-api-error
refactor/clothes-card
docs/readme-setup
chore/update-dependencies
```

## type

- feature: 新機能
- fix: バグ修正
- refactor: 仕様変更を伴わない整理
- docs: ドキュメント修正
- test: テスト追加・修正
- chore: 設定・依存関係・雑務
- ci: GitHub ActionsなどCI関連
- design: UI・見た目の調整

## scope

対象機能・画面・領域を小文字英数字とハイフンで書く。

例:

```
auth
clothes
outfits
mypage
settings
ui
api
db
ci
```

## description

- 英小文字
- 単語はハイフン区切り
- 日本語・スペース・記号は使わない
- 20〜40文字程度で簡潔にする

## コミットメッセージ

形式:

```
<type>(<scope>): <summary>
```

例:

```
feature(auth): add login form
fix(outfits): handle empty recommendation
refactor(clothes): simplify card component
docs(readme): add setup steps
```

## PRタイトル

形式:

```
[<type>] <summary>
```

例:

```
[feature] Add login form
[fix] Handle empty outfit recommendation
```

## Codexへの指示

作業開始前に必ず以下を確認すること。

1. 作業内容から適切な type を判断する
2. scope を既存の画面・機能名に合わせる
3. ブランチ名・コミット・PRタイトルがこの規則に合っているか確認する
4. 規則に合わない名前を提案しない
5. 判断に迷う場合は、勝手に命名せず候補を2〜3個提示する
