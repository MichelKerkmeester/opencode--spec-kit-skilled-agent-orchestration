---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: /memory:search Runtime Remediation [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/tasks]"
description: "Per-defect work units for /memory:search runtime remediation, organized by root-cause cluster. Findings-packet tasks completed; remediation tasks deferred to follow-up packet."
trigger_phrases:
  - "memory search remediation tasks"
  - "memory_context truncation fix"
  - "intent classifier fallback fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs"
    last_updated_at: "2026-04-26T14:33:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed remediation plan into Phase 1-3 work units"
    next_safe_action: "Hand off to remediation packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 75
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: /memory:search Runtime Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

This packet is findings-only. Phase 1 (this packet) is complete; Phase 2 and Phase 3 are deferred to a follow-up remediation packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

This packet (Phase 1) authors the findings; downstream phases are executed by the follow-up remediation packet.

- [x] T001 Reproduce defects via live MCP probes (spec §8)
- [x] T002 Author spec.md with all 17 defects mapped to REQ-001..017 (spec.md)
- [x] T003 [P] Author plan.md with 7 root-cause clusters (plan.md)
- [x] T004 [P] Author tasks.md decomposing remediation work (tasks.md — this file)
- [x] T005 [P] Author implementation-summary.md placeholder (implementation-summary.md)
- [x] T006 [P] Generate description.json (description.json)
- [x] T007 [P] Generate graph-metadata.json (graph-metadata.json)
- [ ] T008 Pass `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Deferred to the follow-up remediation packet.

### Cluster 1 — Truncation Wrapper (P0; REQ-002)
- [x] T101 Locate memory_context budget enforcement code (`mcp_server/handlers/memory-context.ts:447` — `enforceTokenBudget`)
- [x] T102 Instrument per-result token estimation; log estimated vs actual for 10 sample queries — diagnosed via inline `node` probe; bug was the `fallbackToStructuredBudget()` zero-fill, not estimator inflation
- [x] T103 Identify whether `data.content` stub-replacement is unconditional or conditional — confirmed unconditional zero-fill at original `mcp_server/handlers/memory-context.ts:482` `fallbackToStructuredBudget`; preserves none of the structurally-truncated survivors
- [x] T104 Fix: when `actualTokens / budgetTokens < 0.50`, return all results unmodified (`mcp_server/handlers/memory-context.ts:467-481` early-return guard) PLUS preserve survivors via the new `preservedAfterStructural` snapshot fed into `fallbackToStructuredBudget()` (`mcp_server/handlers/memory-context.ts:472-545, 696-705, 766-797`)
- [x] T105 [P] Regression test: existing T205-B suite still passes; inline node probe confirms `count > 0` after fix and metadata `returnedResultCount` matches actual payload `results.length`

### Cluster 2 — Intent Classifier Drift (P0/P1; REQ-001, REQ-004, REQ-016)
- [x] T201 Locate intent detection code (`mcp_server/lib/search/intent-classifier.ts:404` `classifyIntent`); confirmed `meta.intent` (this classifier) and `data.queryIntentRouting` (`mcp_server/code_graph/lib/query-intent-classifier.ts`) are SEPARATE scorers serving different purposes
- [x] T202 Added centroid-only confidence floor at 0.30 per spec §4A — keeps existing P3-12 0.08 floor for keyword-driven scoring, escalates to 0.30 only when keyword + pattern evidence is empty (`mcp_server/lib/search/intent-classifier.ts:209` constant + `:484-505` gate). Avoids breaking 15 existing intent-corpus tests that depend on single-keyword classification.
- [x] T203 [P] Documented authority split: `meta.intent.classificationKind = "task-intent"` is authoritative for rendering / anchors / mode-routing; `data.queryIntentRouting.classificationKind = "backend-routing"` is authoritative only for channel selection (`mcp_server/handlers/memory-context.ts:1180-1191, 1576-1583`)
- [ ] T204 Add stability corpus: 20 paraphrased queries — DEFERRED (out of scope for P0 fixes; corpus exists informally via the 80% accuracy test at intent-classifier.vitest.ts:T060)
- [x] T205 [P] Regression test verified inline: "Semantic Search" → understand (was fix_bug 0.098); "Find stuff related to semantic search" → understand; "fix the login bug" → fix_bug (single-keyword regression-safe)

### Cluster 3 — Output Rendering Vocabulary (P0; REQ-003)
- [x] T301 Decided option (b): stronger spec enforcement with literal forbidden-phrase list (option (a) blocked — assistant emits the rendering, not the runtime)
- [ ] T302 If (a): build canonical formatter — N/A, see T301
- [x] T303 Added "Forbidden Phrase Enforcement (REQ-003 / Cluster 3)" subsection to `.opencode/command/memory/search.md` with full forbidden→required substitution table, mandatory pre-render gate steps, and a verification grep
- [x] T304 [P] Verification grep specified in spec: `grep -Eci 'auto-triggered|triggered memories|triggered memory|constitutional memor(y|ies)'` MUST return 0 against the rendered block

### Cluster 4 — Causal-Stats Output Hygiene (P1; REQ-005, REQ-006, REQ-013)
- [ ] T401 Update memory_causal_stats serializer to emit all 6 relation keys (zero-fill if absent)
- [ ] T402 [P] Reconcile health field with meetsTarget; document mapping in spec §5B
- [ ] T403 [P] Add remediation hint when meetsTarget=false
- [ ] T404 Regression test: response shape contains all 6 relations; health agrees with meetsTarget

### Cluster 5 — State Hygiene (P1; REQ-009, REQ-011, REQ-015)
- [ ] T501 Thread stable sessionId through `/memory:search` invocations within an OpenCode session
- [ ] T502 [P] Guard "Context quality is degraded" hint emission on fresh ephemeral
- [ ] T503 [P] Extend dedup to trigger and constitutional channels
- [ ] T504 Regression test: two consecutive `/memory:search` calls in same session share session ID; second call dedupes prior triggers

### Cluster 6 — Folder Discovery + Channel Health (P1/P2; REQ-008, REQ-012, REQ-017)
- [ ] T601 Raise folder-discovery similarity threshold; require minimum signal strength before binding
- [ ] T602 [P] Add CocoIndex daemon health check at `/memory:search` invocation start
- [ ] T603 [P] Emit explicit `WARN: vector channel unavailable` line when daemon down
- [ ] T604 [P] Disambiguate "code graph" vs "causal graph" naming in startup hook + causal-stats output
- [ ] T605 Regression test: "Semantic Search" → `folderDiscovery=null`; daemon-down probe shows warning

### Cluster 7 — Quality Fallback + Edge Growth (P1/P2; REQ-007, REQ-010, REQ-014)
- [ ] T701 Wire 3-tier FTS fallback (FTS5 → BM25 → Grep) to trigger automatically when quality=gap
- [ ] T702 [P] Investigate causal-backfill job; identify why only `supersedes` edges added
- [ ] T703 Extend backfill to surface `caused` and `supports` candidates with confidence scores
- [ ] T704 [P] Document AskUserQuestion custom-answer routing in spec §4 OR add "Code search" menu option
- [ ] T705 Regression test: weak query triggers fallback; output includes `fallback_tier` field
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Deferred to the follow-up remediation packet.

- [ ] T901 Re-run spec §8 Probe 1 (intent classifier); confirm "Semantic Search" → `understand`
- [ ] T902 Re-run spec §8 Probe 2 (truncation); confirm `count > 0` in `data.content` at low token utilization
- [ ] T903 Re-run spec §8 Probe 3 (causal-stats); confirm all 6 relations present + health agrees with meetsTarget
- [ ] T904 Re-run spec §8 Probe 4 (folder discovery); confirm no spurious binding
- [ ] T905 Re-run spec §8 Probe 5 (edge growth); confirm non-`supersedes` relation deltas
- [ ] T906 Verify rendering vocabulary on empty-result `/memory:search` invocation
- [ ] T907 Update spec.md §8 with post-fix probe outputs alongside the original evidence
- [ ] T908 Mark all REQ-001..017 acceptance criteria as PASSED in checklist or implementation-summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

This packet (Phase 1) completes when:
- [x] All Phase 1 tasks T001-T007 marked `[x]`
- [ ] T008 (validation) passes
- [ ] No `[B]` blocked tasks remaining in Phase 1
- [ ] Memory indexer surfaces this packet via `memory_search "memory search runtime bugs"`

The follow-up remediation packet completes when all Phase 2 + Phase 3 tasks are `[x]` and the spec §8 probes pass per their acceptance criteria.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..017 with acceptance criteria + probe evidence in §8)
- **Plan**: See `plan.md` (7 root-cause clusters + phase sequencing)
- **Implementation Summary**: See `implementation-summary.md`
- **Canonical command spec**: `.opencode/command/memory/search.md`
- **Sibling packets**:
  - `../001-cache-warning-hooks/` — token-budget hook patterns
  - `../002-memory-quality-remediation/` — prior backend repair history
  - `../003-continuity-refactor-gates/` — gates A-F coordination
  - `../004-memory-save-rewrite/` — planner-first save contract
- **Related work outside parent**: `../../005-memory-indexer-invariants/`
<!-- /ANCHOR:cross-refs -->
