/** Regular expression to match ISO date strings. */
const ISO_DATE_RE = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/g;

/** Data attribute used to mark elements already processed by the date formatter. */
const DATA_ATTR = "data-pf-hub-date";

/**
 * Formats an ISO date string to YYYY-MM-DD in the local timezone.
 * Uses the "sv-SE" locale as a shorthand to obtain the ISO format.
 *
 * @param dateString - The ISO date string to format.
 */
export function formatDateString(
	dateString: string | undefined,
): string | undefined {
	if (!dateString) return undefined;

	const date = new Date(dateString);
	// Check for invalid dates
	if (Number.isNaN(date.getTime())) {
		return dateString;
	}

	return date.toLocaleDateString("sv-SE");
}

/**
 * Finds ISO date strings within the container and formats them.
 * Specifically targets Pagefind UI elements like result tags and list items.
 *
 * @param container - The DOM element containing Pagefind results.
 */
export function formatDate(container: Element): void {
	const isComponentUI = container.tagName === "PAGEFIND-RESULTS";
	const selector = isComponentUI
		? `.pf-results li:not([${DATA_ATTR}])`
		: `.pagefind-ui__result-tag:not([${DATA_ATTR}])`;
	const elements = container.querySelectorAll(selector);

	for (const el of elements) {
		const original = el.innerHTML;
		const replaced = original.replace(
			ISO_DATE_RE,
			(match) => formatDateString(match) || match,
		);

		if (original !== replaced) {
			el.innerHTML = replaced;
		}
		el.setAttribute(DATA_ATTR, "");
	}
}
