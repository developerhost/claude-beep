作成した Claude Beep ツールの動作確認方法をお教えします：

1. 基本的な動作確認

# 開発モードで直接実行（推奨）

pnpm dev --help

# または、ビルド済みファイルで実行

node dist/index.js --help

2. Claude Code と組み合わせた動作確認

# Claude Code の簡単なコマンドをラップして実行

pnpm dev --version

# プロンプト付きで実行（実際の Claude Code セッション）

pnpm dev "Hello world"

# サイレントモードのテスト

pnpm dev --silent --version

# 通知無効モードのテスト

pnpm dev --no-notification --version

3. グローバルインストールして動作確認

# グローバルにインストール

npm install -g .

# インストール後の実行

claude-beep --help
claude-beep --version

# アンインストール

npm uninstall -g claude-beep

4. 実際の Claude Code セッション

# 対話モードで Claude Code を起動

pnpm dev

# 完了時にビープ音と通知が表示されることを確認

最も簡単な確認方法は pnpm dev --help です。これで Claude
Code のヘルプが表示され、完了時にビープ音が鳴り、通知が表示されます。
