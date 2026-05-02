# Iteration 003 — C3 Integration Verifier: Test Coverage Gap Analysis

## Existing Test Coverage
- `runtime-memory-inputs.vitest.ts`: data-file load, snake_case, native capture, FILES normalization, next-steps, observation truncation
- `stateless-enrichment.vitest.ts`: spec-relevance filtering, git context (clean/unavailable/unborn-head/detached-head)
- `task-enrichment.vitest.ts`: file-backed naming, contamination, quality gating, alignment, sufficiency, state isolation

**Critical gap**: No tests use nested `session: {}` or `git: {}` JSON payloads. No direct assertions for `enrichFileSourceData()` merge behavior.

## Top 10 Missing Test Scenarios

### 1. Manual JSON path drops entire `session` block [CRITICAL]
- Input: sessionSummary + nextSteps + full session block
- Expected: session metadata preserved
- Actual: manual normalization rebuilds without copying session

### 2. Manual JSON path drops entire `git` block [CRITICAL]
- Input: sessionSummary + full git block
- Expected: git metadata in output
- Actual: manual normalization drops git

### 3. File-backed enrichment mutates caller's original FILES [CRITICAL]
- Input: _source: 'file' with short-description FILES
- Expected: original input unchanged after enrichment
- Actual: shallow copy mutation affects original

### 4. status=COMPLETED + completionPercent=20 contradiction [HIGH]
- Expected: reject or coerce to consistent state
- Actual: both emitted unchanged

### 5. status=BLOCKED + blockers='None' contradiction [HIGH]
- Expected: reject or normalize
- Actual: both emitted unchanged

### 6. Nested session fields barely validated [HIGH]
- Input: status='done', messageCount='42', completionPercent=200
- Expected: validation error
- Actual: passes validation, silently ignored/partially applied

### 7. Nested git fields barely validated [HIGH]
- Input: headRef=7, repositoryState='broken', isDetachedHead='yes'
- Expected: validation failure
- Actual: passes, collector falls back to defaults

### 8. Empty-string git fields clobber enrichment [HIGH]
- Input: git: { headRef: '', commitRef: '' } + mocked real git context
- Expected: blank treated as absent, real git wins
- Actual: ?? lets empty string override

### 9. Explicit zero metrics ignored [MEDIUM]
- Input: session: { messageCount: 0, toolCount: 0 }
- Expected: zeros preserved
- Actual: only > 0 honored, heuristic recomputes

### 10. Empty-string session fields inconsistent [MEDIUM]
- Input: lastAction='', nextAction='', duration='', blockers=''
- Expected: consistent policy
- Actual: blockers='' overrides, others fall back (inconsistent)
