---
title: "Context Index — 011-mcp-runtime-stress-remediation migration bridge"
description: "Old-to-new path map and reorganization history for this phase parent. Optional cross-cutting doc per phase-parent content-discipline rule (carve-out + renumber narrative belongs here, not in spec.md)."
trigger_phrases:
  - "context index"
  - "011 migration bridge"
  - "carve-out 003 to 011"
  - "renumber 006-014 to 001-009"
importance_tier: "normal"
contextType: "general"
---

# Context Index — `011-mcp-runtime-stress-remediation`

This phase parent was extracted from `003-continuity-memory-runtime/` on 2026-04-27 because the v1.0.1 stress-test → research → remediation cycle (originally scaffolded as `006-…` through `014-…` inside 003) was topologically distinct from 003's memory-runtime theme. After the carve-out the children were renumbered in place to the clean 001-009 range so this folder reads as a fresh phase rather than a 006-anchored continuation. Parent `spec.md` is intentionally silent about that history — it documents root purpose, sub-phase manifest, and what needs done. This file is the single place where the reorganization is recorded so resuming AI assistants can resolve old-style cross-references without polluting the parent spec.

---

## CYCLE PHASE NAVIGATOR

### Baseline

- `001-search-intelligence-stress-test/` — v1.0.1 rubric design, 30-cell baseline sweep, and per-CLI findings.

### Research

- `002-mcp-runtime-improvement-research/` — Q1-Q8 deep-research synthesis that produced the contract diagnoses.

### Remediation

- `003-memory-context-truncation-contract/` — token-budget envelope contract.
- `004-cocoindex-overfetch-dedup/` — vendored CocoIndex fork, dedup, and path-class reranking.
- `005-code-graph-fast-fail/` — `fallbackDecision` routing on blocked code-graph reads.
- `006-causal-graph-window-metrics/` — relation-window metrics and per-relation cap.
- `007-intent-classifier-stability/` — normalized IntentTelemetry and paraphrase grouping.
- `008-mcp-daemon-rebuild-protocol/` — rebuild, restart, and live-probe protocol.
- `009-memory-search-response-policy/` — weak-result refusal and citation policy.

### Rerun

- `010-stress-test-rerun-v1-0-2/` — post-fix v1.0.2 rerun, scores, and findings.

### Followup Research

- `011-post-stress-followup-research/` — post-stress research loop converting v1.0.2 follow-ups into patch-sized proposals.

### Planned Fixes

- `012-copilot-target-authority-helper/` — cli-copilot target-authority dispatch helper.
- `013-graph-degraded-stress-cell/` — deterministic degraded-graph stress cell.
- `014-graph-status-readiness-snapshot/` — read-only graph readiness snapshot for status.
- `015-cocoindex-seed-telemetry-passthrough/` — CocoIndex seed telemetry passthrough.
- `016-degraded-readiness-envelope-parity/` — degraded-readiness envelope parity.
- `017-cli-copilot-dispatch-test-parity/` — cli-copilot dispatch test parity.
- `018-catalog-playbook-degraded-alignment/` — catalog/playbook degraded-alignment follow-up.

---

## OLD → NEW PATH MAP

| Original location (under `003-continuity-memory-runtime/`) | Carve-out location (this phase parent) | Final renumbered location (current) |
|------------------------------------------------------------|----------------------------------------|--------------------------------------|
| `006-search-intelligence-stress-test` | `011-…/006-search-intelligence-stress-test` | `011-…/001-search-intelligence-stress-test` |
| `007-mcp-runtime-improvement-research` | `011-…/007-mcp-runtime-improvement-research` | `011-…/002-mcp-runtime-improvement-research` |
| `008-memory-context-truncation-contract` | `011-…/008-memory-context-truncation-contract` | `011-…/003-memory-context-truncation-contract` |
| `009-cocoindex-overfetch-dedup` | `011-…/009-cocoindex-overfetch-dedup` | `011-…/004-cocoindex-overfetch-dedup` |
| `010-code-graph-fast-fail` | `011-…/010-code-graph-fast-fail` | `011-…/005-code-graph-fast-fail` |
| `011-causal-graph-window-metrics` | `011-…/011-causal-graph-window-metrics` | `011-…/006-causal-graph-window-metrics` |
| `012-intent-classifier-stability` | `011-…/012-intent-classifier-stability` | `011-…/007-intent-classifier-stability` |
| `013-mcp-daemon-rebuild-protocol` | `011-…/013-mcp-daemon-rebuild-protocol` | `011-…/008-mcp-daemon-rebuild-protocol` |
| `014-memory-search-response-policy` | `011-…/014-memory-search-response-policy` | `011-…/009-memory-search-response-policy` |

The slug suffix is preserved across both rename steps; only the leading number prefix changes. `git log --follow` from the current path traces history through both renames back to the original location under 003.

---

## REORGANIZATION RATIONALE

- 003's theme was cache hooks, memory quality, continuity refactor, and memory-save rewrite (its native children 001-005). The v1.0.1 stress-test cycle was scaffolded inside 003 only because that was the active phase when the work started, not because it belonged there topologically.
- After the carve-out 003 returned to its native four-child topology (001-004) plus the standalone 005 sibling. 003's `description.json.migration.child_phase_folders` and `graph-metadata.json.children_ids` never listed 006-014 in the first place (the cycle was added directly to the filesystem without manifest updates), so removing the moved children from 003's manifest was a no-op.
- The renumber from 006-014 to 001-009 was done so this phase parent reads as a fresh phase from the manifest's perspective. Hardcoding a 006-anchored child range at a freshly-extracted parent was confusing for both human readers and the resume ladder.

---

## DELETED PREDECESSOR DOCS

- The original autonomous-run handover document (the one for the 2026-04-26 → 2026-04-27 run) was deleted before the move and is **not** present in this phase parent. It is preserved only via git history at its prior path under `003-continuity-memory-runtime/`. The follow-up `HANDOVER-deferred` document lives in this folder root and is the canonical resume target for the cycle.

---

## CROSS-REFERENCE STATUS

The carve-out + renumber rewrite swept all path-form references across the moved subtree, the top-level `.opencode/specs/descriptions.json` discovery index, and the `.opencode/skill/mcp-coco-index/README.md` documentation. Two intentional exclusions remain:

- `003-continuity-refactor-gates/description.json` and `004-memory-save-rewrite/description.json` retain `intermediate_spec_folder` aliases that reference even older historical paths (a prior, unrelated renumber). Those are separate provenance records and were not touched.
- Two CLI run logs under `001-search-intelligence-stress-test/002-scenario-execution/runs/{S3/cli-opencode-pure-1,I2/cli-copilot-1}/output.txt` capture verbatim CLI output from the original sweep and reference the legacy 003/006 path. They are immutable historical evidence and were not rewritten.

---

## WHERE TO READ MORE

| Document | Purpose |
|----------|---------|
| `./spec.md` | Phase parent root: purpose, sub-phase manifest, what needs done. Does **not** contain migration narrative. |
| `./HANDOVER-deferred.md` | Four still-open follow-ups (re-run 001 sweep, tune 006 production cap, ship 007 v2, layer client-side hallucination guard). |
| `./resource-map.md` | Parent-aggregate file ledger covering both the carve-out and the renumber. |
| `../010-phase-parent-documentation/spec.md` | Predecessor packet that defined the lean phase-parent contract this folder follows. |
| `../003-continuity-memory-runtime/spec.md` | Original phase parent whose mid-phase scaffolding produced this carve-out. |
