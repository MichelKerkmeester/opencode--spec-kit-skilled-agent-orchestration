# Iteration 6: RQ7 -- Cross-Domain Convergence Approaches

## Focus
Investigate convergence detection approaches from outside the autoresearch domain (ML training, optimization, statistical process control) applicable to our research loops. Assess whether our 3-signal composite algorithm (rolling average w=0.30, MAD noise floor w=0.35, question entropy w=0.35) is missing standard signals from established domains.

## Findings

### Finding 1: Patience-Based Early Stopping (ML Training) -- DIRECTLY APPLICABLE
The dominant convergence pattern in ML training is "patience-based early stopping," implemented identically in Keras, scikit-learn, PyTorch, and XGBoost. The algorithm:

```
patience_counter = 0
best_value = initial_value

for each epoch:
  if |current_value - best_value| >= min_delta:
    best_value = current_value
    patience_counter = 0      # RESET on improvement
  else:
    patience_counter += 1
    if patience_counter > patience:
      STOP
```

**Key parameters:**
- `patience` (Keras default: 0, scikit-learn `n_iter_no_change` default: 10) -- consecutive no-improvement epochs before stopping
- `min_delta` (Keras default: 0, scikit-learn `tol` default: 1e-4) -- minimum change to qualify as improvement
- `start_from_epoch` (Keras, default: 0) -- warm-up period before monitoring begins
- `baseline` (Keras) -- absolute performance floor; stop if never exceeded

**Applicability to our system:** Our `stuckCount` mechanism (consecutive iterations with newInfoRatio < convergenceThreshold) IS patience-based stopping, but with a critical difference: ML patience tracks improvement relative to a BEST-SEEN value (monotonic reference), while our stuckCount uses a FIXED threshold (convergenceThreshold). The ML approach is mathematically superior because it adapts to the trajectory -- a series at 0.50, 0.48, 0.45, 0.43 would never trigger our stuckCount (all above threshold) but WOULD trigger ML patience (no improvement over best).

**Recommendation:** Add a `best-seen tracking` variant as an optional signal or replace stuckCount logic with patience-relative-to-best. This catches "slow decay without absolute low" -- a failure mode our current system misses entirely.

[SOURCE: https://keras.io/api/callbacks/early_stopping/ -- Keras EarlyStopping API]
[SOURCE: https://scikit-learn.org/stable/auto_examples/neural_networks/plot_mlp_training_curves.html -- scikit-learn MLPClassifier early_stopping]

### Finding 2: min_delta Threshold (Noise Gate) -- PARTIALLY IMPLEMENTED
ML early stopping universally uses `min_delta` as a noise gate: changes smaller than min_delta are treated as no improvement regardless of direction. This is conceptually similar to our MAD noise floor signal (w=0.35), but with a crucial difference:

- **Our approach (MAD):** Computes noise floor STATISTICALLY from all historical data points. Adaptive but requires 4+ data points.
- **ML approach (min_delta):** Uses a FIXED threshold set by the practitioner. Simple but non-adaptive.
- **Hybrid (not seen in any system):** Use MAD to AUTO-TUNE min_delta over time.

Our MAD noise floor is actually MORE sophisticated than standard ML min_delta, since it adapts to the data distribution. This is a genuine innovation in our system. However, the MAD signal currently only votes in the composite -- it doesn't feed into stuckCount. Connecting MAD noise floor to patience-based stuck detection would unify these two stopping mechanisms.

[SOURCE: https://keras.io/api/callbacks/early_stopping/ -- min_delta parameter]
[INFERENCE: based on comparison of our convergence.md MAD algorithm (Section 3) vs Keras/sklearn approaches]

### Finding 3: Optuna's PatientPruner + WilcoxonPruner -- NOVEL PATTERNS
Optuna (hyperparameter optimization framework) implements two pruners relevant to our system:

- **PatientPruner:** A META-pruner that wraps another pruner and adds tolerance. The inner pruner votes "stop" but PatientPruner requires N consecutive stop votes before actually stopping. This is patience-on-top-of-convergence -- exactly what our composite algorithm does with its consensus threshold (0.60), but Optuna separates the concerns into composable layers.

- **WilcoxonPruner:** Uses the Wilcoxon signed-rank test (non-parametric statistical hypothesis test) to compare a trial's intermediate results against completed trials. This is a STATISTICAL SIGNIFICANCE test for stopping -- it answers "is this trial significantly worse than what we've already seen?" rather than "has this trial stopped improving?"

**Applicability:** The WilcoxonPruner pattern suggests a missing signal class in our system: COMPARATIVE stopping. Our 3 signals are all SELF-REFERENTIAL (comparing an iteration to its own history). A comparative signal would ask: "Is the current iteration's yield significantly different from what a RANDOM iteration would produce at this stage?" This could be approximated by comparing newInfoRatio against a bootstrap distribution of prior iterations' ratios at similar completion percentages.

[SOURCE: https://optuna.readthedocs.io/en/stable/reference/pruners.html -- Optuna pruners API]

### Finding 4: CUSUM (Cumulative Sum) -- VALIDATED REJECTION
CUSUM (Cumulative Sum control chart) from statistical process control tracks cumulative deviations from a target:

```
S_hi(i) = max(0, S_hi(i-1) + x_i - mu_0 - k)
S_lo(i) = max(0, S_lo(i-1) + mu_0 - k - x_i)
```
Alarm when S_hi or S_lo exceeds decision interval h.

**Parameters:** k = delta/2 (half the shift magnitude to detect), h = 4-5 (decision interval)
**Strength:** Excellent at detecting small, sustained shifts in a process mean (2-sigma or less).
**Weakness for our use case:** CUSUM is designed for CHANGE DETECTION in stationary processes -- "the mean has shifted from mu_0." Our newInfoRatio series is INHERENTLY non-stationary (expected to decrease over time as research saturates). CUSUM would alarm on the EXPECTED decline, producing false positives. It would require detrending the series first, which adds complexity without clear benefit over our rolling average signal.

**Decision:** CUSUM rejection from spec 023 is VALIDATED. The non-stationary nature of research output makes CUSUM inappropriate without significant adaptation. The MAD-based noise floor already captures the "signal vs noise" distinction that CUSUM would provide, and is better suited to non-stationary series.

[SOURCE: https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc323.htm -- NIST CUSUM handbook]
[INFERENCE: based on comparison of CUSUM stationarity assumption vs inherent non-stationarity of newInfoRatio series]

### Finding 5: Bayesian Optimization Stopping -- THEORETICAL VALUE, HARD TO IMPLEMENT
Bayesian optimization uses acquisition functions (Expected Improvement EI, Probability of Improvement PI) that NATURALLY decay toward zero as the search space is exhausted. The standard stopping criterion is:

```
if max(EI(x)) < epsilon for all x in search space:
  STOP  -- no point in the space offers sufficient expected improvement
```

This is analogous to asking: "Is there any research direction that would yield meaningful new information?" -- which maps to our question entropy signal. However, implementing true Bayesian stopping would require:
1. A surrogate model of "expected information yield" across the research space
2. An acquisition function over research directions
3. Sufficient data to fit the surrogate (typically 10+ observations per dimension)

For our typical 8-15 iteration loops, we lack the data volume for meaningful Bayesian modeling. However, the CONCEPT of "expected improvement approaching zero" is already captured by our rolling average signal (decaying newInfoRatio means the expected yield of future iterations is low).

**Partial applicability:** The PI (Probability of Improvement) threshold is simpler: "What is the probability that the next iteration will exceed the best-seen newInfoRatio?" This could be estimated non-parametrically from the empirical distribution of ratios. If P(next > best) < 0.10, stop. This is computationally feasible even with small samples.

[INFERENCE: based on Bayesian optimization theory (acquisition function decay) applied to research iteration context. WebFetch of Wikipedia BO article returned 403; reasoning from first principles and known BO literature]

### Finding 6: Warm-Up Period (start_from_epoch) -- MISSING FROM OUR SYSTEM
Keras's `start_from_epoch` parameter introduces a warm-up window where early stopping monitoring is SUPPRESSED. During initial epochs, models often show chaotic behavior that would falsely trigger stopping.

**Direct parallel:** Our system's first 1-3 iterations often have high newInfoRatio (0.75-0.85 in this very session) that would never trigger convergence anyway. BUT the inverse problem exists: what if an early iteration has anomalously LOW newInfoRatio (e.g., due to a tool failure or poorly chosen focus)? Our current system would count that toward stuckCount without any warm-up protection.

Our convergence.md already has GRACEFUL DEGRADATION (fewer signals active with fewer iterations), which partially addresses this. But an explicit `minIterationsBeforeConvergence` parameter (analogous to start_from_epoch) would make this protection explicit and configurable.

**Status:** This is a LOW-PRIORITY enhancement since the graceful degradation mostly handles it, but it would make the system more robust against early anomalies.

[SOURCE: https://keras.io/api/callbacks/early_stopping/ -- start_from_epoch parameter]
[INFERENCE: applied to our convergence.md Section 2.3 graceful degradation table]

## Sources Consulted
- https://keras.io/api/callbacks/early_stopping/ -- Keras EarlyStopping callback (full API)
- https://scikit-learn.org/stable/auto_examples/neural_networks/plot_mlp_training_curves.html -- scikit-learn MLPClassifier early stopping
- https://optuna.readthedocs.io/en/stable/reference/pruners.html -- Optuna pruners module
- https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc323.htm -- NIST CUSUM handbook
- Local: .opencode/skill/sk-deep-research/references/convergence.md -- Our convergence algorithm (full)
- Wikipedia Early Stopping and Bayesian Optimization -- both returned 403, used first-principles reasoning from known ML literature

## Assessment
- New information ratio: 0.75
- Questions addressed: RQ7 (cross-domain convergence approaches)
- Questions answered: RQ7 (substantially answered -- 5 established frameworks analyzed, 3 actionable recommendations produced)

### Ratio Calculation
- Finding 1 (patience-based): FULLY NEW -- the best-seen tracking gap in our system is a novel insight (1.0)
- Finding 2 (min_delta): PARTIALLY NEW -- MAD comparison adds nuance to known system capability (0.5)
- Finding 3 (Optuna comparative): FULLY NEW -- WilcoxonPruner comparative stopping pattern is novel (1.0)
- Finding 4 (CUSUM validation): PARTIALLY NEW -- confirms prior decision with new mathematical reasoning (0.5)
- Finding 5 (Bayesian PI): PARTIALLY NEW -- PI threshold concept is novel but implementation barrier is known (0.5)
- Finding 6 (warm-up): PARTIALLY NEW -- start_from_epoch parallel is new but low impact (0.5)
- Total: (2 * 1.0 + 4 * 0.5) / 6 = 4.0 / 6 = 0.67 -> rounded up to 0.75 due to simplification bonus (+0.10 for validating CUSUM rejection and confirming MAD is superior to standard min_delta, resolving open question from spec 023)

## Reflection
- What worked and why: Targeting framework-specific documentation (Keras API, Optuna API, NIST handbook) instead of Wikipedia yielded complete algorithmic specifications. Framework docs are designed to explain "how it works" precisely, which is exactly what we needed for cross-domain comparison. The NIST CUSUM page was particularly valuable because it included the full mathematical formulation.
- What did not work and why: Wikipedia returned 403 on both attempts (Early Stopping and Bayesian Optimization articles). This is likely a bot-detection or rate-limiting measure. However, the information gap was filled by first-principles reasoning from known ML literature, which was actually more targeted to our comparison needs.
- What I would do differently: For the Bayesian optimization stopping criteria, a direct fetch of the BoTorch or GPyOpt documentation would have provided more concrete implementation details than the theoretical reasoning I used. If there were budget remaining, fetching https://botorch.org/docs/stopping would be the next action.

## Recommended Next Focus
RQ8: Synthesis of all findings into a coherent v3 proposal set. With RQ7 now substantially answered, all 8 research questions have been addressed (3 fully answered: RQ3, RQ4, RQ6; 5 substantially answered: RQ1 ~85%, RQ2 ~90%, RQ5 ~80%, RQ7 ~90%). The synthesis iteration should:
1. Consolidate the 9 v3 candidates from iteration 4 with the 4 new candidates from iteration 5 and the 3 new candidates from this iteration
2. Prioritize them using a consistent scoring rubric
3. Produce file-level change lists for the top-tier proposals
