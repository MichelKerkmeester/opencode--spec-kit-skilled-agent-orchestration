<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
---
title: "Decision Record: 060 — sk-improve-agent Test-Report Alignment"
description: "4 ADRs governing executor choice, iteration cap, packet scope, and target-vs-fixture decision."
trigger_phrases:
  - "060 ADRs"
  - "060 decision record"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T10:50:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "ADRs 1-4 authored"
    next_safe_action: "Bootstrap JSON metadata; strict-validate; dispatch deep-research"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Decision Record: 060 — sk-improve-agent Test-Report Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-1 -->
## ADR-1: Use cli-copilot --model=gpt-5.5 as research executor

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** User (verbatim "cli-copilot gpt 5.5 high agents")

### Context

Packet 059 ran a successful 8-scenario stress-test campaign using `cli-copilot --model gpt-5.5`. The same executor and model produced consistent, grep-checkable RETURN envelopes across multiple scenarios. The user explicitly requested the same executor for 060's deep-research iterations.

### Decision

Dispatch `/spec_kit:deep-research:auto` with `--executor=cli-copilot --model=gpt-5.5`. Reasoning effort `high` is set via `~/.copilot/settings.json:effortLevel` (already configured); the corresponding deep-research flag is omitted because `parseExecutorConfig` rejects `reasoningEffort` for `cli-copilot` per `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:35`.

### Why

- Matches the executor profile that worked in 059 (24+ successful copilot calls across 3 rounds)
- gpt-5.5 was the primary model in 059's R1+R2+R3 — known to produce 9/9 RETURN field compliance under @code's contract
- The user's "high reasoning" intent is satisfied via existing settings.json without the (incompatible) flag

### Alternatives considered

- **`--executor=cli-codex --model=gpt-5.5 --reasoning-effort=high`** — also valid (codex CLI accepts reasoning-effort). Rejected because user named cli-copilot specifically and we want methodology continuity with 059.
- **`--executor=native` (Opus 4.7)** — known-working default. Rejected because it doesn't match the 059 executor pattern.

### Consequences

- 8-15 minute wall-time for the full 10-iter run (per 059 baselines)
- Iteration outputs subject to copilot's transcript format, which 059 already handled
- If copilot rate-limits during the run, the framework will retry per its retry policy
<!-- /ANCHOR:adr-1 -->

---

<!-- ANCHOR:adr-2 -->
## ADR-2: Cap iterations at 10 with convergence detection

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** User (verbatim "10 spec_kit:deep-research iterations")

### Context

Deep-research's convergence-detection mechanism short-circuits the loop when findings stabilize across iterations. The cap protects against runaway iterations on under-defined topics. 059's research streams converged at 4-8 iterations each.

### Decision

Cap at `--max-iterations=10`. Allow convergence to stop earlier if findings stabilize.

### Why

- 10 is comfortable headroom over 059's typical 5-8 convergence
- Wall-time bounded at ~15 min worst case
- Convergence detection still does the work — the cap is defensive, not the primary stopping condition

### Consequences

- If convergence stops at iteration 4-5, that's a positive signal (research charter was clear)
- If iteration 10 hits without convergence, research.md should still synthesize partial findings; user may decide to dispatch a follow-on iteration with refined charter
<!-- /ANCHOR:adr-2 -->

---

<!-- ANCHOR:adr-3 -->
## ADR-3: This packet is research-only; implementation deferred to packet 061

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Self (Claude), aligned with user's "First create the spec... afterwards run 10 deep-research iterations"

### Context

The user's request scoped this packet to spec creation + research dispatch. Implementation of the research's recommendations is a separate, larger work item.

### Decision

Packet 060 produces only `research/research.md` synthesis with sketched diffs and scenarios. No edits to `sk-improve-agent/SKILL.md`, `improve-agent.md`, or `improve/agent.md` happen in this packet. No CP-XXX playbook entries are written. No stress tests are executed.

### Why

- Keeps research findings honest — premature implementation biases recommendations
- Matches the 059 pattern: research came first (Phase 2 of 059), then implementation came second (Phase 3 of 059)
- Allows independent review of recommendations before committing to changes
- Smaller blast radius for this packet — easier to roll back if research is unhelpful

### Consequences

- The triad's actual gaps stay open until 061 starts
- 061 inherits a clear backlog from 060's research.md
- Any user pivot ("don't do 061, prioritize X instead") is cheap because 060 made no real changes
<!-- /ANCHOR:adr-3 -->

---

<!-- ANCHOR:adr-4 -->
## ADR-4: Research the real sk-improve-agent triad, not a stand-in fixture

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Self (Claude)

### Context

One could research "how does the 059 methodology apply to *any* agent-improver?" using a synthetic example. Or one could research "how does it apply to *our actual* sk-improve-agent?" using the real triad as the subject.

### Decision

Research the real triad (`.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/agent/improve-agent.md`, `.opencode/command/improve/agent.md`).

### Why

- The 059 methodology benefits from operating on real surface area — its lessons came from real gaps in real code
- A synthetic fixture would only re-prove the methodology's *applicability*, not surface real gaps in the actual triad
- The output (diff sketches) needs to cite real section anchors in real files, which only the real triad can provide
- This packet's downstream consumer (061) is going to operate on the real triad regardless; research must match

### Consequences

- Research findings are immediately actionable in 061
- Iteration prompts can cite specific line ranges in the real files
- If the triad's structure changes during the 10-iter run, iterations may diverge — mitigated by 060's "no implementation" rule (the triad is read-only this packet)
<!-- /ANCHOR:adr-4 -->

---

<!-- ANCHOR:adr-summary -->
## Summary

| ADR | Decision | Rationale (one line) |
|---|---|---|
| **ADR-1** | cli-copilot + gpt-5.5 executor | Match 059 success pattern; reasoning via settings.json |
| **ADR-2** | 10-iteration cap with convergence | Comfortable headroom over 059's 5-8 convergence |
| **ADR-3** | Research-only scope | Honest findings; clean handoff to 061 |
| **ADR-4** | Real triad as research subject | Actionable diff sketches need real anchors |
<!-- /ANCHOR:adr-summary -->
