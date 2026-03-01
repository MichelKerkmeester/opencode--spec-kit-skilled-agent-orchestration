---
title: "Tasks: Documentation Alignment [007-documentation-alignment/tasks]"
description: "tasks document for 007-documentation-alignment."
trigger_phrases:
  - "tasks"
  - "documentation"
  - "alignment"
  - "007"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3 -->
# Tasks: Documentation Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-tasks | v1.1 -->

---

<!-- ANCHOR:task-notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked by dependency |
<!-- /ANCHOR:task-notation -->

---

<!-- ANCHOR:task-groups -->
## 1. Task Groups

### Group A — Top-Level Documentation (P0)

- [x] T001 Update `.opencode/skill/system-spec-kit/README.md`:
  - Update "By The Numbers" module count (50 → 63)
  - Add 5 new modules to Key Innovations table
  - Update search architecture diagram to include artifact routing + adaptive fusion stages
  - Add feature flags section with `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY`
  - Update lib/ directory structure listing (add contracts/, telemetry/, extraction/ folders + 13 missing modules)
  - Add search/artifact-routing, search/adaptive-fusion to module descriptions

- [x] T002 Update `.opencode/skill/system-spec-kit/SKILL.md`:
  - Add adaptive fusion, artifact routing, mutation ledger, telemetry to Key Concepts
  - Update `memory_search()` description to mention adaptive fusion option
  - Add feature flag documentation
  - Update MCP server description to reflect telemetry integration

- [x] T003 Update `.opencode/skill/system-spec-kit/mcp_server/README.md`:
  - Update module count (50 → 63)
  - Add contracts/, telemetry/, extraction/ to directory listing
  - Update cognitive/ count (8 → 10), search/ count (8 → 12), storage/ count (7 → 8), config/ count (2 → 3)
  - Add `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY` to feature flags table
  - Update search pipeline architecture diagram
  - Add new capabilities to overview section

- [x] T004 Update `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`:
  - Add new features to Features section (adaptive fusion, telemetry, mutation ledger)
  - Add new feature flags to configuration section
  - Update examples to show adaptive fusion behavior

### Group B — Library Subfolder READMEs (P1)

- [x] T010 Update `mcp_server/lib/README.md`:
  - Add contracts/, telemetry/, extraction/ folder entries
  - Update module category count (15+ → 18+)
  - Add new modules to Key Files table

- [x] T011 Update `mcp_server/lib/search/README.md`:
  - Add artifact-routing.ts, adaptive-fusion.ts, causal-boost.ts, session-boost.ts
  - Update module count (8 → 12)
  - Update total LOC estimate
  - Add feature descriptions for artifact routing and adaptive fusion

- [x] T012 Update `mcp_server/lib/storage/README.md`:
  - Add mutation-ledger.ts entry
  - Update module count (7 → 8)
  - Add mutation ledger description to features

- [x] T013 Update `mcp_server/lib/cognitive/README.md`:
  - Add pressure-monitor.ts and rollout-policy.ts
  - Update module count (8 → 10)
  - Update total LOC estimate

- [x] T014 Update `mcp_server/lib/config/README.md`:
  - Add skill-ref-config.ts entry
  - Update module count (2 → 3)

- [x] T015 Update `mcp_server/handlers/README.md`:
  - Note telemetry integration in memory-search.ts and memory-context.ts

- [x] T016 Update `mcp_server/tests/README.md`:
  - Add 5 new test files (retrieval-trace, artifact-routing, adaptive-fusion, mutation-ledger, retrieval-telemetry)
  - Update test file count

- [x] T017 Update `mcp_server/hooks/README.md`:
  - Verify current state; update if hook behavior changed

### Group C — New Folder READMEs (P1)

- [x] T020 Create `mcp_server/lib/contracts/README.md`:
  - Follow existing lib subfolder README pattern
  - Document retrieval-trace.ts: ContextEnvelope, RetrievalTrace, DegradedModeContract, TraceEntry, RetrievalStage
  - Include exports, purpose, usage examples

- [x] T021 Create `mcp_server/lib/telemetry/README.md`:
  - Follow existing lib subfolder README pattern
  - Document retrieval-telemetry.ts: LatencyMetrics, ModeMetrics, FallbackMetrics, QualityMetrics
  - Include feature flag dependency (SPECKIT_EXTENDED_TELEMETRY)

- [x] T022 Create `mcp_server/lib/extraction/README.md`:
  - Follow existing lib subfolder README pattern
  - Document extraction-adapter.ts and redaction-gate.ts
  - Include purpose, pipeline position, exports

### Group D — Memory Commands (P1)

- [x] T030 Update `.opencode/command/memory/context.md`:
  - Document adaptive fusion behavior in search routing
  - Add telemetry parameters to tool signature
  - Note feature flag effects on weight application

- [x] T031 Update `.opencode/command/memory/save.md`:
  - Document mutation-ledger tracking for save operations
  - Add artifact metadata context
  - Update parameter references

- [x] T032 Update `.opencode/command/memory/manage.md`:
  - Add feature flag documentation for all operations
  - Document mutation-ledger audit capabilities
  - Update tool signatures with new parameters

- [x] T033 Update `.opencode/command/memory/learn.md`:
  - Update consolidation pipeline for adaptive fusion context
  - Document mutation-ledger event tracking
  - Add telemetry parameters

- [x] T034 Update `.opencode/command/memory/continue.md`:
  - Add adaptive fusion context for recovery accuracy
  - Note telemetry tracking for recovery operations

### Group E — Scripts READMEs (P2)

- [x] T040 Update `scripts/README.md`:
  - Add evals/ directory with 9 scripts
  - Add kpi/ directory with quality-kpi.sh
  - Update extractors count (9 → 11)
  - Add validate-memory-quality mention

- [x] T041 Update `scripts/extractors/README.md`:
  - Add contamination-filter.ts and quality-scorer.ts to inventory
  - Update module count (9 → 11)

- [x] T042 Update `scripts/memory/README.md`:
  - Add validate-memory-quality.ts to inventory
  - Update script count (3 → 4)
  - Document quality validation workflow

- [x] T043 Update `scripts/tests/README.md`:
  - Add test-memory-quality-lane.js to test inventory

### Group F — Post-Completion Drift Addendum (P1)

- [x] T050 Record embedding-provider legacy drift in spec docs:
  - Capture lifecycle evidence (`v1.2.0.0` add, `v1.3.3.0` present, TS migration removal in `63a1b338416e563f6ceb869106da14fb00b4ef1e`)
  - Capture current replacement architecture (`shared/types.ts`, provider implementations, provider factory, T085 interface coverage)
  - Update root spec docs and package-007 closure docs with relevance classification and follow-up direction
  - Resolution note: drift closed after `mcp_server/tests/embeddings.vitest.ts` rewrite to current shared architecture (old deferred marker removed)
  - Resolution extension: `tests/api-key-validation.vitest.ts`, `tests/api-validation.vitest.ts`, and `tests/lazy-loading.vitest.ts` converted from deferred/skipped to active coverage (targeted run: 3 files passed, 15 tests passed, 0 skipped; reflected in root `test-results.md` and `implementation-summary.md`)
<!-- /ANCHOR:task-groups -->

---

<!-- ANCHOR:evidence-requirements -->
## 2. Evidence Requirements

- [x] E01 All module counts verified by Glob (before/after comparison)
- [x] E02 Both feature flags appear in at least 4 documentation files
- [x] E03 Architecture diagrams include artifact routing and adaptive fusion
- [x] E04 All 3 new folder READMEs created and follow existing pattern
- [x] E05 No stale references (every file mentioned in a README exists)
<!-- /ANCHOR:evidence-requirements -->

---

<!-- ANCHOR:completion-conditions -->
## 3. Completion Conditions

- [x] All Group A tasks (T001–T004) completed
- [x] All Group B tasks (T010–T017) completed
- [x] All Group C tasks (T020–T022) completed
- [x] All Group D tasks (T030–T034) completed
- [x] All Group E tasks (T040–T043) completed
- [x] Group F addendum task (T050) completed
- [x] All evidence requirements (E01–E05) met
- [x] Root task/checklist mapping synchronized
<!-- /ANCHOR:completion-conditions -->
