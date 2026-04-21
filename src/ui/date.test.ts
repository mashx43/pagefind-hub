import { describe, expect, it } from "bun:test";
import { formatDateString } from "./date";

describe("formatDateString", () => {
	it("should format ISO date to YYYY-MM-DD", () => {
		expect(formatDateString("2024-04-21T12:00:00Z")).toBe("2024-04-21");
		expect(formatDateString("2024-04-21T12:00:00.000Z")).toBe("2024-04-21");
	});

	it("should return the original string for invalid dates", () => {
		expect(formatDateString("invalid-date")).toBe("invalid-date");
	});

	it("should return undefined for undefined input", () => {
		expect(formatDateString(undefined)).toBe(undefined);
	});

	it("should handle date strings without Z", () => {
		const date = new Date("2024-04-21T12:00:00");
		expect(formatDateString("2024-04-21T12:00:00")).toBe(
			date.toLocaleDateString("sv-SE"),
		);
	});
});
