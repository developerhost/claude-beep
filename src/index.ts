#!/usr/bin/env node

import { Command } from "commander";
import { execa } from "execa";
import beeper from "beeper";
import * as notifier from "node-notifier";
import { platform } from "os";

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

program.parse();

const options = program.opts();
const claudeArgs = program.args;

async function runClaude() {
  try {
    console.log("Starting Claude Code...");

    const subprocess = execa("claude", claudeArgs, {
      stdio: "inherit",
      shell: true,
    });

    const result = await subprocess;

    // Claude completed successfully
    console.log("\n Claude Code task completed!");

    // Play beep unless silenced
    if (!options.silent) {
      await playBeep();
    }

    // Show notification unless disabled
    if (options.notification !== false) {
      showNotification("Claude Code task completed successfully!");
    }

    process.exit(result.exitCode || 0);
  } catch (error: any) {
    console.error("\nL Claude Code encountered an error");

    // Play different beep for error
    if (!options.silent) {
      await playErrorBeep();
    }

    // Show error notification unless disabled
    if (options.notification !== false) {
      showNotification("Claude Code task failed", true);
    }

    process.exit(error.exitCode || 1);
  }
}

async function playBeep() {
  try {
    // Play a pleasant completion sound
    await beeper(3); // 3 short beeps
  } catch (error) {
    // Fallback to system beep if beeper fails
    process.stdout.write("\u0007");
  }
}

async function playErrorBeep() {
  try {
    // Play a different pattern for errors
    await beeper(2); // 2 short beeps for error
  } catch (error) {
    // Fallback to system beep
    process.stdout.write("\u0007");
  }
}

function showNotification(message: string, isError: boolean = false) {
  const currentPlatform = platform();

  try {
    notifier.notify({
      title: "Claude Code",
      message: message,
      icon: isError ? undefined : undefined, // Could add custom icons later
      sound: false, // We handle sound separately
      timeout: 5,
      wait: false,
    });
  } catch (error) {
    // Notifications are optional, don't fail if they don't work
    console.log(`(Notification would show: ${message})`);
  }
}

// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log("\n\nInterrupted by user");
  process.exit(130);
});

// Handle other termination signals
process.on("SIGTERM", () => {
  console.log("\n\nTerminated");
  process.exit(143);
});

runClaude();
