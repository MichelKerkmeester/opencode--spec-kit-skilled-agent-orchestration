import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const VALIDATE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'validate.sh');
const ROOT_026 = path.join(
  SKILL_ROOT,
  '..',
  '..',
  'specs',
  'system-spec-kit',
  '026-graph-and-context-optimization',
);
const createdRoots = new Set<string>();

function makeWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-save-validator-'));
  createdRoots.add(root);
  return root;
}

function createPacketRoot(
  workspaceRoot: string,
  packetName: string,
  options: {
    includeSpec?: boolean;
    sourceDocs?: string[];
    saveLineage?: 'description_only' | 'graph_only' | 'same_pass';
    graphLastSaveAt?: string;
    descriptionLastUpdated?: string;
    continuityPacketPointer?: string;
  } = {},
): string {
  const packetRoot = path.join(workspaceRoot, '.opencode', 'specs', 'system-spec-kit', packetName);
  fs.mkdirSync(packetRoot, { recursive: true });
  fs.mkdirSync(path.join(packetRoot, '001-child-packet'), { recursive: true });

  if (options.includeSpec !== false) {
    fs.writeFileSync(path.join(packetRoot, 'spec.md'), '# Root Packet\n', 'utf-8');
  }

  fs.writeFileSync(path.join(packetRoot, 'description.json'), JSON.stringify({
    specFolder: `system-spec-kit/${packetName}`,
    description: 'Canonical save validator fixture',
    keywords: ['canonical save validator'],
    lastUpdated: options.descriptionLastUpdated ?? '2026-04-18T12:00:00.000Z',
  }, null, 2), 'utf-8');

  fs.writeFileSync(path.join(packetRoot, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    packet_id: `system-spec-kit/${packetName}`,
    spec_folder: `system-spec-kit/${packetName}`,
    parent_id: null,
    children_ids: [`system-spec-kit/${packetName}/001-child-packet`],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: ['canonical save validator'],
      key_topics: ['canonical save validator'],
      importance_tier: 'important',
      status: 'complete',
      key_files: ['spec.md'],
      entities: [],
      causal_summary: 'Canonical save validator fixture',
      created_at: '2026-04-18T11:00:00.000Z',
      last_save_at: options.graphLastSaveAt ?? '2026-04-18T12:00:00.000Z',
      ...(options.saveLineage ? { save_lineage: options.saveLineage } : {}),
      last_accessed_at: null,
      source_docs: options.sourceDocs ?? ['spec.md'],
    },
  }, null, 2), 'utf-8');

  if (options.continuityPacketPointer) {
    fs.writeFileSync(path.join(packetRoot, 'implementation-summary.md'), [
      '---',
      'title: "Implementation Summary"',
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${options.continuityPacketPointer}"`,
      '---',
      '',
      '# Implementation Summary',
    ].join('\n'), 'utf-8');
  }

  return packetRoot;
}

function runValidate(
  folder: string,
  rules: string,
  env: Record<string, string> = {},
  flags: string[] = ['--no-recursive', '--strict', '--verbose'],
): { exitCode: number; stdout: string; stderr: string } {
  const workspaceRoot = path.resolve(folder, '..', '..', '..', '..');
  const result = spawnSync('bash', [VALIDATE_SCRIPT, folder, ...flags], {
    cwd: workspaceRoot,
    encoding: 'utf-8',
    env: {
      ...process.env,
      SPECKIT_RULES: rules,
      ...env,
    },
  });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('canonical-save validator rollout', () => {
  it('fails when a live packet root has metadata but no root spec', () => {
    const workspace = makeWorkspace();
    const packetRoot = createPacketRoot(workspace, '950-missing-root-spec', {
      includeSpec: false,
    });

    const result = runValidate(packetRoot, 'CANONICAL_SAVE_ROOT_SPEC_REQUIRED');

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toContain('CANONICAL_SAVE_ROOT_SPEC_REQUIRED');
    expect(result.stdout).toContain('no canonical root spec.md');
  });

  it('fails when a live packet root graph metadata has empty source_docs', () => {
    const workspace = makeWorkspace();
    const packetRoot = createPacketRoot(workspace, '951-empty-source-docs', {
      sourceDocs: [],
    });

    const result = runValidate(packetRoot, 'CANONICAL_SAVE_SOURCE_DOCS_REQUIRED');

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toContain('CANONICAL_SAVE_SOURCE_DOCS_REQUIRED');
    expect(result.stdout).toContain('empty derived.source_docs');
  });

  it('grandfathers missing save_lineage before the cutoff and fails after it', () => {
    const workspace = makeWorkspace();
    const packetRoot = createPacketRoot(workspace, '952-lineage-window', {
      graphLastSaveAt: '2026-04-18T12:00:00.000Z',
    });

    const grandfathered = runValidate(packetRoot, 'CANONICAL_SAVE_LINEAGE_REQUIRED', {
      SPECKIT_CANONICAL_SAVE_CUTOFF: '2026-04-19T00:00:00Z',
    });
    expect(grandfathered.exitCode).toBe(0);
    expect(grandfathered.stdout).toContain('grandfathered');

    const enforced = runValidate(packetRoot, 'CANONICAL_SAVE_LINEAGE_REQUIRED', {
      SPECKIT_CANONICAL_SAVE_CUTOFF: '2026-04-18T00:00:00Z',
    });
    expect(enforced.exitCode).toBe(2);
    expect(enforced.stdout).toContain('save_lineage is required');
  });

  it('reports packet identity drift as a soft detector', () => {
    const workspace = makeWorkspace();
    const packetRoot = createPacketRoot(workspace, '953-identity-drift', {
      continuityPacketPointer: 'system-spec-kit/other-packet',
    });

    const result = runValidate(packetRoot, 'CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED');

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Packet identity normalization drift detected');
  });

  it('reports description/graph freshness skew as a soft detector', () => {
    const workspace = makeWorkspace();
    const packetRoot = createPacketRoot(workspace, '954-freshness-skew', {
      descriptionLastUpdated: '2026-04-18T12:20:00.000Z',
      graphLastSaveAt: '2026-04-18T12:00:00.000Z',
      saveLineage: 'same_pass',
    });

    const result = runValidate(packetRoot, 'CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS');

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('freshness skew detected');
  });

  it('passes the canonical-save rule pack on the full 026 tree with the grandfathering window', () => {
    const result = runValidate(
      ROOT_026,
      [
        'CANONICAL_SAVE_ROOT_SPEC_REQUIRED',
        'CANONICAL_SAVE_SOURCE_DOCS_REQUIRED',
        'CANONICAL_SAVE_LINEAGE_REQUIRED',
        'CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED',
        'CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS',
      ].join(','),
      {},
      ['--recursive', '--strict', '--verbose'],
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('CANONICAL_SAVE_ROOT_SPEC_REQUIRED');
    expect(result.stdout).toContain('CANONICAL_SAVE_LINEAGE_REQUIRED');
  });
});
