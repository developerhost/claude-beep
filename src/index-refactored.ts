#!/usr/bin/env node

import { createCLI, parseArgs } from './cli.js';
import { runClaude } from './runner.js';

async function main() {
  const program = createCLI();
  const { options, claudeArgs } = parseArgs(program, process.argv);

  try {
    const exitCode = await runClaude(claudeArgs, options);
    process.exit(exitCode);
  } catch (error: unknown) {
    process.exit((error as { exitCode?: number }).exitCode || 1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nInterrupted by user');
  process.exit(130);
});

// Handle other termination signals
process.on('SIGTERM', () => {
  console.log('\n\nTerminated');
  process.exit(143);
});

main();
