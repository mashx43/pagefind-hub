import { loadConfig as c12LoadConfig } from "c12";
import type { PagefindHubConfig } from "./types.js";

export function defineConfig(config: PagefindHubConfig): PagefindHubConfig {
  return config;
}

export async function loadConfig(cwd: string = process.cwd()): Promise<PagefindHubConfig | null> {
  const { config } = await c12LoadConfig<PagefindHubConfig>({
    name: "pagefind-hub",
    cwd,
  });
  
  if (!config) {
    return null;
  }
  
  return config as PagefindHubConfig;
}
