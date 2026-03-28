import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Memory-save dedup ordering regressions', () => {
  it('T080-1 checks content-hash dedup before the chunking branch', () => {
    const sourcePath = path.resolve(__dirname, '..', 'handlers', 'memory-save.ts');
    const source = fs.readFileSync(sourcePath, 'utf8');

    const duplicatePrecheckIndex = source.indexOf('const duplicatePrecheck = checkContentHashDedup');
    const chunkBranchIndex = source.indexOf('if (shouldChunkContent)');
    const chunkedIndexerIndex = source.indexOf('indexChunkedMemoryFile(filePath, parsed');

    expect(duplicatePrecheckIndex).toBeGreaterThan(-1);
    expect(chunkBranchIndex).toBeGreaterThan(-1);
    expect(chunkedIndexerIndex).toBeGreaterThan(-1);
    expect(duplicatePrecheckIndex).toBeLessThan(chunkBranchIndex);
    expect(duplicatePrecheckIndex).toBeLessThan(chunkedIndexerIndex);
  });
});
