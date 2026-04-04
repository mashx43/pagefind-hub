import Parser from "rss-parser";
import type { Provider, ProviderRecord } from "../types.js";

export interface YouTubeProviderOptions {
  channelId: string;
}

export class YouTubeProvider implements Provider {
  name = "youtube";
  
  private channelId: string;

  constructor(options: YouTubeProviderOptions) {
    this.channelId = options.channelId;
  }

  async fetchRecords(): Promise<ProviderRecord[]> {
    const parser = new Parser();
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${this.channelId}`;
    
    const feed = await parser.parseURL(feedUrl);
    const records: ProviderRecord[] = [];

    for (const item of feed.items) {
      if (item.link && item.title) {
        records.push({
          url: item.link,
          content: item.contentSnippet || item.content || item.title,
          meta: {
            title: item.title,
            date: item.isoDate || item.pubDate || "",
            platform: "YouTube",
          },
          filters: {
            platform: ["YouTube"],
          },
        });
      }
    }

    return records;
  }
}
