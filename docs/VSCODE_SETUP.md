# VSCode Terminal Setup for Claude Beep

## Enable Terminal Bell in VSCode

To ensure the beep sound works in VSCode's integrated terminal, you need to enable the terminal bell:

### Method 1: Settings UI
1. Open VSCode Settings (Cmd+, on Mac or Ctrl+, on Windows/Linux)
2. Search for "terminal bell"
3. Check the box for **"Terminal › Integrated: Enable Bell"**

### Method 2: settings.json
Add this to your VSCode settings.json:

```json
{
  "terminal.integrated.enableBell": true
}
```

### Method 3: Command Palette
1. Open Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
2. Type "Preferences: Open Settings (JSON)"
3. Add the setting above

## Test the Beep

After enabling the terminal bell, test it:

```bash
# Test terminal bell directly
echo -e '\a'

# Or use printf
printf '\007'

# Test with claude-beep
pnpm dev --help
```

## Troubleshooting

If you don't hear the beep:

1. **Check System Volume**: Make sure your system volume is not muted
2. **Check macOS Alert Volume**: System Preferences → Sound → Sound Effects → Alert volume
3. **Check VSCode Setting**: Ensure `terminal.integrated.enableBell` is `true`
4. **Restart VSCode**: Sometimes a restart is needed after changing settings

## How It Works

When running in VSCode terminal, claude-beep detects the environment via `TERM_PROGRAM` environment variable and uses the terminal bell (`\u0007`) instead of system sounds. This ensures compatibility with VSCode's integrated terminal.

The tool will:
- Detect VSCode terminal automatically
- Send multiple bell characters for emphasis
- Show debug messages to confirm bell was sent
- Fall back to system sounds if not in VSCode