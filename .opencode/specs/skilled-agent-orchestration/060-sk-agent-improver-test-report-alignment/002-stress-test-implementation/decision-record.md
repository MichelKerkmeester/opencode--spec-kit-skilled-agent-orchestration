<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
---
title: "Decision Record: 060/002 — Stress-Test Implementation"
description: "4 ADRs governing executor / ordering / mirror discipline / score progression."
trigger_phrases:
  - "060/002 ADRs"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T11:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored 4 ADRs"
    next_safe_action: "Begin Stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Decision Record: 060/002 — Stress-Test Implementation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-1 -->
## ADR-1: Use cli-copilot --model=gpt-5.5 for stress-test executor

**Status:** Accepted
**Date:** 2026-05-02

### Context

Phase 001 used cli-copilot gpt-5.5 successfully for 10 deep-research iterations. Packet 059's 8/0/0 final score was achieved with the same executor across CP-027..CP-034. Continuity argues for the same executor in 002 unless a specific reason to switch exists.

### Decision

Run all R0/R1/R2 stress tests with `cli-copilot --model=gpt-5.5 --allow-all-tools --no-ask-user --add-dir <sandbox>`. Reasoning effort `high` is set via `~/.copilot/settings.json:effortLevel` (already configured).

### Why

- Matches 001 + 059 known-good executor (24+ successful copilot calls)
- gpt-5.5 produced 9/9 RETURN field compliance under @code's contract in 059
- Eliminates model-attribution noise across the 060 packet (001 + 002 use the same executor)

### Alternatives considered

- **cli-codex gpt-5.5 high** — also valid; rejected for executor continuity with 001
- **Native @deep-research / @code dispatch via Opus** — would shift the test surface; rejected for the same reason
<!-- /ANCHOR:adr-1 -->

---

<!-- ANCHOR:adr-2 -->
## ADR-2: Test-first ordering — scenarios + fixture before source edits

**Status:** Accepted
**Date:** 2026-05-02

### Context

001/research §8 explicitly recommends test-first: "Author CP-040 onward scenarios before broad rewrites, then run the same 059-style score progression." This mirrors 059's pattern where the test scenarios existed before the agent body was edited.

### Decision

Stage 2 (author scenarios) and Stage 1's fixture-target work happen BEFORE Stage 3 (apply diffs). Stage 4 stress tests then validate the diffs against pre-existing scenarios.

### Why

- Scenarios written after diffs risk being shaped to PASS the diffs rather than to challenge them
- 059's R0 baseline existed before any code edits; same discipline applies here
- If diffs and scenarios are authored in parallel, the iteration loop becomes ambiguous — was a PASS due to a good diff or a weak scenario?

### Consequences

- Stage 3's diff application starts later in the timeline
- Scenarios may reveal during R1 that some diff sketch from 001/research was incomplete — that's the point; R2 closes those gaps
<!-- /ANCHOR:adr-2 -->

---

<!-- ANCHOR:adr-3 -->
## ADR-3: Mirror improve-agent.md edits across 4 runtimes

**Status:** Accepted
**Date:** 2026-05-02

### Context

Per memory rule `feedback_new_agent_mirror_all_runtimes.md`: any agent file edits must propagate to all 4 runtime surfaces (`.opencode/agent/*.md` + `.claude/agents/*.md` + `.gemini/agents/*.md` + `.codex/agents/*.toml`). Packet 059's @code agent followed this rule; 001/research RQ-6 confirmed sk-improve-agent's mirror policy correctness.

### Decision

When editing `.opencode/agent/improve-agent.md`, immediately mirror the same change to:
- `.claude/agents/improve-agent.md` (Path Convention adjusted)
- `.gemini/agents/improve-agent.md` (Path Convention adjusted)
- `.codex/agents/improve-agent.toml` (toml-wrapped with `sandbox_mode="workspace-write"`)

### Why

- 4-runtime parity rule is a hard discipline established for prior agents
- Mirror drift would mean cli-claude-code, cli-gemini, cli-codex see a stale agent body
- 001/research RQ-6 specifically called out the scanner's mirror-path constant bug — fixing it without mirroring the agent edit would be inconsistent

### Consequences

- T-016 must execute as part of Stage 3 sub-stage 3d
- 4-runtime diff verification is part of acceptance per checklist
<!-- /ANCHOR:adr-3 -->

---

<!-- ANCHOR:adr-4 -->
## ADR-4: Score-progression target = first run baseline → iterate until 6/0/0 OR document honest gaps

**Status:** Accepted
**Date:** 2026-05-02

### Context

Packet 059 progressed 5/2/1 → 6/2/0 → 8/0/0 across 3 rounds. 002's stress test has 6 scenarios (CP-040..CP-045) so the maximum is 6/0/0. We don't know R1's starting score until it runs.

### Decision

The success target is `6 PASS / 0 PARTIAL / 0 FAIL`. If R1 starts at 6/0/0 (already perfect), document that and stop at R1. If R1 starts lower, iterate R2/R3 with targeted edits between rounds. If R3 still doesn't reach 6/0/0, document honest gaps in test-report.md and recommend a follow-on packet (063+) for the remaining work.

### Why

- 059's pattern: never claim PASS without grep-checkable evidence; honest accounting matters more than score-perfection
- Capping at R3 prevents infinite iteration on a stuck gap
- Real gaps documented honestly are more useful than scores massaged to look clean

### Consequences

- test-report.md may document a 5/1/0 final score with one gap deferred to follow-on; that's acceptable
- Follow-on packet hand-off (in handover.md) lists any deferred gaps with file:line evidence

### Alternatives considered

- **Hard 6/0/0 requirement** — rejected; would force scenario rewriting to pass rather than honest accounting
- **No target** — rejected; without a target the close-out criterion is unclear
<!-- /ANCHOR:adr-4 -->

---

<!-- ANCHOR:adr-summary -->
## Summary

| ADR | Decision | Rationale (one line) |
|---|---|---|
| **ADR-1** | cli-copilot + gpt-5.5 stress-test executor | Match 001 + 059 success pattern; reasoning via settings.json |
| **ADR-2** | Test-first ordering | Scenarios shape pre-existing diffs honestly; 059 pattern |
| **ADR-3** | 4-runtime mirror improve-agent.md edits | Memory rule + sk-improve-agent's own mirror policy |
| **ADR-4** | Target 6/0/0; document honest gaps if R3 doesn't reach | 059's transparency over score-massaging |
<!-- /ANCHOR:adr-summary -->
