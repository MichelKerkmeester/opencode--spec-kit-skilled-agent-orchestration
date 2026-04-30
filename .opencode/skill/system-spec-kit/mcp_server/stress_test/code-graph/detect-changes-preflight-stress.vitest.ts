import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, mkdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { closeDb, initDb, replaceNodes, upsertFile } from '../../code_graph/lib/code-graph-db.js';
import { generateContentHash, type CodeNode } from '../../code_graph/lib/indexer-types.js';
import { handleDetectChanges } from '../../code_graph/handlers/detect-changes.js';

type HandlerResponse = Awaited<ReturnType<typeof handleDetectChanges>>;

interface DetectChangesPayload {
  readonly status: string;
  readonly affectedSymbols: Array<{ readonly symbolId: string; readonly name: string; readonly startLine: number }>;
  readonly affectedFiles: string[];
  readonly blockedReason?: string;
  readonly readiness: Record<string, unknown>;
}

const tempDirs: string[] = [];
let originalCwd: string;
let tempRoot: string;

function parseResponse(response: HandlerResponse): DetectChangesPayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as DetectChangesPayload;
}

function makeNode(filePath: string, index: number): CodeNode {
  const name = `symbol${String(index).padStart(3, '0')}`;
  const startLine = index * 5 + 1;
  return {
    symbolId: createHash('sha256').update(`${filePath}:${name}`).digest('hex').slice(0, 16),
    filePath,
    fqName: `stress.${name}`,
    kind: 'function',
    name,
    startLine,
    endLine: startLine + 2,
    startColumn: 0,
    endColumn: 24,
    language: 'typescript',
    signature: `export function ${name}()`,
    contentHash: `node-${name}`,
  };
}

function seedIndexedFile(relativePath: string, nodeCount: number): { filePath: string; nodes: CodeNode[] } {
  const filePath = join(tempRoot, relativePath);
  mkdirSync(join(tempRoot, 'src'), { recursive: true });
  const content = Array.from({ length: nodeCount * 5 + 5 }, (_, index) => `export const line${index} = ${index};`).join('\n') + '\n';
  writeFileSync(filePath, content, 'utf-8');

  const nodes = Array.from({ length: nodeCount }, (_, index) => makeNode(filePath, index));
  const fileId = upsertFile(filePath, 'typescript', generateContentHash(content), nodes.length, 0, 'clean', 1);
  replaceNodes(fileId, nodes);
  return { filePath, nodes };
}

function makeDiff(relativePath: string, lineNumbers: number[]): string {
  return [
    `diff --git a/${relativePath} b/${relativePath}`,
    `--- a/${relativePath}`,
    `+++ b/${relativePath}`,
    ...lineNumbers.flatMap((line) => [
      `@@ -${line},1 +${line},1 @@`,
      '-old',
      '+new',
    ]),
    '',
  ].join('\n');
}

beforeEach(() => {
  originalCwd = process.cwd();
  tempRoot = realpathSync(mkdtempSync(join(tmpdir(), 'cg-detect-changes-')));
  tempDirs.push(tempRoot);
  process.chdir(tempRoot);
  initDb(tempRoot);
});

afterEach(() => {
  closeDb();
  process.chdir(originalCwd);
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('cg-006 — detect_changes preflight', () => {
  it('cg-006 attributes a large fresh diff to overlapping non-module symbols only', async () => {
    const { filePath, nodes } = seedIndexedFile('src/stress.ts', 60);
    const diff = makeDiff('src/stress.ts', nodes.filter((_, index) => index % 6 === 0).map((node) => node.startLine));

    const parsed = parseResponse(await handleDetectChanges({ diff, rootDir: tempRoot }));

    expect(parsed.status).toBe('ok');
    expect(parsed.affectedFiles).toEqual([filePath]);
    expect(parsed.affectedSymbols).toHaveLength(10);
    expect(parsed.affectedSymbols.map((symbol) => symbol.name)).toEqual([
      'symbol000',
      'symbol006',
      'symbol012',
      'symbol018',
      'symbol024',
      'symbol030',
      'symbol036',
      'symbol042',
      'symbol048',
      'symbol054',
    ]);
    expect(parsed.readiness).toMatchObject({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
    });
  });

  it('cg-006 blocks stale graphs before parsing or attribution can report false-safe empties', async () => {
    const { filePath } = seedIndexedFile('src/stale.ts', 4);
    writeFileSync(filePath, 'export const changed = true;\n', 'utf-8');

    const parsed = parseResponse(await handleDetectChanges({
      diff: makeDiff('src/stale.ts', [1]),
      rootDir: tempRoot,
    }));

    expect(parsed.status).toBe('blocked');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(parsed.affectedFiles).toEqual([]);
    expect(parsed.blockedReason).toMatch(/run code_graph_scan before detect_changes/i);
    expect(parsed.readiness).toMatchObject({
      freshness: 'stale',
      action: 'selective_reindex',
      inlineIndexPerformed: false,
    });
  });
});
