---
title: "Decision Record: Autonomous Deep Research Loop"
description: "Architecture decisions for 3-layer autoresearch system"
trigger_phrases:
  - "autoresearch decisions"
  - "decision record"
importance_tier: "important"
contextType: "general"
---
# Decision Record: Autonomous Deep Research Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: YAML Manages the Loop

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Architecture review |

### Context

We needed a loop engine for iterative research. Two candidates: the orchestrator agent manages the loop directly, or a YAML workflow defines the loop structure and the orchestrator executes it.

### Constraints

- YAML workflows are the established pattern for multi-step commands
- Orchestrator already has complex logic; adding loop management increases cognitive load
- Loop behavior (max iterations, convergence thresholds) should be configurable without agent changes

### Decision

**We chose**: YAML workflow defines the loop structure, phases, and dispatch steps.

**How it works**: The command loads a YAML file that defines phase_init, phase_loop (with convergence checks), and phase_synthesis. The orchestrator executes the YAML steps sequentially.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **YAML workflow** | Self-contained, configurable, follows existing patterns | More verbose than code | 8/10 |
| Orchestrator-managed loop | Simpler dispatch, fewer files | Mixes loop logic with orchestration, harder to configure | 5/10 |
| Shell script (AGR pattern) | Proven in autoresearch repos | Bypasses our orchestration layer entirely | 3/10 |

**Why this one**: Follows established patterns and keeps loop configuration separate from agent logic.

### Consequences

**What improves**:
- Loop parameters (max iterations, thresholds) configurable in YAML without code changes
- Consistent with existing `/spec_kit:research` command structure

**What it costs**:
- Two YAML files (~870 LOC total). Mitigation: Follow established spec_kit_research YAML pattern
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: @deep-research is LEAF-Only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Architecture review |

### Context

We needed to decide whether the research agent can dispatch sub-agents for parallel investigation within an iteration, or must be self-contained.

### Constraints

- NDP (Nesting Depth Protocol) limits agent depth to 2 (orchestrator at 0, leaf at 1)
- TCB (Tool Call Budget) recommends 6-8 tool calls per dispatch
- Fresh context per iteration means the agent should be simple and focused

### Decision

**We chose**: @deep-research is LEAF-only with no sub-agent dispatch capability.

**How it works**: Each iteration is self-contained. The agent reads state, performs 3-5 research actions using direct tools (WebFetch, Grep, Read), writes findings, and exits.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **LEAF-only** | NDP compliant, simple, predictable cost per iteration | Single-threaded within iteration | 8/10 |
| Allow sub-agents | Could parallelize within iteration | Violates NDP, complex error handling, higher cost | 4/10 |

**Why this one**: NDP compliance is a hard constraint. Parallel research can be achieved at the loop level by the orchestrator dispatching multiple iterations.

### Consequences

**What improves**:
- Predictable cost per iteration (~6-8 tool calls)
- Simple error handling (agent either completes or fails)

**What it costs**:
- Cannot parallelize within a single iteration. Mitigation: Orchestrator can dispatch parallel iterations in v1.1
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Dual State Format (JSONL + Strategy.md)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Architecture review |

### Context

Research state must persist across fresh-context iterations. We needed a format that is both machine-parseable (for convergence detection) and agent-readable (for context injection).

### Constraints

- Append-only writes prevent state corruption
- Agent needs natural language context about what worked/failed
- Orchestrator needs structured data for convergence math

### Decision

**We chose**: Dual format with JSONL for structured data and strategy.md for agent context.

**How it works**: `deep-research-state.jsonl` stores iteration metadata (run number, findingsCount, newInfoRatio). `deep-research-strategy.md` stores what worked, what failed, exhausted approaches, and next focus area.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **JSONL + strategy.md** | Best of both: structured + readable | Two files to maintain | 9/10 |
| JSONL only | Single source of truth | Agents struggle to extract context from JSON | 5/10 |
| Markdown only | Human-readable | Hard to parse for convergence math | 4/10 |
| SQLite | Queryable, transactional | Overkill, binary format, harder to debug | 3/10 |

**Why this one**: Adapted from AGR (STRATEGY.md) + pi-autoresearch (JSONL). Each format serves its primary consumer optimally.

### Consequences

**What improves**:
- Orchestrator can compute convergence from JSONL without parsing markdown
- Agent gets rich, readable context from strategy.md

**What it costs**:
- Two files must stay in sync. Mitigation: Agent updates both atomically at end of each iteration
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: No code_mode MCP on Agent

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Architecture review |

### Context

The existing @research agent includes code_mode MCP for external tool access. We considered whether @deep-research needs it.

### Decision

**We chose**: Exclude code_mode MCP from @deep-research.

**How it works**: Agent uses only native tools (Read, Write, Edit, Bash, Grep, Glob, WebFetch) and spec_kit_memory MCP. No external tool chain.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No code_mode** | Simpler TCB, fewer failure modes, faster iterations | Cannot use external tools (ClickUp, Figma) | 8/10 |
| Include code_mode | Access to external services | Higher TCB, more failure modes, slower | 5/10 |

**Why this one**: Deep research primarily needs WebFetch and codebase tools. External integrations add complexity without proportional value for research tasks.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Separate from /spec_kit:research

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Architecture review |

### Context

We could either add loop mode to the existing `/spec_kit:research` command or create a separate `/spec_kit:deep-research` command.

### Decision

**We chose**: Create a separate `/spec_kit:deep-research` namespace.

**How it works**: `/spec_kit:deep-research` is a new command with its own YAML workflows, independent from `/spec_kit:research`. They serve different use cases (iterative vs single-pass).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate namespace** | Clean separation, no risk to existing workflow | New command to learn | 8/10 |
| Enhance /spec_kit:research | Single entry point | Conflates two distinct use cases, bloats existing YAML | 4/10 |

**Why this one**: Single-pass and iterative research have fundamentally different state management, convergence detection, and loop lifecycle needs. Merging them would complicate both.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Default 10 Max Iterations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Architecture review |

### Context

AGR case study data shows diminishing returns past 15 iterations. We needed a sensible default.

### Decision

**We chose**: Default max iterations of 10, configurable per session.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **10 (default)** | Balances depth vs cost, well under diminishing returns | May not be enough for very broad topics | 8/10 |
| 5 | Lower cost | May stop too early | 5/10 |
| 20 | Maximum depth | Likely wastes API budget on low-value iterations | 4/10 |
| No limit | Maximum flexibility | Risk of runaway loops | 2/10 |

**Why this one**: 10 iterations at ~$0.20-0.50 each gives $2-5 total cost. Users can adjust with `--max-iterations` flag.
<!-- /ANCHOR:adr-006 -->

---

## v2 Decisions (from 14-Iteration Deep Research)

> These ADRs are derived from code-level analysis of 4 autoresearch repos + 322 community issues. See `scratch/improvement-proposals.md` v2 and `research/research.md` Section 18.

---

<!-- ANCHOR:adr-007 -->
## ADR-007: 3-Signal Composite Convergence (Drop CUSUM)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Deep research synthesis (iteration 014) |

### Context

v1 convergence uses a single signal (rolling 3-iteration average of newInfoRatio < threshold). Research iteration 004 proposed 4 algorithms from optimization literature (Optuna, NIST CUSUM, pi-autoresearch MAD, entropy-based). Iteration 012 analyzed real execution data showing research loops are 10-50x shorter than optimization loops (7-14 vs 100-400 iterations).

### Decision

**We chose**: 3-signal weighted composite, dropping CUSUM.

**Signals**: Rolling average (0.30), MAD noise detection (0.35), question-coverage entropy (0.35).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-signal composite** | Robust, degrades gracefully, works at small N | More complex than single signal | 9/10 |
| 4-signal with CUSUM | Most theoretically complete | CUSUM needs large N; 3 tuning params | 5/10 |
| Single signal (status quo) | Simplest | Single point of failure, no noise detection | 4/10 |

**Why CUSUM dropped**: Research loops have 7-14 iterations. CUSUM requires sufficient data points for regime detection -- impractical at small N. The 3-signal approach achieves similar sensitivity without CUSUM's complexity.

### Consequences

**What improves**: Convergence detection becomes noise-aware (MAD) and content-aware (question entropy). Degrades gracefully with < 4 iterations.

**What it costs**: Implementation is Medium effort. Mitigation: Each signal is independent and can be tested separately.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Prompt-Only Error Recovery (No Code Enforcement)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Deep research code analysis (iterations 008-010) |

### Context

Round 1 analysis described AGR as having "5-tier error handling in code." Round 2 code-level analysis (iteration 009) revealed the 5-tier system exists ONLY as natural language instructions in program.md -- there is NO shell-level or programmatic enforcement. Similarly, autoresearch-opencode's "rich context injection" is a static string, not dynamic state assembly.

### Decision

**We chose**: Error recovery tiers are defined in agent protocol (prompt) and convergence documentation, not in code.

**How it works**: The agent definition and convergence.md describe 5 recovery tiers. The orchestrator's existing error handling (Task tool retry) provides Tier 5 (direct mode fallback).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Prompt-only** | Simple, follows AGR proven pattern, Small effort | Agent may ignore under pressure | 8/10 |
| Programmatic enforcement | Guaranteed compliance | Requires code changes, higher effort | 6/10 |
| Hybrid (prompt + validation) | Best of both | More complex to maintain | 5/10 |

**Why this one**: AGR's real-world production experience shows prompt-only enforcement works. Code enforcement adds Medium effort for marginal benefit. If agents ignore recovery tiers, the orchestrator's Tier 5 (direct mode) catches the failure regardless.

### Consequences

**What improves**: Implementation effort reduced from Medium to Small. All 5 tiers achievable via documentation changes only.

**What it costs**: No guaranteed compliance. Mitigation: Orchestrator provides fail-safe at Tier 5.
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Segment Model for Multi-Session Research

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Deep research analysis (iterations 008, 012) |

### Context

pi-autoresearch implements a segment counter in JSONL that enables re-initialization without losing history. A config entry after existing results increments the segment counter. Convergence filtering scopes to the current segment. This was confirmed in the actual TypeScript code (iteration 008).

### Decision

**We chose**: Add segment field to JSONL records with per-segment convergence filtering.

**How it works**: Each JSONL iteration record gets a `"segment"` field (default 1). A `segment_start` event marks new segments. Convergence computation filters by current segment for rolling averages. Cross-segment analysis reads the full JSONL without filtering.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Segment field** | Clean re-init, preserves history, proven in pi-autoresearch | Schema change | 9/10 |
| New spec folder per topic | Clean isolation | Spec folder proliferation | 5/10 |
| No multi-session support | Simplest | Cannot restart without losing history | 3/10 |

**Why this one**: Directly validated by pi-autoresearch production code. Small schema change with high flexibility gain.
<!-- /ANCHOR:adr-009 -->
