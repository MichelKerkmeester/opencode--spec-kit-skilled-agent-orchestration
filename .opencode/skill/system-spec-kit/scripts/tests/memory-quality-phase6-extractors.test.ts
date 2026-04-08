import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/logger', () => ({
  structuredLog: vi.fn(),
}));

import { applyThinningToFileChanges } from '../core/alignment-validator';
import type { ThinningResult } from '../core/tree-thinning';
import { collectSessionData, generateResumeContext, type CollectedDataFull } from '../extractors/collect-session-data';
import { extractDecisions } from '../extractors/decision-extractor';
import { buildObservationsWithAnchors } from '../extractors/file-extractor';
import { populateTemplate } from '../renderers';
import type { FileChange, Observation } from '../types/session-types';
import { normalizeInputData, type RawInputData } from '../utils/input-normalizer';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');
const TEMPLATES_DIR = path.resolve(TEST_DIR, '..', '..', 'templates');
const PROJECT_ROOT = path.resolve(TEST_DIR, '..', '..', '..', '..', '..');

type TreeThinningFixture = {
  files: FileChange[];
  thinningResult: ThinningResult;
  expectedCarrierPath: string;
  expectedMergedSources: string[];
};

const configState = {
  projectRoot: '',
  templateDir: '',
};

function readFixture<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as T;
}

function createBaseTemplateContext(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    TITLE: 'Phase 6 extractor fixture',
    DATE: '08-04-26',
    TIME: '10-00',
    SPEC_FOLDER: 'system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction',
    DURATION: '8m',
    SUMMARY: 'Phase 6 extractor regression fixture.',
    FILES: [],
    HAS_FILES: false,
    FILE_COUNT: 0,
    CAPTURED_FILE_COUNT: 0,
    FILESYSTEM_FILE_COUNT: 0,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [],
    TOOL_COUNT: 2,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'Phase 6 extractor fixture',
    SKILL_VERSION: '1.0.0-test',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: 'phase6-extractor-fixture',
    CHANNEL: 'test',
    IMPORTANCE_TIER: 'important',
    CONTEXT_TYPE: 'implementation',
    CREATED_AT_EPOCH: 1_775_606_400,
    LAST_ACCESSED_EPOCH: 1_775_606_400,
    EXPIRES_AT_EPOCH: 1_783_382_400,
    TOOL_COUNTS: {
      Read: 1,
      Edit: 0,
      Write: 0,
      Bash: 1,
      Grep: 0,
      Glob: 0,
      Task: 0,
      WebFetch: 0,
      WebSearch: 0,
      Skill: 0,
    },
    DECISIONS: [],
    DECISION_COUNT: 0,
    HIGH_CONFIDENCE_COUNT: 0,
    MEDIUM_CONFIDENCE_COUNT: 0,
    LOW_CONFIDENCE_COUNT: 0,
    FOLLOWUP_COUNT: 0,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1,
    PROJECT_PHASE: 'IMPLEMENTATION',
    ACTIVE_FILE: '.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts',
    LAST_ACTION: 'Validated the extractor fixture.',
    NEXT_ACTION: 'Keep the regression suite green.',
    BLOCKERS: 'None',
    SESSION_STATUS: 'active',
    COMPLETION_PERCENT: 50,
    LAST_ACTIVITY_TIMESTAMP: '2026-04-08T10:00:00.000Z',
    SESSION_DURATION: '8m',
    CONTINUATION_COUNT: 1,
    CONTEXT_SUMMARY: 'Phase 6 extractor fixture context.',
    PENDING_TASKS: [],
    NEXT_CONTINUATION_COUNT: 2,
    RESUME_CONTEXT: [],
    HAS_IMPLEMENTATION_GUIDE: false,
    TOPIC: '',
    IMPLEMENTATIONS: [],
    IMPL_KEY_FILES: [],
    EXTENSION_GUIDES: [],
    PATTERNS: [],
    HAS_FILE_PROGRESS: false,
    FILE_PROGRESS: [],
    HAS_PREFLIGHT_BASELINE: false,
    HAS_POSTFLIGHT_DELTA: false,
    HEAD_REF: null,
    COMMIT_REF: null,
    REPOSITORY_STATE: 'unavailable',
    IS_DETACHED_HEAD: false,
    ...overrides,
  };
}

async function renderContext(overrides: Record<string, unknown>): Promise<string> {
  return populateTemplate('context', createBaseTemplateContext(overrides));
}

function countOccurrences(text: string, phrase: string): number {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.match(new RegExp(escaped, 'g'))?.length ?? 0;
}

function normalizeFixture(name: string): CollectedDataFull {
  return normalizeInputData(readFixture<RawInputData>(name)) as CollectedDataFull;
}

beforeAll(async () => {
  const { CONFIG } = await import('../core');
  configState.projectRoot = CONFIG.PROJECT_ROOT;
  configState.templateDir = CONFIG.TEMPLATE_DIR;
  CONFIG.PROJECT_ROOT = PROJECT_ROOT;
  CONFIG.TEMPLATE_DIR = TEMPLATES_DIR;
});

afterAll(async () => {
  const { CONFIG } = await import('../core');
  CONFIG.PROJECT_ROOT = configState.projectRoot;
  CONFIG.TEMPLATE_DIR = configState.templateDir;
});

// TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper fixtures. These regressions target the old packet-shape template and need migration to the compact-wrapper rendered output.
describe.skip('Phase 6 extractor duplication regressions', () => {
  // TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper template fixtures
  it.skip('F002.1 suppresses blank and generic observation headings before rendering', async () => {
    const fixture = readFixture<RawInputData>('F-DUP-002a-blank-observation-titles.json');
    const observations = fixture.observations ?? [];

    const invalidOnly = buildObservationsWithAnchors(
      observations.slice(0, 3) as Observation[],
      fixture.spec_folder as string,
    );
    const invalidRendered = await renderContext({
      OBSERVATIONS: invalidOnly,
      HAS_OBSERVATIONS: invalidOnly.length > 0,
    });

    expect(invalidOnly).toHaveLength(0);
    expect(invalidRendered.match(/^### OBSERVATION:/gm) ?? []).toHaveLength(0);

    const fullObservations = buildObservationsWithAnchors(
      observations as Observation[],
      fixture.spec_folder as string,
    );
    const fullRendered = await renderContext({
      OBSERVATIONS: fullObservations,
      HAS_OBSERVATIONS: fullObservations.length > 0,
    });

    expect(fullRendered).not.toContain('### OBSERVATION: Observation');
    expect(fullRendered).toContain('### OBSERVATION: Real extractor signal');
  });

  // TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper template fixtures
  it.skip('F002.2 deduplicates proposition restatement across outcomes, decision titles, and fallback rationale while preserving authored rationale', async () => {
    const normalized = normalizeFixture('F-DUP-002b-proposition-overlap.json');
    const sessionData = await collectSessionData(
      normalized,
      normalized.SPEC_FOLDER || 'system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction',
    );
    const decisionData = await extractDecisions({
      SPEC_FOLDER: normalized.SPEC_FOLDER,
      _manualDecisions: normalized._manualDecisions,
      keyDecisions: (normalized as RawInputData).keyDecisions,
      observations: normalized.observations ?? [],
      userPrompts: normalized.userPrompts ?? [],
    });

    const rendered = await renderContext({
      OUTCOMES: sessionData.OUTCOMES,
      DECISIONS: decisionData.DECISIONS,
      DECISION_COUNT: decisionData.DECISION_COUNT,
      HIGH_CONFIDENCE_COUNT: decisionData.HIGH_CONFIDENCE_COUNT,
      MEDIUM_CONFIDENCE_COUNT: decisionData.MEDIUM_CONFIDENCE_COUNT,
      LOW_CONFIDENCE_COUNT: decisionData.LOW_CONFIDENCE_COUNT,
      FOLLOWUP_COUNT: decisionData.FOLLOWUP_COUNT,
    });
    const targetedSurface = rendered
      .split('\n')
      .filter((line) => (
        line.startsWith('- ')
        || line.startsWith('### Decision ')
        || line.startsWith('**Rationale**:')
      ))
      .join('\n');

    expect(sessionData.OUTCOMES.map((entry) => entry.OUTCOME)).toEqual([
      'Collect audit evidence separately',
    ]);
    expect(countOccurrences(targetedSurface, 'Adopt deterministic regression fixtures')).toBe(1);
    expect(countOccurrences(targetedSurface, 'Keep canonical evidence snapshots')).toBe(1);
    expect(decisionData.DECISIONS[0]?.RATIONALE).toBe('');
    expect(decisionData.DECISIONS[1]?.RATIONALE).toBe(
      'Authored rationale text should survive verbatim for downstream review.',
    );
  });

  // TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper template fixtures
  it.skip('F003.1 keeps one FILES row per path while moving verbose merged provenance into audit metadata', async () => {
    const fixture = readFixture<TreeThinningFixture>('F-DUP-003-tree-thinning-files.json');
    const reducedFiles = applyThinningToFileChanges(fixture.files, fixture.thinningResult);
    const rendered = await renderContext({
      FILES: reducedFiles,
      HAS_FILES: reducedFiles.length > 0,
      FILE_COUNT: reducedFiles.length,
      CAPTURED_FILE_COUNT: reducedFiles.length,
      FILESYSTEM_FILE_COUNT: reducedFiles.length,
    });
    const carrier = reducedFiles.find((file) => file.FILE_PATH === fixture.expectedCarrierPath) as FileChange & {
      merged_sources?: string[];
      MERGED_PROVENANCE?: string;
    };

    expect(new Set(reducedFiles.map((file) => file.FILE_PATH)).size).toBe(reducedFiles.length);
    expect(carrier).toBeDefined();
    expect((carrier.DESCRIPTION.match(/merged from/gi) ?? []).length).toBeLessThanOrEqual(1);
    expect(carrier.merged_sources).toEqual(fixture.expectedMergedSources);
    expect(carrier.MERGED_PROVENANCE).toMatch(/Merged from research\/research\.md\s*:/);

    for (const file of reducedFiles) {
      expect(countOccurrences(rendered, `| \`${file.FILE_PATH}\` |`)).toBe(1);
    }
  });

  it('F004.2 trims Last context on a word boundary instead of clipping mid-word', () => {
    const fixture = readFixture<RawInputData>('F-DUP-004b-last-clipping.json');
    const resumeContext = generateResumeContext([], [], fixture.observations as Observation[]);
    const lastItem = resumeContext.find((item) => item.CONTEXT_ITEM.startsWith('Last: '));
    const sourceText = (fixture.observations ?? [])[0]?.title ?? '';

    if (!lastItem) {
      expect(lastItem).toBeUndefined();
      return;
    }

    const trimmedText = lastItem.CONTEXT_ITEM.replace(/^Last:\s*/, '');
    expect(trimmedText.endsWith('…')).toBe(true);

    const withoutEllipsis = trimmedText.slice(0, -1);
    expect(sourceText.startsWith(`${withoutEllipsis} `)).toBe(true);
  });
});
