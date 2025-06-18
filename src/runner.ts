import { execa } from 'execa';
import { playBeep, playErrorBeep, showNotification } from './notifications.js';

export interface RunOptions {
  silent?: boolean;
  notification?: boolean;
}

export async function runClaude(
  claudeArgs: string[],
  options: RunOptions = {}
) {
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

    return result.exitCode || 0;
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

    throw error;
  }
}
