import { test, expect, describe, mock, afterEach } from "bun:test";
import { bluesky } from "./bluesky.js";

describe("BlueskyProvider", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  test("fetchRecords with mock data", async () => {
    const provider = bluesky({ identifier: "user.bsky.social" });

    global.fetch = mock(async () => {
      return new Response(JSON.stringify({
        feed: [{
          post: {
            uri: "at://did:plc:xxx/app.bsky.feed.post/post1",
            record: { text: "Hello Bluesky!", createdAt: "2024-01-01T00:00:00Z" },
            embed: { $type: "app.bsky.embed.images#view", images: [{ thumb: "https://example.com/thumb.jpg" }] }
          }
        }]
      }));
    }) as any;

    const records = await provider.fetchRecords();
    expect(records.length).toBe(1);
    expect(records[0].content).toBe("Hello Bluesky!");
    expect(records[0].image).toBe("https://example.com/thumb.jpg");
    expect(records[0].url).toBe("https://bsky.app/profile/user.bsky.social/post/post1");
  });
});
