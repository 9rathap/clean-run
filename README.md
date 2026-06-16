# Clean Run

Run the file you're working on in a clean terminal without losing terminal history.

Clean Run sends a **Ctrl+L form-feed** to the terminal before each execution, clearing the viewport while keeping previous output fully accessible by scrolling up. It works across Python, JavaScript, TypeScript, C, C++, Java, Go, and Rust.

---

## Features

- **One command, any language** — detects the active file's language and builds the right run command automatically.
- **Scroll-safe clear** — uses Ctrl+L / form-feed (`\x0c`), never `terminal.clear()`, so your history stays intact.
- **Terminal reuse** — optionally reuses a named terminal instead of spamming new panels.
- **Toolbar button** — a ▶ play button appears in the editor title bar for supported file types.
- **Status bar item** — shows which language is active; click it to run.
- **Keyboard shortcut** — `Ctrl+Shift+R` (Windows/Linux) / `Cmd+Shift+R` (macOS).
- **Per-language toggles** — disable Clean Run for any language without affecting others.
- **Auto-save** — saves the active file before running so you always run the latest version.

---

## Supported Languages

| Language   | Extension | Command                          |
|------------|-----------|----------------------------------|
| Python     | `.py`     | `python file.py`                 |
| JavaScript | `.js`     | `node file.js`                   |
| TypeScript | `.ts`     | `ts-node file.ts`                |
| C          | `.c`      | `gcc file.c -o file.out && ./file.out` |
| C++        | `.cpp`    | `g++ file.cpp -o file.out && ./file.out` |
| Java       | `.java`   | `javac file.java && java ClassName` |
| Go         | `.go`     | `go run file.go`                 |
| Rust       | `.rs`     | `cargo run` (Cargo project) or `rustc` |

---

## Installation (Development / Testing)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [VS Code](https://code.visualstudio.com/) v1.85+

### Steps

```bash
# 1. Clone or unzip the project folder
cd clean-run

# 2. Install dependencies
npm install

# 3. Open in VS Code
code .

# 4. Press F5 — a new Extension Development Host window opens
```

The extension is now live in the development host. Open any supported file and press **Ctrl+Shift+R** or click the ▶ button in the toolbar.

---

## Packaging (`.vsix`)

To produce an installable `.vsix` file:

```bash
npm run package
```

This outputs `clean-run-1.0.0.vsix` in the project root.

Install it manually:

```
Extensions panel → ⋯ menu → Install from VSIX…
```

Or via the CLI:

```bash
code --install-extension clean-run-1.0.0.vsix
```

---

## Settings

All settings live under the `cleanRun` namespace in VS Code settings (`Ctrl+,`).

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `cleanRun.cleanBeforeRun` | boolean | `true` | Soft-clear the terminal (Ctrl+L) before each run. |
| `cleanRun.reuseTerminal` | boolean | `true` | Reuse the existing Clean Run terminal instead of creating a new one. |
| `cleanRun.terminalName` | string | `"Clean Run"` | Name given to the terminal panel. |
| `cleanRun.showNotifications` | boolean | `true` | Show an info notification displaying the command that was run. |
| `cleanRun.showStatusBar` | boolean | `true` | Show the status bar indicator. |
| `cleanRun.enabledLanguages` | object | all `true` | Toggle Clean Run on/off per language. |

### Example: disable Python and notifications

```json
{
  "cleanRun.showNotifications": false,
  "cleanRun.enabledLanguages": {
    "python": false
  }
}
```

---

## Keyboard Shortcut

Default: **Ctrl+Shift+R** (Windows/Linux) · **Cmd+Shift+R** (macOS)

Customize it in **File → Preferences → Keyboard Shortcuts** and search for `Clean Run: Run Active File`.

---

## How the Clear Works

Most shells treat ASCII character 12 (form feed, `\x0c`) identically to **Ctrl+L** — they repaint the prompt at the top of the visible viewport. The scrollback buffer is untouched; scroll up any time to see earlier output.

`terminal.clear()` (the VS Code API method) destroys the scrollback buffer. Clean Run never calls it.

---

## Adding a New Language

1. Open `src/runners.ts`.
2. Add a new entry to the `RUNNERS` object following the existing pattern.
3. Add the `configKey` to the `enabledLanguages` default in `package.json`.
4. Rebuild (`npm run compile`).

---

BEFORE:
<img width="1512" height="982" alt="Screenshot 2026-06-17 at 1 32 54 AM" src="https://github.com/user-attachments/assets/f6159bb2-14de-4fd0-9279-be40fc48a18e" />
USE CLEAN RUN:
<img width="1512" height="982" alt="Screenshot 2026-06-17 at 1 33 19 AM" src="https://github.com/user-attachments/assets/642f334c-b246-4cca-87c1-28c56fc9e489" />
AFTER:
<img width="1512" height="982" alt="Screenshot 2026-06-17 at 1 33 28 AM" src="https://github.com/user-attachments/assets/959629ff-bb4a-4d5c-ae9e-582e54a70973" />




## License

MIT
