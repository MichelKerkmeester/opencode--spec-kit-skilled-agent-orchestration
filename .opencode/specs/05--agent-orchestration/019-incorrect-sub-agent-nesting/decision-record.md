---
title: "Decision Record: Sub-Agent Nesting Depth Control [019-incorrect-sub-agent-nesting/decision-record]"
description: "The orchestrator agent frequently creates deeply nested sub-agent chains (5+ levels) because there is no formal classification of which agents are allowed to spawn sub-agents. T..."
trigger_phrases:
  - "decision"
  - "record"
  - "sub"
  - "agent"
  - "nesting"
  - "decision record"
  - "019"
  - "incorrect"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Sub-Agent Nesting Depth Control

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Three-Tier Agent Classification (ORCHESTRATOR / DISPATCHER / LEAF)

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | User + Claude |

---

### Context

The orchestrator agent frequently creates deeply nested sub-agent chains (5+ levels) because there is no formal classification of which agents are allowed to spawn sub-agents. The current system only has a loose "sub-orchestrator" concept with a max-2 rule that doesn't account for total chain depth. We need a classification system that preserves existing dispatch patterns (especially @context dispatching @explore) while preventing unbounded nesting.

### Constraints
- Must not break the Two-Tier Dispatch Model (Phase 1: @context exploration, Phase 2: action)
- Must preserve @context's ability to dispatch @explore and @research
- Must work as instruction-based enforcement (no runtime tooling changes)
- Must be identical across all three orchestrate.md variants
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Introduce a 3-tier agent classification system where every agent is classified as ORCHESTRATOR (can dispatch any tier), DISPATCHER (can dispatch LEAFs only), or LEAF (must not dispatch any sub-agents), with an absolute maximum chain depth of 3.

**Details**:
- The orchestrator itself is Tier ORCHESTRATOR at depth 0
- Sub-orchestrators inherit ORCHESTRATOR tier but at depth 1 (reducing their dispatch budget)
- @context is Tier DISPATCHER — it may dispatch LEAF agents (@explore, @research) but nothing deeper
- All implementation/specialist agents (@general, @write, @review, @speckit, @debug, @handover) are Tier LEAF
- @explore and @research are Tier LEAF (when dispatched by @context, they are at max depth)
- Every dispatch includes a `Depth: N` field so receiving agents always know their position
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-tier (ORCHESTRATOR/DISPATCHER/LEAF)** | Preserves @context dispatch pattern; clear classification; prevents unbounded nesting | Adds a new concept (DISPATCHER) to learn | 9/10 |
| Binary (ORCHESTRATOR/LEAF only) | Simpler; only 2 categories | Breaks @context — it would need to be ORCHESTRATOR (too permissive) or LEAF (can't dispatch @explore) | 4/10 |
| No classification (just hard depth cap) | Least change to existing docs | Doesn't prevent agents from being dispatched at wrong depth; ambiguous who can nest | 5/10 |
| Unlimited nesting with token budget | Flexible; market-driven termination | Doesn't solve the core problem — nesting still wastes tokens | 2/10 |

**Why Chosen**: The 3-tier model is the only option that both preserves the existing @context > @explore pattern AND prevents unbounded nesting. Binary classification would either break @context or leave it too permissive. A pure depth cap without classification doesn't give agents enough information to self-enforce.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Clear, enforceable nesting rules — every agent knows exactly what it can and cannot do
- Eliminates the 5-level nesting problem completely
- Preserves all existing valid workflows (@context > @explore, orchestrator > @speckit)
- Minimal changes to existing documentation structure

**Negative**:
- Adds a new concept (DISPATCHER tier) that authors must understand — Mitigation: only @context uses DISPATCHER tier, so the concept is narrow
- Sub-orchestrators become more restricted (depth-limited) — Mitigation: sub-orchestrators were always rare and this prevents them from creating deep chains

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Future agents need DISPATCHER tier | L | Easy to classify — just update routing table |
| Codex ignores tier instructions | M | Tier is embedded in every dispatch template, making it visible at every level |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User reported 5-level nesting as a real problem; tokens wasted on overhead |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; 3-tier is the best balance of simplicity and correctness |
| 3 | **Sufficient?** | PASS | Addresses root cause (no classification) and symptom (deep nesting) |
| 4 | **Fits Goal?** | PASS | Directly on critical path for agent reliability improvement |
| 5 | **Open Horizons?** | PASS | Future runtime enforcement can build on this classification system |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/agent/orchestrate.md` (base)
- `.opencode/agent/chatgpt/orchestrate.md`
- `.opencode/agent/copilot/orchestrate.md`

**Rollback**: `git checkout` the three files — all changes are additive section additions and column additions to existing tables.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Absolute Maximum Depth of 3

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | User + Claude |

---

### Context

The existing nesting rules use relative limits ("max 2 levels" for sub-orchestrators) rather than absolute limits. This allows chains like: Orchestrator(0) > Sub-Orch(1) > @context(2) > @explore(3) > ???(4). We need an absolute ceiling.

### Constraints
- Must accommodate the longest valid chain: Orchestrator > @context > @explore (3 levels)
- Must accommodate sub-orchestrators: Orchestrator > Sub-Orch > @leaf (3 levels)
- Must not go higher than necessary (4+ wastes tokens with no benefit)
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Set absolute maximum depth to 3, counted from the orchestrator (depth 0) to the deepest leaf agent (depth 3 is forbidden — max usable depth is 2).

**Details**:
- Depth 0: Orchestrator (or top-level agent)
- Depth 1: First-level dispatch (sub-orchestrator, @context, @speckit, etc.)
- Depth 2: Second-level dispatch (only from ORCHESTRATOR or DISPATCHER at depth 1)
- Depth 3+: FORBIDDEN — any agent at depth 2 MUST be LEAF

This means: the maximum chain is 3 agents deep (depth 0, 1, 2). The "3" in "max depth 3" refers to the depth counter ceiling (0, 1, 2 = 3 levels of agents).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Max depth 3 (0-1-2)** | Covers all valid patterns; prevents waste | Sub-orchestrator + @context + @explore = exactly 3, no room | 8/10 |
| Max depth 4 (0-1-2-3) | More headroom for complex workflows | Still allows wasteful chains; doesn't force simplicity | 5/10 |
| Max depth 2 (0-1) | Maximum simplicity | Breaks @context > @explore pattern | 3/10 |

**Why Chosen**: Max depth 3 is the tightest limit that accommodates all existing valid workflows. Going lower breaks @context dispatch. Going higher doesn't add value and permits the waste we're trying to eliminate.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Tight enough to prevent wasteful nesting
- Loose enough to preserve @context > @explore and sub-orchestrator > @leaf patterns

**Negative**:
- Sub-orchestrator + @context + @explore would be depth 0+1+2 = exactly at the limit — Mitigation: Sub-orchestrators should dispatch leaf agents, not @context (which is for the top-level orchestrator's Phase 1)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Novel workflow needs depth 4 | L | Refactor into separate sequential dispatches; escalate to user |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without absolute limit, relative limits allow unbounded chains |
| 2 | **Beyond Local Maxima?** | PASS | 3 depth options evaluated |
| 3 | **Sufficient?** | PASS | Combined with tier classification, prevents all known nesting abuse |
| 4 | **Fits Goal?** | PASS | Direct fix for the reported 5-level nesting issue |
| 5 | **Open Horizons?** | PASS | If future needs arise, limit can be raised — but starting tight is correct |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**: Same 3 orchestrate.md files

**Rollback**: Remove depth cap from NDP section — additive change, easy to revert
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
