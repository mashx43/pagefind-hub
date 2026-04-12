import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import * as pagefind from "pagefind";
import type { PagefindHubConfig } from "../types.js";

export async function runPagefindHub(config: PagefindHubConfig): Promise<void> {
	console.log("Starting Pagefind Hub process...");

	const outputDir =
		config.outputDir ??
		(config.siteDir ? join(config.siteDir, "pagefind") : undefined);

	if (!outputDir) {
		throw new Error(
			"outputDir is required when siteDir is not provided. Please specify outputDir in your config, or provide siteDir to use the default 'siteDir/pagefind'.",
		);
	}

	const { index } = await pagefind.createIndex();

	if (index === undefined || index === null) {
		throw new Error("Failed to create Pagefind index instance.");
	}

	if (config.siteDir) {
		console.log(`Indexing local directory: ${config.siteDir}`);
		await index.addDirectory({ path: config.siteDir });
	}

	for (const provider of config.providers) {
		console.log(`Fetching records from provider: ${provider.name}`);
		try {
			const records = await provider.fetchRecords();
			console.log(`Adding ${records.length} records from ${provider.name}`);

			for (const record of records) {
				await index.addCustomRecord({
					url: record.url,
					content: record.content,
					language: record.language || "en",
					meta: record.meta,
					filters: record.filters,
					sort: record.sort,
				});
			}
		} catch (error) {
			console.error(`Error fetching records from ${provider.name}:`, error);
		}
	}

	// Safety check and clean the output directory before writing files
	if (existsSync(outputDir)) {
		const files = readdirSync(outputDir);
		const isPagefindDir = files.includes("pagefind-entry.json");

		if (!isPagefindDir && files.length > 0) {
			throw new Error(
				`Safety Check Failed: The output directory "${outputDir}" is not empty and does not appear to be a Pagefind index directory. Please specify a clean directory or a directory previously used by Pagefind to avoid accidental data loss.`,
			);
		}
		console.log(`Cleaning existing output directory: ${outputDir}`);
		rmSync(outputDir, { recursive: true, force: true });
	}

	console.log(`Writing index to output directory: ${outputDir}`);
	await index.writeFiles({ outputPath: outputDir });

	console.log("Pagefind Hub process completed.");

	// Clean up pagefind process
	if (typeof pagefind.close === "function") {
		await pagefind.close();
	}
}
