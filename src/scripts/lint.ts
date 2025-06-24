import runCommand from "@/run-command.ts";
import runNpmCommand from "@/run-npm-command.ts";

await runCommand(Deno.execPath(), ["lint"], "log");

await runNpmCommand("eslint", ["--quiet"], "log");
