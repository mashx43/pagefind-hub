import type {
	CommonProviderOptions,
	Provider,
	ProviderRecord,
} from "../types.js";

const DEFAULT_BLUESKY_ICON =
	"https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/bluesky.svg";
export interface BlueskyProviderOptions
	extends CommonProviderOptions<BskyPost> {
	/**
	 * Bluesky handle or DID (e.g., "bsky.app" or "did:plc:xxx").
	 */
	identifier: string;
	/**
	 * Whether to use the post's thumbnail as the record's image.
	 * If false, or if no thumbnail is available, the image (or default image) will be used.
	 * @default true
	 */
	useThumbnails?: boolean;
	/**
	 * Optional meta data to apply to the records.
	 * @default
	 * ```typescript
	 * (post) => ({
	 * 	title: `Bluesky Post by ${identifier}`,
	 * 	date: post.record.createdAt,
	 * 	platform: "Bluesky",
	 * })
	 * ```
	 */
	meta?: (post: BskyPost) => Record<string, string>;
	/**
	 * Optional filters to apply to the records.
	 * @default
	 * ```typescript
	 * (post) => ({ platform: ["Bluesky"] })
	 * ```
	 */
	filters?: (post: BskyPost) => Record<string, string[]>;
	/**
	 * Optional sort to apply to the records.
	 * @default undefined
	 */
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
	const {
		identifier,
		limit = 50,
		image = DEFAULT_BLUESKY_ICON,
		useThumbnails = true,
		language,
		meta = (post) => ({
			title: `Bluesky Post by ${identifier}`,
			date: post.record.createdAt,
			platform: "Bluesky",
		}),
		filters = () => ({ platform: ["Bluesky"] }),
		sort,
	} = options;

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

			for (const { post } of data.feed) {
				const uriParts = post.uri.split("/");
				const postId = uriParts[uriParts.length - 1];

				if (!postId) continue;

				const postUrl = `https://bsky.app/profile/${identifier}/post/${postId}`;

				let postThumbnail: string | undefined;
				const { embed } = post;
				if (embed) {
					if (embed.images?.[0]) {
						postThumbnail = embed.images[0].thumb;
					} else if (embed.external?.thumb) {
						postThumbnail = embed.external.thumb;
					}
				}

				records.push({
					url: postUrl,
					content: post.record.text,
					language,
					meta: {
						image: (useThumbnails && postThumbnail) || image,
						...meta(post),
					},
					filters: filters(post),
					sort: sort?.(post),
				});
			}

			return records;
		},
	};
}
