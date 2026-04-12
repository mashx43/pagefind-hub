import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/cli.ts", "src/providers/index.ts", "src/ui.ts"],
	format: ["esm"],
	clean: true,
	dts: true,
});
