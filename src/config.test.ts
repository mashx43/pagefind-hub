import { test, expect, describe } from "bun:test";
import { defineConfig } from "./config.js";

describe("Config Helper Tests", () => {
  test("defineConfig helper", () => {
    const config = defineConfig({
      outputDir: "dist/pagefind",
      providers: [],
    });
    expect(config.outputDir).toBe("dist/pagefind");
    expect(config.providers.length).toBe(0);
  });
});
