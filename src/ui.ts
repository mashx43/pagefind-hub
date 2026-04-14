export function observeExternalLinks(): MutationObserver | null {
	if (typeof window === "undefined" || !("MutationObserver" in window)) {
		return null;
	}

	const container =
		document.getElementsByTagName("pagefind-results")[0] ??
		document.getElementsByClassName("pagefind-ui__results")[0];

	if (!container) {
		return null;
	}

	function updateLinks(): void {
		const links = container.querySelectorAll<HTMLAnchorElement>(
			"a[href]:not([target='_blank'])",
		);
		const currentOrigin = window.location.origin;

		for (const link of links) {
			if (link.origin === currentOrigin) continue;
			link.setAttribute("target", "_blank");
			link.setAttribute("rel", "noopener noreferrer");
		}
	}

	updateLinks();

	const observer = new MutationObserver(updateLinks);
	observer.observe(container, {
		childList: true,
		subtree: true,
	});

	return observer;
}
