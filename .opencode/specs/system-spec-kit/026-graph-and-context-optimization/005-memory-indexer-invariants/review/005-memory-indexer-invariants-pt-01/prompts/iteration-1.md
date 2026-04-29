# Deep-Review Iteration Prompt Pack — Iteration 1

You are dispatched as a LEAF deep-review agent (`@deep-review`) for autonomous code review. The orchestrator (the loop manager) handles all session orchestration; you focus on a single review iteration. Read the strategy file, do the review work, write findings to files, append delta records, and stop.

## STATE SUMMARY

```
Iteration: 1 of 7
Mode: review
Dimension: correctness (priority 1; iteration 1 also performs an inventory pass)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants
Review Target Type: spec-folder
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: 0 / 4
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING (hasAdvisories=false)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
```

## REVIEW SCOPE (from strategy.md §15)

**Spec docs:**
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/plan.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/tasks.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md`

**Track A runtime files:**
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

**Track B + Wave-1/2 runtime files:**
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-parser.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`

**Test files:**
- `.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/symlink-realpath-hardening.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/exclusion-ssot-unification.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts`

## ITERATION 1 FOCUS

Iteration 1 has TWO purposes:

1. **Inventory pass** — confirm the artifact map is correct: every file listed in the strategy actually exists on disk, every CHK-* item in checklist.md cites a file:line that resolves, every ADR in decision-record.md has corresponding implementation. Note any inventory drift as P2 findings.

2. **Correctness pass (D1)** — evaluate logic correctness on the highest-leverage runtime paths:
   - **A2 PE downgrade** in `pe-orchestration.ts`: does the post-filter at the PE decision point cover BOTH `UPDATE` and `REINFORCE` decisions, AND every cross-file mutation path? Look for missed branches, off-by-one, edge cases where canonical_file_path is null/undefined, race conditions with concurrent saves.
   - **B2 fromScan flag** in `memory-index.ts` + `memory-save.ts`: confirm `fromScan: true` is propagated only on scan-originated saves, NEVER leaks across save passes, and the transactional reconsolidation recheck is bypassed only for scan-originated saves. Look for default value handling, parameter shadowing, recursive call chains that could lose the flag.
   - **SSOT predicate logic** in `lib/utils/index-scope.ts`: do `shouldIndexForMemory()` and `shouldIndexForCodeGraph()` correctly handle: trailing slashes, normalized vs absolute paths, symlinks, paths inside `external/` AT ANY DEPTH, paths in `z_archive/` or `z_future/`, the constitutional folder edge cases (`/constitutional/README.md` vs `/constitutional/rule.md`)?
   - **SQL-layer downgrade arithmetic** in `vector-index-mutations.ts`: when downgrading `constitutional → important`, are ALL columns updated atomically? What happens if the row is concurrently modified between the SELECT and UPDATE?
   - **Atomic restore validation** in `checkpoints.ts`: does abort-on-first-rejected-row truly abort the entire transaction, or could partial state leak via FTS triggers?

Cross-check focused regression tests (`pe-orchestration.vitest.ts`, `handler-memory-index.vitest.ts`, `index-scope.vitest.ts`) — do they exercise each invariant edge case, or do they leave gaps that the live rescan would surface?

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY. Do NOT modify reviewed files.
- Cite EVERY P0/P1 finding with concrete `file:line` evidence.
- Every new P0/P1 finding MUST include a typed claim-adjudication packet: `{claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger}`.
- newFindingsRatio = severity-weighted ratio of NEW findings this iteration (P0×10 + P1×5 + P2×1) over a normalizing factor; clean pass = 0.0; new P0 forces ≥ 0.50.

## OUTPUT CONTRACT (THREE REQUIRED ARTIFACTS)

All paths are absolute, repo-root resolved.

### 1. Iteration narrative markdown

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-001.md`

Required headings:
- `# Iteration 1 — Correctness + Inventory`
- `## Dimension`
- `## Files Reviewed`
- `## Findings — P0 (Blockers)`
- `## Findings — P1 (Required)`
- `## Findings — P2 (Suggestions)`
- `## Traceability Checks`
- `## Claim Adjudication Packets` (one per new P0/P1 finding)
- `## Verdict`
- `## Next Dimension`

### 2. Canonical JSONL iteration record (APPEND)

Append a SINGLE-LINE JSON record to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-state.jsonl`

The record MUST use `"type":"iteration"` exactly. Required schema:

```json
{"type":"iteration","iteration":1,"mode":"review","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":{"P0":<n>,"P1":<n>,"P2":<n>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T13:57:00.000Z","generation":1}
```

Append via: `echo '<single-line-json>' >> <state_log_path>`. Do not pretty-print.

### 3. Per-iteration delta file

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deltas/iter-001.jsonl`

One `{"type":"iteration",...}` record matching the state log append, plus one record per finding/classification/ruled_out/traceability-check, each on its own JSON line.

## STATE FILES

- Config: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-config.json`
- State log: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-state.jsonl`
- Findings registry: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-findings-registry.json`
- Strategy: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-strategy.md`

After completing your review work, also update the strategy file's `<!-- ANCHOR:next-focus -->` section to point iteration 2 at the next dimension (security).

GO.
