/**
 * terminalManager.ts
 * Manages the lifecycle of the integrated terminal used by Clean Run.
 *
 * Key responsibility: obtain a terminal (reuse or create), optionally send a
 * Ctrl+L / form-feed clear that visually empties the viewport while keeping
 * the full scrollback buffer intact.
 */

import * as vscode from 'vscode';
import { getConfig } from './config';

/**
 * Retrieve or create the Clean Run terminal.
 *
 * When reuseTerminal is true we look for an existing terminal whose name
 * matches the configured terminalName before creating a new one.
 */
export function getOrCreateTerminal(): vscode.Terminal {
  const config = getConfig();
  const desiredName = config.terminalName;

  if (config.reuseTerminal) {
    // Walk all open terminals and return one with our name
    const existing = vscode.window.terminals.find(
      (t: vscode.Terminal) => t.name === desiredName
    );
    if (existing) {
      return existing;
    }
  }

  // Create a fresh terminal
  return vscode.window.createTerminal({ name: desiredName });
}

/**
 * Send the equivalent of Ctrl+L to the terminal.
 *
 * This writes the ASCII Form Feed character (\x0c) which most shells
 * (bash, zsh, fish, PowerShell) interpret as a visual clear while
 * preserving scrollback history — identical to the user pressing Ctrl+L.
 *
 * NOTE: We deliberately do NOT call terminal.clear() because that
 * destroys the scrollback buffer.
 */
export function softClearTerminal(terminal: vscode.Terminal): void {
  // \x0c = ASCII 12 = Form Feed = Ctrl+L
  terminal.sendText('\x0c', false);
}

/**
 * Run a shell command in the given terminal.
 * Brings the terminal panel to focus first so the user can see output.
 *
 * @param terminal  The target terminal.
 * @param command   The shell command string to execute.
 * @param cwd       Optional working directory to cd into first.
 */
export function runCommandInTerminal(
  terminal: vscode.Terminal,
  command: string,
  cwd: string | undefined
): void {
  // Reveal the terminal panel (focus = true brings keyboard focus too)
  terminal.show(true);

  // If we have a working directory, cd there before running the command
  if (cwd) {
    terminal.sendText(`cd "${cwd}"`, true);
  }

  // Send the actual run command
  terminal.sendText(command, true);
}
