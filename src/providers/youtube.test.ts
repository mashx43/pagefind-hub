import { afterEach, describe, expect, mock, test } from "bun:test";
import { youtube } from "./youtube.js";

describe("YouTubeProvider", () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	test("fetchRecords with mock data", async () => {
		const provider = youtube({ channelId: "UC123", apiKey: "fake-key" });

		global.fetch = mock(async (url: string) => {
			if (url.includes("channels")) {
				return new Response(
					JSON.stringify({
						items: [
							{ contentDetails: { relatedPlaylists: { uploads: "UU123" } } },
						],
					}),
				);
			}
			if (url.includes("playlistItems")) {
				return new Response(
					JSON.stringify({
						items: [
							{
								snippet: {
									title: "Video 1",
									description: "Desc 1",
									publishedAt: "2024-01-01T00:00:00Z",
									resourceId: { videoId: "v1" },
									thumbnails: { maxres: { url: "https://example.com/v1.jpg" } },
								},
							},
						],
					}),
				);
			}
			return new Response("Not Found", { status: 404 });
		}) as unknown as typeof global.fetch;

		const records = await provider.fetchRecords();
		expect(records.length).toBe(1);
		expect(records[0].url).toBe("https://www.youtube.com/watch?v=v1");
		expect(records[0].image).toBe("https://example.com/v1.jpg");
	});

	test("live fetch (if API key exists)", async () => {
		const apiKey = process.env.YOUTUBE_API_KEY;
		if (!apiKey) return;

		const provider = youtube({ channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw", apiKey });
		const records = await provider.fetchRecords();
		expect(records.length).toBeGreaterThan(0);
	});
});
