import { join } from "@std/path";
import { copy } from "@std/fs";
import runCommand from "@/run-command.ts";

const sanitize = (value: string): string => {
  return value.replace(/\//g, "-").replace(/[^a-zA-Z]+/, "");
};

const run = async (): Promise<void> => {
  const { name, version } = JSON.parse(
    await Deno.readTextFile("./build/package.json"),
  );
  const outDir = "dist";
  const fileName = `${sanitize(name)}-v${version}`;
  const buildSourceDir = join("build");
  const compressSourceDir = join("dist", fileName);
  const cwd = Deno.cwd();

  try {
    await Deno.remove(outDir, { recursive: true });
  } catch {
    await Deno.mkdir(outDir, { recursive: true });
  }

  try {
    await copy(buildSourceDir, compressSourceDir, { overwrite: true });
    Deno.chdir(outDir);
    await runCommand("zip", ["-r", `${fileName}.zip`, fileName], "log");
    await runCommand("tar", ["-czf", `${fileName}.tar.gz`, fileName], "log");
    await Deno.remove(fileName, { recursive: true });
  } finally {
    Deno.chdir(cwd);
  }
};

await run();
