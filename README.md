# Claude Beep 🔔

A wrapper for Claude Code that plays a beep sound when tasks complete, with cross-platform support for Mac, Windows, and Linux.

## Features

- 🔔 Plays beep sound when Claude Code tasks complete
- 🖥️ Desktop notifications (optional)
- 🌍 Cross-platform support (Mac, Windows, Linux)
- ⚙️ Configurable options (silent mode, no notifications)
- 🎵 Different sounds for success and error states

## Installation

### npm
```bash
npm install -g claude-beep
```

### Homebrew (Mac)
```bash
brew install claude-beep
```

### Scoop (Windows)
```bash
scoop install claude-beep
```

## Usage

Use `claude-beep` instead of `claude` to run Claude Code with beep notifications:

```bash
# Basic usage
claude-beep

# Pass arguments to Claude Code
claude-beep --help
claude-beep "write a hello world function"

# Silent mode (no beep)
claude-beep --silent

# Disable desktop notifications
claude-beep --no-notification
```

## Options

- `-s, --silent`: Disable beep sound
- `-n, --no-notification`: Disable desktop notification
- All other options are passed through to Claude Code

## Requirements

- Node.js 16 or higher
- Claude Code must be installed and available in PATH

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/claude-beep.git
cd claude-beep

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build
```

## License

MIT