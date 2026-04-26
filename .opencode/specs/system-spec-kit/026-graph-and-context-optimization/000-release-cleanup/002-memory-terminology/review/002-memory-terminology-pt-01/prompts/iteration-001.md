# Deep-Review Iteration 1 — Inventory + Correctness

## STATE

STATE SUMMARY:
Iteration: 1 of 5
Dimension: correctness (inventory pass + cognitive carve-out validation)
Review Target: PR1-PR5 phrasing-audit verification on 002-memory-terminology
Review Scope: 29 files (spec.md, phrasing-audit.md, top-level skill prose, 5 feature_catalog mirrors, manual_testing_playbook, 4 slash commands, 2 agent definitions, 4 runtime code files, 4 cognitive subsystem files)
Prior Findings: P0=0 P1=0 P2=0
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Provisional Verdict: PENDING hasAdvisories=false

## REVIEW CONTRACT (from spec.md REQ-001)

Verify the ~164 PR1-PR5 edits hold the **scope-freeze contract**:

1. **Zero identifier renames** (P0 if any rename detected):
   - 21 `memory_*` MCP tools: memory_context, memory_search, memory_quick_search, memory_match_triggers, memory_save, memory_update, memory_delete, memory_list, memory_index_scan, memory_validate, memory_health, memory_stats, memory_bulk_delete, memory_get_learning_history, memory_drift_why, memory_causal_link, memory_causal_unlink, memory_causal_stats, memory_ingest_start, memory_ingest_status, memory_ingest_cancel
   - 4 slash commands: /memory:save, /memory:search, /memory:learn, /memory:manage
   - Frontmatter key `_memory:` (must remain unchanged)
   - All `memory_*` SQL tables incl. `working_memory`
   - 17 `memory-*.ts` handler filenames
   - Folder names: `references/memory/`, `scripts/dist/memory/`
   - All `MEMORY_*` constants

2. **Cognitive-science loanwords preserved** (P0 if substituted):
   - `FSRS_*`, `Free Spaced Repetition Scheduler`, `Miller`, `working_memory`, `spreading activation`, `Collins-Loftus`

3. **Vocabulary substitutions accurate** per phrasing-audit.md:
   - `memory` → `spec-doc record` (when referring to indexed records)
   - `memory` → `indexed continuity` (when referring to retrieval system)
   - `memory` → `constitutional rule` (when in constitutional/ tier)
   - `memory` → `packet` (when referring to spec folder bundles)
   - `memory` → `causal-graph node` (when referring to graph entities)

4. **No semantic drift** introduced
5. **No broken anchors or cross-doc links**
6. **Runtime output strings** in handlers don't break vitest snapshot tests
7. **spec.md + phrasing-audit.md** internally consistent

## ITERATION 1 FOCUS

**Inventory pass + correctness validation**:

A. **Identifier-rename audit (highest priority)** — grep across the entire repo (not just review scope) for evidence that any of the no-touch identifiers were accidentally renamed. Check:
   - In docs: `memory_search` and `/memory:search` etc. survived as exact tokens
   - In code: `memory_*` table names, `MEMORY_*` constants, `_memory:` frontmatter survived
   - In handlers: 17 `memory-*.ts` filenames intact in `mcp_server/handlers/`

B. **Cognitive carve-out validation** — read these 4 files and confirm:
   - `mcp_server/lib/cognitive/fsrs-scheduler.ts`
   - `mcp_server/lib/cognitive/prediction-error-gate.ts`
   - `mcp_server/lib/cognitive/temporal-contiguity.ts`
   - `mcp_server/lib/cognitive/adaptive-ranking.ts`
   Confirm `FSRS`, `Free Spaced Repetition Scheduler`, `Miller`, `Collins-Loftus`, `spreading activation`, and `working_memory` appear unchanged where the algorithm depends on them.

C. **Spot-check vocabulary substitution accuracy** — sample 5-7 files from the review scope:
   - `references/memory/memory_system.md`
   - `references/debugging/troubleshooting.md`
   - `references/validation/decision_format.md`
   - `feature_catalog/feature_catalog.md` (parent + at least one mirror)
   - `tool-schemas.ts` (a 17-tool description sweep)
   Verify substitutions are local-context-correct (not blindly global).

D. **Headline-pattern verification** — confirm these zero-out in operator-facing markdown:
   - `grep -rE '\b(your|the)\s+memor(y|ies)\b' .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/references/ .opencode/skill/system-spec-kit/constitutional/`
   - Expect zero hits except in cognitive-literature carve-outs (shouldn't be in those files at all).
   - `grep -nE 'Loaded [0-9]+ memor' .opencode/skill/system-spec-kit/references/validation/decision_format.md` — expect zero (line 281 example became "Loaded 3 spec-doc records").

E. **spec.md vs. phrasing-audit.md consistency** — open both and confirm REQ-001..REQ-008 in spec.md align with the vocabulary key + grid in phrasing-audit.md.

## SHARED DOCTRINE

Load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS (this iteration: correctness focus)

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every new P0/P1 finding MUST include: `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`.

## STATE FILES (paths relative to repo root)

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deltas/iter-001.jsonl`

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files. Only write to the state files listed above.
- Append a single JSONL record to the state log with: type=iteration, iteration=1, dimensions, filesReviewed (count), findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio.

## OUTPUT CONTRACT (REQUIRED)

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/iterations/iteration-001.md`. Sections: Dimension, Files Reviewed, Findings by Severity (P0/P1/P2 with file:line evidence), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to the state log. EXACT type=iteration:

```json
{"type":"iteration","iteration":1,"dimensions":["correctness"],"filesReviewed":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"graphEvents":[]}
```

Single-line JSON. Newline-terminated. Use `echo '<single-line-json>' >> <state_log_path>`.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deltas/iter-001.jsonl`. One iteration record + one record per finding/classification/ruled_out/graphEvent.

All three artifacts are REQUIRED.

## NEW-FINDINGS-RATIO COMPUTATION

For iteration 1: `newFindingsRatio = (P0_new × 10 + P1_new × 5 + P2_new × 1) / 100`. Cap at 1.0. If any new P0 → ratio = max(calculated, 0.50). Clean pass (zero findings) → 0.0.

## PROCEED

Execute the 5-step inventory now. Be evidence-driven, file:line precision required for any P0/P1.
