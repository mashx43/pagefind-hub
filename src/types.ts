export interface ProviderRecord {
  url: string;
  content: string;
  language?: string;
  image?: string;
  meta?: Record<string, string>;
  filters?: Record<string, string[]>;
  sort?: Record<string, string>;
}

export interface Provider {
  name: string;
  fetchRecords(): Promise<ProviderRecord[]>;
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
