//#region src/ui/date.ts
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
function formatDateString(dateString) {
	if (!dateString) return void 0;
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;
	return date.toLocaleDateString("sv-SE");
}
/**
* Finds ISO date strings within the container and formats them.
* Specifically targets Pagefind UI elements like result tags and list items.
*
* @param container - The DOM element containing Pagefind results.
*/
function formatDate(container) {
	const selector = container.tagName === "PAGEFIND-RESULTS" ? `.pf-results li:not([${DATA_ATTR}])` : `.pagefind-ui__result-tag:not([${DATA_ATTR}])`;
	const elements = container.querySelectorAll(selector);
	for (const el of elements) {
		const original = el.innerHTML;
		const replaced = original.replace(ISO_DATE_RE, (match) => formatDateString(match) || match);
		if (original !== replaced) el.innerHTML = replaced;
		el.setAttribute(DATA_ATTR, "");
	}
}
//#endregion
//#region src/ui/link.ts
/**
* Updates links within the container to open in a new tab if they are external.
* Adds `target="_blank"` and `rel="noopener noreferrer"` to external links.
*
* @param container - The DOM element containing Pagefind results.
*/
function openExternal(container) {
	const links = container.querySelectorAll("a[href]:not([target='_blank'])");
	const { origin } = window.location;
	for (const link of links) {
		if (link.origin === origin) continue;
		link.setAttribute("target", "_blank");
		link.setAttribute("rel", "noopener noreferrer");
	}
}
//#endregion
//#region src/ui/index.ts
/**
* Observes the Pagefind results container and triggers specified actions.
* Automatically runs the actions when the container is first found and
* whenever its content changes (e.g., when new search results are loaded).
*
* @param actions - A single action or an array of actions to perform (defaults to [formatDate, openExternal]).
*/
function observePagefind(actions = [formatDate, openExternal]) {
	if (typeof window === "undefined" || !("MutationObserver" in window)) return null;
	const container = document.querySelector("pagefind-results, .pagefind-ui__drawer");
	if (!container) return null;
	const actionList = Array.isArray(actions) ? actions : [actions];
	const runActions = () => {
		for (const action of actionList) action(container);
	};
	runActions();
	const observer = new MutationObserver(runActions);
	observer.observe(container, {
		childList: true,
		subtree: true
	});
	return observer;
}
//#endregion
export { formatDate, observePagefind, openExternal };
