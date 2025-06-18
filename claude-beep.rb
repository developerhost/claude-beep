class ClaudeBeep < Formula
  desc "A wrapper for Claude Code that plays a beep sound when tasks complete"
  homepage "https://github.com/your-username/claude-beep"
  url "https://github.com/your-username/claude-beep/archive/v1.0.0.tar.gz"
  sha256 "SHA256_PLACEHOLDER"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/claude-beep", "--help"
  end
end