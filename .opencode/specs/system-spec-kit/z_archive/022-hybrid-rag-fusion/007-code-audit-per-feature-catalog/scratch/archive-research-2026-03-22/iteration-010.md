# Iteration 10: Q11 -- Minimum-Cost Re-Audit Plan (Final Synthesis)

## Focus
Produce a concrete, actionable re-audit plan that reduces all 21 phases below 0.50 composite risk with the fewest interventions. Synthesize all findings from iterations 1-9 into a prioritized remediation roadmap with effort estimates and expected risk reduction per intervention.

## Methodology

### Problem Statement
7 of 21 phases currently score >= 0.50 composite risk (2 CRITICAL, 5 HIGH). The re-audit plan must:
1. Identify the minimum set of interventions to bring ALL phases below 0.50
2. Order interventions by risk-reduction-per-effort ratio
3. Include new audit categories for cross-cutting concerns not coverable by per-phase re-audit
4. Provide concrete scope (which files, which features, what to verify) per intervention

### Intervention Impact Analysis

Each of the 6 risk dimensions (D1-D6) can be reduced by specific interventions. The question is which interventions yield the most composite risk reduction across the most phases per unit of effort.

## Findings

### 1. Systemic Interventions (Apply Once, Reduce All Phases)

These interventions reduce risk dimensions across ALL 21 phases simultaneously. They are the highest-leverage actions.

**S1: Pin Audit Baseline to Specific SHA** (reduces D4 and D5 for all phases)
- Effort: SMALL (1 hour -- document the pinned SHA, add to audit methodology)
- Impact: D4 drops from current values to 0.10 for all phases (temporal churn becomes a controlled variable). D5 drops proportionally (flag state is deterministic at pinned SHA).
- Risk reduction: For Phase 011 (CRITICAL), D4 drops from 1.00 to 0.10 = saves 0.135 composite points. D5 drops from 0.70 to 0.10 = saves 0.060 composite points. Total = -0.195 (011 goes from 0.80 to ~0.62).
- Applies to: ALL 21 phases. The top 7 phases each lose 0.10 to 0.20 composite points.
[INFERENCE: Based on D4/D5 weights (0.15 + 0.10 = 0.25 total weight) and the reduction from current elevated values to baseline 0.10]

**S2: Create Cross-Cutting Module Audit Phase** (reduces D3 for all HIGH/CRITICAL phases)
- Scope: New Phase 022 covering hooks/ (4 files, ~21KB), session-manager.ts (1186 lines, 26 functions), lib/cognitive/ (3 files, ~30KB), lib/search/pipeline internals (6 unreferenced files)
- Effort: LARGE (8-12 hours -- 14 files, ~70KB of code to audit as primary targets, not side-effect coverage)
- Impact: D3 drops from 1.00/0.70 to 0.10 for phases that currently inherit cross-cutting risk. For Phase 011 (D3=1.00), saves 0.20 * (1.00 - 0.10) = 0.180 composite points.
- Applies to: 011 (saves 0.18), 014 (saves 0.18), 001 (saves 0.18), 012 (saves 0.12), 015 (saves 0.12), 018 (saves 0.12)
[INFERENCE: Based on D3 weight (0.20) and the phases that touch cross-cutting modules identified in iteration 4]

**S3: Catalog 32 Unreferenced Source Files** (reduces D2 effective surface area)
- Scope: Add 6 CRITICAL + 9 HIGH + 8 MEDIUM files to appropriate catalog phases. 5 LOW (deprecated) files get documented as deprecated, not audited.
- Effort: MEDIUM (3-4 hours -- file classification already done in iteration 2; requires writing catalog entries and running audit verification for 23 active files)
- Impact: Indirect -- reduces the "unknown surface area" that inflates D2 and D3 for specific phases. Primary benefit is completeness, not composite score reduction.
- Applies to: Primarily 011, 014, 013 where unreferenced files cluster
[SOURCE: Iteration 2 severity breakdown of 32 unreferenced files]

### 2. Targeted Phase Re-Audits (Apply Per-Phase, Reduce D1)

To bring phases below 0.50, targeted re-audits verify PARTIAL findings and convert them to MATCH or MISMATCH, reducing D1 (PARTIAL ratio). Each re-audit is scoped to the specific PARTIAL findings in that phase.

**T1: Re-Audit Phase 011 -- Scoring and Calibration** (current: 0.80 CRITICAL)
- Scope: 4 PARTIAL findings to re-verify against source at pinned SHA. Specifically:
  - Verify all scoring test assertions (31 test files) against catalog descriptions
  - Add attention-decay.ts, tier-classifier.ts, pressure-monitor.ts to catalog scope
  - Verify PARTIAL corrections (85.7% expected accurate per Q9)
- Effort: MEDIUM (4-5 hours -- 23 features, 4 PARTIAL to re-verify, 3 cross-cutting modules to add)
- Expected post-intervention score: With S1+S2+T1, D1 drops from 0.40 to 0.10 (resolve PARTIALs), D3 to 0.10 (S2), D4 to 0.10 (S1), D5 to 0.10 (S1). New composite: (0.10*0.25) + (0.96*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (1.00*0.15) = 0.025 + 0.144 + 0.020 + 0.015 + 0.010 + 0.150 = **0.36** (from 0.80 to 0.36 = -0.44)
[SOURCE: Phase 011 risk dimensions from iteration 8 table]

**T2: Re-Audit Phase 014 -- Pipeline Architecture** (current: 0.78 CRITICAL)
- Scope: 4 PARTIAL findings to re-verify. Add 6 unreferenced pipeline files to catalog:
  - stage2b-enrichment.ts, chunk-reassembly.ts, reranker.ts, fsrs.ts, search-utils.ts, deterministic-extractor.ts
  - Verify pipeline end-to-end against 9 integration test assertions
- Effort: MEDIUM (4-5 hours -- 22 features, 4 PARTIAL, 6 unreferenced files to catalog and verify)
- Expected post-intervention score: (0.10*0.25) + (0.92*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (0.80*0.15) = 0.025 + 0.138 + 0.020 + 0.015 + 0.010 + 0.120 = **0.33** (from 0.78 to 0.33 = -0.45)
[SOURCE: Phase 014 risk dimensions from iteration 8 table]

**T3: Re-Audit Phase 001 -- Retrieval** (current: 0.64 HIGH)
- Scope: 2 PARTIAL findings. Verify memory_search "15+ source files" claim (questionable MATCH). Add handler-to-pipeline integration paths to audit scope.
- Effort: SMALL (2-3 hours -- smaller feature count, 2 PARTIAL, focused handler verification)
- Expected post-intervention score: (0.10*0.25) + (0.42*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (0.80*0.15) = 0.025 + 0.063 + 0.020 + 0.015 + 0.010 + 0.120 = **0.25** (from 0.64 to 0.25 = -0.39)
[SOURCE: Phase 001 risk dimensions from iteration 8 table]

**T4: Re-Audit Phase 018 -- UX Hooks** (current: 0.62 HIGH)
- Scope: 4 PARTIAL findings. Verify hook trigger conditions against graduated flag states. Verify hooks/ system from consumer perspective across categories.
- Effort: SMALL (2-3 hours -- hooks system partly covered by S2; only need PARTIAL re-verification)
- Expected post-intervention score: (0.10*0.25) + (0.79*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (0.60*0.15) = 0.025 + 0.119 + 0.020 + 0.015 + 0.010 + 0.090 = **0.28** (from 0.62 to 0.28 = -0.34)
[SOURCE: Phase 018 risk dimensions from iteration 8 table]

**T5: Re-Audit Phase 013 -- Memory Quality and Indexing** (current: 0.58 HIGH)
- Scope: 3 PARTIAL findings. Add 3 CRITICAL unreferenced save-pipeline files (markdown-evidence-builder.ts, spec-folder-mutex.ts, validation-responses.ts) to catalog. Verify indexing pipeline end-to-end.
- Effort: MEDIUM (3-4 hours -- highest feature count overall at 24, but many are lower-complexity)
- Expected post-intervention score: (0.10*0.25) + (1.00*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (0.60*0.15) = 0.025 + 0.150 + 0.020 + 0.015 + 0.010 + 0.090 = **0.31** (from 0.58 to 0.31 = -0.27)
[SOURCE: Phase 013 risk dimensions from iteration 8 table]

**T6: Re-Audit Phase 012 -- Query Intelligence** (current: 0.55 HIGH)
- Scope: 2 PARTIAL findings. Verify query decomposition/reformulation pipeline. Check graduated query flags (QUERY_DECOMPOSITION, LLM_REFORMULATION, etc.) against catalog descriptions.
- Effort: SMALL (1-2 hours -- 11 features, focused on graduated flag verification)
- Expected post-intervention score: (0.10*0.25) + (0.46*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (0.60*0.15) = 0.025 + 0.069 + 0.020 + 0.015 + 0.010 + 0.090 = **0.23** (from 0.55 to 0.23 = -0.32)
[SOURCE: Phase 012 risk dimensions from iteration 8 table]

**T7: Re-Audit Phase 015 -- Retrieval Enhancements** (current: 0.54 HIGH)
- Scope: 2 PARTIAL findings. Verify enhancement features against post-graduation behavior.
- Effort: SMALL (1-2 hours -- 9 features, 2 PARTIAL, focused verification)
- Expected post-intervention score: (0.10*0.25) + (0.38*0.15) + (0.10*0.20) + (0.10*0.15) + (0.10*0.10) + (0.60*0.15) = 0.025 + 0.057 + 0.020 + 0.015 + 0.010 + 0.090 = **0.22** (from 0.54 to 0.22 = -0.32)
[SOURCE: Phase 015 risk dimensions from iteration 8 table]

### 3. New Audit Categories Recommended

Beyond re-auditing existing phases, three NEW categories should be created:

**N1: Cross-Cutting Shared Modules** (corresponds to S2)
- Session-manager (26 functions, 1186 lines) -- primary audit target, not side-effect
- hooks/ system (4 files, ~21KB, 17 importers) -- verify all hook trigger conditions
- lib/cognitive/ (3 files, ~30KB) -- attention-decay, tier-classifier, pressure-monitor
- Effort included in S2 estimate

**N2: Security and Safety Behaviors**
- Scope: 21 regression/safety/security test files that verify production-critical behaviors
  - Path traversal prevention (path-security.ts tests)
  - FTS5 query sanitization (bm25-security.ts tests)
  - Batch size validation (safety.ts tests)
  - Content redaction (redaction-gate.ts tests)
  - Crash recovery (T009-T016 regression tests)
  - Race condition handling (T214 tests)
- Effort: MEDIUM (3-4 hours -- requires reading test assertions and documenting the security behaviors they protect)
- Impact: Converts undocumented-but-tested security behaviors into documented features. Does not directly reduce risk scores but closes the most dangerous gap in the catalog.
[SOURCE: Iteration 7 security-critical test files list]

**N3: Programmatic API Layer**
- Scope: 6 api/ files providing non-MCP programmatic interface
- Effort: SMALL (2-3 hours -- 6 files to catalog and verify)
- Impact: Closes the largest single-module documentation gap identified in iteration 1
[SOURCE: Iteration 1 uncataloged modules, iteration 2 severity classification]

### 4. Recommended Execution Order

The plan is ordered by risk-reduction-per-effort ratio, with dependencies noted:

| Priority | Intervention | Effort | Risk Reduction | Phases Affected | Dependencies |
|----------|-------------|--------|----------------|-----------------|--------------|
| **P0-A** | S1: Pin SHA baseline | 1 hr | -0.10 to -0.20 per phase | All 21 | None |
| **P0-B** | S2: Cross-cutting audit phase | 8-12 hr | -0.12 to -0.18 per HIGH/CRIT phase | 6 of 7 at-risk | None |
| **P1-A** | T1: Re-audit 011 (scoring) | 4-5 hr | -0.44 (0.80 to 0.36) | 011 | S1, S2 |
| **P1-B** | T2: Re-audit 014 (pipeline) | 4-5 hr | -0.45 (0.78 to 0.33) | 014 | S1, S2, S3 (partial) |
| **P1-C** | T3: Re-audit 001 (retrieval) | 2-3 hr | -0.39 (0.64 to 0.25) | 001 | S1, S2 |
| **P2-A** | T4: Re-audit 018 (ux-hooks) | 2-3 hr | -0.34 (0.62 to 0.28) | 018 | S1, S2 |
| **P2-B** | T5: Re-audit 013 (memory quality) | 3-4 hr | -0.27 (0.58 to 0.31) | 013 | S1, S3 |
| **P2-C** | T6: Re-audit 012 (query intel) | 1-2 hr | -0.32 (0.55 to 0.23) | 012 | S1 |
| **P2-D** | T7: Re-audit 015 (retr. enhancements) | 1-2 hr | -0.32 (0.54 to 0.22) | 015 | S1 |
| **P3-A** | S3: Catalog 32 unreferenced files | 3-4 hr | Completeness (indirect) | 011, 014, 013 | None |
| **P3-B** | N2: Security behaviors catalog | 3-4 hr | Safety gap closure | New category | None |
| **P3-C** | N3: API layer audit | 2-3 hr | Completeness gap closure | New category | None |

### 5. Total Effort and Expected Outcomes

| Scope Level | Interventions | Hours | All Phases Below 0.50? | Risk Eliminated |
|-------------|---------------|-------|------------------------|-----------------|
| **Minimum viable** (P0 only) | S1 + S2 | 9-13 hr | NO (5 phases still > 0.50, but reduced from 7) | Eliminates temporal and cross-cutting systemic risk |
| **Target threshold** (P0 + P1 + P2) | S1 + S2 + T1-T7 | 27-38 hr | YES -- all 21 phases below 0.50 | All CRITICAL eliminated, all HIGH resolved, all PARTIAL re-verified |
| **Comprehensive** (All) | All S + T + N + S3 | 36-50 hr | YES + new categories | Complete: cross-cutting audited, security documented, API covered, all files cataloged |

### 6. Post-Intervention Risk Projection (Target Threshold)

After S1 + S2 + T1-T7, projected composite scores for the 7 previously at-risk phases:

| Phase | Before | After | Reduction | Risk Tier |
|-------|--------|-------|-----------|-----------|
| 011-scoring | 0.80 | 0.36 | -0.44 | LOW-MEDIUM |
| 014-pipeline | 0.78 | 0.33 | -0.45 | LOW-MEDIUM |
| 001-retrieval | 0.64 | 0.25 | -0.39 | LOW |
| 018-ux-hooks | 0.62 | 0.28 | -0.34 | LOW |
| 013-memory-quality | 0.58 | 0.31 | -0.27 | LOW-MEDIUM |
| 012-query-intel | 0.55 | 0.23 | -0.32 | LOW |
| 015-retr-enhance | 0.54 | 0.22 | -0.32 | LOW |

All 7 phases drop below 0.50. The remaining 14 phases (already MEDIUM or LOW) also benefit from S1 systemic intervention, reducing their scores further.

### 7. Simplification: Consolidating 10 Iterations Into Core Findings

This iteration consolidates the full research into 5 core findings and 1 action plan:

**Core Finding 1: Coverage Gaps** (Iterations 1-2)
- 32 of 286 source files (11%) never referenced in the catalog
- 4 active modules with ZERO catalog mentions
- Session-manager (1186 lines) has 85% of functions unaudited

**Core Finding 2: Accuracy Concerns** (Iterations 3, 9)
- PARTIAL correction claims are 85.7% accurate for file references
- Function name corrections are less reliable (fabricated names observed)
- MATCH boundary was inconsistently applied in at least 1 case

**Core Finding 3: Temporal Instability** (Iterations 5-6)
- 82% of source files modified during the 6-day audit window
- 22 feature flags graduated mid-audit, reversing behavioral semantics
- No pinned SHA baseline despite spec.md Risk R-003 calling for it

**Core Finding 4: Structural Blind Spots** (Iterations 4, 7, 9)
- Per-category audit effectiveness is inversely proportional to module import frequency
- 97.2% of test files unreferenced in catalog (312/321)
- 21 security-critical test behaviors have no catalog documentation
- hooks/ system (17 importers) and session-manager (4 core importers) are owned by no category

**Core Finding 5: Risk Concentration** (Iteration 8)
- 2 of 21 phases (9.5%) concentrate 31% of unreferenced files and 20% of features
- Phase 011 (scoring, 0.80) and Phase 014 (pipeline, 0.78) are CRITICAL
- Top 7 phases account for all risk above 0.50 threshold

**Action Plan**: The minimum-cost re-audit (27-38 hours) targets systemic fixes first (pin SHA, audit cross-cutting modules), then 7 targeted phase re-audits, bringing all phases below 0.50 composite risk.

## Sources Consulted
- Iteration 008: Per-phase risk model and composite scores
- Iteration 009: Verified correction accuracy (85.7%) and session-manager analysis
- All prior iterations (001-007): Underlying data for each risk dimension
- Strategy.md: Complete Q1-Q10 answers informing remediation scope

## Assessment
- New information ratio: 0.70 (the re-audit plan structure and effort estimates are new synthesis; per-phase score projections are new calculations; simplification of 10 iterations into 5 core findings adds consolidation value; underlying risk data comes from Q1-Q10)
- Simplification bonus: +0.10 (consolidating 10 iterations and 11 questions into 5 core findings + 1 action plan)
- Effective newInfoRatio: 0.80
- Questions addressed: Q11
- Questions answered: Q11

## Reflection
- What worked and why: Building the re-audit plan on top of the quantitative risk model (iteration 8) made it possible to calculate specific composite score reductions per intervention. Each systemic intervention (S1, S2) reduces a risk dimension across multiple phases, giving the highest leverage. The 6-dimension model allowed precise "what-if" projections.
- What did not work and why: D6 (test gap) has no clear reduction path in the re-audit plan because the structural gap between feature-oriented catalog and behavior-oriented tests requires a scope expansion, not a re-audit. D6 remains at current levels even after all interventions. This is acceptable because the test suite provides independent behavioral assurance.
- What I would do differently: In the risk model (iteration 8), D6 should have been weighted lower (0.10 instead of 0.15) because it represents a scope design choice, not an audit quality failure. The current weighting slightly inflates risk for phases with good test coverage but poor test-catalog linkage.

## Recommended Next Focus
This iteration completes the primary research questions (Q1-Q11). If further iterations are needed, potential areas include:
- Deep-dive into MEDIUM-risk phases (002, 008, 010) to check if they hide specific issues
- Verify the 6 uncataloged new files (batch-learning.ts, etc.) for production activation status
- Analyze the 3 deprecated dead-code files for safe removal candidacy
