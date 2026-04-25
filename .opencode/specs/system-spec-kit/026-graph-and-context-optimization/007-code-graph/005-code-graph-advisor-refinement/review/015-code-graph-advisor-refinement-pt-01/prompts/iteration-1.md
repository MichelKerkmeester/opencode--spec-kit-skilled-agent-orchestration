# Deep-Review Iteration 1 of 7 — cli-codex gpt-5.5 high (normal speed)

You are the @deep-review LEAF agent. Do NOT dispatch sub-agents. Write ALL findings to files. Target 3–5 review actions, max 12 tool calls. The implementation is READ-ONLY — do NOT modify any reviewed code or specs.

## REVIEW TARGET

The 10-PR implementation that just landed for spec packet `015-code-graph-advisor-refinement`. Source of truth for the deltas:

**Spec folder:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`

**The 10 PRs (from `plan.md` and `tasks.md`):**

| PR | Title | Files (representative) | Severity / Effort |
|----|-------|------------------------|---------------------|
| 1 | F33 corpus path 4-line fix | `mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts` | P0/S |
| 2 | F23.1 settings.local.json rewrite | `.claude/settings.local.json` (NESTED schema corrected mid-implementation) | P0/S |
| 3 | F70 promotion subsystem DELETE | `mcp_server/skill-advisor/lib/promotion/` (gone), `bench/corpus-bench.ts` etc., 12 doc files | P1/M, ~-1638 LOC |
| 4 | F71 vocab unification | `code-graph/lib/{ensure-ready,readiness-contract,startup-brief}.ts`, `handlers/{context,query,status}.ts`, `skill-advisor/lib/freshness/trust-state.ts`, 2 test files | P1/M, ~+161 LOC |
| 5 | F43 instrumentation namespace | `skill-advisor/lib/metrics.ts` (+196), 7 emission sites (~+110); 16 metrics; SPECKIT_METRICS_ENABLED gating | P1/L, ~+306 LOC |
| 6 | F81 cache invalidation listener | `skill-advisor/lib/skill-advisor-brief.ts` (+5 LOC), new `tests/cache/listener-uniqueness.vitest.ts` | P1/S |
| 7 | F46 settings parity test | new `tests/hooks/settings-driven-invocation-parity.vitest.ts` (~+222 LOC, NESTED-schema-aware) | P1/M |
| 8 | parse-latency bench | new `bench/code-graph-parse-latency.bench.ts` (~+105 LOC) + 1 LOC `vitest.config.ts` glob extension | P2/S |
| 9 | query-latency bench | new `bench/code-graph-query-latency.bench.ts` (~+185 LOC) + `bench/code-graph-query-latency.baseline.json` | P2/M |
| 10 | hook-brief signal-noise bench | new `bench/hook-brief-signal-noise.bench.ts` (~+97 LOC) | P2/S-M |

## REVIEW DIMENSIONS (cover all 4 across iterations)

1. **Correctness** — does the code do what it claims? Logic bugs, race conditions, off-by-one, incorrect type narrowing, wrong defaults.
2. **Security** — input validation, injection vectors, env-var trust, file-system path traversal, hook command injection.
3. **Traceability** — every change cites a finding F-id; every test asserts an evidence claim from research; commit/PR boundary integrity.
4. **Maintainability** — readability, naming, dead code, missing comments where invariants are non-obvious, test brittleness.

## STATE

Iteration: 1 of 7 | Open findings: 0 | Stuck count: 0 | newFindingsRatio rolling: N/A
Convergence threshold: 0.10 | Verdict so far: pending

**Iter-1 focus:** Establish review baseline. Cover **correctness + security** dimensions across the 4 highest-risk PRs first:
- **PR 3 (DELETE sweep):** verify zero residual references to deleted modules; verify 22 test files still pass after delete; check whether any silent dead-code referenced by name in docs survived
- **PR 4 (vocab unification):** verify the V2 enum is consistently emitted across all 4 surfaces (status/context/query/startup-brief); check the 2 test updates for over-specification
- **PR 5 (instrumentation):** verify SPECKIT_METRICS_ENABLED guard is at every emission site; verify cardinality envelope; verify no FORBIDDEN_DIAGNOSTIC_FIELDS leak; verify additive schema (no breakage to existing `metrics.ts` collector)
- **PR 2 + PR 7 (settings + parity test):** verify NESTED schema (matcher + nested hooks[]) is what's on disk AND what the test asserts; verify no copilot adapter refs

Defer PR 1, PR 6, PR 8, PR 9, PR 10 to subsequent iterations.

## STATE FILES (absolute)

- Config: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/review/015-code-graph-advisor-refinement-pt-01/deep-review-config.json`
- State Log: `<artifact-dir>/deep-review-state.jsonl`
- Registry: `<artifact-dir>/findings-registry.json`
- **Write iteration narrative to:** `<artifact-dir>/iterations/iteration-001.md`
- **Write delta file to:** `<artifact-dir>/deltas/iter-001.jsonl`
- **Append JSONL iteration record to:** `<artifact-dir>/deep-review-state.jsonl`

## OUTPUT CONTRACT

Three artifacts required:

1. **Iteration narrative** at `iterations/iteration-001.md` with headings: Focus, Files Reviewed, Findings (P0/P1/P2 grouped), Verdict-So-Far, Coverage Map, Next Focus. Cite file:line for every finding.

2. **JSONL iteration record** appended to state log via `echo '<single-line-json>' >> <state-log>`. Schema:
   ```json
   {"type":"iteration","iteration":1,"newFindingsRatio":<0..1>,"status":"<string>","focus":"<string>","p0":<count>,"p1":<count>,"p2":<count>,"dimensionsCovered":["correctness","security",...]}
   ```

3. **Delta file** at `deltas/iter-001.jsonl`. One iteration record + per-finding records:
   ```json
   {"type":"finding","id":"R1-P0-001","severity":"P0","dimension":"correctness","title":"...","evidence":"path/file.ts:LN","reproduce":"...","fix":"...","prSource":"PR-3","iteration":1}
   ```
   Use IDs in form `R<iter>-<sev>-<seq>` (e.g. R1-P0-001, R1-P1-005).

Severity rules:
- **P0** — blocker (correctness defect, security hole, type-error breakage). Blocks merge.
- **P1** — required (must fix before close-out). Important but not blocker.
- **P2** — suggestion (nice-to-have, advisory only).

Target newFindingsRatio first iteration: 0.5+ is normal (most findings are net-new). If <0.2 something is wrong with the review (under-scoped or scope mismatch).

Start now.
