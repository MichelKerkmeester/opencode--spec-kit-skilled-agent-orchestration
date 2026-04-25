# Iteration 12: F15 Closure — 12-Gate Regression-Category Matrix + F37 #7 Archaeology

## Focus

F15 has been the longest-running open finding in this packet (originated iter 3 with
Cat A/B/C leakage taxonomy, partially expanded iter 6 and iter 11). This iteration
produces the **authoritative closure deliverable**: a per-gate matrix mapping each of
the 12 gates in `gate-bundle.ts` to the regression class it catches, the class it
misses, scope adequacy, and inter-gate dependencies. Plus a concrete enhancement for
every "missed" classification.

Secondary track: git-log archaeology on `lib/promotion/` to determine whether F37 #7
("dead promotion module") should be remediated as **wire-it-up** or **delete dead
code**.

## Actions Taken

1. End-to-end read of `lib/promotion/gate-bundle.ts` (185 LOC, full file).
2. `git log --all` on `lib/promotion/` directory → 3 commits identified.
3. Full body read of the two most informative commit messages (`5696acf4a6` feat,
   `97a318d83b` 21-finding remediation).
4. Production call-site grep for `evaluatePromotionGateBundle`,
   `writeGateBundleAuditArtifact`, `runShadowCycle`, `enforceWeightDeltaCap`,
   `semantic-lock`, `promotion/rollback`, and `two-cycle-requirement` across the
   skill-advisor TS sources, excluding `dist/` and `.vitest.ts` files.
5. Cross-reference iter 3 F15 Cat A/B/C, iter 6 F13/F14, iter 11 F37-v2 against the
   line-numbered gates list to build the matrix.

## Findings

### F15-CLOSURE — 12-Gate Regression-Category Matrix (authoritative)

The 12 gates in `gate-bundle.ts` are listed below with line numbers, the regression
class each is **designed to catch**, the class each **misses** (mapped to iter 3
Cat A/B/C + new gaps surfaced this iter), scope adequacy, and dependencies on other
gates. All line references are to
`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`.

| # | Gate name | Lines | Catches | Misses (category) | Scoped properly? | Depends on | Enhancement |
|---|-----------|-------|---------|-------------------|------------------|------------|-------------|
| 1 | `full-corpus-top1` | 91-96 | Aggregate top-1 accuracy regression below 75% absolute floor on 200-prompt corpus | **Cat B** (oscillation): scalar accuracy hides per-skill variance; a candidate flipping 10% of prompts cycle-over-cycle but landing above 75% mean passes identically to a stable candidate. **Cat A** (correlated micro-perturbations): a 4-lane L2=0.098 drift that nets +0.5pp accuracy passes, with no per-lane attribution check here. | Partial — has absolute floor but no variance/std-dev metric and no per-lane decomposition. | Two-cycle-requirement (iter 6 F13) gates whether a single passing run can promote at all. | Add a sibling gate `full-corpus-stability` that runs the corpus twice with different seeds and asserts `\|accuracy_run1 - accuracy_run2\| <= 0.02`. Insert at line 96. |
| 2 | `stratified-holdout-top1` | 97-102 | Generalization to held-out 40-prompt slice below 72.5% — catches train/test leakage and overfitting to corpus prompts | **Cat B** (oscillation): same scalar-mean blindness as #1 but on a smaller (n=40) sample, so high-variance skills are even more likely to pass by chance. **Coverage gap:** 40 prompts is below the n>=100 rule-of-thumb for stable accuracy CIs at the 0.025 resolution claimed by the gate (`>=72.5%`); a single misclassified prompt = 2.5% accuracy delta. | No — sample size is too small for the threshold's claimed precision. | Independent of other gates. | Add CI bound: gate passes iff `holdoutAccuracy - 1.96*sqrt(p*(1-p)/40) >= 0.725`. Insert at line 101. |
| 3 | `unknown-count-ceiling` | 103-108 | Schema integrity / scorer crashes — UNKNOWN means "scorer returned no decision", capped at 10 to bound silent-failure surface | None for its intended class; **boundary issue:** ceiling is hardcoded `<=10` (line 105) — not a baseline-relative check. A candidate that introduces 10 new UNKNOWNs while the baseline had 0 still passes, masking a real regression in scorer determinism. | Partial — uses absolute ceiling instead of `<= baselineUnknownCount`. | None. | Change `input.fullCorpus.unknownCount <= 10` to `input.fullCorpus.unknownCount <= input.fullCorpus.baselineUnknownCount` and add `baselineUnknownCount: number` to `PromotionGateBundleInput.fullCorpus` (lines 25-30). |
| 4 | `gold-none-false-fire-no-increase` | 109-114 | Specificity regression — candidate fires advisor recommendations on prompts where gold label is "none" (no skill needed). Baseline-relative comparison. | **Cat B** (oscillation): boolean comparison `<=` discards magnitude. A candidate that goes from 8 → 50 false-fires fails, but 8 → 8 (identical baseline) passes even if the 8 are now on completely different prompts (drift). | Partial — has baseline-relative check (better than #3) but no Jaccard/IoU on which prompts are misfiring. | None. | Add a sibling gate `gold-none-false-fire-stability` requiring `\|setdiff(candidate, baseline)\| / \|union\| <= 0.25`. Insert at line 114. |
| 5 | `explicit-skill-top1-no-regression` | 115-120 | Hard regression on prompts that explicitly invoke a skill by name (e.g. "use sk-git" → top-1 must be sk-git). Catches lane-specific weight collapse. | **Cat A** (correlated micro-perturbations): gate is `=== 0` regression count — strict — but `paritySlices.explicitSkillTop1Regressions` is delivered pre-aggregated as a single integer. There is no per-skill breakdown surfaced into the gate, so a single integer of 0 hides whether the underlying skill-by-skill accuracies oscillated. | Yes for the headline metric; **no** for the underlying correlated-drift signal. | Independent. | Extend `paritySlices` schema with `explicitSkillTop1RegressionsByLane: Record<string, number>` and add gate `explicit-skill-top1-no-lane-correlated-drift` checking `max(values) - min(values) <= 1`. Insert at line 120. |
| 6 | `ambiguity-stability` | 121-126 | Top-2 candidate set stability for ambiguous prompts (e.g., "review code" → either sk-code-review or sk-code-opencode). Catches tie-breaking-rule changes. | **Cat B** + magnitude-blindness — `paritySlices.ambiguityStable` is a **boolean** delivered pre-aggregated. The gate is fundamentally type-boolean (iter 3 confirmed line 123 magnitude-blind). A flip from "stable on 95% of ambig prompts" to "stable on 80%" passes identically to "stable on 100%" if the upstream classifier rounds up to `true`. | **No** — magnitude-blind by construction at line 123. | Depends on whatever upstream module computes `ambiguityStable` (TBD; not in this file). | Replace boolean with `ambiguityStableFraction: number`; gate becomes `>= 0.95`. Lines 49-56 (input schema) + 121-126 (gate body). |
| 7 | `derived-lane-attribution-required` | 127-132 | Audit-trail completeness — every derived-lane recommendation must carry a `derivedFrom` provenance pointer | Boolean check (line 129) — same magnitude-blindness as #6. **Cat C** (silent failure): if attribution computation throws and upstream catches & defaults to `true`, the gate passes silently. | **No** — magnitude-blind + no fail-closed semantics on upstream throw. | Independent. | Replace boolean with `derivedLaneAttributionCoverage: number` (fraction of derived-lane outputs with attribution). Gate: `>= 1.0` (strict, no rounding). Lines 49-53 + 127-132. |
| 8 | `adversarial-stuffing-rejection` | 133-138 | Prompt-injection / instruction-stuffing attempts must be rejected, not used to score | Boolean check (line 135). **Cat C** (silent failure): same as #7 — if the adversarial harness throws, defaulting to `true` masks the failure. **Coverage gap:** "instruction-shaped stuffing" is a single class; harness should test ≥3 known-bad patterns and assert all rejected. | **No** — boolean, single pattern. | Depends on harness implementation (out of file). | Replace boolean with `stuffingRejectionRate: number` over a corpus of ≥10 adversarial prompts. Gate: `=== 1.0`. Lines 54-56 + 133-138. |
| 9 | `safety-regression-no-increase` | 139-144 | Baseline-relative safety regression count (toxicity, PII leakage, etc.) — passes iff candidate ≤ baseline. | **Cat B** (oscillation): same set-membership blindness as #4 — same count on different prompts passes. | Partial — baseline-relative but count-only. | None. | Add `safety-regression-set-stability` checking Jaccard on which prompts regress. Insert at line 144. |
| 10 | `latency-no-regression` | 145-152 | Cache-hit p95 ≤ 50ms AND uncached p95 ≤ 60ms AND no regression vs baseline (when supplied) | **Cat A** (correlated micro-perturbations): p95-only — p99/p99.9 tail latency not gated. A candidate that makes the slow tail much slower while keeping p95 stable passes. **Optional baseline:** lines 83-88 — if `baselineCacheHitP95Ms === undefined`, the regression check short-circuits to `true`. Silent-degraded path: missing baseline = no comparison. | **No** for tail latency; **No** for missing-baseline behavior (should fail-closed, not pass). | None. | (a) Add `cacheHitP99Ms` and `uncachedP99Ms` with thresholds 100ms / 120ms. (b) Change `baselineCacheHitP95Ms === undefined → true` to `=> false` (fail-closed). Lines 38-43 + 82-88 + 145-152. |
| 11 | `exact-parity-preservation` | 153-159 | Strict regression check on Python-correct prompts: `regressions === 0` AND `preservedPythonCorrect === pythonCorrect` | None for its strict class — this is the **strongest** gate in the bundle. **Coverage gap:** scope is limited to "Python-correct prompts" (the 120 prompts the legacy Python scorer got right). Says nothing about prompts where Python was wrong and TS is now also wrong differently. | Yes within scope; coverage of TS-only-correct prompts is out of scope of this gate. | None. | Out of scope for F15; flag as F15b for future iter. No enhancement to this gate. |
| 12 | `regression-suite` | 160-167 | P0 pass-rate `=== 1.0` AND failed cases `=== 0` AND command-bridge FP rate `<= 0.05` — three sub-checks ANDed | **Cat C** (silent failure): three sub-checks with one failure surfaces only as a single `fail` status; `measured` string at line 166 includes all three numbers, but the gate name itself does not disambiguate which sub-check failed for downstream telemetry / dashboards. | Partial — strict thresholds but no granular pass/fail attribution. | None. | Split into 3 sibling gates: `regression-suite-p0`, `regression-suite-failed-cases`, `regression-suite-command-bridge-fp`. Lines 160-167. |

**Summary of category coverage across 12 gates:**

| Category | Caught by | Missed by | Net coverage |
|----------|-----------|-----------|--------------|
| **Cat A** (correlated micro-perturbations past per-lane 0.05 cap) | Partially by #5 (single integer) | #1, #5, #10 | **Leaks** — no L1/L2 vector check anywhere in the bundle. Closure requires a new gate `weight-vector-l2-delta-cap` (out of this file; sits in `weight-delta-cap.ts`). |
| **Cat B** (oscillating skills via magnitude-blind boolean accumulator) | Partial floor by #1, #2 | #1, #2, #4, #6, #9 | **Leaks** — no per-skill variance/CI check. Closure requires variance gates for #1 and #2. |
| **Cat C** (silent post-rollback cache-invalidation failures) | None — out of bundle scope | #7, #8, #10, #12 | **Leaks** — gate-bundle has no rollback-effectiveness gate. Closure requires importing from `rollback.ts` (iter 3 finding: `rolledBack === true` regardless of `cacheInvalidated`). |

**Inter-gate dependency analysis** (the toothlessness question from dispatch context):

- The 12 gates in this file are **logically independent** — each is a pure
  predicate over the input struct, no cross-gate references.
- **External dependency:** the entire bundle is meaningful only if invoked **after**
  two consecutive shadow cycles passed (iter 6 F13 — `two-cycle-requirement.ts`).
  The bundle does not check this itself. If a caller invokes
  `evaluatePromotionGateBundle` after 1 passing cycle, the bundle answers truthfully
  for that single cycle's data, but the two-cycle stability invariant is not
  enforced here.
- **Crucial missing gate:** there is no `two-consecutive-passes-confirmed` gate in
  this bundle. The two-cycle rule is enforced by an entirely separate caller
  (`two-cycle-requirement.ts`). If that caller is bypassed, every gate in this file
  is **toothless** in the sense that a single-shot run can pass them all.
  Recommended enhancement: add gate #13 `two-cycle-confirmation-required`
  consuming `input.shadowCycleHistory: ShadowCycleResult[]` and asserting
  `.length >= 2 && all(passed)`.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:1-185`
+ iter 3 F15 Cat A/B/C
+ iter 6 F13/F14
+ iter 11 F37-v2 §3]

### F37-#7-RESOLUTION — Git-log archaeology resolves to "delete dead code", not "wire it up"

`git log --all --oneline -- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/`
returns exactly 3 commits, in reverse-chrono order:

1. `a663cbe78f fix(027): scan-findings Themes 2-7 — 34 findings closed` — does not
   touch `gate-bundle.ts` (verified by absence in commit body). Generic theme sweep.
2. `97a318d83b fix(027): remediate 21 post-implementation deep-review findings` —
   the body explicitly references `gate-bundle.ts` under section "Promotion gate
   bundle §11 slices (R1-P1-002): Added UNKNOWN≤10, gold-none no-increase,
   explicit-skill no-regression, ambiguity stability, derived-lane attribution,
   adversarial-stuffing rejection gates". This is the commit that grew the bundle
   from 7 → 12 gates. **Author intent: harden the gates, not wire them in.**
3. `5696acf4a6 feat(027/006): promotion gates + shadow-cycle harness + seven-gate
   bundle` — the original commit. Body says "Promotion infrastructure under
   mcp_server/skill-advisor/" and lists 7 sibling files with role descriptions.
   Self-test results are claimed (Full corpus 80.5%, holdout 77.5%, etc.) but the
   commit body explicitly notes:
   > "Known carry-over: Gate 7 (skill_advisor_regression.py P0 pass-rate = 1.0)
   > fails with 2/12 P0 failures (P0-CMD-002, P0-CMD-003) — ... PRE-EXISTING on
   > main prior to Phase 027 and live in a path that is out-of-scope for 006 per
   > the authority boundary."

**Production call-site analysis:**

```
$ grep -rn "evaluatePromotionGateBundle\|writeGateBundleAuditArtifact" \
    --include="*.ts" .opencode/skill/system-spec-kit/mcp_server/skill-advisor/ \
    | grep -v /dist/ | grep -v ".vitest."
(zero results)
```

`evaluatePromotionGateBundle` is invoked **only by `tests/promotion/promotion-gates.vitest.ts`**.
Zero production call sites. The function exists, has 17 unit tests, has been
hardened from 7 → 12 gates by R1-P1-002, but is never invoked by any orchestrator,
handler, or scheduled job in the production path.

Adjacent modules (sanity check):
- `runShadowCycle` IS used by 3 bench scripts (`bench/corpus-bench.ts`,
  `bench/safety-bench.ts`, `bench/holdout-bench.ts`). That's manual / CLI-only,
  not a scheduled production pipeline.
- `enforceWeightDeltaCap`, `semantic-lock`, `promotion/rollback`,
  `two-cycle-requirement` — none referenced by production code (per the same
  grep, expanded). All are test-only or bench-only.

**Intent reconstruction:** Commit `5696acf4a6` reads as a **complete-but-unwired
infrastructure landing**. The commit author shipped the full machinery (7
modules + 17 tests + 4 bench scripts + Zod schemas) and self-tested it on the 003
baseline weights, but did **not** wire any caller. The follow-up commit
`97a318d83b` then hardened the bundle to 12 gates **without adding callers** —
which means the dead-code state is not an accident but a deliberate "ship the
machinery, wire it later" choice that has now persisted ≥2 commits.

**No feature flags found** — there is no env var, config flag, or build-time guard
gating the wiring. It is simply uncalled.

**No TODO/FIXME markers** — confirmed iter 11. Nothing in source comments points
toward a planned wire-up.

**Resolution for F37 #7:** the dead-code finding is **legitimate dead code**, not
a feature-flagged rollout, not an aborted experiment, and not a TODO. The
commits show two opportunities to wire it up (the original `feat` and the
21-finding remediation) and **neither did**. The deep-review packet should
classify F37 #7 as **delete dead code** OR **explicitly schedule a wire-up
sub-phase with an owner and a deadline**. Continuing to leave it shipped-but-
uncalled accumulates audit surface and creates a misleading test-coverage signal
(17 promotion-gate tests pass while zero production code path is exercised).

[SOURCE: `git log --all` output above
+ commit body of `5696acf4a6` and `97a318d83b`
+ grep evidence with zero production call sites
+ iter 11 F37-v2 (TODO/FIXME-zero)]

## Ruled Out

- **Hypothesis: gate-bundle is wired via dynamic require/import or a string-
  resolved path.** Ruled out: grep across the whole `mcp_server/skill-advisor/`
  tree (excluding `dist/` and `.vitest.ts`) returns zero hits for the export
  symbol or for any string `'gate-bundle'`. Dynamic resolution is not the
  explanation.
- **Hypothesis: gate-bundle is invoked from a sibling skill or top-level script
  outside `mcp_server/skill-advisor/`.** Ruled out: the import path
  `lib/promotion/gate-bundle.js` is package-local; no caller outside the package
  could resolve it without a published export, and `package.json` does not list
  `lib/promotion/` exports.
- **Hypothesis: F15 needs more leakage categories beyond Cat A/B/C.** Provisionally
  ruled out for closure. The 12-gate matrix above maps every gate cleanly to one or
  more of A/B/C plus three new minor gaps (CI bounds on n=40 sample for #2,
  baseline-relative ceiling for #3, fail-closed semantics for #10's optional
  baseline). The minor gaps are sub-cases of A/B/C, not a fourth category.

## Dead Ends

- The "is the two-cycle rule wired into the gate bundle?" question definitively
  resolves to **no**. There is no mention of `consecutivePasses`, `twoCycle`, or
  `shadowCycleHistory` in `gate-bundle.ts` (verified by full file read).
  Promote to strategy.md exhausted approaches: "looking inside `gate-bundle.ts`
  for two-cycle enforcement".

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:1-185` (full read)
- `git log --all --oneline -- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/`
- `git log --all --format=%H%n%s%n%b -- .opencode/.../gate-bundle.ts` (full bodies of `5696acf4a6` and `97a318d83b`)
- `grep -rn "evaluatePromotionGateBundle\|writeGateBundleAuditArtifact"` (production call-site sweep)
- `grep -rn "shadow-cycle\|two-cycle-requirement\|weight-delta-cap\|semantic-lock\|promotion/rollback"` (sibling module call-site sweep)
- iter 3 narrative: F15 Cat A/B/C taxonomy
- iter 6 narrative: F13 (boolean accumulator), F14 (magnitude-blind)
- iter 11 narrative: F37-v2 consolidated dead-code table

## Assessment

- New information ratio: **0.65** (5 of 5 findings substantively new: matrix is novel
  authoritative deliverable; F37 archaeology resolves the wire-it-up-vs-delete
  question definitively; "no two-cycle gate inside the bundle" dependency finding
  is new; CI-bound gap for n=40 holdout is new; fail-closed gap for optional latency
  baseline is new — only the Cat A/B/C taxonomy itself is recapped, not new)
- Questions addressed: F15 closure deliverable; F37 #7 wire-up-vs-delete decision
- Questions answered:
  - **F15: yes — closed via the 12-row matrix.** Three categories leak; each gate's
    miss-class is now mapped with a concrete enhancement and line numbers.
  - **F37 #7: yes — closed as "delete dead code or schedule explicit wire-up
    sub-phase".** No feature flag, no TODO, two missed wire-up opportunities, zero
    production callers across all 7 promotion modules.

## Reflection

- **What worked:** Reading the file end-to-end before building the matrix surfaced
  two new gaps (n=40 CI bound on #2; fail-closed semantics on #10 optional
  baseline) that prior iterations had not noticed because they had only spot-read
  specific lines. End-to-end reads at iteration 12 still produce new findings —
  the plateau in newInfoRatio (0.50-0.55 across iters 7-11) was partly an
  artifact of spot-reading rather than full-file reads.
- **What did not work:** Initial plan was to grep for "is gate-bundle wired" by
  searching for the symbol in `package.json` exports — but `package.json` lists
  the whole `mcp_server/skill-advisor/` as a private workspace package with
  default exports, so that grep was uninformative. Switching to a TS-source grep
  with `dist/` + `.vitest.` exclusions gave the clean answer immediately.
- **What I would do differently:** For F15-style deep-mechanism findings, build
  the line-numbered matrix first and then iterate on the descriptions, rather
  than describing leakage paths in prose first and trying to retrofit line
  numbers. The matrix format compressed five iterations of prose discussion into
  one canonical table.

## Recommended Next Focus

Two candidates for iter 13:

1. **F15 enhancement implementation track:** the matrix produces 13 concrete
   enhancements (12 per-gate + 1 cross-gate `two-cycle-confirmation-required`).
   Iter 13 could draft a minimal-diff TypeScript patch implementing the highest-ROI
   3-4 enhancements (likely #1 stability gate, #6/#7 boolean → fraction conversion,
   #10 fail-closed baseline) and ship it as a sub-phase remediation.
2. **F37 #7 decision track:** turn the archaeology into a 1-page decision memo
   recommending delete-vs-wire-up. The matrix above already supplies the evidence
   block; iter 13 would need to draft the recommendation, audit blast radius
   (which tests would need updating if we delete), and propose a sub-phase title.

Strategy hint: track 2 (delete decision) is a cleaner closure for this packet's
research scope; track 1 (enhancement implementation) is implementation work that
should land in a separate sub-phase, not in the research packet. Recommend
**track 2** for iter 13.
