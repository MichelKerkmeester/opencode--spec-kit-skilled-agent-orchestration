# Iteration 7: RQ8 -- Capstone Synthesis: What v2 Deep-Research Looks Like

## Focus
Synthesize all findings from iterations 1-6 into a coherent answer to RQ8: "What would a v2 deep-research system look like if designed from scratch with current knowledge?" This is NOT about rewriting from scratch -- it is about identifying the OPTIMAL configuration of all validated proposals, new discoveries, and architectural patterns. Deliverables: (1) v2 architecture changes, (2) consolidated v3 proposal list, (3) critical implementation path, (4) single most impactful insight.

## Findings

### Finding 1: The v2 Architecture -- 4 Structural Changes from v1

Based on 6 iterations of cross-referencing 4 repositories, 18 v2 proposals, community failure modes, and cross-domain convergence literature, the v2 architecture differs from v1 in exactly 4 structural ways:

**A. Close the Spec-Code Gap (the dominant finding)**
The single largest issue is NOT missing features -- it is that 5 proposals are fully specified in reference documents but the YAML orchestrator does not wire them. This is the "spec-code gap" pattern discovered in iteration 3 and confirmed as the #1 priority in iteration 4.

| Partially Implemented | What Exists | What's Missing |
|----------------------|-------------|----------------|
| P1.2 Composite Convergence | Full 3-signal algorithm in convergence.md | convergenceSignals not written to JSONL by orchestrator |
| P2.1 Enriched Stuck Recovery | 3 strategies with selection logic in convergence.md | Orchestrator uses generic "widen scope" fallback |
| P2.2 Ideas Backlog | Agent reads research-ideas.md | Orchestrator does not inject contents into dispatch |
| P3.1 Statistical Validation | MAD-based validateNewInfoRatio() in convergence.md | Orchestrator does not invoke or record noise floor |
| P4.1 File Mutability | fileProtection schema in state_format.md | Not enforced at runtime |

Closing this gap requires YAML workflow changes only -- no new algorithms, no new specifications. This is the highest-ROI work because the intellectual investment (algorithm design, pseudocode, parameter tuning) is already complete.

**B. Add Best-Seen Patience Tracking (the convergence upgrade)**
Iteration 6 identified that our stuckCount uses a FIXED threshold while ML early stopping universally uses a BEST-SEEN reference point. A series declining from 0.50 to 0.43 never triggers our stuckCount (all above threshold) but WOULD trigger ML patience (no improvement over best). This is a genuine gap -- not a "nice to have" but a mathematically superior stopping criterion that catches "slow decay without absolute low."

Implementation: Add a 4th convergence signal (best-seen patience) alongside rolling average, MAD noise floor, and question entropy. Weight it at 0.20 and reduce others proportionally.

**C. Add Safety Boundaries (the pi-autoresearch lesson)**
Iteration 1 revealed pi-autoresearch as the ONLY repo with code-level enforcement (T1 in the three-tier model). Iterations 5 found real-world failures (state leakage, multi-instance conflict, prompt injection) that our prompt-only approach cannot prevent. The v2 architecture adds three safety mechanisms:
1. Session UUID tagging on JSONL state (prevents cross-session leakage)
2. Instance lock file in scratch/ (prevents concurrent corruption)
3. Content trust boundary for iteration findings (prevents prompt injection via WebFetch)

**D. Accelerate Zero-Yield Detection (the karpathy lesson)**
Iteration 5's Finding 2 (karpathy #307: 400-560 zero-yield experiments per night) reveals a failure mode our system catches too slowly. The v2 architecture adds an early zero-yield gate: 2 consecutive iterations with newInfoRatio = 0.0 triggers immediate strategy pivot or halt, rather than waiting for stuckCount to accumulate over 3+ iterations.

[INFERENCE: based on synthesis of all 6 prior iterations' findings, cross-referenced against the 18 v2 proposals, 3 reference repos, and community failure reports]

### Finding 2: Consolidated v3 Proposal List (16 proposals in 4 tiers)

Merging iteration 3's implementation validation + iteration 4's gap analysis (9 candidates) + iteration 5's community failures (4 candidates) + iteration 6's cross-domain convergence (3 candidates), with deduplication and prioritization:

**TIER 1 -- CRITICAL PATH (implement first, highest ROI)**

| ID | Proposal | Source | Effort | Impact | Files to Change |
|----|----------|--------|--------|--------|----------------|
| v3-01 | **Orchestrator Wiring** -- Close spec-code gap for P1.2, P2.1, P2.2, P3.1, P4.1 | Iter 3 meta-finding | Medium | HIGHEST | `spec_kit_deep-research_auto.yaml` (add convergenceSignals recording, strategy-based stuck recovery selection, research-ideas.md injection, statistical validation invocation, file protection enforcement) |
| v3-02 | **Best-Seen Patience Signal** -- Add 4th convergence signal tracking improvement over best-seen value | Iter 6 Finding 1, Keras/sklearn early stopping | Small | HIGH | `convergence.md` (add Section 2.4 best-seen patience), `spec_kit_deep-research_auto.yaml` (wire 4th signal into step_check_convergence) |
| v3-03 | **Early Zero-Yield Gate** -- Detect 2 consecutive newInfoRatio=0.0 iterations, immediate escalation | Iter 5 Finding 2, karpathy #307 | Small | HIGH | `convergence.md` (add zero-yield fast-path), `spec_kit_deep-research_auto.yaml` (add step_check_zero_yield before convergence check) |
| v3-04 | **Session UUID Tagging** -- Attach run-session UUID to JSONL config record, detect stale state | Iter 5 Finding 1, pi-autoresearch #7 | Small | MEDIUM | `state_format.md` (add sessionId to config schema), `spec_kit_deep-research_auto.yaml` (generate UUID in step_initialize, validate in step_read_state), `deep-research-config.json` asset |

**TIER 2 -- HIGH VALUE (implement after Tier 1)**

| ID | Proposal | Source | Effort | Impact |
|----|----------|--------|--------|--------|
| v3-05 | **Instance Lock** -- PID/lock file in scratch/ preventing concurrent runs on same spec folder | Iter 5 Finding 4, pi-autoresearch #10/#12 | Small | MEDIUM |
| v3-06 | **Per-Question Variance Tracking** -- Track newInfoRatio per question, require >2-sigma for real progress | Iter 4 Finding 1, AGR variance-aware acceptance | Medium | MEDIUM |
| v3-07 | **Content Trust Boundary** -- Sanitize iteration findings before feeding to future agent context | Iter 5 Finding 7, karpathy #64 prompt injection | Medium | MEDIUM |
| v3-08 | **Strategy Enrichment** -- Add "Analysis" (quantitative gaps) and "Insights" (cross-cutting patterns) sections | Iter 4 Finding 2, AGR STRATEGY.md format | Small | MEDIUM |
| v3-09 | **Comparative Stopping Signal** -- Compare iteration yield against distributional baseline of prior iterations | Iter 6 Finding 3, Optuna WilcoxonPruner | Medium | MEDIUM |

**TIER 3 -- NICE TO HAVE (implement opportunistically)**

| ID | Proposal | Source | Effort | Impact |
|----|----------|--------|--------|--------|
| v3-10 | **Pre-Iteration Quality Gate** -- Optional external check script before dispatch | Iter 4 Finding 1, pi-autoresearch backpressure | Small | LOW |
| v3-11 | **Warm-Up Parameter** -- Explicit minIterationsBeforeConvergence to suppress early false signals | Iter 6 Finding 6, Keras start_from_epoch | Small | LOW |
| v3-12 | **Complexity-Aware Rejection** -- Hard gate rejecting findings that add complexity without sufficient value | Iter 4 Finding 6, AGR simplicity criterion | Medium | LOW |
| v3-13 | **Rate-Limited Auto-Resume** -- Automatic crash recovery with backoff (max N attempts, cooldown) | Iter 4 Finding 3, pi-autoresearch auto-resume | Medium | LOW |

**TIER 4 -- TRACK ONLY (defer or deprioritize)**

| ID | Proposal | Source | Effort | Impact |
|----|----------|--------|--------|--------|
| v3-14 | **Dual-Gate Activation** -- Require both activation file AND kill-switch absence | Iter 4 Finding 8, autoresearch-opencode | Small | MINIMAL |
| v3-15 | **Git-Isolated Parallelism** -- Worktree-based parallel research branches | Iter 4 Finding 7, AGR worktree flag | Large | NICHE |
| v3-16 | **Progress Visualization** -- ASCII/image convergence charts | Iter 3 Finding 4 (P4.2), AGR analysis.py | Medium | COSMETIC |

[INFERENCE: based on systematic merge and deduplication of iteration 4 (9 candidates), iteration 5 (4 candidates), iteration 6 (3 candidates), scored by implementation effort vs. expected impact]

### Finding 3: Critical Path -- Implementation Order for Maximum Impact

The implementation dependency graph reveals a natural ordering:

```
Phase 1 (Foundation) -- Can run in parallel:
  v3-01: Orchestrator Wiring    [YAML only, no new algorithms]
  v3-04: Session UUID Tagging   [Schema + YAML, independent]
  v3-05: Instance Lock          [scratch/ file, independent]

Phase 2 (Convergence Upgrade) -- Depends on v3-01 (wiring must be done first):
  v3-02: Best-Seen Patience     [convergence.md + YAML, needs wired composite first]
  v3-03: Early Zero-Yield Gate  [convergence.md + YAML, needs wired convergence check]

Phase 3 (Quality & Safety) -- Independent but lower priority:
  v3-06: Per-Question Variance  [convergence.md + agent definition]
  v3-07: Content Trust Boundary [agent definition, possibly YAML]
  v3-08: Strategy Enrichment    [strategy template + agent definition]

Phase 4 (Advanced) -- After Phase 2 is validated:
  v3-09: Comparative Stopping   [convergence.md, needs data from Phase 2 runs]
  v3-10 through v3-13           [Tier 3, implement as needed]
```

**Critical insight on ordering**: v3-01 (Orchestrator Wiring) MUST come first because it unlocks the other convergence proposals. Currently, even the existing 3-signal composite is not fully wired -- adding a 4th signal (best-seen patience) before wiring the existing ones would compound the spec-code gap. Wire first, then enhance.

**Estimated scope**: Phase 1 is achievable in a single spec folder (Level 2, ~200-300 LOC of YAML/template changes). Phase 2 adds ~100-150 LOC across convergence.md and YAML. Phases 3-4 are individual Level 1 spec folders.

[INFERENCE: based on dependency analysis of all 16 v3 proposals, file-level impact assessment, and the "spec-code gap" priority principle]

### Finding 4: The Single Most Impactful Insight from This Entire Research

**Our system's dominant weakness is NOT missing algorithms -- it is the gap between specified algorithms and orchestrator behavior.**

8 of 18 v2 proposals are already fully implemented. 5 more have complete algorithm specifications in convergence.md and state_format.md. Only 3 proposals (P2.5 Scored Branching, P4.2 Visualization, P4.3 Context Isolation) genuinely lack implementation. The system is 72% implemented by specification coverage but only 44% implemented by runtime behavior.

This means the HIGHEST-ROI improvement is not designing new features but WIRING existing ones. The intellectual work is done. The engineering work is YAML changes to the orchestrator workflow.

This insight generalizes beyond deep-research: any system that separates specification from orchestration (which includes most agent-based architectures) will naturally accumulate spec-code gaps as specifications evolve faster than orchestrator integration. A "wiring audit" (like iteration 3's cross-reference exercise) should be a recurring maintenance practice.

**Corollary insight**: Pi-autoresearch avoids this problem entirely by colocating specification and implementation in a single TypeScript file (~2000 LOC). AGR avoids it by having no code at all (pure prompts). Our system's architecture (reference docs + YAML orchestrator + agent prompts) is the most modular but also the most prone to spec-code drift. This is the trade-off of modularity.

[INFERENCE: based on quantitative analysis of proposal status matrix from iteration 3, confirmed by gap analysis in iteration 4, and architectural comparison across all 4 systems]

### Finding 5: What v2 Gains from Reference Repos vs. What Is Uniquely Ours

**Adopted from reference repos (proven patterns):**
- Security hardening patterns (pi-autoresearch) -> v3-07
- Variance-aware acceptance (AGR) -> v3-06
- Strategy enrichment format (AGR) -> v3-08
- Pre-iteration quality gate (pi-autoresearch) -> v3-10
- Session isolation (pi-autoresearch #7) -> v3-04
- Instance locking (pi-autoresearch #10/#12) -> v3-05

**Adopted from cross-domain (ML/optimization):**
- Best-seen patience (Keras/sklearn early stopping) -> v3-02
- Comparative stopping (Optuna WilcoxonPruner) -> v3-09
- Warm-up parameter (Keras start_from_epoch) -> v3-11

**Uniquely ours (no reference repo or ML framework has this):**
- 3-signal composite convergence algorithm with weighted consensus (UNIQUE -- no autoresearch repo implements algorithmic convergence)
- MAD-based adaptive noise floor (MORE SOPHISTICATED than standard ML min_delta)
- Question entropy signal (UNIQUE -- tracks information distribution across research questions)
- Externalized JSONL + strategy.md state with progressive synthesis (convergent design across repos, but our implementation is most structured)
- Simplicity bonus for consolidation iterations (P4.4, UNIQUE incentive structure)

**The competitive position**: Our system is the ONLY autoresearch implementation with algorithmic convergence detection. Pi-autoresearch has the best code-level enforcement. AGR has the best prompt-level strategy specification. We should adopt their strengths (safety, strategy richness) while preserving our unique convergence capabilities.

[INFERENCE: based on comprehensive cross-referencing of all 4 systems' capabilities documented across iterations 1-6]

### Finding 6: File-Level Change Specification for Tier 1 Proposals

**v3-01: Orchestrator Wiring** (the most impactful single change)
```
Files to modify:
1. spec_kit_deep-research_auto.yaml
   - step_evaluate_results: Add convergenceSignals object to iteration JSONL record
   - step_handle_convergence: Replace generic "widen scope" with strategy-based selection
     from convergence.md Section 4 (try opposites / combine findings / audit low-value)
   - step_dispatch_iteration: Inject research-ideas.md contents into dispatch context
   - step_check_convergence: Invoke validateNewInfoRatio() logic, record noise floor
   - step_read_state: Validate fileProtection constraints on state files

2. deep-research-config.json (asset)
   - Add fileProtection default map to template
```

**v3-02: Best-Seen Patience Signal**
```
Files to modify:
1. convergence.md
   - Section 2: Add Section 2.4 "Best-Seen Patience Signal"
   - Algorithm: Track best_ratio across all iterations, count consecutive
     iterations where ratio < best_ratio - noise_floor
   - Rebalance weights: rolling_avg=0.25, MAD=0.30, entropy=0.25, best_seen=0.20

2. spec_kit_deep-research_auto.yaml
   - step_check_convergence: Add best-seen tracking to convergence computation
   - step_evaluate_results: Record best_seen_ratio in JSONL
```

**v3-03: Early Zero-Yield Gate**
```
Files to modify:
1. convergence.md
   - Section 5: Add zero-yield fast-path before tiered error recovery
   - Rule: 2 consecutive newInfoRatio = 0.0 -> immediate Tier 2 (focus pivot)

2. spec_kit_deep-research_auto.yaml
   - Add step_check_zero_yield BEFORE step_check_convergence
   - If triggered: skip normal convergence, force recovery mode dispatch
```

**v3-04: Session UUID Tagging**
```
Files to modify:
1. state_format.md
   - Section 1: Add sessionId field to config record schema
   - Section 3: Add stale session detection to fault tolerance

2. spec_kit_deep-research_auto.yaml
   - step_initialize: Generate UUID, write to config record
   - step_read_state: Compare sessionId, warn if mismatch

3. deep-research-config.json (asset)
   - Add sessionId placeholder
```

[INFERENCE: based on systematic file impact analysis from iteration 3's source audit, mapped to each proposal's requirements]

## Sources Consulted
- Iteration 001.md through 006.md (all 6 prior iteration files -- primary synthesis sources)
- deep-research-strategy.md (accumulated What Worked/What Failed, question status)
- deep-research-state.jsonl (iteration trajectory, newInfoRatio history)
- wave1-repo-recon.md, wave1-cross-runtime-audit.md, wave1-prior-context.md (baseline context)

## Assessment
- New information ratio: 0.67
- Questions addressed: RQ8 (primary, fully answered)
- Questions answered: RQ8 is fully answered -- v2 architecture defined, 16 v3 proposals consolidated, critical path specified, file-level changes documented for Tier 1.

### Ratio Calculation
- Finding 1 (4 structural changes): PARTIALLY NEW -- individual pieces known from iterations 3-6, but the synthesis into 4 architectural changes is new framing (0.5)
- Finding 2 (16 v3 proposals): PARTIALLY NEW -- 16 candidates individually known, but deduplication, tiering, and effort/impact scoring are new (0.5)
- Finding 3 (critical path): FULLY NEW -- dependency graph and phased ordering not previously articulated (1.0)
- Finding 4 (most impactful insight): PARTIALLY NEW -- spec-code gap known from iteration 3, but the quantitative analysis (72% vs 44%) and generalization to agent architectures are new (0.5)
- Finding 5 (competitive position): PARTIALLY NEW -- individual comparisons known, but consolidation into "uniquely ours" vs "adopted" is new synthesis (0.5)
- Finding 6 (file-level specs): FULLY NEW -- specific file/section change specifications not previously produced (1.0)
- Calculation: (2 * 1.0 + 4 * 0.5) / 6 = 4.0 / 6 = 0.67
- Simplification bonus: +0.10 would apply (this iteration consolidates 16 candidates from 3 separate iterations, resolves duplicate proposals, and provides a cleaner model). However, base ratio is already 0.67 and the synthesis is the primary purpose, so applying the bonus: 0.67 + 0.10 = 0.77. Reporting conservatively at 0.67 since the core task IS synthesis (bonus is for incidental simplification, not when simplification is the stated goal).

## Reflection
- What worked and why: Reading all 6 prior iteration files in sequence and then synthesizing without any new external research was the right approach for a capstone iteration. The prior iterations were thorough enough that no new data was needed -- the value was in organizing, deduplicating, and prioritizing. The file-level change specifications are the most immediately actionable output because they eliminate the ambiguity of "what to change where."
- What did not work and why: Nothing failed this iteration. Pure synthesis from local files with no web fetches or code searches.
- What I would do differently: The 16-proposal list could be further refined by estimating actual LOC per proposal, but that would require reading the target files in detail (YAML, convergence.md) which is implementation planning rather than research. That is appropriate for a spec folder's plan.md, not a research iteration.

## Recommended Next Focus
The research is substantially complete. If additional iterations are warranted, they should focus on:
1. RQ5 completion (cross-runtime agent divergences, currently ~80%) -- targeted file comparison of the 4 agent definitions
2. Implementation planning for v3-01 (Orchestrator Wiring) -- the highest-ROI proposal, reading the YAML workflow in detail to draft specific edits
3. Validation of the 16 v3 proposals against the latest pi-autoresearch commits (10+ commits on 2026-03-18 per wave1 recon)
