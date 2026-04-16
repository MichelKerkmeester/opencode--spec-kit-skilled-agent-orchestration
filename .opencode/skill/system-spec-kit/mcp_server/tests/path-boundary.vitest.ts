import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { deriveGraphMetadata, graphMetadataToIndexableText } from '../api';
import { __testables as graphMetadataParserTestables } from '../lib/graph/graph-metadata-parser.js';
import { buildResumeLadder } from '../lib/resume/resume-ladder.js';

const createdRoots = new Set<string>();

function createTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  createdRoots.add(root);
  return root;
}

function ensureParentDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath: string, content: string): void {
  ensureParentDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildHandover(): string {
  return [
    '---',
    'title: "Path Boundary Handover"',
    'last_updated: "2026-04-16T10:00:00Z"',
    '---',
    '# Handover',
    '',
    '**Recent action**: Confirmed path-boundary fixture',
    '**Next safe action**: Run the boundary regression slice',
    '',
  ].join('\n');
}

function buildImplementationSummary(packetPointer: string): string {
  return [
    '---',
    'title: "Path Boundary Implementation Summary"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${packetPointer}"`,
    '    last_updated_at: "2026-04-16T09:00:00Z"',
    '    last_updated_by: "path-boundary-test"',
    '    recent_action: "Captured path-boundary continuity"',
    '    next_safe_action: "Inspect the guarded packet path"',
    '    blockers: []',
    '    key_files:',
    '      - "mcp_server/lib/resume/resume-ladder.ts"',
    '    completion_pct: 60',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '# Implementation Summary',
    '',
    'Boundary fixture for resume ladder coverage.',
    '',
  ].join('\n');
}

function createResumePacket(workspacePath: string, specFolder: string): string {
  const folderPath = path.join(workspacePath, '.opencode', 'specs', specFolder);
  fs.mkdirSync(folderPath, { recursive: true });
  writeFile(path.join(folderPath, 'handover.md'), buildHandover());
  writeFile(path.join(folderPath, 'implementation-summary.md'), buildImplementationSummary(specFolder));
  return folderPath;
}

function createGraphPacket(): {
  root: string;
  specFolder: string;
  specFolderPath: string;
  allowedReference: string;
  absoluteReference: string;
} {
  const root = createTempRoot('path-boundary-graph-');
  const specFolder = 'system-spec-kit/900-path-boundary';
  const specFolderPath = path.join(root, '.opencode', 'specs', specFolder);
  const allowedReference = 'scripts/core/workflow.ts';
  const absoluteReference = path.join(root, 'scripts', 'private-host-path.ts');

  writeFile(path.join(root, allowedReference), 'export const allowedFixture = true;\n');
  writeFile(absoluteReference, 'export const absoluteFixture = true;\n');
  writeFile(path.join(specFolderPath, 'spec.md'), [
    '---',
    'title: "Path Boundary Graph Packet"',
    'description: "Graph metadata path fixture."',
    'trigger_phrases: ["path boundary"]',
    'importance_tier: "critical"',
    '---',
    '# Path Boundary Graph Packet',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    `| \`${allowedReference}\` | Modify | Allowed relative reference |`,
    '',
  ].join('\n'));
  writeFile(path.join(specFolderPath, 'plan.md'), [
    '---',
    'title: "Plan"',
    '---',
    '# Plan',
    '',
  ].join('\n'));
  writeFile(path.join(specFolderPath, 'tasks.md'), '# Tasks\n');
  writeFile(path.join(specFolderPath, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    '---',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    `| \`${absoluteReference.replace(/\\/g, '/')}\` | Modify | Host-local absolute path |`,
    `| \`${allowedReference}\` | Modify | Allowed relative reference |`,
    '',
  ].join('\n'));

  return {
    root,
    specFolder,
    specFolderPath,
    allowedReference,
    absoluteReference: absoluteReference.replace(/\\/g, '/'),
  };
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('path-boundary hardening', () => {
  it('rejects absolute specFolder values outside packet roots', () => {
    const workspacePath = createTempRoot('path-boundary-workspace-');
    const outsideFolder = createTempRoot('path-boundary-outside-');

    writeFile(path.join(outsideFolder, 'handover.md'), buildHandover());
    writeFile(path.join(outsideFolder, 'implementation-summary.md'), buildImplementationSummary('system-spec-kit/999-outside'));

    const result = buildResumeLadder({
      specFolder: outsideFolder,
      workspacePath,
    });

    expect(result.source).toBe('none');
    expect(result.resolution.kind).toBe('unresolved');
    expect(result.resolution.folderPath).toBeNull();
    expect(result.documents).toHaveLength(0);
  });

  it('rejects absolute fallbackSpecFolder values outside packet roots', () => {
    const workspacePath = createTempRoot('path-boundary-workspace-');
    const outsideFolder = createTempRoot('path-boundary-outside-');

    writeFile(path.join(outsideFolder, 'handover.md'), buildHandover());
    writeFile(path.join(outsideFolder, 'implementation-summary.md'), buildImplementationSummary('system-spec-kit/999-outside'));

    const result = buildResumeLadder({
      fallbackSpecFolder: outsideFolder,
      workspacePath,
    });

    expect(result.source).toBe('none');
    expect(result.resolution.kind).toBe('unresolved');
    expect(result.resolution.folderPath).toBeNull();
  });

  it('maps in-root absolute specFolder values back to packet-relative folders', () => {
    const workspacePath = createTempRoot('path-boundary-workspace-');
    const specFolder = 'system-spec-kit/026-root/004-gate-d';
    const folderPath = createResumePacket(workspacePath, specFolder);

    const result = buildResumeLadder({
      specFolder: folderPath,
      workspacePath,
    });

    expect(result.source).toBe('handover');
    expect(result.specFolder).toBe(specFolder);
    expect(result.resolution.kind).toBe('explicit');
  });

  it('rejects POSIX absolute key-file candidates', () => {
    expect(graphMetadataParserTestables.keepKeyFile('/tmp/malicious/spec.md')).toBe(false);
  });

  it('rejects Windows-style absolute key-file candidates', () => {
    expect(graphMetadataParserTestables.keepKeyFile('C:\\Users\\attacker\\spec.md')).toBe(false);
  });

  it('refuses to resolve absolute key-file candidates even when the file exists', () => {
    const fixture = createGraphPacket();

    expect(
      graphMetadataParserTestables.resolveKeyFileCandidate(
        fixture.specFolderPath,
        fixture.specFolder,
        fixture.absoluteReference,
      ),
    ).toBeNull();
  });

  it('drops absolute key-file references from derived metadata and indexable text', () => {
    const fixture = createGraphPacket();

    const metadata = deriveGraphMetadata(fixture.specFolderPath, null, {
      now: '2026-04-16T12:00:00.000Z',
    });
    const indexableText = graphMetadataToIndexableText(metadata);

    expect(metadata.derived.key_files).toContain(fixture.allowedReference);
    expect(metadata.derived.key_files).not.toContain(fixture.absoluteReference);
    expect(indexableText).toContain(fixture.allowedReference);
    expect(indexableText).not.toContain(fixture.absoluteReference);
  });
});
