/**
 * config.ts
 * Centralized access to extension settings. All reads go through
 * getConfig() so the rest of the code never touches vscode.workspace directly.
 */

import * as vscode from 'vscode';
import { CleanRunConfig } from './types';

const SECTION = 'cleanRun';

/** Read the current configuration snapshot from VS Code settings. */
export function getConfig(): CleanRunConfig {
  const cfg = vscode.workspace.getConfiguration(SECTION);

  return {
    cleanBeforeRun: cfg.get<boolean>('cleanBeforeRun', true),
    reuseTerminal: cfg.get<boolean>('reuseTerminal', true),
    terminalName: cfg.get<string>('terminalName', 'Clean Run'),
    showNotifications: cfg.get<boolean>('showNotifications', true),
    showStatusBar: cfg.get<boolean>('showStatusBar', true),
    enabledLanguages: cfg.get<Record<string, boolean>>('enabledLanguages', {
      python: true,
      javascript: true,
      typescript: true,
      c: true,
      cpp: true,
      java: true,
      go: true,
      rust: true,
    }),
  };
}

/** Returns true when a given language key is enabled in settings. */
export function isLanguageEnabled(configKey: string): boolean {
  const { enabledLanguages } = getConfig();
  // Default to enabled if the key is absent
  return enabledLanguages[configKey] !== false;
}
