---
title: "Resource Map - 034 half auto upgrades"
description: "File ledger for 021-half-auto-upgrades."
trigger_phrases:
  - "021-half-auto-upgrades resource map"
  - "half auto upgrades file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades"
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

- **Total references**: 28
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=20, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during 021-half-auto-upgrades.
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
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts` | Created | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts` | Created | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/index.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-runtime-parity.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts` | Created | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/index.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/research/prompts/iteration-001.md` | Created | OK | Research or prompt artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/tasks.md` | Created | OK | Packet-local spec artifact. |
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
