/**
 * Updates links within the container to open in a new tab if they are external.
 * Adds `target="_blank"` and `rel="noopener noreferrer"` to external links.
 *
 * @param container - The DOM element containing Pagefind results.
 */
export function openExternal(container: Element): void {
	const links = container.querySelectorAll<HTMLAnchorElement>(
		"a[href]:not([target='_blank'])",
	);
	const { origin } = window.location;

	for (const link of links) {
		if (link.origin === origin) continue;
		link.setAttribute("target", "_blank");
		link.setAttribute("rel", "noopener noreferrer");
	}
}
