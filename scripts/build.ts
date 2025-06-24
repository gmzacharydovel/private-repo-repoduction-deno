import build from "@/build.ts";
import { glob } from "glob";

const imports = await glob(".src/**/*.ts");

await build({
  outDir: "build",
  entryPoints: [
    "./src/mod.ts",
    ...imports.map((path) => {
      return {
        name: path.replace(/\.ts$/, ""),
        path,
      };
    }),
  ],
  shims: {
    deno: true,
  },
});
