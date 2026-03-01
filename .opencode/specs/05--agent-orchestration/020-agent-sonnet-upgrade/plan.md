---
title: "Implementation Plan: Agent Sonnet 4.6 Upgrade [020-agent-sonnet-upgrade/plan]"
description: "This plan covers upgrading model field assignments across two agent directories: the Copilot fleet (.opencode/agent/copilot/) and the Claude Code agent set (.claude/agents/). Th..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "agent"
  - "sonnet"
  - "upgrade"
  - "020"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Agent Sonnet 4.6 Upgrade

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent configuration files) |
| **Framework** | OpenCode agent system + GitHub Copilot Chat |
| **Storage** | File system — `.opencode/agent/copilot/` and `.claude/agents/` |
| **Testing** | Manual inspection; no automated tests for agent config |

### Overview

This plan covers upgrading model field assignments across two agent directories: the Copilot fleet (`.opencode/agent/copilot/`) and the Claude Code agent set (`.claude/agents/`). The approach is a direct find-and-replace of model identifier strings within frontmatter or metadata sections of Markdown agent files, with two agents (research, debug) having their model field deleted to enable orchestrator-level dispatch. No code logic is changed — only configuration metadata.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (model ID `claude-sonnet-4-6` confirmed as valid)

### Definition of Done

- [x] All 10 agent files reflect correct model assignment
- [x] Tests passing (manual file inspection for each file)
- [x] Docs updated — spec/plan/tasks/checklist/implementation-summary created
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Configuration management — flat file metadata update across two directory namespaces.

### Key Components

- **Copilot agents** (`.opencode/agent/copilot/`): 7 files; 5 upgraded, 2 have model field removed
- **Claude Code agents** (`.claude/agents/`): 3 files; all upgraded

### Data Flow

Agent loads → reads frontmatter `model:` field → dispatches to specified model (or inherits from parent if field absent). No runtime data flow changes — this is purely a load-time configuration read.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory and Verification

- [x] List all target agent files in both directories
- [x] Read each file to identify current model field value
- [x] Confirm model ID string `github-copilot/claude-sonnet-4-6` is correct for Copilot
- [x] Confirm model ID string `sonnet` is correct for Claude Code agents

### Phase 2: Core Implementation

- [x] Update `.opencode/agent/copilot/context.md` — `haiku-4.5` → `sonnet-4-6`
- [x] Update `.opencode/agent/copilot/handover.md` — `haiku-4.5` → `sonnet-4-6`
- [x] Update `.opencode/agent/copilot/review.md` — add model field `sonnet-4-6`; remove stale comment
- [x] Update `.opencode/agent/copilot/speckit.md` — `sonnet-4.5` → `sonnet-4-6`
- [x] Update `.opencode/agent/copilot/write.md` — `sonnet-4.5` → `sonnet-4-6`
- [x] Update `.opencode/agent/copilot/research.md` — delete `model:` line
- [x] Update `.opencode/agent/copilot/debug.md` — delete `model:` line
- [x] Update `.claude/agents/context.md` — `haiku` → `sonnet`
- [x] Update `.claude/agents/handover.md` — `haiku` → `sonnet`
- [x] Update `.claude/agents/review.md` — `opus` → `sonnet`

### Phase 3: Verification

- [x] Manually verify each file reflects the correct final model value
- [x] Confirm no stale model strings remain in any of the 10 files
- [x] Changelog entry written at `.opencode/changelog/00--opencode-environment/v2.1.3.0.md`
- [x] Release tagged as v2.1.3.0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual inspection | All 10 agent files — model field value | Read tool (file-by-file) |
| Diff review | Confirm only model-field lines changed | git diff pre/post |
| Negative check | research.md and debug.md have no `model:` line | grep absence check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `github-copilot/claude-sonnet-4-6` model availability | External (Copilot platform) | Green | Fleet agents would fall back to platform default |
| `claude-sonnet-4-6` in Claude Code model list | External (Anthropic) | Green | Claude Code agents would use prior model |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent load failure or unexpected model behaviour post-upgrade
- **Procedure**: `git revert` the commit tagged v2.1.3.0 to restore all 10 files to prior model values
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Implementation) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Implementation |
| Implementation | Inventory | Verify |
| Verify | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 15 minutes |
| **Total** | **Low** | **~1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No data migrations — configuration-only changes
- [x] No feature flags required
- [x] No monitoring alerts needed for config-file changes

### Rollback Procedure

1. Run `git revert <commit-hash>` for the v2.1.3.0 commit
2. Verify all 10 agent files restored to prior model values via `git diff HEAD~1`
3. No user-facing notification required (internal tooling change)

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A — git revert is sufficient
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
