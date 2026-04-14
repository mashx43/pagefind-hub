# @mash43/pagefind-hub

[![npm version](https://img.shields.io/npm/v/@mash43/pagefind-hub.svg)](https://www.npmjs.com/package/@mash43/pagefind-hub) 

様々な外部コンテンツをシームレスに取得し、静的サイトのコンテンツと一緒に [Pagefind](https://pagefind.app/) を使って検索インデックスとして構築するためのCLIツールです。

## 特徴

- **外部プロバイダ連携**: 外部サービス（例：Bluesky, GitHub, YouTube）から簡単にデータを取得しインデックス化します。
- **統合インデックス**: ローカルのウェブサイトコンテンツ（`siteDir`）と外部データソースを結合し、一つのPagefindインデックスを作成します。
- **カスタマイズ性**: 各プロバイダのレコードに対し、カスタムのメタデータ、フィルタ、ソートを自由に定義可能です。
- **UIサポート**: 検索結果に含まれる外部サイトへのリンクを自動的に別タブで開くようにするUIユーティリティが含まれています。
- **TypeScriptサポート**: `pagefind-hub.config.ts` での強力な型推論とTypeScriptサポートを備えています。

## インストール

```bash
npm install @mash43/pagefind-hub pagefind
```

*(注意: `pagefind` はピア依存関係としてインストールが必要です。)*

## 使い方

### 1. 設定ファイルを作成する

プロジェクトのルートディレクトリに `pagefind-hub.config.ts` を作成します:

```typescript
import { defineConfig } from "@mash43/pagefind-hub";
import { bluesky, github, youtube } from "@mash43/pagefind-hub/providers";

export default defineConfig({
  // オプション: Pagefindでインデックス化する静的HTMLファイルがあるディレクトリ。
  // 省略した場合は、プロバイダから取得した外部レコードのみのインデックスを作成します。
  siteDir: "dist", 

  // オプション: 生成されたPagefindインデックスの保存先ディレクトリ。
  // 指定されていない場合、siteDirがあれば `<siteDir>/pagefind` がデフォルトになります。
  // outputDir: "dist/pagefind", 

  // オプション: プロバイダから取得した外部レコードに適用するデフォルト言語。
  // siteDir 内の静的 HTML ファイルには適用されません。
  // language: "ja",

  providers: [
    bluesky({
      identifier: "your-handle.bsky.social",
    }),
    github({
      username: "your-github-username",
    }),
    youtube({
      channelId: "UCXXXXXXXXXXXXXXX",
      apiKey: process.env.YOUTUBE_API_KEY, // Node 21.7+ なら .env が自動で読み込まれます
    }),
  ],
});
```

### 2. CLIの実行

ルートディレクトリ（デフォルトはカレントディレクトリ）を対象として実行します:

```bash
npx pagefind-hub
```

必要に応じて、`package.json` の `scripts` に追加して実行することも可能です:

```json
{
  "scripts": {
    "pagefind-hub": "pagefind-hub"
  }
}
```

```bash
npm run pagefind-hub
```

## プロバイダ詳細

### Bluesky (`bluesky`)
特定のBlueskyユーザーのフィードから投稿を取得します。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `identifier` | `string`（必須） | - | Blueskyのハンドル名、またはDID。 |
| `limit` | `number` | `50` | 取得する投稿の最大数。 |
| `image` | `string` | - | フォールバック用の画像URL。 |
| `language` | `string` | - | 言語コード（例："ja"）。設定された場合、このプロバイダーのレコード全てに適用されます。 |
| `useThumbnails` | `boolean` | `true` | 投稿のサムネイル画像を使用するかどうか。 |
| `meta`, `filters`, `sort` | `Function` | 組み込み | Pagefindインデックス用のメタデータ等をカスタマイズできる関数。（デフォルトではプラットフォーム名、タイトル、日時が付与されます） |

### GitHub (`github`)
特定のユーザーのパブリックリポジトリ一覧を取得します。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `username` | `string`（必須） | - | GitHubのユーザー名。 |
| `token` | `string` | - | GitHubパーソナルアクセストークン（APIのレート制限を引き上げたい場合に使用）。 |
| `limit` | `number` | `50` | 取得するリポジトリの最大数。 |
| `image` | `string` | - | フォールバック用の画像URL。 |
| `language` | `string` | - | 言語コード（例："ja"）。設定された場合、このプロバイダーのレコード全てに適用されます。 |
| `meta`, `filters`, `sort` | `Function` | 組み込み | Pagefindインデックス用のメタデータ等をカスタマイズできる関数。（デフォルトではプラットフォーム名、タイトル、日時、スター数、フォーク数が付与されます） |

### YouTube (`youtube`)
特定のYouTubeチャンネルでアップロードされた最新の動画一覧を取得します。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `channelId` | `string`（必須） | - | YouTubeのチャンネルID。 |
| `apiKey` | `string`（必須） | - | YouTube Data API v3のキー。 |
| `limit` | `number` | `50` | 取得する動画の最大数。 |
| `image` | `string` | - | フォールバック用の画像URL。 |
| `language` | `string` | - | 言語コード（例："ja"）。設定された場合、このプロバイダーのレコード全てに適用されます。 |
| `useThumbnails` | `boolean` | `true` | 動画のサムネイル画像を使用するかどうか。 |
| `meta`, `filters`, `sort` | `Function` | 組み込み | Pagefindインデックス用のメタデータ等をカスタマイズできる関数。（デフォルトではプラットフォーム名、タイトル、日時が付与されます） |

## UI ユーティリティ

外部URLを含む検索結果を表示する際、自動的に `target="_blank"` 属性を付与して別タブで開くようにしたい場合があります。そのためのユーティリティ関数を提供しています。

```javascript
import { observeExternalLinks } from "@mash43/pagefind-hub/ui";

// Pagefindの検索結果コンテナの監視を開始する
const observer = observeExternalLinks();

// コンポーネントのアンマウント時などに監視を解除・クリーンアップする
// observer?.disconnect();
```

## ライセンス

MIT
