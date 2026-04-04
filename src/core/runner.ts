import * as pagefind from "pagefind";
import type { PagefindHubConfig } from "../types.js";

export async function runPagefindHub(config: PagefindHubConfig): Promise<void> {
  console.log("Starting Pagefind Hub process...");

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
          language: record.language || "ja",
          meta: record.meta || {},
          filters: record.filters || {},
          sort: record.sort || {},
        });
      }
    } catch (error) {
      console.error(`Error fetching records from ${provider.name}:`, error);
    }
  }

  console.log(`Writing index to output directory: ${config.outputDir}`);
  await index.writeFiles({ outputPath: config.outputDir });
  
  console.log("Pagefind Hub process completed.");
  
  // Clean up pagefind process
  if (typeof pagefind.close === "function") {
      await pagefind.close();
  }
}
