# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Beep is a TypeScript-based CLI wrapper for Claude Code that adds beep notifications when tasks complete. It acts as a proxy, passing all arguments to the underlying `claude` command while adding audio and visual feedback capabilities.

## Common Commands

```bash
# Install dependencies
pnpm install

# Build TypeScript to JavaScript
pnpm build

# Run in development mode (direct TypeScript execution)
pnpm dev

# Test the built binary
node dist/index.js --help
```

## Architecture

This is a single-file CLI application with the following key components:

### Core Architecture

- **CLI Wrapper**: Uses Commander.js to parse arguments, with most options passed through to Claude Code
- **Process Management**: Uses execa to spawn and manage the Claude Code subprocess with inherited stdio
- **Cross-platform Audio**: Uses the `beeper` library for sound notifications with system beep fallback
- **Desktop Notifications**: Uses `node-notifier` for cross-platform desktop notifications

### Key Design Patterns

- **Transparent Proxy**: All unknown options are passed through to Claude Code via `allowUnknownOption()`
- **Graceful Error Handling**: Different beep patterns for success vs error states
- **Signal Handling**: Proper cleanup for SIGINT and SIGTERM signals
- **Fallback Mechanisms**: System beep fallback if `beeper` fails, console logging if notifications fail

### Module System

The project uses ES modules (`"type": "module"` in package.json) with TypeScript compilation to `dist/` directory.

### Distribution Files

- `claude-beep.rb`: Homebrew formula for Mac installation
- `claude-beep.json`: Scoop manifest for Windows installation
- Binary is configured in package.json to point to `dist/index.js`

## Dependencies

Key dependencies and their purposes:

- `commander`: CLI argument parsing and help generation
- `execa`: Subprocess management with better API than child_process
- `beeper`: Cross-platform system beep sounds
- `node-notifier`: Desktop notifications across Mac/Windows/Linux

## Requirements

- Node.js 16+ (required for ES modules and dependencies)
- Claude Code must be installed and available in system PATH
- The built binary requires executable permissions (`chmod +x dist/index.js`)
