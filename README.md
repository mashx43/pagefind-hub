# @mash43/pagefind-hub

[![npm version](https://img.shields.io/npm/v/@mash43/pagefind-hub.svg)](https://www.npmjs.com/package/@mash43/pagefind-hub) 

[English](README.md) | [日本語](README.ja.md)

A CLI tool that seamlessly aggregates external content and indexes them alongside your static site's content using [Pagefind](https://pagefind.app/).

## Features

- **External Providers**: Easily fetch records from external services (e.g., Bluesky, GitHub, YouTube) to be indexed.
- **Unified Index**: Combine your local website content (`siteDir`) with external data sources into a single Pagefind index.
- **Customizable**: Add custom metadata, filters, and sorting for each provider record.
- **UI Utilities**: Includes an observer to automatically open external search results in new tabs for better UX.
- **TypeScript Support**: Full TypeScript support with `pagefind-hub.config.ts`.

## Installation

```bash
npm install @mash43/pagefind-hub pagefind
```

*(Note: `pagefind` is required as a peer dependency.)*

## Usage

### 1. Initialization

You can quickly create a configuration file using the `init` command:

```bash
npx pagefind-hub init
```

This will prompt you for `siteDir` and `outputDir` and generate a `pagefind-hub.config.ts` file in your root directory.

### 2. Configuration

If you prefer to create the file manually, create a `pagefind-hub.config.ts` file at the root of your project:

```typescript
import { defineConfig } from "@mash43/pagefind-hub";
import { bluesky, github, rss, youtube } from "@mash43/pagefind-hub/providers";

export default defineConfig({
  // Optional: The directory containing your static HTML files to be indexed.
  // If omitted, it will only index records fetched from providers.
  siteDir: "dist", 

  // Optional: Output directory for the generated Pagefind index.
  // Defaults to "dist/pagefind" if siteDir is "dist".
  // outputDir: "dist/pagefind", 

  // Optional: Default language for records fetched from providers.
  // This does not apply to static HTML files in siteDir.
  // language: "en",

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

### 3. Run the CLI

Execute the command passing the root directory (defaults to current directory):

```bash
npx pagefind-hub
```

Alternatively, you can add a script to your `package.json` and run it using `npm`:

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

## Providers

### Common Options
These options are available for all providers.

| Option | Type | Default | Description |
|---|---|---|---|
| `limit` | `number` | `50` | Max number of records to fetch. |
| `image` | `string` | Provider icon | Fallback image URL to show for records. |
| `language` | `string` | - | Language code (e.g., "en"). |
| `meta`, `filters`, `sort` | `Function` | Built-in | Functions to customize Pagefind indexing data. |

---

### Bluesky (`bluesky`)
Fetches posts from a specific Bluesky author feed.

| Option | Type | Default | Description |
|---|---|---|---|
| `identifier` | `string` (Required) | - | The Bluesky handle or DID. |
| `useThumbnails` | `boolean` | `true` | Use the post's thumbnail. |

### GitHub (`github`)
Fetches public repositories from a specific user.

| Option | Type | Default | Description |
|---|---|---|---|
| `username` | `string` (Required) | - | GitHub username. |
| `token` | `string` | - | GitHub personal access token (increases API rate limits). |

### RSS (`rss`)
Fetches items from an RSS or Atom feed. The `platform` metadata/filter is automatically extracted from the feed URL's hostname.

| Option | Type | Default | Description |
|---|---|---|---|
| `url` | `string` (Required) | - | The URL of the RSS or Atom feed. |

### YouTube (`youtube`)
Fetches the latest videos uploaded by a YouTube channel.

| Option | Type | Default | Description |
|---|---|---|---|
| `channelId` | `string` (Required) | - | The YouTube Channel ID (e.g., `UCXXXXXXX`) or handle (e.g., `@handle`). |
| `apiKey` | `string` (Required) | - | YouTube Data API v3 Key. |
| `useThumbnails` | `boolean` | `true` | Use the video's thumbnail. |

## UI Integration

When displaying search results containing external URLs, you might want to automatically add `target="_blank"` to them. We provide a small utility script for this.

```javascript
import { observeExternalLinks } from "@mash43/pagefind-hub/ui";

// Start observing the Pagefind results container
const observer = observeExternalLinks();

// Remember to cleanup when unmounting/destroying
// observer?.disconnect();
```

## License

MIT
