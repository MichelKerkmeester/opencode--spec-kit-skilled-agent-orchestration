---
title: "Resource Map - 037 child 001 sk-code-opencode audit"
description: "File ledger for 037/001-sk-code-opencode-audit."
trigger_phrases:
  - "037/001-sk-code-opencode-audit resource map"
  - "sk-code-opencode audit file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit"
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

- **Total references**: 38
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=26, Specs=12, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during 037/001-sk-code-opencode-audit.
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
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | Updated | OK | CLI matrix runner surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-claude-code.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts` | Created | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/audit-findings.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/research/prompts/iteration-001.md` | Created | OK | Research or prompt artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/tasks.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/spec.md` | Created | OK | Packet-local spec artifact. |
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
