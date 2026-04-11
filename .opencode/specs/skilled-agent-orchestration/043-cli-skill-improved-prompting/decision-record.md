<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
---
title: "Decision Record: CLI Skill Prompt-Quality Integration via Mirror Cards [043]"
description: "Decision index for the mirror-card architecture, escalation agent, runtime parity, and command routing split."
trigger_phrases:
  - "043 decision record"
  - "mirror card adr"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-11T19:30:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded two-tier architecture, runtime parity, and drift-management decisions"
    next_safe_action: "Keep README and changelog language consistent with the ADRs"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/decision-record.md"
      - ".opencode/command/improve/prompt.md"
    session_dedup:
      fingerprint: "sha256:043-cli-skill-improved-prompting"
      session_id: "043-cli-skill-improved-prompting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a guard-safe mirror-card pattern rather than cross-skill resource references"
      - "Use a dedicated improve-prompt agent for deep-path escalation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: CLI Skill Prompt-Quality Integration via Mirror Cards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a Guard-Safe Two-Tier Prompt-Quality Architecture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet 043 planning author |

---

<!-- ANCHOR:adr-001-context -->
### Context

We need better prompt quality in the four CLI orchestration skills without loading the full prompt-engineering skill on every dispatch. The current routers only discover markdown under each skill's own `references/` and `assets/` trees, and `_guard_in_skill()` enforces that same-skill boundary. At the same time, the repo already treats `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` as an active parity set for shared agent surfaces.

### Constraints

- Cross-skill prompt-quality assets are not routable through the current CLI skill Smart Routing model.
- Routine dispatches need a much smaller context footprint than the full `sk-improve-prompt` methodology.
- `/improve:prompt` is the existing prompt-improvement command surface and should not fork into a second competing command.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a canonical-source plus local-mirror fast path, backed by one shared `@improve-prompt` escalation agent and a unified `/improve:prompt` command split.

**How it works**: The canonical prompt-quality card lives under the `sk-improve-prompt` asset surface. Each CLI skill gets a short local mirror that can be loaded through its existing `ALWAYS` resource path. Complex or compliance-heavy prompts escalate to a fresh-context `@improve-prompt` agent, and `/improve:prompt` uses the same deep-path surface instead of creating a second command.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical card + four local mirrors + shared agent** | Works with current routing rules, keeps routine prompts light, centralizes complex-prompt behavior | Requires mirror maintenance and runtime parity work | 9/10 |
| Cross-skill `../` card reference | Single file source | Breaks same-skill routing and `_guard_in_skill()` | 1/10 |
| Full `sk-improve-prompt` load on every CLI dispatch | Single methodology path | Too heavy for routine dispatches | 4/10 |
| Mirror-card only, no agent | Simplest runtime shape | Too weak for complex, compliance, or multi-stakeholder prompts | 5/10 |
| New deep-prompt command | Keeps current command untouched | Splits the prompt-improvement surface and duplicates routing logic | 4/10 |

**Why this one**: It is the only option that satisfies the guard-safe routing invariant, the routine token-budget goal, the active runtime-mirror pattern, and the desire for one shared deep-prompt surface.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Routine CLI dispatches gain a small, always-loaded framework and CLEAR pre-check layer.
- High-complexity prompts get the full methodology in a fresh context instead of bloating the caller session.
- The repo keeps one deep-prompt surface for both CLI skills and `/improve:prompt`.

**What it costs**:
- Mirror maintenance becomes part of the feature. Mitigation: add sync metadata and make the drift-fixture decision explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mirror cards drift from the canonical card | M | Keep mirrors short, include sync markers, and decide whether to land a drift fixture |
| Runtime mirrors diverge across active runtime directories | M | Treat the OpenCode definition as canonical and verify the others against it |
| Escalation criteria become too broad | M | Keep escalation rules explicit and limited to complexity, compliance, stakeholder spread, or unresolved ambiguity |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The current CLI skills lack a lightweight framework/CLEAR layer |
| 2 | **Beyond Local Maxima?** | PASS | Cross-skill, always-inline, agent-less, and new-command alternatives were all considered |
| 3 | **Sufficient?** | PASS | One canonical card, four mirrors, and one shared agent cover the behavior without a new subsystem |
| 4 | **Fits Goal?** | PASS | The packet goal is better prompt quality without routine full-skill loading |
| 5 | **Open Horizons?** | PASS | The shared agent can be reused by later commands or skills |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Decision bundle tracked by this ADR**:

| Decision ID | Decision | Why |
|-------------|----------|-----|
| D-001 | Keep prompt-quality assets inside each CLI skill tree | The current routers only inventory local markdown resources |
| D-002 | Use one canonical prompt-quality card plus four local mirrors | `sk-improve-prompt` owns the domain, while CLI skills need local routable assets |
| D-003 | Split behavior into fast path and deep path | Routine prompts and high-complexity prompts have different context-cost needs |
| D-004 | Ship `@improve-prompt` across all active runtime directories | The repo already uses a runtime parity fleet for shared agents |
| D-005 | Extend `/improve:prompt` instead of creating a second command | One unified prompt-improvement surface is easier to maintain |
| D-006 | Leave `skill_advisor.py` unchanged | Existing routing already points to the right skill families |

**How to roll back**: Revert the mirror-card assets, CLI skill routing changes, runtime agent mirrors, and command-routing updates as one bounded packet if the architecture proves unstable.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
