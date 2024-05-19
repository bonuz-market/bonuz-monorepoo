import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
	banner: {
		js: "'use client'",
	},
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	minify: "terser",
	treeshake: true,
	legacyOutput: true,
	...options,
}));
