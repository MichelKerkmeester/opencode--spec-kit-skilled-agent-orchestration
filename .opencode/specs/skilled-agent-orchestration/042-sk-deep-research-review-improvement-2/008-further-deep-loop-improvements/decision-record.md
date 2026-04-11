---
title: "Decision Record: Further Deep-Loop Improvements [008]"
description: "Architectural decisions for phase 008: canonical graph-convergence regime (ADR-001), improve-agent replay strategy (ADR-002), and tool-routing parity approach (ADR-003). Draft recommendations included; owner finalizes before implementation."
trigger_phrases:
  - "008"
  - "phase 8 ADR"
  - "graph convergence regime decision"
  - "improve-agent replay decision"
importance_tier: "critical"
contextType: "design"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

# Decision Record: Further Deep-Loop Improvements [008]

| Field | Value |
|-------|-------|
| **Spec** | ./spec.md |
| **Plan** | ./plan.md |

Three architectural decisions gate this phase. All three MUST be finalized (with owner sign-off) before any code changes in Parts B and C are executed. Draft recommendations are included; contingency paths are documented so the decision can flip late without re-architecting the phase.

---

## ADR-001 — Canonical Graph-Convergence Regime

**Status**: ✅ **ACCEPTED** (2026-04-11)
**Decision**: **Option A — MCP handler canonical**
**Owners**: phase 008 lead
**Impact**: Blocks Part B (graph wiring) tasks T021 onward. **Unblocked.**

### Context

The repo ships two graph-convergence implementations that both compute stop-blocking signals but use incompatible `sourceDiversity` semantics and threshold scales:

- **CJS helper**: `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`
  - Blends `graphScore` into a weighted composite (graph capped at 40%).
  - Independent hard blockers for contradictions, missing coverage, unverified claims.
  - Synchronous, in-process; no session scoping.
  - Caller-agnostic; currently invoked by no live runtime path.

- **MCP handler**: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`
  - Full signal set: `contradictionDensity`, `claimVerificationRate`, `sourceDiversity`, `evidenceDepth`.
  - Exposes session scoping via tool arguments (ready for REQ-012).
  - Async, MCP-protocol; can be called from any YAML workflow.
  - Backed by the SQLite store so state survives across iterations without in-process memory.

Both implementations are real and defensible, but the repo currently has two incompatible `sourceDiversity` definitions (see iteration-014.md), which means even if the live loops wire up one path, the other remains drift-prone.

### Options

| Option | Pros | Cons |
|--------|------|------|
| **A. MCP handler canonical** | Full signal set, session scoping already shaped, works for any runtime that can issue MCP tool calls, persists state in SQLite | MCP round-trip latency per stop check (needs 500ms budget check); adapter layer needed for CJS callers |
| **B. CJS helper canonical** | Zero network overhead, simpler to call from reducer Node process | Narrower signal set, no session scoping hooks, no shared state, requires every runtime to load the same CJS module |
| **C. Dual truth (do nothing)** | No migration cost | Drift continues; phase 008 cannot claim graph integration is "active and smartly utilized" |

### Recommendation

**Option A — MCP handler canonical.** The user's explicit success criterion for this phase is that the graph must be *actively and smartly utilized*. MCP already does contradiction-aware blocking, has session-scoping hooks, and persists graph state in SQLite — all of which are preconditions for the phase's other REQs. The CJS helper becomes a thin adapter: it accepts existing caller shapes but delegates `sourceDiversity` / `contradictionDensity` / `compositeStop` computation to the MCP handler's output schema (wrapped in a synchronous stub for callers that can't issue MCP calls).

**Latency mitigation**: Budget the graph convergence call at 500ms per iteration (REQ non-functional). Benchmark during Part B; if over budget, either (a) cache the last graph convergence result and refresh asynchronously, or (b) move `deep_loop_graph_upsert` out of the stop-check critical path so only `deep_loop_graph_convergence` runs synchronously.

### Contingency

If MCP handler latency cannot be brought under 500ms per iteration, flip to **Option B** and extend the CJS helper with session scoping + the broader signal set. The `sourceDiversity` harmonization (T021) is already structured as a single canonical implementation imported by the other, so flipping the direction does not require re-architecting Part B.

### Consequences

- Part B task T021 harmonizes `sourceDiversity` in the MCP path first.
- Part B tasks T023–T026 wire `deep_loop_graph_upsert` and `deep_loop_graph_convergence` as MCP calls in all four YAML workflows.
- CJS helper (`coverage-graph-convergence.cjs`) becomes an adapter that calls the MCP convergence handler (or wraps its output schema locally).
- All new MCP calls pass `specFolder + loopType + sessionId` per REQ-012.
- Documentation lists ONLY the MCP regime as canonical from this phase forward.

---

## ADR-002 — `sk-improve-agent` Replay Strategy

**Status**: ✅ **ACCEPTED** (2026-04-11)
**Decision**: **Option A — Implement replay consumers**
**Owners**: phase 008 lead
**Impact**: Blocks Part C task T042 (reducer consumer implementation vs. docs downgrade). **Unblocked.**

### Context

The published `sk-improve-agent` v1.1.0.0 contract claims journal + candidate-lineage + mutation-coverage are consumable during resume. Iteration-012.md confirmed that the shipped reducer only reads `agent-improvement-state.jsonl` + config + drift report, ignoring `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` entirely. Iteration-019.md added that the visible YAML workflow never even emits journal events into the replay path; iteration-020.md added that mutation-coverage is helper-only and never influences focus / stop decisions on the visible operator path.

The gap is larger than a reducer bug: the entire replay consumer surface is missing. Two honest paths exist.

### Options

| Option | Pros | Cons |
|--------|------|------|
| **A. Implement replay consumers** | Fulfills the v1.1.0.0 contract, preserves the journal/lineage/coverage helpers as first-class runtime state, gives operators real resumability | Larger scope: reducer now reads 3 additional artifacts, must handle partial state, must reconcile multiple truth sources |
| **B. Downgrade docs to match reality** | Smaller scope: edit SKILL.md + command doc prose, no code changes beyond removal | Permanently misaligns the shipped helpers with the operator contract; helpers remain unused; future auditors will re-raise the same gap |
| **C. Hybrid (phase 008 implements some, defers others)** | Balances scope and alignment | Requires a follow-up phase; partial consumption can still confuse operators |

### Recommendation

**Option A — Implement replay consumers.** The user's theme throughout the 042 packet has been "finish what 042 already claimed". Downgrading the docs would leave the runtime and contracts permanently misaligned and would contradict the phase 008 charter. The replay consumers are bounded: reducer reads three files, merges their state into `findings-registry.json`, and surfaces key fields on the dashboard.

**Scope control**: Timebox the implementation to 1 engineer-day. If it overruns due to unforeseen integration surface (e.g., schema mismatches between helper outputs and reducer expectations), flip to **Option C** — implement the journal consumer only (the most load-bearing of the three), and defer lineage + coverage consumers to a future packet with an ADR-002-follow-up that explicitly documents the partial alignment.

### Consequences (Option A)

- Part C task T042 extends `sk-improve-agent/scripts/reduce-state.cjs` to read `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` during each refresh pass.
- New registry fields: `journalSummary`, `candidateLineageGraph`, `mutationCoverageSnapshot`.
- Dashboard renders: session outcome from journal, lineage depth count, and mutation coverage ratio.
- Test fixtures (T050) include all three artifacts so the reducer exercise is end-to-end.
- SKILL.md is updated to say "replay reads journal + lineage + coverage" and to point to the new registry fields as operator-visible resume surfaces.

### Contingency (Option C)

If the timebox overruns:
- Implement journal consumer only (most important for operator trust).
- Defer lineage + coverage consumers to a future packet.
- Update SKILL.md to clearly mark lineage + coverage as "shipped helpers, not yet consumed by reducer".
- Document the deferral in `implementation-summary.md` with the overrun evidence.

---

## ADR-003 — Tool-Routing Parity Approach

**Status**: ✅ **ACCEPTED** (2026-04-11)
**Decision**: **Option A — Provision the tools on the live path**
**Owners**: phase 008 lead
**Impact**: Blocks Part B tasks T033–T035. **Unblocked.**

### Context

`.opencode/agent/deep-research.md` and `.opencode/agent/deep-review.md` reference structural Code Graph tools (`code_graph_query`, `code_graph_context`) in their prose, but the corresponding command docs (`.opencode/command/spec_kit/deep-research.md`, `deep-review.md`) do not provision them in the LEAF-tool budget. Iteration-015.md confirmed the drift. The parity must be restored — either by provisioning the tools or by removing the prose.

### Options

| Option | Pros | Cons |
|--------|------|------|
| **A. Provision the tools on the live path** | Matches agent prose, gives iterations real access to structural graph queries, aligns with graph-wiring goal of Part B | Requires verifying that `code_graph_query` / `code_graph_context` MCP handlers are registered (if not, Part B must add them); expands tool budget surface |
| **B. Remove the tools from agent prose** | Smaller scope | Leaves structural graph capability unused on the visible path, contradicts the "active and smart graph usage" success criterion |
| **C. Provision for research, remove from review** | Splits the difference | Creates parity drift between the two loops; increases future maintenance cost |

### Recommendation

**Option A — Provision the tools on the live path.** The phase's explicit goal is active graph utilization. Removing the tools from agent prose without provisioning them is the wrong direction: it reduces graph capability rather than activating it. The implementation cost is small — either add the tools to the command doc tool budget (if they're already registered as MCP handlers) or register the missing handlers.

**Validation step**: Before modifying command docs, confirm that `code_graph_query` and `code_graph_context` are registered in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`. If not, Part B must either register them (preferred) or explicitly defer that work with a follow-up ADR.

### Contingency

If the tools turn out to be un-registered AND registering them requires non-trivial MCP server work, flip to **Option B** (remove from prose) and open a follow-up packet to add them properly. Do NOT ship the phase with prose-vs-budget drift still present.

### Consequences (Option A)

- T033 adds `code_graph_query` and `code_graph_context` to the `allowed-tools` / LEAF-tool budget of `deep-research.md`.
- T034 mirrors in `deep-review.md`.
- T035 syncs runtime mirrors in `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`.
- Playbook scenario T054 (graph-aware stop gate) exercises the structural query path end-to-end.

---

## Cross-Cutting Design Principles (reference, not decisions)

These are not ADRs; they are constraints that apply to all three decisions and to the phase overall:

1. **Fail-closed by default** — Every new state-path choice in phase 008 biases toward loud failure over silent omission. Silent skip of malformed JSONL (sk-deep-review) and silent accept of 1-sample stability (sk-improve-agent) are the two exceptions we are explicitly closing.
2. **Reducer surfaces operator truth** — If an event does not appear in the findings registry, dashboard, or strategy anchors, it does not exist to operators. Every new JSONL event type in Part A must have a corresponding surfacing in Part C.
3. **Graph is a first-class participant** — By the end of phase 008, the coverage graph must be callable on the visible path (upsert) AND consulted on the visible path (convergence) AND surfaced in reducer-owned outputs (graphConvergenceScore). Anything less counts as phase failure.
4. **Session isolation is non-negotiable** — No new feature may aggregate graph state across session boundaries within a packet. REQ-012 is a hard constraint, not a nice-to-have.
5. **Backward compatibility via additive fields** — All new registry / dashboard fields are additive. No existing field is removed or renamed. Existing v1.5.0.0 / v1.2.0.0 / v1.1.0.0 packets MUST resume cleanly.

---

## Decision Timeline

| Decision | Drafted | Owner sign-off | Implementation start |
|----------|---------|----------------|----------------------|
| ADR-001 | 2026-04-11 | 2026-04-11 ✅ MCP handler canonical | Part B tasks T021+ unblocked |
| ADR-002 | 2026-04-11 | 2026-04-11 ✅ Implement replay consumers | Part C task T042 unblocked |
| ADR-003 | 2026-04-11 | 2026-04-11 ✅ Provision tools on live path | Part B tasks T033+ unblocked |

---

## Post-Implementation Review

After the phase closes, this document MUST be updated with:
- Final chosen option for each ADR (may differ from recommendation).
- Observed consequences vs. expected.
- Any contingency path actually used.
- Follow-up work needed for a future packet.

(Filled after implementation — leave blank until CL-E-09 is checked.)
