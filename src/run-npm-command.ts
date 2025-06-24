import runCommand, { type RunCommandFn } from "./run-command.ts";
import getRoot from "./get-git-root.ts";

/**
 * A helper function for running an npm command in your local
 * `node_modules/.bin` directory that executes a command and returns the
 * `stdout`. An exception is thrown when the return code is not `0` with the
 * contents of `stderr`.
 *
 * This is intended to be a less verbose version of Deno's `Deno.Command`.
 *
 * If you want to change the current working directory, you can use the
 * `usingDirectory` helper which will allow changing the directory for multiple
 * commands..
 *
 * @example
 *
 * Run a command
 *
 * ```
 * import runNpmCommand from "@superiorframework/build/run-npm-command.ts";
 *
 * await runNpmCommand("eslint", "--version");
 * ```
 *
 * @example
 *
 * Run a command from a different current working directory
 *
 * ```
 * import { runNpmCommand, usingDirectory } from "@superiorframework/build";
 * imp
 *
 * await usingDirectory("src", async () => {
 *   return runNpmCommand("esbuild");
 * });
 * ```
 *
 * @param exec - The command to execute
 * @param args - The arguments to pass to the command
 * @param std - The standard output mode, can be "inherit", "log", or "none"
 * @returns the result of the command as a string
 */
const runNpmCommand: RunCommandFn = async (
  ...[exec, ...leftoverParameters]
) => {
  const root = await getRoot();

  return runCommand(`${root}/node_modules/.bin/${exec}`, ...leftoverParameters);
};

export default runNpmCommand;
