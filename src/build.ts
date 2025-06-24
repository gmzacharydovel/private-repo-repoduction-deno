import runCommand from "./run-command.ts";
import { build as buildInternal, emptyDir } from "@deno/dnt";
import calculateVersion from "./calculate-version.ts";
import { logInfo } from "@superiorframework/logger";
import { join } from "@std/path";
import usingDirectory from "./using-directory.ts";

type BuildProps = {
  outDir: string;
  entryPoints: (string | { name: string; path: string })[];
  shims?: { deno?: boolean };
};

const build = async (
  { outDir, entryPoints, shims = {} }: BuildProps,
): Promise<void> => {
  await emptyDir(outDir);

  const packageConfig = {
    ...JSON.parse(await Deno.readTextFile("./package.json")),
    version: await calculateVersion(),
    devDependencies: undefined,
  };

  await Deno.writeTextFile(
    join(outDir, "package.json"),
    JSON.stringify(packageConfig, null, 2),
  );

  await usingDirectory(outDir, () => runCommand("npm", ["install"], "log"));

  const config = {
    entryPoints,
    outDir,
    shims,
    test: false,
    package: packageConfig,
  };

  logInfo(config);

  await buildInternal(config);

  await Deno.copyFile("LICENSE", join(outDir, "LICENSE"));
  await Deno.copyFile("README.md", join(outDir, "README.md"));
};

export default build;
