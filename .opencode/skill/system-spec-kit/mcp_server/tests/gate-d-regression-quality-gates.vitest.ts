import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runSpecDocStructureRule, type MergePlan } from '../lib/validation/spec-doc-structure';

const SPEC_DOC_BASENAMES = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
] as const;

const TEMP_DIRS: string[] = [];

function makeTempDir(prefix: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  TEMP_DIRS.push(tempDir);
  return tempDir;
}

function buildReaderReadyDoc(title: string, body: string, packetPointer: string): string {
  return [
    '---',
    `title: "${title}"`,
    'description: "Gate D reader-ready canonical fixture"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${packetPointer}"`,
    '    last_updated_at: "2026-04-11T12:00:00Z"',
    '    last_updated_by: "gate-d-regression"',
    '    recent_action: "Prepared reader-ready canonical docs"',
    '    next_safe_action: "Run strict spec-doc validation"',
    '    blockers: []',
    '    key_files:',
    '      - "mcp_server/lib/validation/spec-doc-structure.ts"',
    '    completion_pct: 92',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    body,
    '',
  ].join('\n');
}

function buildDocBody(displayName: string): string {
  return [
    `# ${displayName}`,
    '',
    '<!-- ANCHOR:what-built -->',
    '## What Was Built',
    '',
    'This reader-ready canonical write stays prose-only and remains merge-safe.',
    '',
    '<!-- /ANCHOR:what-built -->',
    '',
  ].join('\n');
}

function seedCanonicalPacket(folder: string, invalidDoc: boolean): void {
  const packetPointer = 'system-spec-kit/025-graph-and-context-optimization/004-gate-d-reader-ready';

  for (const basename of SPEC_DOC_BASENAMES) {
    const displayName = basename.replace(/\.md$/, '').replace(/-/g, ' ');
    const body = buildDocBody(displayName);
    let content = buildReaderReadyDoc(displayName, body, packetPointer);

    if (invalidDoc && basename === 'implementation-summary.md') {
      content = content.replace('title: "', 'title "');
    }

    fs.writeFileSync(path.join(folder, basename), content, 'utf8');
  }
}

afterEach(() => {
  while (TEMP_DIRS.length > 0) {
    const tempDir = TEMP_DIRS.pop();
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('Gate D regression quality gates', () => {
  it('feature 4 rejects malformed canonical docs and accepts a reader-ready canonical write', () => {
    const folder = makeTempDir('gate-d-regression-quality-gates-');

    seedCanonicalPacket(folder, true);
    const rejected = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(rejected.status).toBe('fail');
    expect(rejected.details.some((detail) => detail.includes('SPECDOC_FRONTMATTER_001'))).toBe(true);

    seedCanonicalPacket(folder, false);
    const mergePlan: MergePlan = {
      targetFile: 'implementation-summary.md',
      targetAnchor: 'what-built',
      mergeMode: 'append-as-paragraph',
      chunkText: 'Added the reader-ready canonical write for Gate D.',
    };
    const accepted = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'MERGE_LEGALITY',
      mergePlan,
    });

    expect(accepted.status).toBe('pass');
    expect(accepted.message).toBe('Merge legality check passed');
  });
});
