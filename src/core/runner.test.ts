import { test, expect, describe, mock } from "bun:test";
import { runPagefindHub } from "./runner.js";
import * as pagefind from "pagefind";

mock.module("pagefind", () => ({
  createIndex: mock(async () => ({
    index: {
      addCustomRecord: mock(async () => {}),
      addDirectory: mock(async () => {}),
      writeFiles: mock(async () => {}),
    }
  })),
  close: mock(async () => {}),
}));

describe("Runner", () => {
  test("runPagefindHub indexes records from providers", async () => {
    const config = {
      outputDir: "tmp/pagefind",
      providers: [{
        name: "test",
        fetchRecords: async () => [{
          url: "https://example.com/1",
          content: "Test Content",
          meta: { title: "Test Title" }
        }]
      }]
    };

    await runPagefindHub(config);
    expect(pagefind.createIndex).toHaveBeenCalled();
  });
});
