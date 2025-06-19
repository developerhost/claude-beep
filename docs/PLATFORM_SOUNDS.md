# Platform-Specific Sound Implementation

Claude Beep uses different sound mechanisms optimized for each platform to ensure the best user experience.

## macOS 🍎

**Command**: `osascript -e "beep"`

- Uses the native macOS AppleScript beep command
- Respects system volume and sound settings
- Plays the system alert sound configured in System Preferences
- **Success**: 3 beeps with 200ms intervals
- **Error**: 2 beeps with 300ms intervals

### Test macOS Beep
```bash
osascript -e "beep"
```

## Windows PowerShell 🪟

**Command**: `powershell -Command "[Console]::Beep(frequency, duration)"`

- Uses PowerShell's Console.Beep() method
- Direct system call for reliable beep generation
- **Success**: 800Hz frequency, 200ms duration, 3 beeps
- **Error**: 1000Hz frequency, 300ms duration, 2 beeps (higher pitch)

### Test Windows PowerShell Beep
```powershell
[Console]::Beep(800, 200)   # Success sound
[Console]::Beep(1000, 300)  # Error sound
```

## VSCode Terminal 📟

**Command**: Terminal bell character (`\u0007`)

- Detected via `TERM_PROGRAM=vscode` environment variable
- Uses VSCode's integrated terminal bell feature
- Requires `terminal.integrated.enableBell: true` in VSCode settings
- **Success**: 3 bell characters with 200ms intervals
- **Error**: 2 bell characters with 300ms intervals

## Linux/Other Platforms 🐧

**Library**: `beeper` npm package

- Cross-platform JavaScript beep library
- Fallback to terminal bell if beeper fails
- **Success**: 3 short beeps
- **Error**: 2 short beeps

## Fallback Mechanism

All platforms have a fallback chain:

1. **Primary**: Platform-specific command (osascript/PowerShell/beeper)
2. **Secondary**: `beeper` library (where applicable)
3. **Final**: Terminal bell character (`\u0007`)

## Sound Patterns

| Event | VSCode | macOS | Windows | Linux |
|-------|--------|-------|---------|-------|
| Success | 3 bells (200ms) | 3 beeps (200ms) | 800Hz x3 (200ms) | beeper(3) |
| Error | 2 bells (300ms) | 2 beeps (300ms) | 1000Hz x2 (300ms) | beeper(2) |

## Environment Detection

Claude Beep automatically detects the environment:

```typescript
const isVSCode = process.env.TERM_PROGRAM === 'vscode';
const currentPlatform = platform(); // 'darwin', 'win32', 'linux', etc.
```

This ensures the most appropriate sound mechanism is used for each environment.