import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { refreshGraphMetadataForSpecFolder } from '../../mcp_server/api';
import { validateContinuityFreshness } from '../validation/continuity-freshness.js';

const createdRoots = new Set<string>();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const VALIDATE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'validate.sh');

function makeWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'continuity-freshness-'));
  createdRoots.add(root);
  return root;
}

function createSpecFolder(workspaceRoot: string, name: string): string {
  const specFolder = path.join(workspaceRoot, '.opencode', 'specs', 'system-spec-kit', name);
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Continuity Freshness Fixture"',
    'description: "Fixture for continuity freshness validation."',
    'trigger_phrases: ["continuity freshness"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    '# Fixture',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  return specFolder;
}

function writeImplementationSummary(specFolder: string, continuityTimestamp?: string): void {
  const frontmatterLines = [
    '---',
    'title: "Implementation Summary"',
    'status: "planned"',
  ];
  if (continuityTimestamp) {
    frontmatterLines.push('_memory:');
    frontmatterLines.push('  continuity:');
    frontmatterLines.push('    packet_pointer: "system-spec-kit/test-packet"');
    frontmatterLines.push(`    last_updated_at: "${continuityTimestamp}"`);
    frontmatterLines.push('    last_updated_by: "tester"');
    frontmatterLines.push('    recent_action: "Validated freshness"');
    frontmatterLines.push('    next_safe_action: "Keep timestamps aligned"');
    frontmatterLines.push('    blockers: []');
    frontmatterLines.push('    key_files: []');
    frontmatterLines.push('    completion_pct: 0');
    frontmatterLines.push('    open_questions: []');
    frontmatterLines.push('    answered_questions: []');
  }
  frontmatterLines.push('---', '', '| File Path | Change Type | Description |', '|-----------|-------------|-------------|', '| `implementation-summary.md` | Modify | Freshness fixture |');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), frontmatterLines.join('\n'), 'utf-8');
}

function runValidateStrict(specFolder: string): { exitCode: number; stdout: string; stderr: string } {
  const result = spawnSync('bash', [VALIDATE_SCRIPT, specFolder, '--strict'], {
    cwd: path.resolve(specFolder, '..', '..', '..', '..'),
    encoding: 'utf-8',
    env: {
      ...process.env,
      SPECKIT_RULES: 'GRAPH_METADATA_PRESENT,CONTINUITY_FRESHNESS',
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

describe('continuity-freshness', () => {
  it('passes when continuity is within the 10-minute freshness budget', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '920-continuity-fresh');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:09:59Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('fresh');
  });

  it('warns when graph metadata is more than 10 minutes newer than continuity', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '921-continuity-stale');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('warn');
    expect(result.code).toBe('stale');
    expect(result.deltaMs).toBe(601000);
  });

  it('skips cleanly when continuity frontmatter is missing', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '922-continuity-missing-frontmatter');
    writeImplementationSummary(specFolder);
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('missing_frontmatter');
  });

  it('skips cleanly when graph metadata is missing', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '923-continuity-missing-graph');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('missing_graph_metadata');
  });

  it('fails with a distinct code when graph metadata is unreadable JSON', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '923a-continuity-invalid-graph');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    fs.writeFileSync(path.join(specFolder, 'graph-metadata.json'), '{invalid json', 'utf-8');

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('fail');
    expect(result.code).toBe('invalid_graph_metadata');
  });

  it('treats continuity newer than graph metadata as benign clock drift', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '924-continuity-clock-drift');
    writeImplementationSummary(specFolder, '2026-04-17T12:11:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:00:00Z' });

    const result = validateContinuityFreshness(specFolder);

    expect(result.status).toBe('pass');
    expect(result.code).toBe('clock_drift');
    expect(result.deltaMs).toBeLessThan(0);
  });

  it('wires stale continuity into validate.sh strict mode as a warning failure', () => {
    const root = makeWorkspace();
    const specFolder = createSpecFolder(root, '925-continuity-validate-sh');
    writeImplementationSummary(specFolder, '2026-04-17T12:00:00Z');
    refreshGraphMetadataForSpecFolder(specFolder, { now: '2026-04-17T12:10:01Z' });

    const result = runValidateStrict(specFolder);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toContain('CONTINUITY_FRESHNESS');
    expect(result.stdout).toContain('lags graph-metadata');
  });
});
