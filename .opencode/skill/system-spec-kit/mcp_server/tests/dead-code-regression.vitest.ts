// ---------------------------------------------------------------
// TEST: Dead Code Regression Canary
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as searchFlags from '../lib/search/search-flags';
import * as shadowScoring from '../lib/eval/shadow-scoring';
import * as rsfFusion from '../lib/search/rsf-fusion';
import * as graphSignals from '../lib/graph/graph-signals';
import * as graphSearchFn from '../lib/search/graph-search-fn';

const REMOVED_SYMBOLS = [
  'isShadowScoringEnabled',
  'isRsfEnabled',
  'computeCausalDepth',
  'getSubgraphWeights',
] as const;

const MODULE_EXPORTS: ReadonlyArray<[string, Record<string, unknown>]> = [
  ['../lib/search/search-flags', searchFlags as Record<string, unknown>],
  ['../lib/eval/shadow-scoring', shadowScoring as Record<string, unknown>],
  ['../lib/search/rsf-fusion', rsfFusion as Record<string, unknown>],
  ['../lib/graph/graph-signals', graphSignals as Record<string, unknown>],
  ['../lib/search/graph-search-fn', graphSearchFn as Record<string, unknown>],
];

async function collectTypeScriptFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTypeScriptFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('dead-code regression - removed symbols must stay removed', () => {
  for (const symbol of REMOVED_SYMBOLS) {
    it(`does not export ${symbol} from runtime modules`, () => {
      for (const [modulePath, mod] of MODULE_EXPORTS) {
        expect(
          mod,
          `${symbol} was unexpectedly exported from ${modulePath}`,
        ).not.toHaveProperty(symbol);
      }
    });
  }

  it('does not declare removed symbols in export statements under lib/', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const libDir = path.resolve(testDir, '../lib');
    const libFiles = await collectTypeScriptFiles(libDir);

    const offenders: string[] = [];
    for (const filePath of libFiles) {
      const source = await readFile(filePath, 'utf8');
      const relative = path.relative(libDir, filePath);

      for (const symbol of REMOVED_SYMBOLS) {
        const exportDeclaration = new RegExp(
          `\\bexport\\s+(?:async\\s+)?(?:function|const|let|var|class|type|interface)\\s+${symbol}\\b`
        );
        const exportList = new RegExp(`\\bexport\\s*\\{[^}]*\\b${symbol}\\b[^}]*\\}`, 's');

        if (exportDeclaration.test(source) || exportList.test(source)) {
          offenders.push(`${relative}:${symbol}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
