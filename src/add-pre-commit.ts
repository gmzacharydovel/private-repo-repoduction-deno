import getGitRoot from "@/get-git-root.ts";
import { join } from "@std/path";
import { logInfo } from "@superiorframework/logger";

const fileContents = `
# This file is generated, DO NOT EDIT IT MANUALLY

root=\`git rev-parse --show-toplevel\`
deno run format
git add $root
`;

/**
 * Add a pre-commit hook to the current git repository. Ideally this should
 * be run before other commands to help sneak in its existance.
 */
const addPreCommit = async (): Promise<void> => {
  const root = await getGitRoot();
  const outPath = join(root, ".git", "hooks", "pre-commit");

  let currentContent = "";
  try {
    currentContent = await Deno.readTextFile(outPath);
  } catch {
    // No content
  }

  if (currentContent !== fileContents) {
    logInfo("Adding pre-commit hook...");
    await Deno.writeTextFile(outPath, fileContents);
    await Deno.chmod(outPath, 0o755);
  }
};

export default addPreCommit;
