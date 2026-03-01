---
title: "Task 04 — Agent Configs Audit [task-04-agent-alignment/spec]"
description: "Audit agent configuration files across all 3 platforms (OpenCode, Claude Code, Codex) to ensure handover model assignment (spec 016), review model-agnostic configuration (spec 0..."
trigger_phrases:
  - "task"
  - "agent"
  - "configs"
  - "audit"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Task 04 — Agent Configs Audit

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Parent Spec** | 130 — Memory Overhaul & Agent Upgrade Release |
| **Task** | 04 of 07 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
| **Depends On** | None (parallel with Tasks 01, 02, 03) |
| **Blocks** | Task 05 (Changelog Updates) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## Purpose

Audit agent configuration files across all 3 platforms (OpenCode, Claude Code, Codex) to ensure handover model assignment (spec 016), review model-agnostic configuration (spec 015), Codex-native frontmatter format (spec 016), and AGENTS.md routing rules (spec 014) are correct and consistent.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## Scope

### OpenCode Agent Configs (P0)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/agent/handover.md` | Model = haiku (spec 016) |
| `.opencode/agent/review.md` | Model-agnostic (spec 015) — no hardcoded model |
| `.opencode/agent/context.md` | Agent routing description current |
| `.opencode/agent/speckit.md` | Agent routing description current |
| `.opencode/agent/write.md` | Agent routing description current |
| `.opencode/agent/debug.md` | Agent routing description current |
| `.opencode/agent/research.md` | Agent routing description current |
| `.opencode/agent/orchestrate.md` | Agent routing description current |

### Claude Code Agent Configs (P0)

| File | Key Audit Points |
|------|-----------------|
| `.claude/agents/handover.md` | Model = haiku (spec 016) |
| `.claude/agents/review.md` | Model-agnostic (spec 015) |
| `.claude/agents/context.md` | Agent description current |
| `.claude/agents/speckit.md` | Agent description current |
| `.claude/agents/write.md` | Agent description current |
| `.claude/agents/debug.md` | Agent description current |
| `.claude/agents/research.md` | Agent description current |
| `.claude/agents/orchestrate.md` | Agent description current |

### Codex Agent Configs (P0)

| File | Key Audit Points |
|------|-----------------|
| `.codex/agents/handover.md` | Profile = fast, Codex-native frontmatter (spec 016) |
| `.codex/agents/review.md` | Profile = readonly, Codex-native frontmatter (spec 016) |
| `.codex/agents/context.md` | Profile = fast, Codex-native frontmatter |
| `.codex/agents/speckit.md` | Profile = balanced, Codex-native frontmatter |
| `.codex/agents/write.md` | Profile = balanced, Codex-native frontmatter |
| `.codex/agents/debug.md` | Profile = powerful, Codex-native frontmatter |
| `.codex/agents/research.md` | Profile = powerful, Codex-native frontmatter |
| `.codex/agents/orchestrate.md` | Profile = powerful, Codex-native frontmatter |

### Codex Config (P0)

| File | Key Audit Points |
|------|-----------------|
| `.codex/config.toml` | 4 profiles (fast, balanced, powerful, readonly), sub-agent dispatch MCP |

### AGENTS.md (P1)

| File | Key Audit Points |
|------|-----------------|
| `AGENTS.md` | Routing rules reflect spec 014 additions, handover = Haiku, review = model-agnostic |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:audit-criteria -->
## Audit Criteria

### Model Assignments (spec 016)

1. **Handover agent**: Must be Haiku on all platforms
   - OpenCode: `model: haiku`
   - Claude Code: `model: haiku`
   - Codex: `profile: fast`
2. **Review agent**: Must be model-agnostic (spec 015)
   - OpenCode: No model field or model-agnostic
   - Claude Code: No model field or model-agnostic
   - Codex: `profile: readonly`

### Codex Frontmatter Format (spec 016)

All `.codex/agents/*.md` files must use Codex-native frontmatter:
- `profile:` field (not `model:`)
- `sandbox_mode:` field
- `approval_policy:` field
- No Claude Code fields: `tools:`, `mcpServers:`, `name:`, `description:`

### Profile-to-Agent Mapping

| Agent | Profile | Sandbox |
|-------|---------|---------|
| context | fast | read-only |
| handover | fast | workspace-write |
| speckit | balanced | workspace-write |
| write | balanced | workspace-write |
| debug | powerful | workspace-write |
| research | powerful | workspace-write |
| review | readonly | read-only |
| orchestrate | powerful | workspace-write |

### AGENTS.md Routing (spec 014)

1. All agent routing rules from spec 014 present
2. Handover = Haiku noted
3. Review = model-agnostic noted
4. 8 agents listed with descriptions

### Cross-Platform Consistency

1. Agent body content identical across all 3 platforms (only frontmatter differs)
2. Agent descriptions match between platforms
<!-- /ANCHOR:audit-criteria -->

---

<!-- ANCHOR:output -->
## Expected Output

The implementer should populate `changes.md` with:
- One section per file requiring changes
- Each section listing the specific content to update
- Before/after text for each change
- Priority (P0/P1/P2) for each change
<!-- /ANCHOR:output -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Criteria

1. All 8 OpenCode agent configs audited
2. All 8 Claude Code agent configs audited
3. All 8 Codex agent configs audited with Codex-native frontmatter verification
4. `.codex/config.toml` verified (4 profiles, sub-agent MCP)
5. `AGENTS.md` routing rules verified
6. Cross-platform consistency verified (body content matches)
7. changes.md has no placeholder text
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:approval-workflow -->
## Approval Workflow

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Audit Plan Review | Spec Owner | Approved | 2026-02-16 |
| Changes Review | Tech Lead | Pending | TBD |
| Implementation Complete | Spec Owner | Pending | TBD |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## Compliance Checkpoints

### Documentation Standards
- [ ] All agent configs use correct platform-specific frontmatter
- [ ] Codex agents use Codex-native frontmatter format
- [ ] Agent body content consistent across all 3 platforms

### Quality Gates
- [ ] No placeholder text in changes.md
- [ ] Model assignments match spec 016 requirements
- [ ] Profile-to-agent mapping correct for Codex platform
- [ ] Cross-platform consistency verified
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## Stakeholder Matrix

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Spec Owner | Documentation Lead | High | Direct updates via changes.md |
| Tech Lead | System Architect | Medium | Review approval for changes |
| Platform Maintainers | OpenCode/Claude/Codex teams | High | Cross-platform consistency verification |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## Change Log

### v1.0 (2026-02-16)
**Initial task specification** — Defined audit scope for 24 agent config files across 3 platforms plus AGENTS.md.
<!-- /ANCHOR:changelog -->

---

## Related Documents

- **Parent**: [../spec.md](../spec.md)
- **Checklist**: [checklist.md](checklist.md)
- **Changes**: [changes.md](changes.md)
