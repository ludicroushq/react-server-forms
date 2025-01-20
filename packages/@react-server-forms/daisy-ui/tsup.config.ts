import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "daisyui", "react-server-forms"],
});
