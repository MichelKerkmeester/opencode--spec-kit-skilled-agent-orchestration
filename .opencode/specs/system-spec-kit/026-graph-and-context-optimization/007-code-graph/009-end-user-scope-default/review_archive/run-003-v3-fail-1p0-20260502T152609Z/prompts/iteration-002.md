## TARGET AUTHORITY
Approved spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default
Do not write to any other folder.

---

# Deep-Review v3 Iteration 2 of 5 — VERIFICATION SWEEP

## STATE

Iteration: 2 of 5
Mode: review (RUN 3 — VERIFICATION SWEEP on FIX-009-v2 commit `03d873276`)
Dimension: correctness
Prior Findings (this run): P0=0 P1=0 P2=0
Last 2 ratios: N/A -> 0.000
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

You are running iteration 2 of a 5-iteration RUN-3 verification sweep.
Your dimension this iter: **correctness**.

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

## DIMENSION FOCUS — CORRECTNESS (iter 2)

Iter 2 — REGRESSION on R2-I4-P1-001 + new helper edge cases:
- **R2-I4-P1-001 (env isolation)**: scan all test files in `mcp_server/code_graph/tests/` and `mcp_server/tests/` for any remaining `process.env.SPECKIT_CODE_GRAPH_INDEX_SKILLS = ...` without proper cleanup.
- New helper edge cases:
  - `parseIndexScopePolicyFromFingerprint()`: what happens if fingerprint is malformed (not v1 format), null, empty string, contains unexpected separator? Roundtrip: build a policy → fingerprint → parse back → policy. Same?
  - `relativizeScanError()`: what if the input has multiple absolute paths separated by colons, commas, or special chars? Does the regex `/\/[^\s'"\`{}\[\],)]+/g` correctly isolate paths without grabbing surrounding error message text?

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

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-002.md`

Structure:
- ## Dimension: correctness
- ## Files Reviewed (path:line list)
- ## Findings by Severity (P0/P1/P2 sections — say "None." if empty)
- ## Closed-Finding Regression Check (state which run-1 + run-2 closed findings you re-verified, with PASS/FAIL)
- ## Verdict — PASS / CONDITIONAL / FAIL with one-line reason
- ## Confidence — 0.0-1.0 with one-line justification

### 2. State-log JSONL append

Append ONE line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":2,"mode":"review","run":"run-002","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":[<arr>],"findingsCount":<int>,"findingsSummary":{"P0":<int>,"P1":<int>,"P2":<int>},"findingsNew":[<arr>],"newFindingsRatio":<float>,"sessionId":"2026-05-02T15:03:06.606Z","generation":3,"lineageMode":"restart","timestamp":"<ISO>","durationMs":<int>}
```

`type` MUST be `"iteration"` exactly.

### 3. Per-iteration delta file

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deltas/iter-002.jsonl`

One line per record. First line: same iteration record.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl
- Findings registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md
- Prior iterations dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations
- Run-2 archive (for cross-reference): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review_archive/run-002-v2-conditional-20260502T150011Z/
- Run-1 archive: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review_archive/run-001-converged-at-6-20260502T132458Z/
