import { existsSync } from "node:fs";
import { join } from "node:path";
import { serve } from "bun";

const port = 3000;
const dir = process.argv[2] || "public";

console.log(`Serving ${dir} at http://localhost:${port}`);

serve({
	port,
	async fetch(req) {
		const url = new URL(req.url);
		let path = join(dir, url.pathname);

		if (existsSync(path) && !path.endsWith("/")) {
			if (path.includes("..")) {
				return new Response("Forbidden", { status: 403 });
			}
		} else {
			path = join(path, "index.html");
		}

		if (existsSync(path)) {
			return new Response(Bun.file(path));
		}

		return new Response("Not Found", { status: 404 });
	},
});
