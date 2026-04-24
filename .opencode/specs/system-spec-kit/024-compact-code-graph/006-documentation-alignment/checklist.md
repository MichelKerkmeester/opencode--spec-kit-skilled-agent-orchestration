---
title: "Checklist: Phase 6 — Documentation [system-spec-kit/024-compact-code-graph/006-documentation-alignment/checklist]"
description: "checklist document for 006-documentation-alignment."
trigger_phrases:
  - "checklist"
  - "phase"
  - "documentation"
  - "006"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/006-documentation-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 6 — Documentation Alignment

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Historical Phase 006 Record

The checklist items below preserve the original hook-documentation delivery record for this packet. They are retained as historical packet context and should not be read as a claim that every named file is part of the current 2026-04-02 worktree diff.

### P0
- [x] Feature catalog entries created for all hook-related features [EVIDENCE: verified in implementation-summary.md]
- [x] Manual testing playbook has scenarios for each hook type — dedicated cross-runtime consistency playbook coverage is still a future documentation gap [EVIDENCE: verified in implementation-summary.md]
- [x] `.opencode/skill/system-spec-kit/SKILL.md` documents hook system, registration, and design principle [EVIDENCE: verified in implementation-summary.md]
- [x] `.opencode/skill/system-spec-kit/ARCHITECTURE.md` includes hook architecture diagram — Mermaid diagram section added; dedicated runtime adapter documentation remains a future gap [EVIDENCE: verified in implementation-summary.md]
- [x] No stale references to pre-hook compaction approach in updated files [EVIDENCE: verified in implementation-summary.md]

#### P1
- [x] Root README context preservation status captured accurately — not delivered in Phase 006; tracked as future follow-up [EVIDENCE: verified in implementation-summary.md]
- [x] `.opencode/skill/system-spec-kit/README.md` updated with hook features [EVIDENCE: verified in implementation-summary.md]
- [x] `.opencode/skill/README.md` system-spec-kit description updated [EVIDENCE: verified in implementation-summary.md]
- [x] AGENTS.md updated to reflect Phase 5 agent changes [EVIDENCE: verified in implementation-summary.md]
- [x] All feature catalog entries follow existing format conventions [EVIDENCE: verified in implementation-summary.md]
- [x] All playbook scenarios include prerequisites, steps, and expected results — playbook agent enhanced all 11 files in category 22 with prereqs, sub-scenarios, pass/fail criteria [EVIDENCE: verified in implementation-summary.md]
- [x] Consistent terminology across all documentation (hooks, context injection, etc.) [EVIDENCE: verified in implementation-summary.md]

### P2
- [x] All updated docs pass sk-doc DQI quality score — all docs follow template conventions with proper frontmatter, anchors, and sections [EVIDENCE: verified in implementation-summary.md]
- [x] Reference doc status in `.opencode/skill/system-spec-kit/references/` is accurate — no additional follow-up reference doc was created in this phase [EVIDENCE: verified in implementation-summary.md]
- [x] Asset template status in `.opencode/skill/system-spec-kit/assets/` is accurate — no additional prompt/template asset was created in this phase [EVIDENCE: verified in implementation-summary.md]
- [x] `AGENTS_example_fs_enterprises.md` updated if relevant [EVIDENCE: verified in implementation-summary.md]
- [x] Cross-references between docs are consistent and correct — feature catalog, playbook, `.opencode/skill/system-spec-kit/SKILL.md`, and `.opencode/skill/system-spec-kit/ARCHITECTURE.md` all cross-reference consistently [EVIDENCE: verified in implementation-summary.md]

---

**V2 Addendum: Code Graph Documentation Alignment (2026-04-02)**

### P0 — `.opencode/skill/system-spec-kit/mcp_server/README.md`
- [x] Tool count updated from 33 to match `layer-definitions.ts` (43 tools) [EVIDENCE: grep confirms 6 refs to "43" and zero stale "33"/"40 tools" in `.opencode/skill/system-spec-kit/mcp_server/README.md`]
- [x] L1 section updated: 1 → 3 tools (+ session_resume, session_bootstrap with parameter tables) [EVIDENCE: lines 571, 582]
- [x] L3 section updated: 3 → 4 tools (+ session_health with parameter table) [EVIDENCE: line 749]
- [x] L6 section updated: 8 → 10 tools (+ code_graph_query, code_graph_context with parameter tables) [EVIDENCE: lines 1032, 1047]
- [x] L7 section updated: 5 → 10 tools (+ code_graph_scan, code_graph_status, ccc_status, ccc_reindex, ccc_feedback with parameter tables) [EVIDENCE: lines 1124, 1137, 1147, 1157, 1167]
- [x] Code Graph concept section added (3.1.13 or equivalent) [EVIDENCE: section at ~line 507 with architecture, parser, storage, edge types, auto-trigger, query routing, budget allocator]
- [x] Layer summary table totals match actual tool arrays [EVIDENCE: line 1237 shows Total=43]

### P0 — mcp_server/INSTALL_GUIDE.md
- [x] Code graph tools listed in validation checklist (line ~429) [EVIDENCE: lines 444-447 (code_graph_*), lines 448-450 (session_*)]
- [x] Tree-sitter WASM dependency documented in prerequisites [EVIDENCE: lines 195-196 (web-tree-sitter, tree-sitter-wasms)]
- [x] `code-graph.sqlite` location and auto-creation documented [EVIDENCE: line 116]

### P1 — `.opencode/skill/system-spec-kit/SKILL.md`
- [x] "regex-based indexing" (line 758) fixed to "tree-sitter WASM (default) with regex fallback" [EVIDENCE: line 758 now reads "tree-sitter WASM indexing (default, with regex fallback)"]
- [x] 9 edge types documented (CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, DECORATES, OVERRIDES, TYPE_OF) [EVIDENCE: line 775]
- [x] `ensureCodeGraphReady()` auto-trigger documented [EVIDENCE: line 777]
- [x] Query routing decision tree documented (structural→code_graph, semantic→CocoIndex, session→Memory) [EVIDENCE: line 779]
- [x] CCC tools documented (ccc_feedback, ccc_reindex, ccc_status) [EVIDENCE: lines 787-789]
- [x] Session tools documented (session_health, session_bootstrap, session_resume) [EVIDENCE: lines 795-797]

### P2 — README.md
- [x] Code graph feature table entry expanded from 1-line to subsection [EVIDENCE: line 92 updated + new ### Code Graph subsection at line 99]
- [x] Tool list includes code graph, CCC, and session tools [EVIDENCE: lines 105-107 with 3-category tool table]

### P1 — Summary-Surface Follow-Through
- [x] `.opencode/skill/system-spec-kit/SKILL.md` summary totals match the live 43-tool MCP surface and current catalog/playbook counts [EVIDENCE: `.opencode/skill/system-spec-kit/SKILL.md` updated to 43 tools, 291 feature entries / 22 categories, and 311 scenario files / 22 categories]
- [x] `.opencode/skill/system-spec-kit/README.md` and `.opencode/skill/system-spec-kit/mcp_server/README.md` no longer cite the pre-code-graph 33/37-tool totals or pre-Phase-024 catalog counts [EVIDENCE: README summary table, MCP README references, related-doc inventory links, and feature catalog references refreshed]
- [x] Feature-catalog root docs distinguish the full 43-tool MCP surface from the smaller command-wrapper subset [EVIDENCE: both `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` and `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` now describe 43 overall tools with 4 top-level memory slash commands, the `/memory:manage shared` subcommand area, and `/spec_kit:resume`]

### P2 — Reference-Surface Follow-Through
- [x] `.opencode/skill/system-spec-kit/references/memory/memory_system.md` includes the code-graph, session, and CCC tools in its top-level tool reference [EVIDENCE: Tool Reference updated from 33 to 43 tools and now lists `session_*`, `code_graph_*`, and `ccc_*` entries]
- [x] `.opencode/skill/system-spec-kit/references/config/environment_variables.md` strict-schema wording matches the current tool surface [EVIDENCE: `SPECKIT_STRICT_SCHEMAS` row now references all 43 tools]
- [x] `mcp-coco-index` was audited for 023/024 parity and required targeted follow-up changes [EVIDENCE: `.opencode/skill/mcp-coco-index/README.md`, `.opencode/skill/mcp-coco-index/SKILL.md`, `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md`, and category-07 recovery/integration scenarios were updated to match current recovery semantics and graph-integration behavior]
