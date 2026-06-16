/**
 * statusBar.ts
 * Creates and manages the Clean Run status bar indicator.
 *
 * The item lives in the left section of the status bar and reflects whether
 * Clean Run is active (i.e., the currently open file has a supported runner).
 */

import * as vscode from 'vscode';
import { getConfig } from './config';
import { getRunnerForExtension } from './runners';
import { isLanguageEnabled } from './config';

let statusBarItem: vscode.StatusBarItem | undefined;

/** Create the status bar item and register it with VS Code. */
export function createStatusBarItem(context: vscode.ExtensionContext): void {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = 'clean-run.runActiveFile';
  statusBarItem.tooltip = 'Clean Run: Run Active File (Ctrl+Shift+R)';

  context.subscriptions.push(statusBarItem);

  // Update immediately and on every editor change
  updateStatusBar();
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => updateStatusBar())
  );
}

/**
 * Refresh the status bar item to reflect the currently active file.
 * Shows the item only when the active file has a supported + enabled runner.
 */
export function updateStatusBar(): void {
  if (!statusBarItem) {
    return;
  }

  const config = getConfig();

  // Hide if the user turned the status bar off in settings
  if (!config.showStatusBar) {
    statusBarItem.hide();
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    statusBarItem.hide();
    return;
  }

  const ext = getExtension(editor.document.fileName);
  if (!ext) {
    statusBarItem.hide();
    return;
  }

  const runner = getRunnerForExtension(ext);
  if (!runner || !isLanguageEnabled(runner.configKey)) {
    statusBarItem.hide();
    return;
  }

  statusBarItem.text = `$(play) Run ${runner.name}`;
  statusBarItem.show();
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getExtension(filePath: string): string | undefined {
  const parts = filePath.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : undefined;
}
