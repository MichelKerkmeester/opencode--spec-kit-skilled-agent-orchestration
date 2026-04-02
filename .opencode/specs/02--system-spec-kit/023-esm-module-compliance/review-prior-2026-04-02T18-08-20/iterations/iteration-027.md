# Iteration 027
## Scope
- Reviewed command/agent parity surfaces:
  - `.opencode/command/memory/manage.md`
  - `.agents/commands/memory/manage.toml`
  - `.opencode/agent/orchestrate.md`
  - `.codex/agents/orchestrate.toml`

## Verdict
clear

## Findings
### P0
None.

### P1
None.

### P2
None.

## Passing checks observed
- Shared-memory lifecycle subcommands (`shared enable/create/member/status`) are now documented in both command surfaces.
Evidence: `.opencode/command/memory/manage.md:95`, `.opencode/command/memory/manage.md:98`, `.agents/commands/memory/manage.toml:1`, `.agents/commands/memory/manage.toml:2`.
- Orchestrate docs and Codex runtime profile both include consistent resume/bootstrap references (`memory_context` resume path).
Evidence: `.opencode/agent/orchestrate.md:816`, `.codex/agents/orchestrate.toml:840`.

## Recommendations
1. Add a small parity check script to diff key command argument tables across markdown and TOML adapters.
