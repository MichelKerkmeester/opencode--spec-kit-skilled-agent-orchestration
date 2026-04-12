import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createEmptyGraphMetadataManual,
  deriveGraphMetadata,
  GRAPH_METADATA_SCHEMA_VERSION,
  mergeGraphMetadata,
  type GraphMetadata,
  validateGraphMetadataContent,
} from '../api';

const createdRoots = new Set<string>();

function createSpecFolder(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-schema-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '900-graph-metadata');
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Graph Metadata Packet"',
    'description: "Packet-level graph metadata coverage."',
    'trigger_phrases: ["graph metadata", "packet graph"]',
    'importance_tier: "critical"',
    'status: "planned"',
    '---',
    '',
    '# Graph Metadata Packet',
    '',
    '### Overview',
    '',
    'Defines the packet graph metadata contract for packet-aware save and retrieval flows.',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    '| `mcp_server/lib/graph/graph-metadata-parser.ts` | Add | Parser implementation |',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), [
    '---',
    'title: "Plan"',
    'trigger_phrases: ["graph metadata plan"]',
    'status: "in_progress"',
    '---',
    '',
    '# Plan',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    'status: "complete"',
    '---',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    '| `scripts/core/workflow.ts` | Modify | Refresh graph metadata after save |',
    '| `mcp_server/handlers/memory-index.ts` | Modify | Include graph metadata discovery |',
  ].join('\n'), 'utf-8');
  return specFolder;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata schema and parser', () => {
  it('accepts derived metadata created from canonical packet docs', () => {
    const specFolder = createSpecFolder();
    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.schema_version).toBe(GRAPH_METADATA_SCHEMA_VERSION);
    expect(metadata.spec_folder).toBe('system-spec-kit/900-graph-metadata');
    expect(metadata.derived.trigger_phrases).toEqual(
      expect.arrayContaining(['graph metadata', 'packet graph', 'graph metadata plan']),
    );
    expect(metadata.derived.status).toBe('complete');
    expect(metadata.derived.importance_tier).toBe('critical');
    expect(metadata.derived.key_files).toEqual(
      expect.arrayContaining([
        'scripts/core/workflow.ts',
        'mcp_server/handlers/memory-index.ts',
      ]),
    );
  });

  it('preserves manual relationships while regenerating derived fields', () => {
    const specFolder = createSpecFolder();
    const existing: GraphMetadata = {
      ...deriveGraphMetadata(specFolder, null, { now: '2026-04-11T12:00:00.000Z' }),
      manual: {
        depends_on: [{ packet_id: 'system-spec-kit/001-base', reason: 'Needs base behavior', source: 'manual' }],
        supersedes: [],
        related_to: [{ packet_id: 'system-spec-kit/002-peer', reason: 'Peer rollout', source: 'manual' }],
      },
      derived: {
        ...deriveGraphMetadata(specFolder, null, { now: '2026-04-11T12:00:00.000Z' }).derived,
        last_accessed_at: '2026-04-11T13:00:00.000Z',
      },
    };

    const merged = mergeGraphMetadata(existing, deriveGraphMetadata(specFolder, existing, { now: '2026-04-12T12:00:00.000Z' }));

    expect(merged.manual).toEqual(existing.manual);
    expect(merged.derived.created_at).toBe(existing.derived.created_at);
    expect(merged.derived.last_accessed_at).toBe('2026-04-11T13:00:00.000Z');
    expect(merged.derived.last_save_at).toBe('2026-04-12T12:00:00.000Z');
  });

  it('rejects malformed payloads and schema version drift', () => {
    const validation = validateGraphMetadataContent(JSON.stringify({
      schema_version: 2,
      packet_id: 'bad',
      spec_folder: 'bad',
      parent_id: null,
      children_ids: [],
      manual: createEmptyGraphMetadataManual(),
      derived: {},
    }));

    expect(validation.ok).toBe(false);
    expect(validation.errors.join(' ')).toContain('schema_version');
  });
});
