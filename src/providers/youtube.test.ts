import { expect, test } from "bun:test";
import { youtube } from "./youtube.js";

test("youtube provider should fetch and transform records in live", async () => {
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) {
		console.warn("Skipping YouTube live test: YOUTUBE_API_KEY not set");
		return;
	}

	const provider = youtube({ channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw", apiKey });
	const records = await provider.fetchRecords();

	expect(Array.isArray(records)).toBe(true);

	if (records.length > 0) {
		const record = records[0];
		expect(record.url).toContain("https://www.youtube.com/watch?v=");
		expect(record.meta?.platform).toBe("YouTube");
		expect(record.filters?.platform).toEqual(["YouTube"]);
	}
});
