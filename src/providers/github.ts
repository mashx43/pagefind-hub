import type {
	CommonProviderOptions,
	Provider,
	ProviderRecord,
} from "../types.js";

const DEFAULT_GITHUB_ICON =
	"https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/github-icon.svg";

export interface GitHubProviderOptions
	extends CommonProviderOptions<GitHubRepo> {
	/**
	 * GitHub username to fetch repositories from.
	 */
	username: string;
	/**
	 * Optional GitHub Personal Access Token (PAT) to increase API rate limits.
	 */
	token?: string;
	/**
	 * Optional meta data to apply to the records.
	 * @default
	 * ```typescript
	 * (repo) => ({
	 * 	title: repo.full_name,
	 * 	date: repo.pushed_at,
	 * 	platform: "GitHub",
	 * 	stars: repo.stargazers_count.toString(),
	 * 	forks: repo.forks_count.toString(),
	 * })
	 * ```
	 */
	meta?: (repo: GitHubRepo) => Record<string, string>;
	/**
	 * Optional filters to apply to the records.
	 * @default
	 * ```typescript
	 * (repo) => ({ platform: ["GitHub"] })
	 * ```
	 */
	filters?: (repo: GitHubRepo) => Record<string, string[]>;
}

interface GitHubRepo {
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	pushed_at: string;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	owner: {
		avatar_url: string;
	};
}

export function github(options: GitHubProviderOptions): Provider {
	const {
		username,
		token,
		limit = 50,
		image,
		meta = (repo) => ({
			title: repo.full_name,
			date: repo.pushed_at,
			platform: "GitHub",
			stars: repo.stargazers_count.toString(),
			forks: repo.forks_count.toString(),
		}),
		filters = () => ({ platform: ["GitHub"] }),
		sort,
	} = options;
	const effectiveImage = image || DEFAULT_GITHUB_ICON;

	return {
		name: "github",

		async fetchRecords(): Promise<ProviderRecord[]> {
			const url = new URL(`https://api.github.com/users/${username}/repos`);
			url.searchParams.set("sort", "pushed");
			url.searchParams.set("per_page", limit.toString());

			const headers: Record<string, string> = {
				Accept: "application/vnd.github.v3+json",
				"User-Agent": "pagefind-hub",
			};

			if (token) {
				headers.Authorization = `token ${token}`;
			}

			const response = await fetch(url.toString(), { headers });

			if (!response.ok) {
				throw new Error(`Failed to fetch GitHub repos: ${response.statusText}`);
			}

			const repos = (await response.json()) as GitHubRepo[];
			const records: ProviderRecord[] = [];

			for (const repo of repos) {
				records.push({
					url: repo.html_url,
					content: repo.description || "No description",
					language: repo.language || undefined,
					meta: { image: effectiveImage, ...meta(repo) },
					filters: filters(repo),
					sort: sort?.(repo),
				});
			}

			return records;
		},
	};
}
