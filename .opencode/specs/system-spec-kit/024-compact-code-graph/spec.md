---
title: "Feature Specification: Hybrid Context Injection — Hook + Tool Architecture"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Spec: Hybrid Context Injection — Hook + Tool Architecture"
trigger_phrases:
  - "spec"
  - "hybrid"
  - "context"
  - "injection"
  - "hook"
  - "024"
  - "compact"
  - "plan"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
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

# Feature Specification: Hybrid Context Injection — Hook + Tool Architecture

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | None |
| **Parent Packet** | `system-spec-kit` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Parent spec stays lean, child manifest stays accurate, and strict parent validation introduces no new errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `024-compact-code-graph` packet spans a large phased workstream, but the parent folder originally had metadata without a canonical root `spec.md`. Without that lean parent manifest, validation and resume flows had to infer intent from child packets and graph metadata instead of a stable root spec.

### Purpose
Provide a lean phase-parent manifest for the hybrid context injection and compact code graph workstream while preserving the existing child phases, tolerated parent-level history folders, and graph metadata links.

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

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This parent packet uses phased decomposition. Each direct child folder is independently resumable and remains the source of truth for detailed execution artifacts.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-precompact-hook/` | Phase 1: Compaction Context Injection (PreCompact + SessionStart): Template compliance shim section. | complete |
| 2 | `002-session-start-hook/` | Phase 2: SessionStart Hook — Session Priming: Template compliance shim section. | complete |
| 3 | `003-stop-hook-tracking/` | Phase 3: Stop Hook + Token Tracking: Template compliance shim section. | complete |
| 4 | `004-cross-runtime-fallback/` | Phase 4: Cross-Runtime Fallback: Template compliance shim section. | complete |
| 5 | `005-command-agent-alignment/` | Phase 5: Command & Agent Alignment: Template compliance shim section. | complete |
| 6 | `006-documentation-alignment/` | Phase 6: Documentation Alignment: Template compliance shim section. | complete |
| 7 | `007-testing-validation/` | Phase 7: Testing & Validation: Template compliance shim section. | complete |
| 8 | `008-structural-indexer/` | Phase 008: Structural Indexer (tree-sitter): Template compliance shim section. | complete |
| 9 | `009-code-graph-storage-query/` | Phase 009: Code Graph Storage + Query: Template compliance shim section. | complete |
| 10 | `010-cocoindex-bridge-context/` | Phase 010: CocoIndex Bridge + code_graph_context: Template compliance shim section. | complete |
| 11 | `011-compaction-working-set/` | Phase 011: Compaction Working-Set Integration: Template compliance shim section. | complete |
| 12 | `012-cocoindex-ux-utilization/` | Phase 012 — CocoIndex UX, Utilization & Usefulness: Template compliance shim section. | complete |
| 13 | `013-correctness-boundary-repair/` | Phase 013 — Correctness & Boundary Repair: Template compliance shim section. | complete |
| 14 | `014-hook-durability-auto-enrichment/` | Phase 014 — Hook Durability & Auto-Enrichment: Template compliance shim section. | complete |
| 15 | `015-tree-sitter-migration/` | Phase 015 — Tree-Sitter WASM Migration: Template compliance shim section. | complete |
| 16 | `016-cross-runtime-ux/` | Phase 016 — Cross-Runtime UX & Documentation: Template compliance shim section. | complete |
| 17 | `017-tree-sitter-classifier-fixes/` | Phase 017: Tree-Sitter & Query-Intent Classifier Fixes: Template compliance shim section. | complete |
| 18 | `018-non-hook-auto-priming/` | Phase 018: Non-Hook CLI Auto-Priming & Session Health: Template compliance shim section. | complete |
| 19 | `019-code-graph-auto-trigger/` | Phase 019: Code Graph Auto-Trigger: Template compliance shim section. | complete |
| 20 | `020-query-routing-integration/` | Query-Routing Integration [024/020]: Template compliance shim section. | complete |
| 21 | `021-cross-runtime-instruction-parity/` | Phase 021: Cross-Runtime Instruction Parity: Template compliance shim section. | complete |
| 22 | `022-gemini-hook-porting/` | Phase 022: Gemini CLI Hook Porting: Template compliance shim section. | complete |
| 23 | `023-context-preservation-metrics/` | Phase 023 — Context Preservation Metrics: Template compliance shim section. | complete |
| 24 | `024-hookless-priming-optimization/` | Phase 024: Hookless Priming Optimization: Template compliance shim section. | complete |
| 25 | `025-tool-routing-enforcement/` | Tool Routing Enforcement: This is **Phase 025** of the compact-code-graph specification. | complete |
| 26 | `026-session-start-injection-debug/` | Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff: This is **Phase 26** of the Compact Code Graph specification. | complete |
| 27 | `027-opencode-structural-priming/` | OpenCode Structural Priming: This is **Phase 27** under the Compact Code Graph packet. | complete |
| 28 | `028-startup-highlights-remediation/` | Startup Highlights Remediation: Fix 3 P1 correctness findings from the deep review (2026-04-02) in `queryStartupHighlights()`. | complete |
| 29 | `029-review-remediation/` | Review Remediation: The completed deep review for `024-compact-code-graph` found seven active issues that leave the packet internally inconsistent across runtime contracts, hook safety, evidence traceability, and cross-runtime guidance. | complete |
| 30 | `030-opencode-graph-plugin/` | OpenCode Graph Plugin Phased Execution: Packet `030-opencode-graph-plugin` is no longer just a research packet. | complete |
| 31 | `031-normalized-analytics-reader/` | Normalized Analytics Reader: Packet `024/003` proved the Stop hook can persist useful session-end facts, but those facts still lived in per-session hook-state JSON and could not answer cross-session questions safely. | complete |
| 32 | `032-cached-summary-fidelity-gates/` | Cached Summary Fidelity Gates: Route the next continuity packet into the existing 024 train by turning cached summaries into a guarded consumer instead of a new authority surface. | complete |
| 33 | `033-fts-forced-degrade-hardening/` | FTS Forced-Degrade Hardening: Create the conditional follow-on packet the refined plan left behind a runtime audit. | complete |
| 34 | `034-workflow-split-and-token-insight-contracts/` | Workflow Split and Token Insight Contracts: Hold the optional tail packet that the refined plan keeps after cached-summary and publication work. | complete |

### Phase Transition Rules

- Each child phase should validate independently before follow-on child work resumes.
- The parent spec should stay limited to root purpose, manifest, and validation-safe metadata.
- Tolerated heavy docs at the parent stay in place but do not replace the child packets as the detailed source of truth.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-precompact-hook | 002-session-start-hook | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 002-session-start-hook | 003-stop-hook-tracking | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 003-stop-hook-tracking | 004-cross-runtime-fallback | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 004-cross-runtime-fallback | 005-command-agent-alignment | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 005-command-agent-alignment | 006-documentation-alignment | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 006-documentation-alignment | 007-testing-validation | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 007-testing-validation | 008-structural-indexer | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 008-structural-indexer | 009-code-graph-storage-query | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 009-code-graph-storage-query | 010-cocoindex-bridge-context | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 010-cocoindex-bridge-context | 011-compaction-working-set | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 011-compaction-working-set | 012-cocoindex-ux-utilization | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 012-cocoindex-ux-utilization | 013-correctness-boundary-repair | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 013-correctness-boundary-repair | 014-hook-durability-auto-enrichment | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 014-hook-durability-auto-enrichment | 015-tree-sitter-migration | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 015-tree-sitter-migration | 016-cross-runtime-ux | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 016-cross-runtime-ux | 017-tree-sitter-classifier-fixes | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 017-tree-sitter-classifier-fixes | 018-non-hook-auto-priming | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 018-non-hook-auto-priming | 019-code-graph-auto-trigger | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 019-code-graph-auto-trigger | 020-query-routing-integration | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 020-query-routing-integration | 021-cross-runtime-instruction-parity | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 021-cross-runtime-instruction-parity | 022-gemini-hook-porting | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 022-gemini-hook-porting | 023-context-preservation-metrics | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 023-context-preservation-metrics | 024-hookless-priming-optimization | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 024-hookless-priming-optimization | 025-tool-routing-enforcement | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 025-tool-routing-enforcement | 026-session-start-injection-debug | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 026-session-start-injection-debug | 027-opencode-structural-priming | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 027-opencode-structural-priming | 028-startup-highlights-remediation | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 028-startup-highlights-remediation | 029-review-remediation | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 029-review-remediation | 030-opencode-graph-plugin | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 030-opencode-graph-plugin | 031-normalized-analytics-reader | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 031-normalized-analytics-reader | 032-cached-summary-fidelity-gates | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 032-cached-summary-fidelity-gates | 033-fts-forced-degrade-hardening | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 033-fts-forced-degrade-hardening | 034-workflow-split-and-token-insight-contracts | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 034-workflow-split-and-token-insight-contracts | None | Parent manifest remains current for the completed child set. | `validate.sh --strict --no-recursive` on the child packet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None documented at the parent-manifest level.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See direct sub-folders matching `[0-9][0-9][0-9]-*/`
- **Graph Metadata**: See `graph-metadata.json` for child pointers and save metadata
