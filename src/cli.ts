#!/usr/bin/env node
import { parseArgs } from "node:util";
import { loadConfig } from "./config.js";
import { runPagefindHub } from "./core/runner.js";

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      config: {
        type: "string",
        short: "c",
      },
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
  -c, --config <file>  Path to config file
  -h, --help           Show help
  -v, --version        Show version
`);
    return;
  }

  if (values.version) {
    console.log("0.0.1");
    return;
  }

  try {
    const root = positionals[0] || process.cwd();
    const config = await loadConfig(root);

    if (!config) {
      console.error("Error: No valid pagefind-hub config found.");
      process.exit(1);
    }

    await runPagefindHub(config);
  } catch (err) {
    console.error("Error executing Pagefind Hub:");
    console.error(err);
    process.exit(1);
  }
}

main();
