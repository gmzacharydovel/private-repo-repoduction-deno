import runCommand from "./run-command.ts";

/**
 * Returns the git root of the project.
 * @returns The git root directory as a string.
 */
const getGitRoot = async (): Promise<string> => {
  const { stdout } = await runCommand("git", [
    "rev-parse",
    "--show-toplevel",
  ], "none");

  return stdout;
};

export default getGitRoot;
