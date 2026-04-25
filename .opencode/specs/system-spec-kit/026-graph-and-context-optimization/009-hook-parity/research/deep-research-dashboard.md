# Deep Research Dashboard — 009-hook-parity

## Snapshot

- Iterations completed: 10
- Convergence status: converged-by-budget (no early stop)
- Highest-yield iterations: 02, 03, 05, 07
- Research scope: residual post-012 parity gaps in runtime activation, readiness detection, startup surfaces, and daemon/operator reporting

## Finding Counts

- P0: 0
- P1: 3
- P2: 3

## Top Findings

1. `P1` Codex readiness is overstated because docs require `codex_hooks` plus `hooks.json`, while the checked-in detector upgrades to `live` from `.codex/settings.json` alone.
2. `P1` Copilot wrapper parity is still reverted: `.claude/settings.local.json` lacks the top-level wrapper fields and writer commands that packets 010/011 say must be reapplied.
3. `P1` Gemini docs/tests no longer match the checked-in runtime surface, which uses `BeforeAgent`, `PreCompress`, and `SessionEnd`.

## Recommended Next Action

Land a follow-up remediation packet that does three things in order:

1. Restore Copilot wrapper/writer config in `.claude/settings.local.json`.
2. Tighten Codex readiness detection to the documented activation contract.
3. Align Gemini docs and fallback tests to the live runtime surface.
