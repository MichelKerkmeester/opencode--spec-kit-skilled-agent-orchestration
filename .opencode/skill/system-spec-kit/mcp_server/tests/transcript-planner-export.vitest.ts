import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

import * as memorySaveHandler from '../handlers/memory-save';
import * as vectorIndex from '../lib/search/vector-index';

const REPO_ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const PACKET_SCRATCH = path.join(
  REPO_ROOT,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/scratch',
);
const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-transcript-export-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(REPO_ROOT, 'tmp-test-fixtures', 'specs', 'system-spec-kit', 'transcript-prototypes');
const SUMMARY_PATH = path.join(PACKET_SCRATCH, 'transcript-prototype-summary.json');

type RouteCategory = 'narrative_progress' | 'metadata_only' | 'task_update';

interface TranscriptConfig {
  id: '1' | '2' | '3';
  routeAs: RouteCategory;
  mergeModeHint?: 'append-as-paragraph' | 'update-in-place';
  targetAnchorId?: string;
  expectedPlannerStatus: 'planned' | 'blocked';
}

const TRANSCRIPTS: TranscriptConfig[] = [
  { id: '1', routeAs: 'narrative_progress', mergeModeHint: 'append-as-paragraph', targetAnchorId: 'what-built', expectedPlannerStatus: 'planned' },
  { id: '2', routeAs: 'metadata_only', expectedPlannerStatus: 'planned' },
  { id: '3', routeAs: 'task_update', mergeModeHint: 'update-in-place', targetAnchorId: 'phase-3', expectedPlannerStatus: 'blocked' },
];

function buildCanonicalDoc(
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
    `description: "${options.title} transcript prototype fixture."`,
    'trigger_phrases:',
    '  - "transcript-prototype"',
    'importance_tier: "important"',
    'contextType: "implementation"',
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/transcript-prototypes"',
    '    last_updated_at: "2026-04-15T08:00:00Z"',
    '    last_updated_by: "transcript-runner"',
    '    recent_action: "Prepared transcript prototype fixture"',
    '    next_safe_action: "Review planner output"',
    '    blockers: []',
    '    key_files:',
    '      - "implementation-summary.md"',
    '      - "tasks.md"',
    '    session_dedup:',
    `      fingerprint: "sha256:${'9'.repeat(64)}"`,
    '      session_id: "transcript-runner"',
    '      parent_session_id: null',
    '    completion_pct: 20',
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

function createFixture(id: string): { specFolder: string; sourcePath: string; implementationSummaryPath: string; tasksPath: string } {
  const specFolder = path.join(FIXTURE_ROOT, `transcript-${id}`);
  buildCanonicalDoc(path.join(specFolder, 'spec.md'), {
    title: 'Spec',
    anchorId: 'problem',
    heading: '## Problem',
    body: 'Transcript prototype fixture for planner-first save-flow review.',
  });
  buildCanonicalDoc(path.join(specFolder, 'plan.md'), {
    title: 'Plan',
    anchorId: 'implementation-plan',
    heading: '## Implementation Plan',
    body: 'Route transcript prototypes through planner-first and full-auto fallback.',
  });
  buildCanonicalDoc(path.join(specFolder, 'tasks.md'), {
    title: 'Tasks',
    anchorId: 'phase-3',
    heading: '## Phase 3',
    body: '- [ ] Capture transcript prototype findings.\n- [ ] Record follow-on task if planner blocks.',
  });
  buildCanonicalDoc(path.join(specFolder, 'checklist.md'), {
    title: 'Checklist',
    anchorId: 'verification',
    heading: '## Verification',
    body: '- [ ] Validate transcript planner output.',
  });
  buildCanonicalDoc(path.join(specFolder, 'decision-record.md'), {
    title: 'Decision Record',
    anchorId: 'adr-001',
    heading: '## ADR-001',
    body: 'Keep planner output and fallback mutations aligned during transcript prototyping.',
  });
  buildCanonicalDoc(path.join(specFolder, 'implementation-summary.md'), {
    title: 'Implementation Summary',
    anchorId: 'what-built',
    heading: '## What Was Built',
    body: 'Prototype fixture baseline before transcript replay.',
    extraAnchors: [
      { id: 'verification', heading: '## Verification', body: 'Verification notes remain separate from implementation narrative.' },
    ],
  });

  const sourcePath = path.join(specFolder, 'memory', 'session.md');
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  return {
    specFolder,
    sourcePath,
    implementationSummaryPath: path.join(specFolder, 'implementation-summary.md'),
    tasksPath: path.join(specFolder, 'tasks.md'),
  };
}

describe('transcript planner export', () => {
  // Packet 015 scratch transcripts were removed in ce65be2aa2 when 016 became the
  // canonical unified-journey packet; do not recreate deleted archive fixtures.
  it.skipIf(!TRANSCRIPTS.every((transcript) => fs.existsSync(path.join(PACKET_SCRATCH, `transcript-${transcript.id}.md`))))(
    'exports planner outputs and fallback summaries for packet 015 transcript prototypes',
    async () => {
    fs.mkdirSync(TEST_DB_DIR, { recursive: true });
    const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
    process.env.MEMORY_DB_PATH = TEST_DB_PATH;
    try {
      vectorIndex.closeDb();
    } catch {
      // ignore
    }
    vectorIndex.initializeDb();
    if (previousMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
    else process.env.MEMORY_DB_PATH = previousMemoryDbPath;

    const summary: Array<Record<string, unknown>> = [];

    for (const transcript of TRANSCRIPTS) {
      const fixture = createFixture(transcript.id);
      const transcriptPath = path.join(PACKET_SCRATCH, `transcript-${transcript.id}.md`);
      const transcriptContent = fs.readFileSync(transcriptPath, 'utf8');

      const plannerResult = await memorySaveHandler.atomicSaveMemory({
        file_path: fixture.sourcePath,
        content: transcriptContent,
        routeAs: transcript.routeAs,
        ...(transcript.mergeModeHint ? { mergeModeHint: transcript.mergeModeHint } : {}),
        ...(transcript.targetAnchorId ? { targetAnchorId: transcript.targetAnchorId } : {}),
      }, { force: true });

      fs.writeFileSync(
        path.join(PACKET_SCRATCH, `transcript-${transcript.id}-planner-output.json`),
        `${JSON.stringify(plannerResult, null, 2)}\n`,
        'utf8',
      );

      const targetPath = transcript.routeAs === 'task_update'
        ? fixture.tasksPath
        : fixture.implementationSummaryPath;
      const originalTarget = fs.readFileSync(targetPath, 'utf8');

      const fullAutoResult = await memorySaveHandler.atomicSaveMemory({
        file_path: fixture.sourcePath,
        content: transcriptContent,
        plannerMode: 'full-auto',
        routeAs: transcript.routeAs,
        ...(transcript.mergeModeHint ? { mergeModeHint: transcript.mergeModeHint } : {}),
        ...(transcript.targetAnchorId ? { targetAnchorId: transcript.targetAnchorId } : {}),
      }, { force: true });

      const updatedTarget = fs.readFileSync(targetPath, 'utf8');
      summary.push({
        transcript: transcript.id,
        plannerStatus: plannerResult.status,
        plannerSuccess: plannerResult.success,
        plannerTargetDocPath: plannerResult.targetDocPath,
        plannerTargetAnchorId: plannerResult.targetAnchorId,
        expectedPlannerStatus: transcript.expectedPlannerStatus,
        fullAutoStatus: fullAutoResult.status,
        fullAutoSuccess: fullAutoResult.success,
        fullAutoTargetDocPath: fullAutoResult.targetDocPath,
        targetChanged: updatedTarget !== originalTarget,
        updatedTargetSnippet: updatedTarget.slice(0, 600),
        blockerMessages: plannerResult.blockers?.map((blocker) => blocker.message) ?? [],
      });
    }

    fs.writeFileSync(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

    expect(summary).toHaveLength(3);
    expect(summary.filter((entry) => entry.plannerStatus === 'planned')).toHaveLength(2);
    },
  );
});

afterAll(() => {
  try {
    vectorIndex.closeDb();
  } catch {
    // ignore
  }
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});
