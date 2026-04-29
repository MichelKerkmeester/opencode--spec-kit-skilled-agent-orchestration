---
title: "Resource Map - 039 code graph catalog and playbook"
description: "File ledger for 039-code-graph-catalog-and-playbook."
trigger_phrases:
  - "039-code-graph-catalog-and-playbook resource map"
  - "code graph catalog playbook file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - "resource-map.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 45
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=37, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during 039-code-graph-catalog-and-playbook.
- **Generated**: 2026-04-29T20:29:34+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Omitted categories** have zero entries; heading numbers are intentionally not renumbered.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> `.opencode/skill/**` artifacts under that skill tree, including references, assets, catalogs, playbooks, scripts, shared helpers, and MCP server files.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/01--read-path-freshness/02-query-self-heal.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/02--manual-scan-verify-status/01-code-graph-scan.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/02--manual-scan-verify-status/02-code-graph-verify.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/02--manual-scan-verify-status/03-code-graph-status.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/03--detect-changes/01-detect-changes-preflight.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/04--context-retrieval/01-code-graph-context.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/04--context-retrieval/02-context-handler.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/02-deep-loop-graph-status.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/03-deep-loop-graph-upsert.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/04-deep-loop-graph-convergence.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/06--mcp-tool-surface/01-tool-registrations.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/01-ccc-reindex.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/03-ccc-status.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md` | Created | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/01--read-path-freshness/001-ensure-ready-selective-reindex.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/01--read-path-freshness/002-query-self-heal-stale-file.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/02--manual-scan-verify-status/003-code-graph-scan-incremental.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/02--manual-scan-verify-status/004-code-graph-scan-full.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/02--manual-scan-verify-status/006-code-graph-status-readonly.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/03--detect-changes/007-detect-changes-no-inline-index.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/04--context-retrieval/008-code-graph-context-readiness-block.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/05--coverage-graph/010-deep-loop-graph-upsert-conditional.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/07--ccc-integration/012-ccc-reindex-binary-shell-out.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/07--ccc-integration/013-ccc-feedback-jsonl-append.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/07--ccc-integration/014-ccc-status-availability-probe.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/08--doctor-code-graph/015-doctor-apply-mode-policy.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/manual_testing_playbook.md` | Created | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/research/prompts/iteration-001.md` | Created | OK | Research or prompt artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook/tasks.md` | Created | OK | Packet-local spec artifact. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Paths are repo-root relative and use the real `.opencode/specs` tree rather than the `specs` symlink.
- This map was derived from packet commit history with shared commits split by packet-owned paths and commit-body scope.
- Keep action/status vocabulary aligned with `.opencode/skill/system-spec-kit/templates/resource-map.md`.
- Preserve category precedence: Specs over Config, Meta over root READMEs, Skills over Documents, Tests over Scripts.
- Refresh this map whenever the packet receives additional touched paths or a canonical save changes packet-local metadata.
<!-- /ANCHOR:author-instructions -->
