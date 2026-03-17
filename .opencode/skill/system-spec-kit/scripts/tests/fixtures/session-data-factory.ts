// ───────────────────────────────────────────────────────────────
// MODULE: Session Data Factory
// ───────────────────────────────────────────────────────────────
// Shared SessionData fixture builders for E2E and integration tests.
// Provides a complete, type-safe default that individual tests can
// override via Partial<SessionData> spreads.

import type { SessionData } from '../../types/session-types';

/* ───────────────────────────────────────────────────────────────
   1. DEFAULTS
──────────────────────────────────────────────────────────────── */

const DEFAULT_SESSION_DATA: SessionData = {
  TITLE: 'Workflow Integration Testing Coverage',
  DATE: '16-03-26',
  TIME: '10-30',
  SPEC_FOLDER: '',
  DURATION: '18m',
  SUMMARY: 'Validated the real workflow save pipeline with temp-repo isolation, deduplication checks, and resilient indexing behavior.',
  FILES: [
    {
      FILE_PATH: 'scripts/core/workflow.ts',
      DESCRIPTION: 'Verified the real save pipeline writes markdown before updating description.json and attempting semantic indexing.',
      ACTION: 'Modified',
    },
    {
      FILE_PATH: 'scripts/tests/workflow-e2e.vitest.ts',
      DESCRIPTION: 'Added a temp-repo harness with explicit JSON loading and real filesystem assertions for the save pipeline.',
      ACTION: 'Created',
    },
  ],
  HAS_FILES: true,
  FILE_COUNT: 2,
  OUTCOMES: [
    { OUTCOME: 'The integration testing harness now verifies real workflow side effects.', TYPE: 'status' },
    { OUTCOME: 'Duplicate saves no longer create extra markdown files or sequence increments.', TYPE: 'verification' },
  ],
  TOOL_COUNT: 4,
  MESSAGE_COUNT: 3,
  QUICK_SUMMARY: 'Workflow save pipeline integration coverage',
  SKILL_VERSION: '1.7.2',
  OBSERVATIONS: [
    {
      OBSERVATION: 'Confirmed the save path stays real from template render through file writing and description tracking.',
      CATEGORY: 'Implementation',
    },
    {
      OBSERVATION: 'Verified duplicate content skips the markdown write and leaves bookkeeping unchanged.',
      CATEGORY: 'Validation',
    },
  ],
  HAS_OBSERVATIONS: true,
  SPEC_FILES: [],
  HAS_SPEC_FILES: false,
  SESSION_ID: 'session-workflow-e2e',
  CHANNEL: 'test',
  IMPORTANCE_TIER: 'normal',
  CONTEXT_TYPE: 'implementation',
  CREATED_AT_EPOCH: 1_773_919_200,
  LAST_ACCESSED_EPOCH: 1_773_919_920,
  EXPIRES_AT_EPOCH: 1_781_695_920,
  TOOL_COUNTS: { Read: 2, Write: 0, Edit: 1, Bash: 1, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
  DECISION_COUNT: 2,
  ACCESS_COUNT: 1,
  LAST_SEARCH_QUERY: '',
  RELEVANCE_BOOST: 1,
  PROJECT_PHASE: 'IMPLEMENTATION',
  ACTIVE_FILE: 'scripts/tests/workflow-e2e.vitest.ts',
  LAST_ACTION: 'Ran the real save pipeline against isolated temp fixtures.',
  NEXT_ACTION: 'Keep the integration suite aligned with future workflow changes.',
  BLOCKERS: 'None',
  FILE_PROGRESS: [
    { FILE_NAME: 'scripts/tests/workflow-e2e.vitest.ts', FILE_STATUS: 'VERIFIED' },
    { FILE_NAME: 'scripts/tests/test-integration.vitest.ts', FILE_STATUS: 'READY' },
  ],
  HAS_FILE_PROGRESS: true,
  HAS_IMPLEMENTATION_GUIDE: false,
  TOPIC: '',
  IMPLEMENTATIONS: [],
  IMPL_KEY_FILES: [],
  EXTENSION_GUIDES: [],
  PATTERNS: [],
  HAS_PREFLIGHT_BASELINE: false,
  PREFLIGHT_KNOW_SCORE: null,
  PREFLIGHT_CONTEXT_SCORE: null,
  PREFLIGHT_UNCERTAINTY_SCORE: null,
  PREFLIGHT_KNOW_ASSESSMENT: '',
  PREFLIGHT_UNCERTAINTY_ASSESSMENT: '',
  PREFLIGHT_CONTEXT_ASSESSMENT: '',
  PREFLIGHT_TIMESTAMP: null,
  PREFLIGHT_GAPS: [],
  PREFLIGHT_CONFIDENCE: null,
  PREFLIGHT_UNCERTAINTY_RAW: null,
  PREFLIGHT_READINESS: null,
  HAS_POSTFLIGHT_DELTA: false,
  POSTFLIGHT_KNOW_SCORE: null,
  POSTFLIGHT_CONTEXT_SCORE: null,
  POSTFLIGHT_UNCERTAINTY_SCORE: null,
  DELTA_KNOW_SCORE: null,
  DELTA_CONTEXT_SCORE: null,
  DELTA_UNCERTAINTY_SCORE: null,
  DELTA_KNOW_TREND: '\u2192',
  DELTA_CONTEXT_TREND: '\u2192',
  DELTA_UNCERTAINTY_TREND: '\u2192',
  LEARNING_INDEX: null,
  LEARNING_SUMMARY: 'The workflow integration suite protects the real save path without relying on flaky collector heuristics.',
  GAPS_CLOSED: [],
  NEW_GAPS: [],
  SESSION_STATUS: 'Ready for follow-up',
  COMPLETION_PERCENT: 100,
  LAST_ACTIVITY_TIMESTAMP: '2026-03-16T10:30:00.000Z',
  SESSION_DURATION: '18m',
  CONTINUATION_COUNT: 0,
  CONTEXT_SUMMARY: 'This run exercises the real workflow write path inside an isolated temp repository.',
  PENDING_TASKS: [],
  NEXT_CONTINUATION_COUNT: 1,
  RESUME_CONTEXT: [
    { CONTEXT_ITEM: 'Re-run the workflow save suite when memory tracking or indexing behavior changes.' },
  ],
  SOURCE_TRANSCRIPT_PATH: '',
  SOURCE_SESSION_ID: '',
  SOURCE_SESSION_CREATED: 0,
  SOURCE_SESSION_UPDATED: 0,
  HEAD_REF: null,
  COMMIT_REF: null,
  REPOSITORY_STATE: 'unavailable',
  IS_DETACHED_HEAD: false,
};

/* ───────────────────────────────────────────────────────────────
   2. BUILDERS
──────────────────────────────────────────────────────────────── */

function buildRichSessionData(specFolderName: string, overrides: Partial<SessionData> = {}): SessionData {
  return {
    ...DEFAULT_SESSION_DATA,
    SPEC_FOLDER: specFolderName,
    ...overrides,
  };
}

function buildSparseSessionData(specFolderName: string): SessionData {
  return buildRichSessionData(specFolderName, {
    TITLE: 'Workflow Integration Testing Sufficiency Probe',
    SUMMARY: 'Captured only scaffolding for an insufficiency guard verification.',
    FILES: [],
    HAS_FILES: false,
    FILE_COUNT: 0,
    OUTCOMES: [],
    TOOL_COUNT: 0,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'Insufficiency abort verification',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    DECISION_COUNT: 0,
    LAST_ACTION: 'Prepared a sparse session to verify the sufficiency abort path.',
    NEXT_ACTION: '',
    BLOCKERS: '',
    FILE_PROGRESS: [],
    HAS_FILE_PROGRESS: false,
    CONTEXT_SUMMARY: 'Sparse insufficiency probe.',
    RESUME_CONTEXT: [],
  });
}

function buildTreeThinningSessionData(specFolderName: string): SessionData {
  return buildRichSessionData(specFolderName, {
    SUMMARY: 'Verified tree thinning merges several small sibling file descriptions into the rendered workflow memory while preserving save bookkeeping.',
    FILES: [
      {
        FILE_PATH: 'scripts/tests/workflow-e2e.vitest.ts',
        DESCRIPTION: 'Added the temp-repo workflow harness.',
        ACTION: 'Created',
      },
      {
        FILE_PATH: 'scripts/tests/test-integration.vitest.ts',
        DESCRIPTION: 'Ported the legacy integration runner.',
        ACTION: 'Created',
      },
      {
        FILE_PATH: 'scripts/tests/workflow-fixture-notes.md',
        DESCRIPTION: 'Documented workflow fixture expectations.',
        ACTION: 'Modified',
      },
    ],
    FILE_COUNT: 3,
    OUTCOMES: [
      { OUTCOME: 'Tree thinning merge notes now appear in the saved markdown for clustered small files.', TYPE: 'verification' },
    ],
  });
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  buildRichSessionData,
  buildSparseSessionData,
  buildTreeThinningSessionData,
};
