import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  canClassifyAsSpecDocument,
  isGraphMetadataPath,
} from '../lib/config/spec-doc-paths.js';
import {
  EXCLUDED_FOR_MEMORY,
  shouldIndexForMemory,
} from '../lib/utils/index-scope.js';
import {
  findGraphMetadataFiles,
  findSpecDocuments,
} from '../handlers/memory-index-discovery.js';

const tempDirs: string[] = [];

function createTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'exclusion-ssot-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

function writeFixture(root: string, relativePath: string, content = '# fixture\n'): string {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('index-scope SSOT unification', () => {
  it('propagates EXCLUDED_FOR_MEMORY changes through spec-doc classification and discovery', () => {
    const mutableExcluded = EXCLUDED_FOR_MEMORY as unknown as RegExp[];
    const originalLength = mutableExcluded.length;
    mutableExcluded.push(/(^|\/)hotfix-block(\/|$)/i);

    try {
      const tempRoot = createTempRoot();
      const specPath = writeFixture(
        tempRoot,
        '.opencode/specs/system-spec-kit/hotfix-block/001-target/spec.md',
      );
      const graphPath = writeFixture(
        tempRoot,
        '.opencode/specs/system-spec-kit/hotfix-block/001-target/graph-metadata.json',
        '{"packet_id":"001-target"}\n',
      );

      expect(shouldIndexForMemory(specPath)).toBe(false);
      expect(canClassifyAsSpecDocument(specPath)).toBe(false);
      expect(isGraphMetadataPath(graphPath)).toBe(false);

      const specDocs = findSpecDocuments(tempRoot)
        .map((filePath) => relative(tempRoot, filePath).replace(/\\/g, '/'));
      const graphFiles = findGraphMetadataFiles(tempRoot)
        .map((filePath) => relative(tempRoot, filePath).replace(/\\/g, '/'));

      expect(specDocs).toEqual([]);
      expect(graphFiles).toEqual([]);
    } finally {
      mutableExcluded.splice(originalLength);
    }
  });
});
