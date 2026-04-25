---
title: "Implementation Summary: Code Graph Resilience Research [system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/implementation-summary]"
description: "7-iteration cli-copilot gpt-5.5 high deep-research loop converged with 10/10 questions answered and 4/4 mandatory assets materialized. Outputs unblock 006 Phase B (apply mode) for /doctor:code-graph."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
trigger_phrases:
  - "code graph resilience research implementation"
  - "007-code-graph-resilience-research implementation summary"
  - "code graph staleness model implementation"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
    last_updated_at: "2026-04-25T21:18:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Synthesis written"
    next_safe_action: "Commit + push 007 packet; then update 006 to mark Phase B unblocked"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "research/research.md"
      - "assets/code-graph-gold-queries.json"
      - "assets/staleness-model.md"
      - "assets/recovery-playbook.md"
      - "assets/exclude-rule-confidence.json"
    session_dedup:
      fingerprint: "sha256:0260000000007007000000000000000000000000000000000000000000000099"
      session_id: "007-code-graph-resilience-research-impl"
      parent_session_id: "026-phase-root-flatten-2026-04-21"
    completion_pct: 100
    open_questions:
      - "Runtime gold-battery harness execution (deferred to 006 Phase B; pass_policy contract is materialized)"
    answered_questions:
      - "Q1-Q2: staleness signals + threshold tiers (fresh/soft-stale/hard-stale)"
      - "Q3: recurring scan failure modes (3 classes documented)"
      - "Q4: SQLite corruption recovery procedure (3-step quarantine + clean rebuild)"
      - "Q5: 28-query gold verification battery"
      - "Q6: exclude-rule confidence tiers (high/medium/low)"
      - "Q7-Q8: edge weight drift signals + resolver failure modes"
      - "Q9: confidence-floor signaling (5 hard signals; 3 soft)"
      - "Q10: self-healing safety boundary (bounded soft-stale only)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-code-graph-resilience-research |
| **Completed** | 2026-04-25 |
| **Level** | 2 |
| **Iterations** | 7/7 (rc=0 each) |
| **Convergence verdict** | CONVERGED (iter 7 status=complete) |
| **Research questions answered** | 10/10 |
| **Mandatory assets materialized** | 4/4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reusable resilience reference for the code-graph subsystem. The 7-iteration deep-research loop produced four authoritative assets plus a synthesis document and decision record that together answer the question "when is the code-graph index trustworthy and how do we recover when it isn't."

Operators of `/doctor:code-graph` previously had to reason about staleness from raw `code_graph_status` fields. Now they have: a 3-state staleness model with explicit action mappings, a 28-query gold battery for verifying scan health, a 3-procedure recovery playbook for SQLite corruption / partial-scan / bad-apply rollback, and a tiered exclude-rule confidence map that distinguishes always-safe excludes from repo-policy-dependent ones.

### `assets/code-graph-gold-queries.json`

A 28-query verification battery with `schema_version`, `pass_policy`, and per-query `expected_count` + `expected_top_K_symbols` fields. Categories: MCP tool handler queries, cross-module function queries, exported type/class queries, and regression-detection queries. Pass policy: ≥90% overall pass rate, ≥80% per edge-focus bucket, no critical expected symbol missing from top-K.

### `assets/staleness-model.md`

Defines `fresh`, `soft-stale`, and `hard-stale` states with observable conditions, trust-surface mapping, and action mapping. Confidence-floor signals are documented for each hard-stale class (empty/error graph, workload drift >50 stale files, post-scan confidence failure, edge-distribution drift). Self-healing boundary is restricted to bounded soft-stale states.

### `assets/recovery-playbook.md`

Three idempotent procedures: CG-RP-001 (SQLite corruption — quarantine, salvage on copy, rebuild from source), CG-RP-002 (partial-scan failure — diagnose staged rows, retry selectively or full-rescan), CG-RP-003 (bad-apply rollback — restore from quarantine, re-verify). Each procedure has trigger conditions, idempotence guarantees, and verification steps.

### `assets/exclude-rule-confidence.json`

Tiered exclude classes with rationale and false-positive evidence. High tier: `.git`, `node_modules`, Python caches, local venvs, `.DS_Store`, runtime compile caches, `.cocoindex_code`. Medium tier: `dist`, `build`, `out`, `vendor`, `external`, `generated` (need warning/override semantics — real repos use these names for source). Low tier: `fixtures`, `testdata`, `scratch`, `z_archive`, `z_future`, repo-local product directories (repo-policy decisions).

### `research/research.md`

Synthesis document with citations to ≥10 file:line references across `code-graph-db.ts`, `ensure-ready.ts`, `scan.ts`, `detect-changes.ts`, `structural-indexer.ts`, `tree-sitter-parser.ts`, `readiness-contract.ts`, and external sources (Sourcegraph repo update frequency, ctags man page).

### `decision-record.md`

Captures threshold + tier decisions with rationale: 50-file selective-reindex switch (already in code at `ensure-ready.ts:47-52`), 8-hour soft-stale age boundary (Sourcegraph polling minimum), 24-hour hard-stale age (Sourcegraph precise-code-intel default), 3-5% stale ratio for large workspaces (50/1425 = 3.5% derived from local scale).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/iterations/iteration-001.md` through `research/iterations/iteration-007.md` | Created | Per-iteration findings (Q3 → Q1+Q2 → Q4 → Q5 → Q6 → Q7+Q8 → Q9+Q10) |
| `research/deltas/iteration-001.json` through `research/deltas/iteration-007.json` | Created | Per-iteration delta state |
| `research/deep-research-state.jsonl` | Appended | 9 entries (init, executor, 7 iterations) |
| `research/research.md` | Created | Synthesis document |
| `assets/code-graph-gold-queries.json` | Created | 28-query verification battery |
| `assets/staleness-model.md` | Created | 3-state model with action mapping |
| `assets/recovery-playbook.md` | Created | 3-procedure playbook |
| `assets/exclude-rule-confidence.json` | Created | Tiered exclude class map |
| `decision-record.md` | Created | Threshold + tier decisions with rationale |
| `tasks.md` | Modified | All 28 tasks marked `[x]` with evidence |
| `checklist.md` | Modified | All 26 checklist items marked `[x]` with evidence |
| `implementation-summary.md` | Created | This file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/spec_kit:deep-research:auto` workflow ran 7 sequential iterations against the cli-copilot executor (gpt-5.5, reasoning-effort: high, max-iterations: 7, convergence threshold: 0.10). Each iteration was a single `copilot -p "PROMPT" --model gpt-5.5 --allow-all-tools --no-ask-user` invocation against a packet-local prompt file that referenced prior iteration outputs and required canonical iteration outputs under `research/iterations/` and `research/deltas/` plus a JSONL state-log entry. Iteration 3 ran a real SQLite `.recover` corruption experiment on a temporary DB copy. Iteration 7 was reserved for synthesis and asset materialization, producing the four mandatory deliverables in `assets/` plus the synthesis document and decision-record. Track A (006 Phase A `/doctor:code-graph` diagnostic command) was authored in parallel and committed to main as `967cea78a` while this loop converged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| 3-state staleness model: `fresh` / `soft-stale` / `hard-stale` | The live `ensure-ready.ts` already partitions into these effective tiers via the 50-stale-file threshold and the readiness contract's freshness/trust-state mapping; the model formalizes what the code already does and adds the gold-query confidence floor as a fourth invalidator |
| 28 gold queries, not 20 | The 4-category coverage map (MCP handlers + cross-module functions + exported contracts + regression canaries) needed enough redundancy that a single dropped canonical symbol would fail multiple queries — 28 = 7 per category gives 2-failure overlap |
| `pass_policy` floor of 90% overall + 80% per edge-focus bucket | Iteration 6 derived these floors from edge-distribution drift work; below 80% per bucket means a structural class is degraded enough that operator intervention is warranted |
| Confidence tiers, not binary safe/unsafe excludes | Real repos use `dist`, `build`, `vendor`, `external` for source code — a binary policy would either over-flag valid sources (false positives) or miss real bloat (false negatives). Three tiers let the doctor command surface different severity in proposals |
| Self-healing limited to bounded soft-stale | Auto-rescan on hard-stale signals would silently mask Git HEAD drift, schema mismatches, or post-corruption states that demand operator attention. The boundary mirrors `detect_changes`'s existing `allowInlineIndex:false` / `allowInlineFullScan:false` posture |
| Recovery playbook is source-first, not salvage-first | The DB is a rebuildable cache; `.recover` produces a salvage stream that is not trust-restoring. Procedures CG-RP-001/002/003 always end with a fresh source scan + gold-query verification rather than promoting recovered DB contents |
| Defer runtime gold-battery harness execution to 006 Phase B | The contract (pass_policy + per-query expected fields) is materialized in JSON; running it requires a test harness that drops a canonical symbol via exclude rule, re-scans, and counts query mismatches. That harness belongs to the doctor apply mode (006 Phase B), not the research packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-research loop converged | PASS — iter 7 status=complete; verdict CONVERGED in iter 7 markdown |
| All 7 iterations produced canonical markdown + delta JSON | PASS — 7 iterations × 2 files each, no log-embedded recoveries |
| State JSONL has 9 entries (init + executor + 7 iters) | PASS |
| 4 mandatory assets exist with non-empty content | PASS — code-graph-gold-queries.json (10.8KB), exclude-rule-confidence.json (8.9KB), recovery-playbook.md (4.8KB), staleness-model.md (5.0KB) |
| Both JSON assets parse cleanly via python3 json.load | PASS |
| Gold queries JSON has 28 queries with expected_count + expected_top_K_symbols shape | PASS |
| Exclude-rule JSON has high/medium/low tiers | PASS |
| Synthesis document ≥10 file:line citations | PASS — citations span 7+ source files in mcp_server/code_graph/ |
| decision-record.md frontmatter complete + body covers all decisions | PASS |
| Strict spec validation 0/0 | PASS — final run of validate.sh --strict |
| Sibling 006 packet cross-references this packet | PASS — see 006 implementation-summary "Phase B promotion gated on 007" |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime regression test deferred.** The `pass_policy` contract is materialized in `assets/code-graph-gold-queries.json`, but no harness exists yet that takes the asset, drops a canonical symbol via an exclude rule, runs the queries against a code_graph_query MCP tool, and counts mismatches. That runtime is part of 006 Phase B (apply mode).

2. **NFR-P01 / NFR-P02 not measured.** The plan specifies the gold battery should complete in <30s for repos under 10k files and recovery procedures should complete in <5min. Both targets are documented in plan.md but neither has been measured against the live code-graph runtime.

3. **Resolver failures documented but not fixed.** Iteration 6 enumerates the resolver failure modes (path aliases, dynamic imports, type-only imports, re-export barrels, default-import aliasing) but treats them as trust limitations rather than fix targets. Closing those gaps is a separate scanner-uplift packet.

4. **Edge-weight tuning surface absent.** Edge weights (`CONTAINS=1.0`, `IMPORTS=1.0`, `EXTENDS=0.95`, ..., `TESTED_BY=0.6`) are hard-coded in the indexer producer with no `IndexerConfig` runtime knob. The drift detection signals are documented but per-edge-class weights remain compile-time constants.

5. **Sourcegraph + ctags citations are external evidence, not contracts.** The 8-hour and 24-hour age boundaries are defensible from external tools but not proven optimal for this codebase's working-tree velocity. Empirical re-tuning may be warranted after 6+ months of doctor apply-mode telemetry.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
