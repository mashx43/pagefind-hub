import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig, loadConfig } from "./config.js";

const TEST_ROOT = join(process.cwd(), ".config-test");

describe("Config", () => {
	beforeAll(async () => {
		await mkdir(TEST_ROOT, { recursive: true });
	});

	afterAll(async () => {
		await rm(TEST_ROOT, { recursive: true, force: true });
	});

	test("defineConfig helper should return the same object", () => {
		const config = {
			outputDir: "dist/pagefind",
			providers: [],
		};
		expect(defineConfig(config)).toBe(config);
	});

	test("loadConfig should load a valid config file", async () => {
		const configContent =
			"export default { siteDir: 'test-site', providers: [] };";
		const configPath = join(TEST_ROOT, "pagefind-hub.config.ts");

		await writeFile(configPath, configContent);

		const config = await loadConfig(TEST_ROOT);
		expect(config).not.toBeNull();
		expect(config?.siteDir).toBe("test-site");

		await rm(configPath);
	});

	test("loadConfig should return null if no config file exists", async () => {
		const emptyDir = join(TEST_ROOT, "empty");
		await mkdir(emptyDir);

		const config = await loadConfig(emptyDir);
		expect(config).toBeNull();

		await rm(emptyDir, { recursive: true });
	});
});
