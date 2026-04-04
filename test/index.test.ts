import { test, expect, describe } from "bun:test";
import { BlueskyProvider } from "../src/providers/bluesky.js";
import { YouTubeProvider } from "../src/providers/youtube.js";
import { defineConfig } from "../src/config.js";

describe("Pagefind Hub Tests", () => {
  test("BlueskyProvider initialization", () => {
    const provider = new BlueskyProvider({ identifier: "user.bsky.social" });
    expect(provider.name).toBe("bluesky");
  });

  test("YouTubeProvider initialization", () => {
    const provider = new YouTubeProvider({ channelId: "UCxxxxxx" });
    expect(provider.name).toBe("youtube");
  });

  test("defineConfig helper", () => {
    const config = defineConfig({
      outputDir: "dist/pagefind",
      providers: [],
    });
    expect(config.outputDir).toBe("dist/pagefind");
    expect(config.providers.length).toBe(0);
  });
});
