import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import { refreshGraphMetadata } from '../api/indexing.js';
import { processCausalLinks } from '../handlers/causal-links-processor.js';
import { findGraphMetadataFiles } from '../handlers/memory-index-discovery.js';
import { parseMemoryContent } from '../lib/parsing/memory-parser.js';
import { __testables as stage1Testables } from '../lib/search/pipeline/stage1-candidate-gen.js';
import { serializeGraphMetadata, type GraphMetadata } from '../api';

const createdRoots = new Set<string>();

function createGraphMetadataFixture(): { root: string; specFolder: string; graphPath: string; metadata: GraphMetadata } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-integration-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '901-graph-integration');
  fs.mkdirSync(specFolder, { recursive: true });
  const metadata: GraphMetadata = {
    schema_version: 1,
    packet_id: 'system-spec-kit/901-graph-integration',
    spec_folder: 'system-spec-kit/901-graph-integration',
    parent_id: null,
    children_ids: [],
    manual: {
      depends_on: [{ packet_id: 'system-spec-kit/100-dependency', reason: 'Required dependency', source: 'manual' }],
      supersedes: [{ packet_id: 'system-spec-kit/050-older', reason: 'Replaces older packet', source: 'manual' }],
      related_to: [{ packet_id: 'system-spec-kit/075-related', reason: 'Shared rollout', source: 'manual' }],
    },
    derived: {
      trigger_phrases: ['packet dependency graph', 'resume packet'],
      key_topics: ['graph metadata', 'dependencies'],
      importance_tier: 'important',
      status: 'complete',
      key_files: ['spec.md', 'plan.md'],
      entities: [{ name: 'workflow.ts', kind: 'script', path: 'scripts/core/workflow.ts', source: 'derived' }],
      causal_summary: 'Captures packet dependencies for resume and graph-aware retrieval.',
      created_at: '2026-04-12T12:00:00.000Z',
      last_save_at: '2026-04-12T12:00:00.000Z',
      last_accessed_at: null,
      source_docs: ['spec.md', 'plan.md'],
    },
  };
  const graphPath = path.join(specFolder, 'graph-metadata.json');
  fs.writeFileSync(graphPath, serializeGraphMetadata(metadata), 'utf-8');
  return { root, specFolder, graphPath, metadata };
}

function createCausalDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      canonical_file_path TEXT,
      file_path TEXT,
      title TEXT
    );
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      source_anchor TEXT,
      target_anchor TEXT,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    );
  `);
  return db;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata integration', () => {
  it('discovers root graph-metadata files under canonical specs', () => {
    const fixture = createGraphMetadataFixture();
    const discovered = findGraphMetadataFiles(fixture.root);

    expect(discovered).toEqual([fixture.graphPath]);
  });

  it('parses graph metadata into an indexable packet row with causal links', () => {
    const fixture = createGraphMetadataFixture();
    const parsed = parseMemoryContent(fixture.graphPath, fs.readFileSync(fixture.graphPath, 'utf-8'));

    expect(parsed.documentType).toBe('graph_metadata');
    expect(parsed.specFolder).toBe(fixture.metadata.spec_folder);
    expect(parsed.triggerPhrases).toEqual(fixture.metadata.derived.trigger_phrases);
    expect(parsed.causalLinks.blocks).toEqual(['system-spec-kit/100-dependency']);
    expect(parsed.causalLinks.supersedes).toEqual(['system-spec-kit/050-older']);
    expect(parsed.causalLinks.related_to).toEqual(['system-spec-kit/075-related']);
  });

  it('refreshes graph metadata through the explicit indexing follow-up API', () => {
    const fixture = createGraphMetadataFixture();
    const refreshed = refreshGraphMetadata(fixture.specFolder);

    expect(fs.realpathSync(refreshed.filePath)).toBe(fs.realpathSync(fixture.graphPath));
    expect(refreshed.metadata.spec_folder).toBe(fixture.metadata.spec_folder);
  });

  it('projects packet relationships into causal_edges using spec_folder resolution', () => {
    const fixture = createGraphMetadataFixture();
    const parsed = parseMemoryContent(fixture.graphPath, fs.readFileSync(fixture.graphPath, 'utf-8'));
    const db = createCausalDb();
    db.prepare('INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, title) VALUES (?, ?, ?, ?, ?)')
      .run(1, 'system-spec-kit/100-dependency', null, '/tmp/dependency', 'Dependency');
    db.prepare('INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, title) VALUES (?, ?, ?, ?, ?)')
      .run(2, 'system-spec-kit/901-graph-integration', null, fixture.graphPath, 'Packet');
    db.prepare('INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, title) VALUES (?, ?, ?, ?, ?)')
      .run(3, 'system-spec-kit/050-older', null, '/tmp/older', 'Older');
    db.prepare('INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, title) VALUES (?, ?, ?, ?, ?)')
      .run(4, 'system-spec-kit/075-related', null, '/tmp/related', 'Related');

    const result = processCausalLinks(db, 2, parsed.causalLinks);
    const edges = db.prepare('SELECT source_id, target_id, relation FROM causal_edges').all() as Array<Record<string, string>>;

    expect(result.inserted).toBe(3);
    expect(edges).toEqual(expect.arrayContaining([
      { source_id: '1', target_id: '2', relation: 'enabled' },
      { source_id: '2', target_id: '3', relation: 'supersedes' },
      { source_id: '2', target_id: '4', relation: 'supports' },
    ]));
  });

  it('boosts graph_metadata candidates for packet-oriented queries', () => {
    const boosted = stage1Testables.boostGraphMetadataCandidates(
      [
        { id: 1, score: 0.4, document_type: 'graph_metadata' },
        { id: 2, score: 0.4, document_type: 'spec' },
      ] as any,
      'resume packet dependencies and key files',
    );

    expect(boosted[0]?.score).toBeGreaterThan(0.4);
    expect(boosted[1]?.score).toBe(0.4);
  });

  it('parses description.json into an indexable packet row', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'description-metadata-integration-'));
    createdRoots.add(root);
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '902-description-integration');
    fs.mkdirSync(specFolder, { recursive: true });
    const descriptionPath = path.join(specFolder, 'description.json');
    fs.writeFileSync(descriptionPath, JSON.stringify({
      specFolder: 'system-spec-kit/902-description-integration',
      description: 'Feature Specification: Description metadata indexing',
      keywords: ['description metadata', 'indexing', 'spec folder'],
      lastUpdated: '2026-04-12T12:00:00.000Z',
      specId: '902',
      folderSlug: 'description-integration',
      parentChain: ['system-spec-kit'],
      memorySequence: 4,
      memoryNameHistory: ['description-indexing'],
    }, null, 2));

    const parsed = parseMemoryContent(descriptionPath, fs.readFileSync(descriptionPath, 'utf-8'));

    expect(parsed.documentType).toBe('description_metadata');
    expect(parsed.specFolder).toBe('system-spec-kit/902-description-integration');
    expect(parsed.contextType).toBe('planning');
    expect(parsed.triggerPhrases).toEqual(expect.arrayContaining([
      'system-spec-kit/902-description-integration',
      'description metadata',
      '902',
      'description-integration',
    ]));
  });
});
