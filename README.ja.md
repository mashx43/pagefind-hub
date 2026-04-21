# @mash43/pagefind-hub

[![npm version](https://img.shields.io/npm/v/@mash43/pagefind-hub.svg)](https://www.npmjs.com/package/@mash43/pagefind-hub) 

[English](README.md) | [日本語](README.ja.md)

様々な外部コンテンツをシームレスに取得し、静的サイトのコンテンツと一緒に [Pagefind](https://pagefind.app/) を使って検索インデックスとして構築するためのCLIツールです。

## 特徴

- **外部プロバイダー連携**: 外部サービス（例：Bluesky, GitHub, YouTube）から簡単にデータを取得しインデックス化します。
- **統合インデックス**: ローカルのウェブサイトコンテンツ（`siteDir`）と外部データソースを結合し、一つのPagefindインデックスを作成します。
- **カスタマイズ性**: 各プロバイダーのレコードに対し、カスタムのメタデータ、フィルタ、ソートを自由に定義可能です。
- **UIサポート**: 検索結果に含まれる外部サイトへのリンクを自動的に別タブで開くようにするUIユーティリティが含まれています。
- **TypeScriptサポート**: `pagefind-hub.config.ts` での強力な型推論とTypeScriptサポートを備えています。

## インストール

```bash
npm install @mash43/pagefind-hub pagefind
```

*(注意: `pagefind` はピア依存関係としてインストールが必要です。)*

## 使い方

### 1. 設定ファイルの初期化

`init` コマンドを使用して、対話形式で設定ファイルを生成できます:

```bash
npx pagefind-hub init
```

このコマンドを実行すると、`siteDir` や `outputDir` の入力を求められ、プロジェクトのルートに `pagefind-hub.config.ts` が自動生成されます。

### 2. 設定ファイルの構成

手動で作成する場合や、生成されたファイルを編集する場合は、以下のようにプロバイダーを設定します:

```typescript
import { defineConfig } from "@mash43/pagefind-hub";
import { bluesky, github, rss, youtube } from "@mash43/pagefind-hub/providers";

export default defineConfig({
  // オプション: Pagefindでインデックス化する静的HTMLファイルがあるディレクトリ。
  // 省略した場合は、プロバイダーから取得した外部レコードのみのインデックスを作成します。
  siteDir: "dist", 

  // オプション: 生成されたPagefindインデックスの保存先ディレクトリ。
  // 指定されていない場合、siteDirが指定されていれば `<siteDir>/pagefind` がデフォルトになります。
  // outputDir: "dist/pagefind", 

  // オプション: プロバイダーから取得した外部レコードに適用するデフォルト言語。
  // siteDir 内の静的 HTML ファイルには適用されません。
  // language: "ja",

  providers: [
    bluesky({
      identifier: "your-handle.bsky.social",
    }),
    github({
      username: "your-github-username",
    }),
    rss({
      url: "https://example.com/feed.xml",
    }),
    youtube({
      channelId: "UCXXXXXXXXXXXXXXX",
      apiKey: process.env.YOUTUBE_API_KEY,
    }),
  ],
});
```

### 3. CLIの実行

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

## プロバイダー詳細

### 共通オプション
すべてのプロバイダーで共通して利用可能なオプションです。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `limit` | `number` | `50` | 取得するレコードの最大数。 |
| `image` | `string` | 各アイコン | フォールバック用の画像URL。 |
| `language` | `string` | - | 言語コード（例："ja"）。設定された場合、このプロバイダーのレコード全てに適用されます。 |
| `meta`, `filters`, `sort` | `Function` | 組み込み | Pagefindインデックス用のメタデータ等をカスタマイズできる関数。 |

---

### Bluesky (`bluesky`)
特定のBlueskyユーザーのフィードから投稿を取得します。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `identifier` | `string`（必須） | - | Blueskyのハンドル名、またはDID。 |
| `useThumbnails` | `boolean` | `true` | 投稿のサムネイル画像を使用するかどうか。 |

### GitHub (`github`)
特定のユーザーのパブリックリポジトリ一覧を取得します。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `username` | `string`（必須） | - | GitHubのユーザー名。 |
| `token` | `string` | - | GitHubトークン（APIレート制限の緩和に使用）。 |

### RSS (`rss`)
RSSまたはAtomフィードから項目を取得します。`platform` メタデータおよびフィルターは、フィードURLのホスト名から自動的に抽出されます。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `url` | `string`（必須） | - | RSSまたはAtomフィードのURL。 |

### YouTube (`youtube`)
特定のYouTubeチャンネルでアップロードされた最新の動画一覧を取得します。

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `channelId` | `string`（必須） | - | YouTubeのチャンネルID（例: `UCXXXXXXX`）またはハンドル（例: `@handle`）。 |
| `apiKey` | `string`（必須） | - | YouTube Data API v3のキー。 |
| `useThumbnails` | `boolean` | `true` | 動画のサムネイル画像を使用するかどうか。 |

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
