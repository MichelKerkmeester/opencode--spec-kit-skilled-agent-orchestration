# Deep Review Report: 027-opencode-structural-priming

## 1. Executive Summary

| Field | Value |
|-------|-------|
| Verdict | **PASS** |
| hasAdvisories | true |
| Active P0 | 0 |
| Active P1 | 0 (3 fixed) |
| Active P2 | 4 |
| Iterations | 4 (all 4 dimensions covered) |
| Scope | Structural bootstrap contract: session-snapshot.ts, memory-surface.ts, session-bootstrap/resume/health handlers, context-server.ts, context-prime.md, spec docs |
| Stop Reason | all_dimensions_covered |

## 2. Planning Trigger

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 2, "P2": 4 },
  "remediationWorkstreams": [
    "WS1: Traceability — checklist evidence + dedicated test file",
    "WS2: Correctness — session_resume duplicate hints (FIXED)"
  ]
}
```

## 3. Active Finding Registry

### Fixed During Review

| ID | Sev | Title | Fix |
|----|-----|-------|-----|
| P1-C01 | P1 | session_resume duplicate hints | Replaced old graph hints with structural contract deference |
| P1-T02 | P1 | No dedicated test for structural contract | Created tests/structural-contract.vitest.ts (5 tests, all passing) |

### Traceability (D3)

| ID | Sev | Title | Source | Status |
|----|-----|-------|--------|--------|
| P1-T01 | P1 | Checklist uses prose evidence, not [SOURCE: file:line] | checklist.md | **FIXED** — all 24 items upgraded to [SOURCE: path:line] |
| P2-T03 | P2 | implementation-summary.md cites Phase 026 test suite | implementation-summary.md | Active advisory |

### Correctness (D1)

| ID | Sev | Title | Source | Status |
|----|-----|-------|--------|--------|
| P2-C02 | P2 | 'error' mapped to 'missing' silently | session-snapshot.ts:152-154 | Advisory (by design) |

### Security (D2)

| ID | Sev | Title | Source | Status |
|----|-----|-------|--------|--------|
| P2-S01 | P2 | Summary exposes aggregate codebase metrics | session-snapshot.ts:162 | Advisory (acceptable) |

### Maintainability (D4)

| ID | Sev | Title | Source | Status |
|----|-----|-------|--------|--------|
| P2-M01 | P2 | Builder calls getGraphStats() twice for ready | session-snapshot.ts:145+161 | Advisory |

## 4. Remediation Workstreams

1. **P1-C01 [FIXED]:** Removed duplicate hints from session_resume
2. **P1-T02 [FIXED]:** Added structural-contract.vitest.ts with 5 tests
3. **P1-T01:** Upgrade checklist evidence to [SOURCE: file:line] format

## 5. Verification Evidence

- `npm run build` (system-spec-kit workspace): **PASS**
- `vitest run tests/structural-contract.vitest.ts`: **PASS** (5 tests)
- `vitest run tests/startup-brief.vitest.ts tests/hook-state.vitest.ts tests/structural-contract.vitest.ts`: **PASS** (20 tests)
- `validate.sh 027 --strict`: **PASS** (0 errors, 0 warnings)

## 6. Release Gate

Phase 027 is **PASS** with advisories — all P1 findings fixed (code + documentation). P2 items remain as advisories only.
