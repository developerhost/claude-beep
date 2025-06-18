import { Command } from "commander";

export function createCLI() {
  const program = new Command();

  program
    .name("claude-beep")
    .description("Claude Code wrapper with completion beep")
    .version("1.0.0")
    .option("-s, --silent", "disable beep sound")
    .option("-n, --no-notification", "disable desktop notification")
    .allowUnknownOption()
    .helpOption(false)
    .argument("[args...]", "arguments to pass to claude");

  return program;
}

export function parseArgs(program: Command, args: string[]) {
  program.parse(args, { from: "user" });

  // Filter out the 'node' and script name from args to get only Claude arguments
  const filteredArgs = args.slice(2); // Remove 'node' and 'claude-beep'
  const options = program.opts();

  // Remove our own options from the claude args
  const claudeArgs = filteredArgs.filter((arg) => {
    // Skip our specific options
    if (
      arg === "-s" ||
      arg === "--silent" ||
      arg === "-n" ||
      arg === "--no-notification"
    ) {
      return false;
    }
    return true;
  });

  return {
    options,
    claudeArgs,
  };
}
