import { test, expect, describe } from "bun:test";
import { YouTubeProvider } from "./youtube.js";

describe("YouTubeProvider Tests", () => {
  test("YouTubeProvider initialization", () => {
    const provider = new YouTubeProvider({ channelId: "UCxxxxxx" });
    expect(provider.name).toBe("youtube");
  });
});
