---
title: "Resource Map - 033 memory retention sweep"
description: "File ledger for 020-memory-retention-sweep."
trigger_phrases:
  - "020-memory-retention-sweep resource map"
  - "memory retention sweep file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep"
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

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 19
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=11, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during 020-memory-retention-sweep.
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
| `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts` | Created | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Created | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/research/prompts/iteration-001.md` | Created | OK | Research or prompt artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep/tasks.md` | Created | OK | Packet-local spec artifact. |
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
