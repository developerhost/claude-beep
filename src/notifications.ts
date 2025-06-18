import beeper from 'beeper';
import * as notifier from 'node-notifier';

export async function playBeep() {
  try {
    // Play a pleasant completion sound
    await beeper(3); // 3 short beeps
  } catch {
    // Fallback to system beep if beeper fails
    process.stdout.write('\u0007');
  }
}

export async function playErrorBeep() {
  try {
    // Play a different pattern for errors
    await beeper(2); // 2 short beeps for error
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
