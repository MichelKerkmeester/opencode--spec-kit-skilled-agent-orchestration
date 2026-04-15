import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
// when the database directory cannot be resolved in the test environment).
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

import * as handler from '../handlers/memory-save';
import { buildPlannerResponse } from '../handlers/save/response-builder';
import * as vectorIndex from '../lib/search/vector-index';

const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-memory-save-ux-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(process.cwd(), 'tmp-test-fixtures', 'specs', 'system-spec-kit', '999-memory-save-ux-fixtures');
const NARRATIVE_SOURCE_PATH = path.join(FIXTURE_ROOT, 'memory', 'session.md');
const CONTINUITY_SOURCE_PATH = path.join(FIXTURE_ROOT, 'memory', 'continuity-session.md');
const ORIGINAL_ENV = {
  SPECKIT_AUTO_ENTITIES: process.env.SPECKIT_AUTO_ENTITIES,
  SPECKIT_MEMORY_SUMMARIES: process.env.SPECKIT_MEMORY_SUMMARIES,
  SPECKIT_ENTITY_LINKING: process.env.SPECKIT_ENTITY_LINKING,
  SPECKIT_QUALITY_LOOP: process.env.SPECKIT_QUALITY_LOOP,
  SPECKIT_SAVE_QUALITY_GATE: process.env.SPECKIT_SAVE_QUALITY_GATE,
};

function buildMemoryContent(title: string, body: string): string {
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `---
title: "${title}"
description: "Durable regression fixture for memory_save UX contract coverage."
trigger_phrases:
  - "${titleSlug}"
  - "memory-save-ux"
importance_tier: "normal"
contextType: "implementation"
---

# ${title}

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Total Messages | 4 |
| Fixture Type | memory-save-ux |

<!-- ANCHOR:continue-session -->

## CONTINUE SESSION

Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:canonical-docs -->

## CANONICAL SOURCES

- \`decision-record.md\` — UX contract and duplicate detection strategy
- \`implementation-summary.md\` — Save pipeline integration story

<!-- /ANCHOR:canonical-docs -->

## KEY FILES

| File | Description |
|:-----|:------------|
| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
| \`mcp_server/handlers/save/response-builder.ts\` | Shapes successful save payloads, duplicate no-op hints, and deferred embedding response details. |

<!-- ANCHOR:overview -->

## OVERVIEW

${body}

This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

- Validated duplicate no-op response shape
- Confirmed post-mutation feedback integration
- Tested deferred embedding with immediate save return

<!-- /ANCHOR:evidence -->

## DECISIONS

- Decided to keep duplicate no-op saves visible in the UX contract so callers can distinguish unchanged content from validation failures.
- Decided to report deferred embedding as a successful save state because file persistence completes before async indexing finishes.

## KEY OUTCOMES

- Verified successful saves still expose typed post-mutation hooks.
- Verified duplicate no-op saves omit post-mutation hooks and leave caches unchanged.

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

- If this fixture starts failing insufficiency again, add more concrete file, decision, blocker, next action, or outcome evidence instead of weakening the gate.
- Re-run the UX regression suite and the full MCP package test suite after changing the save contract.

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<!-- MEMORY METADATA -->

## MEMORY METADATA

\`\`\`yaml
session_id: "${titleSlug}-fixture"
fixture_title: "${title}"
\`\`\`

<!-- /ANCHOR:metadata -->
`;
}

function buildContinuityMemoryContent(recentAction: string, nextSafeAction: string): string {
  return `---
title: "Continuity Planner Fixture"
description: "Continuity-focused regression fixture for memory_save UX contract coverage."
trigger_phrases:
  - "continuity-planner-fixture"
  - "memory-save-ux"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/015-save-flow-planner-first-trim"
    last_updated_at: "2026-04-15T07:45:00Z"
    last_updated_by: "vitest-fixture"
    recent_action: "${recentAction}"
    next_safe_action: "${nextSafeAction}"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:${'2'.repeat(64)}"
      session_id: "continuity-planner-fixture"
      parent_session_id: "continuity-planner-parent"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "The planner should preserve the continuity target"
---

# Continuity Planner Fixture

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Total Messages | 4 |
| Fixture Type | metadata-only planner UX |

<!-- ANCHOR:continue-session -->

## CONTINUE SESSION

Continue from the continuity-focused planner review and confirm that the operator-facing output stays readable before choosing explicit full-auto apply mode.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:canonical-docs -->

## CANONICAL SOURCES

- \`implementation-summary.md\` — Canonical continuity target
- \`tasks.md\` — Verification status tracker

<!-- /ANCHOR:canonical-docs -->

## OVERVIEW

This fixture exists to prove that metadata-only planner output stays continuity-focused and readable when the source already carries a valid thin continuity block.

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

- Includes a valid continuity block in frontmatter
- Preserves planner-first apply guidance
- Surfaces follow-up refresh actions after planning

<!-- /ANCHOR:evidence -->

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

- Re-run this fixture in full-auto only after reviewing the planner target and continuity diff.

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<!-- MEMORY METADATA -->

## MEMORY METADATA

\`\`\`yaml
session_id: "continuity-planner-fixture"
\`\`\`

<!-- /ANCHOR:metadata -->
`;
}

function writeCanonicalFixtureDoc(
  filePath: string,
  options: {
    title: string;
    anchorId: string;
    heading: string;
    body: string;
    extraAnchors?: Array<{ id: string; heading: string; body: string }>;
  },
): void {
  const anchors = [
    { id: options.anchorId, heading: options.heading, body: options.body },
    ...(options.extraAnchors ?? []),
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
    `title: "${options.title}"`,
    `description: "${options.title} UX fixture."`,
    'trigger_phrases:',
    '  - "memory-save-ux"',
    'importance_tier: "important"',
    'contextType: "implementation"',
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/999-memory-save-ux-fixtures"',
    '    last_updated_at: "2026-04-15T07:30:00Z"',
    '    last_updated_by: "vitest-fixture"',
    '    recent_action: "Prepared planner-first UX fixture"',
    '    next_safe_action: "Review planner response wording"',
    '    blockers: []',
    '    key_files:',
    '      - "implementation-summary.md"',
    '      - "tasks.md"',
    '    session_dedup:',
    `      fingerprint: "sha256:${'1'.repeat(64)}"`,
    '      session_id: "memory-save-ux-fixture"',
    '      parent_session_id: null',
    '    completion_pct: 15',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '',
    '<!-- SPECKIT_LEVEL: 3 -->',
    `# ${options.title}`,
    '',
    ...anchors,
    '',
  ].join('\n'), 'utf8');
}

function parseResponse(result: { content: Array<{ text: string }> }): any {
  return JSON.parse(result.content[0].text);
}

function resetFixtureDir(): void {
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
  writeCanonicalFixtureDoc(path.join(FIXTURE_ROOT, 'spec.md'), {
    title: 'Spec',
    anchorId: 'problem',
    heading: '## Problem',
    body: 'Planner-first UX fixtures should keep operator guidance readable.',
  });
  writeCanonicalFixtureDoc(path.join(FIXTURE_ROOT, 'tasks.md'), {
    title: 'Tasks',
    anchorId: 'phase-3',
    heading: '## Phase 3',
    body: '- [ ] Review planner wording for transcript operators.',
  });
  writeCanonicalFixtureDoc(path.join(FIXTURE_ROOT, 'decision-record.md'), {
    title: 'Decision Record',
    anchorId: 'adr-001',
    heading: '## ADR-001',
    body: 'Planner output should stay readable before operators choose full-auto fallback.',
  });
  writeCanonicalFixtureDoc(path.join(FIXTURE_ROOT, 'implementation-summary.md'), {
    title: 'Implementation Summary',
    anchorId: 'what-built',
    heading: '## What Was Built',
    body: 'Existing implementation-summary content should remain unchanged during planner-only UX tests.',
    extraAnchors: [
      {
        id: 'verification',
        heading: '## Verification',
        body: 'Verification notes remain separate from the planner response wording.',
      },
    ],
  });
  fs.mkdirSync(path.dirname(NARRATIVE_SOURCE_PATH), { recursive: true });
  fs.writeFileSync(
    NARRATIVE_SOURCE_PATH,
    buildMemoryContent(
      'Planner Readability Fixture',
      'Validated that planner-first save output stays operator-readable, specific about the target doc, and explicit about the full-auto follow-up path.',
    ),
    'utf8',
  );
  fs.writeFileSync(
    CONTINUITY_SOURCE_PATH,
    buildContinuityMemoryContent(
      'Reviewed metadata-only planner wording',
      'Review continuity target before full-auto apply',
    ),
    'utf8',
  );
}

function cleanupFixtureRows(): void {
  const db = vectorIndex.getDb();
  if (!db) {
    return;
  }

  const likePattern = '%999-memory-save-ux-fixtures%';
  db.prepare(`DELETE FROM active_memory_projection WHERE active_memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare(`DELETE FROM memory_lineage WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_conflicts WHERE spec_folder LIKE ?').run(likePattern);
  // Delete history rows before memory_index to satisfy FK constraint
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
  resetFixtureDir();
});

beforeEach(() => {
  // Keep the UX contract tests focused on save-path response shaping.
  // Optional enrichment and quality-gate suites are covered elsewhere and can
  // introduce non-deterministic provider/env interactions in the full run.
  process.env.SPECKIT_AUTO_ENTITIES = 'false';
  process.env.SPECKIT_MEMORY_SUMMARIES = 'false';
  process.env.SPECKIT_ENTITY_LINKING = 'false';
  process.env.SPECKIT_QUALITY_LOOP = 'false';
  delete process.env.SPECKIT_SAVE_QUALITY_GATE;
});

afterEach(() => {
  cleanupFixtureRows();
  resetFixtureDir();
  if (ORIGINAL_ENV.SPECKIT_AUTO_ENTITIES === undefined) delete process.env.SPECKIT_AUTO_ENTITIES;
  else process.env.SPECKIT_AUTO_ENTITIES = ORIGINAL_ENV.SPECKIT_AUTO_ENTITIES;
  if (ORIGINAL_ENV.SPECKIT_MEMORY_SUMMARIES === undefined) delete process.env.SPECKIT_MEMORY_SUMMARIES;
  else process.env.SPECKIT_MEMORY_SUMMARIES = ORIGINAL_ENV.SPECKIT_MEMORY_SUMMARIES;
  if (ORIGINAL_ENV.SPECKIT_ENTITY_LINKING === undefined) delete process.env.SPECKIT_ENTITY_LINKING;
  else process.env.SPECKIT_ENTITY_LINKING = ORIGINAL_ENV.SPECKIT_ENTITY_LINKING;
  if (ORIGINAL_ENV.SPECKIT_QUALITY_LOOP === undefined) delete process.env.SPECKIT_QUALITY_LOOP;
  else process.env.SPECKIT_QUALITY_LOOP = ORIGINAL_ENV.SPECKIT_QUALITY_LOOP;
  if (ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE === undefined) delete process.env.SPECKIT_SAVE_QUALITY_GATE;
  else process.env.SPECKIT_SAVE_QUALITY_GATE = ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE;
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

describe('Memory save UX regressions', () => {
  it('returns readable, action-oriented planner output for narrative progress saves', async () => {
    const plannerResult = await handler.atomicSaveMemory({
      file_path: NARRATIVE_SOURCE_PATH,
      content: fs.readFileSync(NARRATIVE_SOURCE_PATH, 'utf8'),
      routeAs: 'narrative_progress',
      mergeModeHint: 'append-as-paragraph',
      targetAnchorId: 'what-built',
    }, { force: true });
    const response = buildPlannerResponse({ planner: plannerResult });

    const parsed = parseResponse(response);
    expect(parsed.data).toMatchObject({
      status: 'planned',
      plannerMode: 'plan-only',
      routeTarget: expect.objectContaining({
        routeCategory: 'narrative_progress',
        targetDocPath: path.join(FIXTURE_ROOT, 'implementation-summary.md'),
        targetAnchorId: 'what-built',
        mergeMode: 'append-as-paragraph',
      }),
    });
    expect(parsed.data.proposedEdits[0]).toEqual(expect.objectContaining({
      summary: expect.stringContaining('canonical narrative progress update'),
      targetDocPath: path.join(FIXTURE_ROOT, 'implementation-summary.md'),
      targetAnchorId: 'what-built',
    }));
    expect(parsed.data.followUpActions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        action: 'apply',
        title: 'Apply canonical save',
        description: expect.stringContaining('explicit full-auto mode'),
        args: expect.objectContaining({
          plannerMode: 'full-auto',
          routeAs: 'narrative_progress',
          targetAnchorId: 'what-built',
        }),
      }),
    ]));
    expect(parsed.hints).toEqual(expect.arrayContaining([
      expect.stringContaining('Planner prepared 1 proposed edit'),
      expect.stringContaining('Available follow-up actions: apply'),
    ]));
  });

  it('keeps metadata-only planner guidance readable and continuity-focused', async () => {
    const plannerResult = await handler.atomicSaveMemory({
      file_path: CONTINUITY_SOURCE_PATH,
      content: fs.readFileSync(CONTINUITY_SOURCE_PATH, 'utf8'),
      routeAs: 'metadata_only',
    }, { force: true });
    const response = buildPlannerResponse({ planner: plannerResult });

    const parsed = parseResponse(response);
    expect(parsed.data).toMatchObject({
      status: 'planned',
      plannerMode: 'plan-only',
      routeTarget: expect.objectContaining({
        routeCategory: 'metadata_only',
        targetDocPath: path.join(FIXTURE_ROOT, 'implementation-summary.md'),
        targetAnchorId: '_memory.continuity',
      }),
    });
    expect(parsed.data.proposedEdits[0]).toEqual(expect.objectContaining({
      summary: expect.stringContaining('canonical metadata only update'),
      targetAnchorId: '_memory.continuity',
    }));
    expect(parsed.data.followUpActions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        action: 'apply',
        title: 'Apply canonical save',
      }),
      expect.objectContaining({
        action: 'refresh-graph',
        title: 'Refresh graph metadata',
      }),
      expect.objectContaining({
        action: 'reindex',
        title: 'Reindex touched spec docs',
      }),
    ]));
  });

  it('reports blocked planner responses with readable blocker and next-step language', async () => {
    const plannerResult = await handler.atomicSaveMemory({
      file_path: NARRATIVE_SOURCE_PATH,
      content: fs.readFileSync(NARRATIVE_SOURCE_PATH, 'utf8'),
      routeAs: 'task_update',
      mergeModeHint: 'append-as-paragraph',
      targetAnchorId: 'missing-phase',
    }, { force: true });
    const response = buildPlannerResponse({ planner: plannerResult });

    const parsed = parseResponse(response);
    expect(parsed.data.status).toBe('blocked');
    expect(parsed.data.blockers).toEqual([
      expect.objectContaining({
        code: expect.any(String),
        message: expect.stringContaining('update-in-place'),
        targetDocPath: 'tasks.md',
      }),
    ]);
    expect(parsed.data.followUpActions).toEqual([
      expect.objectContaining({
        action: 'apply',
        title: 'Retry in full-auto mode after resolving blockers',
        description: expect.stringContaining('blocking issue'),
      }),
    ]);
    expect(parsed.hints).toEqual(expect.arrayContaining([
      'Resolve planner blockers before requesting full-auto apply mode',
    ]));
  });
});
