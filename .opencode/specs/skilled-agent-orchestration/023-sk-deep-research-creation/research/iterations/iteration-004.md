# Iteration 004: Convergence Algorithms for Research Loops

## Focus

This iteration investigated convergence detection algorithms beyond our current diminishing-returns approach (rolling 3-iteration average of self-assessed `newInfoRatio`). The goal was to survey statistical, information-theoretic, and optimization-based approaches from production systems and academic literature, then propose concrete adaptations for knowledge-research loops where the "metric" is qualitative rather than numeric.

## Findings

### Finding 1: Bayesian Optimization Stopping -- Expected Improvement Collapse

**[REF: scikit-optimize documentation; Makarova et al., "Automatic Termination for Hyperparameter Optimization", AutoML 2022]**

Bayesian optimization uses acquisition functions (Expected Improvement, Probability of Improvement, Upper Confidence Bound) to decide which point to evaluate next. These functions naturally decay toward zero as the search space is explored and the Gaussian Process posterior tightens. However, **no major BO framework implements automatic convergence detection by default**. scikit-optimize uses a fixed `n_calls` budget. The key insight from Makarova et al. is the **improvement-vs-error criterion**: stop when the remaining improvement potential falls below the statistical estimation error. This is directly adaptable -- stop when expected new knowledge falls below the "noise" in our assessment.

**Confidence: High** (primary source: published paper + production implementations)

### Finding 2: Optuna Terminator -- Regret Bound vs. Statistical Error

**[SOURCE: Optuna terminator module documentation; optuna/terminator/improvement/evaluator.py source code]**

Optuna (v3.2+) implements the most sophisticated automatic stopping in any hyperparameter optimization framework, via its `Terminator` class with three evaluator strategies:

1. **RegretBoundEvaluator**: Fits a Gaussian Process to trial history, computes upper bound on regret (gap between current best and estimated optimum) using UCB/LCB bounds. Stops when regret bound is smaller than cross-validation error. Formula: `regret = max(UCB over space) - max(LCB over top trials)`. Requires minimum 20 trials.

2. **BestValueStagnationEvaluator**: Simpler patience-based approach. Tracks how many trials since last improvement. Returns `max_stagnation - (current_step - best_step)`. Terminates when this hits zero. Default: 30 trials stagnation.

3. **EMMREvaluator**: Expected Minimum Model Regret -- estimates remaining optimization potential using model predictions.

The core principle: **compare estimated improvement potential against estimated error**. When error dominates potential, stop.

**Confidence: High** (primary source: production code + official documentation)

### Finding 3: Ray Tune Plateau Detection -- Standard Deviation of Top-K

**[SOURCE: Ray Tune ExperimentPlateauStopper documentation]**

Ray Tune's `ExperimentPlateauStopper` uses a statistical clustering approach: monitor the **standard deviation among the top-K best results**. When std falls below a threshold (default 0.001) for `patience` consecutive checks, the experiment stops. Parameters:
- `top` (default 10): number of best results to consider
- `std` (default 0.001): minimum standard deviation threshold
- `patience` (default 0): consecutive checks below threshold before stopping

This approach detects when the "frontier" of best results has clustered, meaning no more diversity in outcomes. It is model-free and requires no Gaussian Process fitting.

**Confidence: High** (primary source: production documentation)

### Finding 4: CUSUM for Regime Change Detection

**[SOURCE: NIST Engineering Statistics Handbook, Section 6.3.2.3]**

The Cumulative Sum (CUSUM) control chart is a statistical process control method that accumulates deviations from a target mean. For our use case, it can detect when the `newInfoRatio` series has shifted from a "productive" regime (high new info) to a "converged" regime (low new info).

Tabular CUSUM tracks two statistics:
```
S_hi(i) = max(0, S_hi(i-1) + x_i - target - k)
S_lo(i) = max(0, S_lo(i-1) + target - k - x_i)
```

Where `k` is a slack parameter (typically 0.5 * shift size) and a signal fires when either statistic exceeds threshold `h`. Unlike our rolling average, CUSUM is **cumulative** -- it builds evidence over time, making it more sensitive to gradual decline while being robust to single-iteration noise.

**Confidence: High** (primary source: NIST reference standard)

### Finding 5: MAD Confidence Scoring from pi-autoresearch PR #22

**[SOURCE: github.com/davebcn87/pi-autoresearch/pull/22]**

The PR proposes: `confidence = |best_improvement| / MAD(all_metric_values)`. Key design decisions:
- Uses ALL results (keeps + discards), not just keeps, to avoid biased noise estimation
- Three interpretive bands: green (>= 2.0x MAD), yellow (1.0-2.0x), red (< 1.0x)
- Advisory only -- never auto-discards, just informs the agent
- Minimum 3 data points before computing confidence
- MAD chosen over standard deviation because it is robust to outliers

For our research context, the adaptation would be: `confidence = |latest_newInfoRatio - historical_median| / MAD(all_newInfoRatios)`. If the latest ratio is within 1.0x MAD of the historical median, the "improvement" is within noise. If it deviates above 2.0x MAD, genuinely new information was found.

**Confidence: High** (primary source: actual PR with implementation)

### Finding 6: R-hat Convergence Diagnostic from MCMC

**[SOURCE: Stan Reference Manual, Analysis chapter; mc-stan.org]**

The Gelman-Rubin R-hat statistic compares within-chain variance to between-chain variance. If all chains sample from the same distribution, R-hat = 1.0. Stan recommends R-hat < 1.01 for convergence.

For our parallel wave execution, this is directly applicable: if multiple parallel agents produce similar `newInfoRatio` values (low between-agent variance relative to within-agent variance across iterations), the research topic is converged. This only works when running parallel iterations on related sub-questions.

Stan also uses **Effective Sample Size (ESS)** -- accounting for autocorrelation to estimate how much independent information was actually gathered. For us, highly correlated findings across iterations (overlapping content) mean low effective information despite high iteration count.

**Confidence: Medium** (requires parallel execution to be useful; secondary source)

### Finding 7: Information-Theoretic Approach -- Entropy of Question Coverage

**[CITATION: NONE -- inference from information theory fundamentals, not directly sourced]**

Shannon entropy can quantify research completeness. Model the question space as a probability distribution over answered/unanswered questions weighted by their importance:

```
H(Q) = -sum(p_i * log2(p_i)) for all questions
```

Where `p_i` is the proportion of total importance assigned to question i. As questions are answered, the "residual entropy" (entropy of remaining unanswered questions) decreases. Convergence means residual entropy approaches zero.

More practically, information gain per iteration can be measured as the reduction in residual entropy:

```
IG(iteration) = H_before - H_after
```

When `IG` approaches zero, no more uncertainty is being resolved. This transforms the subjective `newInfoRatio` into a more structured metric tied to the question graph.

**Confidence: Medium** (inference from well-established theory, not a direct implementation reference)

### Finding 8: Stagnation Windows -- Universal Pattern Across Frameworks

**[REF: Synthesis of Optuna BestValueStagnationEvaluator, Ray Tune ExperimentPlateauStopper, AGR stuck detection]**

Every framework that implements convergence detection uses some form of **stagnation window** -- a count of consecutive evaluations without meaningful improvement:
- Optuna: `max_stagnation_trials` (default 30)
- Ray Tune: `patience` parameter (consecutive checks)
- AGR: 5 consecutive discards triggers stuck recovery
- Our system: 3 consecutive iterations with newInfoRatio < 0.05

This is the simplest and most universal convergence signal. Our system already implements this (stuck detection). The gap is that our stagnation uses a fixed threshold (0.05) rather than an adaptive one.

**Confidence: High** (cross-referenced across 4 production systems)

## Proposed Algorithms

### Algorithm A: Improvement-vs-Error (adapted from Makarova/Optuna)

**Principle**: Stop when estimated improvement potential is less than measurement noise.

```
function shouldContinue_IvE(state, config):
  ratios = [i.newInfoRatio for i in state.iterations]
  if len(ratios) < 4: return CONTINUE  // Need minimum data

  // Estimate "error" in our newInfoRatio assessment
  // Using MAD as robust noise estimator (from pi-autoresearch PR #22)
  median_ratio = median(ratios)
  mad = median(|r - median_ratio| for r in ratios)
  noise_floor = mad * 1.4826  // Scale to approximate std dev

  // Estimate "improvement potential" from recent trend
  recent = ratios[-3:]
  improvement_potential = mean(recent)

  // Compare: if improvement potential < noise, we can't distinguish
  // signal from noise -- convergence detected
  if improvement_potential < noise_floor * config.signalToNoiseThreshold:
    return STOP(reason="improvement_below_noise",
                improvement=improvement_potential, noise=noise_floor)

  return CONTINUE
```

**Parameters**: `signalToNoiseThreshold` (default 1.0 -- stop when signal equals noise; use 0.5 for more aggressive stopping).

**Advantages**: Adaptive -- the noise floor adjusts to the specific research topic. Noisy topics get more iterations; clean topics converge faster.
**Disadvantages**: Requires 4+ iterations before it can compute meaningful MAD. Self-assessed `newInfoRatio` may have systematic bias.

### Algorithm B: CUSUM Regime Detection (adapted from NIST)

**Principle**: Detect the moment when the `newInfoRatio` series shifts from "productive" to "converged" regime.

```
function shouldContinue_CUSUM(state, config):
  ratios = [i.newInfoRatio for i in state.iterations]

  // Target: we expect productive iterations to yield this much new info
  target = config.productiveThreshold  // default 0.30
  k = config.cusumSlack  // default 0.10 (sensitivity to shift)
  h = config.cusumThreshold  // default 0.50 (cumulative evidence needed)

  // Track cumulative evidence of being below productive threshold
  S_lo = 0
  for ratio in ratios:
    S_lo = max(0, S_lo + (target - k) - ratio)

  if S_lo >= h:
    return STOP(reason="cusum_regime_shift", cumulative_evidence=S_lo)

  return CONTINUE
```

**Parameters**: `productiveThreshold` (0.30), `cusumSlack` (0.10), `cusumThreshold` (0.50).

**Advantages**: Accumulates evidence over time -- a single bad iteration does not trigger convergence, but persistent low values do. More sensitive to gradual decline than rolling average.
**Disadvantages**: Three tuning parameters instead of one. Requires domain knowledge to set `productiveThreshold`.

### Algorithm C: Entropy-Based Question Coverage

**Principle**: Model convergence as residual entropy approaching zero across the question graph.

```
function shouldContinue_Entropy(state, config):
  questions = state.strategy.keyQuestions

  // Assign importance weights (default: uniform)
  weights = config.questionWeights or uniform(1/len(questions))

  // Calculate residual entropy from unanswered questions
  unanswered_weight = sum(w for q, w in zip(questions, weights) if not q.answered)
  total_weight = sum(weights)

  if total_weight == 0: return STOP(reason="no_questions")

  // Normalize to get residual uncertainty ratio
  residual = unanswered_weight / total_weight

  // Calculate information gain this iteration
  prev_residual = state.previousResidual or 1.0
  info_gain = prev_residual - residual

  // Stop if residual uncertainty is below threshold
  // OR if last N iterations had near-zero information gain
  if residual < config.residualThreshold:  // default 0.10
    return STOP(reason="low_residual_entropy", residual=residual)

  if info_gain < config.minInfoGain for last 2 iterations:  // default 0.02
    return STOP(reason="zero_info_gain", info_gain=info_gain)

  return CONTINUE
```

**Advantages**: Directly tied to the research goal (answering questions). Provides interpretable progress metric. Works even with subjective assessments because it is grounded in the question structure.
**Disadvantages**: Requires well-defined question decomposition upfront. Does not detect when an unanswered question is unanswerable. Binary answered/unanswered is coarse -- partially answered questions need fractional weights.

### Algorithm D: Composite Convergence (Recommended)

**Principle**: Combine multiple signals with weighted voting. More robust than any single signal.

```
function shouldContinue_Composite(state, config):
  signals = []

  // Signal 1: Existing rolling average (our current approach)
  if len(iterations) >= 3:
    avg = mean(last_3_ratios)
    signals.push({ name: "rolling_avg", stop: avg < 0.10, weight: 0.25 })

  // Signal 2: MAD-based noise detection (Algorithm A)
  if len(iterations) >= 4:
    noise = computeMAD(all_ratios) * 1.4826
    recent_mean = mean(last_3_ratios)
    signals.push({ name: "signal_vs_noise", stop: recent_mean < noise, weight: 0.30 })

  // Signal 3: Question coverage entropy (Algorithm C)
  residual = computeResidualEntropy(questions)
  signals.push({ name: "question_coverage", stop: residual < 0.10, weight: 0.25 })

  // Signal 4: Stagnation window (existing stuck detection, relaxed)
  stagnation = countStagnant(iterations, threshold=0.15)
  signals.push({ name: "stagnation", stop: stagnation >= 2, weight: 0.20 })

  // Weighted vote
  stop_score = sum(s.weight for s in signals if s.stop)
  total_weight = sum(s.weight for s in signals)

  if stop_score / total_weight >= config.consensusThreshold:  // default 0.60
    return STOP(reason="composite_convergence", signals=signals, score=stop_score)

  return CONTINUE
```

**Advantages**: No single noisy signal can cause premature termination. Degrades gracefully -- if one signal has insufficient data (< 4 iterations), others still work. Interpretable -- the stop decision shows which signals voted to stop.
**Disadvantages**: More complex to tune (4 weights + consensus threshold). Marginally slower due to multiple computations (negligible in practice).

## Sources Consulted

### Production Systems
- scikit-optimize: Bayesian optimization with fixed `n_calls` budget [DOC: scikit-optimize.github.io/stable/auto_examples/bayesian-optimization.html]
- Optuna Terminator module: RegretBoundEvaluator, BestValueStagnationEvaluator, EMMREvaluator [DOC: optuna.readthedocs.io/en/stable/reference/terminator.html]
- Optuna evaluator source code: RegretBoundEvaluator GP-based regret bounds [SOURCE: github.com/optuna/optuna/blob/master/optuna/terminator/improvement/evaluator.py]
- Ray Tune ExperimentPlateauStopper: std-of-top-K plateau detection [DOC: docs.ray.io/en/latest/tune/api/stoppers.html]
- Stan MCMC diagnostics: R-hat, ESS, split-chain convergence [DOC: mc-stan.org/docs/reference-manual/analysis.html]

### Academic Papers
- Makarova et al., "Automatic Termination for Hyperparameter Optimization", AutoML 2022 [REF: proceedings.mlr.press/v188/makarova22a.html] -- stop when improvement < estimation error

### Open Source Research Systems
- pi-autoresearch PR #22: MAD confidence scoring [SOURCE: github.com/davebcn87/pi-autoresearch/pull/22]
- NIST Engineering Statistics Handbook: CUSUM control charts [DOC: itl.nist.gov/div898/handbook/pmc/section3/pmc323.htm]

### Our System
- convergence.md [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md] -- current shouldContinue() algorithm

## Assessment

- **New information ratio**: 0.80
  - Rationale: 8 findings total. Finding 5 (MAD) partially known from iteration 002 but now with full PR detail and adaptation proposal (0.5 new). Finding 8 (stagnation universality) synthesizes known patterns (0.5 new). All other 6 findings are fully new (Optuna Terminator internals, CUSUM adaptation, entropy-based approach, R-hat for parallel waves, Ray Tune plateau detection, improvement-vs-error criterion). Score: (6 + 0.5 + 0.5) / 8 = 0.875, rounded to 0.80 accounting for the "gap" being identified in prior iterations.
- **Questions addressed**: Q8, Sub-Q (Bayesian optimization stopping), Sub-Q (information-theoretic measures), Sub-Q (MAD confidence adaptation)
- **Questions answered**: Q8 (comprehensive: 4 concrete algorithm proposals with pseudocode, sourced from 5+ production systems and 1 academic paper)

## Recommended Next Focus

With Q8 now thoroughly answered, the remaining open questions are:
- **Q9**: Novel research strategies (branching, backtracking, tree search) -- partially answered in iteration 001, needs deeper analysis of how stuck-recovery could incorporate tree-search-like backtracking
- **Q10**: Cross-cutting synthesis of concrete improvements to adopt -- this is the convergence/synthesis question that should be the final iteration
- **Q4 + Q7**: State management and execution strategy consolidation -- partially answered, needs unified recommendation

Recommended Wave 2 assignments:
- Iteration 005: Q9 (novel strategies) + Q4/Q7 (consolidation) -- investigate tree search and MCTS approaches for research branching
- Iteration 006: Q10 (final synthesis) -- cross-cutting ranking of all improvements, priority ordering, implementation roadmap
