// TEST: MEMORY SAVE INTEGRATION
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import * as memorySaveHandler from '../handlers/memory-save';
import * as peGating from '../handlers/pe-gating';
import * as predictionErrorGate from '../lib/cognitive/prediction-error-gate';
import * as vectorIndex from '../lib/search/vector-index';

const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-memory-save-integration-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(process.cwd(), 'tmp-test-fixtures', 'specs', '997-memory-save-integration');

function buildCanonicalDoc(
  filePath: string,
  {
    title,
    anchorId,
    heading,
    body,
    extraAnchors = [],
  }: {
    title: string;
    anchorId: string;
    heading: string;
    body: string;
    extraAnchors?: Array<{ id: string; heading: string; body: string }>;
  },
): void {
  const anchors = [
    { id: anchorId, heading, body },
    ...extraAnchors,
  ].map((anchor) => [
    `<!-- ANCHOR:${anchor.id} -->`,
    anchor.heading,
    '',
    anchor.body,
    '',
    `<!-- /ANCHOR:${anchor.id} -->`,
  ].join('\n'));

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [
    '---',
    `title: "${title}"`,
    `description: "${title} integration fixture."`,
    'trigger_phrases:',
    '  - "memory-save-integration"',
    'importance_tier: "important"',
    'contextType: "implementation"',
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/997-memory-save-integration"',
    '    last_updated_at: "2026-04-15T07:30:00Z"',
    '    last_updated_by: "vitest-fixture"',
    '    recent_action: "Prepared canonical save integration fixture"',
    '    next_safe_action: "Run planner and full-auto assertions"',
    '    blockers: []',
    '    key_files:',
    '      - "implementation-summary.md"',
    '      - "decision-record.md"',
    '    session_dedup:',
    `      fingerprint: "sha256:${'1'.repeat(64)}"`,
    '      session_id: "memory-save-integration-fixture"',
    '      parent_session_id: null',
    '    completion_pct: 10',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '',
    '<!-- SPECKIT_LEVEL: 3 -->',
    `# ${title}`,
    '',
    ...anchors,
    '',
  ].join('\n'), 'utf8');
}

function buildSourceMemory(title: string, overview: string, evidence: string[]): string {
  const trigger = title.toLowerCase()
    .replace(/[0-9]+/g, '')
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '') || 'planner-first-integration-fixture';
  return [
    '---',
    `title: "${title}"`,
    'description: "Transcript-derived integration fixture for planner-first save coverage."',
    'trigger_phrases:',
    `  - "${trigger}"`,
    '  - "planner-first-integration"',
    'importance_tier: "important"',
    'contextType: "implementation"',
    '---',
    '',
    `# ${title}`,
    '',
    '## SESSION SUMMARY',
    '',
    '| **Meta Data** | **Value** |',
    '|:--------------|:----------|',
    '| Total Messages | 7 |',
    '| Fixture Type | planner-first integration |',
    '',
    '<!-- ANCHOR:continue-session -->',
    '',
    '## CONTINUE SESSION',
    '',
    'Continue from the planner review after comparing the non-mutating plan with the explicit full-auto fallback result.',
    '',
    '<!-- /ANCHOR:continue-session -->',
    '',
    '<!-- ANCHOR:canonical-docs -->',
    '',
    '## CANONICAL SOURCES',
    '',
    '- `implementation-summary.md` - Primary delivery narrative target',
    '- `decision-record.md` - Decision log for planner/fallback tradeoffs',
    '- `tasks.md` - Verification closeout tracking',
    '',
    '<!-- /ANCHOR:canonical-docs -->',
    '',
    '## OVERVIEW',
    '',
    overview,
    '',
    '<!-- ANCHOR:evidence -->',
    '',
    '## DISTINGUISHING EVIDENCE',
    '',
    ...evidence.map((item) => `- ${item}`),
    '',
    '<!-- /ANCHOR:evidence -->',
    '',
    '## DECISIONS',
    '',
    '- Keep the planner result authoritative for target-doc selection before invoking full-auto fallback.',
    '',
    '## KEY OUTCOMES',
    '',
    '- Verified planner output can be compared directly against the canonical diff.',
    '',
    '<!-- ANCHOR:recovery-hints -->',
    '',
    '## RECOVERY HINTS',
    '',
    '- Re-run the integration fixture in `full-auto` only after confirming the planner route target.',
    '',
    '<!-- /ANCHOR:recovery-hints -->',
    '',
    '<!-- ANCHOR:metadata -->',
    '<!-- MEMORY METADATA -->',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    `session_id: "${trigger}"`,
    '```',
    '',
    '<!-- /ANCHOR:metadata -->',
    '',
  ].join('\n');
}

function buildContinuitySourceMemory(recentAction: string, nextSafeAction: string): string {
  return [
    '---',
    'title: "Transcript continuity fixture"',
    'description: "Metadata-only integration fixture."',
    'trigger_phrases:',
    '  - "metadata-only"',
    'importance_tier: "important"',
    'contextType: "implementation"',
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/014-save-flow-backend-relevance-review"',
    '    last_updated_at: "2026-04-15T07:45:00Z"',
    '    last_updated_by: "vitest-transcript-fixture"',
    `    recent_action: "${recentAction}"`,
    `    next_safe_action: "${nextSafeAction}"`,
    '    blockers: []',
    '    key_files:',
    '      - "implementation-summary.md"',
    '      - "research/research.md"',
    '    session_dedup:',
    `      fingerprint: "sha256:${'2'.repeat(64)}"`,
    '      session_id: "metadata-only-fixture"',
    '      parent_session_id: "metadata-only-parent"',
    '    completion_pct: 75',
    '    open_questions: []',
    '    answered_questions:',
    '      - "The packet already captured the trim-targeted verdict"',
    '---',
    '',
    '# Transcript continuity fixture',
    '',
    '## SESSION SUMMARY',
    '',
    '| **Meta Data** | **Value** |',
    '|:--------------|:----------|',
    '| Total Messages | 5 |',
    '| Fixture Type | planner-first metadata-only integration |',
    '',
    '<!-- ANCHOR:continue-session -->',
    '',
    '## CONTINUE SESSION',
    '',
    'Continue from the continuity-focused planner review and compare the non-mutating plan with the explicit full-auto fallback result.',
    '',
    '<!-- /ANCHOR:continue-session -->',
    '',
    '<!-- ANCHOR:canonical-docs -->',
    '',
    '## CANONICAL SOURCES',
    '',
    '- `implementation-summary.md` - Continuity target for metadata-only planner output',
    '- `tasks.md` - Verification tracking surface for follow-up review',
    '',
    '<!-- /ANCHOR:canonical-docs -->',
    '',
    '## OVERVIEW',
    '',
    'Metadata-only fixture used to prove planner-first and full-auto paths keep the same continuity target.',
    '',
    '<!-- ANCHOR:evidence -->',
    '',
    '## DISTINGUISHING EVIDENCE',
    '',
    '- Continuity frontmatter already contains packet pointer, actor, and next-safe-action fields',
    '- Metadata-only planner output should preserve the canonical continuity target across modes',
    '',
    '<!-- /ANCHOR:evidence -->',
    '',
    '<!-- ANCHOR:recovery-hints -->',
    '',
    '## RECOVERY HINTS',
    '',
    '- Re-run the metadata-only integration fixture in `full-auto` after confirming the continuity target is stable.',
    '',
    '<!-- /ANCHOR:recovery-hints -->',
    '',
    '<!-- ANCHOR:metadata -->',
    '<!-- MEMORY METADATA -->',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "metadata-only-fixture"',
    '```',
    '',
    '<!-- /ANCHOR:metadata -->',
    '',
  ].join('\n');
}

function createCanonicalRoutingFixture(specFolderName: string): {
  sourcePath: string;
  implementationSummaryPath: string;
  decisionRecordPath: string;
  tasksPath: string;
} {
  const specFolder = path.join(FIXTURE_ROOT, specFolderName);
  buildCanonicalDoc(path.join(specFolder, 'spec.md'), {
    title: 'Spec',
    anchorId: 'problem',
    heading: '## Problem',
    body: 'Planner-first integration fixture for canonical save routing.',
  });
  buildCanonicalDoc(path.join(specFolder, 'plan.md'), {
    title: 'Plan',
    anchorId: 'implementation-plan',
    heading: '## Implementation Plan',
    body: 'Exercise planner-first and full-auto behavior with transcript-derived fixtures.',
  });
  buildCanonicalDoc(path.join(specFolder, 'tasks.md'), {
    title: 'Tasks',
    anchorId: 'phase-3',
    heading: '## Phase 3',
    body: '- [ ] Compare planner targets with canonical diffs.',
  });
  buildCanonicalDoc(path.join(specFolder, 'checklist.md'), {
    title: 'Checklist',
    anchorId: 'verification',
    heading: '## Verification',
    body: '- [ ] Validate planner-default integration coverage.',
  });
  buildCanonicalDoc(path.join(specFolder, 'decision-record.md'), {
    title: 'Decision Record',
    anchorId: 'adr-001',
    heading: '## ADR-001',
    body: 'Keep planner-first output aligned with explicit full-auto fallback behavior.',
  });
  buildCanonicalDoc(path.join(specFolder, 'implementation-summary.md'), {
    title: 'Implementation Summary',
    anchorId: 'what-built',
    heading: '## What Was Built',
    body: 'Existing implementation summary content should change only in full-auto mode.',
    extraAnchors: [
      {
        id: 'verification',
        heading: '## Verification',
        body: 'Verification notes remain separate from the what-built narrative.',
      },
    ],
  });

  const sourcePath = path.join(specFolder, 'memory', 'session.md');
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  return {
    sourcePath,
    implementationSummaryPath: path.join(specFolder, 'implementation-summary.md'),
    decisionRecordPath: path.join(specFolder, 'decision-record.md'),
    tasksPath: path.join(specFolder, 'tasks.md'),
  };
}

function cleanupFixtureRows(): void {
  const db = vectorIndex.getDb();
  if (!db) {
    return;
  }
  const likePattern = '%997-memory-save-integration%';
  db.prepare(`DELETE FROM active_memory_projection WHERE active_memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare(`DELETE FROM memory_lineage WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_conflicts WHERE spec_folder LIKE ?').run(likePattern);
  db.prepare(`DELETE FROM memory_history WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?').run(likePattern, likePattern);
}

beforeAll(() => {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  process.env.MEMORY_DB_PATH = TEST_DB_PATH;
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors in tests
  }
  vectorIndex.initializeDb();
  if (previousMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
  else process.env.MEMORY_DB_PATH = previousMemoryDbPath;
});

afterEach(() => {
  cleanupFixtureRows();
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

afterAll(() => {
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors in tests
  }
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

function makeCandidate(
  overrides: Partial<{
    id: number;
    similarity: number;
    content: string;
    file_path: string;
  }> = {}
): {
  id: number;
  similarity: number;
  content: string;
  file_path: string;
} {
  return {
    id: 101,
    similarity: 0.9,
    content: 'Deploy feature flags gradually and verify behavior after each rollout step.',
    file_path: '/specs/101-memory.md',
    ...overrides,
  };
}

describe('Memory Save Integration (T501-T550)', () => {
  describe('PE arbitration outcomes', () => {
    it('T501: returns CREATE when no candidates exist', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-create',
        'Document the new rollout plan for this spec folder.',
        [],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.CREATE);
      expect(result.existingMemoryId).toBeNull();
      expect(result.similarity).toBe(0);
      expect(result.reason).toContain('No existing candidates');
    });

    it('T502: near-duplicate candidates route to REINFORCE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-reinforce',
        'Deploy feature flags gradually and verify behavior after each rollout step.',
        [makeCandidate({ similarity: 0.97 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.REINFORCE);
      expect(result.existingMemoryId).toBe(101);
      expect(result.similarity).toBe(0.97);
    });

    it('T503: compatible high-similarity candidates route to UPDATE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-update',
        'Deploy feature flags gradually and verify behavior after every rollout checkpoint.',
        [makeCandidate({ similarity: 0.9 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.UPDATE);
      expect(result.existingMemoryId).toBe(101);
      expect(result.contradiction?.detected ?? false).toBe(false);
    });

    it('T504: contradiction markers in new content route to SUPERSEDE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-supersede',
        'We no longer deploy feature flags gradually; use an immediate cutover instead.',
        [makeCandidate({ similarity: 0.9 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.SUPERSEDE);
      expect(result.existingMemoryId).toBe(101);
      expect(result.contradiction?.detected).toBe(true);
      expect(result.contradiction?.type).toBe('deprecation');
    });

    it('T505: medium-similarity matches route to CREATE_LINKED', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-linked',
        'Summarize rollout monitoring dashboards for post-deployment review.',
        [makeCandidate({ similarity: 0.8 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.CREATE_LINKED);
      expect(result.existingMemoryId).toBe(101);
      expect(result.similarity).toBe(0.8);
    });

    it('T506: candidates below LOW_MATCH are filtered out to CREATE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-filtered',
        'Write an unrelated architecture note about database vacuuming.',
        [makeCandidate({ similarity: 0.49 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.CREATE);
      expect(result.existingMemoryId).toBeNull();
      expect(result.reason).toContain('No relevant candidates');
    });

    it('T507: highest relevant candidate wins when multiple are present', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-best-match',
        'Deploy feature flags gradually and verify behavior after every rollout checkpoint.',
        [
          makeCandidate({ id: 11, similarity: 0.8 }),
          makeCandidate({ id: 22, similarity: 0.91 }),
          makeCandidate({ id: 33, similarity: 0.72 }),
        ],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.UPDATE);
      expect(result.existingMemoryId).toBe(22);
      expect(result.similarity).toBe(0.91);
    });
  });

  describe('Save-handler wiring', () => {
    it('T508: PE helpers exported from canonical pe-gating module', () => {
      expect(typeof peGating.findSimilarMemories).toBe('function');
      expect(typeof peGating.reinforceExistingMemory).toBe('function');
      expect(typeof peGating.markMemorySuperseded).toBe('function');
      expect(typeof peGating.updateExistingMemory).toBe('function');
      expect(typeof peGating.logPeDecision).toBe('function');
    });

    it('T509: exported thresholds remain ordered to preserve PE routing', () => {
      expect(predictionErrorGate.THRESHOLD.DUPLICATE).toBeGreaterThan(predictionErrorGate.THRESHOLD.HIGH_MATCH);
      expect(predictionErrorGate.THRESHOLD.HIGH_MATCH).toBeGreaterThan(predictionErrorGate.THRESHOLD.MEDIUM_MATCH);
      expect(predictionErrorGate.THRESHOLD.MEDIUM_MATCH).toBeGreaterThan(predictionErrorGate.THRESHOLD.LOW_MATCH);
    });

    it('T510: conflict records preserve metadata and previews', () => {
      const record = predictionErrorGate.formatConflictRecord(
        predictionErrorGate.ACTION.SUPERSEDE,
        'hash-record',
        88,
        0.91,
        'Contradiction detected',
        { detected: true, type: 'deprecation', description: 'Previous guidance replaced', confidence: 0.75 },
        predictionErrorGate.truncateContent('x'.repeat(250)),
        predictionErrorGate.truncateContent('y'.repeat(40)),
        'specs/001-example'
      );

      expect(record.action).toBe(predictionErrorGate.ACTION.SUPERSEDE);
      expect(record.existing_memory_id).toBe(88);
      expect(record.contradiction_detected).toBe(1);
      expect(record.contradiction_type).toBe('deprecation');
      expect(record.new_content_preview).toHaveLength(203);
      expect(record.spec_folder).toBe('specs/001-example');
    });
  });

  describe('planner-first and fallback parity', () => {
    it('T511: planner-default and explicit full-auto agree on the narrative-progress target end to end', async () => {
      const fixture = createCanonicalRoutingFixture('997-narrative-progress');
      const sourceContent = buildSourceMemory(
        'Transcript closeout fixture',
        'Finalized the planner-first save rollout, removed deprecated fallback ambiguity, and closed the strict validation tail for the save-flow packet.',
        [
          'Confirmed the command surface now centers planner-first save behavior',
          'Closed the remaining strict-validation blockers before packet closeout',
        ],
      );
      const originalTarget = fs.readFileSync(fixture.implementationSummaryPath, 'utf8');

      const plannerResult = await memorySaveHandler.atomicSaveMemory({
        file_path: fixture.sourcePath,
        content: sourceContent,
        routeAs: 'narrative_progress',
        mergeModeHint: 'append-as-paragraph',
        targetAnchorId: 'what-built',
      }, { force: true });

      expect(plannerResult.status).toBe('planned');
      expect(plannerResult.routeTarget).toMatchObject({
        routeCategory: 'narrative_progress',
        targetDocPath: fixture.implementationSummaryPath,
        targetAnchorId: 'what-built',
        mergeMode: 'append-as-paragraph',
      });
      expect(fs.readFileSync(fixture.implementationSummaryPath, 'utf8')).toBe(originalTarget);
      expect(plannerResult.followUpActions).toEqual(expect.arrayContaining([
        expect.objectContaining({
          action: 'apply',
          args: expect.objectContaining({
            plannerMode: 'full-auto',
            routeAs: 'narrative_progress',
            targetAnchorId: 'what-built',
          }),
        }),
      ]));

      const fullAutoResult = await memorySaveHandler.atomicSaveMemory({
        file_path: fixture.sourcePath,
        content: sourceContent,
        plannerMode: 'full-auto',
        routeAs: 'narrative_progress',
        mergeModeHint: 'append-as-paragraph',
        targetAnchorId: 'what-built',
      }, { force: true });

      expect(fullAutoResult.success).toBe(true);
      expect(['updated', 'indexed', 'deferred']).toContain(String(fullAutoResult.status));
      expect(fullAutoResult.targetDocPath).toBe(fixture.implementationSummaryPath);
      expect(fullAutoResult.targetAnchorId).toBe('what-built');
      const updatedTarget = fs.readFileSync(fixture.implementationSummaryPath, 'utf8');
      expect(updatedTarget).not.toBe(originalTarget);
      expect(updatedTarget).toContain('# Transcript closeout fixture');
      expect(updatedTarget).toContain('recent_action: "Transcript closeout fixture"');
    });

    it('T512: planner-default and explicit full-auto keep metadata-only continuity targeting identical', async () => {
      const fixture = createCanonicalRoutingFixture('997-metadata-only');
      const sourceContent = buildContinuitySourceMemory(
        'Captured the packet 014 trim-targeted verdict for transcript replay.',
        'Open packet 015 and compare planner-first output with the canonical diff.',
      );
      const originalTarget = fs.readFileSync(fixture.implementationSummaryPath, 'utf8');

      const plannerResult = await memorySaveHandler.atomicSaveMemory({
        file_path: fixture.sourcePath,
        content: sourceContent,
        routeAs: 'metadata_only',
      }, { force: true });

      expect(plannerResult.status).toBe('planned');
      expect(plannerResult.routeTarget).toMatchObject({
        routeCategory: 'metadata_only',
        targetDocPath: fixture.implementationSummaryPath,
        targetAnchorId: '_memory.continuity',
      });
      expect(fs.readFileSync(fixture.implementationSummaryPath, 'utf8')).toBe(originalTarget);

      const fullAutoResult = await memorySaveHandler.atomicSaveMemory({
        file_path: fixture.sourcePath,
        content: sourceContent,
        plannerMode: 'full-auto',
        routeAs: 'metadata_only',
      }, { force: true });

      expect(fullAutoResult.success).toBe(true);
      expect(['updated', 'indexed', 'deferred']).toContain(String(fullAutoResult.status));
      expect(fullAutoResult.targetDocPath).toBe(fixture.implementationSummaryPath);
      expect(fullAutoResult.targetAnchorId).toBe('_memory.continuity');
      const updatedTarget = fs.readFileSync(fixture.implementationSummaryPath, 'utf8');
      expect(updatedTarget).not.toBe(originalTarget);
      expect(updatedTarget).toContain('recent_action: "Transcript continuity fixture"');
      expect(updatedTarget).toContain('next_safe_action: "Refresh continuity"');
    });
  });
});
