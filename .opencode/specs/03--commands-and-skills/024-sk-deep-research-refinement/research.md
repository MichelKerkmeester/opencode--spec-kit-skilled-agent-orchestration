# Deep Research: sk-deep-research Refinement (v3 Proposals)

> Spec folder: `.opencode/specs/03--commands-and-skills/024-sk-deep-research-refinement`
> Research completed: 9 iterations across 1 segment
> Sources: 3 reference repos (AGR, pi-autoresearch, autoresearch-opencode), karpathy/autoresearch issues, ML/optimization literature

---

## Executive Summary

The sk-deep-research system is **72% implemented by specification coverage but only 44% by runtime behavior**. The dominant weakness is NOT missing algorithms -- it is the gap between specified algorithms and YAML orchestrator wiring. Of 18 v2 proposals from spec 023, 8 are fully implemented, 5 are specified but not wired, 3 are genuinely unimplemented, 1 is deliberately excluded, and 1 was reclassified.

This research produced **15 consolidated v3 proposals** (after merging v3-16 into v3-08) in 4 priority tiers, with file-level change specifications for the 4 highest-priority items. The single most impactful improvement is closing the spec-code gap (v3-01: Orchestrator Wiring), which requires only YAML changes to unlock capabilities that are already fully specified.

Our system has a **unique competitive advantage**: it is the ONLY autoresearch implementation with algorithmic convergence detection (3-signal composite with MAD noise floor). No reference repo implements statistical convergence -- they use hard caps (pi-autoresearch), human judgment (AGR), or manual sentinels (autoresearch-opencode).

---

## Key Findings

### 1. Three-Tier Architecture Pattern (Iteration 1)

All autoresearch systems operate across three enforcement tiers:

| Tier | Description | pi-autoresearch | AGR | autoresearch-opencode | sk-deep-research |
|------|-------------|-----------------|-----|----------------------|-----------------|
| T1: Code enforcement | Runtime code handles errors | YES (TypeScript) | None | None | None |
| T2: Workflow enforcement | External loop manages lifecycle | Pi Agent extension | run_agr.sh (generated) | autoresearch.sh | YAML workflow |
| T3: Prompt enforcement | AI follows written rules | Supplementary | PRIMARY | PRIMARY | PRIMARY |

Only pi-autoresearch operates at all 3 tiers. Our system and the others rely primarily on T3 (prompt enforcement).

### 2. Convergence Detection Is Uniquely Ours (Iteration 2)

No reference repo implements algorithmic convergence detection:
- **pi-autoresearch**: Hard `maxExperiments` count only. Zero statistical logic.
- **AGR**: "Never stop -- human interrupts." Prompt-based stuck detection (>5 discards).
- **autoresearch-opencode**: `.autoresearch-off` sentinel file. Manual only.
- **sk-deep-research**: 3-signal composite (rolling avg w=0.30, MAD w=0.35, entropy w=0.35) with weighted consensus threshold 0.60.

Our MAD-based noise floor is MORE sophisticated than standard ML `min_delta` (adaptive vs. fixed).

### 3. v2 Proposal Implementation Status (Iteration 3)

| Status | Count | Proposals |
|--------|-------|-----------|
| IMPLEMENTED | 8 | P1.1, P1.3, P1.4, P1.5, P2.3, P2.6, P3.2, P4.4 |
| PARTIALLY IMPLEMENTED (spec-code gap) | 5 | P1.2, P2.1, P2.2, P3.1, P4.1 |
| NOT IMPLEMENTED | 3 | P2.5, P4.2, P4.3 |
| DELIBERATELY EXCLUDED | 1 | P3.3 (git commits -- reference-only by design) |

The "spec-code gap" pattern: algorithms fully specified in convergence.md/state_format.md but YAML orchestrator not wired to invoke them.

### 4. Novel Features from Reference Repos (Iteration 4)

8 features in reference repos have NO corresponding v2 proposal:
1. Security hardening -- input sanitization + command guard (pi-autoresearch)
2. Variance-aware acceptance -- per-question sigma threshold (AGR)
3. Backpressure gate -- pre-iteration external checks (pi-autoresearch)
4. Rate-limited auto-resume -- crash recovery with backoff (pi-autoresearch)
5. Strategy enrichment -- Analysis + Insights sections (AGR)
6. Complexity-aware rejection -- hard gate on low-value complexity (AGR)
7. Git-isolated parallelism -- worktree-based parallel branches (AGR)
8. Dual-gate activation -- opt-in + kill-switch (autoresearch-opencode)

### 5. Community Failure Modes (Iteration 5)

Real-world failures from GitHub issues inform v3 priorities:
- **State leakage** (pi-autoresearch #7): Cross-session variable contamination. Fix: session UUID tagging.
- **Zero-yield experiments** (karpathy #307): 400+ daily attempts, 0 retained. Fix: early zero-yield gate.
- **Multi-instance conflict** (pi-autoresearch #10/#12): Concurrent runs corrupt state. Fix: instance lock.
- **Prompt injection** (karpathy #64): Experiment outputs inject adversarial prompts. Fix: content trust boundary.

### 6. Cross-Domain Convergence (Iteration 6)

ML/optimization frameworks provide 3 actionable improvements:
- **Best-seen patience** (Keras/sklearn): Track improvement over best, not just vs. threshold. Our stuckCount misses "slow decay without absolute low."
- **Comparative stopping** (Optuna WilcoxonPruner): Compare iteration yield against distributional baseline. We only use self-referential signals.
- **CUSUM rejection VALIDATED**: Non-stationary series makes CUSUM inappropriate -- our MAD is better suited.

### 7. Cross-Runtime Behavioral Impact (Iteration 8)

7 unintentional divergences across 4 runtime agent definitions classified by behavioral impact:
- **2 HIGH severity**: Model specification (D1) and temperature (D2) -- these materially affect research outcomes (newInfoRatio trajectory, convergence speed)
- **3 MEDIUM severity**: MCP declaration (D3), reasoning effort (D7), budget wording (D5) -- potential but context-dependent impact
- **1 LOW severity**: Tool/permission granularity (D4) -- cosmetic except for adversarial edge cases
- **1 NONE severity**: Stale agent reference (D6) -- documentation only

7 prioritized alignment recommendations produced. Key finding: only model specification and temperature cause functionally different research outcomes across runtimes.

### 8. Research Ideas Triage and Gap Analysis (Iteration 9)

Systematic triage of 25 research leads (7 seeded + 12 community + 6 meta-research) against v3 proposals:
- **22 leads fully covered** by existing v3 proposals or correctly excluded
- **2 genuine gaps identified**: (a) tool call budget formalization (all 6 agents in spec 023 exceeded 8-12 budget, using 16-34 calls -- assessed as calibration adjustment, not v3-tier proposal), (b) breakthrough detection (sudden high ratio after plateau -- tracked but insufficient evidence for Tier 1-2)
- **1 minor gap**: JSONL ordering after parallel waves (fits under v3-01 as sub-item)
- **No contradictions found** across 9 iterations of findings
- **Simplification**: 15 v3 proposals organized into 3 action categories: WIRE (close spec-code gap), EXTEND (add new capabilities), PROTECT (safety and reliability)

---

## Consolidated v3 Proposals (15 total, after v3-16 merge into v3-08)

### Action Categories (complementary to tier prioritization)

| Category | Description | Proposals | Nature of Work |
|----------|-------------|-----------|---------------|
| **WIRE** | Close the spec-code gap | v3-01 | YAML-only changes to invoke already-specified algorithms |
| **EXTEND** | Add new capabilities | v3-02, v3-03, v3-06, v3-09, v3-10, v3-11, v3-12, v3-13 | Spec + YAML + agent changes |
| **PROTECT** | Safety and reliability | v3-04, v3-05, v3-07, v3-08, v3-14 | Schema + runtime guards |

### Tier 1 -- Critical Path (implement first)

| ID | Proposal | Effort | Impact |
|----|----------|--------|--------|
| v3-01 | Orchestrator Wiring (close spec-code gap for 5 proposals) | Medium | HIGHEST |
| v3-02 | Best-Seen Patience Signal (4th convergence signal) | Small | HIGH |
| v3-03 | Early Zero-Yield Gate (2 consecutive 0.0 = escalate) | Small | HIGH |
| v3-04 | Session UUID Tagging (detect stale state) | Small | MEDIUM |

### Tier 2 -- High Value

| ID | Proposal | Effort | Impact |
|----|----------|--------|--------|
| v3-05 | Instance Lock (prevent concurrent runs) | Small | MEDIUM |
| v3-06 | Per-Question Variance Tracking | Medium | MEDIUM |
| v3-07 | Content Trust Boundary | Medium | MEDIUM |
| v3-08 | Strategy Enrichment (Analysis + Insights) | Small | MEDIUM |
| v3-09 | Comparative Stopping Signal | Medium | MEDIUM |

### Tier 3 -- Nice to Have

| ID | Proposal | Effort | Impact |
|----|----------|--------|--------|
| v3-10 | Pre-Iteration Quality Gate | Small | LOW |
| v3-11 | Warm-Up Parameter | Small | LOW |
| v3-12 | Complexity-Aware Rejection | Medium | LOW |
| v3-13 | Rate-Limited Auto-Resume | Medium | LOW |

### Tier 4 -- Track Only

| ID | Proposal | Effort | Impact |
|----|----------|--------|--------|
| v3-14 | Dual-Gate Activation | Small | MINIMAL |
| v3-15 | Git-Isolated Parallelism | Large | NICHE |

> Note: v3-16 (Progress Visualization) merged into v3-08 (Strategy Enrichment) as a sub-item. Convergence trajectory display is included in strategy enrichment rather than as a separate proposal.

---

## Implementation Critical Path

```
Phase 1 (Foundation) -- Parallel:
  v3-01: Orchestrator Wiring    [YAML only]
  v3-04: Session UUID Tagging   [Schema + YAML]
  v3-05: Instance Lock          [scratch/ file]

Phase 2 (Convergence Upgrade) -- After v3-01:
  v3-02: Best-Seen Patience     [convergence.md + YAML]
  v3-03: Early Zero-Yield Gate  [convergence.md + YAML]

Phase 3 (Quality & Safety) -- Independent:
  v3-06: Per-Question Variance  [convergence.md + agent]
  v3-07: Content Trust Boundary [agent + YAML]
  v3-08: Strategy Enrichment    [templates + agent]

Phase 4 (Advanced) -- After Phase 2 validated:
  v3-09 through v3-16          [As needed]
```

---

## Research Methodology

| Iteration | Focus | newInfoRatio | Key Contribution |
|-----------|-------|-------------|-----------------|
| 1 | Error recovery patterns (RQ1) | 0.75 | Three-tier architecture model; pi-autoresearch security hardening |
| 2 | Convergence logic (RQ2) | 0.67 | Our composite convergence is UNIQUE across all repos |
| 3 | v2 proposal validation (RQ3) | 0.83 | 8 implemented, 5 spec-code gap, 3 not implemented |
| 4 | Gap analysis (RQ4) | 0.75 | 8 novel features, 9 v3 candidates |
| 5 | Community failures (RQ6) | 0.79 | 4 real-world failure modes, 4 new v3 candidates |
| 6 | Cross-domain convergence (RQ7) | 0.75 | Best-seen patience gap, CUSUM rejection validated |
| 7 | Capstone synthesis (RQ8) | 0.67 | 16 consolidated v3 proposals, critical path, file-level specs |
| 8 | Cross-runtime behavioral impact (RQ5) | 0.70 | 7 divergences classified by severity, 15 v3 proposals validated |
| 9 | Final consolidation | 0.25 | RQ gap closure (all 90%+), research-ideas triage, WIRE/EXTEND/PROTECT framework |

Average newInfoRatio: 0.68 across 9 iterations. Iterations 1-8 averaged 0.74 (discovery phase); iteration 9 at 0.25 (consolidation phase) confirms natural convergence.

---

## Appendix: File-Level Change Specs (Tier 1)

### v3-01: Orchestrator Wiring
- `spec_kit_deep-research_auto.yaml`: Add convergenceSignals to JSONL, strategy-based stuck recovery, research-ideas.md injection, statistical validation, file protection enforcement
- `deep-research-config.json`: Add fileProtection default map

### v3-02: Best-Seen Patience Signal
- `convergence.md`: Add Section 2.4, rebalance weights (0.25/0.30/0.25/0.20)
- `spec_kit_deep-research_auto.yaml`: Wire 4th signal, record best_seen_ratio

### v3-03: Early Zero-Yield Gate
- `convergence.md`: Add zero-yield fast-path to Section 5
- `spec_kit_deep-research_auto.yaml`: Add step_check_zero_yield before convergence

### v3-04: Session UUID Tagging
- `state_format.md`: Add sessionId to config schema, stale detection to fault tolerance
- `spec_kit_deep-research_auto.yaml`: Generate UUID in init, validate in read_state
- `deep-research-config.json`: Add sessionId placeholder
