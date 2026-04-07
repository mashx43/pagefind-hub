import { defineConfig } from "../../src/config.js";

/**
 * A simple mock provider that fetches a single record.
 */
const mockProvider = {
  name: "mock-provider",
  async fetchRecords() {
    return [
      {
        url: "https://example.com/mock-1",
        content: "This is a search record from an external provider.",
        meta: { title: "Mock Provider Record" },
        filters: { source: ["mock"] }
      }
    ];
  }
};

export default defineConfig({
  siteDir: "../shared/content",
  outputDir: "public/pagefind",
  providers: [mockProvider]
});
