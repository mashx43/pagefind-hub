export interface ProviderRecord {
	url: string;
	content: string;
	language?: string;
	meta?: Record<string, string>;
	filters?: Record<string, string[]>;
	sort?: Record<string, string>;
}

export interface Provider {
	name: string;
	fetchRecords(): Promise<ProviderRecord[]>;
}

export interface CommonProviderOptions<T> {
	/**
	 * Optional limit for the number of records to fetch.
	 * @default 50
	 */
	limit?: number;
	/**
	 * Optional fallback image URL to show for records when no specific image is available.
	 */
	image?: string;
	/**
	 * Optional function to generate metadata for each record.
	 * The metadata is used by Pagefind for display and filtering.
	 */
	meta?: (item: T) => Record<string, string>;
	/**
	 * Optional function to generate filters for each record.
	 * These are used by Pagefind for faceted search.
	 */
	filters?: (item: T) => Record<string, string[]>;
	/**
	 * Optional function to generate sort attributes for each record.
	 */
	sort?: (item: T) => Record<string, string>;
}

export interface PagefindHubConfig {
	/**
	 * The directory containing your static HTML files to be indexed by Pagefind.
	 * If omitted, pagefind-hub will only create an index of records fetched from your providers.
	 */
	siteDir?: string;
	/**
	 * The directory where the generated Pagefind index should be written.
	 * If omitted and siteDir is specified, it defaults to "<siteDir>/pagefind".
	 * If siteDir is also omitted, this field is required.
	 */
	outputDir?: string;
	/**
	 * List of providers to fetch custom records from.
	 */
	providers: Provider[];
}
