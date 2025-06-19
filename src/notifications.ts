import beeper from 'beeper';
import * as notifier from 'node-notifier';
import { exec } from 'child_process';
import { platform } from 'os';

export async function playBeep() {
  try {
    const currentPlatform = platform();

    if (currentPlatform === 'darwin') {
      // macOS: use osascript beep command
      for (let i = 0; i < 3; i++) {
        await new Promise<void>(resolve => {
          exec('osascript -e "beep"', error => {
            if (error) {
              process.stdout.write('\u0007');
            }
            resolve();
          });
        });
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
      }
    } else if (currentPlatform === 'win32') {
      // Windows: use PowerShell Console beep
      for (let i = 0; i < 3; i++) {
        await new Promise<void>(resolve => {
          exec('powershell -Command "[Console]::Beep(800, 200)"', error => {
            if (error) {
              beeper(1).catch(() => process.stdout.write('\u0007'));
            }
            resolve();
          });
        });
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
      }
    } else {
      // Other platforms: use beeper
      await beeper(3);
    }
  } catch {
    // Fallback to system beep if beeper fails
    process.stdout.write('\u0007');
  }
}

export async function playErrorBeep() {
  try {
    const currentPlatform = platform();

    if (currentPlatform === 'darwin') {
      // macOS: use osascript beep command
      for (let i = 0; i < 2; i++) {
        await new Promise<void>(resolve => {
          exec('osascript -e "beep"', error => {
            if (error) {
              process.stdout.write('\u0007');
            }
            resolve();
          });
        });
        if (i < 1) await new Promise(resolve => setTimeout(resolve, 300));
      }
    } else if (currentPlatform === 'win32') {
      // Windows: use PowerShell Console beep with higher pitch for error
      for (let i = 0; i < 2; i++) {
        await new Promise<void>(resolve => {
          exec('powershell -Command "[Console]::Beep(1000, 300)"', error => {
            if (error) {
              beeper(1).catch(() => process.stdout.write('\u0007'));
            }
            resolve();
          });
        });
        if (i < 1) await new Promise(resolve => setTimeout(resolve, 300));
      }
    } else {
      // Other platforms: use beeper
      await beeper(2);
    }
  } catch {
    // Fallback to system beep
    process.stdout.write('\u0007');
  }
}

export function showNotification(message: string, isError: boolean = false) {
  try {
    notifier.notify({
      title: 'Claude Code',
      message: message,
      icon: isError ? undefined : undefined, // Could add custom icons later
      sound: false, // We handle sound separately
      timeout: 5,
      wait: false,
    });
  } catch {
    // Notifications are optional, don't fail if they don't work
    console.log(`(Notification would show: ${message})`);
  }
}
