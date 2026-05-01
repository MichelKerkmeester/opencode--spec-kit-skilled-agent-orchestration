# Template System Consolidation Research

## 1. TL;DR

- Recommendation: **PARTIAL**. Consolidate source-of-truth behavior now; defer physical deletion of rendered level directories until parity and consumer migration are proven.
- Keep `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, and `.opencode/skill/system-spec-kit/templates/level_3+` as checked-in goldens and fallback through Phase 3.
- Use `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` as the generator and add a thin resolver in TypeScript plus a shell wrapper for runtime callers.
- Exact deletion budget for only the four rendered level directories is `25` markdown files and `4,087` LOC, not the broader approximate Phase 4 number from iteration 8.
- Consolidate the four per-level README helper docs into `.opencode/skill/system-spec-kit/templates/README.md`; exclude README files from runtime byte parity.

## 2. Recommendation

Adopt **PARTIAL** consolidation.

The implementation should distinguish source-of-truth consolidation from immediate physical deletion. The durable source surface should be `.opencode/skill/system-spec-kit/templates/core`, `.opencode/skill/system-spec-kit/templates/addendum`, `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`, resolver code, cache metadata, manifests, and cross-cutting templates such as `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/debug-delegation.md`, `.opencode/skill/system-spec-kit/templates/research.md`, `.opencode/skill/system-spec-kit/templates/resource-map.md`, and `.opencode/skill/system-spec-kit/templates/context-index.md`.

Rendered `templates/level_N` directories should remain checked in through Phase 3 because they are still active contracts for creation scripts, validators, tests, command YAMLs, runtime agent docs, and governance text. Physical deletion becomes Phase 4 only after byte parity, validator parity, path compatibility, and strict resolver behavior are green.

The recommendation rejects a no-change outcome because generation, parity gates, and resolver migration materially improve the system. It also rejects immediate full deletion because removing rendered directories before consumer migration would break direct path and content readers.

## 3. Background

The current template tree is larger than the visible four level folders. Iteration 1 measured `.opencode/skill/system-spec-kit/templates` at `86` files, `83` markdown files, and `13,115` markdown LOC. The four rendered output directories alone contain `25` markdown files and `4,087` LOC.

Those rendered directories are generated outputs, but they are also public contracts. `.opencode/skill/system-spec-kit/scripts/spec/create.sh` copies from them through `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`. `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` reads them to derive header and ANCHOR contracts. Command YAMLs and runtime agent docs cite concrete `templates/level_N` paths. Existing spec folders contain many `SPECKIT_TEMPLATE_SOURCE` and `template_source:` variants, so provenance compatibility is part of the migration, not a cleanup detail.

The project-level spec policy in `AGENTS.md` requires all file modifications to use spec-folder templates and completion verification. That makes the template system both code and governance infrastructure. The consolidation has to preserve creation behavior, validation behavior, and old packet readability.

## 4. Methodology

This synthesis uses eight prior iterations plus the gap-closing measurements from iteration 9.

Iteration 1 inventoried the template tree, mapped `create.sh` to `template-utils.sh` to rendered `templates/level_N`, and established baseline counts. Iteration 2 traced validators, header parsing, ANCHOR semantics, and provenance checks. Iteration 3 performed deterministic generation experiments and measured compose latency. Iteration 4 designed the byte-equivalence repair path and resolver API. Iteration 5 classified consumers into path, content, and deletion-safe buckets. Iteration 6 counted marker surfaces and prepared the Phase 1 punch list. Iteration 7 finalized resolver contracts and performance constraints. Iteration 8 produced the synthesis outline, ranked risk register, and two-scenario file/LOC framing. Iteration 9 closed README policy and exact per-level deletion budget.

The loop maintained externalized state in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl`, per-iteration narratives in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations`, and delta JSONL records in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas`.

<!-- ANCHOR:sources -->
Primary sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-002.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-003.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-004.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-005.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-007.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-008.md`, and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-009.md`.
<!-- /ANCHOR:sources -->

## 5. Findings for Q1-Q10

| Question | Answer | Evidence |
| --- | --- | --- |
| Q1: Can level dirs be eliminated entirely? | Not safely in one step. They are generated outputs, but also runtime, validation, command, test, and governance contracts. | Iterations 1, 2, 3, and 5. |
| Q2: What is the minimum source-of-truth set? | `core/`, used `addendum/` fragments, `compose.sh`, resolver/cache code, phase templates, cross-cutting templates, changelog templates, and retained docs in `templates/README.md`. | Iterations 1, 4, 6, and 9. |
| Q3: Generator design choice? | Extend `compose.sh` and add a thin resolver. Do not rewrite generation in TypeScript or JSON first. | Iterations 3, 4, and 7. |
| Q4: Validator migration path? | Migrate `template-structure.js` first because it reads rendered template bodies for header and ANCHOR contracts. | Iterations 2 and 5. |
| Q5: Backward compatibility? | Use tolerant marker parsing and avoid mass-rewriting old spec folders. Existing marker-bearing folders are a compatibility surface. | Iteration 6. |
| Q6: Can generated output be byte-identical? | Yes after repair, but it is not byte-identical today. Repairs must precede resolver migration. | Iterations 3, 4, and 6. |
| Q7: Performance budget? | NFR-P01 remains `<500ms`: iteration 7 measured a representative `430ms` full compose, with the broader cold compose evidence in the `430-470ms` range. This is acceptable only if the create path uses warm cache lookups and avoids per-file generator calls. | Iterations 3 and 7. |
| Q8: Main risks? | ANCHOR drift, validator breakage, generator drift, path-contract breakage, cache invalidation, marker variance, CI false positives, and rollback ordering. | Iterations 3, 4, 5, 6, and 8. |
| Q9: Recommendation? | PARTIAL. Stable from iteration 3 onward. | Iterations 3 through 9. |
| Q10: Refactor steps? | Four phases: byte parity, resolver, consumer migration, optional deletion. | Iterations 4, 5, 6, 7, and 8. |

## 6. Generator Design

Use `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` as the generator. It already owns the transformation from `.opencode/skill/system-spec-kit/templates/core` and `.opencode/skill/system-spec-kit/templates/addendum` into the four rendered level outputs.

Phase 1 should extend `compose.sh` with non-mutating output-root support, such as `SPECKIT_TEMPLATE_OUT_ROOT` or `--out-root`, so parity tests can generate into a temporary root and compare against checked-in goldens. The composer should also own legacy continuity blocks, committed ANCHOR shapes, level metadata quirks, and decision-record metadata repair. Wrapper utilities should not reintroduce numeric anchors after composer parity is fixed.

Add a TypeScript resolver with three modes:

- `path`: return a filesystem path to a resolved template file or level directory.
- `content`: return template body content for validators.
- `metadata`: return level, basename, source, cache status, and diagnostic provenance.

Add a shell wrapper exposing:

- `ensure_template_level_dir`
- `get_template_path`
- `get_template`

The resolver is not a second generator. It should call or read the generated cache, preserve the `templates/level_N` path shape inside that cache, and fall back to checked-in rendered directories until strict mode is enabled. Hash checks belong in parity tests, verify mode, and diagnostics; they do not belong in the normal `create.sh` per-file hot path.

## 7. Four-Phase Refactor Plan

| Phase | Scope | Go/No-Go Gate |
| --- | --- | --- |
| Phase 1: byte-equivalence repair | Add temp output-root support; repair legacy `_memory.continuity`; preserve committed ANCHOR spans; preserve metadata-level quirks; repair decision-record metadata; add golden parity tests. | Go only when generated runtime docs are byte-identical to checked-in goldens, excluding README files by policy. No-go if any runtime doc, ANCHOR span, or frontmatter block differs. |
| Phase 2: resolver introduction | Add TypeScript resolver and shell wrapper; generate cache with checked-in fallback; preserve cache path shape; add resolver path/content/metadata tests. | Go only when `template-structure.js` reads through resolver content mode and `create.sh` temp workspace tests pass from both generated cache and fallback. No-go if diagnostics lose the `templates/level_N` path shape. |
| Phase 3: consumer migration | Migrate `template-utils.sh`, `create.sh`, `template-structure.js`, `check-template-staleness.sh`, active tests, command YAMLs, runtime agent docs, `AGENTS.md`, and `CLAUDE.md`. | Go only when root `.opencode/skill/system-spec-kit` tests pass and strict validation samples match generated and checked-in behavior. No-go if fallback is still required for active runtime consumers. |
| Phase 4: optional deletion | Delete rendered level directories only after strict resolver mode, no active direct consumers, and a one-commit rollback path. | Go only when `rg "templates/level_"` shows no active consumers outside historical fixtures or explicitly legacy docs and resolver strict mode passes in CI. No-go if deletion cannot be reverted cleanly in one commit. |

Phase 4 should be scoped carefully. Deleting only the four rendered level directories removes exactly `25` markdown files and `4,087` LOC. Broader cleanup of examples or other generated surfaces is a separate scope and needs a separate inventory.

## 8. Backward-Compat Strategy

Existing folders should continue to validate and remain readable. Iteration 6 measured `868` unique directories containing either uppercase `SPECKIT_TEMPLATE_SOURCE` markers or lowercase `template_source:` markers. That is large enough that bulk rewriting old packets is the wrong default.

Compatibility rules:

- Accept marker variants including `SPECKIT_TEMPLATE_SOURCE`, `template_source`, `template_source_hint`, `template_source_marker`, and lowercase forms.
- Treat marker payloads as descriptive provenance, not resolver keys.
- Preserve checked-in rendered directories as fallback through Phase 2 and Phase 3.
- Preserve `templates/level_N` path shape inside the generated cache for diagnostics, old tests, and path-shape assertions.
- Do not batch-rewrite existing marker-bearing spec folders in Phase 1 through Phase 3.
- Make canonical resolver misses hard errors for runtime docs; keep fallback only for declared optional cross-cutting templates.

The phase-parent lean trio is adjacent to level generation, not a candidate for collapse. `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` and `.opencode/skill/system-spec-kit/templates/addendum/phase` should stay explicit.

## 9. Risk Register

| Risk ID | Description | Impact | Likelihood | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | ANCHOR drift changes IDs, spans, or ordering consumed by validators and memory parsers. | H | H | Gate Phase 1 on byte parity plus ANCHOR invariant tests for all runtime docs; composer owns legacy anchors. | Template consolidation implementer |
| R2 | Validator silent break occurs if `template-structure.js` reads different generated content but emits plausible contracts. | H | M | Compare checked-in and generated `template-structure.js` contracts and `validate.sh --json` behavior before consumer migration. | Validator owner |
| R3 | Generator drift remains hidden because `compose.sh` output differs from checked-in rendered templates. | H | H | Add `.opencode/skill/system-spec-kit/scripts/tests/template-rendered-parity.vitest.ts` before resolver migration. | Template consolidation implementer |
| R4 | Cache invalidation returns stale templates after source fragments, composer, or resolver code changes. | M | M | Hash `compose.sh`, resolver version, `core/**`, `addendum/**`, and relevant generation scripts; use atomic cache promotion. | Resolver owner |
| R5 | Path-contract breakage affects scripts, command YAMLs, tests, title suffixes, and diagnostics expecting `templates/level_N/file.md`. | H | M | Preserve `templates/level_N` layout inside cache and keep `resolveTemplatePath` compatibility tests. | Resolver owner |
| R6 | Marker variance causes old folders to be treated as stale or malformed. | M | H | Use tolerant provenance parsing and extract versions independently from payload names. | Compatibility owner |
| R7 | CI false positives block migration because parity tests compare temp paths, timings, or unordered diagnostics. | M | M | Normalize absolute temp paths, timing fields, and nondeterministic report fields before behavioral comparisons. | CI owner |
| R8 | Rollback ordering fails if checked-in rendered dirs are deleted before resolver strict mode is proven. | H | M | Keep rendered dirs through Phase 3; Phase 4 deletion requires strict resolver CI and a one-commit revert path. | Release owner |
| R9 | Level 3+ test fixture hardcoding keeps old `level_3+` strings and title suffixes alive after migration. | M | M | Classify fixtures as deletion-safe historical data; update only during intentional validator fixture regeneration. | Test owner |
| R10 | Canonical template missing falls through to empty-file creation in `copy_template`. | H | M | Make canonical resolver misses hard errors and keep fallback only for optional cross-cutting templates. | Runtime helper owner |
| R11 | Per-level README files leak into scaffold or parity decisions. | M | M | Consolidate README guidance into `.opencode/skill/system-spec-kit/templates/README.md`; exclude README from runtime parity. | Documentation owner |

## 10. Performance Budget

Iteration 7 closes the performance question well enough for planning. `compose.sh` remains the generator. The representative full compose measurement is `430ms`, with the broader cold all-level compose evidence sitting in the `430-470ms` range across iterations 3 and 7.

The runtime creation path should not pay that cost repeatedly. `.opencode/skill/system-spec-kit/scripts/spec/create.sh` should resolve one level directory once, then copy files from that directory. It should not run Node, shell hashing, or compose for each template file. Warm resolver behavior should be path lookup plus cheap metadata checks.

Performance requirements:

- Cold compose must satisfy NFR-P01 by staying under `500ms` for all levels.
- Warm cache resolution adds low overhead compared with current directory lookup.
- Hash verification is used in parity tests, `compose.sh --verify`, and diagnostics.
- Phase 2 should measure warm-cache overhead after implementation because current measurements cover compose cost, not the final resolver path.

## 11. Validator Migration

The blocker is `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`, not `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`.

`check-files.sh` encodes required files by level and can survive consolidation because it does not need rendered templates to decide whether `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, or `implementation-summary.md` are required. It may later move to a manifest, but that is not the deletion blocker.

`template-structure.js` reads rendered level template files to derive header and ANCHOR contracts. `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` delegates to it, so any subtle generated-output drift can change validation behavior. Migrate this helper through resolver content mode first, while preserving `resolveTemplatePath` diagnostics and the `templates/level_N` path shape.

`.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh` also reads `.opencode/skill/system-spec-kit/templates/level_1/spec.md` for the current template version. It should move to resolver path or content mode after the resolver contract exists.

## 12. Consumer Migration Map

| Consumer | Class | Migration |
| --- | --- | --- |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` | PATH | Replace internals of `get_level_templates_dir` with `ensure_template_level_dir`; keep directory output contract. |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | PATH | Resolve the level directory once before normal and subfolder copy loops. |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` | CONTENT and PATH | Use resolver content mode for contracts and preserve path mode for diagnostics. |
| `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh` | CONTENT or PATH | Read current template version from resolver output instead of hardcoded Level 1 path. |
| `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` | PATH | Add temp output-root support while keeping checked-in output as default during Phase 1. |
| `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts` and `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh` | DELETION-safe | Retire from runtime path or make maintenance-only with explicit root input after composer owns anchors. |
| `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts` | CONTENT | Treat generated cache as read-only; run frontmatter migrations against source fragments or explicit goldens. |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` and confirm variant | PATH | Replace literal level paths after resolver examples and shell wrapper exist. |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` and confirm variant | PATH | Migrate in sync with plan YAMLs after Phase 2. |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` and confirm variant | PATH | Replace with resolver-backed manifest or `get_template_path` examples. |
| `.opencode/command/create/assets/create_agent_auto.yaml` and confirm variant | PATH | Replace hardcoded Level 1 paths with resolver-backed path examples. |
| Runtime agent docs in `.opencode/agent`, `.codex/agents`, `.claude/agents`, and `.gemini/agents` | PATH | Update wording to "resolved Level-N template source" after command YAMLs migrate. |
| `AGENTS.md` and `CLAUDE.md` | PATH | Update policy language only after create and validator tooling works. |
| Active template tests | CONTENT and PATH | Add golden parity tests and migrate existing tests to resolver path/content mode. |
| Historical fixtures | DELETION-safe | Keep as compatibility evidence unless intentional fixture regeneration is part of validator parity. |

## 13. Test Suite Design

Phase 1 should add `.opencode/skill/system-spec-kit/scripts/tests/template-rendered-parity.vitest.ts`.

Required coverage:

- Generate all runtime docs into a temporary output root with `compose.sh`.
- Compare generated files against checked-in goldens under `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, and `.opencode/skill/system-spec-kit/templates/level_3+`.
- Include runtime docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, and `decision-record.md` when present.
- Exclude `README.md` by explicit policy because README files are helper documentation, not runtime templates.
- Assert exact UTF-8 byte equality.
- Compare `validate.sh --json` behavior between checked-in and generated samples after normalizing temp paths and timing fields.
- Assert ANCHOR invariants: matching open/close pairs, required order, Level 3 and Level 3+ broad `questions` spans, Level 3+ governance anchors, no duplicate opening anchors, and no new wrapper-only numeric anchors.
- Assert frontmatter invariants: one top YAML block, preserved `_memory.continuity`, committed metadata-level quirks, and repaired decision-record description.
- Test resolver path/content/metadata modes, cache fallback, strict mode, and missing canonical template hard errors.

The enforceable hook today is package-script CI, not GitHub Actions. Iteration 5 found no `.github/workflows` target in this repo. Add a targeted script in `.opencode/skill/system-spec-kit/scripts/package.json`, then include it before legacy template tests in the workspace test chain.

## 14. File/LOC Deltas

Use two metrics: markdown template surface and implementation footprint.

| Stage | Markdown files in template tree | Markdown LOC in template tree | Implementation footprint | Notes |
| --- | ---: | ---: | --- | --- |
| Today | 83 | 13,115 | Baseline | Iteration 1 full template-tree measurement. |
| Phase 1 byte parity | 83 | Approximately 13,115 | Test and composer edits | Rendered docs stay checked in. |
| Phase 2 resolver | 83 | Approximately 13,115 | About 250-300 LOC code and shell wrapper | Resolver is code, not markdown template content. |
| Phase 3 consumer migration | 83 | Approximately 13,115 | About 50-100 modified lines across consumers | Net markdown LOC roughly stable. |
| Phase 4 per-level deletion shipped | 58 | 9,028 | Resolver remains | Exact deletion of four rendered level dirs: `83 - 25 = 58`, `13,115 - 4,087 = 9,028`. |
| Phase 4 deferred | 83 | Approximately 13,115 | Resolver remains | Safer near-term steady state with improved source-of-truth behavior. |

The earlier iteration 8 broader-cleanup scenario should not be used as the exact deletion budget for the four per-level directories. It can only describe an unmeasured cleanup that also deletes or reclassifies other generated or duplicate surfaces, such as examples or helper documentation. That broader scope is future work until separately inventoried.

Per-level README policy changes the Phase 4 handling: the useful guidance from `.opencode/skill/system-spec-kit/templates/level_1/README.md`, `.opencode/skill/system-spec-kit/templates/level_2/README.md`, `.opencode/skill/system-spec-kit/templates/level_3/README.md`, and `.opencode/skill/system-spec-kit/templates/level_3+/README.md` should move into `.opencode/skill/system-spec-kit/templates/README.md` before those rendered directories are deleted.

## 15. Open Items / Future Work

- Use this final synthesis as input to `/spec_kit:plan`; the research loop has converged on PARTIAL.
- Measure resolver warm-cache overhead after implementation.
- Decide exactly when Phase 3 CI flips from fallback-allowed to strict resolver mode.
- Track historical fixtures separately from active consumers so `rg "templates/level_"` can distinguish compatibility evidence from live runtime dependencies.
- Inventory any broader duplicate-surface deletion beyond the four rendered level directories before promising additional file or LOC removal.
- Consider a TypeScript rewrite only after byte parity and resolver tests make behavior portable.

## 16. Appendix A: Graph

Iteration graph in text form:

- `.opencode/skill/system-spec-kit/scripts/spec/create.sh` sources `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`.
- `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` maps levels to `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, and `.opencode/skill/system-spec-kit/templates/level_3+`.
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh` copies rendered docs from those level directories.
- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` reads `.opencode/skill/system-spec-kit/templates/core` and `.opencode/skill/system-spec-kit/templates/addendum`.
- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` writes rendered level directories today and should write a generated compatibility cache in Phase 2.
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` delegates to `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`.
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` reads rendered level templates for header and ANCHOR contracts.
- The resolver shell wrapper feeds `.opencode/skill/system-spec-kit/scripts/spec/create.sh` and `copy_template`.
- The resolver TypeScript API feeds `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`, parity tests, and staleness checks.
- Command YAMLs and runtime agent docs migrate after the resolver path contract is stable.
- Phase 4 deletion is gated by strict resolver mode and absence of active direct consumers.

Graph event lineage from the state log:

| Iteration | Main graph node added | Meaning |
| --- | --- | --- |
| 1 | `template-root`, `create-sh`, `template-utils`, `compose-sh` | Established creation and generation chain. |
| 2 | `template-structure-js`, `check-template-headers`, `anchor-generator` | Established validator and ANCHOR dependency surface. |
| 3 | `generated-cache`, `template-utils-copy`, `create-sh-hot-paths` | Established cache design and copy-path risks. |
| 4 | `legacy-continuity-frontmatter`, `template-resolver`, `golden-parity-tests` | Established byte-parity repair and resolver direction. |
| 5 | `command-yaml-template-paths`, `template-parity-vitest`, `frontmatter-backfill` | Established consumer classes and CI gate shape. |
| 6 | `marker-compat-surface`, `phase1-punch-list`, `compose-out-root` | Established backward-compat marker scale and Phase 1 punch list. |
| 7 | `template-resolver-api`, `template-resolver-shell`, `nfr-p01-performance-budget` | Established resolver contract and performance budget. |
| 8 | `research-synthesis-outline`, `final-risk-register`, `file-loc-delta-scenarios` | Established final synthesis structure and risk framing. |
| 9 | `readme-policy`, `exact-level-deletion-budget`, `canonical-research-draft` | Closed synthesis gaps and wrote this draft. |

## 17. Appendix B: Commands Run

Representative command evidence:

```bash
sed -n '1,260p' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-008.md
```

```bash
sed -n '1,260p' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-002.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-003.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-004.md
```

```bash
sed -n '1,280p' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-005.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-007.md
```

```bash
find .opencode/skill/system-spec-kit/templates/level_1 .opencode/skill/system-spec-kit/templates/level_2 .opencode/skill/system-spec-kit/templates/level_3 .opencode/skill/system-spec-kit/templates/level_3+ -type f -name '*.md' | wc -l
```

Result:

```text
25
```

```bash
find .opencode/skill/system-spec-kit/templates/level_1 .opencode/skill/system-spec-kit/templates/level_2 .opencode/skill/system-spec-kit/templates/level_3 .opencode/skill/system-spec-kit/templates/level_3+ -type f -name '*.md' -print0 | xargs -0 wc -l
```

Result:

```text
4087 total
```

```bash
sed -n '1,180p' .opencode/skill/system-spec-kit/templates/level_1/README.md .opencode/skill/system-spec-kit/templates/level_2/README.md .opencode/skill/system-spec-kit/templates/level_3/README.md .opencode/skill/system-spec-kit/templates/level_3+/README.md
```
