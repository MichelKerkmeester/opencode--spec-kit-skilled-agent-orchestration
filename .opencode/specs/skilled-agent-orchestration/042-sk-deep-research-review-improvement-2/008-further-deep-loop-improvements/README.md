# Phase 008 — Further Deep-Loop Improvements

**Parent spec**: [../spec.md](../spec.md)
**Phase**: 8 of 8 (final phase of packet 042)
**Level**: 3
**Status**: Draft (ready for implementation)

---

## One-paragraph summary

The 20-iteration deep-research audit ([../research/research.md](../research/research.md)) found that sk-deep-research v1.5.0.0, sk-deep-review v1.2.0.0, and sk-improve-agent v1.1.0.0 **publish richer stop/graph/recovery contracts than their visible workflows actually call**. This phase lands 12 concrete recommendations (3 P0, 5 P1, 4 P2) in four sequential passes — contract truth → graph wiring → reducer surfacing → fixtures — so the coverage graph becomes actively and smartly utilized on the live loop path.

---

## Files in this phase

| File | Purpose |
|------|---------|
| [spec.md](./spec.md) | 25 requirements (REQ-001 through REQ-025), scope, success criteria |
| [plan.md](./plan.md) | 4-pass execution plan with parallelizable task groups |
| [tasks.md](./tasks.md) | 63 tasks across Parts A-E |
| [checklist.md](./checklist.md) | P0/P1/P2 verification with evidence citations |
| [decision-record.md](./decision-record.md) | ADR-001 (graph regime), ADR-002 (replay strategy), ADR-003 (tool routing) |
| [implementation-summary.md](./implementation-summary.md) | Filled post-implementation (placeholder with scorecard delta tables) |

---

## Key requirements at a glance

### P0 (blockers, must ship)
1. **Contract truth** — normalize `blocked_stop`, `userPaused`, `stuckRecovery` on the live path for research + review; wire `improvement-journal.cjs` into the improve-agent YAML; fix the malformed CLI example in the command doc. → REQ-001..005
2. **Sample-size enforcement** — require `minDataPoints=3` in trade-off detection and `minReplayCount=3` in benchmark stability; surface `insufficientData` / `insufficientSample` as distinct states. → REQ-006, REQ-007
3. **Graph wiring** — pick a canonical graph-convergence regime (ADR-001), wire `deep_loop_graph_upsert` + `deep_loop_graph_convergence` into both auto YAMLs, harmonize `sourceDiversity`, session-scope shared reads. → REQ-008..013

### P1 (next release)
1. Promote blocked-stop payloads into reducer-owned surfaces for research + review. → REQ-014
2. Fail-closed review reducer: corruption warnings + explicit anchor failure. → REQ-015, REQ-016
3. Improve-agent replay decision (ADR-002): implement journal/lineage/coverage consumers OR downgrade docs. → REQ-017
4. Tool-routing parity for structural graph tools (ADR-003). → REQ-011
5. Session scoping in shared coverage-graph reads. → REQ-012

### P2 (advisory, not blocking)
1. Split `repeatedFindings` into persistentSameSeverity + severityChanged. → REQ-018
2. Show replayCount / stabilityCoefficient / insufficient-sample state on the improve-agent dashboard. → REQ-019
3. Harmonize graph-convergence math (resolved by ADR-001). → REQ-010
4. Durable fixtures for interrupted, blocked-stop, and low-sample sessions. → REQ-020..022

---

## Success criterion (user's explicit)

**The coverage graph must be actively and smartly utilized** by the live research and review loops — not merely emitted. Verified by:
- `deep_loop_graph_upsert` and `deep_loop_graph_convergence` called from at least one iteration step in both research and review auto YAMLs.
- `graphConvergenceScore` appears in the reducer-owned findings registry alongside `convergenceScore`.
- `graph-aware-stop.vitest.ts` passes (the suite fails if graph wiring is not active).
- Graph Integration scorecard jumps from current low-digit scores to at least **8/10** across all five graph dimensions per skill.

---

## Delivery strategy

Four sequential passes (A → B → C → D → E), with ~35 parallelizable tasks. Can be delivered in ~8 engineer-days with 3–4 concurrent agents, or ~5 calendar days if Codex CLI GPT-5.4 high fast handles ~60% of execution as in prior 042 passes.

Each pass ends with an independent commit boundary for safe rollback. The `--lenient` escape hatch on the review reducer prevents the fail-closed changes from breaking any in-flight review packets. Both ADR-001 and ADR-002 have contingency paths so late decision flips don't re-architect the phase.

---

## Predecessor / successor

- **Predecessor**: [007-skill-rename-improve-agent-prompt](../007-skill-rename-improve-agent-prompt/) (complete)
- **Successor**: None — this is the final phase of packet 042. Follow-up work (if any) lands in a new packet.

---

## Traceability

Every requirement cites a specific iteration file + finding. See `research/iterations/iteration-001.md` through `iteration-020.md` for primary evidence, and `research/research.md` §13 (Finding → Iteration Map) for the complete trace.
