import { logInfo } from "@superiorframework/logger";

/** Configuration for how a command handles its streams. */
export enum StdStreamsConfigEnum {
  /** Logs to the console any stderr and stdout messages */
  LOG = "log",
  /** Returns the output of the streams. If there is an error, stdout will be printed. */
  INHERIT = "inherit",
  /** There will be no output at all. You will still recieve the returned streams. */
  NONE = "none",
}

export type StdStreamsConfig = StdStreamsConfigEnum[keyof StdStreamsConfigEnum];

const decoder = new TextDecoder();
const decode = (data: Uint8Array): string => decoder.decode(data);

export type RunCommandParameters = [
  /** The command to execute */
  exec: string,
  /** The arguments to pass to the command */
  args?: string[],
  std?: StdStreamsConfig,
];

export interface RunCommandReturnType {
  /** The return code of the program */
  code: number;
  /** The error output */
  stderr: string;
  /** The standard output */
  stdout: string;
}

export type RunCommandFn = (
  ...args: RunCommandParameters
) => Promise<RunCommandReturnType>;

/**
 * A helper function for calling a function that executes a command and returns the stdout.
 * An exception is thrown when the return code is not 0 with the contents of stderr.
 *
 * This is intended to be a less verbose version of Deno's `Deno.Command`.
 *
 * @param exec - The command to execute
 * @param args - The arguments to pass to the command
 * @param std - The standard output mode, can be "inherit", "log", or "none"
 * @returns the result of the command as a string
 */
const runCommand = async (
  ...[exec, args = [], std = "none"]: RunCommandParameters
): Promise<RunCommandReturnType> => {
  logInfo(`${exec} ${args.join(" ")}`);

  const stdout = std === "inherit" ? "inherit" : "piped";
  const stderr = std === "inherit" ? "inherit" : "piped";
  const stdin = "inherit";

  const command = new Deno.Command(exec, {
    args,
    stderr,
    stdin,
    stdout,
  });
  const output = await command.output();

  const out: RunCommandReturnType = {
    code: output.code,
    stderr: "",
    stdout: "",
  };

  if (std !== "inherit") {
    out.stderr = decode(output.stderr).trim();
    out.stdout = decode(output.stdout).trim();
  }

  if (output.code !== 0 && std !== "none") {
    console.log(out.stdout);
    console.error(out.stderr);

    throw new Error(out.stderr);
  }

  if (std === "log") {
    console.log(out.stdout);
  }

  return out;
};

export default runCommand;
