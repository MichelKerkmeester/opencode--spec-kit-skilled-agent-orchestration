---
title: "Decision Record: Context Agent Model Optimization [011-context-model-optimization/decision-record]"
description: "The @context agent is the highest-frequency agent in the system, dispatched for every codebase exploration, file search, and context retrieval task. It currently runs on Sonnet ..."
trigger_phrases:
  - "decision"
  - "record"
  - "context"
  - "agent"
  - "model"
  - "decision record"
  - "011"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Context Agent Model Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Switch @context Agent from Sonnet to Haiku

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The @context agent is the highest-frequency agent in the system, dispatched for every codebase exploration, file search, and context retrieval task. It currently runs on Sonnet 4.5 ($3/$15 per MTok) across both Copilot and Claude Code platforms. Most invocations (80%) are quick/medium mode performing structured retrieval with 2-10 tool calls. The agent's 439-line definition provides detailed workflow instructions, output templates, and dispatch rules that serve as a cognitive scaffold, reducing the reasoning burden on the model.

### Constraints
- Must maintain Context Package quality across all 3 thoroughness modes
- Copilot model string must be valid (`github-copilot/claude-haiku-4.5`)
- No changes to agent body content — only frontmatter model field
- Rollback must be trivial (<1 minute)

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Switch @context from Sonnet 4.5 to Haiku 4.5 across both platforms.

**Details**: Update model field in `.opencode/agent/context.md` (Copilot) and `.claude/agents/context.md` (Claude Code). Agent instructions remain identical. Haiku 4.5's "near-frontier intelligence" combined with the agent's detailed 439-line workflow definition should produce consistent results. If thorough mode quality degrades, fall back to Option C (hybrid mode-based selection).

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: Full Haiku (CHOSEN)** | 66.7% cost savings, 67% fewer Copilot premium requests, lower latency, simplest implementation (2 line changes) | Thorough mode quality risk (gap detection, complex synthesis) | 8/10 |
| B: Sonnet + Haiku sub-agents | Preserves synthesis quality at Sonnet level, low quality risk | Minimal savings (5-15%), wrong optimization layer (sub-agents rarely dispatched), added complexity | 3/10 |
| C: Hybrid mode-based selection | 53% savings, preserves thorough mode quality | Medium complexity (orchestrator changes), Copilot needs 2 agent files, maintenance burden | 6/10 |

**Why Chosen**: Option A delivers maximum savings with minimum complexity. The key insight is that @context's value comes from its WORKFLOW (detailed instructions), not raw model reasoning power. Haiku 4.5 following a structured 439-line workflow should produce consistent results. Option B was rejected because it optimizes the wrong layer — sub-agents account for <15% of @context's cost. Option C is reserved as a fallback if thorough mode shows measurable quality degradation.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- 66.7% cost reduction on all @context invocations (~$918/month at 100/day)
- 67% fewer Copilot premium requests consumed (0.33x vs 1.0x multiplier)
- Improved latency — Haiku is Anthropic's fastest model tier
- Simplified model hierarchy — one fewer Sonnet consumer, clearer cost attribution

**Negative**:
- Thorough mode may lose gap detection accuracy - Mitigation: Trial period with baseline comparison, Option C fallback
- No published Haiku vs Sonnet benchmarks for tool use accuracy - Mitigation: Empirical testing during verification phase

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Thorough mode quality degradation | High | Option C fallback, trial period |
| Copilot model string invalid | Medium | Verify before implementation |
| Haiku over-dispatches sub-agents | Low | Monitor dispatch frequency |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | @context is highest-frequency agent; 66.7% savings on every exploration task is substantial. Clear cost optimization need. |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives analyzed (full Haiku, Sonnet+Haiku sub-agents, hybrid). Option B rejected with evidence (wrong optimization layer). Option C preserved as fallback. |
| 3 | **Sufficient?** | PASS | Simplest possible implementation: 2 line changes in frontmatter. No agent body changes, no orchestrator changes, no new files needed. |
| 4 | **Fits Goal?** | PASS | Directly reduces API cost and premium request consumption — the stated objective. |
| 5 | **Open Horizons?** | PASS | Fully reversible (30-second rollback). Option C fallback documented. No lock-in, no tech debt. If Haiku proves insufficient, revert and try hybrid. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/agent/context.md` — Copilot agent definition (model field)
- `.claude/agents/context.md` — Claude Code agent definition (model field)

**Rollback**: Revert `model:` field in both files to original values. Total effort: ~30 seconds.

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Reject "Mini Orchestrator" Pattern (Option B)

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Rejected |
| **Date** | 2026-02-14 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The user proposed keeping @context on Sonnet but having it dispatch only Haiku sub-agents — a "mini orchestrator" pattern where synthesis stays at Sonnet level but search work runs on Haiku.

### Constraints
- Same as ADR-001

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Reject Option B — it optimizes the wrong layer.

**Details**: @context's sub-agents (@explore, @research) are dispatched 0-2 times per invocation, and only in medium/thorough modes. Quick mode dispatches zero sub-agents. The @context agent itself is where 85%+ of the cost sits. Switching sub-agents to Haiku while keeping @context on Sonnet saves only 5-15% of total cost — marginal savings for added dispatch complexity.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **B: Sonnet + Haiku sub-agents (REJECTED)** | Preserves synthesis quality | 5-15% savings only, wrong optimization layer, added complexity | 3/10 |
| A: Full Haiku | 66.7% savings, simple | Thorough mode risk | 8/10 |

**Why Rejected**: The "mini orchestrator" pattern is intuitively appealing but quantitatively wrong. Sub-agent dispatches are rare (quick=0, medium=0-1, thorough=0-2) and already lightweight (@explore uses built-in subagent, no custom prompt overhead). The cost center is @context itself — that's the lever that matters.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Avoids unnecessary complexity in dispatch logic
- Preserves clean model assignment (one model per agent, no per-dispatch overrides)

**Negative**:
- None — this is a rejection decision

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | FAIL | Sub-agent cost is <15% of @context total. Optimization target is wrong. |
| 2 | **Beyond Local Maxima?** | N/A | Superseded by Option A analysis |
| 3 | **Sufficient?** | FAIL | 5-15% savings is insufficient given the complexity cost of implementation |
| 4 | **Fits Goal?** | FAIL | Does not meaningfully advance the cost reduction objective |
| 5 | **Open Horizons?** | PASS | No tech debt concerns (because we're not doing it) |

**Checks Summary**: 1/5 PASS (correctly rejected)

<!-- /ANCHOR:adr-002-five-checks -->

<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
