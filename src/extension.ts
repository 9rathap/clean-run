/**
 * extension.ts
 * VS Code extension entry point.
 *
 * activate()   — called once when the extension is first loaded.
 * deactivate() — called when VS Code shuts down or the extension is disabled.
 *
 * Responsibilities here are intentionally thin:
 *   • Register commands.
 *   • Bootstrap the status bar.
 *   • Wire up config-change listeners.
 * All real logic lives in runner.ts, terminalManager.ts, statusBar.ts, etc.
 */

import * as vscode from 'vscode';
import { runActiveFile } from './runner';
import { createStatusBarItem, updateStatusBar } from './statusBar';

export function activate(context: vscode.ExtensionContext): void {
  // ── Register the main command ──────────────────────────────────────────
  const runCommand = vscode.commands.registerCommand(
    'clean-run.runActiveFile',
    runActiveFile
  );
  context.subscriptions.push(runCommand);

  // ── Bootstrap status bar ───────────────────────────────────────────────
  createStatusBarItem(context);

  // ── Re-evaluate status bar when settings change ────────────────────────
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
      if (e.affectsConfiguration('cleanRun')) {
        updateStatusBar();
      }
    })
  );

  console.log('Clean Run extension activated.');
}

export function deactivate(): void {
  // Nothing to clean up explicitly — VS Code disposes subscriptions automatically.
  console.log('Clean Run extension deactivated.');
}
