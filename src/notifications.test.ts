import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { playBeep, playErrorBeep, showNotification } from "./notifications.js";

// Mock external dependencies
vi.mock("beeper", () => ({
  default: vi.fn(),
}));

vi.mock("node-notifier", () => ({
  notify: vi.fn(),
}));

vi.mock("os", () => ({
  platform: vi.fn(() => "darwin"),
}));

import beeper from "beeper";
import * as notifier from "node-notifier";

describe("Notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock stdout.write
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    // Mock console.log
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("playBeep", () => {
    it("should call beeper with 3 beeps", async () => {
      const mockedBeeper = vi.mocked(beeper);
      mockedBeeper.mockResolvedValueOnce(undefined);

      await playBeep();

      expect(mockedBeeper).toHaveBeenCalledWith(3);
    });

    it("should fallback to system beep when beeper fails", async () => {
      const mockedBeeper = vi.mocked(beeper);
      mockedBeeper.mockRejectedValueOnce(new Error("Beeper failed"));

      await playBeep();

      expect(process.stdout.write).toHaveBeenCalledWith("\u0007");
    });
  });

  describe("playErrorBeep", () => {
    it("should call beeper with 2 beeps", async () => {
      const mockedBeeper = vi.mocked(beeper);
      mockedBeeper.mockResolvedValueOnce(undefined);

      await playErrorBeep();

      expect(mockedBeeper).toHaveBeenCalledWith(2);
    });

    it("should fallback to system beep when beeper fails", async () => {
      const mockedBeeper = vi.mocked(beeper);
      mockedBeeper.mockRejectedValueOnce(new Error("Beeper failed"));

      await playErrorBeep();

      expect(process.stdout.write).toHaveBeenCalledWith("\u0007");
    });
  });

  describe("showNotification", () => {
    it("should call notifier.notify with correct parameters for success", () => {
      const mockedNotify = vi.mocked(notifier.notify);

      showNotification("Test message");

      expect(mockedNotify).toHaveBeenCalledWith({
        title: "Claude Code",
        message: "Test message",
        icon: undefined,
        sound: false,
        timeout: 5,
        wait: false,
      });
    });

    it("should call notifier.notify with error flag", () => {
      const mockedNotify = vi.mocked(notifier.notify);

      showNotification("Error message", true);

      expect(mockedNotify).toHaveBeenCalledWith({
        title: "Claude Code",
        message: "Error message",
        icon: undefined,
        sound: false,
        timeout: 5,
        wait: false,
      });
    });

    it("should fallback to console.log when notifier fails", () => {
      const mockedNotify = vi.mocked(notifier.notify);
      mockedNotify.mockImplementationOnce(() => {
        throw new Error("Notification failed");
      });

      showNotification("Test message");

      expect(console.log).toHaveBeenCalledWith(
        "(Notification would show: Test message)"
      );
    });
  });
});
