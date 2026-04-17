import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  deriveGraphMetadata,
  refreshGraphMetadataForSpecFolder,
  validateGraphMetadataContent,
} from '../api';
import { GRAPH_METADATA_MIGRATED_QUALITY_FLAG } from '../lib/graph/graph-metadata-schema.js';
import { parseMemoryContent } from '../lib/parsing/memory-parser.js';
import { __testables as stage1Testables } from '../lib/search/pipeline/stage1-candidate-gen.js';

const createdRoots = new Set<string>();

function createPacketRoot(packetId: string): { root: string; specFolder: string; graphPath: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'p0-c-graph-metadata-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', packetId);
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), '# Spec\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), '# Implementation Summary\n', 'utf-8');
  return {
    root,
    specFolder,
    graphPath: path.join(specFolder, 'graph-metadata.json'),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('P0-C graph-metadata laundering regression', () => {
  it('preserves migration evidence across validate, refresh, parse, rank, and status derivation', () => {
    const launderingFixture = createPacketRoot('903-p0-c-laundered');
    const malformedModernContent = [
      '{',
      '  "schema_version": 1,',
      '  "packet_id": "system-spec-kit/903-p0-c-laundered",',
      '  "spec_folder": "system-spec-kit/903-p0-c-laundered",',
      '  "status": "planned",',
      '  "importance_tier": "important",',
      '  "summary": "Malformed modern graph metadata payload.",',
      '  "created_at": "2025-01-01T00:00:00.000Z",',
      '  "last_save_at": "2025-01-02T00:00:00.000Z",',
      '  "source_docs": "spec.md, plan.md"',
    ].join('\n');
    fs.writeFileSync(launderingFixture.graphPath, malformedModernContent, 'utf-8');

    const validation = validateGraphMetadataContent(malformedModernContent);
    expect(validation.ok).toBe(true);
    if (!validation.ok) {
      throw new Error('Expected validation success through legacy migration');
    }

    expect(validation.migrated).toBe(true);
    expect(validation.migrationSource).toBe('legacy');
    expect(validation.preservedErrors.length).toBeGreaterThan(0);
    expect(validation.metadata.derived.created_at).toBe('2025-01-01T00:00:00.000Z');
    expect(validation.metadata.derived.last_save_at).toBe('2025-01-02T00:00:00.000Z');

    const refreshed = refreshGraphMetadataForSpecFolder(launderingFixture.specFolder, {
      now: '2026-04-17T03:26:04.604Z',
    });
    const rewritten = JSON.parse(fs.readFileSync(refreshed.filePath, 'utf-8')) as Record<string, unknown>;

    expect(rewritten.migrated).toBe(true);
    expect(rewritten.migration_source).toBe('legacy');
    expect((rewritten.derived as { created_at: string }).created_at).toBe('2025-01-01T00:00:00.000Z');

    const parsedMigrated = parseMemoryContent(
      refreshed.filePath,
      fs.readFileSync(refreshed.filePath, 'utf-8'),
    );
    expect(parsedMigrated.qualityFlags).toContain(GRAPH_METADATA_MIGRATED_QUALITY_FLAG);

    const ranked = stage1Testables.boostGraphMetadataCandidates(
      [
        {
          id: 1,
          score: 0.4,
          document_type: parsedMigrated.documentType,
          quality_flags: JSON.stringify(parsedMigrated.qualityFlags),
        },
        { id: 2, score: 0.4, document_type: 'graph_metadata' },
        { id: 3, score: 0.4, document_type: 'spec' },
      ] as any,
      'resume packet dependencies and key files',
    );

    expect(ranked[0]?.score).toBeLessThan(0.4);
    expect(ranked[1]?.score).toBeGreaterThan(0.4);
    expect(ranked[0]?.score).toBeLessThan(ranked[1]?.score ?? 0);
    expect(ranked[2]?.score).toBe(0.4);

    const ioFailureFixture = createPacketRoot('904-p0-c-io-failure');
    fs.writeFileSync(path.join(ioFailureFixture.specFolder, 'checklist.md'), '- [x] gated item\n', 'utf-8');
    const originalReadFileSync = fs.readFileSync.bind(fs);

    vi.spyOn(fs, 'readFileSync').mockImplementation((...args: Parameters<typeof fs.readFileSync>) => {
      const [filePath] = args;
      if (typeof filePath === 'string' && filePath.endsWith(`${path.sep}checklist.md`)) {
        const error = new Error('permission denied') as NodeJS.ErrnoException;
        error.code = 'EACCES';
        throw error;
      }
      return originalReadFileSync(...args);
    });

    const metadataWithUnknownStatus = deriveGraphMetadata(ioFailureFixture.specFolder, null, {
      now: '2026-04-17T03:26:04.604Z',
    });

    expect(metadataWithUnknownStatus.derived.status).toBe('unknown');
  });
});
