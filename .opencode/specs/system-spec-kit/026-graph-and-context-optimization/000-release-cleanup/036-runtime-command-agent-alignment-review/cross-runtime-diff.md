---
title: "Cross-Runtime Diff: 049 Runtime Command Agent Alignment Review"
description: "Consistency report for equivalent agents across OpenCode, Claude, Codex, and Gemini runtime directories."
trigger_phrases:
  - "036-runtime-command-agent-alignment-review"
  - "runtime command audit"
  - "agent alignment review"
  - "cross-runtime agent consistency"
importance_tier: "important"
contextType: "audit"
---
# Cross-Runtime Diff: 049 Runtime Command Agent Alignment Review

## Runtime Surfaces

| Runtime | Agent Directory | Status |
|---------|-----------------|--------|
| OpenCode | `.opencode/agent/*.md` | Writable and remediated |
| Claude Code | `.claude/agents/*.md` | Writable and remediated |
| Codex CLI | `.codex/agents/*.toml` | Present but write-blocked |
| Gemini CLI | `.gemini/agents/*.md` | Writable and remediated |
| GitHub Copilot CLI | `.github/hooks/` | Hook-only; no agents |

## Equivalent Agents

| Agent | OpenCode / Claude / Gemini | Codex | Decision |
|-------|-----------------------------|-------|----------|
| `@context` | Capability text equivalent; runtime path references intentionally differ by directory. Hook wording aligned to runtime matrix. | TOML format; stale `.md` path and Claude hook wording remain blocked. | Equivalent except blocked Codex drift. |
| `@debug` | Equivalent; user-invoked-only and never-auto-dispatched directive preserved. | Equivalent directive present. | No merge needed. |
| `@deep-research` | Equivalent; lineage modes `new`, `resume`, `restart` and `sk-deep-research` workflow references present. Hook wording aligned. | TOML format; stale Claude hook wording remains blocked. | Equivalent except blocked Codex drift. |
| `@deep-review` | Equivalent; current `sk-deep-review` methodology, P0/P1/P2 rubric, claim adjudication, and severity weighting present. | Already has generic hook wording and current rubric. | No merge needed. |
| `@improve-agent` | Equivalent after phase-number cleanup. | TOML source-lineage comments remain; no capability drift found. | No merge needed. |
| `@improve-prompt` | Equivalent. | Equivalent. | No merge needed. |
| `@orchestrate` | Equivalent after runtime directory resolution rule and hook wording fixes. | TOML has stale `.md` references and Claude hook wording; blocked. | Equivalent intent, blocked Codex path drift. |
| `@review` | Equivalent; P0/P1/P2 and adversarial self-check present. | Equivalent. | No merge needed. |
| `@ultra-think` | Equivalent. | Equivalent. | No merge needed. |
| `@write` | Equivalent after evergreen rule added. | TOML still lists `.codex/agents/*.md`; blocked. | Equivalent intent, blocked Codex path drift. |

## Intentional Divergence

- Runtime path convention lines differ by design: OpenCode uses `.opencode/agent/*.md`, Claude uses `.claude/agents/*.md`, Gemini uses `.gemini/agents/*.md`, and Codex should use `.codex/agents/*.toml`.
- Codex agent files are TOML wrappers with `developer_instructions` strings, so they should not be byte-identical to Markdown agent definitions.
- Claude/Gemini/OpenCode command usage differs from Codex and Copilot because Codex uses `.opencode` commands and Copilot has hook-only support.

## Accidental Drift

- Codex TOML path references to `.codex/agents/*.md` are accidental drift.
- Codex TOML Claude-specific hook wording is accidental drift.
- These were not fixed due to filesystem sandbox denial; see `remediation-log.md`.
