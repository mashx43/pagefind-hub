import { formatDate } from "./date";
import { openExternal } from "./link";

export { formatDate, openExternal };

/** Function type for actions that process the Pagefind results container. */
export type PagefindAction = (container: Element) => void;

/**
 * Observes the Pagefind results container and triggers specified actions.
 * Automatically runs the actions when the container is first found and
 * whenever its content changes (e.g., when new search results are loaded).
 *
 * @param actions - A single action or an array of actions to perform (defaults to [formatDate, openExternal]).
 */
export function observePagefind(
	actions: PagefindAction | PagefindAction[] = [formatDate, openExternal],
): MutationObserver | null {
	if (typeof window === "undefined" || !("MutationObserver" in window)) {
		return null;
	}

	const container = document.querySelector(
		"pagefind-results, .pagefind-ui__drawer",
	);

	if (!container) return null;

	const actionList = Array.isArray(actions) ? actions : [actions];

	const runActions = () => {
		for (const action of actionList) {
			action(container);
		}
	};

	// Initial execution for static content
	runActions();

	// Watch for dynamic changes in the search results
	const observer = new MutationObserver(runActions);
	observer.observe(container, {
		childList: true,
		subtree: true,
	});

	return observer;
}
