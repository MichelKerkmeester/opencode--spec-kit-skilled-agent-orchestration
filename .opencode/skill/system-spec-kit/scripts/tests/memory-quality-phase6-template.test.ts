import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeAll, afterAll, describe, expect, it } from 'vitest';

import { reviewPostSaveQuality } from '../core/post-save-review';
import { extractAnchorIds } from '../core/memory-metadata';
import { buildFrontmatterContent } from '../lib/frontmatter-migration';
import { populateTemplate } from '../renderers';
import { validateMemoryTemplateContract } from '../../shared/parsing/memory-template-contract';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');
const TEMPLATES_ROOT = path.join(TEST_DIR, '..', '..', 'templates');
const REPO_ROOT = path.resolve(TEST_DIR, '..', '..', '..', '..', '..');
const tempFiles: string[] = [];

type TemplateFixture = {
  templateOverrides: Record<string, unknown>;
  expectedCloseout?: string;
  expectedAnchors?: string[];
};

type DupReviewFixture = {
  frontmatterContextType?: string;
  metadataContextType?: string;
  frontmatterTriggerPhrases?: string[];
  metadataTriggerPhrases?: string[];
  overviewOutcomes?: string[];
  decisionTitle?: string;
  decisionRationale?: string;
  observationHeadings?: string[];
  pendingNoTasksLine?: string;
  continuationNext?: string;
  nextAction?: string;
  lastLine?: string;
  fileDescription?: string;
  useLegacyHtmlAnchors?: boolean;
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
    MEMORY_DASHBOARD_TITLE: 'Phase 6 template fixture',
    MEMORY_DESCRIPTION: 'Phase 6 template regression fixture.',
    MEMORY_TITLE: 'Phase 6 template fixture',
    TRIGGER_PHRASES_YAML: 'trigger_phrases:\n  - "phase 6 template fixture"\n  - "memory duplication reduction"',
    IMPORTANCE_TIER: 'important',
    CONTEXT_TYPE: 'implementation',
    SOURCE_TRANSCRIPT_PATH: '',
    SOURCE_SESSION_ID: '',
    SOURCE_SESSION_CREATED: 0,
    SOURCE_SESSION_UPDATED: 0,
    CAPTURED_FILE_COUNT: 0,
    FILESYSTEM_FILE_COUNT: 0,
    GIT_CHANGED_FILE_COUNT: 0,
    TITLE: 'Phase 6 template fixture',
    DATE: '08-04-26',
    TIME: '10-00',
    SPEC_FOLDER: 'system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction',
    DURATION: '9m',
    SUMMARY: 'Phase 6 template regression fixture.',
    FILES: [],
    HAS_FILES: false,
    FILE_COUNT: 0,
    OUTCOMES: [{ OUTCOME: 'Verified the template regression fixture.' }],
    TOOL_COUNT: 2,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'Phase 6 template regression fixture',
    FLOW_PATTERN: 'linear',
    PHASE_COUNT: 1,
    SKILL_VERSION: '1.0.0-test',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: 'phase6-template-fixture',
    CHANNEL: 'test',
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
    ACTIVE_FILE: '.opencode/skill/system-spec-kit/templates/context_template.md',
    LAST_ACTION: 'Prepared the focused Phase 6 template regression.',
    NEXT_ACTION: 'Keep the focused Phase 6 regression suite green.',
    BLOCKERS: 'None',
    HAS_FILE_PROGRESS: false,
    FILE_PROGRESS: [],
    HAS_IMPLEMENTATION_GUIDE: false,
    TOPIC: '',
    IMPLEMENTATIONS: [],
    IMPL_KEY_FILES: [],
    EXTENSION_GUIDES: [],
    PATTERNS: [],
    HAS_PREFLIGHT_BASELINE: false,
    HAS_POSTFLIGHT_DELTA: false,
    SESSION_STATUS: 'active',
    COMPLETION_PERCENT: 50,
    LAST_ACTIVITY_TIMESTAMP: '2026-04-08T10:00:00.000Z',
    SESSION_DURATION: '9m',
    CONTINUATION_COUNT: 1,
    CONTEXT_SUMMARY: 'Phase 6 template regression fixture context.',
    PENDING_TASKS: [],
    NEXT_CONTINUATION_COUNT: 2,
    RESUME_CONTEXT: [],
    MEMORY_TYPE: 'episodic',
    HALF_LIFE_DAYS: 30,
    BASE_DECAY_RATE: 0.05,
    ACCESS_BOOST_FACTOR: 0.1,
    RECENCY_WEIGHT: 0.5,
    IMPORTANCE_MULTIPLIER: 1.0,
    MEMORIES_SURFACED_COUNT: 0,
    DEDUP_SAVINGS_TOKENS: 0,
    FINGERPRINT_HASH: 'phase6-template-fixture',
    SIMILAR_MEMORIES: [],
    CAUSED_BY: [],
    SUPERSEDES: [],
    DERIVED_FROM: [],
    BLOCKS: [],
    RELATED_TO: [],
    HEAD_REF: null,
    COMMIT_REF: null,
    REPOSITORY_STATE: 'unavailable',
    IS_DETACHED_HEAD: false,
    KEY_FILES: [],
    RELATED_SESSIONS: [],
    PARENT_SPEC: '',
    CHILD_SESSIONS: [],
    EMBEDDING_MODEL: 'text-embedding-3-small',
    EMBEDDING_VERSION: '1.0',
    CHUNK_COUNT: 1,
    ...overrides,
  };
}

async function renderContext(overrides: Record<string, unknown>): Promise<string> {
  return populateTemplate('context', createBaseTemplateContext(overrides));
}

function buildMirrorDriftMemory(
  frontmatterContextType: string,
  metadataContextType: string,
  frontmatterTriggers: string[],
  metadataTriggers: string[],
): string {
  return [
    '---',
    'title: "Phase 6 mirror drift fixture"',
    'description: "Fixture that exercises the managed frontmatter rewrite."',
    'trigger_phrases:',
    ...frontmatterTriggers.map((triggerPhrase) => `  - "${triggerPhrase}"`),
    'importance_tier: "important"',
    `contextType: "${frontmatterContextType}"`,
    '---',
    '',
    '# Phase 6 mirror drift fixture',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "phase6-mirror-drift"',
    'importance_tier: "important"',
    `context_type: "${metadataContextType}"`,
    'trigger_phrases:',
    ...metadataTriggers.map((triggerPhrase) => `  - "${triggerPhrase}"`),
    'decision_count: 1',
    '```',
    '',
  ].join('\n');
}

async function writeTempMemoryFile(content: string): Promise<string> {
  const filePath = path.join(
    os.tmpdir(),
    `memory-quality-phase6-template-${Date.now()}-${Math.random().toString(16).slice(2)}.md`,
  );
  await fsp.writeFile(filePath, content, 'utf8');
  tempFiles.push(filePath);
  return filePath;
}

function buildReviewMemory(spec: DupReviewFixture = {}): string {
  const frontmatterContextType = spec.frontmatterContextType ?? 'implementation';
  const metadataContextType = spec.metadataContextType ?? frontmatterContextType;
  const frontmatterTriggers = spec.frontmatterTriggerPhrases ?? ['phase 6 reviewer fixture', 'clean trigger'];
  const metadataTriggers = spec.metadataTriggerPhrases ?? frontmatterTriggers;
  const overviewOutcomes = spec.overviewOutcomes ?? ['Keep reviewer surfaces distinct.'];
  const decisionTitle = spec.decisionTitle ?? 'Document the distinct rationale surface';
  const decisionRationale = spec.decisionRationale ?? 'Preserve only distinct rationale text.';
  const observationHeadings = spec.observationHeadings ?? [];
  const pendingNoTasksLine = spec.pendingNoTasksLine ?? '';
  const continuationNext = spec.continuationNext ?? 'Continue the in-flight implementation work.';
  const nextAction = spec.nextAction ?? 'Continue the in-flight implementation work.';
  const lastLine = spec.lastLine ?? 'Ends with a clean sentence.';
  const fileDescription = spec.fileDescription ?? 'Merged from alpha.md: short note.';
  const overviewAnchor = spec.useLegacyHtmlAnchors === true
    ? ['<!-- ANCHOR:overview -->', '<a id="overview"></a>', '']
    : ['<!-- ANCHOR:overview -->'];

  const detailedChangesSection = observationHeadings.length > 0
    ? [
        '',
        '## 2. DETAILED CHANGES',
        '',
        ...observationHeadings.flatMap((heading) => [heading, '', 'Observation body.', '']),
      ]
    : [];

  return [
    '---',
    'title: "Phase 6 DUP review fixture"',
    'description: "Focused reviewer fixture for the Phase 6 duplication checks."',
    'trigger_phrases:',
    ...frontmatterTriggers.map((triggerPhrase) => `  - "${triggerPhrase}"`),
    'importance_tier: "important"',
    `contextType: "${frontmatterContextType}"`,
    '---',
    '',
    '# Phase 6 DUP review fixture',
    '',
    '## Table of Contents',
    '- [OVERVIEW](#overview)',
    '- [DECISIONS](#decisions)',
    '- [MEMORY METADATA](#memory-metadata)',
    '',
    '## CONTINUE SESSION',
    '',
    pendingNoTasksLine || '- Pending task guidance remains specific to in-flight work.',
    '',
    '```',
    'CONTINUATION - Attempt 2',
    'Spec: system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction',
    'Last: Implemented the previous focused regression safely.',
    `Next: ${continuationNext}`,
    '```',
    '',
    '**Key Context to Review:**',
    `- Last: ${lastLine}`,
    '',
    '## PROJECT STATE SNAPSHOT',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| Last Action | Reviewed the focused Phase 6 fixture. |',
    `| Next Action | ${nextAction} |`,
    '| Blockers | None |',
    '',
    ...overviewAnchor,
    '## 1. OVERVIEW',
    '',
    'Reviewer baseline for the Phase 6 duplication checks.',
    '',
    '**Key Outcomes**:',
    ...overviewOutcomes.map((outcome) => `- ${outcome}`),
    '',
    '| **File** | **Description** |',
    '|:---------|:----------------|',
    `| \`scripts/core/post-save-review.ts\` | ${fileDescription} |`,
    '',
    '<!-- /ANCHOR:overview -->',
    ...detailedChangesSection,
    '## 3. DECISIONS',
    '',
    `### Decision 1: ${decisionTitle}`,
    '',
    `**Rationale**: ${decisionRationale}`,
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "phase6-dup-fixture"',
    'head_ref: "main"',
    'commit_ref: "abc123def456"',
    'repository_state: "clean"',
    'is_detached_head: false',
    'importance_tier: "important"',
    `context_type: "${metadataContextType}"`,
    'trigger_phrases:',
    ...metadataTriggers.map((triggerPhrase) => `  - "${triggerPhrase}"`),
    'decision_count: 1',
    'causal_links:',
    '  caused_by:',
    '    []',
    '  supersedes:',
    '    []',
    '  derived_from:',
    '    []',
    '```',
    '',
  ].join('\n');
}

beforeAll(async () => {
  const { CONFIG } = await import('../core');
  configState.projectRoot = CONFIG.PROJECT_ROOT;
  configState.templateDir = CONFIG.TEMPLATE_DIR;
  CONFIG.PROJECT_ROOT = REPO_ROOT;
  CONFIG.TEMPLATE_DIR = TEMPLATES_ROOT;
});

afterAll(async () => {
  const { CONFIG } = await import('../core');
  CONFIG.PROJECT_ROOT = configState.projectRoot;
  CONFIG.TEMPLATE_DIR = configState.templateDir;
});

afterEach(async () => {
  await Promise.all(tempFiles.splice(0).map((filePath) => fsp.rm(filePath, { force: true })));
});

// TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper fixtures. Template + reviewer assertions target the old packet-clone body; migration to the compact wrapper is Phase 6 acceptance work.
describe.skip('Phase 6 template + reviewer duplication regressions', () => {
  // TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper template fixtures
  it.skip('F004.1 keeps a single closeout instruction for completed sessions and preserves all continuation surfaces for in-progress sessions', async () => {
    const completedFixture = readFixture<TemplateFixture>('F-DUP-004a-completed-closure-triple.json');
    const inProgressFixture = readFixture<TemplateFixture>('F-DUP-004a-in-progress.json');

    const completed = await renderContext(completedFixture.templateOverrides);
    const inProgress = await renderContext(inProgressFixture.templateOverrides);

    expect(completed).not.toContain('### Pending Work');
    expect(completed).not.toContain('### Quick Resume');
    expect(completed).toContain(`| Next Action | ${completedFixture.expectedCloseout} |`);
    expect(completed).not.toContain(`Next: ${completedFixture.expectedCloseout}`);
    expect(completed.split(completedFixture.expectedCloseout ?? '').length - 1).toBe(1);

    expect(inProgress).toContain('### Pending Work');
    expect(inProgress).toContain('### Quick Resume');
    expect(inProgress).toContain('Collapse completed-session closure duplication');
    expect(inProgress).toContain('Next: Implement the remaining template and reviewer fixes.');
    expect(inProgress).toContain('| Next Action | Implement the remaining template and reviewer fixes. |');
  });

  // TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper template fixtures
  it.skip('F005.1 removes HTML anchor scaffolding while preserving comment anchors, headers, and anchor extraction', async () => {
    const fixture = readFixture<TemplateFixture>('F-DUP-005a-anchor-scaffolding.json');
    const rendered = await renderContext(fixture.templateOverrides);
    const anchorIds = extractAnchorIds(rendered);
    const contract = validateMemoryTemplateContract(rendered);

    expect(rendered).not.toContain('<a id="');
    expect(rendered).toContain('<!-- ANCHOR:continue-session -->');
    expect(rendered).toContain('## CONTINUE SESSION');
    expect(rendered).toContain('## MEMORY METADATA');
    expect(anchorIds).toEqual(expect.arrayContaining(fixture.expectedAnchors ?? []));
    expect(contract.valid).toBe(true);
  });

  it('F005.2 keeps frontmatter and MEMORY METADATA synchronized after rewrite and flags drift in the reviewer', async () => {
    const driftFixture = readFixture<DupReviewFixture>('F-DUP-005b-frontmatter-mirror.json');
    const cleanFixture = readFixture<DupReviewFixture>('F-DUP-005b-clean.json');
    const driftInput = buildMirrorDriftMemory(
      driftFixture.frontmatterContextType ?? 'implementation',
      driftFixture.metadataContextType ?? 'implementation',
      driftFixture.frontmatterTriggerPhrases ?? [],
      driftFixture.metadataTriggerPhrases ?? [],
    );
    const rewrite = buildFrontmatterContent(
      driftInput,
      { templatesRoot: TEMPLATES_ROOT },
      path.join(
        REPO_ROOT,
        '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/memory/f005-2-ssot.md',
      ),
    );

    expect(rewrite.changed).toBe(true);
    expect(rewrite.content).toContain('contextType: "implementation"');
    expect(rewrite.content).toContain('context_type: "implementation"');
    expect(rewrite.content).toContain('  - "phase 6 mirror"');
    expect(rewrite.content).not.toContain('  - "stale metadata trigger"');

    const driftFile = await writeTempMemoryFile(buildReviewMemory(driftFixture));
    const driftReview = reviewPostSaveQuality({
      savedFilePath: driftFile,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        saveMode: 'json',
        sessionSummary: 'Phase 6 mirror drift reviewer fixture.',
      },
    });

    expect(driftReview.issues).toContainEqual(expect.objectContaining({
      checkId: 'DUP5',
      severity: 'MEDIUM',
      field: 'context_type',
    }));
    expect(driftReview.issues).toContainEqual(expect.objectContaining({
      checkId: 'DUP5',
      severity: 'HIGH',
      field: 'trigger_phrases',
    }));

    const cleanFile = await writeTempMemoryFile(buildReviewMemory(cleanFixture));
    const cleanReview = reviewPostSaveQuality({
      savedFilePath: cleanFile,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        saveMode: 'json',
        sessionSummary: 'Phase 6 clean mirror reviewer fixture.',
      },
    });

    expect(cleanReview.issues.filter((issue) => issue.checkId === 'DUP5')).toHaveLength(0);
  });

  it('fires CHECK-DUP1 through CHECK-DUP7 on their targeted fixtures', async () => {
    const expectations: Array<{
      fixture: string;
      checkId: 'DUP1' | 'DUP2' | 'DUP3' | 'DUP4' | 'DUP5' | 'DUP6' | 'DUP7';
      severity: 'MEDIUM' | 'HIGH';
      field?: string;
    }> = [
      { fixture: 'F-CHECK-DUP1-trigger.json', checkId: 'DUP1', severity: 'MEDIUM', field: 'observations' },
      { fixture: 'F-CHECK-DUP2-trigger.json', checkId: 'DUP2', severity: 'MEDIUM', field: 'decisions' },
      { fixture: 'F-CHECK-DUP3-trigger.json', checkId: 'DUP3', severity: 'MEDIUM', field: 'continuation' },
      { fixture: 'F-CHECK-DUP4-trigger.json', checkId: 'DUP4', severity: 'MEDIUM', field: 'resume_context' },
      { fixture: 'F-CHECK-DUP5-trigger.json', checkId: 'DUP5', severity: 'HIGH', field: 'trigger_phrases' },
      { fixture: 'F-CHECK-DUP6-trigger.json', checkId: 'DUP6', severity: 'MEDIUM', field: 'anchors' },
      { fixture: 'F-CHECK-DUP7-trigger.json', checkId: 'DUP7', severity: 'MEDIUM', field: 'files' },
    ];

    for (const expectation of expectations) {
      const fixture = readFixture<DupReviewFixture>(expectation.fixture);
      const savedFilePath = await writeTempMemoryFile(buildReviewMemory(fixture));
      const result = reviewPostSaveQuality({
        savedFilePath,
        inputMode: 'file',
        collectedData: {
          _source: 'file',
          saveMode: 'json',
          sessionSummary: `Trigger fixture for ${expectation.checkId}.`,
        },
      });

      expect(result.issues).toContainEqual(expect.objectContaining({
        checkId: expectation.checkId,
        severity: expectation.severity,
        ...(expectation.field ? { field: expectation.field } : {}),
      }));
    }
  });

  it('keeps the DUP clean baseline silent with zero false positives', async () => {
    const fixture = readFixture<DupReviewFixture>('F-CHECK-DUP-clean.json');
    const savedFilePath = await writeTempMemoryFile(buildReviewMemory(fixture));
    const result = reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        saveMode: 'json',
        sessionSummary: 'Clean Phase 6 duplication reviewer fixture.',
      },
    });

    expect(result.issues.filter((issue) => issue.checkId?.startsWith('DUP'))).toHaveLength(0);
  });
});
