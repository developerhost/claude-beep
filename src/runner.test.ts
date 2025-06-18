import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runClaude } from "./runner.js";

// Mock external dependencies
vi.mock("execa", () => ({
  execa: vi.fn(),
}));

vi.mock("./notifications.js", () => ({
  playBeep: vi.fn(),
  playErrorBeep: vi.fn(),
  showNotification: vi.fn(),
}));

import { execa } from "execa";
import { playBeep, playErrorBeep, showNotification } from "./notifications.js";

describe("Runner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("runClaude", () => {
    it("should execute claude with correct arguments", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockResult = { exitCode: 0 };
      mockedExeca.mockResolvedValueOnce(mockResult as any);

      const exitCode = await runClaude(["--help"]);

      expect(mockedExeca).toHaveBeenCalledWith("claude", ["--help"], {
        stdio: "inherit",
        shell: true,
      });
      expect(exitCode).toBe(0);
    });

    it("should play beep and show notification on success", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockResult = { exitCode: 0 };
      mockedExeca.mockResolvedValueOnce(mockResult as any);

      await runClaude(["--help"]);

      expect(playBeep).toHaveBeenCalled();
      expect(showNotification).toHaveBeenCalledWith(
        "Claude Code task completed successfully!"
      );
      expect(console.log).toHaveBeenCalledWith("Starting Claude Code...");
      expect(console.log).toHaveBeenCalledWith(
        "\n✅ Claude Code task completed!"
      );
    });

    it("should not play beep when silent option is true", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockResult = { exitCode: 0 };
      mockedExeca.mockResolvedValueOnce(mockResult as any);

      await runClaude(["--help"], { silent: true });

      expect(playBeep).not.toHaveBeenCalled();
      expect(showNotification).toHaveBeenCalledWith(
        "Claude Code task completed successfully!"
      );
    });

    it("should not show notification when notification option is false", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockResult = { exitCode: 0 };
      mockedExeca.mockResolvedValueOnce(mockResult as any);

      await runClaude(["--help"], { notification: false });

      expect(playBeep).toHaveBeenCalled();
      expect(showNotification).not.toHaveBeenCalled();
    });

    it("should handle errors correctly", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockError = { exitCode: 1, message: "Command failed" };
      mockedExeca.mockRejectedValueOnce(mockError);

      await expect(runClaude(["--invalid"])).rejects.toThrow();

      expect(playErrorBeep).toHaveBeenCalled();
      expect(showNotification).toHaveBeenCalledWith(
        "Claude Code task failed",
        true
      );
      expect(console.error).toHaveBeenCalledWith(
        "\n❌ Claude Code encountered an error"
      );
    });

    it("should not play error beep when silent option is true", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockError = { exitCode: 1, message: "Command failed" };
      mockedExeca.mockRejectedValueOnce(mockError);

      await expect(
        runClaude(["--invalid"], { silent: true })
      ).rejects.toThrow();

      expect(playErrorBeep).not.toHaveBeenCalled();
      expect(showNotification).toHaveBeenCalledWith(
        "Claude Code task failed",
        true
      );
    });

    it("should not show error notification when notification option is false", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockError = { exitCode: 1, message: "Command failed" };
      mockedExeca.mockRejectedValueOnce(mockError);

      await expect(
        runClaude(["--invalid"], { notification: false })
      ).rejects.toThrow();

      expect(playErrorBeep).toHaveBeenCalled();
      expect(showNotification).not.toHaveBeenCalled();
    });

    it("should handle empty arguments array", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockResult = { exitCode: 0 };
      mockedExeca.mockResolvedValueOnce(mockResult as any);

      const exitCode = await runClaude([]);

      expect(mockedExeca).toHaveBeenCalledWith("claude", [], {
        stdio: "inherit",
        shell: true,
      });
      expect(exitCode).toBe(0);
    });

    it("should default to exit code 0 when result.exitCode is undefined", async () => {
      const mockedExeca = vi.mocked(execa);
      const mockResult = {}; // No exitCode property
      mockedExeca.mockResolvedValueOnce(mockResult as any);

      const exitCode = await runClaude(["--help"]);

      expect(exitCode).toBe(0);
    });
  });
});
