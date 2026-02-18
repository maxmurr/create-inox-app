import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["bin/cli.ts"],
  format: "esm",
  target: "node22",
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
  noExternal: [/.*/],
});
