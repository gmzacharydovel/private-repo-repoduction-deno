const createTemporaryFile = async (
  path: string,
  content: string,
  autoDelete: boolean = false,
) => {
  await Deno.writeTextFile(path, content);

  if (autoDelete) {
    globalThis.addEventListener("unload", () => {
      try {
        Deno.removeSync(path, { recursive: true });
      } catch {
        // No content
      }
    });
  }
};

export default createTemporaryFile;
