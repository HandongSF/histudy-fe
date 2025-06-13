const { build } = require("esbuild");

build({
  entryPoints: ["./src/index.ts"],
  platform: "node",
  bundle: true,
  outfile: "./dist/index.js",
  minify: false,
  sourcemap: true,
  target: "es2020",
  external: ["sharp"],
});
