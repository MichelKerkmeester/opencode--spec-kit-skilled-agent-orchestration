import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { loadGraphMetadata } from '../../mcp_server/lib/graph/graph-metadata-parser.js';
import { collectSpecFolders, runBackfill } from '../graph/backfill-graph-metadata.js';

const createdRoots = new Set<string>();

function writePacket(specFolder: string, title: string, summary: string, implementationFile: string): void {
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    `title: "${title}"`,
    `description: "${summary}"`,
    'trigger_phrases: ["graph metadata", "backfill coverage"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    `# ${title}`,
    '',
    '### Overview',
    '',
    summary,
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
    `| \`${implementationFile}\` | Modify | Backfill coverage target |`,
  ].join('\n'), 'utf-8');
}

function createSpecTree(): string {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-backfill-'));
  createdRoots.add(repoRoot);

  const specsRoot = path.join(repoRoot, '.opencode', 'specs');
  writePacket(
    path.join(specsRoot, 'system-spec-kit', '910-backfill-root'),
    'Backfill Root',
    'Create repo-wide graph metadata for existing packets.',
    'scripts/graph/backfill-graph-metadata.ts',
  );
  writePacket(
    path.join(specsRoot, 'system-spec-kit', '911-parent', '001-child-phase'),
    'Child Phase',
    'Populate phased packet graph metadata from canonical docs.',
    'scripts/spec/create.sh',
  );
  writePacket(
    path.join(specsRoot, 'system-spec-kit', 'z_archive', '001-archived-packet'),
    'Archived Packet',
    'Backfill archived packet graph metadata without skipping z_archive coverage.',
    'scripts/spec/validate.sh',
  );

  return specsRoot;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata backfill', () => {
  it('includes archived and future folders by default during dry-run traversal', () => {
    const specsRoot = createSpecTree();

    const folders = collectSpecFolders(specsRoot);
    expect(folders).toHaveLength(3);

    const summary = runBackfill({ dryRun: true, root: specsRoot });
    expect(summary.totalSpecFolders).toBe(3);
    expect(summary.created).toBe(3);
    expect(summary.refreshed).toBe(0);
    expect(summary.reviewFlags).toEqual(expect.any(Array));

    for (const specFolder of folders) {
      expect(fs.existsSync(path.join(specFolder, 'graph-metadata.json'))).toBe(false);
    }
  });

  it('writes graph-metadata.json for every packet with empty manual arrays', () => {
    const specsRoot = createSpecTree();
    const summary = runBackfill({ dryRun: false, root: specsRoot });

    expect(summary.totalSpecFolders).toBe(3);
    expect(summary.created).toBe(3);

    for (const specFolder of collectSpecFolders(specsRoot)) {
      const graphPath = path.join(specFolder, 'graph-metadata.json');
      const metadata = loadGraphMetadata(graphPath);

      expect(fs.existsSync(graphPath)).toBe(true);
      expect(metadata?.manual).toEqual({
        depends_on: [],
        supersedes: [],
        related_to: [],
      });
      expect(metadata?.derived.source_docs).toContain('spec.md');
      expect(metadata?.derived.key_files.length).toBeGreaterThan(0);
    }
  });

  it('skips archived packets only when active-only behavior is requested explicitly', () => {
    const specsRoot = createSpecTree();

    const folders = collectSpecFolders(specsRoot, { activeOnly: true });
    expect(folders).toHaveLength(2);

    const summary = runBackfill({ dryRun: true, root: specsRoot, activeOnly: true });
    expect(summary.totalSpecFolders).toBe(2);
    expect(summary.created).toBe(2);
  });
});
