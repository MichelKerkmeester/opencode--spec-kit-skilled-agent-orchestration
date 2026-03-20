# Research: JSON Mode Hybrid Enrichment (Phase 1B) — Improvements, Edge Cases, and Gaps

**Research Method**: Deep research loop with 3 GPT-5.4 copilot agents per iteration (Code Auditor, Type Analyst, Integration Verifier)
**Iterations**: 3 (converged at iteration 3; max was 6)
**Date**: 2026-03-20
**Spec Folder**: `016-json-mode-hybrid-enrichment`

---

## Executive Summary

Phase 1B implementation is architecturally sound — the V8 safety guard correctly prevents observation/FILES injection from git/spec extractors into file-backed JSON payloads. However, the research uncovered **21 unique findings** across 4 domains, with **3 critical**, **8 high**, **7 medium**, and **3 low** severity issues. The most impactful gaps are: (1) shallow copy mutation leaking to callers, (2) contradictory status/percent states preserved without reconciliation, (3) zero test coverage for the entire `session`/`git` JSON contract, and (4) `git.repositoryState` values propagating without validation.

---

## Findings by Question

### Q1: V8 Safety — Observation Leak Paths

**Status**: No direct contamination path exists. The explicit skip guard at `workflow.ts:1185` correctly prevents `gitContext.observations` and `gitContext.FILES` from being merged into file-backed payloads.

| Finding | Severity | Location |
|---------|----------|----------|
| Git/spec observation skip guard intact | LOW | `workflow.ts:1178-1206` |
| `enrichStatelessData()` is the real bypass path if `_source` classification slips | MEDIUM | `workflow.ts:1238-1325` |

**Recommendation**: Codify the skip guard with regression tests. Consider an explicit "structured-authoritative payload" guard at the workflow boundary rather than relying solely on `_source`.

---

### Q2: File Description Enhancement — Injection and Shallow Copy

**Status**: Enhancement is update-only — cannot inject new file entries. But the shallow copy at `workflow.ts:1161` shares nested FILE object references, causing in-place mutations that leak to callers.

| Finding | Severity | Location |
|---------|----------|----------|
| Enhancement cannot add new FILES (lookup-only from gitFileMap) | LOW | `workflow.ts:1210-1224` |
| Shallow copy `{ ...collectedData }` shares nested FILE objects | **CRITICAL** | `workflow.ts:1161,1214-1222` |
| `_provenance = 'git'` materially changes quality scoring (trust multiplier 1.0 vs 0.3) and file-count reporting | HIGH | `quality-scorer.ts:106-125`, `collect-session-data.ts:764-777` |
| `< 20` threshold misaligned with shared description validator tiers | HIGH | `workflow.ts:1217`, `file-helpers.ts:121-146` |
| `FILE_PATH \|\| path` precedence with case-insensitive lowercasing can collapse distinct paths | MEDIUM | `workflow.ts:1215` |
| Mutation leaks via `preloadedData` reference — contamination cleaning happens after mutation | **CRITICAL** | `workflow.ts:1395-1397,1622-1633` |

**Fix** (minimal):
```typescript
const enriched: CollectedDataFull = {
  ...collectedData,
  FILES: collectedData.FILES?.map(f => ({ ...f }))
};
```

**Additional**: Gate description replacement on `validateDescription(desc).tier` (replace `placeholder`/`activity-only` only), not raw `length < 20`.

---

### Q3: Type Safety — `as Record<string, unknown>` Casts

**Status**: All 13 casts in scope are unnecessary. `CollectedDataBase` already declares typed `session?: SessionMetadata` and `git?: GitMetadata`. `CollectedDataFull extends CollectedDataBase`, so all session/git fields are directly accessible.

| Location | Count | Most Dangerous |
|----------|-------|----------------|
| `collect-session-data.ts` | 11 | Lines 350, 404, 730, 732 — session/git access |
| `workflow.ts` | 2 | Line 1180 — double-cast on git fields lets malformed values bypass type checking |

**Fix**: Replace all `(data as Record<string, unknown>).session` with `data.session`, all `(data as Record<string, unknown>).git` with `data.git`, etc. Direct typed access catches field renames and contract tightening at compile time.

---

### Q4: Validation Depth — Input Boundary Gaps

**Status**: `validateInputData()` only checks that `session` and `git` are objects. No inner field types, enums, or ranges are validated. Consumer-side guards exist but use silent fallback, hiding producer bugs.

| Field | Needs Boundary Validation? | Current Consumer Guard | Gap |
|-------|---------------------------|----------------------|-----|
| `session.status` | **Yes** — closed enum | Enum check in `determineSessionStatus()` | Silent ignore of invalid values |
| `session.completionPercent` | **Yes** — closed range 0-100 | Finite + range check | Silent ignore |
| `session.messageCount` | **Yes** — integer semantics | `typeof number && > 0` | Floats accepted (28.5) |
| `session.toolCount` | **Yes** — integer semantics | `typeof number && > 0` | Same as messageCount |
| `git.repositoryState` | **Yes** — closed enum (highest priority) | **None** — any non-empty string propagates | Invalid values reach output |
| `git.isDetachedHead` | **Yes** — boolean | `typeof boolean` | String `'false'` discarded silently |
| Open-text fields (sessionId, nextAction, lastAction, duration, blockers, headRef, commitRef) | No | Consumer-side guards sufficient | Low risk |

**Fix**: Add boundary validation in `validateInputData()` for the 6 closed-domain fields. `git.repositoryState` is highest priority because invalid values currently propagate to output unchanged.

---

### Q5: Priority Override Consistency — Status/Percent Conflicts

**Status**: `determineSessionStatus()` and `estimateCompletionPercent()` have independent Priority 1 override chains. Contradictions are preserved, not reconciled.

| Scenario | Resulting STATUS | Resulting PERCENT | Consistent? |
|----------|-----------------|-------------------|-------------|
| `status=COMPLETED`, `completionPercent=30` | COMPLETED | 30 | **No** |
| `status=BLOCKED`, `completionPercent=100` | BLOCKED | 100 | **No** (impossible state) |
| `status=IN_PROGRESS`, heuristic=COMPLETED | IN_PROGRESS | 95 (if file+summary) | **No** |
| unset, file+summary (no keyDecisions) | IN_PROGRESS | 95 | **No** (threshold misaligned) |

**Root cause**: `estimateCompletionPercent()` returns explicit `completionPercent` at lines 406-409 BEFORE checking `sessionStatus === 'COMPLETED'` at line 412.

**Fix**: Add a reconciliation step in `buildContinueSessionData()` after both values are computed:
- `COMPLETED` implies `percent >= 90` (coerce if lower)
- `BLOCKED` implies `percent < 100` (cap)
- Align heuristic thresholds: status and percent should use same completion criteria

---

### Q6: Field Wiring Gaps — Session Metadata Pipeline

**Status**: All 9 `SessionMetadata` fields are consumed. But several have "display-only" overrides that don't affect status/completion heuristics, and the manual-normalized path drops `session`/`git` entirely.

| Gap | Severity | Detail |
|-----|----------|--------|
| Manual-normalized path drops session/git blocks | **CRITICAL** | `normalizeInputData()` manual path rebuilds object without copying session/git |
| `messageCount`/`toolCount` only override display counts | MEDIUM | Status/percent heuristics still use `userPrompts.length` and heuristic `toolCounts` |
| `blockers` display diverges from status determination | MEDIUM | `BLOCKERS` uses explicit value; `determineSessionStatus` uses heuristic blockers |
| `nextAction` display-only override | LOW | `extractPendingTasks` uses heuristic nextAction, not explicit override |
| `sessionId` is provenance only (SOURCE_SESSION_ID) | LOW | SESSION_ID always generated fresh — expected behavior |

**Fix**: Ensure `normalizeInputData()` manual path preserves `session` and `git` blocks via spread. Consider propagating explicit `messageCount`/`blockers` to heuristic functions for consistency.

---

### Q7: Template Wiring Verification

**Status**: 9 fields verified end-to-end. `SessionData` reaches the Mustache template directly via `populateTemplate('context', sessionData)`. Two wiring issues found.

| Issue | Severity | Detail |
|-------|----------|--------|
| Empty-string git payloads clobber extractor fallback | MEDIUM | `??` doesn't catch empty strings. `headRef: ""` overrides auto-detected values |
| `IS_DETACHED_HEAD` renders as `Yes`/`No` not `true`/`false` | MEDIUM | Machine consumers may misread YAML field |

**Fix**: Use `\|\| gitContext.headRef` instead of `?? gitContext.headRef` (or a "first non-empty" helper) for git field coalescing. For boolean rendering, consider canonical `true`/`false` in YAML contexts.

---

### Q8: Test Coverage Gaps

**Status**: Zero tests use nested `session: {}` or `git: {}` JSON payloads. The entire Phase 1B override contract is untested end-to-end.

**Top 10 Missing Test Scenarios** (risk-ordered):

| # | Test | Risk | Covers |
|---|------|------|--------|
| 1 | Manual JSON path drops `session` block | CRITICAL | Q6: manual-path drops |
| 2 | Manual JSON path drops `git` block | CRITICAL | Q6: manual-path drops |
| 3 | File-backed enrichment mutates caller's FILES | CRITICAL | Q2: shallow copy |
| 4 | `status=COMPLETED` + `completionPercent=20` | HIGH | Q5: contradictions |
| 5 | `status=BLOCKED` + `blockers='None'` | HIGH | Q5: contradictions |
| 6 | Nested session fields barely validated (`status='done'`, `messageCount='42'`) | HIGH | Q4: validation |
| 7 | Nested git fields barely validated (`repositoryState='broken'`) | HIGH | Q4: validation |
| 8 | Empty-string git fields clobber enrichment | HIGH | Q7: empty string |
| 9 | Explicit zero metrics ignored (`messageCount=0`) | MEDIUM | Q6: partial overrides |
| 10 | Empty-string session fields inconsistent behavior | MEDIUM | Q7: empty string |

---

## Risk Assessment

### Critical (Fix Before Next Release)
1. **Shallow copy mutation** — `enrichFileSourceData()` mutates caller's original FILE objects in place. Minimal fix: clone FILES array before mutation.
2. **Manual-normalized path drops session/git** — JSON payloads with `sessionSummary`+`session`/`git` blocks lose explicit metadata. Fix: preserve blocks in manual path.
3. **Zero test coverage** for session/git contract — the entire Phase 1B priority override system is untested.

### High (Fix Soon)
4. **git.repositoryState propagates unvalidated** — invalid values reach output unchanged.
5. **Status/percent contradictions preserved** — `COMPLETED` + `30%` and `BLOCKED` + `100%` are emitted unchanged.
6. **13 unnecessary type casts** — `as Record<string, unknown>` defeats compile-time safety for all session/git access.
7. **Description threshold misaligned** — `< 20` gate doesn't match shared validator tiers.
8. **`_provenance = 'git'` changes quality scoring** — not cosmetic; affects trust multiplier and file-count reporting.

### Medium (Improve)
9. Empty-string git payloads clobber auto-detected values via `??`
10. `IS_DETACHED_HEAD` renders `Yes`/`No` not canonical `true`/`false`
11. `messageCount`/`toolCount` only override display, not heuristics
12. `blockers` display diverges from status determination
13. `enrichStatelessData()` bypass if `_source` classification slips
14. `FILE_PATH || path` precedence with case-insensitive collision

---

## Prioritized Improvement Recommendations

### Phase 1 (Immediate — bugfixes)
1. **Deep-clone FILES** in `enrichFileSourceData()`: `FILES: collectedData.FILES?.map(f => ({ ...f }))`
2. **Preserve session/git** in `normalizeInputData()` manual path
3. **Validate git.repositoryState** against `['clean', 'dirty', 'unavailable']` at input boundary

### Phase 2 (Soon — type safety + consistency)
4. **Remove all 13 `as Record<string, unknown>` casts** — use direct typed access
5. **Add status/percent reconciliation** in `buildContinueSessionData()`
6. **Add boundary validation** for `session.status`, `session.completionPercent`, `session.messageCount`, `session.toolCount`, `git.isDetachedHead`
7. **Use `||` instead of `??`** for git field coalescing (or "first non-empty" helper)

### Phase 3 (Next sprint — quality)
8. **Replace `< 20` threshold** with `validateDescription(desc).tier`-based gating
9. **Separate provenance tracking** from description-replacement provenance
10. **Add 10 test scenarios** from Q8 findings
11. **Propagate explicit counts** to heuristic functions for consistency

---

## Research Metadata

| Metric | Value |
|--------|-------|
| Iterations completed | 3 of 6 max |
| Convergence trigger | All 8/8 questions answered (entropy 1.00 >= 0.85) |
| Weighted convergence score | 0.75 > 0.60 threshold |
| newInfoRatio trend | 1.00 → 0.64 → 0.35 |
| Total unique findings | 21 |
| Agent model | GPT-5.4 (high reasoning effort) |
| Agent slots | C1 (Code Auditor), C2 (Type Analyst), C3 (Integration Verifier) |
| Files investigated | workflow.ts, collect-session-data.ts, session-types.ts, input-normalizer.ts, template-renderer.ts, context_template.md, file-extractor.ts, git-context-extractor.ts, spec-folder-extractor.ts, quality-scorer.ts, file-helpers.ts, data-loader.ts, + 4 test files |
