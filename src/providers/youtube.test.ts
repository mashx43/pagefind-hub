import { test, expect, describe } from "bun:test";
import { youtube } from "./youtube.js";

describe("YouTubeProvider (Live)", () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  test("fetchRecords", async () => {
    if (!apiKey) {
      console.warn("Skipping YouTubeProvider live test: YOUTUBE_API_KEY is not set");
      return;
    }

    const provider = youtube({ 
      channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
      apiKey 
    });

    const records = await provider.fetchRecords();
    
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].url).toStartWith("https://www.youtube.com/watch?v=");
    expect(records[0].meta?.platform).toBe("YouTube");
    
    console.log(`Successfully fetched ${records.length} records from YouTube`);
  });
});
