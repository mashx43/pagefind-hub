#!/usr/bin/env node
import { cac } from "cac";
import { loadConfig } from "./config.js";
import { runPagefindHub } from "./core/runner.js";

const cli = cac("pagefind-hub");

cli
  .command("[root]", "Run Pagefind Hub")
  .option("-c, --config <file>", "Path to config file")
  .action(async (root, options) => {
    try {
      const cwd = root || process.cwd();
      const config = await loadConfig(cwd);

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
  });

cli.help();
cli.version("0.0.1");

cli.parse();
