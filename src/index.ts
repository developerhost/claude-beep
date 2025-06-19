#!/usr/bin/env node

import { Command } from 'commander';
import { execa } from 'execa';
import beeper from 'beeper';
import * as notifier from 'node-notifier';
import { exec } from 'child_process';
import { platform } from 'os';

const program = new Command();

program
  .name('claude-beep')
  .description('Claude Code wrapper with completion beep')
  .version('1.0.0')
  .option('-s, --silent', 'disable beep sound')
  .option('-n, --no-notification', 'disable desktop notification')
  .allowUnknownOption()
  .helpOption(false)
  .argument('[args...]', 'arguments to pass to claude');

program.parse();

const options = program.opts();
const claudeArgs = program.args;

async function runClaude() {
  try {
    console.log('Starting Claude Code...');

    const subprocess = execa('claude', claudeArgs, {
      stdio: 'inherit',
      shell: true,
    });

    const result = await subprocess;

    // Claude completed successfully
    console.log('\n✅ Claude Code task completed!');

    // Play beep unless silenced
    if (!options.silent) {
      await playBeep();
    }

    // Show notification unless disabled
    if (options.notification !== false) {
      showNotification('Claude Code task completed successfully!');
    }

    process.exit(result.exitCode || 0);
  } catch (error: unknown) {
    console.error('\n❌ Claude Code encountered an error');

    // Play different beep for error
    if (!options.silent) {
      await playErrorBeep();
    }

    // Show error notification unless disabled
    if (options.notification !== false) {
      showNotification('Claude Code task failed', true);
    }

    process.exit((error as { exitCode?: number }).exitCode || 1);
  }
}

async function playBeep() {
  try {
    console.log('🔔 Playing success beep...');

    // Check if running in VSCode terminal
    const isVSCode = process.env.TERM_PROGRAM === 'vscode';

    if (isVSCode) {
      // VSCode terminal: use terminal bell multiple times for emphasis
      console.log('📟 VSCode detected, using terminal bell...');
      for (let i = 0; i < 3; i++) {
        process.stdout.write('\u0007');
        await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between beeps
      }
    } else {
      // Try different approaches based on platform
      const currentPlatform = platform();

      if (currentPlatform === 'darwin') {
        // macOS: use osascript beep command
        console.log('🍎 macOS detected, using osascript beep...');
        for (let i = 0; i < 3; i++) {
          await new Promise<void>(resolve => {
            exec('osascript -e "beep"', error => {
              if (error) {
                console.log('⚠️ osascript beep failed, using fallback...');
                process.stdout.write('\u0007');
              }
              resolve();
            });
          });
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else if (currentPlatform === 'win32') {
        // Windows: use PowerShell Console beep
        console.log('🪟 Windows detected, using PowerShell beep...');
        for (let i = 0; i < 3; i++) {
          await new Promise<void>(resolve => {
            exec('powershell -Command "[Console]::Beep(800, 200)"', error => {
              if (error) {
                console.log('⚠️ PowerShell beep failed, trying beeper...');
                beeper(1).catch(() => process.stdout.write('\u0007'));
              }
              resolve();
            });
          });
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        // Other platforms: use beeper
        console.log('🐧 Linux/Other detected, using beeper...');
        await beeper(3);
      }
    }
    console.log('✅ Beep completed');
  } catch {
    console.log('⚠️ Beeper failed, using system beep');
    // Fallback to system beep if beeper fails
    process.stdout.write('\u0007');
  }
}

async function playErrorBeep() {
  try {
    console.log('🔴 Playing error beep...');

    // Check if running in VSCode terminal
    const isVSCode = process.env.TERM_PROGRAM === 'vscode';

    if (isVSCode) {
      // VSCode terminal: use terminal bell multiple times for emphasis
      console.log('📟 VSCode detected, using terminal bell...');
      for (let i = 0; i < 2; i++) {
        process.stdout.write('\u0007');
        await new Promise(resolve => setTimeout(resolve, 300)); // Longer delay for error
      }
    } else {
      // Try different approaches based on platform
      const currentPlatform = platform();

      if (currentPlatform === 'darwin') {
        // macOS: use osascript beep command
        console.log('🍎 macOS detected, using osascript beep...');
        for (let i = 0; i < 2; i++) {
          await new Promise<void>(resolve => {
            exec('osascript -e "beep"', error => {
              if (error) {
                console.log('⚠️ osascript beep failed, using fallback...');
                process.stdout.write('\u0007');
              }
              resolve();
            });
          });
          if (i < 1) await new Promise(resolve => setTimeout(resolve, 300));
        }
      } else if (currentPlatform === 'win32') {
        // Windows: use PowerShell Console beep with higher pitch for error
        console.log('🪟 Windows detected, using PowerShell beep...');
        for (let i = 0; i < 2; i++) {
          await new Promise<void>(resolve => {
            exec('powershell -Command "[Console]::Beep(1000, 300)"', error => {
              if (error) {
                console.log('⚠️ PowerShell beep failed, trying beeper...');
                beeper(1).catch(() => process.stdout.write('\u0007'));
              }
              resolve();
            });
          });
          if (i < 1) await new Promise(resolve => setTimeout(resolve, 300));
        }
      } else {
        // Other platforms: use beeper
        console.log('🐧 Linux/Other detected, using beeper...');
        await beeper(2);
      }
    }
    console.log('🔴 Error beep completed');
  } catch {
    console.log('⚠️ Beeper failed, using system beep');
    // Fallback to system beep
    process.stdout.write('\u0007');
  }
}

function showNotification(message: string, isError: boolean = false) {
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

runClaude();
