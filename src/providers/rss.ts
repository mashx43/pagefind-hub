import type {
	CommonProviderOptions,
	Provider,
	ProviderRecord,
} from "../types.js";

export interface RSSProviderOptions extends CommonProviderOptions<RSSItem> {
	/**
	 * The URL of the RSS or Atom feed.
	 */
	url: string;
	/**
	 * Optional function to generate metadata for each record.
	 * @default
	 * ```typescript
	 * (item: RSSItem) => {
	 * 	title: item.title,
	 * 	date: item.isoDate,
	 * 	platform: hostname,
	 * }
	 * ```
	 */
	meta?: (item: RSSItem) => Record<string, string>;
	/**
	 * Optional filters to apply to the records.
	 * @default
	 * ```typescript
	 * () => ({ platform: [hostname] })
	 * ```
	 */
	filters?: (item: RSSItem) => Record<string, string[]>;
}

export interface RSSItem {
	link?: string;
	guid?: string;
	title?: string;
	pubDate?: string;
	creator?: string;
	summary?: string;
	content?: string;
	isoDate?: string;
	categories?: string[];
	contentSnippet?: string;
	enclosure?: {
		url: string;
		length?: number;
		type?: string;
	};
}

export function rss(options: RSSProviderOptions): Provider {
	const hostname = new URL(options.url).hostname;
	const {
		url,
		limit = 50,
		image,
		language,
		meta = ({ title, isoDate: date }) => ({
			...(title && { title }),
			...(date && { date }),
			platform: hostname,
		}),
		filters = () => ({ platform: [hostname] }),
		sort,
	} = options;

	return {
		name: "rss",

		async fetchRecords(): Promise<ProviderRecord[]> {
			// Dynamic import to handle peerDependency
			const Parser = await (async () => {
				try {
					const ParserModule = await import("rss-parser");
					return ParserModule.default;
				} catch {
					throw new Error(
						"The 'rss-parser' package is required to use the RSS provider. Please install it with 'npm install rss-parser'.",
					);
				}
			})();

			const parser = new Parser();
			const feed = await parser.parseURL(url);
			const items: RSSItem[] = feed.items.slice(0, limit);

			return items.map((item) => ({
				url: item.link || "",
				content: item.contentSnippet || item.content || "",
				language,
				meta: { ...(image && { image }), ...meta(item) },
				filters: filters(item),
				sort: sort?.(item),
			}));
		},
	};
}
