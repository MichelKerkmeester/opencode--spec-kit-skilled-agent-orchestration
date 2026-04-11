// TEST: Architecture Boundary Enforcement
import { afterEach, describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { checkSharedNeutrality, checkWrapperOnly } from '../evals/check-architecture-boundaries';

// Resolve relative to the test file so the path is stable regardless of which
// workspace (mcp_server vs scripts) vitest treats as process.cwd().
const ARCHITECTURE_CHECK_SCRIPT = path.resolve(__dirname, '..', 'evals', 'check-architecture-boundaries.ts');

describe('Architecture Boundary Enforcement', () => {
  const fixtureRoots: string[] = [];

  function createFixtureRoot(): string {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-boundary-fixture-'));
    fixtureRoots.push(root);
    fs.mkdirSync(path.join(root, 'shared'), { recursive: true });
    fs.mkdirSync(path.join(root, 'mcp_server', 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
    return root;
  }

  function writeFixtureFile(root: string, relativePath: string, content: string): void {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  afterEach(() => {
    while (fixtureRoots.length > 0) {
      const root = fixtureRoots.pop();
      if (root) {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }
  });

  it('T39: GAP A detects shared -> mcp_server/scripts imports across syntax variants', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'shared/named-multiline.ts', [
      'import {',
      '  runtimeA,',
      '  runtimeB,',
      "} from '../mcp_server/runtime';",
      'export { runtimeA, runtimeB };',
    ].join('\n'));

    writeFixtureFile(root, 'shared/default-import.ts', [
      "import tool from '../scripts/tool-default';",
      'export default tool;',
    ].join('\n'));

    writeFixtureFile(root, 'shared/namespace-import.ts', [
      "import * as tooling from '../scripts/tool-namespace';",
      'export { tooling };',
    ].join('\n'));

    writeFixtureFile(root, 'shared/dynamic-import.ts', [
      'export async function loadRuntime() {',
      "  return import('../mcp_server/dynamic-runtime');",
      '}',
    ].join('\n'));

    const violations = checkSharedNeutrality(root);
    const importPaths = violations.map((v) => v.importPath);

    expect(importPaths).toEqual(expect.arrayContaining([
      '../mcp_server/runtime',
      '../scripts/tool-default',
      '../scripts/tool-namespace',
      '../mcp_server/dynamic-runtime',
    ]));
    expect(violations.length).toBe(4);
  });

  it('parses export-from, import type, and require() forms when checking shared neutrality', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'shared/export-from.ts', [
      "export { runtimeA } from '../mcp_server/runtime';",
    ].join('\n'));

    writeFixtureFile(root, 'shared/import-type.ts', [
      "import type { RuntimeConfig } from '../scripts/types';",
      'export type { RuntimeConfig };',
    ].join('\n'));

    writeFixtureFile(root, 'shared/require-call.ts', [
      "const runtime = require('../scripts/legacy-loader');",
      'export { runtime };',
    ].join('\n'));

    const violations = checkSharedNeutrality(root);
    const importPaths = violations.map((v) => v.importPath);

    expect(importPaths).toEqual(expect.arrayContaining([
      '../mcp_server/runtime',
      '../scripts/types',
      '../scripts/legacy-loader',
    ]));
    expect(violations.length).toBe(3);
  });

  it('T40: GAP B flags wrappers exceeding 50 substantive lines', () => {
    const root = createFixtureRoot();
    const body = Array.from({ length: 55 }, (_, idx) => `const value${idx} = ${idx};`).join('\n');

    writeFixtureFile(root, 'mcp_server/scripts/too-long.ts', [
      "import { spawnSync } from 'child_process';",
      "const targetScript = '../../scripts/dist/memory/cli.js';",
      body,
      "spawnSync(process.execPath, [targetScript], { stdio: 'inherit' });",
    ].join('\n'));

    const violations = checkWrapperOnly(root);
    const violation = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'too-long.ts')));

    expect(violation).toBeDefined();
    expect(violation?.reasons.join(' ')).toContain('substantive lines (max 50)');
  });

  it('T41: GAP B flags wrappers missing child_process import', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'mcp_server/scripts/no-child-process.ts', [
      "const targetScript = '../../scripts/dist/memory/cli.js';",
      'export function getTarget() {',
      '  return targetScript;',
      '}',
    ].join('\n'));

    const violations = checkWrapperOnly(root);
    const violation = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'no-child-process.ts')));

    expect(violation).toBeDefined();
    expect(violation?.reasons).toContain('missing child_process import');
  });

  it('T42: GAP B flags wrappers missing scripts/dist reference', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'mcp_server/scripts/no-dist-reference.ts', [
      "import { spawnSync } from 'child_process';",
      "const targetScript = '../memory/cli.js';",
      "spawnSync(process.execPath, [targetScript], { stdio: 'inherit' });",
    ].join('\n'));

    const violations = checkWrapperOnly(root);
    const violation = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'no-dist-reference.ts')));

    expect(violation).toBeDefined();
    expect(violation?.reasons).toContain('no reference to scripts/dist/');
  });

  it('T43: GAP B catches wrapper bypasses (barrel re-exports and scripts import without spawn/exec)', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'mcp_server/scripts/barrel-export.ts', [
      "export * from '../../scripts/dist/memory/reindex-embeddings.js';",
    ].join('\n'));

    writeFixtureFile(root, 'mcp_server/scripts/no-spawn-usage.ts', [
      "import { spawnSync } from 'child_process';",
      "import '../../scripts/dist/memory/reindex-embeddings.js';",
      'const forwarded = spawnSync;',
      'void forwarded;',
    ].join('\n'));

    const violations = checkWrapperOnly(root);
    const barrel = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'barrel-export.ts')));
    const noSpawn = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'no-spawn-usage.ts')));

    expect(barrel).toBeDefined();
    expect(barrel?.reasons).toContain('missing child_process import');
    expect(barrel?.reasons).toContain('no child_process spawn/exec usage');

    expect(noSpawn).toBeDefined();
    expect(noSpawn?.reasons).toContain('no child_process spawn/exec usage');
  });

  it('T44: legitimate thin wrappers pass GAP B checks', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'mcp_server/scripts/valid-wrapper.ts', [
      "import { spawnSync } from 'child_process';",
      "import path from 'path';",
      "const targetScript = path.resolve(__dirname, '../../scripts/dist/memory/reindex-embeddings.js');",
      "const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], { stdio: 'inherit' });",
      "if (typeof result.status === 'number') {",
      '  process.exit(result.status);',
      '}',
      'process.exit(1);',
    ].join('\n'));

    const violations = checkWrapperOnly(root);
    expect(violations).toEqual([]);
  });

  it('reports no violations when the fixture layout satisfies both architecture boundaries', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'package.json', JSON.stringify({ type: 'commonjs' }, null, 2));

    writeFixtureFile(root, 'shared/utils.ts', [
      'export const sharedValue = 42;',
    ].join('\n'));

    writeFixtureFile(root, 'mcp_server/scripts/valid-wrapper.ts', [
      "import { spawnSync } from 'child_process';",
      "import path from 'path';",
      "const targetScript = path.resolve(__dirname, '../../scripts/dist/memory/reindex-embeddings.js');",
      "const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], { stdio: 'inherit' });",
      "if (typeof result.status === 'number') {",
      '  process.exit(result.status);',
      '}',
      'process.exit(1);',
    ].join('\n'));

    expect(fs.readFileSync(ARCHITECTURE_CHECK_SCRIPT, 'utf-8')).toContain('Architecture boundary check passed');
    expect(checkSharedNeutrality(root)).toEqual([]);
    expect(checkWrapperOnly(root)).toEqual([]);
  });

  it('T45: valid mcp_server/scripts -> shared imports are not false positives', () => {
    const root = createFixtureRoot();

    writeFixtureFile(root, 'shared/utils.ts', [
      'export const sharedValue = 42;',
    ].join('\n'));

    writeFixtureFile(root, 'shared/consumer.ts', [
      "import { sharedValue } from './utils';",
      'export const value = sharedValue;',
    ].join('\n'));

    writeFixtureFile(root, 'mcp_server/lib/consumer.ts', [
      "import { sharedValue } from '../../shared/utils';",
      'export const fromMcp = sharedValue;',
    ].join('\n'));

    writeFixtureFile(root, 'scripts/use-shared.ts', [
      "import { sharedValue } from '../shared/utils';",
      'export const fromScripts = sharedValue;',
    ].join('\n'));

    const gapAViolations = checkSharedNeutrality(root);
    expect(gapAViolations).toEqual([]);
  });
});
