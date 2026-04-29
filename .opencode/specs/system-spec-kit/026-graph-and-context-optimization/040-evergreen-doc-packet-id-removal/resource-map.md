---
title: "Resource Map - 040 evergreen doc packet id removal"
description: "File ledger for 040-evergreen-doc-packet-id-removal."
trigger_phrases:
  - "040-evergreen-doc-packet-id-removal resource map"
  - "evergreen packet id removal file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal"
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

- **Total references**: 65
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=57, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during 040-evergreen-doc-packet-id-removal.
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
| `.opencode/skill/cli-copilot/SKILL.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/cli-opencode/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/cli-opencode/references/agent_delegation.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/cli-opencode/references/opencode_tools.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/cli-opencode/SKILL.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` | Created | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/sk-doc/references/global/quick_reference.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/sk-doc/SKILL.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/278-memory-retention-sweep-basic-flow.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-advisor-status-rebuild-separation.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/281-code-graph-read-path-selective-self-heal.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/282-code-graph-cell-coverage-evidence.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/01--read-path-freshness/02-query-self-heal.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/02--manual-scan-verify-status/01-code-graph-scan.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/02--manual-scan-verify-status/02-code-graph-verify.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/02--manual-scan-verify-status/03-code-graph-status.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/04--context-retrieval/01-code-graph-context.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/04--context-retrieval/02-context-handler.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/02-deep-loop-graph-status.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/03-deep-loop-graph-upsert.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/04-deep-loop-graph-convergence.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/01-ccc-reindex.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/03-ccc-status.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/README.md` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/02-advisor-status.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/05-advisor-rebuild.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/INSTALL_GUIDE.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--native-mcp-tools/006-advisor-status-rebuild-separation.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Manual testing playbook surface touched by the packet. |
| `.opencode/skill/system-spec-kit/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/audit-findings.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/tasks.md` | Created | OK | Packet-local spec artifact. |
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
