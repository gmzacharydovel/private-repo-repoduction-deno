import runCommand from "./run-command.ts";

/**
 * Calculates the current package version based off of the last lagged
 * commit.
 *
 * @returns The version string or "0.0.0" if no tags are found.
 */
const calculateVersion = async (): Promise<string> => {
  let out = Deno.env.get("RELEASE_TAG");

  if (!out) {
    try {
      out =
        (await runCommand("git", ["describe", "--tags", "--abbrev=0"], "log"))
          .stdout;
    } catch {
      out = "0.0.0";
    }
  }

  return out.replace(/^v/, "");
};

export default calculateVersion;
