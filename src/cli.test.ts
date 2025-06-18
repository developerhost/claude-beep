import { describe, it, expect } from 'vitest';
import { createCLI, parseArgs } from './cli.js';

describe('CLI', () => {
  describe('createCLI', () => {
    it('should create a CLI program with correct configuration', () => {
      const program = createCLI();

      expect(program.name()).toBe('claude-beep');
      expect(program.description()).toBe(
        'Claude Code wrapper with completion beep'
      );
      expect(program.version()).toBe('1.0.0');
    });

    it('should allow unknown options', () => {
      const program = createCLI();

      // This should not throw an error
      expect(() => {
        program.parse(['node', 'claude-beep', '--unknown-option'], {
          from: 'user',
        });
      }).not.toThrow();
    });
  });

  describe('parseArgs', () => {
    it('should parse silent option correctly', () => {
      const program = createCLI();
      const { options, claudeArgs } = parseArgs(program, [
        'node',
        'claude-beep',
        '--silent',
        'test-arg',
      ]);

      expect(options.silent).toBe(true);
      expect(claudeArgs).toEqual(['test-arg']);
    });

    it('should parse no-notification option correctly', () => {
      const program = createCLI();
      const { options, claudeArgs } = parseArgs(program, [
        'node',
        'claude-beep',
        '--no-notification',
        'test-arg',
      ]);

      expect(options.notification).toBe(false);
      expect(claudeArgs).toEqual(['test-arg']);
    });

    it('should parse short options correctly', () => {
      const program = createCLI();
      const { options, claudeArgs } = parseArgs(program, [
        'node',
        'claude-beep',
        '-s',
        '-n',
        'test-arg',
      ]);

      expect(options.silent).toBe(true);
      expect(options.notification).toBe(false);
      expect(claudeArgs).toEqual(['test-arg']);
    });

    it('should pass through unknown options to claude args', () => {
      const program = createCLI();
      const { options, claudeArgs } = parseArgs(program, [
        'node',
        'claude-beep',
        '--unknown-option',
        'value',
        'test-arg',
      ]);

      expect(claudeArgs).toEqual(['--unknown-option', 'value', 'test-arg']);
    });

    it('should handle multiple arguments', () => {
      const program = createCLI();
      const { options, claudeArgs } = parseArgs(program, [
        'node',
        'claude-beep',
        'arg1',
        'arg2',
        'arg3',
      ]);

      expect(claudeArgs).toEqual(['arg1', 'arg2', 'arg3']);
    });

    it('should handle no arguments', () => {
      const program = createCLI();
      const { options, claudeArgs } = parseArgs(program, [
        'node',
        'claude-beep',
      ]);

      expect(claudeArgs).toEqual([]);
      expect(options.silent).toBeUndefined();
      expect(options.notification).toBe(true); // Commander sets default for negatable options
    });
  });
});
