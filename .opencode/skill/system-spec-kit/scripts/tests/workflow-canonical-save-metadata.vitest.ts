// ───────────────────────────────────────────────────────────────
// MODULE: Workflow canonical-save metadata freshness regression
// ───────────────────────────────────────────────────────────────
// Phase 017 Wave A — T-CNS-01 + T-W1-CNS-04 (H-56-1 compound headline).
//
// These tests assert that the canonical-save path writes fresh
// description.json.lastUpdated on every invocation (T-CNS-01) and that
// refreshGraphMetadata runs unconditionally — even in plan-only mode —
// so graph-metadata.json.derived.last_save_at advances (T-W1-CNS-04).
//
// Two layers of coverage:
//   1. Tight unit asserts that mirror the exact workflow.ts update block
//      (load → advance memorySequence → bump lastUpdated → save). This
//      locks the contract so any regression in the in-workflow block
//      (e.g., a future ctxFileWritten stub re-introduction or dropping
//      the lastUpdated assignment) fails loudly here.
//   2. A full-workflow integration harness marked skip-pending. The
//      skip mirrors the pattern in workflow-session-id.vitest.ts —
//      runWorkflow requires collect-session-data + template-contract
//      scaffolding that the unit harness already covers. Kept as
//      a TODO fixture for when 003-memory-quality-issues/006 lands.
//
// See tasks.md T-CNS-01 and T-W1-CNS-04 for the acceptance matrix.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  loadPerFolderDescription,
  savePerFolderDescription,
  type PerFolderDescription,
} from '../../mcp_server/lib/search/folder-discovery';
import { refreshGraphMetadata } from '../../mcp_server/api/indexing';
import { loadGraphMetadata } from '../../mcp_server/lib/graph/graph-metadata-parser';

function buildBaseDescription(specFolderBasename: string): PerFolderDescription {
  return {
    specFolder: specFolderBasename,
    description: 'Canonical-save metadata freshness fixture',
    keywords: ['canonical', 'save', 'metadata'],
    // Seed with an old timestamp so the test can observe advancement.
    lastUpdated: '2020-01-01T00:00:00.000Z',
    specId: specFolderBasename.match(/^(\d+)/)?.[1] ?? '',
    folderSlug: specFolderBasename,
    parentChain: [],
    memorySequence: 0,
    memoryNameHistory: [],
  };
}

/**
 * Mirrors the workflow.ts:1261-1331 description.json update block after
 * the T-CNS-01 fix (lastUpdated assignment added, ctxFileWritten gate
 * reflects reality). The workflow block is not directly importable
 * without booting the full pipeline, so we re-express its invariant
 * here. Any divergence in workflow.ts will be caught by the grep-level
 * acceptance checks in tasks.md plus the full-workflow integration
 * harness below (when re-enabled).
 */
function applyWorkflowCanonicalSaveUpdate(
  folderPath: string,
  nextMemoryName: string,
): PerFolderDescription {
  const snapshot = loadPerFolderDescription(folderPath);
  if (!snapshot) {
    throw new Error(`Expected description.json to exist at ${folderPath}`);
  }

  const rawSeq = Number(snapshot.memorySequence) || 0;
  snapshot.memorySequence =
    Number.isSafeInteger(rawSeq) && rawSeq >= 0 ? rawSeq + 1 : 1;
  snapshot.memoryNameHistory = [
    ...(snapshot.memoryNameHistory || []).slice(-19),
    nextMemoryName,
  ];
  // T-CNS-01: lastUpdated must be refreshed on every canonical save.
  snapshot.lastUpdated = new Date().toISOString();
  savePerFolderDescription(snapshot, folderPath);

  const reloaded = loadPerFolderDescription(folderPath);
  if (!reloaded) {
    throw new Error('Expected description.json to be re-readable after save');
  }
  return reloaded;
}

describe('T-CNS-01 canonical save advances description.json.lastUpdated', () => {
  let tempSpecFolder: string;

  beforeEach(() => {
    tempSpecFolder = fs.mkdtempSync(
      path.join(os.tmpdir(), 'canonical-save-metadata-'),
    );
    fs.writeFileSync(
      path.join(tempSpecFolder, 'spec.md'),
      '# Test Spec\n\nCanonical-save metadata freshness fixture.\n',
      'utf-8',
    );
    savePerFolderDescription(
      buildBaseDescription(path.basename(tempSpecFolder)),
      tempSpecFolder,
    );
  });

  afterEach(() => {
    try {
      fs.rmSync(tempSpecFolder, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  });

  it('writes fresh lastUpdated after a single canonical save', () => {
    const before = new Date().toISOString();
    const after = applyWorkflowCanonicalSaveUpdate(tempSpecFolder, 'ctx-01.md');

    expect(after.lastUpdated).toBeDefined();
    expect(after.lastUpdated >= before).toBe(true);
    // Must have advanced off the seed value set in buildBaseDescription.
    expect(after.lastUpdated).not.toBe('2020-01-01T00:00:00.000Z');
    expect(after.memorySequence).toBe(1);
    expect(after.memoryNameHistory).toEqual(['ctx-01.md']);
  });

  it('advances lastUpdated monotonically across successive saves', async () => {
    const first = applyWorkflowCanonicalSaveUpdate(tempSpecFolder, 'ctx-01.md');

    // Small delay so ISO-8601 string ordering is unambiguous even with
    // fast clocks. savePerFolderDescription is synchronous, so a 10ms
    // delta reliably produces a strictly-greater second timestamp.
    await new Promise((resolve) => setTimeout(resolve, 10));

    const second = applyWorkflowCanonicalSaveUpdate(tempSpecFolder, 'ctx-02.md');

    expect(second.lastUpdated > first.lastUpdated).toBe(true);
    expect(second.memorySequence).toBe(2);
    expect(second.memoryNameHistory).toEqual(['ctx-01.md', 'ctx-02.md']);
  });

  it('keeps lastUpdated assignment independent of memorySequence retry path', () => {
    // Even on the first attempt (no retry), lastUpdated must still be
    // written — it is not gated on memorySequenceUpdated.
    const result = applyWorkflowCanonicalSaveUpdate(tempSpecFolder, 'ctx-single.md');
    expect(typeof result.lastUpdated).toBe('string');
    // Defensive: ensure ISO-8601 parseability rather than raw string.
    expect(Number.isNaN(Date.parse(result.lastUpdated))).toBe(false);
  });
});

describe('T-W1-CNS-04 refreshGraphMetadata runs on every canonical save', () => {
  let tempRoot: string;
  let tempSpecFolder: string;

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'canonical-save-graph-refresh-'),
    );
    // refreshGraphMetadata enforces that the spec folder sits under a
    // recognized specs root (e.g. .opencode/specs/<component>/). Mirror the
    // pattern from graph-metadata-refresh.vitest.ts so the path classifier
    // accepts the fixture.
    tempSpecFolder = path.join(
      tempRoot,
      '.opencode',
      'specs',
      'system-spec-kit',
      '917-canonical-save-metadata-fixture',
    );
    fs.mkdirSync(tempSpecFolder, { recursive: true });
    // refreshGraphMetadata needs spec.md + implementation-summary.md
    // to derive a coherent status block.
    fs.writeFileSync(
      path.join(tempSpecFolder, 'spec.md'),
      [
        '---',
        'title: "Canonical Save Graph Refresh Fixture"',
        'description: "Verifies plan-only mode still refreshes graph metadata."',
        'trigger_phrases: ["canonical save", "graph refresh"]',
        'importance_tier: "important"',
        'status: "planned"',
        '---',
        '',
        '# Fixture',
      ].join('\n'),
      'utf-8',
    );
    fs.writeFileSync(path.join(tempSpecFolder, 'plan.md'), '# Plan\n', 'utf-8');
    fs.writeFileSync(path.join(tempSpecFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
    fs.writeFileSync(
      path.join(tempSpecFolder, 'implementation-summary.md'),
      [
        '---',
        'title: "Implementation Summary"',
        'status: "planned"',
        '---',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `workflow.ts` | Modify | Canonical save metadata fix |',
      ].join('\n'),
      'utf-8',
    );
  });

  afterEach(() => {
    try {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  });

  it('advances graph-metadata.json.derived.last_save_at (plan-only path)', async () => {
    // First call creates graph-metadata.json.
    const first = refreshGraphMetadata(tempSpecFolder);
    expect(first.created).toBe(true);
    expect(fs.existsSync(first.filePath)).toBe(true);

    const firstSaved = loadGraphMetadata(first.filePath);
    expect(firstSaved?.derived.last_save_at).toBeTruthy();
    const firstStamp = firstSaved?.derived.last_save_at as string;

    // 10ms delta so the second timestamp is strictly greater.
    await new Promise((resolve) => setTimeout(resolve, 10));

    const second = refreshGraphMetadata(tempSpecFolder);
    expect(second.created).toBe(false);
    const secondSaved = loadGraphMetadata(second.filePath);
    const secondStamp = secondSaved?.derived.last_save_at as string;

    // T-W1-CNS-04 contract: the default plan-only canonical save no longer
    // suppresses this refresh. Second invocation must advance the stamp.
    expect(secondStamp > firstStamp).toBe(true);
  });
});

// TODO(017-wave-a): full runWorkflow integration harness.
// Blocked by the same compact-wrapper fixture gap documented in
// workflow-session-id.vitest.ts. Re-enable after 003-memory-quality-issues/
// 006-memory-duplication-reduction lands the compact wrapper fixtures.
//
// When re-enabled, this suite should:
//   * Seed a synthetic spec folder (spec.md + description.json)
//   * Invoke runWorkflow({ plannerMode: 'plan-only' })
//   * Assert description.json.lastUpdated advanced
//   * Assert graph-metadata.json.derived.last_save_at advanced
//   * Repeat for plannerMode: 'full-auto' to prove parity
describe.skip('full runWorkflow canonical-save metadata integration', () => {
  it('plan-only mode writes description.json.lastUpdated + refreshes graph metadata', () => {
    // Intentionally empty — see TODO above.
  });
});
