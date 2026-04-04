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

export class BlueskyProvider implements Provider {
  name = "bluesky";
  
  private identifier: string;
  private limit: number;

  constructor(options: BlueskyProviderOptions) {
    this.identifier = options.identifier;
    this.limit = options.limit || 50;
  }

  async fetchRecords(): Promise<ProviderRecord[]> {
    const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(
      this.identifier
    )}&limit=${this.limit}`;
    
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
        const postUrl = `https://bsky.app/profile/${this.identifier}/post/${postId}`;
        
        records.push({
          url: postUrl,
          content: item.post.record.text,
          meta: {
            title: `Bluesky Post by ${this.identifier}`,
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
}
