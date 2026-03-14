// TEST: save handler index explicit exports
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as saveIndex from '../handlers/save';

describe('handlers/save index export surface', () => {
  it('uses explicit exports (no wildcard export syntax)', () => {
    const indexPath = path.join(__dirname, '..', 'handlers', 'save', 'index.ts');
    const source = fs.readFileSync(indexPath, 'utf8');

    expect(source).not.toMatch(/export\s+\*\s+from\s+['"][^'"]+['"]/);
    expect(source).not.toMatch(/export\s+type\s+\*\s+from\s+['"][^'"]+['"]/);
  });

  it('re-exports required runtime helpers from save modules', () => {
    const runtimeExports = saveIndex as Record<string, unknown>;
    const expectedRuntimeExports = [
      'ALLOWED_POST_INSERT_COLUMNS',
      'applyPostInsertMetadata',
      'hasReconsolidationCheckpoint',
      'checkExistingRow',
      'checkContentHashDedup',
      'generateOrCacheEmbedding',
      'persistPendingEmbeddingCacheWrite',
      'evaluateAndApplyPeDecision',
      'runReconsolidationIfEnabled',
      'createMemoryRecord',
      'runPostInsertEnrichment',
      'buildIndexResult',
      'buildSaveResponse',
    ] as const;

    for (const exportName of expectedRuntimeExports) {
      expect(exportName in runtimeExports).toBe(true);
      expect(typeof runtimeExports[exportName]).not.toBe('undefined');
    }
  });
});
