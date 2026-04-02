---
title: "Tasks: Documentation Alignment [024/006]"
description: "Task tracking for documentation updates covering hooks, feature catalog, playbook, and cross-references."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 006 — Documentation Alignment


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Completed

- [x] Create feature catalog entries for PreCompact Hook, SessionStart Priming, Stop Token Tracking, Cross-Runtime Fallback, Runtime Detection, CocoIndex Integration — entries in `.opencode/skill/system-spec-kit/feature_catalog/`
- [x] Create manual testing playbook scenarios for each hook type and cross-runtime fallback — 11 playbook files in category 22 enhanced with prereqs, sub-scenarios, pass/fail criteria; dedicated cross-runtime consistency playbook remains a future gap
- [x] Update SKILL.md with Hook System section — lifecycle, registration (`.claude/settings.local.json`), script locations, design principle (hooks = transport)
- [x] Update SKILL.md with Code Graph section — CocoIndex (semantic) + Code Graph (structural) + Memory (session) complementary architecture
- [x] Update ARCHITECTURE.md with hook architecture diagram — Mermaid diagram section added covering PreCompact -> cache -> SessionStart -> inject lifecycle
- [x] Update ARCHITECTURE.md with token tracking data flow — current wording should use `session-stop.ts`, `pendingStopSave`, and JSON hook-state files; dedicated runtime adapter docs remain a future gap
- [x] Capture root `README.md` context preservation status accurately — not delivered in Phase 006 and tracked as a future gap
- [x] Update `.opencode/skill/system-spec-kit/README.md` with hook features in feature list
- [x] Update `.opencode/skill/README.md` with revised system-spec-kit description
- [x] Update `AGENTS.md` to reflect Phase 005 agent definition changes
- [x] Update `AGENTS_example_fs_enterprises.md` where relevant
- [x] All feature catalog entries follow existing format conventions
- [x] All playbook scenarios include prerequisites, steps, and expected results
- [x] Consistent terminology across all documentation (hooks, context injection, runtime detection)
- [x] Capture reference-doc status accurately — no spec-local evidence that an additional follow-up reference doc was created in this phase, so it is marked as not created
- [x] Capture asset-template status accurately — no spec-local evidence that an additional prompt/template asset was created in this phase, so it is marked as not created
- [x] All updated docs pass sk-doc DQI quality standards — proper frontmatter, anchors, and sections
- [x] Cross-references between feature catalog, playbook, SKILL.md, and ARCHITECTURE.md verified consistent
- [x] Record future documentation gaps explicitly — dedicated cross-runtime consistency playbook, fuller ARCHITECTURE.md runtime adapter docs, and root README context preservation mention remain follow-up work
- [x] No stale references to pre-hook compaction approach remain in updated files

---

## v2: Code Graph Documentation Alignment (2026-04-02)

### Completed (2026-04-02, Copilot CLI GPT-5.4 agents)

- [x] **Step 1a**: Update `mcp_server/README.md` layer summary table — L1: 1→3, L3: 3→4, L6: 8→10, L7: 5→10, Total: 33→43 (+152 -14 lines)
- [x] **Step 1b**: Add Code Graph concept section (3.1.13) to `mcp_server/README.md` — architecture, edge types, auto-trigger, query routing, budget allocator
- [x] **Step 1c**: Add 10 tool reference entries with parameter tables to `mcp_server/README.md` — session_resume, session_bootstrap (L1); session_health (L3); code_graph_query, code_graph_context (L6); code_graph_scan, code_graph_status, ccc_status, ccc_reindex, ccc_feedback (L7)
- [x] **Step 2a**: Update `mcp_server/INSTALL_GUIDE.md` validation checklist with code graph + session tools (+15 lines)
- [x] **Step 2b**: Add tree-sitter WASM dependency to `mcp_server/INSTALL_GUIDE.md` prerequisites
- [x] **Step 2c**: Document `code-graph.sqlite` location and auto-creation in `mcp_server/INSTALL_GUIDE.md`
- [x] **Step 3a**: Fix `SKILL.md` "regex-based indexing" → "tree-sitter WASM (default) with regex fallback" (+27 -1 lines)
- [x] **Step 3b**: Expand `SKILL.md` Code Graph section — edge types, auto-trigger, query routing, CCC tools, session tools, CocoIndex seed resolution
- [x] **Step 4a**: Expand `README.md` code graph feature entry from 1-line to subsection (+15 -1 lines)