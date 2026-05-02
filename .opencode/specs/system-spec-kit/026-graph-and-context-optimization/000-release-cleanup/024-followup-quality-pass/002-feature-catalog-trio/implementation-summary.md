---
title: "Implementation Summary: 037/002 feature-catalog-trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Updated feature catalogs for packet 031-036 surfaces while keeping the packet doc-only and line-cited."
trigger_phrases:
  - "037-002-feature-catalog-trio"
  - "feature catalog updates"
  - "catalog refresh 031-036"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - "discovery-notes.md"
      - ".opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-002-feature-catalog-trio"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone code_graph feature catalog was missing; existing system-spec-kit code-graph entry updated instead."
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
| **Spec Folder** | 002-feature-catalog-trio |
| **Completed** | 2026-04-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The catalogs now reflect the packet 031-036 surfaces that were already shipped in code. The update keeps the docs current without touching runtime code: new MCP tools and handlers are line-cited, matrix runner files are documented only because packet 036 is present, and the missing standalone code_graph catalog is recorded instead of invented.

### System-spec-kit catalog

Updated the root tool count from 51 to 54, added `memory_retention_sweep` to the memory manage surface, and added feature entries for retention sweep, CLI matrix adapter runners, and the Codex freshness smoke check. The existing code-graph readiness entry now states the packet 032 read-path/manual freshness contract and packet 035 native/local matrix status.

### Skill Advisor catalog

Added the `advisor_rebuild` MCP tool as a first-class MCP surface entry and updated `advisor_status` to state its diagnostic-only contract. The root Skill Advisor catalog count now reflects 37 features and the MCP surface group now lists five entries.

### Discovery notes

Created `discovery-notes.md` with the exact catalog locations found, template paths read, packet 036 presence, and the missing standalone code_graph catalog gap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `discovery-notes.md` | Created | Record catalog/template discovery and the code_graph gap |
| `spec.md` | Created | Define Level 2 scope and requirements |
| `plan.md` | Created | Define doc-only implementation and validation plan |
| `tasks.md` | Created | Track packet phases |
| `checklist.md` | Created | Track verification evidence |
| `description.json` | Created | Memory/search metadata |
| `graph-metadata.json` | Created | Packet graph metadata and dependencies |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Update tool count and root catalog summaries |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md` | Created | Add retention sweep catalog entry |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` | Created | Add CLI matrix runner catalog entry |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/38-codex-hook-freshness-smoke-check.md` | Created | Add Codex freshness smoke-check catalog entry |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Modified | Add no-watcher read-path/manual freshness note |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md` | Modified | Add `advisor_rebuild` to MCP surface |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/02-advisor-status.md` | Modified | Mark `advisor_status` diagnostic-only |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/05-advisor-rebuild.md` | Created | Add `advisor_rebuild` catalog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed sk-doc's feature-catalog shape: root catalog summaries stay compact and per-feature files carry source references. Existing local catalog conventions were preserved, including lowercase `feature_catalog` root names and category-local numbered files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Did not create a standalone code_graph catalog | Discovery did not find one, and the user explicitly said not to fabricate missing catalogs |
| Updated existing code-graph readiness entry | The code-graph catalog material lives inside system-spec-kit category 22 today |
| Left non-catalog READMEs alone | The packet scope is feature catalogs only and the worktree already had unrelated README changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Discovery commands | PASS: catalog and template paths recorded in `discovery-notes.md` |
| Packet 036 presence | PASS: `mcp_server/matrix_runners/adapter-cli-*.ts` files found |
| Tool count | PASS: `TOOL_DEFINITIONS.length` resolved to 54 from built MCP server module |
| sk-doc validation | PASS: modified root catalogs and per-feature entries passed `validate_document.py --blocking-only` |
| Strict packet validation | PASS: `validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio --strict` exited 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No standalone code_graph catalog exists.** The packet documents this gap and updates the existing system-spec-kit code-graph catalog entry instead.
<!-- /ANCHOR:limitations -->
