---
title: Deep Research Strategy
description: Strategy for finding gaps in the 007-code-audit-per-feature-catalog
---

# Research Strategy

## Topic
007-code-audit-per-feature-catalog: Find gaps, missed features, inaccuracies, and systemic issues in the completed code audit of 220+ features across 19 categories of the Spec Kit Memory MCP server

## Key Questions (remaining)
- [x] Q1: Are there features in the source code that exist but are NOT documented in any of the 19 feature catalog categories? (undiscovered features) -- **SUBSTANTIALLY ANSWERED**: All 32 MCP tools are cataloged. However, ~25-35 source files in infrastructure/cross-cutting modules (api/, formatters/, core/, utils/, lib/errors/, lib/utils/) have no catalog entry. The programmatic api/ layer (6 files) is the biggest gap.
- [x] Q2: Are there source files in the MCP server that were never referenced by any audit phase? (unaudited code paths) -- **ANSWERED**: 32 of 286 non-test source files (11.2%) are never referenced by any feature catalog entry. 6 are CRITICAL active production code (save pipeline, search pipeline, telemetry), 9 are HIGH active utilities, 8 are MEDIUM (api/ layer + barrel files), 5 are LOW (deprecated/dead), 2 are test files outside tests/ dir, 2 are miscellaneous.
- [x] Q3: Do the PARTIAL findings from the audit accurately identify all real discrepancies, or were some misclassified as MATCH? (false positives) -- **SUBSTANTIALLY ANSWERED**: PARTIAL findings identify real discrepancies, BUT ~50% of audit corrections contain errors (pointing to non-existent files/functions like fusion-lab.ts, title-builder.ts). Some MATCH classifications may also be overly generous (e.g., memory_search noted "15+ source files missing" yet classified MATCH).
- [x] Q4: Are there cross-feature interactions or shared code paths that the per-category audit structure missed? (structural blind spots) -- **SUBSTANTIALLY ANSWERED**: 4 active production modules (attention-decay.ts, tier-classifier.ts, pressure-monitor.ts, mutation-feedback.ts) have ZERO feature catalog mentions despite being imported by core handlers. The hooks/ system (17 importers), session-manager (41KB monolith, 4 core importers), and 3 cognitive modules (~30KB total) are structural blind spots. The per-category audit covers low-import-frequency code well but becomes progressively less effective as import frequency increases.
- [x] Q5: Are there recently added or modified source files (post-catalog-creation) that the audit could not have covered? (temporal gaps) -- **ANSWERED**: 234 of 286 .ts files (82%) were modified during the audit window (Mar 16-22) across 27 commits. 27 new source files were added; 6 of those have ZERO catalog mentions. Zero post-audit drift (no changes after audit commit). The audit ran concurrently with 4 major implementation waves including feature flag graduation.
- [x] Q6: Which features graduated from experimental to default-ON during the audit, and do catalog descriptions reflect production or experimental behavior? (feature flag graduation impact) -- **SUBSTANTIALLY ANSWERED**: 22 flags graduated from opt-in (OFF) to default-ON in a single commit (09acbe8ce, Mar 21 22:54) during the audit window. The graduation reversed behavioral semantics: undefined env vars went from DISABLED to ENABLED via isFeatureEnabled(). Phase 020 only audited 7 flags; remaining 33+ were audited only as features within domain phases. The audit used a moving HEAD baseline (not pinned SHA), so phases verified on different days may have verified against different flag states.
- [x] Q7: Do test files test behaviors NOT described in the feature catalog? (test-catalog alignment gap) -- **ANSWERED**: Only 9 of 321 test files (2.8%) are referenced in the catalog. 312 test files exercise behaviors, edge cases, and subsystems never mentioned in any catalog phase. 21 regression/safety/security tests verify production-critical behaviors (crash recovery, path traversal prevention, race conditions, FTS5 sanitization) with no catalog counterpart. 31 scoring/fusion tests exercise ranking pipeline details undocumented in the catalog. 9 integration tests verify cross-category pipelines the per-category structure cannot cover.
- [x] Q8: Can we produce a weighted risk score per audit phase combining all gap dimensions? (quantitative gap model) -- **ANSWERED**: 6-dimension composite risk model built. Phase 011 (scoring, 0.80) and 014 (pipeline, 0.78) are CRITICAL. 5 phases are HIGH risk. Top 2 phases concentrate 20% of features and 31% of unreferenced files. 5 systemic remediation recommendations produced.
- [x] Q9: Is there a pattern in which types of features get inaccurate PARTIAL corrections vs accurate ones? (audit agent reliability model) -- **ANSWERED**: Systematic verification across 5 phases (8 PARTIAL findings, 21 verifiable correction claims) shows 85.7% accuracy for file-reference corrections. 2 files NOT FOUND (memory-sufficiency.ts, spec-doc-health.ts) and 1 function name fabricated (summarizeAliasConflicts). Behavioral claims unverifiable via static analysis. The iteration 3 ~50% estimate was inflated by sampling audit *descriptions* not *corrections*.
- [x] Q10: Do the 312 unreferenced test files test catalog-documented features (just unlinked) or genuinely undocumented behaviors? (test-feature semantic alignment) -- **REFRAMED & ANSWERED as session-manager blind spot**: Session-manager (1186 lines, 26 functions) has 85% of functions (22/26) with NO direct catalog audit coverage. Only Phase 008 references it (5 mentions). It controls dedup, session state, cleanup, and continue-session -- all verified only as side effects, never as primary audit targets. Confirmed as structural blind spot mitigated by 3 dedicated test files.
- [x] Q11: What is the minimum re-audit scope to reduce all phases below 0.50 composite risk? (optimal re-audit planning) -- **ANSWERED**: 3-tier plan: (1) Systemic S1+S2 (pin SHA + cross-cutting audit, 9-13 hr) reduces all phases by 0.10-0.20; (2) 7 targeted phase re-audits T1-T7 (18-25 hr) bring all to <0.50; (3) New categories N1-N3 (8-11 hr) close structural gaps. Total minimum: 27-38 hours for target threshold.

## Answered Questions
- [x] Q1: All 32 MCP tools are fully cataloged. Infrastructure/cross-cutting modules (api/, formatters/, core/, utils/, lib/errors/, lib/utils/) are NOT cataloged (~25-35 files). The api/ directory (programmatic non-MCP API) is the single largest undocumented subsystem.
- [x] Q2: 32 of 286 source files (11.2%) never referenced by any catalog entry. Severity breakdown: 6 CRITICAL (active production pipeline code), 9 HIGH (active utilities), 8 MEDIUM (api/ layer + barrels), 5 LOW (deprecated), 4 INFORMATIONAL (tests + misc).
- [x] Q3: PARTIAL findings identify real discrepancies, BUT audit corrections contain errors in ~50% of cases verified (2 of 4). Pattern: audit agents detected real issues but fabricated "correct" answers (non-existent files like fusion-lab.ts, title-builder.ts; non-existent functions like isShadowFusionV2Enabled). MATCH boundary may also be unreliable.
- [x] Q4: 4 active production modules (attention-decay.ts, tier-classifier.ts, pressure-monitor.ts, mutation-feedback.ts) have ZERO feature catalog mentions despite being imported by core handlers. The hooks/ system (17 importers) and 3 lib/cognitive/ modules (~30KB) are structural blind spots. Per-category audit structure covers category-specific code well but cannot verify cross-cutting shared modules that no single category "owns". MATCH classifications at the feature level do not guarantee all underlying code paths were verified.
- [x] Q5: 234 of 286 .ts files (82%) modified during audit window (Mar 16-22) across 27 commits. 27 new source files added; 6 have ZERO catalog mentions (batch-learning.ts, confidence-scoring.ts, graph-calibration.ts, llm-cache.ts, recovery-payload.ts, result-explainability.ts). Zero post-audit drift. Audit ran concurrently with 4 major implementation waves. MATCH findings may have been accurate at time of verification but invalidated by subsequent commits within the same audit window.
- [x] Q6: 22 flags graduated from opt-in (OFF) to default-ON in commit 09acbe8ce (Mar 21 22:54) during the audit window. The graduation reversed behavioral semantics via isFeatureEnabled() (undefined = ENABLED). Phase 020 only audited 7 of 40+ flags. 13 pre-existing flags were unaffected (already default-ON). 4 flags remain opt-in (RECONSOLIDATION, FILE_WATCHER, RERANKER_LOCAL, QUALITY_LOOP). The audit used a moving HEAD baseline, not a pinned SHA, despite spec.md Risk R-003 calling for commit pinning.
- [x] Q7: Only 9 of 321 test files (2.8%) are referenced in any catalog phase. 312 test files are entirely absent from catalog documentation. Key unreferenced categories: 14 handler tests (MCP dispatch layer), 21 regression/safety/security tests (crash recovery, path traversal, race conditions), 31 scoring/fusion tests (ranking pipeline), 9 integration tests (cross-category pipelines), 22 memory-specific tests (systemic properties). The 97.2% test-catalog gap is structural: the catalog documents features while tests verify behaviors -- complementary but different scopes that the audit never bridged.
- [x] Q8: 6-dimension composite risk model (PARTIAL ratio, feature complexity, cross-cutting exposure, temporal churn, flag graduation, test gap) built for all 21 phases. Phase 011 (scoring-and-calibration, 0.80) and Phase 014 (pipeline-architecture, 0.78) are CRITICAL risk. 5 phases are HIGH (001, 012, 013, 015, 018). Top 2 phases concentrate 20% of features and 31% of unreferenced files. 5 systemic remediation recommendations: pin SHA, add cross-cutting audit phase, verify PARTIAL corrections, bridge test-catalog gap, catalog 32 unreferenced files.
- [x] Q9: Systematic verification of PARTIAL corrections across 5 phases shows 85.7% accuracy (18/21 verifiable file references confirmed real). Only 2 files hallucinated (memory-sufficiency.ts, spec-doc-health.ts), 1 function name fabricated (summarizeAliasConflicts). Revises iteration 3's ~50% error estimate downward -- the audit corrections are more reliable than initially assessed.
- [x] Q10: Session-manager (1186 lines, 26 functions) confirmed as structural blind spot: 85% of functions have NO direct catalog audit coverage. Only Phase 008 references it. However, 3 dedicated test files provide behavioral coverage. The risk is unverified-by-audit behavior, not untested behavior.
- [x] Q11: Minimum-cost re-audit is 27-38 hours across 3 tiers: 2 systemic interventions (pin SHA, cross-cutting audit phase), 7 targeted phase re-audits (PARTIAL re-verification + scope additions), and 3 new audit categories (cross-cutting modules, security behaviors, API layer). All 7 at-risk phases drop below 0.50 composite risk. Top 2 CRITICAL phases (011, 014) drop from 0.80/0.78 to 0.36/0.33.

## What Worked
- [Iter 1] Listing the full source tree (excluding dist/tests) and cross-referencing against catalog directory structure. The tool-schemas.ts canonical registry made tool-level gap detection definitive.
- [Iter 1] Checking catalog category subdirectories to understand scope of each category.
- [Iter 2] `comm -23` diff between actual source files and grep-extracted catalog references gave a definitive, zero-ambiguity list of unreferenced files. Inspecting file headers classified severity accurately (deprecated vs active).

## What Failed
- N/A (first iteration)
- [Iter 2] N/A -- approach was clean and complete.
- [Iter 3] N/A -- grep verification of audit corrections was definitive.
- [Iter 4] Import frequency analysis (grep -rl + uniq -c) was the right quantitative approach. Cross-referencing import counts against catalog mention counts gave a definitive measure of cross-cutting blind spots.

## What Failed
- [Iter 3] Could not verify all 9 PARTIAL findings in one iteration due to tool budget. 4 of 9 verified thoroughly; remaining 5 deferred.
- [Iter 4] N/A -- approach was well-matched to question.
- [Iter 5] N/A -- git log temporal analysis was clean and definitive.
- [Iter 6] Reading rollout-policy.ts implementation was critical for understanding the behavioral inversion (undefined = ENABLED). Direct diff of graduation commit gave definitive flag inventory.
- [Iter 7] Full cross-reference of 321 test basenames against git-committed catalog content (via `git show HEAD:$f`) gave zero-ambiguity 9/321 referenced count. Categorizing by prefix pattern revealed structural categories of undocumented test coverage. Using committed content (not working-tree files) avoided deleted-file issues.
- [Iter 8] Building composite risk model from 6 quantitative dimensions collected across iterations 1-7. Extracting MATCH/PARTIAL counts from committed implementation summaries via `git show HEAD:` and feature catalog file counts. Per-phase scoring with weighted aggregation produced clear risk tiers and actionable prioritization.
- [Iter 10] Building re-audit plan on top of quantitative risk model allowed precise composite-score-reduction projections per intervention. Systemic interventions (S1, S2) reduce risk dimensions across multiple phases, giving highest leverage. Consolidating 10 iterations into 5 core findings + 1 action plan demonstrated that synthesis is the highest-value output of a deep research cycle.

## What Failed
- [Iter 8] macOS grep lacks -P flag; had to retry with grep -o for MATCH/PARTIAL extraction. One wasted tool call but no data loss.
- [Iter 10] D6 (test gap) has no clear reduction path in the re-audit plan because the structural gap between feature catalog and test suite requires scope expansion, not re-audit. D6 remains at current levels even post-intervention. This is an inherent limitation of the re-audit approach, not a research failure.

## Exhausted Approaches (do not retry)
None -- all 11 questions answered. Research cycle complete.

## Next Focus
ALL 11 questions answered. Research is converged. Recommended: proceed to final synthesis phase to produce the canonical research/research.md output. If further iterations are dispatched, potential deep-dives include MEDIUM-risk phase analysis, deprecated file cleanup candidacy, and uncataloged new file activation status verification.

## New Discovery: Audit Correction Error Pattern
The audit agents detected real discrepancies but in ~50% of verified cases fabricated the "correct" answer instead of verifying against source code. This is a systemic quality concern affecting all 41 PARTIAL findings.

## Known Context
Prior context: None found in memory system for this topic.

Current state: The code audit has been completed across all 21 phases with ~179 MATCH, ~41 PARTIAL, 0 MISMATCH. All spec folder docs are updated and committed. The audit verified features documented in the feature catalog against source code. The primary question is: what did the audit MISS?

## Research Boundaries
- Max iterations: 15
- Convergence threshold: 0.05
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Current segment: 1
- Started: 2026-03-22T18:22:00.000Z
