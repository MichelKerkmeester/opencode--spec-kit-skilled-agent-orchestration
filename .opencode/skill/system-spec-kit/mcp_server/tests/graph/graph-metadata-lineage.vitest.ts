import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  graphMetadataSchema,
  SAVE_LINEAGE_VALUES,
} from '../../lib/graph/graph-metadata-schema.js';
import {
  deriveGraphMetadata,
  refreshGraphMetadataForSpecFolder,
} from '../../lib/graph/graph-metadata-parser.js';

const createdRoots = new Set<string>();

function createSpecFolder(name: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-lineage-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', name);
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Graph Lineage Fixture"',
    'description: "Fixture for graph metadata lineage coverage."',
    'trigger_phrases: ["graph lineage"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    '# Graph Lineage Fixture',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    'status: "complete"',
    '---',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    '| `scripts/core/workflow.ts` | Modify | Lineage fixture |',
  ].join('\n'), 'utf-8');
  return specFolder;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata save lineage', () => {
  it('accepts save_lineage: description_only', () => {
    const specFolder = createSpecFolder('930-lineage-description-only');
    const metadata = deriveGraphMetadata(specFolder, null, {
      now: '2026-04-18T12:00:00Z',
      saveLineage: 'description_only',
    });

    expect(graphMetadataSchema.parse(metadata).derived.save_lineage).toBe('description_only');
  });

  it('accepts save_lineage: graph_only', () => {
    const specFolder = createSpecFolder('931-lineage-graph-only');
    const metadata = deriveGraphMetadata(specFolder, null, {
      now: '2026-04-18T12:00:00Z',
      saveLineage: 'graph_only',
    });

    expect(graphMetadataSchema.parse(metadata).derived.save_lineage).toBe('graph_only');
  });

  it('accepts save_lineage: same_pass', () => {
    const specFolder = createSpecFolder('932-lineage-same-pass');
    const metadata = deriveGraphMetadata(specFolder, null, {
      now: '2026-04-18T12:00:00Z',
      saveLineage: 'same_pass',
    });

    expect(graphMetadataSchema.parse(metadata).derived.save_lineage).toBe('same_pass');
  });

  it('accepts omitted save_lineage during the migration window', () => {
    const specFolder = createSpecFolder('933-lineage-omitted');
    const metadata = deriveGraphMetadata(specFolder, null, {
      now: '2026-04-18T12:00:00Z',
    });

    expect(graphMetadataSchema.parse(metadata).derived.save_lineage).toBeUndefined();
  });

  it('rejects save_lineage: invalid_value', () => {
    const specFolder = createSpecFolder('934-lineage-invalid');
    const metadata = deriveGraphMetadata(specFolder, null, {
      now: '2026-04-18T12:00:00Z',
      saveLineage: 'graph_only',
    });

    expect(() => graphMetadataSchema.parse({
      ...metadata,
      derived: {
        ...metadata.derived,
        save_lineage: 'invalid_value',
      },
    })).toThrow();
  });

  it('exports exactly three save lineage values', () => {
    expect([...SAVE_LINEAGE_VALUES]).toEqual(['description_only', 'graph_only', 'same_pass']);
  });

  it('defaults standalone graph refreshes to graph_only lineage', () => {
    const specFolder = createSpecFolder('935-lineage-refresh-default');
    const refreshed = refreshGraphMetadataForSpecFolder(specFolder, {
      now: '2026-04-18T12:00:00Z',
    });

    expect(refreshed.metadata.derived.save_lineage).toBe('graph_only');
  });
});
