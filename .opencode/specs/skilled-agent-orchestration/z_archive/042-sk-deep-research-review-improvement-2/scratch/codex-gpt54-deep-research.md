# GPT-5.4 Deep Research: Deep Skills Optimization (10 Iterations)

> Generated via Codex CLI (`gpt-5.4`, reasoning: `high`, service tier: `fast`)
> 205,031 tokens consumed | 10 iterations | 14 evidence anchors (repo) + 6 external (LangGraph, AutoGen, CrewAI, DSPy)
> Date: 2026-04-10

---

## Evidence Sources

**Repo anchors:**
- `E1` — 042 spec.md
- `E2` — 042 tasks.md
- `E3` — sk-deep-research convergence.md
- `E4` — sk-deep-research loop_protocol.md
- `E5` — sk-deep-research reduce-state.cjs
- `E6` — sk-deep-review convergence.md
- `E7` — sk-deep-review loop_protocol.md
- `E8` — deep-review agent
- `E9` — deep-research agent
- `E10` — deep-research-contract-parity.vitest.ts
- `E11` — deep-review-contract-parity.vitest.ts
- `E12` — deep-review-reducer-schema.vitest.ts
- `E13` — spec_kit_deep-research_auto.yaml
- `E14` — spec_kit_deep-review_auto.yaml

**External anchors:**
- `W1` — LangGraph durable execution
- `W2` — LangGraph overview
- `W3` — AutoGen AgentChat
- `W4` — CrewAI Flows
- `W5` — CrewAI Tracing
- `W6` — DSPy

---

## Iteration 1: Shrink the Hot Path

**Focus**: Q1 (Loop Runtime Optimization), Q4 (Cross-Loop Synergy)

**Key Findings:**
- Deep-research still reparses full iteration markdown and rewrites registry, strategy, and dashboard on each reducer run; that will scale with total artifact volume, not latest delta. Move to delta replay plus periodic snapshots/compaction. Evidence: E5, E13.
- Deep-review already documents a cleaner reducer IO contract (`latestJSONLDelta`, `newIterationFile`, `priorReducedState`), which is the right shared substrate to reuse across both loops. Evidence: E7, E12.
- Add write durability tiers: `sync` for lineage/stop events, `async` for dashboards, `exit` for optional secondary renders. That keeps audit truth strong without paying full-cost I/O every iteration. Evidence: E1, W1.

**Novel Insight:** The biggest runtime win is separating authoritative state from derived views, not shaving prompt text.

**Connections:** REQ-001, REQ-003, REQ-007, REQ-013, REQ-014; T005, T006, T010, T011, T019, T020.

**Open Questions:** Should compaction trigger by run count, JSONL size, or wall-clock duration?

---

## Iteration 2: Smarter Convergence

**Focus**: Q2 (Convergence Intelligence)

**Key Findings:**
- Current convergence is already better than threshold-only math, but it is still statistical plus coverage-based; it does not reason over semantic novelty, contradiction density, or citation overlap. Add semantic dedupe and contradiction graph signals. Evidence: E3, E6, E13, E14.
- Research quality guards and review quality gates already block illegal STOPs; formalize `blocked_stop_reason` as a first-class event so operators can distinguish "saturated" from "not yet legally done." Evidence: E3, E6, E13, E14.
- Tighten thresholds adaptively as runs progress and as source quality improves, instead of relying on static 0.05/0.10 defaults alone. Evidence: E3, E6.

**Novel Insight:** Convergence should be a typed decision trace, not a scalar score.

**Connections:** REQ-001, REQ-002, REQ-004, REQ-006, REQ-007; T001-T004, T017-T020.

**Open Questions:** What is the cheapest semantic-novelty implementation that stays packet-local and replayable?

---

## Iteration 3: Recovery as a Ladder, Not a Branch

**Focus**: Q3 (Agent Autonomy & Recovery)

**Key Findings:**
- Research recovery has good failure-mode labels, but execution is still mostly "try a fundamentally different approach" once, then synthesize gaps. Add a staged ladder: reformulate query, authority escalation, decomposition, contradiction resolution, graceful partial closeout. Evidence: E4, E13.
- Review recovery is sharper, but still only has three strategies. Add evidence-quality scoring and "distance from prior focus" so recovery is selected by measured diversification, not only by failure type. Evidence: E6, E7, E14.
- Preserve recovery provenance in journals so later runs can learn which pivots worked. Evidence: E1, E2, E4, E7.

**Novel Insight:** Recovery is an optimization surface in its own right and should feed future controller tuning.

**Connections:** REQ-002, REQ-004, REQ-006, REQ-007; T003, T004, T007, T008, T017, T018.

**Open Questions:** When should the loop abandon recovery and force a partial-but-honest synthesis?

---

## Iteration 4: Shared Runtime Without a Hidden DSL

**Focus**: Q4 (Cross-Loop Synergy)

**Key Findings:**
- The shared layer should be event schema, lineage semantics, reducer IO, dashboard rendering, replay validation, and pause/resume handling, not a generic workflow language. Evidence: E1, E4, E7.
- Deep-research already treats strategy/registry/dashboard as reducer-owned, while deep-review still instructs the agent to edit strategy directly. Unify deep-review on reducer-owned machine sections. Evidence: E8, E9.
- Contract parity is already enforced across docs, workflows, and mirrors; that gives a safe seam for extracting helpers without collapsing product-specific behavior. Evidence: E10, E11, E12.

**Novel Insight:** The repo already contains the anti-DSL boundary; the missing step is consistency, not invention.

**Connections:** REQ-012, REQ-013, REQ-014; T013-T016, T021.

**Open Questions:** Which shared helper should land first: lineage events, dashboard renderers, or reducer adapters?

---

## Iteration 5: Trust Surfaces That Operators Can Audit

**Focus**: Q5 (Quality & Trust Surfaces)

**Key Findings:**
- Review already requires claim-adjudication packets for new P0/P1 findings; research should gain an equivalent claim ledger with `verified`, `contradicted`, and `unresolved` states plus confidence and downgrade triggers. Evidence: E1, E8.
- Source diversity exists in research guards, but provenance chains are still thin. Add source-class weighting, contradiction tracking, and citation graph rollups to both loops. Evidence: E3, E5, E6.
- Promotion checkpoints in research should explicitly block "adopt" recommendations when evidence quality is mixed, not just when novelty is low. Evidence: E1, E2.

**Novel Insight:** The right trust primitive is not "confidence score" alone; it is "confidence + downgrade condition + provenance path."

**Connections:** REQ-005, REQ-008, REQ-009; T009, T012.

**Open Questions:** Should research claim adjudication stay synthesis-only, or surface live during iterations like review?

---

## Iteration 6: Scaling to 1000 Files and 50 Domains

**Focus**: Q6 (Scalability)

**Key Findings:**
- Review needs a required inventory pass, hotspot ranking, and stratified coverage plan for large repos; flat iteration over a monolithic scope will waste runs. Evidence: E7, E14.
- Research needs domain clustering by authority/source type before convergence is meaningful at 50+ domains; otherwise the loop mixes saturation in one cluster with ignorance in another. Evidence: E4, E13.
- The existing reference-only wave/segment ideas are the right direction, but should become orchestrator-managed batches that preserve LEAF semantics instead of nested agents. Evidence: E4, E13, W3, W4.

**Novel Insight:** Scalability is mostly a decomposition problem, not a token-budget problem.

**Connections:** REQ-011, REQ-014; T023 plus a missing foundational task.

**Open Questions:** What is the minimum viable "hotspot sampler" for review that stays explainable?

---

## Iteration 7: Observability and Debuggability

**Focus**: Q7 (Observability & Debugging)

**Key Findings:**
- Current dashboards expose ratios and coverage, but not a full stop-decision explanation tree, state diffs, anomaly alerts, or performance histograms. Add those before optional advanced modes. Evidence: E3, E5, E6, E12.
- Both loops already capture enough raw material for timing/tool/source observability (`durationMs`, `toolsUsed`, `sourcesQueried`), but dashboards underuse it. Evidence: E5, E8, E9.
- Borrow tracing ideas from LangGraph/CrewAI, but keep them packet-local and replayable first; hosted observability can stay optional. Evidence: W2, W5.

**Novel Insight:** The next debugging bottleneck is not "why did the agent think that?" but "why did the workflow decide that?"

**Connections:** REQ-004, REQ-006, REQ-007; T007-T011, T017-T020.

**Open Questions:** Which observability surfaces are mandatory in-repo versus optional external integrations?

---

## Iteration 8: Broader OpenCode Integration

**Focus**: Q8 (Integration Patterns)

**Key Findings:**
- Both commands already integrate memory at startup, but not enough with post-iteration retrieval, spec lifecycle hooks, or follow-on packet creation. That is the cleanest ecosystem win. Evidence: E13, E14.
- Review should explicitly call code graph and semantic search during scope discovery and traceability plateaus; research should use semantic/code search more aggressively during ideation and recovery. Evidence: E7, E13, E14.
- Add lifecycle hooks so completed research can seed plan packets and completed review can seed remediation packets with explicit carry-forward artifacts. Evidence: E1, E2.

**Novel Insight:** Deep loops should feel less like standalone products and more like packet generators with memory.

**Connections:** REQ-004, REQ-011, REQ-012, REQ-013.

**Open Questions:** What hook contract keeps memory helpful without causing stale-context pollution?

---

## Iteration 9: Testing Beyond Parity and Schema

**Focus**: Q9 (Testing Innovation)

**Key Findings:**
- The packet plans behavioral tests, but the current repo tree only contains parity and reducer/schema tests for these loops; that leaves replay, recovery, blocked-stop, and large-target behavior underprotected today. Evidence: E2, E10, E11, E12.
- Add property-based convergence tests, mutation tests for severity/adjudication, chaos tests for partial state and resume, and golden-file regression for dashboards/report synthesis. Evidence: E3, E6, E12.
- Build a replay corpus from real JSONL plus iteration files so reducers and stop decisions can be deterministically re-run from saved packets. Evidence: E5, E7.

**Novel Insight:** Replay tests are the natural bridge between reducer correctness and workflow correctness.

**Connections:** REQ-006, REQ-007, REQ-013; T017-T021, T024.

**Open Questions:** Which real packet families should seed the first replay corpus: 028, 040, or 042 fixtures?

---

## Iteration 10: Future Architecture Patterns Worth Adapting

**Focus**: Q10 (Future Architecture)

**Key Findings:**
- LangGraph's durable execution model is a strong fit for lineage, checkpoint durability, replay, and human pause/resume semantics. Evidence: W1, W2.
- AutoGen and CrewAI validate graph/workflow orchestration, memory, serialization, and tracing as first-class concerns; the lesson here is typed workflow state plus observability, not "more agents." Evidence: W3, W4, W5.
- DSPy's compile/evaluate loop suggests an offline optimizer for recovery prompts, convergence thresholds, and synthesis instructions trained against replay corpora and rubric metrics. Evidence: W6.

**Novel Insight:** The best "next architecture" is an offline loop optimizer attached to a very explicit runtime, not a smarter runtime hidden behind more abstraction.

**Connections:** REQ-006, REQ-010, REQ-011, REQ-014.

**Open Questions:** Where should offline optimization outputs live so parity tests can police them?

---

## SYNTHESIS

### Top 10 Recommendations

| Rank | Recommendation | Effort | Impact |
|------|---------------|--------|--------|
| 1 | Shared delta reducer plus periodic packet snapshots/compaction | 4/5 | 5/5 |
| 2 | Typed stop-decision schema with `stopReason`, `blockedBy`, `recoveryStrategy`, and replay validation | 3/5 | 5/5 |
| 3 | Make deep-review machine-owned sections reducer-owned, matching deep-research | 2/5 | 4/5 |
| 4 | Move behavior/replay testing earlier and add chaos/property/golden coverage | 4/5 | 5/5 |
| 5 | Add semantic novelty, contradiction density, and citation-graph signals to convergence | 4/5 | 4/5 |
| 6 | Extend claim adjudication into a research claim ledger with promotion checkpoints | 3/5 | 4/5 |
| 7 | Add packet-local observability: timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down | 3/5 | 4/5 |
| 8 | Add large-target decomposition rules: inventory, hotspot ranking, clustering, sampling, and segment/wave governance | 4/5 | 4/5 |
| 9 | Upgrade recovery into a measured ladder with provenance and offline learnability | 3/5 | 4/5 |
| 10 | Build an offline optimizer for prompts/thresholds/recovery policies using replay corpora and rubric scoring | 5/5 | 3/5 |

### Quick Wins (< 1 session each)

1. Add `schemaVersion`, `stopReason`, `blockedBy`, and `recoveryStrategy` fields to config and event records
2. Surface `durationMs`, `toolsUsed`, and `sourcesQueried` in both dashboards immediately
3. Stop letting `@deep-review` edit machine-owned strategy sections directly
4. Add replay fixtures for `invalid-state`, `resume`, and `completed-continue`
5. Create the missing behavioral test files as thin end-to-end fixture harnesses before expanding them

### Moonshots (significant architecture work)

1. **Segment/wave executor** with promotion, pruning, and packet-local coordination board for very large targets
2. **Semantic coverage graph** over questions, findings, contradictions, and citations to drive convergence and recovery
3. **DSPy-style offline compiler** that tunes prompts, recovery policies, and thresholds from prior run traces

### Gaps in 042 Spec

- No explicit snapshot/compaction/durability plan for 100+ iteration packets
- No dedicated observability/tracing requirement, even though the loops are long-running and artifact-heavy
- No explicit large-target decomposition policy beyond the optional coordination board
- No semantic novelty or contradiction-graph requirement for convergence
- Behavioral testing is planned, but too late in the phase order to protect early contract work

### Recommended Phase Order Adjustments

1. **Keep current Phase 1**, but add typed event schema and replayable stop-decision logging into that same foundation slice
2. **Pull behavior/replay harness work forward** so it starts immediately after Phase 1, not after most runtime changes are already landed
3. **Split current Phase 2** into `2a` (state/observability substrate) and `2b` (trust surfaces/ledgers/critique)
4. **Keep council synthesis and coordination boards last**, but move large-target decomposition groundwork earlier if 1000-file or 50-domain runs are a real near-term target
