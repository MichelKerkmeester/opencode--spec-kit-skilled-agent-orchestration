## TARGET AUTHORITY
Approved spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default
Do not write to any other folder.

---

# Deep-Review v3 Iteration 3 of 5 — VERIFICATION SWEEP

## STATE

Iteration: 3 of 5
Mode: review (RUN 3 — VERIFICATION SWEEP on FIX-009-v2 commit `03d873276`)
Dimension: security
Prior Findings (this run): P0=0 P1=0 P2=0
Last 2 ratios: 0.000 -> 0.500
Provisional Verdict: PASS-PROVISIONAL

## CONTEXT — RUN 1 + V1 FIX + RUN 2 + V2 FIX

This is the THIRD review pass on the 009 packet. Both prior runs found issues
that have been remediated. This run is a VERIFICATION SWEEP — the IDEAL outcome
is **0 findings** (PASS verdict), confirming FIX-009-v2 holds.

### Closed findings (do NOT re-flag unless evidence of regression)

**Run 1 → fixed in FIX-009 (commit 79e97aec9):**
- R1-P1-001 (correctness): `includeSkills:false` precedence over env
- R3-P1-001 (security): symlink rootDir bypass
- 4 P2s (resource-map drift, abs path in invalid-root errors)

**Run 2 → fixed in FIX-009-v2 (commit 03d873276 — THIS run's verification target):**
- R2-I7-P0-001 (security): `data.errors` abs path leak → `relativizeScanError()` at scan.ts:196-198, applied at scan.ts:296,301,340
- R2-I9-P1-001 (correctness): status payload didn't reflect per-call → `parseIndexScopePolicyFromFingerprint()` at status.ts:174
- R2-I5-P1-001 (correctness): missing 6-case precedence matrix → describe.each in code-graph-indexer.vitest.ts
- R2-I4-P1-001 (maintainability): env isolation in tests → capture+restore in 3 files
- 3 P2s (literal centralization, lib README, ADR-001 6th sub-decision)

## TASK

You are running iteration 3 of a 5-iteration RUN-3 verification sweep.
Your dimension this iter: **security**.

## REVIEW SCOPE FILES (in-scope)

- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md

## DIMENSION FOCUS — SECURITY (iter 3)

Iter 3 — security on `relativizeScanError()` regex (scan.ts:196-198):
```ts
function relativizeScanError(error: string, workspaceRoot: string): string {
  return error.replace(/\/[^\s'"\`{}\[\],)]+/g, match => relativize(match, workspaceRoot));
}
```
Look for:
- ReDoS (catastrophic backtracking): the regex has `/[^...]+/g` — bounded greedy. Should be safe but verify with adversarial inputs (long string, all matching chars, mixed quotes)
- Injection: could an attacker craft an error string that escapes the regex and exposes paths in the relativize() fallback? E.g., paths with embedded newlines, NULL bytes
- Bypass: what if the path contains characters in the exclusion class (`\s'"\`{}\[\],)`)? The path would terminate early, leaving the suffix in plaintext — does that leak partial path? E.g., `/Users/foo/file with spaces.ts` → regex matches `/Users/foo/file`, leaves ` with spaces.ts` in clear
- Round-trip: does the relativize() helper handle the partial match case correctly (basename fallback)?
- relativize() unit tests: are there explicit test cases for paths with whitespace, quotes, brackets?

## SHARED DOCTRINE

Severity calls per the standard P0/P1/P2 rubric:
- **P0** (Blocker): incorrect behavior in default flow / security flaw / data loss / contract break
- **P1** (Required): correctness gap on edge case / silent failure / missing required test / migration footgun
- **P2** (Suggestion): style / clarity / minor doc gap / non-blocking

## REGRESSION SEMANTICS

If you find evidence that ANY closed finding has REGRESSED (the fix didn't work, or introduced a
new variant of the same bug), flag as **P0** with explicit "REGRESSION: <ID>" prefix.

If you find a NEW issue not previously flagged, treat it per standard severity rubric.

## QUALITY GATES

Every P0/P1 finding MUST include:
- claim, evidenceRefs (file:line array), counterevidenceSought, alternativeExplanation,
  finalSeverity, confidence, downgradeTrigger.

## CONSTRAINTS

- LEAF agent. No sub-agents.
- Target 9 tool calls. Hard max 13.
- Write findings to files. Don't hold in context.
- Review target is READ-ONLY.
- Skip prose-style nitpicks. Focus on substance.
- **IDEAL OUTCOME**: PASS verdict with 0 findings. If you find nothing, say so explicitly with confidence rating.

## OUTPUT CONTRACT — REQUIRED (3 artifacts)

### 1. Iteration narrative markdown

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-003.md`

Structure:
- ## Dimension: security
- ## Files Reviewed (path:line list)
- ## Findings by Severity (P0/P1/P2 sections — say "None." if empty)
- ## Closed-Finding Regression Check (state which run-1 + run-2 closed findings you re-verified, with PASS/FAIL)
- ## Verdict — PASS / CONDITIONAL / FAIL with one-line reason
- ## Confidence — 0.0-1.0 with one-line justification

### 2. State-log JSONL append

Append ONE line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-003","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":[<arr>],"findingsCount":<int>,"findingsSummary":{"P0":<int>,"P1":<int>,"P2":<int>},"findingsNew":[<arr>],"newFindingsRatio":<float>,"sessionId":"2026-05-02T15:03:06.606Z","generation":3,"lineageMode":"restart","timestamp":"<ISO>","durationMs":<int>}
```

`type` MUST be `"iteration"` exactly.

### 3. Per-iteration delta file

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deltas/iter-003.jsonl`

One line per record. First line: same iteration record.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl
- Findings registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md
- Prior iterations dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations
- Run-2 archive (for cross-reference): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review_archive/run-002-v2-conditional-20260502T150011Z/
- Run-1 archive: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review_archive/run-001-converged-at-6-20260502T132458Z/
