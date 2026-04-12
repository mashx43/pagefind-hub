import { defineConfig } from "../../src/config.js";
import { bluesky } from "../../src/providers/bluesky.js";
import { youtube } from "../../src/providers/youtube.js";

/**
 * Full configuration example using multiple providers.
 * To run this example, you might need to set environment variables
 * like BLUESKY_HANDLE or YOUTUBE_CHANNEL_ID if the providers require them.
 */
export default defineConfig({
  siteDir: "../shared/content",
  outputDir: "public/pagefind",
  providers: [
    bluesky({
			identifier: process.env.BLUESKY_IDENTIFIER || "bsky.app",
    }),
    youtube({
      channelId: process.env.YOUTUBE_CHANNEL_ID || "UC_x5XG1OV2P6uZZ5FSM9Ttw",
      apiKey: process.env.YOUTUBE_API_KEY as string,
    }),
  ],
});
