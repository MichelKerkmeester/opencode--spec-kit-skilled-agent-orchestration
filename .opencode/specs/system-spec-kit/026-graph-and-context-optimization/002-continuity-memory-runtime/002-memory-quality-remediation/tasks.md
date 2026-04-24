---
title: "...ystem-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks]"
description: "Historical pre-decomposition task list retained for traceability; execution moved to phase folders 001-005."
trigger_phrases:
  - "memory quality tasks"
  - "research tasks complete"
  - "remediation task placeholder"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
---
# Tasks: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

> **⚠️ SUPERSEDED BY PHASES 1-5:** This file is retained as the original pre-decomposition task list only. Use phase folders `001-foundation-templates-truncation/` through `005-operations-tail-prs/` as the authoritative execution record.

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### SECTION A — RESEARCH DELIVERY (this folder owns these)

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T001 | Initialize deep-research state for 003-memory-quality-remediation | DONE | `research/deep-research-config.json`, `research/deep-research-strategy.md` |
| T002 | Iter 1 — Pipeline architecture map | DONE | `research/iterations/iteration-001.md` |
| T003 | Iter 2 — D1 truncated overview root cause | DONE | `research/iterations/iteration-002.md` |
| T004 | Iter 3 — D2 generic decisions root cause | DONE | `research/iterations/iteration-003.md` |
| T005 | Iter 4 — D3 garbage trigger phrases root cause | DONE | `research/iterations/iteration-004.md` |
| T006 | Iter 5 — D4 importance tier mismatch root cause | DONE | `research/iterations/iteration-005.md` |
| T007 | Iter 6 — D5 missing causal supersedes root cause | DONE | `research/iterations/iteration-006.md` |
| T008 | Iter 7 — D6+D7+D8 root causes | DONE | `research/iterations/iteration-007.md` |
| T009 | Iter 8 — Remediation matrix synthesis (Q7) | DONE | `research/iterations/iteration-008.md` |
| T010 | Iter 9 — Skeptical pass + D6 verification | DONE | `research/iterations/iteration-009.md` |
| T011 | Iter 10 — Final synthesis pass + research.md | DONE | `research/iterations/iteration-010.md`, `research/research.md` |
| T012 | Run reducer + mark research config complete | DONE | `research/findings-registry.json`, `research/deep-research-config.json` (status="complete") |
| T013 | Save memory via generate-context.js | DONE | `research/research.md` and `implementation-summary.md` |
| T014 | Patch post-save quality issues (title bracket, importance_tier double-quote, garbage trigger phrases reproducing D3) | DONE | Findings rolled into `research/research.md` and packet closeout docs |
| T015 | Reindex memory via memory_index_scan | DONE | indexer results summarized in `implementation-summary.md` |
| T016 | Author Level 2 spec docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) | DONE | This folder's spec docs |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### SECTION B — CODE REMEDIATION (deferred to follow-up plan)

These tasks are intentionally preserved as the original placeholder matrix, but they are now superseded by the phase folders that executed the work. Do NOT reopen the fresh `/spec_kit:plan` workflow from this file; use the child phase folders as the execution record instead.

### P0 (ship first)

| ID | Task | Status |
|----|------|--------|
| T101 | D8 — Standardize anchor naming on `overview` in `templates/context_template.md:172-183` and `:330-352` | SUPERSEDED — See `001-foundation-templates-truncation/` |
| T102 | D1 — Replace `substring(0, 500)` in `extractors/collect-session-data.ts:875-881` with shared boundary-aware helper | SUPERSEDED — See `001-foundation-templates-truncation/` |
| T103 | Add helper-level fixture tests for D1 (450/520/900-char inputs) | SUPERSEDED — See `001-foundation-templates-truncation/` |
| T104 | Add template anchor consistency assertion | SUPERSEDED — See `001-foundation-templates-truncation/` |

### P1 (structural consistency + provenance)

| ID | Task | Status |
|----|------|--------|
| T201 | D4 — Extend `lib/frontmatter-migration.ts:1112-1183` to also rewrite bottom YAML metadata block | SUPERSEDED — See `002-single-owner-metadata/` |
| T202 | D4 — Add `core/post-save-review.ts:279-289` reviewer assertion for frontmatter↔metadata drift | SUPERSEDED — See `002-single-owner-metadata/` |
| T203 | D7 — Split provenance injection from captured-session enrichment in `core/workflow.ts:453-560`, `:877-923` | SUPERSEDED — See `002-single-owner-metadata/` |
| T204 | Add stubbed `extractGitContext()` workflow test for JSON-mode provenance | SUPERSEDED — See `002-single-owner-metadata/` |

### P2 (search-quality, behaviorally sensitive)

| ID | Task | Status |
|----|------|--------|
| T301 | D3a — Remove unconditional folder-token append in `core/workflow.ts:1271-1295` (keep `ensureMinTriggerPhrases()` low-count fallback) | SUPERSEDED — See `003-sanitization-precedence/` |
| T302 | D3b — Require source adjacency for topic bigrams in `lib/semantic-signal-extractor.ts:260-284` | SUPERSEDED — See `003-sanitization-precedence/` |
| T303 | D2 — Add raw `keyDecisions` reader to `extractors/decision-extractor.ts:182-185` before lexical fallback | SUPERSEDED — See `003-sanitization-precedence/` |
| T304 | D2 — Implement precedence hardening (do NOT blanket-disable lexical fallback) at `:367-388` | SUPERSEDED — See `003-sanitization-precedence/` |
| T305 | F1/F6 replay fixtures asserting absent path-fragment trigger phrases | SUPERSEDED — See `003-sanitization-precedence/` |
| T306 | Decision-extractor unit tests for raw / missing-normalized / decision-less JSON fixtures | SUPERSEDED — See `003-sanitization-precedence/` |

### P3 (investigation-first)

| ID | Task | Status |
|----|------|--------|
| T401 | D5 — Add `discoverPredecessors()` helper to `core/workflow.ts:1305-1372` (immediate predecessor + continuation gating + ambiguity skip) | SUPERSEDED — See `004-heuristics-refactor-guardrails/` |
| T402 | D5 — Wire helper into pre-render path before `buildCausalLinksContext()` in `core/memory-metadata.ts:227-236` | SUPERSEDED — See `004-heuristics-refactor-guardrails/` |
| T403 | D5 — Add temp-folder lineage fixture (one valid predecessor + one unrelated sibling) | SUPERSEDED — See `004-heuristics-refactor-guardrails/` |
| T404 | D6 — Add F1-based regression fixture for duplicate trigger phrases | SUPERSEDED — See `004-heuristics-refactor-guardrails/` |
| T405 | D6 — Trace duplicate origin only AFTER fixture establishes failing reproducer | SUPERSEDED — See `004-heuristics-refactor-guardrails/` |

### Acceptance

| ID | Task | Status |
|----|------|--------|
| T501 | Full pipeline replay with `/tmp/save-context-data.json` after all P0-P2 fixes; assert all 8 defect symptoms absent | SUPERSEDED — See `005-operations-tail-prs/` |
| T502 | Capture before/after diff of 3 sample memory saves to confirm no regressions | SUPERSEDED — See `005-operations-tail-prs/` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### STATUS

- **Section A (research delivery)**: ✅ ALL DONE — 16 of 16 complete
- **Section B (code remediation)**: ⏸ SUPERSEDED — execution moved to phase folders `001-005`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Research delivery tasks in Phase 1 are complete (`T001` through `T016`).
- [x] Deferred implementation placeholders in Phase 2 are superseded by phase folders `001-005`.
- [x] Scope split between research delivery and deferred remediation is explicitly documented.
- [x] Future follow-on work stays narrowed to Phases 6-7 rather than reopening the shipped Phase 1-5 remediation train.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research Source**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
