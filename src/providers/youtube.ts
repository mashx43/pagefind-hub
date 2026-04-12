import type { Provider, ProviderRecord } from "../types.js";

const DEFAULT_YOUTUBE_ICON =
	"https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/youtube-icon.svg";

export interface YouTubeProviderOptions {
	channelId: string;
	apiKey: string;
	limit?: number;
	/**
	 * Optional image to show for YouTube records when no thumbnail is available
	 * or when useThumbnails is false.
	 */
	image?: string;
	/**
	 * Whether to use the video's thumbnail as the record's image.
	 * If false, or if no thumbnail is available, the image (or default image) will be used.
	 * @default true
	 */
	useThumbnails?: boolean;
}

interface YouTubeChannelResponse {
	items: Array<{
		contentDetails: {
			relatedPlaylists: {
				uploads: string;
			};
		};
	}>;
}

interface YouTubePlaylistItem {
	snippet: {
		title: string;
		description: string;
		publishedAt: string;
		resourceId: {
			videoId: string;
		};
		thumbnails?: {
			default?: { url: string };
			medium?: { url: string };
			high?: { url: string };
			standard?: { url: string };
			maxres?: { url: string };
		};
	};
}

interface YouTubePlaylistResponse {
	items: YouTubePlaylistItem[];
}

interface YouTubeErrorResponse {
	error?: {
		message?: string;
	};
}

export function youtube(options: YouTubeProviderOptions): Provider {
	const {
		channelId,
		apiKey,
		limit = 50,
		image,
		useThumbnails = true,
	} = options;
	const effectiveImage = image || DEFAULT_YOUTUBE_ICON;

	return {
		name: "youtube",

		async fetchRecords(): Promise<ProviderRecord[]> {
			if (!apiKey) {
				throw new Error(
					"YouTube API Key is required. Please provide it in the options or set YOUTUBE_API_KEY environment variable.",
				);
			}

			// 1. Get the "uploads" playlist ID from the channel ID
			const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;

			const channelResponse = await fetch(channelUrl);

			if (!channelResponse.ok) {
				const errorData =
					(await channelResponse.json()) as YouTubeErrorResponse;
				const errorMessage =
					errorData?.error?.message || channelResponse.statusText;
				throw new Error(
					`Failed to fetch YouTube channel info: ${errorMessage}`,
				);
			}
			const channelData =
				(await channelResponse.json()) as YouTubeChannelResponse;
			if (!channelData.items || channelData.items.length === 0) {
				throw new Error(`YouTube channel not found: ${channelId}`);
			}

			const uploadsPlaylistId =
				channelData.items[0].contentDetails.relatedPlaylists.uploads;

			// 2. Fetch the videos from the "uploads" playlist
			const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${limit}&key=${apiKey}`;

			const response = await fetch(url);
			if (!response.ok) {
				const errorData = (await response.json()) as YouTubeErrorResponse;
				const errorMessage = errorData?.error?.message || response.statusText;
				throw new Error(`Failed to fetch YouTube videos: ${errorMessage}`);
			}

			const data = (await response.json()) as YouTubePlaylistResponse;
			const records: ProviderRecord[] = [];

			if (!data.items) {
				return [];
			}

			for (const item of data.items) {
				const { title, description, publishedAt, resourceId, thumbnails } =
					item.snippet;
				const videoUrl = `https://www.youtube.com/watch?v=${resourceId.videoId}`;

				const videoThumbnail =
					thumbnails?.default?.url ||
					thumbnails?.medium?.url ||
					thumbnails?.high?.url ||
					thumbnails?.standard?.url ||
					thumbnails?.maxres?.url;

				records.push({
					url: videoUrl,
					content: description || title,
					image:
						useThumbnails && videoThumbnail ? videoThumbnail : effectiveImage,
					meta: {
						title: title,
						date: publishedAt,
						platform: "YouTube",
					},
					filters: {
						platform: ["YouTube"],
					},
				});
			}

			return records;
		},
	};
}
