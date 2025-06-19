import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { playBeep, playErrorBeep, showNotification } from './notifications.js';

// Mock external dependencies
vi.mock('beeper', () => ({
  default: vi.fn(),
}));

vi.mock('node-notifier', () => ({
  notify: vi.fn(),
}));

vi.mock('os', () => ({
  platform: vi.fn(() => 'linux'), // Use linux to test beeper path
}));

vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

import beeper from 'beeper';
import * as notifier from 'node-notifier';
import { exec } from 'child_process';
import { platform } from 'os';

describe('Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock stdout.write
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('playBeep', () => {
    it('should call beeper with 3 beeps on Linux', async () => {
      const mockedBeeper = vi.mocked(beeper);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('linux');
      mockedBeeper.mockResolvedValueOnce(undefined);

      await playBeep();

      expect(mockedBeeper).toHaveBeenCalledWith(3);
    });

    it('should use osascript on macOS', async () => {
      const mockedExec = vi.mocked(exec);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('darwin');

      // Mock exec to call callback immediately
      mockedExec.mockImplementation((...args: any[]) => {
        const callback = args[args.length - 1];
        if (typeof callback === 'function') callback(null, '', '');
        return {} as any;
      });

      await playBeep();

      expect(mockedExec).toHaveBeenCalledWith(
        'osascript -e "beep"',
        expect.any(Function)
      );
    });

    it('should use PowerShell on Windows', async () => {
      const mockedExec = vi.mocked(exec);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('win32');

      // Mock exec to call callback immediately
      mockedExec.mockImplementation((...args: any[]) => {
        const callback = args[args.length - 1];
        if (typeof callback === 'function') callback(null, '', '');
        return {} as any;
      });

      await playBeep();

      expect(mockedExec).toHaveBeenCalledWith(
        'powershell -Command "[Console]::Beep(800, 200)"',
        expect.any(Function)
      );
    });

    it('should fallback to system beep when beeper fails', async () => {
      const mockedBeeper = vi.mocked(beeper);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('linux');
      mockedBeeper.mockRejectedValueOnce(new Error('Beeper failed'));

      await playBeep();

      expect(process.stdout.write).toHaveBeenCalledWith('\u0007');
    });
  });

  describe('playErrorBeep', () => {
    it('should call beeper with 2 beeps on Linux', async () => {
      const mockedBeeper = vi.mocked(beeper);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('linux');
      mockedBeeper.mockResolvedValueOnce(undefined);

      await playErrorBeep();

      expect(mockedBeeper).toHaveBeenCalledWith(2);
    });

    it('should use osascript on macOS for errors', async () => {
      const mockedExec = vi.mocked(exec);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('darwin');

      // Mock exec to call callback immediately
      mockedExec.mockImplementation((...args: any[]) => {
        const callback = args[args.length - 1];
        if (typeof callback === 'function') callback(null, '', '');
        return {} as any;
      });

      await playErrorBeep();

      expect(mockedExec).toHaveBeenCalledWith(
        'osascript -e "beep"',
        expect.any(Function)
      );
    });

    it('should use PowerShell on Windows for errors', async () => {
      const mockedExec = vi.mocked(exec);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('win32');

      // Mock exec to call callback immediately
      mockedExec.mockImplementation((...args: any[]) => {
        const callback = args[args.length - 1];
        if (typeof callback === 'function') callback(null, '', '');
        return {} as any;
      });

      await playErrorBeep();

      expect(mockedExec).toHaveBeenCalledWith(
        'powershell -Command "[Console]::Beep(1000, 300)"',
        expect.any(Function)
      );
    });

    it('should fallback to system beep when beeper fails', async () => {
      const mockedBeeper = vi.mocked(beeper);
      const mockedPlatform = vi.mocked(platform);
      mockedPlatform.mockReturnValue('linux');
      mockedBeeper.mockRejectedValueOnce(new Error('Beeper failed'));

      await playErrorBeep();

      expect(process.stdout.write).toHaveBeenCalledWith('\u0007');
    });
  });

  describe('showNotification', () => {
    it('should call notifier.notify with correct parameters for success', () => {
      const mockedNotify = vi.mocked(notifier.notify);

      showNotification('Test message');

      expect(mockedNotify).toHaveBeenCalledWith({
        title: 'Claude Code',
        message: 'Test message',
        icon: undefined,
        sound: false,
        timeout: 5,
        wait: false,
      });
    });

    it('should call notifier.notify with error flag', () => {
      const mockedNotify = vi.mocked(notifier.notify);

      showNotification('Error message', true);

      expect(mockedNotify).toHaveBeenCalledWith({
        title: 'Claude Code',
        message: 'Error message',
        icon: undefined,
        sound: false,
        timeout: 5,
        wait: false,
      });
    });

    it('should fallback to console.log when notifier fails', () => {
      const mockedNotify = vi.mocked(notifier.notify);
      mockedNotify.mockImplementationOnce(() => {
        throw new Error('Notification failed');
      });

      showNotification('Test message');

      expect(console.log).toHaveBeenCalledWith(
        '(Notification would show: Test message)'
      );
    });
  });
});
