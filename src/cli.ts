#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { loadConfig } from "./config.js";
import { runPagefindHub } from "./core/runner.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkg: { version: string } = JSON.parse(
	readFileSync(join(__dirname, "../package.json"), "utf8"),
);

async function main() {
	const { values, positionals } = parseArgs({
		options: {
			help: {
				type: "boolean",
				short: "h",
			},
			version: {
				type: "boolean",
				short: "v",
			},
		},
		allowPositionals: true,
	});

	if (values.help) {
		console.log(`
Usage: pagefind-hub [root] [options]

Options:
  -h, --help           Show help
  -v, --version        Show version
`);
		return;
	}

	if (values.version) {
		console.log(pkg.version);
		return;
	}

	try {
		const root = positionals[0] || process.cwd();
		const config = await loadConfig(root);

		if (!config) {
			console.error("Error: No valid pagefind-hub config found.");
			process.exit(1);
		}

		// Change working directory to root so that relative paths in config are resolved correctly
		process.chdir(root);

		await runPagefindHub(config);
	} catch (err) {
		console.error("Error executing Pagefind Hub:");
		console.error(err);
		process.exit(1);
	}
}

main();
