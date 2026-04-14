import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import * as readline from "node:readline/promises";
import { createJiti } from "jiti";
import type { PagefindHubConfig } from "./types.js";

// Load .env file using Node.js built-in method if available (Node 21.7.0+)
if (typeof process.loadEnvFile === "function") {
	try {
		process.loadEnvFile();
	} catch {
		// ignore
	}
}

export function defineConfig(config: PagefindHubConfig): PagefindHubConfig {
	return config;
}

export interface InitOptions {
	interactive?: boolean;
}

function generateConfigTemplate({
	siteDir,
	outputDir,
}: {
	siteDir?: string;
	outputDir?: string;
}): string {
	const siteDirLine = siteDir
		? `siteDir: "${siteDir}",`
		: `// siteDir: "dist",`;
	const outputDirLine = outputDir
		? `outputDir: "${outputDir}",`
		: siteDir
			? `// outputDir: "${siteDir}/pagefind",`
			: `outputDir: "dist/pagefind",`;

	return `import { defineConfig } from "@mash43/pagefind-hub";
// import { github } from "@mash43/pagefind-hub/providers";

export default defineConfig({
	${siteDirLine}
	${outputDirLine}
	providers: [
		// github({
		// 	username: "your-github-username",
		// }),
	],
});
`;
}

async function promptConfigDirs(): Promise<{
	siteDir: string;
	outputDir: string;
}> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	try {
		const siteDir = (
			await rl.question("siteDir (optional, e.g. dist): ")
		).trim();
		const outputDir = !siteDir
			? (await rl.question("outputDir (e.g. dist/pagefind): ")).trim()
			: "";
		return { siteDir, outputDir };
	} finally {
		rl.close();
	}
}

export async function initConfig(
	cwd: string = process.cwd(),
	options: InitOptions = {},
): Promise<string> {
	const configPath = resolve(cwd, "pagefind-hub.config.ts");
	if (existsSync(configPath)) {
		throw new Error(`Config file already exists at ${configPath}`);
	}

	const { siteDir, outputDir } =
		options.interactive !== false
			? await promptConfigDirs()
			: { siteDir: "", outputDir: "" };

	writeFileSync(configPath, generateConfigTemplate({ siteDir, outputDir }));
	return configPath;
}

const CONFIG_FILES = [
	"pagefind-hub.config.ts",
	"pagefind-hub.config.js",
	"pagefind-hub.config.mjs",
];

export async function loadConfig(
	cwd: string = process.cwd(),
): Promise<PagefindHubConfig | null> {
	const configPath = CONFIG_FILES.map((p) => resolve(cwd, p)).find(existsSync);
	if (!configPath) {
		return null;
	}

	try {
		const jiti = createJiti(import.meta.url);
		const mod = (await jiti.import(configPath)) as
			| { default: PagefindHubConfig }
			| PagefindHubConfig;
		return "default" in mod ? mod.default : mod;
	} catch (err) {
		console.error(`Error loading config from ${configPath}:`, err);
		return null;
	}
}
