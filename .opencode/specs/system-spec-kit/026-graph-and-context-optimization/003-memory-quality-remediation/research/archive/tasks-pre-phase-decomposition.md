---
title: "Tasks: Memory Quality Backend Improvements"
description: "Research-only task list. Code remediation tasks (T010+) are intentionally left as next-plan placeholders to keep this folder's scope as research delivery only."
trigger_phrases:
  - "memory quality tasks"
  - "research tasks complete"
  - "remediation task placeholder"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/archive/tasks-pre-phase-decomposition.md"]

---

# Tasks: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

## SECTION A — RESEARCH DELIVERY (this folder owns these)

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T001 | Initialize deep-research state for 003-memory-quality-issues | DONE | `research/deep-research-config.json`, `research/deep-research-strategy.md` |
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
| T013 | Save memory via generate-context.js | DONE | `memory/06-04-26_18-30__completed-a-10-iteration-deep-research.md` |
| T014 | Patch post-save quality issues (title bracket, importance_tier double-quote, garbage trigger phrases reproducing D3) | DONE | Manual edits to memory file + reindex |
| T015 | Reindex memory via memory_index_scan | DONE | indexer reports id 1837 (memory) + 1838 (research.md) |
| T016 | Author Level 2 spec docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) | DONE | This folder's spec docs |

---

## SECTION B — CODE REMEDIATION (deferred to follow-up plan)

These tasks are intentionally left as **PLACEHOLDERS** so a fresh `/spec_kit:plan` invocation can pick them up. Do NOT execute them in this folder — that would violate the research-only scope.

### P0 (ship first)

| ID | Task | Status |
|----|------|--------|
| T101 | D8 — Standardize anchor naming on `overview` in `templates/context_template.md:172-183` and `:330-352` | NEXT-PLAN |
| T102 | D1 — Replace `substring(0, 500)` in `extractors/collect-session-data.ts:875-881` with shared boundary-aware helper | NEXT-PLAN |
| T103 | Add helper-level fixture tests for D1 (450/520/900-char inputs) | NEXT-PLAN |
| T104 | Add template anchor consistency assertion | NEXT-PLAN |

### P1 (structural consistency + provenance)

| ID | Task | Status |
|----|------|--------|
| T201 | D4 — Extend `lib/frontmatter-migration.ts:1112-1183` to also rewrite bottom YAML metadata block | NEXT-PLAN |
| T202 | D4 — Add `core/post-save-review.ts:279-289` reviewer assertion for frontmatter↔metadata drift | NEXT-PLAN |
| T203 | D7 — Split provenance injection from captured-session enrichment in `core/workflow.ts:453-560`, `:877-923` | NEXT-PLAN |
| T204 | Add stubbed `extractGitContext()` workflow test for JSON-mode provenance | NEXT-PLAN |

### P2 (search-quality, behaviorally sensitive)

| ID | Task | Status |
|----|------|--------|
| T301 | D3a — Remove unconditional folder-token append in `core/workflow.ts:1271-1295` (keep `ensureMinTriggerPhrases()` low-count fallback) | NEXT-PLAN |
| T302 | D3b — Require source adjacency for topic bigrams in `lib/semantic-signal-extractor.ts:260-284` | NEXT-PLAN |
| T303 | D2 — Add raw `keyDecisions` reader to `extractors/decision-extractor.ts:182-185` before lexical fallback | NEXT-PLAN |
| T304 | D2 — Implement precedence hardening (do NOT blanket-disable lexical fallback) at `:367-388` | NEXT-PLAN |
| T305 | F1/F6 replay fixtures asserting absent path-fragment trigger phrases | NEXT-PLAN |
| T306 | Decision-extractor unit tests for raw / missing-normalized / decision-less JSON fixtures | NEXT-PLAN |

### P3 (investigation-first)

| ID | Task | Status |
|----|------|--------|
| T401 | D5 — Add `discoverPredecessors()` helper to `core/workflow.ts:1305-1372` (immediate predecessor + continuation gating + ambiguity skip) | NEXT-PLAN |
| T402 | D5 — Wire helper into pre-render path before `buildCausalLinksContext()` in `core/memory-metadata.ts:227-236` | NEXT-PLAN |
| T403 | D5 — Add temp-folder lineage fixture (one valid predecessor + one unrelated sibling) | NEXT-PLAN |
| T404 | D6 — Add F1-based regression fixture for duplicate trigger phrases | NEXT-PLAN |
| T405 | D6 — Trace duplicate origin only AFTER fixture establishes failing reproducer | NEXT-PLAN |

### Acceptance

| ID | Task | Status |
|----|------|--------|
| T501 | Full pipeline replay with `/tmp/save-context-data.json` after all P0-P2 fixes; assert all 8 defect symptoms absent | NEXT-PLAN |
| T502 | Capture before/after diff of 3 sample memory saves to confirm no regressions | NEXT-PLAN |

---

## STATUS

- **Section A (research delivery)**: ✅ ALL DONE — 16 of 16 complete
- **Section B (code remediation)**: ⏸ DEFERRED — owned by next `/spec_kit:plan` invocation against this folder
