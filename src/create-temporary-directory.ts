/**
 * Makes a temporary directory and returns its path.
 * When the program exits, the directory is removed.
 * @param autoDelete - If true, the directory will be automatically deleted
 *                     when the program exits.
 * @returns The name of the temporary directory.
 */
const createTemporaryDirectory = async (
  autoDelete: boolean = false,
): Promise<string> => {
  const name = await Deno.makeTempDir();

  if (autoDelete) {
    globalThis.addEventListener("beforeunload", () => {
      try {
        Deno.removeSync(name, { recursive: true });
      } catch {
        // No content
      }
    });
  }

  return name;
};

export default createTemporaryDirectory();
