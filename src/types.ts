/**
 * types.ts
 * Shared TypeScript interfaces and types used across the extension.
 */

/** Represents a language runner configuration */
export interface LanguageRunner {
  /** Human-readable language name */
  name: string;
  /** File extension (without dot) */
  extension: string;
  /** Configuration key used in settings */
  configKey: string;
  /** Generates the shell command(s) to run the file */
  buildCommand: (filePath: string, fileName: string, baseName: string, workspaceRoot: string | undefined) => string;
}

/** Result of resolving which runner to use */
export interface RunnerResolution {
  runner: LanguageRunner;
  command: string;
}

/** Extension configuration snapshot */
export interface CleanRunConfig {
  cleanBeforeRun: boolean;
  reuseTerminal: boolean;
  terminalName: string;
  showNotifications: boolean;
  showStatusBar: boolean;
  enabledLanguages: Record<string, boolean>;
}
