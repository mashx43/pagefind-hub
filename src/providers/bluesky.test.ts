import { test, expect, describe } from "bun:test";
import { BlueskyProvider } from "./bluesky.js";

describe("BlueskyProvider Tests", () => {
  test("BlueskyProvider initialization", () => {
    const provider = new BlueskyProvider({ identifier: "user.bsky.social" });
    expect(provider.name).toBe("bluesky");
  });
});
