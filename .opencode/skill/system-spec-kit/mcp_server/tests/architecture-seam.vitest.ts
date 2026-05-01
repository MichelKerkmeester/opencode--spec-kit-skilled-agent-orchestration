// ───────────────────────────────────────────────────────────────
// MODULE: Architecture Seam Verification (Phase 049-006)
// ───────────────────────────────────────────────────────────────
// Verifies the boundary-discipline seams introduced by sub-phase 006:
// every neutral utility is importable from its new location AND from the
// original implementation site, and the resolved references are
// reference-identical so callers cannot accidentally diverge.

import { describe, expect, it } from 'vitest';

// F-016-D1-01: SQLite integrity neutral seam.
import { checkSqliteIntegrity as checkSqliteIntegrityFromSeam } from '../lib/utils/sqlite-integrity.js';
import { checkSqliteIntegrity as checkSqliteIntegrityFromImpl } from '../skill_advisor/lib/freshness/sqlite-integrity.js';

// F-016-D1-02: skill-label-sanitizer neutral seam.
import { sanitizeSkillLabel as sanitizeSkillLabelFromSeam } from '../lib/utils/skill-label-sanitizer.js';
import { sanitizeSkillLabel as sanitizeSkillLabelFromImpl } from '../skill_advisor/lib/render.js';

// F-016-D1-03: spec-document-finder lib seam.
import { findSpecDocuments as findSpecDocumentsFromSeam } from '../lib/discovery/spec-document-finder.js';
import { findSpecDocuments as findSpecDocumentsFromImpl } from '../handlers/memory-index-discovery.js';

// F-016-D1-04: advisor-status-reader lib seam.
import { readAdvisorStatus as readAdvisorStatusFromSeam } from '../skill_advisor/lib/compat/advisor-status-reader.js';
import { readAdvisorStatus as readAdvisorStatusFromImpl } from '../skill_advisor/handlers/advisor-status.js';

// F-016-D1-05: busy-retry neutral seam.
import { runWithBusyRetry as runWithBusyRetryFromSeam } from '../skill_advisor/lib/utils/busy-retry.js';
import { runWithBusyRetry as runWithBusyRetryFromImpl } from '../skill_advisor/lib/daemon/watcher.js';

// F-016-D1-07: scorer age-policy seam.
import { applyAgeHaircutToLane as applyAgeHaircutFromSeam } from '../skill_advisor/lib/scorer/age-policy.js';
import { applyAgeHaircutToLane as applyAgeHaircutFromImpl } from '../skill_advisor/lib/lifecycle/age-haircut.js';

// F-018-D3-01: trust-state canonical tuple.
import {
  SKILL_GRAPH_TRUST_STATE_VALUES,
  isSkillGraphTrustState,
} from '../skill_advisor/lib/freshness/trust-state-values.js';
import {
  SKILL_GRAPH_TRUST_STATE_VALUES as TRUST_STATE_VALUES_REEXPORT,
  isSkillGraphTrustState as isSkillGraphTrustStateReexport,
} from '../skill_advisor/lib/freshness/trust-state.js';

// F-018-D3-02: lifecycle status canonical tuple.
import {
  SKILL_LIFECYCLE_STATUS_VALUES,
  isSkillLifecycleStatus,
} from '../skill_advisor/lib/lifecycle/status-values.js';
import {
  SKILL_LIFECYCLE_STATUS_VALUES as LIFECYCLE_VALUES_REEXPORT,
  isSkillLifecycleStatus as isSkillLifecycleStatusReexport,
} from '../skill_advisor/lib/scorer/types.js';

// F-018-D3-03: advisor runtime canonical tuple.
import {
  ADVISOR_RUNTIME_VALUES,
  isAdvisorRuntime,
} from '../skill_advisor/lib/advisor-runtime-values.js';
import {
  ADVISOR_RUNTIME_VALUES as ADVISOR_RUNTIME_REEXPORT,
} from '../skill_advisor/lib/skill-advisor-brief.js';

// F-018-D3-04 (partial): advisor contract keys.
import {
  ADVISOR_RECOMMEND_PARAMETER_KEYS,
  ADVISOR_VALIDATE_PARAMETER_KEYS,
} from '../skill_advisor/tools/advisor-contract-keys.js';

describe('F-016-D1: boundary discipline seams', () => {
  it('F-016-D1-01: checkSqliteIntegrity is reference-identical from both paths', () => {
    expect(checkSqliteIntegrityFromSeam).toBe(checkSqliteIntegrityFromImpl);
  });

  it('F-016-D1-02: sanitizeSkillLabel is reference-identical from both paths', () => {
    expect(sanitizeSkillLabelFromSeam).toBe(sanitizeSkillLabelFromImpl);
  });

  it('F-016-D1-03: findSpecDocuments is reference-identical from both paths', () => {
    expect(findSpecDocumentsFromSeam).toBe(findSpecDocumentsFromImpl);
  });

  it('F-016-D1-04: readAdvisorStatus is reference-identical from both paths', () => {
    expect(readAdvisorStatusFromSeam).toBe(readAdvisorStatusFromImpl);
  });

  it('F-016-D1-05: runWithBusyRetry is reference-identical from both paths', () => {
    expect(runWithBusyRetryFromSeam).toBe(runWithBusyRetryFromImpl);
  });

  it('F-016-D1-07: applyAgeHaircutToLane is reference-identical from both paths', () => {
    expect(applyAgeHaircutFromSeam).toBe(applyAgeHaircutFromImpl);
  });
});

describe('F-018-D3: schema duplication tuples', () => {
  it('F-018-D3-01: SKILL_GRAPH_TRUST_STATE_VALUES is the canonical tuple', () => {
    expect(SKILL_GRAPH_TRUST_STATE_VALUES).toEqual(['live', 'stale', 'absent', 'unavailable']);
    expect(TRUST_STATE_VALUES_REEXPORT).toBe(SKILL_GRAPH_TRUST_STATE_VALUES);
    expect(isSkillGraphTrustStateReexport).toBe(isSkillGraphTrustState);
  });

  it('F-018-D3-01: trust-state guard rejects invalid values', () => {
    expect(isSkillGraphTrustState('live')).toBe(true);
    expect(isSkillGraphTrustState('absent')).toBe(true);
    expect(isSkillGraphTrustState('bogus')).toBe(false);
    expect(isSkillGraphTrustState(undefined)).toBe(false);
  });

  it('F-018-D3-02: SKILL_LIFECYCLE_STATUS_VALUES is the canonical tuple', () => {
    expect(SKILL_LIFECYCLE_STATUS_VALUES).toEqual(['active', 'deprecated', 'archived', 'future']);
    expect(LIFECYCLE_VALUES_REEXPORT).toBe(SKILL_LIFECYCLE_STATUS_VALUES);
    expect(isSkillLifecycleStatusReexport).toBe(isSkillLifecycleStatus);
  });

  it('F-018-D3-03: ADVISOR_RUNTIME_VALUES is the canonical tuple', () => {
    expect(ADVISOR_RUNTIME_VALUES).toEqual(['claude', 'gemini', 'copilot', 'codex']);
    expect(ADVISOR_RUNTIME_REEXPORT).toBe(ADVISOR_RUNTIME_VALUES);
    expect(isAdvisorRuntime('claude')).toBe(true);
    expect(isAdvisorRuntime('mystery-runtime')).toBe(false);
  });

  it('F-018-D3-04 (partial): advisor contract keys tuples are stable', () => {
    expect(ADVISOR_RECOMMEND_PARAMETER_KEYS).toEqual(['prompt', 'options']);
    expect(ADVISOR_VALIDATE_PARAMETER_KEYS).toEqual(['confirmHeavyRun', 'skillSlug']);
  });
});
