import type { Provider, ProviderRecord } from "../types.js";

export interface BlueskyProviderOptions {
  identifier: string;
  limit?: number;
}

interface BskyPostRecord {
  text: string;
  createdAt: string;
}

interface BskyPost {
  uri: string;
  record: BskyPostRecord;
}

interface BskyFeedItem {
  post: BskyPost;
}

interface BskyFeedResponse {
  feed: BskyFeedItem[];
}

export function bluesky(options: BlueskyProviderOptions): Provider {
  const { identifier, limit = 50 } = options;

  return {
    name: "bluesky",

    async fetchRecords(): Promise<ProviderRecord[]> {
      const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(
        identifier
      )}&limit=${limit}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Bluesky feed: ${response.statusText}`);
      }

      const data = (await response.json()) as BskyFeedResponse;
      const records: ProviderRecord[] = [];

      for (const item of data.feed) {
        // Create a URL from matching uri format: at://did:plc:xxx/app.bsky.feed.post/yyy
        // URL structure: https://bsky.app/profile/{identifier}/post/{postId}
        const uriParts = item.post.uri.split("/");
        const postId = uriParts[uriParts.length - 1];

        if (postId) {
          const postUrl = `https://bsky.app/profile/${identifier}/post/${postId}`;
          
          records.push({
            url: postUrl,
            content: item.post.record.text,
            meta: {
              title: `Bluesky Post by ${identifier}`,
              date: item.post.record.createdAt,
              platform: "Bluesky",
            },
            filters: {
              platform: ["Bluesky"],
            },
          });
        }
      }

      return records;
    }
  };
}
