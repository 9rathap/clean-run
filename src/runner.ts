/**
 * runner.ts
 * Orchestrates a single "Clean Run" execution:
 *   1. Validate the active file.
 *   2. Find the right language runner.
 *   3. Check the language is enabled.
 *   4. Get/create terminal.
 *   5. Optionally soft-clear the terminal.
 *   6. cd to the file's directory and send the run command.
 *   7. Update the status bar.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { getConfig, isLanguageEnabled } from './config';
import { getRunnerForExtension } from './runners';
import { getOrCreateTerminal, softClearTerminal, runCommandInTerminal } from './terminalManager';
import { updateStatusBar } from './statusBar';

/**
 * Entry point called by the registered command handler.
 * All user-facing errors are shown as vscode.window.showErrorMessage calls.
 */
export async function runActiveFile(): Promise<void> {
  const config = getConfig();

  // ── 1. Validate active editor ──────────────────────────────────────────
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage(
      'Clean Run: No active file. Open a file in the editor first.'
    );
    return;
  }

  // Prompt user to save unsaved changes before running
  if (editor.document.isDirty) {
    const saved = await editor.document.save();
    if (!saved) {
      vscode.window.showWarningMessage(
        'Clean Run: File has unsaved changes and could not be saved automatically.'
      );
    }
  }

  const filePath = editor.document.fileName;
  const fileDir  = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const ext      = path.extname(filePath).replace('.', '').toLowerCase();
  const baseName = path.basename(filePath, path.extname(filePath));

  // ── 2. Resolve runner ──────────────────────────────────────────────────
  const runner = getRunnerForExtension(ext);
  if (!runner) {
    vscode.window.showErrorMessage(
      `Clean Run: "${fileName}" — file type ".${ext}" is not supported.\n` +
      `Supported: .py .js .ts .c .cpp .java .go .rs`
    );
    return;
  }

  // ── 3. Check language is enabled ───────────────────────────────────────
  if (!isLanguageEnabled(runner.configKey)) {
    vscode.window.showWarningMessage(
      `Clean Run: ${runner.name} is disabled in settings ` +
      `(cleanRun.enabledLanguages.${runner.configKey}).`
    );
    return;
  }

  // ── 4. Resolve workspace root (needed by some runners, e.g. Rust) ──────
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

  // ── 5. Build the shell command ─────────────────────────────────────────
  const command = runner.buildCommand(filePath, fileName, baseName, workspaceRoot);

  // ── 6. Get or create the terminal ──────────────────────────────────────
  const terminal = getOrCreateTerminal();

  // ── 7. Soft-clear if enabled ────────────────────────────────────────────
  if (config.cleanBeforeRun) {
    softClearTerminal(terminal);
  }

  // ── 8. Run the command ─────────────────────────────────────────────────
  runCommandInTerminal(terminal, command, fileDir);

  // ── 9. Notify the user (optional) ──────────────────────────────────────
  if (config.showNotifications) {
    vscode.window.showInformationMessage(
      `Clean Run › ${runner.name}: ${command}`
    );
  }

  // ── 10. Refresh status bar ─────────────────────────────────────────────
  updateStatusBar();
}
