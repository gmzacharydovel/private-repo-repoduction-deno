import runCommand from "@/run-command.ts";
import console from "node:console";

const packageConfig = JSON.parse(
  await Deno.readTextFile("./build/package.json"),
);
const { name, version } = packageConfig;

console.log(packageConfig);

const versionExists = await (async (): Promise<boolean> => {
  try {
    console.log(`versionExists, name: ${name}, version: ${version}`);
    await runCommand("npm", ["show", `${name}@${version}`], "inherit");
    return true;
  } catch {
    return false;
  }
})();

const packageExists = await (async (): Promise<boolean> => {
  try {
    console.log(`packageExists, name: ${name}`);
    await runCommand("npm", ["show", name], "inherit");
    return true;
  } catch (e) {
    return false;
  }
})();

if ((packageExists && !versionExists) || !packageExists) {
  console.log("Publishing...");

  const cwd = Deno.cwd();
  Deno.chdir("build");

  await runCommand("npm", ["publish", "--access", "restricted"], "log");

  Deno.chdir(cwd);

  console.log("Published.");
} else {
  console.log(
    `Package ${name}@${version} already exists. Not publishing., ${
      JSON.stringify({ packageExists, versionExists })
    }`,
  );
  Deno.exit(1);
}
