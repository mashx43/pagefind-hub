import { defineConfig } from "../src/config.js";
import { bluesky } from "../src/providers/bluesky.js";
import { youtube } from "../src/providers/youtube.js";

/**
 * Full configuration example using multiple providers.
 * To run the YouTube provider, you need to set the YOUTUBE_API_KEY environment variable.
 */
export default defineConfig({
	siteDir: "./content",
	outputDir: "public/pagefind",
	providers: [
		bluesky({
			identifier: process.env.BLUESKY_IDENTIFIER || "bsky.app",
		}),
		...(process.env.YOUTUBE_API_KEY
			? [
					youtube({
						channelId:
							process.env.YOUTUBE_CHANNEL_ID || "UC_x5XG1OV2P6uZZ5FSM9Ttw",
						apiKey: process.env.YOUTUBE_API_KEY,
					}),
				]
			: []),
		// Add a mock provider so the search results are populated even without API keys
		{
			name: "mock-provider",
			async fetchRecords() {
				return [
					{
						url: "https://example.com/mock-1",
						content:
							"This is a sample search record from a custom provider. It demonstrates how Pagefind Hub can aggregate data from any source.",
						meta: {
							title: "Getting Started with Pagefind Hub",
							source: "Mock Provider",
							date: new Date().toISOString(),
						},
						filters: { source: ["mock"] },
					},
				];
			},
		},
	],
});
