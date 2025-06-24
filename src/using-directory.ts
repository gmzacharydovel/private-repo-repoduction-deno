/**
 * Runs a command in the contect f a different directory.  it will return to
 * the previous directory after the command is run.
 * @returns {Promise<T>} The result of the callback function.
 */
const usingDirectory = async <T>(
  directoryPathname: string,
  fn: () => Promise<T>,
): Promise<T> => {
  const cwd = Deno.cwd();
  Deno.chdir(directoryPathname);

  let out: T | null = null;

  try {
    out = await fn();
  } finally {
    Deno.chdir(cwd);
  }

  return out;
};

export default usingDirectory;
