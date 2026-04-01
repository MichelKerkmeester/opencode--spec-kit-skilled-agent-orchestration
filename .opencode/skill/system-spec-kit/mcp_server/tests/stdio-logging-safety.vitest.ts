import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const SERVER_ROOT = path.resolve(__dirname, '..');
const SHARED_ROOT = path.resolve(SERVER_ROOT, '..', 'shared');

const SOURCE_ROOTS = [SERVER_ROOT, SHARED_ROOT];
const EXCLUDED_SEGMENTS = new Set(['dist', 'node_modules', 'tests']);
const EXCLUDED_BASENAMES = new Set(['README.md', 'INSTALL_GUIDE.md', 'cli.ts']);
const EXCLUDED_PATH_SNIPPETS = [
  `${path.sep}scripts${path.sep}migrations${path.sep}`,
  `${path.sep}hooks${path.sep}claude${path.sep}`,
  `${path.sep}hooks${path.sep}gemini${path.sep}`,
];
const STDOUT_LOG_PATTERN = /\bconsole\.(log|info|debug)\s*\(|process\.stdout\.write\s*\(/;

function collectRuntimeSources(root: string): string[] {
  const results: string[] = [];

  function walk(currentPath: string): void {
    let stat: fs.Stats;
    try {
      stat = fs.statSync(currentPath);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';
      if (code === 'ENOENT') {
        return;
      }
      throw error;
    }
    if (stat.isDirectory()) {
      const basename = path.basename(currentPath);
      if (EXCLUDED_SEGMENTS.has(basename)) {
        return;
      }

      for (const entry of fs.readdirSync(currentPath)) {
        walk(path.join(currentPath, entry));
      }
      return;
    }

    if (!currentPath.endsWith('.ts')) {
      return;
    }

    const basename = path.basename(currentPath);
    if (EXCLUDED_BASENAMES.has(basename)) {
      return;
    }

    if (EXCLUDED_PATH_SNIPPETS.some((snippet) => currentPath.includes(snippet))) {
      return;
    }

    if (basename.endsWith('.test.ts') || basename.endsWith('.vitest.ts')) {
      return;
    }

    results.push(currentPath);
  }

  walk(root);
  return results.sort();
}

describe('MCP stdio logging safety', () => {
  it('uses stderr-safe logging in runtime sources', () => {
    const offenders = SOURCE_ROOTS
      .flatMap(collectRuntimeSources)
      .filter((filePath) => STDOUT_LOG_PATTERN.test(fs.readFileSync(filePath, 'utf8')));

    expect(offenders).toEqual([]);
  });
});
