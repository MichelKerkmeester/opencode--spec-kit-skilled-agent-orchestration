## TARGET AUTHORITY
Approved spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default
Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.

---

# Deep-Review v2 Iteration 6 of 10

## STATE

Iteration: 6 of 10
Mode: review (RUN 2 — post-FIX-009 verification + maintainability coverage)
Dimension: security
Review Target: 009-end-user-scope-default implementation + FIX-009 remediation
Prior Findings (this run): P0=0 P1=2 P2=3
Dimension Coverage (this run): correctness, maintainability
Last 2 ratios: 1.000 -> 1.000
Provisional Verdict: CONDITIONAL
SessionId: 2026-05-02T14:00:34.910Z (gen 2, parent gen 1 sessionId 2026-05-02T12:34:30.068Z)

## CONTEXT — RUN 1 + FIX-009

Run 1 (6 iters, archived to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review_archive/run-001-converged-at-6-20260502T132458Z/`)
found 2 P1 + 4 P2 findings. ALL were remediated in commit `79e97aec9` (FIX-009).

Closed findings (do NOT re-flag unless you find evidence the FIX failed):
- R1-P1-001 (correctness): `includeSkills:false` precedence over env → fixed at `index-scope-policy.ts:34`
- R3-P1-001 (security): symlink rootDir bypass → fixed at `scan.ts:234` (canonicalRootDir flows to getDefaultConfig)
- R1-P2-001, R2-P2-001, R4-P2-002 (resource-map drift) → fixed: `<packet>/resource-map.md` §2 rewritten
- R4-P2-001 (abs path in errors) → fixed: `relativize()` helper at `scan.ts:227`

## TASK

You are running iteration 6 of a 10-iteration RUN-2 deep review.
Your dimension this iter: **security**.

## REVIEW SCOPE FILES (in-scope)

- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md

## SPEC DOCS (read for traceability ONLY — not in-scope for findings)

- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md

## DIMENSION FOCUS — SECURITY (iter 6)

Iter 6 — REGRESSION on R3-P1-001 (symlink fix). Verify:
- `canonicalRootDir = realpathSync(resolvedRootDir)` is called BEFORE `getDefaultConfig()`
- The walker descends from canonical path (so candidate paths contain real `.opencode/skill` segment)
- New test in code-graph-indexer.vitest.ts: symlink alias → real `.opencode/skill/example.ts` is NOT indexed by default
- Edge case: symlink loops (a → b → a) — does realpathSync handle gracefully?
- Edge case: symlink to file (not dir) — does the path canonicalization work?
- Edge case: rootDir = `/tmp/foo/.opencode/skill/bar` (canonical contains skill but root looks legit) → still excluded?

## SHARED DOCTRINE

Severity calls per the standard P0/P1/P2 rubric:
- **P0** (Blocker): incorrect behavior in default flow / security flaw / data loss / contract break
- **P1** (Required): correctness gap on edge case / silent failure / missing required test / migration footgun
- **P2** (Suggestion): style / clarity / minor doc gap / non-blocking maintainability concern

## RUN-1 CLOSED FINDINGS — REGRESSION SEMANTICS

If you find evidence that ANY of the run-1 closed findings has regressed (the fix didn't actually
work, or introduced a new variant of the same bug), flag it as **P0** with explicit "REGRESSION:
<original ID>" prefix in the title. Otherwise, do NOT mention closed findings.

## TRACEABILITY PROTOCOLS

- Core: spec_code (does code match spec/plan claims?), checklist_evidence (does CHK-G* claim hold?)
- Overlay: skill_agent (does this skill's behavior match its definition?), feature_catalog_code

## QUALITY GATES

Every P0/P1 finding MUST include:
- claim, evidenceRefs (file:line array), counterevidenceSought, alternativeExplanation,
  finalSeverity, confidence, downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY — do not modify any file outside the review/ packet.
- Skip prose-style nitpicks; focus on substance.

## OUTPUT CONTRACT — REQUIRED (3 artifacts)

### 1. Iteration narrative markdown

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-006.md`

Structure:
- ## Dimension: security
- ## Files Reviewed (path:line list)
- ## Findings by Severity (P0/P1/P2 sections)
- ## Traceability Checks
- ## Run-1 Regression Check (state which closed finding(s) you re-verified, with PASS/FAIL)
- ## Verdict — PASS / CONDITIONAL / FAIL with one-line reason
- ## Next Dimension

### 2. State-log JSONL append

Append ONE line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":6,"mode":"review","run":"run-006","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":[<arr-of-path:line>],"findingsCount":<int>,"findingsSummary":{"P0":<int>,"P1":<int>,"P2":<int>},"findingsNew":[<arr-of-id>],"traceabilityChecks":{<obj>},"newFindingsRatio":<float-0-to-1>,"sessionId":"2026-05-02T14:00:34.910Z","generation":2,"lineageMode":"restart","timestamp":"<ISO-8601>","durationMs":<int>}
```

`type` MUST be `"iteration"` exactly. Append via shell: `echo '<single-line-json>' >> "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl"`

### 3. Per-iteration delta file

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deltas/iter-006.jsonl`

One line per record. First line: same iteration record. Subsequent lines: one per finding, ruled_out, etc.

## NEW-FINDINGS RATIO

`(count of NEW findings this iter) / max(1, total findings discovered this iter)`

"NEW" means: not already reported in prior iterations OF THIS RUN (use `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl` to dedupe).
Run-1 findings are already remediated — do NOT count them.

## STATE FILES (for your reference)

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl
- Findings registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md
- Prior iterations dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations

## FOCUS

Iteration 6 dimension: **security**. This is a post-FIX-009 regression iter — VERIFY the fix held up.
