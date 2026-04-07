import { test, expect, describe } from "bun:test";
import { bluesky } from "./bluesky.js";

describe("BlueskyProvider Tests", () => {
  test("BlueskyProvider initialization", () => {
    const provider = bluesky({ identifier: "user.bsky.social" });
    expect(provider.name).toBe("bluesky");
  });
});
