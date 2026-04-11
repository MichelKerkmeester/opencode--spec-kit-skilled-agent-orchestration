---
title: "Decision Record: Agent Improvement Full Skill [skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/decision-record]"
description: "Architecture decisions for phase 002 of the full-skill expansion after the phase 001 MVP."
trigger_phrases:
  - "agent improvement full skill decisions"
  - "benchmark harness ADR"
importance_tier: "important"
contextType: "general"
---
# Decision Record

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Benchmark Harness Before Broader Target Expansion

### Status
Accepted

### Context
Packet 041 proved the bounded loop architecture, but its first evaluator is still closer to prompt-surface scoring than full behavioral benchmarking.

### Decision
Build the handover benchmark harness before broadening target scope.

### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Add more targets first | Would expand surface area before strengthening proof quality |
| Improve reports first | Better reporting does not fix weak evaluator evidence |

### Consequences
- The next packet stays grounded in better proof rather than faster expansion.
- Second-target onboarding is delayed until the benchmark harness exists.
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Add One Second Structured Target, Not Many

### Status
Accepted

### Context
The current skill is too narrow to be called full, but expanding too broadly would weaken the trust boundary and complicate evidence.

### Decision
Add exactly one second structured target in this packet.

### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Keep handover only | Would not prove the runtime can generalize cleanly |
| Add several targets together | Would make failures harder to reason about and verify |

### Consequences
- The packet can prove reuse without pretending the system is universally general.
- Target-profile architecture has to be real, not implied.

---

### ADR-003: Keep Mirror Sync Separate From Experiment Evidence

### Status
Accepted

### Context
Canonical benchmark truth and runtime packaging parity solve different problems. Mixing them would make experiment results harder to trust.

### Decision
Preserve mirror sync as a downstream packaging step with separate evidence.

### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Sync mirrors as part of benchmark success | Confuses evaluation truth with packaging work |
| Make mirrors experiment targets now | Re-opens the exact scope risk packet 041 contained |

### Consequences
- Canonical evidence remains easier to audit.
- Runtime parity can still improve without redefining what the benchmark proved.

---

### ADR-004: Use `context-prime` as the Second Structured Target

### Status
Accepted

### Context
The packet needed one more target to prove runtime reuse, but broad orchestration or research agents would have expanded scope too quickly.

### Decision
Use `.opencode/agent/context-prime.md` as the second target because it has a compact, read-only Prime Package contract and can stay candidate-only in this packet.

### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Add another writable canonical target | Would weaken the single-canonical trust boundary too early |
| Add a broad orchestration target | Harder to benchmark deterministically |

### Consequences
- The runtime now proves multi-target support without broadening promotion rights.
- The packet keeps one safe canonical promotion path while still exercising a second evaluator profile.

---

### ADR-005: Split Benchmark Fixtures From Packet-Local Evidence

### Status
Accepted

### Context
We needed reusable fixture definitions for the skill and packet-local output evidence for verification.

### Decision
Store reusable fixture definitions under `.opencode/skill/sk-improve-agent/assets/fixtures/` and store actual benchmark outputs and reports under this packet's `improvement/benchmark-runs/`.

### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Keep everything only in the packet | Would make future target reuse harder |
| Keep everything only in the skill | Would blur reusable inputs with per-packet evidence |

### Consequences
- Operators get reusable fixture catalogs and clear packet-local proof.
- Benchmark truth stays easy to audit in packet evidence while the skill remains reusable.
