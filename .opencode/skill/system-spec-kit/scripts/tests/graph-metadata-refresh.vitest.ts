import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { loadGraphMetadata, refreshGraphMetadataForSpecFolder } from '../../mcp_server/lib/graph/graph-metadata-parser.js';

const createdRoots = new Set<string>();

function createSpecFolder(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-refresh-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '902-refresh-packet');
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Refresh Packet"',
    'description: "Refresh graph metadata from canonical docs."',
    'trigger_phrases: ["refresh packet", "graph refresh"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    '# Refresh Packet',
    '',
    '### Overview',
    '',
    'Refreshes packet graph metadata after canonical save.',
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
    '| `scripts/core/workflow.ts` | Modify | Trigger graph refresh |',
  ].join('\n'), 'utf-8');
  return specFolder;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata refresh path', () => {
  it('refreshes a graph-metadata.json file from canonical docs and preserves manual fields', () => {
    const specFolder = createSpecFolder();
    const source = fs.readFileSync(
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'core', 'workflow.ts'),
      'utf-8',
    );

    expect(source).toContain('refreshGraphMetadataForSpecFolder');

    const first = refreshGraphMetadataForSpecFolder(specFolder, {
      now: '2026-04-12T12:00:00.000Z',
    });
    expect(fs.existsSync(first.filePath)).toBe(true);
    expect(first.created).toBe(true);

    const manualPreserved = {
      ...first.metadata,
      manual: {
        depends_on: [{ packet_id: 'system-spec-kit/001-base', reason: 'Required', source: 'manual' }],
        supersedes: [],
        related_to: [],
      },
    };
    fs.writeFileSync(first.filePath, `${JSON.stringify(manualPreserved, null, 2)}\n`, 'utf-8');

    const second = refreshGraphMetadataForSpecFolder(specFolder, {
      now: '2026-04-12T13:00:00.000Z',
    });
    const saved = loadGraphMetadata(second.filePath);

    expect(second.created).toBe(false);
    expect(saved?.manual.depends_on).toEqual(manualPreserved.manual.depends_on);
    expect(saved?.derived.status).toBe('complete');
    expect(saved?.derived.key_files).toContain('scripts/core/workflow.ts');
    expect(saved?.derived.last_save_at).toBe('2026-04-12T13:00:00.000Z');
  });
});
