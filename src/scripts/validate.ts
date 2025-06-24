import runCommand from "@/run-command.ts";

await runCommand("deno", ["task", "format"]);
await runCommand("deno", ["task", "typecheck"]);
await runCommand("deno", ["task", "coverage"]);
await runCommand("deno", ["task", "build"]);
await runCommand("deno", ["task", "document"]);
await runCommand("deno", ["task", "dist"]);
