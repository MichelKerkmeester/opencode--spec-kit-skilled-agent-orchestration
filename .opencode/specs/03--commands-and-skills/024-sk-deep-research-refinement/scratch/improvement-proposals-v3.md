# Deep Research System: Improvement Proposals v3

> **Status**: v3 -- validated via 9-iteration deep research (spec 024)
> **Date**: 2026-03-18
> **Source**: 3 reference repos (AGR, pi-autoresearch, autoresearch-opencode), ML convergence literature (Keras, scikit-learn, Optuna, NIST), GitHub community issues (322+ issues/PRs across karpathy/autoresearch + forks)
> **Spec folder**: `.opencode/specs/03--commands-and-skills/024-sk-deep-research-refinement`

---

## Executive Summary

v3 represents a significant maturation from v2. The original 18 v2 proposals (from spec 023, 14 iterations across 2 rounds) have been validated against 3 external autoresearch implementations at both architectural and code level, 4 ML/optimization frameworks, and real-world failure reports from 322+ GitHub issues.

**Key v2 to v3 changes:**
1. **Consolidation**: 18 v2 proposals consolidated to 15 v3 proposals through merging, reclassification, and deduplication
2. **Dominant finding**: The #1 issue is NOT missing algorithms -- it is the gap between specified algorithms and YAML orchestrator wiring (72% spec coverage vs 44% runtime behavior)
3. **New proposals**: 7 genuinely new proposals not in v2, derived from reference repo gap analysis (iteration 4), community failure modes (iteration 5), and cross-domain convergence literature (iteration 6)
4. **CUSUM permanently dropped**: Research loops are 10-50x shorter than optimization loops, making CUSUM regime detection inappropriate (validated in iterations 6 and 12 of spec 023)
5. **Competitive advantage confirmed**: Our system is the ONLY autoresearch implementation with algorithmic convergence detection (3-signal composite with MAD noise floor). No reference repo implements statistical convergence.
6. **Action categorization**: 15 proposals organized into 3 complementary action categories (WIRE / EXTEND / PROTECT) alongside the 4 priority tiers

---

## v2 Proposal Validation Status

All 18 v2 proposals from spec 023 have been validated against code-level analysis of reference repos, community failure reports, and cross-domain convergence literature.

| v2 ID | Proposal | v2 Priority | v3 Status | v3 Mapping | Notes |
|-------|----------|-------------|-----------|------------|-------|
| P1.1 | Tiered Error Recovery | P1 (S/H) | **IMPLEMENTED** | -- | Prompt-only implementation confirmed sufficient (AGR's 5-tier is also prompt-only, iteration 009 of spec 023) |
| P1.2 | Composite Convergence Algorithm | P1 (M/H) | **PARTIALLY IMPLEMENTED** (spec-code gap) | v3-01 | Full 3-signal algorithm specified in convergence.md but YAML does not write convergenceSignals to JSONL |
| P1.3 | Exhausted Approaches Enhancement | P1 (S/M-H) | **IMPLEMENTED** | -- | Positive selection criteria added in v2; agent protocol enforces category blocking |
| P1.4 | State Recovery Fallback | P1 (S/M) | **IMPLEMENTED** | -- | Recovery from iteration-*.md files when JSONL is missing/corrupt |
| P1.5 | JSONL Fault Tolerance | P1 (S/M) | **IMPLEMENTED** | -- | Line-level skip on malformed JSONL with defaults for missing fields |
| P2.1 | Enriched Stuck Recovery | P2 (S/M) | **PARTIALLY IMPLEMENTED** (spec-code gap) | v3-01 | 3 strategies specified in convergence.md Section 4, but YAML uses generic "widen scope" |
| P2.2 | Ideas Backlog File | P2 (S/M) | **PARTIALLY IMPLEMENTED** (spec-code gap) | v3-01 | Agent reads research-ideas.md but orchestrator does not inject contents into dispatch |
| P2.3 | Iteration Reflection Section | P1 (S/M) | **IMPLEMENTED** | -- | Reflection section added to iteration template, community-validated |
| P2.4 | Segment-Based State Partitioning | P2 (S/M) | **IMPLEMENTED** | -- | Segment field in JSONL with segment_start events |
| P2.5 | Scored Branching with Pruning | P2 (L/H) | **CONFIRMED** | v3-15 (Track) | Deprioritized: Large effort, no reference repo implements branching, niche use case. Git-isolated parallelism (AGR worktree pattern) absorbed here |
| P2.6 | Sentinel Pause File | P2 (S/M) | **IMPLEMENTED** | -- | `.deep-research-pause` file check before dispatch |
| P3.1 | Statistical newInfoRatio Validation | P3 (M/M) | **PARTIALLY IMPLEMENTED** (spec-code gap) | v3-01 | MAD-based validateNewInfoRatio() fully specified in convergence.md but never invoked by YAML |
| P3.2 | Compact State Summary Injection | P2 (S/M) | **IMPLEMENTED** | -- | 200-token state summary generated at dispatch time |
| P3.3 | Git Commit Per Iteration | P3 (S/L) | **DELIBERATELY EXCLUDED** | -- | Reference-only by design. AGR's atomic commit pattern is more targeted but adds complexity without proportional benefit for file-based research state |
| P4.1 | File Mutability Declarations | P4 (S/L) | **PARTIALLY IMPLEMENTED** (spec-code gap) | v3-01 | fileProtection schema defined in state_format.md but not enforced at runtime |
| P4.2 | Progress Visualization | P3 (S/L) | **MERGED** into v3-08 | v3-08 | Convergence trajectory display included as sub-item of Strategy Enrichment |
| P4.3 | True Context Isolation | P4 (L/M) | **CONFIRMED** (Track) | -- | Relevant only for fully autonomous overnight sessions. Claude-only `claude -p` backend confirmed |
| P4.4 | Research Simplicity Criterion | P4 (S/L) | **IMPLEMENTED** | -- | Simplicity bonus in newInfoRatio assessment for consolidation iterations |

**Summary**: 8 IMPLEMENTED, 5 PARTIALLY IMPLEMENTED (spec-code gap), 1 DELIBERATELY EXCLUDED, 2 CONFIRMED (deprioritized/tracked), 1 MERGED, 1 RECLASSIFIED.

---

## v3 Proposals (15 consolidated)

### Tier 1: Critical Path

Implement first. Highest ROI. Each has real-world evidence from reference repos or community failure reports.

---

#### v3-01: Orchestrator Wiring (Close Spec-Code Gap)

| Attribute | Value |
|-----------|-------|
| **Effort** | Medium |
| **Impact** | HIGHEST |
| **Action Category** | WIRE |
| **Source** | Iteration 3 meta-finding (spec-code gap pattern), validated iterations 4, 7, 8 |
| **v2 Origin** | Closes gaps for P1.2, P2.1, P2.2, P3.1, P4.1 (5 partially-implemented proposals) |

**Description**: The single highest-ROI improvement. 5 proposals have complete algorithm specifications in convergence.md and state_format.md but the YAML orchestrator does not wire them. This requires YAML workflow changes only -- no new algorithms, no new specifications. The intellectual investment (algorithm design, pseudocode, parameter tuning) is already complete.

**Evidence**: Iteration 3 quantified the gap: system is 72% implemented by specification coverage but only 44% by runtime behavior. Iteration 7 confirmed this as the dominant finding. Iteration 8 validated all 5 sub-proposals are correctly scoped.

**File-level changes:**

| File | Section/Step | Change |
|------|-------------|--------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_evaluate_results` | Add `convergenceSignals` object (rolling_avg, MAD, entropy values) to iteration JSONL record |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_handle_convergence` | Replace generic "widen scope" fallback with strategy-based selection from convergence.md Section 4 (try opposites / combine findings / audit low-value) |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_dispatch_iteration` | Inject `scratch/research-ideas.md` contents into dispatch context; initialize file in `step_initialize` if absent |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_check_convergence` | Invoke `validateNewInfoRatio()` logic from convergence.md Section 3; record noise floor in JSONL event |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_read_state` | Validate `fileProtection` constraints on state files; enforce append-only for JSONL, immutable for config |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_initialize` | Create `scratch/research-ideas.md` if not present (needed for P2.2 wiring) |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | JSONL consumers | Handle out-of-order JSONL from parallel waves (sort by `run` field when computing rolling averages) |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Top-level | Add `fileProtection` default map: `{"config.json":"immutable","state.jsonl":"append-only","strategy.md":"mutable","iteration-*.md":"write-once"}` |

**Dependency**: None. This is the foundation -- all other convergence proposals depend on v3-01 being wired first.

---

#### v3-02: Best-Seen Patience Signal (4th Convergence Signal)

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | HIGH |
| **Action Category** | EXTEND |
| **Source** | Iteration 6 Finding 1 (Keras/scikit-learn early stopping), cross-domain convergence literature |
| **v2 Origin** | NEW -- not in v2. Discovered via ML convergence framework analysis |

**Description**: Add a 4th convergence signal that tracks improvement relative to the best-seen newInfoRatio value, rather than a fixed threshold. This catches "slow decay without absolute low" -- a failure mode our current stuckCount misses entirely. A series declining from 0.50 to 0.43 never triggers our stuckCount (all above threshold) but WOULD trigger ML patience (no improvement over best).

**Evidence**: Universal pattern across Keras (`EarlyStopping`), scikit-learn (`n_iter_no_change`), PyTorch, and XGBoost. Every production ML early stopping framework uses best-seen reference points. Our MAD-based adaptive noise floor is more sophisticated than standard ML `min_delta` (adaptive vs. fixed), but we lack the best-seen tracking component.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Section 2 | Add Section 2.4 "Best-Seen Patience Signal": track `best_ratio` across all iterations, count consecutive iterations where `ratio < best_ratio - noise_floor` |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Section 2 weights | Rebalance composite weights: rolling_avg=0.25, MAD=0.30, entropy=0.25, best_seen=0.20 |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_check_convergence` | Wire 4th signal into convergence computation; add best-seen tracking to state |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_evaluate_results` | Record `best_seen_ratio` in JSONL convergence signals |

**Dependency**: v3-01 (existing 3-signal composite must be wired before adding a 4th signal).

---

#### v3-03: Early Zero-Yield Gate

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | HIGH |
| **Action Category** | EXTEND |
| **Source** | Iteration 5 Finding 2 (karpathy #307: 400-560 zero-yield experiments per night) |
| **v2 Origin** | NEW -- not in v2. Discovered via GitHub community failure analysis |

**Description**: Detect 2 consecutive iterations with newInfoRatio = 0.0 and trigger immediate strategy pivot or halt with diagnostic, rather than waiting for stuckCount to accumulate over 3+ iterations. Addresses "silent failure" where the system keeps running without producing value.

**Evidence**: karpathy/autoresearch Issue #307 documented 3 nights of zero retained experiments (400-560 daily attempts). Root cause: model too small for quality review. Our system has an analogous failure mode that convergence detection catches too slowly.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Section 5 (Fault Tolerance) | Add zero-yield fast-path rule: 2 consecutive `newInfoRatio = 0.0` triggers immediate Tier 2 recovery (focus pivot) before normal stuckCount logic |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | New step: `step_check_zero_yield` | Add BEFORE `step_check_convergence`. If triggered: skip normal convergence, force recovery mode dispatch |

**Dependency**: v3-01 (convergence wiring needed for the gate to integrate with the convergence pipeline).

---

#### v3-04: Session UUID Tagging

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | MEDIUM |
| **Action Category** | PROTECT |
| **Source** | Iteration 5 Finding 1 (pi-autoresearch #7: cross-session state leakage) |
| **v2 Origin** | NEW -- not in v2. Discovered via GitHub community failure analysis |

**Description**: Attach a run-session UUID to the JSONL config record. Detect stale state from interrupted prior runs when a new session reads existing state files. Prevents the cross-session leakage failure mode documented in pi-autoresearch.

**Evidence**: pi-autoresearch Issue #7 documented module-level variable persistence causing state leakage across sessions. Fix was session-scoped storage keyed by session ID (PR #8). Our file-based state provides natural isolation but lacks stale-state detection for interrupted runs.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/references/state_format.md` | Section 1 (Config Schema) | Add `sessionId` field to config record schema (UUID v4) |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Section 3 (Fault Tolerance) | Add stale session detection rule: warn when `sessionId` in state differs from current session |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_initialize` | Generate UUID v4, write to config record in JSONL |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_read_state` | Compare current sessionId against state file sessionId; emit warning event if mismatch |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Top-level | Add `sessionId` placeholder field |

**Dependency**: None (independent, can run in parallel with v3-01).

---

### Tier 2: High Value

Implement after Tier 1. Each has clear value supported by reference repo patterns or ML framework evidence.

---

#### v3-05: Instance Lock

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | MEDIUM |
| **Action Category** | PROTECT |
| **Source** | Iteration 5 Finding 4 (pi-autoresearch #10, #12: multi-instance conflict) |
| **v2 Origin** | NEW -- not in v2. Discovered via GitHub community failure analysis |

**Description**: PID/lock file in `scratch/` preventing concurrent deep-research runs on the same spec folder. Running `/spec_kit:deep-research` twice on the same spec folder simultaneously would cause JSONL corruption (concurrent appends) and strategy.md race conditions.

**Evidence**: pi-autoresearch Issues #10 and #12 documented multi-instance conflicts. Resolution was subdirectory-based isolation, but our spec-folder scoping already provides directory isolation -- we only lack single-instance enforcement within a spec folder.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_initialize` | Create `scratch/.deep-research.lock` with PID and timestamp; check for existing lock on entry |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_finalize` (or equivalent) | Remove lock file on normal completion |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_read_state` | If lock exists with stale PID (process no longer running), warn and allow override |

**Dependency**: None (independent).

---

#### v3-06: Per-Question Variance Tracking

| Attribute | Value |
|-----------|-------|
| **Effort** | Medium |
| **Impact** | MEDIUM |
| **Action Category** | EXTEND |
| **Source** | Iteration 4 Finding 1 (AGR variance-aware acceptance: per-benchmark sigma threshold) |
| **v2 Origin** | NEW -- not in v2. Discovered via AGR gap analysis |

**Description**: Track newInfoRatio per research question (not just aggregate). Require >2-sigma improvement per question to count as genuine progress. Detect measurement artifacts where a single high-yield question masks lack of progress on others.

**Evidence**: AGR runs benchmarks N=5 to establish variance sigma, requiring >5% (~2-sigma) improvement per question to count as real. Our convergence algorithm treats newInfoRatio as a single aggregate scalar without per-question granularity. This means an iteration that makes big progress on one question but zero on four others still reports a moderate aggregate ratio.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/references/convergence.md` | New Section 2.5 | Add per-question variance tracking algorithm: maintain per-question newInfoRatio history, compute per-question sigma, flag improvements below 2-sigma as noise |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Iteration record schema | Add optional `perQuestionRatios` map to iteration JSONL records |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_evaluate_results` | Record per-question ratios when available |
| Agent definitions (all 4 runtimes) | Iteration output template | Add per-question breakdown to assessment section |

**Dependency**: v3-01 (needs convergence wiring to be meaningful).

---

#### v3-07: Content Trust Boundary

| Attribute | Value |
|-----------|-------|
| **Effort** | Medium |
| **Impact** | MEDIUM |
| **Action Category** | PROTECT |
| **Source** | Iteration 5 Finding 7 (karpathy #64: indirect prompt injection via training output), iteration 4 Finding 1 (pi-autoresearch security hardening) |
| **v2 Origin** | NEW -- not in v2. Discovered via community security concerns |

**Description**: Sanitize/validate iteration findings before they enter future agent context to prevent prompt injection via WebFetch content. Establishes a trust boundary between external data (web sources) and internal state (iteration files, strategy.md).

**Evidence**: karpathy/autoresearch Issue #64 documented the risk of experiment outputs containing adversarial prompts. pi-autoresearch implements prototype pollution guards (`__proto__`, `constructor`, `prototype` deny list) and command guards. Our system feeds WebFetch results through iteration files into future agent context without sanitization.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| Agent definitions (all 4 runtimes) | Write Safety Rules | Add content trust boundary rule: findings from external sources (WebFetch) must be summarized by the agent in its own words, not pasted verbatim into iteration files |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_dispatch_iteration` | Add context preamble warning agent about potential adversarial content in prior findings |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Safety section | Document the trust boundary: external data -> agent summarization -> iteration file -> future context |

**Dependency**: None (independent, but aligns with v3-04 session tagging for defense-in-depth).

---

#### v3-08: Strategy Enrichment (Analysis + Insights + Visualization)

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | MEDIUM |
| **Action Category** | PROTECT |
| **Source** | Iteration 4 Finding 2 (AGR STRATEGY.md 4-section format), v2 P4.2 Progress Visualization (merged) |
| **v2 Origin** | Extends v2 P4.2 (visualization) but is substantially new in scope |

**Description**: Add two new sections to strategy.md: "Analysis" (quantitative gap breakdown -- which questions have lowest coverage) and "Insights" (accumulated cross-cutting patterns that span multiple iterations). Also includes convergence trajectory display (last 5 newInfoRatio values as inline sparkline) absorbed from v3-16/v2 P4.2.

**Evidence**: AGR's STRATEGY.md has 4 distinct cognitive-function sections (Analysis, Ideas, Already Tried, Insights). Our strategy.md focuses on question tracking and approach management but lacks quantitative gap analysis and accumulated cross-cutting insights. AGR's `analysis.py` generates per-benchmark charts; our inline sparkline is a lighter-weight equivalent.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Template | Add `## Analysis` section (quantitative gaps: per-question coverage percentages) and `## Insights` section (cross-cutting patterns accumulated across iterations) |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Template | Add convergence trajectory display: `Trajectory: [0.75, 0.67, 0.83, 0.75, ...]` inline sparkline of last N newInfoRatio values |
| Agent definitions (all 4 runtimes) | Iteration output format | Add instruction to update Analysis and Insights sections during strategy.md update step |

**Dependency**: None (template change, independent of convergence wiring).

---

#### v3-09: Comparative Stopping Signal

| Attribute | Value |
|-----------|-------|
| **Effort** | Medium |
| **Impact** | MEDIUM |
| **Action Category** | EXTEND |
| **Source** | Iteration 6 Finding 3 (Optuna WilcoxonPruner: non-parametric statistical hypothesis test for stopping) |
| **v2 Origin** | NEW -- not in v2. Discovered via cross-domain convergence analysis |

**Description**: Add a comparative stopping signal that asks: "Is this iteration's yield significantly different from what a random iteration would produce at this stage?" Our current 3 signals are all self-referential (comparing an iteration to its own history). A comparative signal compares against a distributional baseline of prior iterations' ratios at similar completion percentages.

**Evidence**: Optuna's WilcoxonPruner uses the Wilcoxon signed-rank test to compare a trial's intermediate results against completed trials. This is a fundamentally different signal class (comparative vs. self-referential) that catches cases where self-referential signals miss stagnation because the trajectory never had a sharp drop.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/references/convergence.md` | New Section 2.6 | Add comparative stopping algorithm: bootstrap distribution of prior iteration ratios at similar completion %, compare current ratio, flag if below 10th percentile |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_check_convergence` | Wire comparative signal as advisory (not voting) initially; promote to 5th signal after validation data collected |

**Dependency**: v3-01 and v3-02 (needs fully wired composite convergence with best-seen patience before adding further signals). Also needs empirical data from Phase 2 runs to calibrate.

---

### Tier 3: Nice to Have

Implement opportunistically. Lower immediate value or narrower applicability.

---

#### v3-10: Pre-Iteration Quality Gate

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | LOW |
| **Action Category** | EXTEND |
| **Source** | Iteration 4 Finding 1 (pi-autoresearch backpressure gate: `autoresearch.checks.sh` with 300s timeout) |
| **v2 Origin** | NEW -- not in v2. Discovered via pi-autoresearch gap analysis |

**Description**: Optional external check script that must pass before iteration dispatch. Enables pre-conditions like rate limit checks, API availability verification, or custom quality gates.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Before `step_dispatch_iteration` | Add optional `step_pre_check`: if `scratch/.deep-research-checks.sh` exists, run it with 60s timeout; block dispatch on failure |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Pre-iteration section | Document the quality gate hook and expected exit codes |

**Dependency**: None.

---

#### v3-11: Warm-Up Parameter

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | LOW |
| **Action Category** | EXTEND |
| **Source** | Iteration 6 Finding 6 (Keras `start_from_epoch` parameter) |
| **v2 Origin** | NEW -- not in v2. Discovered via ML convergence framework analysis |

**Description**: Explicit `minIterationsBeforeConvergence` parameter to suppress convergence checking during initial iterations. Protects against early false convergence from anomalously low initial newInfoRatio (e.g., tool failure or poor focus choice). Partially addressed by existing graceful degradation (fewer signals with fewer iterations) but makes the protection explicit and configurable.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Section 2.3 (Graceful Degradation) | Add `minIterationsBeforeConvergence` parameter (default: 3); convergence signals suppressed before this threshold |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Top-level | Add `minIterationsBeforeConvergence: 3` to configurable parameters |

**Dependency**: v3-01 (only meaningful when convergence is fully wired).

---

#### v3-12: Complexity-Aware Rejection

| Attribute | Value |
|-----------|-------|
| **Effort** | Medium |
| **Impact** | LOW |
| **Action Category** | EXTEND |
| **Source** | Iteration 4 Finding 7 (AGR simplicity criterion: reject marginal gains with complexity) |
| **v2 Origin** | Extends v2 P4.4 (Research Simplicity Criterion) from a soft bonus to a hard gate |

**Description**: Hard gate that rejects findings adding complexity (new open questions, contradictions with prior findings) without sufficient information value. AGR automatically discards improvements <2% with significant added complexity. Our v2 P4.4 implemented a soft simplicity bonus; this upgrades it to a filter.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| Agent definitions (all 4 runtimes) | Assessment section | Add complexity-value ratio check: if iteration adds >2 new open questions AND newInfoRatio < 0.30, flag for review |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Section 5 (Fault Tolerance) | Add complexity rejection rule to post-iteration validation |

**Dependency**: None.

---

#### v3-13: Rate-Limited Auto-Resume

| Attribute | Value |
|-----------|-------|
| **Effort** | Medium |
| **Impact** | LOW |
| **Action Category** | EXTEND |
| **Source** | Iteration 4 Finding 3 (pi-autoresearch rate-limited auto-resume with backoff) |
| **v2 Origin** | NEW -- not in v2. Fills gap between P1.4 (state recovery) and actual resumption protocol |

**Description**: Automatic crash recovery with backoff. If the research loop crashes mid-iteration, auto-resume with: max N resume attempts, cooldown between resumes (5 min), backpressure checks before each resume. Prevents infinite crash-resume loops.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Error handling | Add resume counter and cooldown logic: max 3 auto-resumes, 5-minute cooldown between attempts |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Recovery section | Document auto-resume protocol with backoff parameters |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Event records | Add `resume_attempt` event type to JSONL schema |

**Dependency**: v3-04 (session UUID needed to distinguish resume from fresh start).

---

### Tier 4: Track Only

Defer or deprioritize. Low immediate value, large effort, or dependent on external factors.

---

#### v3-14: Dual-Gate Activation

| Attribute | Value |
|-----------|-------|
| **Effort** | Small |
| **Impact** | MINIMAL |
| **Action Category** | PROTECT |
| **Source** | Iteration 4 Finding 6 (autoresearch-opencode dual-file activation: opt-in + kill-switch) |
| **v2 Origin** | Extends v2 P2.6 (Sentinel Pause File) with a second gate |

**Description**: Require BOTH activation file existence AND absence of kill-switch for research to proceed. Two independent gates: one for activation (`scratch/.deep-research-active`), one for emergency stop (`scratch/.deep-research-pause`). Extends the existing P2.6 sentinel pattern.

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_initialize` | Add dual-gate check: require activation file AND absence of pause file |

**Dependency**: None.

---

#### v3-15: Git-Isolated Parallelism

| Attribute | Value |
|-----------|-------|
| **Effort** | Large |
| **Impact** | NICHE |
| **Action Category** | EXTEND |
| **Source** | Iteration 4 Finding 5 (AGR `--worktree` flag for parallel git branches) |
| **v2 Origin** | Extends v2 P2.5 (Scored Branching) with git isolation |

**Description**: Worktree-based parallel research branches where multiple agents investigate different questions on isolated git branches, merged later. AGR's pattern adapted for research (rather than code optimization).

**File-level changes:**

| File | Section | Change |
|------|---------|--------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Wave dispatch | Add optional `--worktree` mode for parallel wave execution with git branch isolation |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Parallel execution | Document worktree-based parallelism protocol and merge strategy |

**Dependency**: v3-01 (orchestrator wiring must be solid before adding parallel complexity).

---

## New Proposals (Not in v2)

These 7 proposals are genuinely new in v3 -- they are not refinements of v2 proposals but entirely new capabilities discovered through the 9-iteration research process.

| v3 ID | Proposal | Discovery Source | Why Not in v2 |
|-------|----------|-----------------|---------------|
| v3-02 | Best-Seen Patience Signal | Iteration 6: ML early stopping frameworks (Keras, scikit-learn) | v2 convergence proposals focused on existing signals; best-seen tracking is a fundamentally different reference point (relative-to-best vs. fixed threshold) not considered in v2 |
| v3-03 | Early Zero-Yield Gate | Iteration 5: karpathy #307 (400+ zero-yield experiments) | v2 addressed slow convergence but not the specific failure mode of consecutive zero-yield iterations; community data made this urgent |
| v3-04 | Session UUID Tagging | Iteration 5: pi-autoresearch #7 (cross-session state leakage) | v2 focused on state format and recovery but not session identity; the leakage failure mode was unknown before community analysis |
| v3-05 | Instance Lock | Iteration 5: pi-autoresearch #10, #12 (multi-instance conflict) | v2 assumed single-instance execution; concurrency was not considered as a failure mode |
| v3-06 | Per-Question Variance Tracking | Iteration 4: AGR variance-aware acceptance pattern | v2 treated newInfoRatio as an aggregate scalar; per-question granularity was not considered |
| v3-09 | Comparative Stopping Signal | Iteration 6: Optuna WilcoxonPruner (non-parametric statistical test) | v2 convergence signals were all self-referential; the comparative signal class (vs. distributional baseline) is a fundamentally different approach discovered via cross-domain analysis |
| v3-10 | Pre-Iteration Quality Gate | Iteration 4: pi-autoresearch backpressure gate | v2 focused on post-iteration validation; pre-iteration quality gates were not in scope |

**Additional tracked gaps** (not elevated to full proposals):
- **Tool call budget recalibration**: All 6 agents in spec 023 exceeded the 8-12 target budget (used 16-34 calls). Assessed as a calibration adjustment (single-line edit to agent definitions), not a v3-tier proposal.
- **Breakthrough detection**: Detecting sudden high newInfoRatio after plateau to trigger exploration-to-consolidation strategy shift. Insufficient empirical evidence for Tier 1-2; tracked for future consideration.

---

## Implementation Sequencing

```
Phase 1 (Foundation) -- Can run in parallel, no dependencies:
  v3-01: Orchestrator Wiring         [YAML only, ~200-300 LOC]        <- HIGHEST ROI
  v3-04: Session UUID Tagging        [Schema + YAML, ~50 LOC]         <- Independent
  v3-05: Instance Lock               [scratch/ file check, ~30 LOC]   <- Independent

Phase 2 (Convergence Upgrade) -- Depends on v3-01 completion:
  v3-02: Best-Seen Patience Signal   [convergence.md + YAML, ~100 LOC]
  v3-03: Early Zero-Yield Gate       [convergence.md + YAML, ~50 LOC]

Phase 3 (Quality & Safety) -- Independent of Phase 2, can start after Phase 1:
  v3-06: Per-Question Variance       [convergence.md + agent defs]
  v3-07: Content Trust Boundary      [agent defs + loop_protocol.md]
  v3-08: Strategy Enrichment         [template + agent defs]

Phase 4 (Advanced) -- After Phase 2 is validated with real research runs:
  v3-09: Comparative Stopping        [convergence.md, needs calibration data]
  v3-10: Pre-Iteration Quality Gate  [YAML hook]
  v3-11: Warm-Up Parameter           [convergence.md + config]
  v3-12: Complexity-Aware Rejection  [agent defs + convergence.md]
  v3-13: Rate-Limited Auto-Resume    [YAML + state_format.md]
  v3-14: Dual-Gate Activation        [YAML]
  v3-15: Git-Isolated Parallelism    [YAML + loop_protocol.md]
```

**Dependency graph:**
```
v3-01 ─┬─> v3-02 ─┬─> v3-09 (needs Phase 2 data)
       ├─> v3-03   │
       ├─> v3-06   │
       └─> v3-11   │
                    └─> v3-15 (needs stable orchestrator)
v3-04 ──> v3-13 (session UUID needed for resume identity)
v3-05 (independent)
v3-07 (independent)
v3-08 (independent)
v3-10 (independent)
v3-12 (independent)
v3-14 (independent)
```

**Estimated total scope**:
- Phase 1: Single Level 2 spec folder (~300-400 LOC of YAML/template/schema changes)
- Phase 2: ~150-200 LOC across convergence.md and YAML
- Phases 3-4: Individual Level 1 spec folders per proposal

---

## Cross-Runtime Alignment Recommendations

Based on iteration 8's behavioral impact analysis of 7 unintentional divergences across 4 runtime agent definitions.

**Agent definition files:**
- Claude: `.claude/agents/deep-research.md`
- Codex: `.codex/agents/deep-research.toml`
- OpenCode/Copilot: `.opencode/agent/deep-research.md`
- ChatGPT: `.opencode/agent/chatgpt/deep-research.md`

| # | Action | Severity | Divergence | Change |
|---|--------|----------|------------|--------|
| A1 | Add explicit model declarations to OpenCode and ChatGPT | HIGH | D1: Model unspecified in 2 of 4 runtimes | Add `model: [frontier-model]` to OpenCode and ChatGPT YAML frontmatter. Without this, research dispatches to runtime default (potentially less capable model), directly affecting newInfoRatio and convergence speed. |
| A2 | Add temperature to Claude and Codex | HIGH | D2: Temperature set to 0.1 only in OpenCode/ChatGPT | Set `temperature: 0.1` in Claude frontmatter and Codex TOML (if supported). Low temperature ensures deterministic, consistent research output. Higher defaults produce more creative but less consistent findings, widening MAD noise floor and delaying convergence. |
| A3 | Document MCP availability expectations | MEDIUM | D3: Only Claude declares `spec_kit_memory` MCP server | Add comment/note to OpenCode/ChatGPT/Codex explaining how `memory_search`/`memory_context` tools become available. If runtime provides MCP globally, document this. If per-agent config needed, add declaration. |
| A4 | Add reasoning effort equivalents | MEDIUM | D7: Only Codex specifies `model_reasoning_effort = "high"` | If Claude and OpenCode/ChatGPT support reasoning effort config, set to "high" equivalent. Reasoning depth directly affects finding quality. |
| A5 | Standardize budget wording | MEDIUM | D5: "within an overall budget of" (Claude/Codex) vs "Recommended overall budget:" (OpenCode/ChatGPT) | Change OpenCode and ChatGPT to use "within an overall budget of" -- stricter, less ambiguous phrasing. "Recommended" may be interpreted as advisory by less capable models. |
| A6 | Consider adding `task: deny` to Claude | LOW | D4: OpenCode/ChatGPT explicitly deny `task` tool; Claude relies on prompt instruction only | If Claude supports permission deny, add `task: deny` to harden LEAF compliance at the permission layer (not just prompt instruction). |
| A7 | Remove stale `research` agent reference from Codex | LOW | D6: Codex references a `research` agent not present in other runtimes | Verify whether agent still exists. If deprecated, remove from Codex's Related Resources section. Simple cleanup. |

**Canonical source recommendation**: OpenCode/Copilot version (`.opencode/agent/deep-research.md`) should be the canonical source due to most complete permission model and explicit temperature setting. Claude and Codex versions should be derived from it with runtime-specific adaptations.

---

## Summary Table

| v3 ID | Proposal | Effort | Impact | Tier | Action | v2 Origin | Phase |
|-------|----------|--------|--------|------|--------|-----------|-------|
| v3-01 | Orchestrator Wiring | Medium | HIGHEST | 1 | WIRE | P1.2, P2.1, P2.2, P3.1, P4.1 (gaps) | 1 |
| v3-02 | Best-Seen Patience Signal | Small | HIGH | 1 | EXTEND | NEW | 2 |
| v3-03 | Early Zero-Yield Gate | Small | HIGH | 1 | EXTEND | NEW | 2 |
| v3-04 | Session UUID Tagging | Small | MEDIUM | 1 | PROTECT | NEW | 1 |
| v3-05 | Instance Lock | Small | MEDIUM | 2 | PROTECT | NEW | 1 |
| v3-06 | Per-Question Variance | Medium | MEDIUM | 2 | EXTEND | NEW | 3 |
| v3-07 | Content Trust Boundary | Medium | MEDIUM | 2 | PROTECT | NEW | 3 |
| v3-08 | Strategy Enrichment | Small | MEDIUM | 2 | PROTECT | Extends P4.2 + NEW | 3 |
| v3-09 | Comparative Stopping | Medium | MEDIUM | 2 | EXTEND | NEW | 4 |
| v3-10 | Pre-Iteration Quality Gate | Small | LOW | 3 | EXTEND | NEW | 4 |
| v3-11 | Warm-Up Parameter | Small | LOW | 3 | EXTEND | NEW | 4 |
| v3-12 | Complexity-Aware Rejection | Medium | LOW | 3 | EXTEND | Extends P4.4 | 4 |
| v3-13 | Rate-Limited Auto-Resume | Medium | LOW | 3 | EXTEND | NEW | 4 |
| v3-14 | Dual-Gate Activation | Small | MINIMAL | 4 | PROTECT | Extends P2.6 | 4 |
| v3-15 | Git-Isolated Parallelism | Large | NICHE | 4 | EXTEND | Extends P2.5 | 4 |

**Totals**: 15 proposals. 4 Tier 1 (Critical). 5 Tier 2 (High Value). 4 Tier 3 (Nice to Have). 2 Tier 4 (Track).
**By action**: 1 WIRE, 9 EXTEND, 5 PROTECT.
**By effort**: 7 Small, 6 Medium, 1 Large, 1 (v3-01 Medium but YAML-only).
**New in v3**: 7 proposals genuinely not in v2.
