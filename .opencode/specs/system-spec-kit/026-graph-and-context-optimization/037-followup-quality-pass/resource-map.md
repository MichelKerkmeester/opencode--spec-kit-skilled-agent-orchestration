---
title: "Resource Map - 037 followup quality pass phase parent"
description: "File ledger for 037-followup-quality-pass."
trigger_phrases:
  - "037-followup-quality-pass resource map"
  - "followup quality pass file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass"
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

- **Total references**: 18
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=9, Specs=9, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: Parent-aggregate map across the 6 children of 037-followup-quality-pass
- **Generated**: 2026-04-29T20:29:34+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Omitted categories** have zero entries; heading numbers are intentionally not renumbered.
> **Mode**: parent-aggregate; per-child maps also exist because this finalization packet explicitly requires both levels.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> `.opencode/skill/**` artifacts under that skill tree, including references, assets, catalogs, playbooks, scripts, shared helpers, and MCP server files.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/feature_catalog/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/skill/system-spec-kit/mcp_server/**/*.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/skill/system-spec-kit/README.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Updated | OK | Skill or runtime documentation/code touched by the packet. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` spec folders, phase children, packet docs, research, review, scratch. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/002-feature-catalog-trio/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/003-testing-playbook-trio/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/004-sk-doc-template-alignment/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/006-readme-cascade-refresh/` | Updated | OK | Aggregate directory touched by child packet work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/description.json` | Updated | OK | Packet discovery metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/graph-metadata.json` | Updated | OK | Packet graph metadata refreshed by canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/spec.md` | Updated | OK | Packet-local spec artifact. |
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
