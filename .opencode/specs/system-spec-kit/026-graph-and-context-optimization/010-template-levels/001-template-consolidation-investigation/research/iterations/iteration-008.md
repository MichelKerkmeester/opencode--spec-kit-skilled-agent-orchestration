# Focus

Synthesis preparation for the final `research/research.md`: a 17-section outline, consolidated risk register, concrete file/LOC delta arithmetic, and coverage check for Q1-Q10.

This iteration does not change the recommendation. The evidence from iterations 1-7 supports **PARTIAL**: repair byte parity first, introduce a resolver over generated or checked-in rendered templates, migrate consumers, and make physical deletion of rendered level directories an optional final phase.

# Actions Taken

1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md` first for the Phase 1 punch list, marker counts, and backward-compatibility policy.
2. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-007.md` for the resolver API contract, generator decision, shell wrapper design, performance budget, and consumer migration order.
3. Re-read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md` through `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-005.md` for inventory, validator, risk, and parity-gate evidence.
4. Consolidated the risk language from iterations 3-6 into one ranked table suitable for the final synthesis.
5. Calculated the file and LOC delta scenarios requested for the PARTIAL recommendation.

# Synthesis Outline for `research/research.md`

## 1. TL;DR

Purpose: Give the decision and its reason in one scan. This section should be short enough to survive being copied into a planning issue or implementation brief.

- Recommendation: **PARTIAL**.
- Do not delete `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, or `.opencode/skill/system-spec-kit/templates/level_3+` in the first implementation packet.
- Repair generated-output parity, then add a resolver and migrate consumers.
- Physical deletion is Phase 4 only if byte parity, validator parity, and path compatibility all pass.

## 2. Recommendation

Purpose: State the decision as an implementation posture, not only a label. The section should distinguish "source-of-truth consolidation" from "immediate physical deletion."

- Adopt PARTIAL consolidation.
- Keep `core/`, `addendum/`, `compose.sh`, resolver code, manifests, and cross-cutting templates as the long-term source surface.
- Keep rendered `level_N` directories as checked-in goldens and fallback through Phase 3.
- Delete rendered level directories only after one strict resolver compatibility period.

## 3. Background

Purpose: Explain why the question exists and why the current system is difficult to simplify. Keep the emphasis on public contracts rather than folder neatness.

- The template tree currently contains 83 markdown files and about 13K markdown LOC.
- The rendered level directories are generated outputs, but they are also consumed directly by creation scripts, validators, tests, command YAMLs, and governance docs.
- Existing spec folders contain many `SPECKIT_TEMPLATE_SOURCE` variants, so provenance compatibility matters.
- Phase parent templates and cross-cutting templates are adjacent contracts and should not be collapsed into level generation.

## 4. Methodology

Purpose: Summarize how the research reached its conclusion. This gives the final synthesis auditability without repeating every command transcript.

- Inventory counts came from iteration 1 template-tree scans.
- Validator and ANCHOR behavior came from iteration 2 parser and validator reads.
- Determinism, drift, and performance came from iteration 3 compose experiments.
- Repair steps, consumer migration, marker counts, and resolver design came from iterations 4-7.

## 5. Findings for Q1-Q10

Purpose: Collapse the ten research questions into evidence-backed answers. Each answer should cite the iteration that contains the detailed evidence.

- Q1, eliminate level dirs: not safely in one step; iterations 1, 2, 3, and 5 show runtime and validation dependencies.
- Q2, minimum source set: `core/`, `addendum/`, `compose.sh`, resolver/cache code, manifests, and cross-cutting templates; iteration 1 inventories the current tree and iteration 4 narrows README policy.
- Q3, generator choice: extend `compose.sh` and add a thin resolver; iterations 3, 4, and 7 reject a TypeScript rewrite or JSON-driven generator for Phase 1-3.
- Q4, validator migration: `template-structure.js` is the hard dependency; iterations 2 and 5 map the validator migration.
- Q5, backward compatibility: use tolerant marker parsing and avoid mass-rewriting old spec folders; iteration 6 gives the 868-directory marker surface.
- Q6, byte parity: deterministic generation exists, but current output is not byte-identical; iterations 3, 4, and 6 identify repair categories.
- Q7, performance: cold compose is about 430-470ms and acceptable only with cache discipline; iteration 7 closes NFR-P01.
- Q8, risks: highest risks are ANCHOR drift, validator breakage, generator drift, path-contract breakage, and cache invalidation; iterations 3-6 supply the risk base.
- Q9, recommendation: PARTIAL is stable from iterations 3-7.
- Q10, refactor steps: four phases are established across iterations 4, 5, 6, and 7.

## 6. Generator Design

Purpose: Capture the chosen implementation design before code begins. The section should make clear that the resolver is not a second generator.

- Use `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` as the generator.
- Add temp output-root support for non-mutating parity tests and cache generation.
- Add a TypeScript resolver with `path`, `content`, and `metadata` modes.
- Add a shell wrapper exposing `ensure_template_level_dir`, `get_template_path`, and `get_template`.
- Do not run per-file shell hash checks in the `create.sh` hot path.

## 7. Four-Phase Refactor Plan

Purpose: Present the implementation path with gates. Each phase should have a clear stop condition before the next phase starts.

- Phase 1: byte-parity repair in `compose.sh` and source fragments, plus golden parity tests for the 21 runtime docs.
- Phase 2: resolver introduction with generated cache, checked-in fallback, path/content/metadata modes, and resolver tests.
- Phase 3: consumer migration for runtime helpers, validators, command YAMLs, docs, and tests.
- Phase 4: optional deletion of rendered level dirs after strict parity and compatibility gates are green.

## 8. Backward-Compat Strategy

Purpose: Explain how existing spec folders and old markers keep working. This is the main guard against turning consolidation into a repository-wide migration.

- Accept marker variants including `SPECKIT_TEMPLATE_SOURCE`, `template_source`, `template_source_hint`, `template_source_marker`, and lowercase forms.
- Treat marker payloads as descriptive provenance, not resolver keys.
- Preserve checked-in rendered dirs as fallback through Phase 2 and Phase 3.
- Preserve `templates/level_N` path shape inside the generated cache for diagnostics and tests.
- Do not batch-rewrite the 868 marker-bearing spec directories in Phase 1-3.

## 9. Risk Register

Purpose: Provide the final ranked mitigation table for implementation planning. The table below is ready to copy into the synthesis.

| Risk ID | Description | Impact | Likelihood | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | ANCHOR drift changes IDs, spans, or ordering consumed by validators and memory parsers. | H | H | Gate Phase 1 on byte parity plus ANCHOR invariant tests for all 21 runtime docs; composer owns legacy anchors instead of wrapper-generated numeric anchors. | Template consolidation implementer |
| R2 | Validator silent break occurs if `template-structure.js` reads different generated content but emits plausible header or anchor contracts. | H | M | Compare checked-in and generated `template-structure.js` contracts and `validate.sh --json` behavior before consumer migration. | Validator owner |
| R3 | Generator drift remains hidden because `compose.sh` output differs from checked-in rendered templates. | H | H | Add `template-rendered-parity.vitest.ts` before resolver migration and require exact byte equality, excluding only level README files by policy. | Template consolidation implementer |
| R4 | Cache invalidation returns stale templates after source fragments, composer, or resolver code changes. | M | M | Hash `compose.sh`, resolver version, `core/**`, `addendum/**`, and relevant generation scripts; use atomic cache promotion and force-recompose diagnostics. | Resolver owner |
| R5 | Path-contract breakage affects scripts, command YAMLs, tests, title suffixes, and diagnostics expecting `templates/level_N/file.md`. | H | M | Preserve `templates/level_N` layout inside cache, keep `resolveTemplatePath` compatibility tests, and migrate command YAMLs only after shell resolver exists. | Resolver owner |
| R6 | Marker variance causes old folders to be treated as stale or malformed. | M | H | Use tolerant provenance parsing and extract versions independently from payload names; do not require payloads to map to physical template paths. | Compatibility owner |
| R7 | CI false positives block migration because parity tests compare temp paths, timings, or unordered diagnostics. | M | M | Normalize absolute temp paths, timing fields, and nondeterministic report fields before behavioral comparisons. | CI owner |
| R8 | Rollback ordering fails if checked-in rendered dirs are deleted before resolver strict mode is proven. | H | M | Keep rendered dirs through Phase 3; Phase 4 deletion requires strict resolver CI, no active direct consumers, and one-commit revert path. | Release owner |
| R9 | Level 3+ test fixture hardcoding keeps old `level_3+` strings and title suffixes alive after migration. | M | M | Classify fixtures as deletion-safe historical data; update only when fixture regeneration is an explicit validator parity change. | Test owner |
| R10 | Canonical template missing falls through to empty-file creation in `copy_template`. | H | M | Make canonical resolver misses hard errors and keep fallback only for declared optional cross-cutting templates. | Runtime helper owner |

## 10. Performance Budget

Purpose: Preserve the NFR-P01 finding for implementation. The resolver must keep creation-time cost predictable.

- Iteration 7 confirms `compose.sh` remains the generator and resolver overhead should stay low.
- Cold all-level compose measured in the 430-470ms range across iterations 3 and 7.
- `create.sh` should resolve one level directory once, not invoke Node or shell hashing per file.
- Warm cache behavior should be path lookup plus cheap metadata checks.
- Hash verification belongs in parity tests, verify mode, and diagnostics, not the normal create hot path.

## 11. Validator Migration

Purpose: Name the validator that actually blocks deletion. This prevents implementation from over-focusing on `check-files.sh`.

- `check-files.sh` encodes required files by level and can survive consolidation.
- `scripts/utils/template-structure.js` reads rendered level templates to derive header and ANCHOR contracts.
- `check-template-staleness.sh` reads `templates/level_1/spec.md` for the current template version.
- Migrate `template-structure.js` through resolver content mode first.
- Keep validator behavior comparisons in the parity gate.

## 12. Consumer Migration Map

Purpose: Summarize where the resolver must be wired. The detailed table belongs in the final synthesis appendix or body.

- Runtime helpers: `template-utils.sh` and `create.sh` use shell path mode.
- Validators: `template-structure.js` and `check-template-staleness.sh` use content/path mode.
- Tests: parity, integration, template system, phase system, and fixture tests need resolver-aware updates.
- Command YAMLs: plan, implement, complete, and create-agent prompts move after the resolver contract is stable.
- Governance docs and runtime agent docs update last.

## 13. Test Suite Design

Purpose: Define the gates that make deletion and migration evidence-based. This section should become the implementation checklist for Phase 1 and Phase 2.

- Golden byte parity for all 21 runtime docs, excluding `README.md` by explicit policy.
- Behavioral parity with `validate.sh --json` across generated and checked-in samples.
- ANCHOR invariant tests for matching open/close pairs, required order, Level 3/3+ broad `questions` spans, and Level 3+ governance anchors.
- Frontmatter normalization tests for `_memory.continuity`, metadata table quirks, and decision-record description.
- Resolver path/content/metadata tests plus cache fallback and strict-mode tests.

## 14. File/LOC Deltas

Purpose: Put concrete numbers behind the recommendation. The synthesis should show both the deferred-deletion and deletion-shipped outcomes.

- Today: 83 markdown files, about 13K LOC.
- Phase 1, byte-parity repair: 83 markdown files, about 13K LOC; code changes repair generation but do not remove rendered docs.
- Phase 2, resolver introduction: 84 files, about 13.3K LOC using the recommendation budget of one resolver addition with about 200 LOC TypeScript plus about 50 LOC shell wrapper and supporting glue.
- Phase 3, consumer migration: 84 files, about 13.3K LOC; about 50-100 lines modified across consumer call sites, with net LOC roughly stable.
- Phase 4 shipped: delete 4 level dirs, about 60 markdown files, and about 7K LOC; net becomes about 24 files and about 6K LOC.
- Phase 4 deferred: net remains 84 files and about 13.3K LOC, but source-of-truth behavior still improves through resolver and parity tests.

Arithmetic:

```text
Deferred deletion:
  83 current files + 1 resolver addition = 84 files
  ~13.0K current LOC + ~0.3K resolver/wrapper LOC = ~13.3K LOC

Phase 4 deletion:
  84 Phase 2/3 files - ~60 rendered level-dir markdown files = ~24 files
  ~13.3K Phase 2/3 LOC - ~7.0K rendered level-dir LOC = ~6.3K LOC, rounded to ~6K
```

## 15. Open Items / Future Work

Purpose: Separate real blockers from optional cleanup. This keeps the final recommendation decisive while leaving room for later simplification.

- Decide whether the four level README files stay checked in or become generated documentation.
- Measure resolver warm-cache overhead after implementation, not only raw compose time.
- Decide when Phase 3 CI should flip from fallback-allowed to strict resolver mode.
- Track legacy fixtures separately from active consumers so `rg "templates/level_"` can distinguish historical evidence from runtime dependency.
- Consider a TypeScript rewrite only after byte parity and resolver tests make behavior portable.

## 16. Appendix A: Graph

Purpose: Capture the dependency graph in text form. This should make the final synthesis easy to inspect without loading a graph tool.

- `create.sh` -> `template-utils.sh` -> rendered `templates/level_N`.
- `check-template-headers.sh` -> `template-structure.js` -> rendered `templates/level_N`.
- `compose.sh` -> generated cache -> resolver API.
- resolver shell wrapper -> `create.sh` and `copy_template`.
- resolver TypeScript API -> `template-structure.js`, parity tests, and staleness checks.

## 17. Appendix B: Commands Run

Purpose: Preserve command evidence without bloating the main narrative. The final synthesis should list representative commands and point to iteration files for full detail.

- Iteration 1: template inventory and consumer-chain grep/read commands.
- Iteration 2: validator, ANCHOR parser, and fixture grep/read commands.
- Iteration 3: temp compose experiment, byte diff, and timing commands.
- Iteration 6: marker count commands for `SPECKIT_TEMPLATE_SOURCE`, `template_source:`, and unique marker-bearing directories.
- Iteration 7: resolver contract and performance re-check commands.

# File and LOC Delta Numbers

The recommendation needs two budget views because Phase 4 is optional.

| Stage | Files | LOC | Delta from today | Notes |
| --- | ---: | ---: | --- | --- |
| Today | 83 | ~13.0K | Baseline | Current markdown template tree. |
| Phase 1 byte parity | 83 | ~13.0K | 0 files, roughly 0 net markdown LOC | Same rendered docs stay checked in. |
| Phase 2 resolver | 84 | ~13.3K | +1 file, +~0.3K LOC | Resolver plus shell wrapper budget. |
| Phase 3 consumer migration | 84 | ~13.3K | 0 file change, ~50-100 modified lines | Call sites change, net LOC roughly stable. |
| Phase 4 deletion shipped | ~24 | ~6.0K | -~59 files, -~7K LOC from baseline | Delete rendered level dirs after gates. |
| Phase 4 deferred | 84 | ~13.3K | +1 file, +~0.3K LOC from baseline | Safer near-term steady state. |

The prompt models deletion as "delete 4 level dirs, about 60 markdown files, about 7K LOC." Using that scenario:

```text
83 current files -> 84 after resolver -> about 24 if Phase 4 deletes about 60 files.
~13.0K current LOC -> ~13.3K after resolver -> about ~6.3K, rounded to ~6K, after deleting about 7K LOC.
```

Iteration 1 measured the per-level output dirs alone at 25 markdown files and 4,087 LOC, while the prompt's final recommendation budget uses a broader rendered/deletion surface of about 60 markdown files and about 7K LOC. The synthesis should document both if it wants strict auditability: 25 files/4,087 LOC is the directly measured level-output subset; about 60 files/about 7K LOC is the proposed Phase 4 deletion scenario if all rendered-level duplication and related generated surfaces are removed.

# Coverage Check for Q1-Q10

| Question | Status | Evidence location | Gap for iterations 9-10 |
| --- | --- | --- | --- |
| Q1: Can level dirs be eliminated entirely? | ANSWERED | Iterations 1, 2, 3, 5 | No gap; final synthesis should say "not safely in one step." |
| Q2: What is the minimum source-of-truth set? | NEARLY ANSWERED | Iterations 1, 4, 6 | Clarify level README policy in final synthesis. |
| Q3: Generator design choice? | ANSWERED | Iterations 3, 4, 7 | No gap; choose `compose.sh` plus resolver. |
| Q4: Validator migration path? | ANSWERED | Iterations 2, 5 | No gap; lead with `template-structure.js`. |
| Q5: Backward compatibility for existing folders? | ANSWERED | Iterations 4, 6 | No gap; tolerant markers and no bulk rewrite. |
| Q6: Can generated output be byte-identical? | ANSWERED | Iterations 3, 4, 6 | No gap; possible after repairs, not true today. |
| Q7: Performance budget? | ANSWERED | Iterations 3, 7 | Warm-cache overhead still needs implementation measurement, but recommendation is not blocked. |
| Q8: Risks and mitigations? | ANSWERED | Iterations 3, 4, 5, 6 and this iteration | No gap; use consolidated register above. |
| Q9: Recommendation? | ANSWERED | Iterations 3, 4, 5, 6, 7 and this iteration | No gap; PARTIAL is stable. |
| Q10: Refactor steps? | ANSWERED | Iterations 4, 5, 6, 7 and this iteration | No gap; use four-phase plan. |

# Findings

## f-iter008-001: Final recommendation remains PARTIAL

The evidence supports source-of-truth consolidation without immediate physical deletion. The rendered level directories should remain checked-in goldens and fallback through Phase 3 because they are still part of the path, validator, test, and command-contract surface.

## f-iter008-002: The final synthesis should be organized around migration gates

The clean final narrative is not "remove duplication" but "prove parity, add resolver, migrate consumers, then optionally delete." That ordering preserves the current validator and `create.sh` behavior while giving the implementation a measurable exit path.

## f-iter008-003: Risk register should rank ANCHOR drift, validator breakage, generator drift, and path-contract breakage highest

These risks have the highest combined impact and likelihood because they affect behavioral contracts, not only file layout. Cache invalidation, marker variance, CI false positives, rollback ordering, and fixture hardcoding are real but easier to mitigate once parity tests exist.

## f-iter008-004: File and LOC deltas need two scenarios

If Phase 4 is deferred, the near-term state is 83 files to 84 files and about 13K LOC to about 13.3K LOC. If Phase 4 ships after all gates, the target is about 24 files and about 6K LOC using the prompt's deletion budget.

## f-iter008-005: All ten questions are answered or nearly answered

The only synthesis gap is policy wording for the four level README files and the distinction between directly measured per-level output LOC versus the broader Phase 4 deletion budget. Neither gap changes the recommendation.
