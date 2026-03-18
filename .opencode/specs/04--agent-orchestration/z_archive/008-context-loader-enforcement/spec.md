---
title: "Spec: Aggressive @context_loader Enforcement [008-context-loader-enforcement/spec]"
description: "Aggressively enforce @context_loader as the primary context retrieval agent across all agents and commands. The previous session (007) created @context_loader but was too conser..."
trigger_phrases:
  - "spec"
  - "aggressive"
  - "context"
  - "loader"
  - "enforcement"
  - "008"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Aggressive @context_loader Enforcement

> **Spec Folder:** `.opencode/specs/04--agent-orchestration/z_archive/008-context-loader-enforcement/`
> **Parent:** `.opencode/specs/04--agent-orchestration/`
> **Related:** `007-explore-sub-agent/` (original @context_loader creation)
> **Status:** Complete
> **Level:** 1
> **Created:** 2026-02-11

---

<!-- ANCHOR:executive-summary -->
## 1. Overview

Aggressively enforce `@context_loader` as the primary context retrieval agent across all agents and commands. The previous session (007) created @context_loader but was too conservative in replacing `@explore` references — 9 references in orchestrate.md were marked "intentional" when several should have been replaced.

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:problem -->
## 2. Problem Statement

`@explore` references persist across the codebase in contexts where they **recommend routing or behavior**. These should point users/orchestrator to `@context_loader` instead. The built-in `subagent_type: "explore"` is a Task tool parameter — not an agent recommendation.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:requirements -->
## 3. The Enforcement Rule

**@explore is ONLY acceptable when:**
1. Inside `@context_loader.md` itself (it dispatches the built-in @explore)
2. `subagent_type: "explore"` — literal Task tool parameter in YAML configs
3. Factual description of the built-in type ("The built-in explore subagent provides...")
4. Two-Tier Model description (where @context_loader dispatches @explore)
5. Comparative text that PROMOTES @context_loader ("Prefer @context_loader over raw @explore")
6. Built-in modes (Build & Plan) that reference explore as a system feature

**@explore must be REPLACED with @context_loader when:**
- Routing recommendations ("dispatch @explore for investigation")
- Example outputs (`[found by @explore]`)
- Agent selection templates/lists
- Reassignment examples
- Any place suggesting WHAT TO DO or WHO TO DISPATCH

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## 4. Scope

### In Scope
- ALL agent files in `.opencode/agent/`
- ALL command files in `.claude/commands/` and `.opencode/command/`
- `orchestrate.md` — re-examine all 9 "intentional" @explore references
- Any other files with @explore routing recommendations

### Out of Scope
- `@context_loader.md` itself (it correctly references @explore as its dispatch target)
- AGENTS.md files (already updated in 007)
- Skill files (already audited clean in 007)
- Install guides (already updated in 007)

<!-- /ANCHOR:scope -->

<!-- ANCHOR:dependencies -->
## 5. Dependencies

| Dependency | Type | Description |
|-----------|------|-------------|
| 007-explore-sub-agent | Predecessor | Created @context_loader, initial ecosystem integration |
| orchestrate.md | Target | Primary file with remaining @explore references |

<!-- /ANCHOR:dependencies -->
