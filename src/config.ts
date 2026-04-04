import { createJiti } from "jiti";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
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

export async function loadConfig(cwd: string = process.cwd()): Promise<PagefindHubConfig | null> {
  const configPaths = [
    resolve(cwd, "pagefind-hub.config.ts"),
    resolve(cwd, "pagefind-hub.config.js"),
    resolve(cwd, "pagefind-hub.config.mjs"),
  ];

  const configPath = configPaths.find(p => existsSync(p));
  if (!configPath) {
    return null;
  }

  try {
    const jiti = createJiti(import.meta.url);
    const mod = await jiti.import(configPath) as any;
    return (mod.default || mod) as PagefindHubConfig;
  } catch (err) {
    console.error(`Error loading config from ${configPath}:`, err);
    return null;
  }
}
