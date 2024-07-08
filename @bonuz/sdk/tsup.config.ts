import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["src/index.ts"],
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: true,
  dts: true,
}));
