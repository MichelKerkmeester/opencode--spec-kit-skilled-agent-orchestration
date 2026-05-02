---
title: "Audit Findings: 049 Runtime Command Agent Alignment Review"
description: "Per-file classification and finding ledger for runtime command and agent alignment."
trigger_phrases:
  - "036-runtime-command-agent-alignment-review"
  - "runtime command audit"
  - "agent alignment review"
  - "cross-runtime agent consistency"
importance_tier: "important"
contextType: "audit"
---
# Audit Findings: 049 Runtime Command Agent Alignment Review

## Summary

Discovery found 23 OpenCode command Markdown files, 10 OpenCode agent Markdown files, 10 Claude agent Markdown files, 10 Gemini agent Markdown files, and 10 Codex TOML agents plus `README.txt`. GitHub Copilot has hook files only and no agent definitions.

Canonical sources used:

- Tool surface: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:10`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:330`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:8`
- Runtime MCP servers: `opencode.json`
- Hook matrix: `.opencode/skill/system-spec-kit/references/config/hook_system.md:105`
- Node floor: `.opencode/command/doctor/assets/doctor_mcp_install.yaml:149`

## Findings

| ID | Severity | Class | File(s) | Evidence | Outcome |
|----|----------|-------|---------|----------|---------|
| F-001 | P1 | DRIFT | `.opencode/command/doctor/mcp_install.md`, `.opencode/command/doctor/mcp_debug.md`, `doctor_mcp_debug.yaml` | Command-facing docs/assets claimed Node.js 18+ while install YAML requires >=20.11.0 | Fixed |
| F-002 | P1 | DRIFT | `.opencode/command/doctor/code-graph.md`, `doctor_code-graph_*.yaml` | Code-graph command narrated deferred apply/packet-history instead of current explicit apply/manual contract | Fixed |
| F-003 | P1 | MISSING | `.opencode/command/doctor/skill-advisor.md`, `doctor_skill-advisor_*.yaml` | Command used skill graph scan language but did not surface `advisor_rebuild` | Fixed |
| F-004 | P1 | MISSING | `.opencode/command/memory/save.md`, `.opencode/command/memory/search.md`, `.opencode/command/memory/manage.md` | Memory commands did not mention `memory_retention_sweep` | Fixed |
| F-005 | P1 | DRIFT | OpenCode, Claude, Gemini `context`, `deep-research`, `deep-review`, `orchestrate` agents | Hook guidance over-named Claude SessionStart instead of runtime matrix | Fixed where writable |
| F-006 | P1 | DRIFT | `.codex/agents/context.toml`, `.codex/agents/deep-research.toml`, `.codex/agents/orchestrate.toml` | Codex TOML still names Claude SessionStart | Fixed (post-049 patch with full perms) |
| F-007 | P1 | DRIFT | `.codex/agents/context.toml`, `.codex/agents/orchestrate.toml`, `.codex/agents/write.toml` | Codex TOML references `.codex/agents/*.md` but files are `.toml` | Fixed (post-049 patch with full perms) |
| F-008 | P2 | MISSING | `.opencode/agent/orchestrate.md`, `.claude/agents/orchestrate.md`, `.gemini/agents/orchestrate.md` | Orchestrators lacked the runtime agent directory resolution rule | Fixed |
| F-009 | P2 | MISSING | `.opencode/agent/write.md`, `.claude/agents/write.md`, `.gemini/agents/write.md` | Write agents did not explicitly cite the evergreen-doc rule | Fixed |
| F-010 | P2 | DRIFT | `.opencode/agent/improve-agent.md`, runtime mirrors, `.opencode/command/improve/agent.md` | Narrative contained stale phase-number labels | Fixed |
| F-011 | P2 | DRIFT | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Deep workflow assets cited packet-history labels in comments | Fixed |

## Per-File Classification

### OpenCode Commands

| File | Classification | Finding |
|------|----------------|---------|
| `.opencode/command/agent_router.md` | PASS | None |
| `.opencode/command/memory/search.md` | MISSING -> FIXED | F-004 |
| `.opencode/command/memory/learn.md` | PASS | None |
| `.opencode/command/memory/manage.md` | DRIFT/MISSING -> FIXED | F-004 |
| `.opencode/command/memory/save.md` | MISSING -> FIXED | F-004 |
| `.opencode/command/doctor/code-graph.md` | DRIFT -> FIXED | F-002 |
| `.opencode/command/doctor/mcp_install.md` | DRIFT -> FIXED | F-001 |
| `.opencode/command/doctor/skill-advisor.md` | MISSING -> FIXED | F-003 |
| `.opencode/command/doctor/mcp_debug.md` | DRIFT -> FIXED | F-001 |
| `.opencode/command/spec_kit/complete.md` | PASS | None |
| `.opencode/command/spec_kit/implement.md` | PASS | None |
| `.opencode/command/spec_kit/deep-review.md` | PASS | YAML assets fixed under F-011 |
| `.opencode/command/spec_kit/resume.md` | PASS | None |
| `.opencode/command/spec_kit/deep-research.md` | PASS | YAML asset fixed under F-011 |
| `.opencode/command/spec_kit/plan.md` | PASS | None |
| `.opencode/command/improve/agent.md` | DRIFT -> FIXED | F-010 |
| `.opencode/command/improve/prompt.md` | PASS | None |
| `.opencode/command/create/agent.md` | PASS | None |
| `.opencode/command/create/changelog.md` | PASS | None |
| `.opencode/command/create/sk-skill.md` | PASS | None |
| `.opencode/command/create/feature-catalog.md` | PASS | None |
| `.opencode/command/create/testing-playbook.md` | PASS | None |
| `.opencode/command/create/folder_readme.md` | PASS | None |

### OpenCode Agents

| File | Classification | Finding |
|------|----------------|---------|
| `.opencode/agent/context.md` | DRIFT -> FIXED | F-005 |
| `.opencode/agent/debug.md` | PASS | User-invoked-only directive preserved |
| `.opencode/agent/deep-research.md` | DRIFT -> FIXED | F-005 |
| `.opencode/agent/deep-review.md` | DRIFT -> FIXED | F-005 |
| `.opencode/agent/improve-agent.md` | DRIFT -> FIXED | F-010 |
| `.opencode/agent/improve-prompt.md` | PASS | None |
| `.opencode/agent/orchestrate.md` | MISSING/DRIFT -> FIXED | F-005, F-008 |
| `.opencode/agent/review.md` | PASS | Severity rubric present |
| `.opencode/agent/ultra-think.md` | PASS | None |
| `.opencode/agent/write.md` | MISSING -> FIXED | F-009 |

### Claude Agents

| File | Classification | Finding |
|------|----------------|---------|
| `.claude/agents/context.md` | DRIFT -> FIXED | F-005 |
| `.claude/agents/debug.md` | PASS | User-invoked-only directive preserved |
| `.claude/agents/deep-research.md` | DRIFT -> FIXED | F-005 |
| `.claude/agents/deep-review.md` | DRIFT -> FIXED | F-005 |
| `.claude/agents/improve-agent.md` | DRIFT -> FIXED | F-010 |
| `.claude/agents/improve-prompt.md` | PASS | None |
| `.claude/agents/orchestrate.md` | MISSING/DRIFT -> FIXED | F-005, F-008 |
| `.claude/agents/review.md` | PASS | Severity rubric present |
| `.claude/agents/ultra-think.md` | PASS | None |
| `.claude/agents/write.md` | MISSING -> FIXED | F-009 |

### Gemini Agents

| File | Classification | Finding |
|------|----------------|---------|
| `.gemini/agents/context.md` | DRIFT -> FIXED | F-005 |
| `.gemini/agents/debug.md` | PASS | User-invoked-only directive preserved |
| `.gemini/agents/deep-research.md` | DRIFT -> FIXED | F-005 |
| `.gemini/agents/deep-review.md` | DRIFT -> FIXED | F-005 |
| `.gemini/agents/improve-agent.md` | DRIFT -> FIXED | F-010 |
| `.gemini/agents/improve-prompt.md` | PASS | None |
| `.gemini/agents/orchestrate.md` | MISSING/DRIFT -> FIXED | F-005, F-008 |
| `.gemini/agents/review.md` | PASS | Severity rubric present |
| `.gemini/agents/ultra-think.md` | PASS | None |
| `.gemini/agents/write.md` | MISSING -> FIXED | F-009 |

### Codex Agents

| File | Classification | Finding |
|------|----------------|---------|
| `.codex/agents/context.toml` | DRIFT -> BLOCKED | F-006, F-007 |
| `.codex/agents/debug.toml` | PASS | User-invoked-only directive preserved |
| `.codex/agents/deep-research.toml` | DRIFT -> BLOCKED | F-006 |
| `.codex/agents/deep-review.toml` | PASS | Already used generic runtime startup wording |
| `.codex/agents/improve-agent.toml` | PASS | Phase comments remain source-lineage comments only |
| `.codex/agents/improve-prompt.toml` | PASS | None |
| `.codex/agents/orchestrate.toml` | DRIFT -> BLOCKED | F-006, F-007 |
| `.codex/agents/review.toml` | PASS | Severity rubric present |
| `.codex/agents/ultra-think.toml` | PASS | None |
| `.codex/agents/write.toml` | DRIFT -> BLOCKED | F-007 |

### GitHub Copilot

| Surface | Classification | Finding |
|---------|----------------|---------|
| `.github/hooks/` | PASS | Hook-only runtime; no agent definitions to align |

## Remaining Exceptions

- `.codex/agents/*` writes failed with `EPERM` and apply_patch rejected the same paths as outside-project under the current approval policy.
- Example spec folder strings such as `specs/007-auth` remain examples, not packet-history narrative.
- YAML cross-reference paths that contain numbered spec folders are stable source paths, not narrative packet-history claims.
