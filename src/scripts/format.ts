import runCommand from "@/run-command.ts";
import runNpmCommand from "@/run-command.ts";

await runCommand(Deno.execPath(), ["fmt"], "log");
await runCommand(Deno.execPath(), ["lint", "--fix"], "log");
await runNpmCommand("eslint", ["--fix"], "none");
