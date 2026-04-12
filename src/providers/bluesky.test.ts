import { expect, test } from "bun:test";
import { bluesky } from "./bluesky.js";

test("bluesky provider should fetch and transform records in live", async () => {
	const provider = bluesky({ identifier: "bsky.app" });
	const records = await provider.fetchRecords();

	expect(Array.isArray(records)).toBe(true);

	if (records.length > 0) {
		const record = records[0];
		expect(record.url).toContain("https://bsky.app/profile/");
		expect(record.meta?.platform).toBe("Bluesky");
		expect(record.filters?.platform).toEqual(["Bluesky"]);
	}
});
