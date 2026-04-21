import { expect, test } from "bun:test";
import { rss } from "./rss.js";

test("rss provider should fetch and transform records in live", async () => {
	const provider = rss({
		url: "https://github.com/pagefind/pagefind/releases.atom",
	});
	const records = await provider.fetchRecords();

	expect(Array.isArray(records)).toBe(true);

	if (records.length > 0) {
		const record = records[0];
		expect(record.url.toLowerCase()).toContain(
			"https://github.com/pagefind/pagefind/releases/tag/",
		);
		expect(record.meta?.platform).toBe("github.com");
		expect(record.filters?.platform).toEqual(["github.com"]);
	}
});
