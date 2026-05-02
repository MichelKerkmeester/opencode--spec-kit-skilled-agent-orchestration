---
title: "Remediation Log: 049 Runtime Command Agent Alignment Review"
description: "Per-finding fix log for runtime command and agent alignment."
trigger_phrases:
  - "036-runtime-command-agent-alignment-review"
  - "runtime command audit"
  - "agent alignment review"
  - "cross-runtime agent consistency"
importance_tier: "important"
contextType: "implementation"
---
# Remediation Log: 049 Runtime Command Agent Alignment Review

| Finding | Severity | Outcome | Files Changed | Notes |
|---------|----------|---------|---------------|-------|
| F-001 | P1 | Fixed | `.opencode/command/doctor/mcp_install.md`, `.opencode/command/doctor/mcp_debug.md`, `doctor_mcp_debug.yaml` | Node floor now matches YAML source at `doctor_mcp_install.yaml:149`; command-facing debug docs/assets use `>=20.11.0`. |
| F-002 | P1 | Fixed | `.opencode/command/doctor/code-graph.md`, `doctor_code-graph_*.yaml` | Replaced packet-history/deferred Phase B prose with explicit apply/manual contract; no watcher/background claim remains. |
| F-003 | P1 | Fixed | `.opencode/command/doctor/skill-advisor.md`, `doctor_skill-advisor_*.yaml` | Added `advisor_rebuild` as explicit rebuild path with source citation to `advisor-rebuild.ts:8`. |
| F-004 | P1 | Fixed | `.opencode/command/memory/save.md`, `.opencode/command/memory/search.md`, `.opencode/command/memory/manage.md` | Surfaced `memory_retention_sweep`; manage command now documents `retention-sweep` mode and tool call shape. |
| F-005 | P1 | Fixed where writable | `.opencode/agent/{context,deep-research,deep-review,orchestrate}.md`, Claude/Gemini mirrors | Replaced Claude-only hook wording with runtime startup/bootstrap wording and hook-system matrix citation. |
| F-006 | P1 | Blocked | `.codex/agents/{context,deep-research,orchestrate}.toml` | Same hook wording drift exists, but Node write returned `EPERM` and apply_patch was rejected under sandbox policy. |
| F-007 | P1 | Blocked | `.codex/agents/{context,orchestrate,write}.toml` | Codex TOML still references `.md` paths; same write denial prevented fix. |
| F-008 | P2 | Fixed where writable | `.opencode/agent/orchestrate.md`, `.claude/agents/orchestrate.md`, `.gemini/agents/orchestrate.md` | Added runtime directory resolution table text. Codex equivalent remains blocked under F-007. |
| F-009 | P2 | Fixed where writable | `.opencode/agent/write.md`, `.claude/agents/write.md`, `.gemini/agents/write.md` | Added evergreen-doc rule for command/agent/README/guide/catalog/playbook docs. Codex equivalent remains blocked under F-007. |
| F-010 | P2 | Fixed | `.opencode/agent/improve-agent.md`, Claude/Gemini mirrors, `.opencode/command/improve/agent.md` | Removed stale phase-number labels from evergreen agent/command narrative. |
| F-011 | P2 | Fixed | `spec_kit_deep-research_auto.yaml`, `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml` | Replaced packet-history authority-guard and blocked-stop comments with current source-anchor wording. |

## Blocked Evidence

Attempted Node write to `.codex/agents/context.toml` failed:

```text
Error: EPERM: operation not permitted, open '.codex/agents/context.toml'
```

Attempted apply_patch to `.codex/agents/write.toml` failed:

```text
patch rejected: writing outside of the project; rejected by user approval settings
```

No workaround was applied because the approval policy is `never` and the task forbids unsafe source/schema mutation.
