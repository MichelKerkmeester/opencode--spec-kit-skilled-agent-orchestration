---
title: "Decision Record: Orchestrate Agent Context Window Protection [006-orchestrate-context-window/decision-record]"
description: "When the orchestrate agent dispatches 10-20 sub-agents in parallel, all results return simultaneously into the orchestrator's context window. Each agent returns ~2-8K tokens, so..."
trigger_phrases:
  - "decision"
  - "record"
  - "orchestrate"
  - "agent"
  - "context"
  - "decision record"
  - "006"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: Orchestrate Agent Context Window Protection

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: File-Based Result Collection for Large Dispatches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-06 |
| **Deciders** | Michel, Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

When the orchestrate agent dispatches 10-20 sub-agents in parallel, all results return simultaneously into the orchestrator's context window. Each agent returns ~2-8K tokens, so 20 agents produce ~40-160K tokens of results. Combined with the system prompt (~20K), conversation history, and the agent definition itself (~15K), this exceeds the context window, causing irrecoverable "Context limit reached" errors.

### Constraints
- Cannot modify Claude Code's context window size (platform constraint)
- Cannot modify the Task tool's return behavior (external tool)
- Must work within existing agent markdown format (no code execution in orchestrator)
- Must not break the parallel-first principle for small dispatches (1-4 agents)

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: For dispatches of 5+ agents, mandate that agents write detailed findings to scratchpad files and return only a concise summary (max 30 lines / ~500 tokens) to the orchestrator.

**Details**: The orchestrator instructs each agent to write full findings to a designated file path (e.g., `scratch/agent-N-findings.md` in the spec folder, or the session scratchpad directory). The agent's direct return to the orchestrator is a summary of key findings only. The orchestrator then reads files selectively during synthesis, never loading all results into context simultaneously.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **File-based collection** | Scales to 20+ agents; orchestrator context stays small; detailed findings preserved on disk | Adds file I/O step; agents must follow write instructions | 9/10 |
| Reduce max agents to 5 | Simple; no new patterns needed | Loses parallelism benefit; doesn't solve root cause | 4/10 |
| Streaming/progressive collection | Results arrive incrementally | Not supported by Task tool; would require platform changes | 3/10 |
| Increase prompt to say "be brief" | Zero structural change | LLMs don't reliably follow length constraints; fragile | 2/10 |

**Why Chosen**: File-based collection is the only approach that preserves full parallelism (20 agents) while keeping the orchestrator's context small. It leverages existing capabilities (scratchpad directory, Read tool) without platform changes.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Screenshot shows complete session failure from this exact issue |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; file-based scored highest |
| 3 | **Sufficient?** | PASS | Combined with wave batching, covers all scale scenarios |
| 4 | **Fits Goal?** | PASS | Directly prevents the observed failure mode |
| 5 | **Open Horizons?** | PASS | Pattern is generic; works for any number of agents |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Orchestrator can safely dispatch 20 agents without context overflow
- Full detailed findings preserved in files for later reference
- Orchestrator context stays lean, leaving room for synthesis

**Negative**:
- Agents must follow file-write instructions - Mitigation: Explicit instructions in dispatch template with exact file paths
- Orchestrator must read files during synthesis - Mitigation: Read only summaries first, drill into files selectively

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent ignores file-write instruction | M | Include in dispatch template as P0 requirement; verify via file existence check |
| File path conflicts between agents | L | Use deterministic naming: `agent-{N}-{topic}.md` |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/agent/orchestrate.md` (primary target)

**Rollback**: Revert orchestrate.md to previous version (git revert)

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Batched Wave Collection for 5+ Agents

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-06 |
| **Deciders** | Michel, Claude |

---

<!-- ANCHOR:adr-002-context -->
### Context

Even with file-based collection, dispatching 20 agents simultaneously means 20 summary returns (~500 tokens each = ~10K tokens). For the orchestrator to synthesize effectively, it needs to process results in manageable batches rather than all at once.

### Constraints
- Must preserve parallel execution within each wave
- Must not add excessive round-trips for small dispatches
- Wave size must be calculated, not arbitrary

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Dispatch agents in waves of 4-6, collecting and synthesizing each wave before dispatching the next.

**Details**:
- **1-4 agents**: Direct parallel dispatch, collect all results (no waves needed)
- **5-9 agents**: 2 waves of ~4-5 agents each
- **10-15 agents**: 3 waves of ~4-5 agents each
- **16-20 agents**: 4 waves of ~4-5 agents each

Each wave completes and its results are synthesized (compressed into key findings) before the next wave dispatches. This keeps the orchestrator's active context to ~4-5 agent summaries at a time.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Batched waves of 4-6** | Predictable context usage; still parallel within wave | Adds sequential overhead between waves | 8/10 |
| All agents background, read files only | Maximum parallelism | Orchestrator has no intermediate synthesis; may still overflow reading files | 6/10 |
| Single-agent sequential | Zero overflow risk | Loses all parallelism; 20x slower | 2/10 |

**Why Chosen**: Waves preserve intra-wave parallelism while giving the orchestrator synthesis checkpoints between waves.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Even with file-based collection, 20 simultaneous returns can overflow |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives evaluated |
| 3 | **Sufficient?** | PASS | Combined with file-based pattern, covers the full problem |
| 4 | **Fits Goal?** | PASS | Directly manages result volume per round-trip |
| 5 | **Open Horizons?** | PASS | Wave size is parameterizable for different context windows |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Predictable context usage per wave
- Synthesis checkpoints allow early error detection
- Progressive results visible to user between waves

**Negative**:
- Total wall-clock time increases for 10+ agent dispatches - Mitigation: Each wave still runs in parallel; overhead is synthesis time only

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

## Session Decision Log

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 10:30 | Gate 3 | User specified spec folder 006 | HIGH | 0.05 | User's explicit instruction |
| 10:35 | ADR-001 | File-based collection | HIGH | 0.10 | Screenshot evidence + root cause analysis |
| 10:35 | ADR-002 | Batched waves | HIGH | 0.15 | Complementary to ADR-001, covers summary overflow |
