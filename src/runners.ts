/**
 * runners.ts
 * Defines how each supported language is compiled and/or executed.
 * Each LanguageRunner maps a file extension to a shell command string.
 *
 * To add a new language:
 *   1. Add an entry to RUNNERS with a unique configKey.
 *   2. Add the configKey to the enabledLanguages default in package.json.
 */

import * as path from 'path';
import { LanguageRunner } from './types';

/**
 * All supported language runners, keyed by file extension (lowercase, no dot).
 */
export const RUNNERS: Record<string, LanguageRunner> = {

  // ── Python ──────────────────────────────────────────────────────────────
  py: {
    name: 'Python',
    extension: 'py',
    configKey: 'python',
    buildCommand: (_fp, fileName) =>
      `python "${fileName}"`,
  },

  // ── JavaScript (Node.js) ────────────────────────────────────────────────
  js: {
    name: 'JavaScript',
    extension: 'js',
    configKey: 'javascript',
    buildCommand: (_fp, fileName) =>
      `node "${fileName}"`,
  },

  // ── TypeScript (ts-node) ────────────────────────────────────────────────
  ts: {
    name: 'TypeScript',
    extension: 'ts',
    configKey: 'typescript',
    buildCommand: (_fp, fileName) =>
      // ts-node is tried first; npx ts-node is the fallback
      `ts-node "${fileName}" 2>/dev/null || npx ts-node "${fileName}"`,
  },

  // ── C ───────────────────────────────────────────────────────────────────
  c: {
    name: 'C',
    extension: 'c',
    configKey: 'c',
    buildCommand: (_fp, fileName, baseName) => {
      // Compile to a temp binary next to the source, then run it
      const out = `./${baseName}.out`;
      return `gcc "${fileName}" -o "${out}" && "${out}"`;
    },
  },

  // ── C++ ─────────────────────────────────────────────────────────────────
  cpp: {
    name: 'C++',
    extension: 'cpp',
    configKey: 'cpp',
    buildCommand: (_fp, fileName, baseName) => {
      const out = `./${baseName}.out`;
      return `g++ "${fileName}" -o "${out}" && "${out}"`;
    },
  },

  // ── Java ─────────────────────────────────────────────────────────────────
  java: {
    name: 'Java',
    extension: 'java',
    configKey: 'java',
    buildCommand: (_fp, fileName, baseName) =>
      // Compile then run; -cp . keeps the classpath relative to cwd
      `javac "${fileName}" && java -cp . "${baseName}"`,
  },

  // ── Go ───────────────────────────────────────────────────────────────────
  go: {
    name: 'Go',
    extension: 'go',
    configKey: 'go',
    buildCommand: (_fp, fileName) =>
      `go run "${fileName}"`,
  },

  // ── Rust ─────────────────────────────────────────────────────────────────
  rs: {
    name: 'Rust',
    extension: 'rs',
    configKey: 'rust',
    buildCommand: (filePath, _fileName, _baseName, workspaceRoot) => {
      // If the file lives inside a Cargo project, prefer `cargo run`.
      // Otherwise fall back to rustc + direct execution.
      const fileDir = path.dirname(filePath);
      const inCargoProject = workspaceRoot &&
        (filePath.startsWith(workspaceRoot) ||
         fileDir.includes('src'));

      if (inCargoProject) {
        return `cargo run`;
      }

      const out = `./${_baseName}`;
      return `rustc "${_fileName}" -o "${out}" && "${out}"`;
    },
  },
};

/**
 * Look up a runner by file extension.
 * @param ext  File extension WITHOUT the leading dot, e.g. "py", "js".
 * @returns    The matching LanguageRunner, or undefined if unsupported.
 */
export function getRunnerForExtension(ext: string): LanguageRunner | undefined {
  return RUNNERS[ext.toLowerCase()];
}
