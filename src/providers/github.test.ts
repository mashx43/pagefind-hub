import { expect, test } from "bun:test";
import { github } from "./github.js";

test("github provider should fetch and transform records in live", async () => {
	const provider = github({ username: "github" });
	const records = await provider.fetchRecords();

	expect(Array.isArray(records)).toBe(true);

	if (records.length > 0) {
		const record = records[0];
		expect(record.url).toContain("https://github.com/github/");
		expect(record.meta?.platform).toBe("GitHub");
		expect(record.filters?.platform).toEqual(["GitHub"]);
	}
});
