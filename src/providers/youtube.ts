import type { Provider, ProviderRecord } from "../types.js";

export interface YouTubeProviderOptions {
  channelId: string;
}

export function youtube(options: YouTubeProviderOptions): Provider {
  const { channelId } = options;

  return {
    name: "youtube",

    async fetchRecords(): Promise<ProviderRecord[]> {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      
      const response = await fetch(feedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch YouTube feed: ${response.statusText}`);
      }
      const xml = await response.text();
      
      const records: ProviderRecord[] = [];
      const entryMatches = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);

      for (const match of entryMatches) {
        const entry = match[1];
        
        const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
        const link = entry.match(/<link[^>]+href="([^"]+)"/)?.[1] || "";
        const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] || "";
        // YouTube RSS uses media:description or just content
        const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || "";

        if (link && title) {
          records.push({
            url: link,
            content: description || title,
            meta: {
              title: title,
              date: published,
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
  };
}
