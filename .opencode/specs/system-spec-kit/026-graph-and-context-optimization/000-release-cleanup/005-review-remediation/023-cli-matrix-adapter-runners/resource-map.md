---
title: "Resource Map - 036 cli matrix adapter runners"
description: "File ledger for 023-cli-matrix-adapter-runners."
trigger_phrases:
  - "023-cli-matrix-adapter-runners resource map"
  - "cli matrix adapter runners file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners"
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

- **Total references**: 37
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=29, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during 023-cli-matrix-adapter-runners.
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
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F10-deep-loop.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F11-hooks.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F12-validators.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F13-stress-cycle.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F14-search-w3-w13.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F2-skill-advisor.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F3-memory-search.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F4-memory-context.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F5-code-graph-query.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F6-code-graph-scan.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F7-causal-graph.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F8-cocoindex.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F9-continuity.md` | Created | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-claude-code.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts` | Created | OK | Automated test coverage touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/research/prompts/iteration-001.md` | Created | OK | Research or prompt artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/tasks.md` | Created | OK | Packet-local spec artifact. |
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
