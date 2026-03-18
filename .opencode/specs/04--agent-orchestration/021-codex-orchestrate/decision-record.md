---
title: "Decision Record: ChatGPT Agent Suite Codex Optimization [021-codex-orchestrate/decision-record]"
description: "The current ChatGPT/Codex orchestrator policy tends to over-decompose work into too many small agent tasks. This behavior increases orchestration overhead and context fragmentat..."
trigger_phrases:
  - "decision"
  - "record"
  - "chatgpt"
  - "agent"
  - "suite"
  - "decision record"
  - "021"
  - "codex"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: ChatGPT Agent Suite Codex Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt Direct-First Delegation for ChatGPT/Codex Orchestrator

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | User request + implementation agent |

---

### Context

The current ChatGPT/Codex orchestrator policy tends to over-decompose work into too many small agent tasks. This behavior increases orchestration overhead and context fragmentation without improving result quality for low and medium complexity requests.

### Constraints
- NDP depth rules must remain unchanged
- Safety and review sections must remain intact
- Scope initially targeted `orchestrate.md`, then expanded to all 8 files under `.opencode/agent/chatgpt/`
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Make direct-first delegation the default for ChatGPT/Codex, and require explicit justification before increasing agent fan-out.

**Details**: Add a Codex optimization profile and a Delegation Eligibility Gate (DEG) that blocks micro-task decomposition, encourages bundled execution for shared-scope work, and reserves broad parallel dispatch for substantial independent workstreams.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Direct-first with DEG (Chosen)** | Reduces micro-fan-out while keeping complex dispatch possible | Requires careful threshold wording | 9/10 |
| Keep current policy and adjust only one threshold | Minimal edits | Does not address root over-decomposition behavior | 5/10 |
| Force single-agent for all tasks | Simplest control | Under-delegates large independent workflows | 4/10 |

**Why Chosen**: This option addresses both policy intent and threshold mechanics, improving behavior without disabling legitimate multi-agent orchestration.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Fewer low-value agent dispatches
- Better task payload quality per dispatched unit
- Lower synthesis overhead in normal workflows

**Negative**:
- Slightly more policy complexity in section 3 and section 8

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Under-delegation for truly complex requests | Medium | Keep explicit expansion criteria in DEG |
| Drift between threshold tables and prose | Medium | Add checklist consistency checks |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly reports excessive agent count and micro-tasks |
| 2 | **Beyond Local Max?** | PASS | Multiple options reviewed with trade-offs |
| 3 | **Sufficient?** | PASS | Combines policy gate + threshold tuning |
| 4 | **Fits Goal?** | PASS | Directly optimizes orchestrator behavior for Codex |
| 5 | **Open Horizons?** | PASS | Leaves room for future runtime enforcement improvements |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/agent/chatgpt/orchestrate.md`

**Rollback**: Revert target file to previous revision.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Raise CWB/TCB Thresholds for Codex Context Capacity

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | User request + implementation agent |

---

### Context

Current threshold values encourage conservative splitting behavior more suitable for tighter-context environments. For ChatGPT/Codex, this leads to unnecessary fragmentation and too many sub-agent tasks.

### Constraints
- Maintain safety controls (output constraints, enforcement points)
- Avoid enabling unbounded parallel dispatch
- Keep anti-pattern and failure-handling sections aligned with new thresholds
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Increase CWB and TCB limits for the ChatGPT orchestrator profile and update linked sections accordingly.

**Details**: Adjust scale thresholds, pre-dispatch triggers, split thresholds, batch sizing, and recovery guidance so medium complexity work stays bundled more often.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Raise CWB/TCB with safeguards (Chosen)** | Better fit for Codex, fewer micro-splits | Requires multi-section updates | 8/10 |
| Keep conservative thresholds | Lowest change risk | Retains known over-decomposition problem | 4/10 |
| Remove thresholds entirely | Maximum flexibility | Unsafe and non-deterministic dispatch behavior | 1/10 |

**Why Chosen**: It improves behavior while preserving explicit safeguards and predictable decision boundaries.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Reduced forced splitting on medium workloads
- Better synthesis quality from richer per-agent outputs

**Negative**:
- If misused, higher limits can increase result payload size

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Context pressure in high-agent scenarios | Medium | Keep CWB enforcement points and wave behavior |
| Stale threshold references in anti-pattern text | Medium | Explicit checklist verification for consistency |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing thresholds are a direct source of over-splitting |
| 2 | **Beyond Local Max?** | PASS | Alternative options evaluated |
| 3 | **Sufficient?** | PASS | CWB + TCB + failure handling updated together |
| 4 | **Fits Goal?** | PASS | Targets Codex-specific optimization request |
| 5 | **Open Horizons?** | PASS | Future tuning remains possible without structural rewrite |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `.opencode/agent/chatgpt/orchestrate.md` sections: dispatch policy, failure handling, budget constraints, anti-patterns

**Rollback**: Revert thresholds and linked prose in target file to prior values.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Consistency-First Cross-Agent Optimization Pass

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | User request + implementation agent |

---

### Context

After orchestrate-focused optimization, sibling ChatGPT agent files still carried inconsistent wording around fast paths, completion gates, exception semantics, and model/threshold expectations. That contradiction drift risks nondeterministic behavior in real dispatch chains.

### Constraints
- Keep edits inside `.opencode/agent/chatgpt/` scope only
- Preserve existing safety controls (NDP, LEAF constraints, guardrails)
- Preserve agent authority boundaries (`@speckit` exclusivity, `@write` spec-folder boundary)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Apply a consistency-first audit and optimization pass across all 8 ChatGPT agent files.

**Details**: Keep orchestrate threshold tuning, then align context/debug/handover/research/review/speckit/write language to remove contradictions and normalize Codex operating assumptions without over-flattening each file's specialized behavior.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Consistency-first full pass (Chosen)** | Resolves drift at root and keeps suite coherent | Larger documentation update surface | 9/10 |
| Keep orchestrate-only changes | Smallest immediate change set | Contradictions persist in sibling files | 4/10 |
| Rewrite all files from template baseline | Maximum normalization | High risk of accidental behavior loss and unnecessary churn | 5/10 |

**Why Chosen**: It addresses contradiction risk directly while preserving each agent's role-specific structure.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Cross-agent guidance is now internally coherent for Codex dispatch behavior
- Completion and exception semantics are clearer and easier to verify
- Checklist evidence can cite consistent policy anchors across files

**Negative**:
- Documentation maintenance burden increases with wider synchronized edits

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-normalization weakens role-specific intent | Medium | Keep file-local specialization and align only shared invariants |
| Future drift reappears after isolated edits | Medium | Require contradiction checks in future checklist P1 items |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly expanded scope to all 8 ChatGPT files |
| 2 | **Beyond Local Max?** | PASS | Multiple alternatives considered (targeted, full rewrite, full pass) |
| 3 | **Sufficient?** | PASS | Covers contradiction fixes plus Codex consistency rules |
| 4 | **Fits Goal?** | PASS | Directly aligns with requested cross-agent optimization consistency |
| 5 | **Open Horizons?** | PASS | Enables future scoped updates with explicit contradiction checks |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `.opencode/agent/chatgpt/context.md`
- `.opencode/agent/chatgpt/debug.md`
- `.opencode/agent/chatgpt/handover.md`
- `.opencode/agent/chatgpt/research.md`
- `.opencode/agent/chatgpt/review.md`
- `.opencode/agent/chatgpt/speckit.md`
- `.opencode/agent/chatgpt/write.md`
- `.opencode/agent/chatgpt/orchestrate.md`

**Rollback**: Revert only the changed ChatGPT agent files while preserving this decision record as an audit trail.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
