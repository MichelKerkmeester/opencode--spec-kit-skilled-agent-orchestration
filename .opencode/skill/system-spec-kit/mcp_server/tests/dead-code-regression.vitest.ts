// TEST: Dead Code Regression Canary
import { describe, it, expect } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import * as searchFlags from '../lib/search/search-flags';
import * as shadowScoring from '../lib/eval/shadow-scoring';
import * as graphSignals from '../lib/graph/graph-signals';
import * as graphSearchFn from '../lib/search/graph-search-fn';

const REMOVED_SYMBOLS = [
  'isShadowScoringEnabled',
  'isRsfEnabled',
  'computeCausalDepth',
  'getSubgraphWeights',
  'activeProvider',
  'stmtCache',
  'lastComputedAt',
  'flushCount',
  'RECOVERY_HALF_LIFE_DAYS',
  'logCoActivationEvent',
] as const;

const MODULE_EXPORTS: ReadonlyArray<[string, Record<string, unknown>]> = [
  ['../lib/search/search-flags', searchFlags as Record<string, unknown>],
  ['../lib/eval/shadow-scoring', shadowScoring as Record<string, unknown>],
  ['../lib/graph/graph-signals', graphSignals as Record<string, unknown>],
  ['../lib/search/graph-search-fn', graphSearchFn as Record<string, unknown>],
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function declarationPatternFor(symbol: string): RegExp {
  const identifier = escapeRegex(symbol);
  return new RegExp(
    `\\b(?:export\\s+)?(?:default\\s+)?(?:async\\s+)?(?:function|const|let|var|class|type|interface|enum)\\s+${identifier}\\b`,
    'u',
  );
}

function exportListPatternFor(symbol: string): RegExp {
  const identifier = escapeRegex(symbol);
  return new RegExp(`\\bexport\\s*\\{[^}]*\\b${identifier}\\b[^}]*\\}`, 'su');
}

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
  it('uses exact symbol matching (no substring matches)', () => {
    const computeDepthPattern = declarationPatternFor('computeCausalDepth');
    expect(computeDepthPattern.test('export function computeCausalDepthScores() {}')).toBe(false);
  });

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

  it('does not declare removed symbols under lib/ with exact identifier matching', async () => {
    const testDir = __dirname;
    const libDir = path.resolve(testDir, '../lib');
    const libFiles = await collectTypeScriptFiles(libDir);

    const offenders: string[] = [];
    for (const filePath of libFiles) {
      const source = await readFile(filePath, 'utf8');
      const relative = path.relative(libDir, filePath);

      for (const symbol of REMOVED_SYMBOLS) {
        const declarationPattern = declarationPatternFor(symbol);
        const exportListPattern = exportListPatternFor(symbol);

        if (declarationPattern.test(source) || exportListPattern.test(source)) {
          offenders.push(`${relative}:${symbol}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
