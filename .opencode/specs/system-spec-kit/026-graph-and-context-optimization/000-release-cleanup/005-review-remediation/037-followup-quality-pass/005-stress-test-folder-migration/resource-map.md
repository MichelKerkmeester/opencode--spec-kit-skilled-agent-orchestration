---
title: "Resource Map - 037 child 005 stress test folder migration"
description: "File ledger for 037/005-stress-test-folder-migration."
trigger_phrases:
  - "037/005-stress-test-folder-migration resource map"
  - "stress test folder migration file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration"
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

- **Total references**: 39
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=10, Specs=29, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 4
- **Scope**: All files created, updated, or analyzed during 037/005-stress-test-folder-migration.
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
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph-degraded-sweep.vitest.ts` | Created | MISSING | Stress-test surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md` | Created | OK | Stress-test surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session-manager-stress.vitest.ts` | Created | MISSING | Stress-test surface touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-sweep.vitest.ts` | Removed | MISSING | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` | Updated | OK | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts` | Removed | MISSING | Automated test coverage touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md` | Updated | OK | Research or prompt artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-005.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-006.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-007.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-008.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/prompts/iteration-001.md` | Updated | OK | Review artifact captured by the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/review-report.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/checklist.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/graph-metadata.json` | Updated | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/implementation-summary.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/plan.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/review-report.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/spec.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/tasks.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/implementation-summary.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/plan.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/tasks.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/feature-catalog-impact-audit.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review_archive/011-mcp-runtime-stress-remediation-pt-01/iterations/iteration-004.md` | Updated | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/checklist.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/description.json` | Created | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/graph-metadata.json` | Created | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/implementation-summary.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/migration-plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/plan.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/spec.md` | Created | OK | Packet-local spec artifact. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/tasks.md` | Created | OK | Packet-local spec artifact. |
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
