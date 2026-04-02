# Iteration 017

## Scope
Commands/agents/readmes cross-runtime parity.

## Verdict
findings

## Findings

### P1
1. Shared-memory `status` flag contract inconsistent between canonical docs and Gemini wrapper.
- Evidence:
  - ../../../../command/memory/manage.md:98
  - ../../../../command/memory/manage.md:963
  - ../../../../command/memory/README.txt:111
  - ../../../../../.agents/commands/memory/manage.toml:2

2. Orchestrator bootstrap behavior drifts across runtime adapters.
- Evidence:
  - ../../../../agent/orchestrate.md:18
  - ../../../../agent/orchestrate.md:20
  - ../../../../../.agents/agents/orchestrate.md:13
  - ../../../../../.codex/agents/orchestrate.toml:10
  - ../../../../../GEMINI.md:69

3. Codex `@context-prime` adapter format/inventory mismatch.
- Evidence:
  - ../../../../../.codex/agents/context-prime.md:1
  - ../../../../../.codex/agents/orchestrate.toml:22
  - ../../../../../.codex/agents/orchestrate.toml:171
  - ../../../../../README.md:958

### P2
1. Gemini runtime path convention inconsistent for `@write`.
- Evidence:
  - ../../../../../.agents/agents/write.md:23
  - ../../../../../.agents/agents/review.md:20
  - ../../../../../GEMINI.md:290
