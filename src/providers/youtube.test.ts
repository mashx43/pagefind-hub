import { test, expect, describe } from "bun:test";
import { youtube } from "./youtube.js";

describe("YouTubeProvider Tests", () => {
  test("YouTubeProvider initialization", () => {
    const provider = youtube({ channelId: "UCxxxxxx" });
    expect(provider.name).toBe("youtube");
  });
});
