---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: Search Intelligence Stress-Test Playbook"
description: "Feature Specification: Search Intelligence Stress-Test Playbook"
trigger_phrases:
  - "001-search-intelligence-stress-test"
  - "search intelligence playbook"
  - "memory search cross-AI test"
  - "cli-codex cli-copilot cli-opencode stress test"
  - "search query intelligence rubric"
  - "external vs MCP search comparison"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test"
    last_updated_at: "2026-04-27T13:33:57.271Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Strict validator hygiene update"
    next_safe_action: "Author 001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 25
    open_questions:
      - "How many runs per (scenario × CLI) cell? Default N=1 baseline; optionally expand to N=3 for variance signal"
      - "Should cli-opencode use --agent general OR --agent context for fair comparison vs external CLIs?"
      - "Fixed-corpus scoring or use the actual production memory database? (production = realistic, fixed = reproducible)"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: none; SUCCESSOR: 002-mcp-runtime-improvement-research -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase manifest: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Search Intelligence Stress-Test Playbook

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Parent spec stays lean, child manifest stays accurate, and strict parent validation introduces no new errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit "Search / Query / Intelligence" surfaces (memory_search, memory_context, code_graph_query, advisor_recommend, intent classifier, etc.) have grown organically across 26+ optimization packets. Sibling packet `005-memory-search-runtime-bugs` catalogs 17 defects observed in a single live session. We need a reproducible, cross-AI stress-test that quantifies how well the search intelligence performs under realistic prompt variation — not just bug-hunt, but ongoing quality regression.

### Purpose
Build a playbook that dispatches a fixed prompt corpus (9 scenarios × 3 prompt types) through cli-codex, cli-copilot, and cli-opencode, then scores each outcome against a 5-dimension rubric (correctness, tool selection, latency, token efficiency, hallucination). The asymmetry between cli-opencode (full Spec Kit Memory MCP runtime) and cli-codex/cli-copilot (external runtimes without our MCP) is the test's most informative axis — it reveals whether our search intelligence adds measurable value over off-the-shelf AI capabilities.

> **Phase-parent note:** This spec.md is the only required authored parent-level spec surface. Tolerated parent docs may still exist in this folder, but detailed planning, task breakdowns, checklists, decisions, and continuity remain owned by the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and problem statement for the parent packet
- The child phase manifest for every direct `NNN-*` folder
- Canonical parent metadata needed for validation and resume flows

### Out of Scope
- Rewriting child-phase implementation details
- Deleting tolerated parent-level heavy docs that may still exist
- Recording migration history inside the parent spec body

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify/Create | parent | Lean phase-parent manifest preserving purpose and phase map |
| `description.json` | Modify | parent | Refresh packet metadata timestamp and memory history |
| `graph-metadata.json` | Modify | parent | Refresh child manifest and last-save metadata while preserving manual links |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

This phase-parent section is retrospective. It does not add new requirements; it records that child packet requirements remain the source of truth for the 001 search-intelligence stress-test phase parent, and the parent must keep those child links, status rollups, and handoff references discoverable.

- Child packet requirements stay in each child `spec.md`.
- Parent-level validation must resolve the child manifest and sibling phase references.
- Deferred or follow-up work remains in the existing handover and child packet surfaces.
<!-- /ANCHOR:requirements -->


---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This parent packet uses phased decomposition. Each direct child folder is independently resumable and remains the source of truth for detailed execution artifacts.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-scenario-design/` | Scenario Design Sub-Phase: Sub-phase 001 of the Search Intelligence Stress-Test Playbook. | complete |
| 2 | `002-scenario-execution/` | Scenario Execution Sub-Phase: Sub-phase 002 of the Search Intelligence Stress-Test Playbook. | complete |

### Phase Transition Rules

- Each child phase should validate independently before follow-on child work resumes.
- The parent spec should stay limited to root purpose, manifest, and validation-safe metadata.
- Tolerated heavy docs at the parent stay in place but do not replace the child packets as the detailed source of truth.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-scenario-design | 002-scenario-execution | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 002-scenario-execution | None | Parent manifest remains current for the completed child set. | `validate.sh --strict --no-recursive` on the child packet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None documented at the parent-manifest level.
<!-- /ANCHOR:questions -->

---

### RELATED DOCUMENTS

- **Phase children**: See direct sub-folders matching `[0-9][0-9][0-9]-*/`
- **Graph Metadata**: See `graph-metadata.json` for child pointers and save metadata
- **Stress test cycle pattern**: See `.opencode/skill/system-spec-kit/feature_catalog/14--stress-testing/01-stress-test-cycle.md` for the reusable documentation pattern derived from this baseline.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:success-criteria -->
