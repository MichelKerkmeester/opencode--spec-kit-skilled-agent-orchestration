# Iteration 007 - Reality Map Synthesis and Planning Packet

## Focus
Strategy focus: 4-column reality map synthesis and Planning Packet for RQ7 plus all RQs (`research/deep-research-strategy.md:29`).

## Sources Read
- Iterations 001-006.
- `spec.md:137-144`, `spec.md:158-167` - acceptance and success criteria.
- `research/deep-research-strategy.md:61-64` - synthesis targets.
- Key sources carried forward in `research/research-report.md` section 8.

## Findings

| ID | Severity | Claim | Actual behavior | Gap class | Recommended action |
|----|----------|-------|-----------------|-----------|--------------------|
| F7.1 | P1 | The automation estate is mostly self-managing. | Across 50 classified rows, the distribution is 14 Auto, 14 Half, 18 Manual, and 4 Aspirational. The dominant reality is operator-triggered automation plus narrow auto paths. Source: `research/research-report.md` sections 1 and 5. | Half | Replace broad "auto-managing" claims with trigger-specific matrix. |
| F7.2 | P1 | Hook parity exists across all runtimes. | Claude, Gemini, and OpenCode are auto/in-turn; Copilot is next-prompt custom instructions; Codex has a checked-in config/docs mismatch; native/no CLI is manual. Source: `research/research-report.md` section 2 RQ5. | Half | Remediate runtime hook docs first. |
| F7.3 | P1 | Graph and memory indexes stay fresh automatically. | Memory has startup scan and optional watcher; code graph has read-path selective self-heal but manual full scan and no structural watcher. Source: `research/research-report.md` section 2 RQ2/RQ4. | Half | Document separate freshness contracts for memory, skill graph, CocoIndex, and structural code graph. |
| F7.4 | P1 | Aspirational gaps are isolated. | Four P1 aspirational gaps form a coherent workstream: watcher overclaim, retention sweep absence, Copilot wrapper contradiction, and Codex config mismatch. Source: `research/research-report.md` sections 3, 5, and 6. | Aspirational | Seed remediation phase with those four gaps. |
| F7.5 | P2 | More iterations would likely produce new P0/P1 issues. | New info ratio fell to 0.18 on iteration 7 after a 0.39 consolidation pass, with no new P0/P1 beyond previously identified gaps. Source: `research/research-report.md` convergence audit. | Auto | Stop at max 7; do not pad beyond requested loop. |

## New Info Ratio
0.18. The iteration produced synthesis and prioritization, not a new subsystem.

## Open Questions Carried Forward
- Which Codex hook config contract should become authoritative?
- Should retention cleanup be implemented as MCP tool, startup interval, or explicit `/memory:manage` operation?
- Should structural code graph receive a watcher, or should docs commit to read-path/manual freshness?

## Convergence Signal
converged by max-iteration completion. The early-stop condition did not trigger because only one iteration fell below 0.10, and new P1 synthesis remained active until iteration 6.

