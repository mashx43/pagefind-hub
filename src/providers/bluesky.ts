import type { Provider, ProviderRecord } from "../types.js";

const DEFAULT_BLUESKY_ICON =
	"https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/bluesky.svg";

export interface BlueskyProviderOptions {
	identifier: string;
	limit?: number;
	/**
	 * Optional image to show for Bluesky records when no thumbnail is available
	 * or when useThumbnails is false.
	 */
	image?: string;
	/**
	 * Whether to use the post's thumbnail as the record's image.
	 * If false, or if no thumbnail is available, the image (or default image) will be used.
	 * @default true
	 */
	useThumbnails?: boolean;
}

interface BskyPostRecord {
	text: string;
	createdAt: string;
}

interface BskyPost {
	uri: string;
	record: BskyPostRecord;
	embed?: {
		$type: string;
		images?: Array<{
			thumb: string;
			fullsize: string;
			alt: string;
		}>;
		external?: {
			thumb?: string;
		};
	};
}

interface BskyFeedItem {
	post: BskyPost;
}

interface BskyFeedResponse {
	feed: BskyFeedItem[];
}

export function bluesky(options: BlueskyProviderOptions): Provider {
	const { identifier, limit = 50, image, useThumbnails = true } = options;
	const effectiveImage = image || DEFAULT_BLUESKY_ICON;

	return {
		name: "bluesky",

		async fetchRecords(): Promise<ProviderRecord[]> {
			const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(
				identifier,
			)}&limit=${limit}`;

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch Bluesky feed: ${response.statusText}`);
			}

			const data = (await response.json()) as BskyFeedResponse;
			const records: ProviderRecord[] = [];

			for (const item of data.feed) {
				// Create a URL from matching uri format: at://did:plc:xxx/app.bsky.feed.post/yyy
				// URL structure: https://bsky.app/profile/{identifier}/post/{postId}
				const uriParts = item.post.uri.split("/");
				const postId = uriParts[uriParts.length - 1];

				if (postId) {
					const postUrl = `https://bsky.app/profile/${identifier}/post/${postId}`;

					let postThumbnail: string | undefined;
					if (item.post.embed) {
						if (
							item.post.embed.$type === "app.bsky.embed.images#view" &&
							item.post.embed.images?.[0]
						) {
							postThumbnail = item.post.embed.images[0].thumb;
						} else if (
							item.post.embed.$type === "app.bsky.embed.external#view" &&
							item.post.embed.external?.thumb
						) {
							postThumbnail = item.post.embed.external.thumb;
						}
					}

					records.push({
						url: postUrl,
						content: item.post.record.text,
						image:
							useThumbnails && postThumbnail ? postThumbnail : effectiveImage,
						meta: {
							title: `Bluesky Post by ${identifier}`,
							date: item.post.record.createdAt,
							platform: "Bluesky",
						},
						filters: {
							platform: ["Bluesky"],
						},
					});
				}
			}

			return records;
		},
	};
}
