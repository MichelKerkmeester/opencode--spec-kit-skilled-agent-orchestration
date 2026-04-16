<!-- SNAPSHOT: copied from 013-memory-folder-deprecation-audit/review/deep-review-strategy.md on 2026-04-15. Authoritative source at original packet. -->

# Deep Review Strategy — Memory Folder Deprecation Audit

**Session**: 013-memory-folder-audit-1776186851
**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-memory-folder-deprecation-audit`
**Review target**: `skill:system-spec-kit` + `.opencode/command/memory/*.md` command cards
**Max iterations**: 10
**Convergence threshold**: 0.10
**Dimensions**: correctness, security, traceability, maintainability

---

## Audit Question

Does any active file in `.opencode/skill/system-spec-kit/` or `.opencode/command/memory/*.md` still write to, read from, assume the existence of, or reference `[spec]/memory/*.md` files — contradicting the v3.4.0.0 changelog claim that the `memory/*.md` corpus is retired?

## Classification Rule (Applied Each Iteration)

Each grep hit classified as ONE of:
- **P0-WRITE** — Runtime code that creates `[spec]/memory/*.md` files
- **P0-READ** — Code that globs/opens/expects `[spec]/memory/*.md` files
- **P1-DOC** — Documentation claim mismatch (doc says "retired" but runtime writes, or vice versa)
- **P2-DRIFT** — Cosmetic reference (stale comment, outdated example)
- **NON-FINDING** — Valid: MCP tool name (`memory_save`), command namespace (`.opencode/command/memory/`), `_memory.continuity` key, historical changelog, archive/future/iterations

## Dimension Scope (per iteration)

| Dimension | Focus |
|---|---|
| **correctness** | Runtime write paths (P0-WRITE), read paths (P0-READ). Primary focus of iterations 1-3. |
| **security** | Is any memory/*.md path user-influenceable? Does the runtime validate paths? (Low expected findings — audit is informational.) |
| **traceability** | Doc claim vs code reality mismatch (P1-DOC). Cross-reference v3.4.0.0 changelog → save.md APPENDIX A → actual workflow.ts behavior. Primary focus of iterations 4-6. |
| **maintainability** | Does the `memory/*.md` surface create ongoing maintenance burden (duplicate-new spawning, indexer complexity, test-fixture drift)? P2-DRIFT candidates. Primary focus of iterations 7-8. |

## Known Context (from session)

- This audit was triggered by observing 14 duplicate-new `memory/*.md` files written to `012-spec-kit-commands/memory/` during a Step 11.5 verification loop on 2026-04-14
- The changelog `.claude/changelog/01--system-spec-kit/v3.4.0.0.md` explicitly claims: *"The old `memory/*.md` corpus is retired"*
- The command card `.opencode/command/memory/save.md` APPENDIX A was recently updated (this session) to state *"Standalone `memory/*.md` files are retired and the runtime rejects them"*
- BUT `workflow.ts` Step 9 still writes to `[spec]/memory/*.md` via `writeFilesAtomically` and Step 11 indexes those files as memory #N entries
- `memory-indexer.ts` line ~181 calls `vectorIndex.indexMemory({ filePath: path.join(contextDir, contextFilename) })` where `contextDir = [spec]/memory/`
- The `memory_index_scan` handler's discovery helpers explicitly exclude `memory/` directory from spec-doc discovery (`SPEC_DOC_EXCLUDE_DIRS` in `memory-index-discovery.ts:27`) — but this is an exclusion rule, not a deletion

## Expected Finding Categories (Hypotheses)

1. **workflow.ts Step 9** writes `[spec]/memory/*.md` — P0-WRITE
2. **memory-indexer.ts** indexes that file path into vector DB — P0-WRITE (downstream)
3. **file-writer.ts** `writeFilesAtomically` path construction — P0-WRITE helper
4. **save.md APPENDIX A** claims "retired and rejected" while runtime writes — P1-DOC mismatch
5. **v3.4.0.0 changelog** claims retirement — historical, NON-FINDING (changelogs frozen per spec.md §3)
6. **SKILL.md** references memory/*.md in various places — likely P2-DRIFT or P1-DOC
7. **References/**: save_workflow.md, workflows/quick_reference.md likely have stale claims — P1-DOC or P2-DRIFT
8. **Templates/**: handover.md template stays (per v3.4.0.0 intent); check for memory/*.md template references
9. **Tests**: vitest fixtures may assert memory/*.md existence — P1-DOC or P0-READ

## Executor Contract (per iteration)

- Primary: cli-codex with gpt-5.4-high in fast mode
- Fallback: cli-copilot
- Each iteration dispatch instructs the executor to focus on ONE dimension + pivots by reviewer discretion
- Each iteration writes findings to `review/iterations/iteration-NNN.md` with typed claim-adjudication packets for P0/P1

## Iteration Pivot Plan (flexible)

| Iter | Dimension | Focus | Status |
|---|---|---|---|
| 1 | correctness | `workflow.ts` + `memory-indexer.ts` + `file-writer.ts` + `memory-metadata.ts` (scripts/core) | **DONE** — 7 P0, 1 P1, 1 P2 |
| 2 | correctness | MCP handlers (`memory-index.ts`, `memory-save.ts`) + discovery helpers | **DONE** — 0 P0, 1 P1, 0 P2 (MCP layer has NO independent `[spec]/memory/*.md` write paths — fully delegates to workflow.ts) |
| 3 | **traceability** (pivoted from iter 5 per iter-2 recommendation) | `SKILL.md` + `README.md` + `v3.4.0.0` changelog + `command/memory/*.md` cross-reference — reconciliation ledger | **DONE** — 0 P0, 2 P1 (F011, F012), 1 P2 (F013) |
| 4 | traceability | `references/memory/*.md` (5 files) + `references/workflows/` subset (worked_examples, quick_reference, execution_methods) | **DONE** — 0 P0, 2 P1 (F014 save_workflow.md, F016 worked_examples.md), 1 P2 (F015 memory_system.md); 5 NON-FINDINGS (embedding_resilience, epistemic_vectors, quick_reference, execution_methods, trigger_config rolled into F013) |
| 5 | maintainability (pivoted from traceability per iter-4 closure) | Duplicate-new spawn root cause — save-side Session Deduplication contract vs runtime | **DONE** — 2 P0 (F017, F020), 1 P1 (F019), 1 P2 (F021); contract-claim-without-implementation is a NEW defect family |
| 6 | **security** (repromoted from slot 9 per iter-5 closure) | Path validation + race condition between existsSync (workflow.ts:1630) and atomic commit (file-writer.ts:187) + content-injection audit | **DONE** — 0 P0, 0 P1, 1 P2 (F022, defense-in-depth); all 4 vectors (traversal, injection, TOCTOU, containment) closed by existing guards |
| 7 | maintainability | Test fixtures + templates/ scaffolding + scripts/dist/ mirror confirmation (cross-validation sweep) | **DONE** — 0 P0, 2 P1 (F023 test-fixture-drift, F024 templates-teach-retirement-violation), 1 P2 (F025 templates/memory/README internal inconsistency); dist parity clean (F003 covers); all 4 dimensions complete |
| 8 | synthesis | Gap analysis + reconciliation ledger (7 operator-facing surfaces + test fixtures) + prioritized remediation proposal (3 paths: honor retirement / rescind claim / implement missing contract) | **DONE (r1)** — review-report.md generated; Path A was selected and executed; v3.4.1.0 shipped |
| 9 | (slot freed by iter-5 coverage) | — | — |
| 10 | (reserve) | — | — |

Convergence expected at iteration 4–6 (focused grep audit has finite surface).

### r2 Pivot Plan (14-iter dispatch, iters 3-7 complete)

| Iter | Dimension | Focus | Status |
|---|---|---|---|
| r2-1 | (reserved — r2 fix bundle pre-iter) | F001 (2 dead test files deleted), F002 (contextFilename + indexingStatus removed from WorkflowResult), F003 (Steps 8.5/8.6/CG-07/CG-07b deleted), F009 (save.md Pre-Flight Check 2 removed), F011 (v3.4.1.0 post-publish addendum), F013 (memory_system.md reframed as 2 active + 1 retired-compat) | **DONE** — pre-iter bundle |
| r2-2 | (reserved — r2 deferred-by-design decisions) | F004 + F012 (compat alias setupContextDirectory KEPT due to 5+ test consumers) | **DEFERRED BY DESIGN** |
| **r2-3** | **maintainability** | Re-audit r1's 25 findings against Path A v3.4.1.0 cutover; changelog-claim vs code-reality cross-check | **DONE** — 2 P0 (F026 phantom-render, F027 test-scripts-modules broken), 2 P1 (F028 contextFilename-test-drift, F029 compat-alias-teaching-drift), 1 P2 (F030 indexingStatus-dead-compute) |
| **r2-4** | **security** | 4-vector re-audit of post-Path A surface (path-traversal / content-injection / TOCTOU / containment) on canonical-doc + graph-metadata path | **DONE** — 0 P0, 1 P1 (F031 writeGraphMetadataFile missing-realpath regression), 2 P2 (F032 refresh-concurrency-drift, F033 retirement-transition-log-noise) |
| **r2-5** | **correctness** | Content-router 8-category coverage audit (mcp_server/handlers/memory-save.ts + lib/routing/content-router.ts) post memory/*.md fallback removal | **DONE** — 0 P0, 1 P1 (F034 hard-abort-when-implementation-summary-missing), 2 P2 (F035 handover.md-seed-friction, F036 drop-response-semantics-ambiguity) |
| **r2-6** | **traceability** | Governance (CLAUDE.md, AGENTS.md×2, Barter/AGENTS.md) + SKILL.md stale-ref sweep for deleted symbols | **DONE** — 0 P0, 0 P1, 1 P2 (F037 templates/.hashes orphan-hash); surface is CLEAN — all 5 target docs have zero stale refs |
| **r2-7** | **maintainability** | Test suite orphan-mock + fixture-drift + 8-file migration-claim verification | **DONE** — 1 P0 (F038 13-file orphan mock on memory-indexer), 1 P1 (F039 setupContextDirectory mock teaching retired layout), 1 P2 (F040 test-naming drift) |
| r2-8 | dedicated-test-execution | Run `npm run test` capture failure set (recommended) | pending |
| r2-9 | synthesis | r2 findings synthesis into v2 review-report.md updating 25-finding ledger | pending |
| r2-10-14 | remediation-validation / reserve | Post-fix regression audit if operator executes follow-up fixes | reserve |

---

## Dimension Coverage

| Dimension | Status | Iteration(s) | Notes |
|---|---|---|---|
| correctness | **complete** (scripts/core + MCP handlers + compiled dist parity confirmed) | 1, 2, (7 dist parity) | scripts/core + MCP handler surface fully audited; MCP handlers delegate — NO independent write paths. Compiled dist parity confirmed iter 7 (file-writer.js:124-267 mirrors file-writer.ts exactly; no independent drift). |
| security | **complete** (all 4 vectors: traversal, content-injection, TOCTOU, containment) | 6 | Surface closed by existing guards: slugify whitelist `[a-z0-9-]` + realpath-based containment at 2 sites + atomic `O_CREAT|O_EXCL` + machine-generated DATE/TIME. F022 (P2 defense-in-depth test-coverage gap) is the only new finding; no exploitable path. |
| traceability | **complete** (8 operator-facing retirement-claim-contradiction surfaces enumerated; half-migrated verdict fully characterised) | 1, 2, 3, 4, (5 cross-ref), (7 templates) | F008 (save.md) + F010 (INSTALL_GUIDE.md) + F011 (v3.4.0.0 changelog ×2 mirrors) + F012 (manage.md:50) + F014 (save_workflow.md) + F016 (worked_examples.md wrong-layout teaching) + F019 (save.md:520 Recovery table) + F024 (templates: context_template.md + CHK-052 across 4 checklists + scratch/README.md, iter 7). Retirement-claim-contradiction family spans 7 doc surfaces + 1 scaffolding-pipeline surface; contract-claim-without-implementation (F017/F019) is a distinct family. |
| maintainability | **complete** (save-side dedup contract characterised + test-fixture drift surfaced + templates surface cross-validated) | 5, 7 | F017 (save-side Session Deduplication entirely unimplemented: 4 fallback heuristics, 0 contract matches) + F020 (phantom frontmatter metadata keys: session_hash/dedup_status/previous_session_id/related_sessions zero producers) + F021 (pre-save overlap SHA-1 structural misalignment) + F023 (test-fixture-drift across ≥8 vitest files encoding retirement-violating contract as expected behavior) + F025 (templates/memory/README internal inconsistency, P2). All maintenance-burden surfaces surfaced. |

## r2 Running Findings (post-Path A cutover)

| Severity | Count | Weight | Contribution |
|---|---|---|---|
| P0 | 3 | 10 | 30 |
| P1 | 5 | 5 | 25 |
| P2 | 7 | 1 | 7 |
| **Total (r2)** | **15** | | **62** |

Active r2 findings:
- **F026** (P0, iter 3): `workflow.ts:1241-1442` + `template-renderer.ts:294-296,106` phantom-render — `populateTemplate('context', ...)` still runs on every save, falls through to `buildLegacyContextCompatibilityDocument`
- **F027** (P0, iter 3): `test-scripts-modules.js:1474-1526` requires deleted `file-writer` module; asserts on deleted `indexMemory` / `writeFilesAtomically` APIs
- **F038** (P0, iter 7): 13 vitest/test files orphan-mock `../core/memory-indexer` (`indexMemory` + `updateMetadataEmbeddingStatus`); module is now type-only
- **F028** (P1, iter 3): 14+ test files still read `result.contextFilename`; WorkflowResult no longer declares it — silent undefined reads
- **F029** (P1, iter 3): `setupContextDirectory` compat-alias teaching-drift in `scripts/spec-folder/README.md:109` + 14 test files mocking non-existent "contextDir" concept
- **F031** (P1, iter 4): `writeGraphMetadataFile` lacks realpath containment — defense-in-depth regression vs retired `file-writer.ts::verifyResolvedWriteTarget`
- **F034** (P1, iter 5): Content-router hard-aborts for `narrative_progress` / `narrative_delivery` / (non-L3) `decision` when `implementation-summary.md` missing; no fallback replaces retired `memory/*.md` last-resort
- **F039** (P1, iter 7): 13 test files mock `setupContextDirectory` returning `workflowHarness.contextDir`, teaching retired layout
- **F030** (P2, iter 3): `workflow.ts:1546,1747-1752` retains `indexingStatus` + `qualityResult` dead-compute
- **F032** (P2, iter 4): `refreshGraphMetadataForSpecFolder` concurrency drift (no mutex on script-side path)
- **F033** (P2, iter 4): Retirement-transition log-noise at `workflow.ts:1554,1651,1752`
- **F035** (P2, iter 5): `handover.md` seed-friction — first `handover_state` save aborts until operator manually copies template
- **F036** (P2, iter 5): `drop` category response semantics ambiguity — `targetDocPath` implies queue that doesn't happen
- **F037** (P2, iter 6): `templates/.hashes:7` orphan SHA256 for deleted `context_template.md`
- **F040** (P2, iter 7): `test-scripts-modules.js:1038-1051` T-015 tests teach deprecated-named API authoritatively

---

## r1 Running Findings (pre-Path A, for reference)

| Severity | Count | Weight | Contribution |
|---|---|---|---|
| P0 | 9 | 10 | 90 |
| P1 | 9 | 5 | 45 |
| P2 | 6 | 1 | 6 |
| **Total** | **24** | | **141** |

Active P0 findings:
- F001 — `directory-setup.ts:85` unconditional `[spec]/memory/` mkdir
- F002 — `workflow.ts:1861` `writeFilesAtomically(contextDir, files)` writes memory/*.md
- F003 — `file-writer.ts:132-254` atomic-commit leg targeting memory/
- F004 — `memory-indexer.ts:179-189` indexes memory/*.md into vector DB
- F005 — `workflow.ts:1629-1646, 1825-1848` reads memory/*.md for dedup
- F006 — `file-writer.ts:99-129` globs + reads memory/*.md siblings
- F007 — `memory-metadata.ts:322-331` reads memory/*.md for causal links
- **F017** — `save.md:685-702` Session Deduplication contract (SHA-256 fingerprint + 1h threshold + Overwrite/Append/New/Cancel prompt + frontmatter metadata) is entirely unimplemented; runtime has 4 fallback heuristics (existsSync, checkForDuplicateContent, ensureUniqueMemoryFilename, pre-save overlap) that match ZERO of the 4 contract dimensions — NEW defect family: contract-claim-without-runtime-implementation
- **F020** — `save.md:702` specifies `session_hash`/`dedup_status`/`previous_session_id`/`related_sessions[]` frontmatter keys; grep across all of scripts/ returns 3 hits total (all in test fixtures, none for dedup) — YAML contract is a phantom; NEW defect family: phantom-frontmatter-metadata

Active P1 findings:
- F008 — `save.md:551` "retired and rejected" claim contradicted by F001-F004
- F010 — `INSTALL_GUIDE.md:1055` live external-resource pointer advertises `specs/*/memory/` as current
- F011 — `v3.4.0.0.md` changelog (both `.claude/changelog/` and `.opencode/changelog/` mirrors, lines 1/14/18/30) asserts CURRENT-state retirement contradicted by F001-F007
- F012 — `.opencode/command/memory/manage.md:50` asserts "memory/*.md surface is no longer accepted by the runtime" contradicted by F001-F007
- F014 — `references/memory/save_workflow.md:254-286, 517-521` canonical-surfaces table + validation checklist exclude memory/*.md and instruct operators to verify no such artifact exists post-save (authoritative operator-facing reference)
- F016 — `references/workflows/worked_examples.md:80,136,146,214,277` teaches stale v3.3-era spec-folder layout (memory/ as canonical) AND places handover.md inside memory/ across 5 independent passages
- **F019** — `save.md:520` Recovery table row `| Duplicate session (<1h) | Warn, offer: Overwrite / Append / New / Cancel |` promises the same interactive 4-way prompt as F017 but is entirely unimplemented; gate-relevant because operators reach this surface first during post-save triage
- **F023** — vitest test suite (`slug-uniqueness.vitest.ts`, `tree-thinning.vitest.ts`, `validate-memory-quality.vitest.ts`, `artifact-routing.vitest.ts`, `handler-memory-index.vitest.ts`, `full-spec-doc-indexing.vitest.ts`, `content-hash-dedup.vitest.ts`, +phase6 migration tests) encodes the retirement-violating `[spec]/memory/*.md` contract as the expected behavior; ≥8 test files + ≥60 hard-coded `memory/*.md` path strings assert classify/extract/write/validate semantics. `full-spec-doc-indexing.vitest.ts:91-286` is internally contradictory (asserts both "returns memory" AND "rejects legacy memory" in adjacent blocks). Retirement PR requires dropping/inverting the entire test surface — stale-test-fixture-drift family
- **F024** — Level 2/3/3+ scaffolding templates teach every new spec folder the retirement-violating workflow: `templates/context_template.md:322,328` instructs `ls [spec]/memory/` + `generate-context.js`; CHK-052 "Findings saved to memory/" is a completion-gate checkbox in 4 distinct checklist files (`level_2/checklist.md:104`, `level_3/checklist.md:104`, `level_3+/checklist.md:104`, `addendum/level2-verify/checklist.md:88`) plus 3 worked examples; `templates/scratch/README.md:53,55,68` routes "important decisions" into `memory/`; `templates/memory/README.md:74` carries the lone retirement-aware phrasing — operator-facing scaffolding pipeline drives retirement-violating workflow for every new spec

Active P2 findings:
- F009 — `workflow.ts:2147` inline comment cites the falsified save.md claim
- F013 — doc-surface-vs-doc-surface inconsistency (README.md:149 + SKILL.md:659 accurately describe runtime writes; changelog + save.md + manage.md claim retirement) leaves operators unable to determine authoritative surface. Iter-4 extends evidence: `references/memory/trigger_config.md:212-214` accurately states `{spec_folder}/memory/` + `DD-MM-YY_HH-MM__*.md` pattern (matches runtime) but is unreconciled against retirement claims.
- F015 — `references/memory/memory_system.md:17,50` describes memory/*.md as "legacy" / "no longer the primary save target" — explicit legacy-compat labeling softens it below F014/F008 severity, but "no longer the primary save target" claim is still narrowly false while runtime writes the files on every save
- **F021** — pre-save overlap check (`workflow.ts:1818-1853`) is structurally misaligned with F017 contract on 4 axes (SHA-1 vs SHA-256, full-content vs topic+files+timeframe composite, no time window vs 1h threshold, advisory/fail-open vs interactive prompt) — structural-misalignment evidence; useful as remediation starting point
- **F022** — containment check at `file-writer.ts:56,156` relies on `+ path.sep` concatenation semantics; implementation is correct but lacks a vitest regression-guard fixture for sibling-prefix directories (e.g., `memory/` vs `memory-archive/`) — defense-in-depth P2, no exploitable path (iter 6 security audit)
- **F025** — `templates/memory/README.md` is internally inconsistent in retirement messaging: lines 40-61 give 5 operator-facing `generate-context.js` invocations (implying memory/ is still targeted by the save script), while line 74 states "Canonical continuity now lives in packet-local sources: `handover.md`, `_memory.continuity`, and the packet's spec docs" (claiming `memory/` is retired). Documentation-ambiguity drift — load-bearing evidence rolled up under F013 + F014 + F024; P2 tail (iter 7)

## What Worked (Iteration 1)
- Single-shot grep per scope file (6 parallel) gave complete coverage in 1 tool-call round
- Cross-checking `setupContextDirectory` caller (workflow.ts:790) against definition (directory-setup.ts:85) proved the root write path in 2 reads
- No need to dispatch codex exec — direct grep+read sufficed for 6-file surface

## What Worked (Iteration 2)
- Parallel Read of three MCP handlers + broad grep across `mcp_server/` completed in 1 round
- `SPEC_DOC_EXCLUDE_DIRS` constant (memory-index-discovery.ts:27) is the linchpin — one line of evidence ruled out the entire discovery surface
- Reading `indexMemoryFile` entry point confirmed MCP save is index-on-caller-path, no independent discovery
- Test fixture `T520-9c` (handler-memory-index.vitest.ts:160) is an in-code receipt that the system is already DESIGNED to ignore memory/*.md during scans
- Discovered second doc-surface contradiction (F010) in INSTALL_GUIDE.md via mcp_server grep sweep

## What Worked (Iteration 3)
- Parallel targeted grep across 3 large doc files (SKILL.md, README.md, v3.4.0.0.md) + 4 command cards with ONE regex pattern captured all relevant claim sites in a single round; resolved the token-overflow blocker for the >15K-token doc files without expensive paginated reads
- Reconciliation ledger table format (doc-surface → line → claim → matches-runtime → classification) is the unique value-add of a traceability iteration — point-findings alone (F008, F010) missed the half-migrated-state verdict that emerges only when surfaces are assembled
- Classifying naming-collision hits (`references/memory/`, `scripts/memory/`, `memory_save` tool name, `.opencode/command/memory/`) as NON-FINDING kept ledger noise down from ~25 grep hits to 3 actionable findings
- Rolling up 8 passage-sites across 2 mirrored changelog files into ONE finding (F011) prevented severity-weighted inflation; honest `newFindingsRatio=0.50` instead of naive 1.00 preserves convergence signal integrity

## What Worked (Iteration 4)
- Glob-first on `references/memory/*.md` and `references/workflows/*.md` to enumerate exact scope before any Read — caught that memory/ has 5 files (matching hypothesis) and workflows/ has 5 files (quickly pruned to the 3 in dispatch scope)
- Two parallel full-file Reads (save_workflow.md + memory_system.md) hit the two largest surfaces in one round; remaining 3 memory-dir files audited via grep-only because their memory/* hit counts were known-low
- Single-pattern grep across references/workflows/ caught worked_examples.md's 5 stale-layout passages in one call — avoided paginated Reads of that whole file
- Applying the classification rule mechanically (dispatch-provided P1-DOC-RETIREMENT-CLAIM vs P2-DRIFT vs NON-FINDING) let the skeptic pass be fast: only 3 of 5 reference-memory files were candidates, and 1 of 3 workflows files
- Adversarial self-check (P1 compact skeptic/referee) correctly demoted F015 from P1 to P2 (explicit legacy-compat labeling) and correctly rejected F017 (rollup to F013 evidence only) — prevented severity inflation

## What Worked (Iteration 5)
- **Three-step codepath trace** (save.md contract → workflow.ts dedup preflight → file-writer.ts sibling scan + ensureUniqueMemoryFilename → pre-save overlap) compressed the root-cause analysis to 7 tool calls by reading each artefact exactly once
- **Grep-zero-for-contract-keys** (`session_hash|dedup_status|previous_session_id|related_sessions|3600000|one hour|hourThreshold`) across scripts/ returned a 3-hit total with 100% of hits in test fixtures for unrelated time literals — single grep definitively proved F020 (phantom-metadata)
- **Disambiguating search-side vs save-side session dedup** early (MCP search pipeline's `applySessionDedup` vs save.md:685-702) prevented a category error that would have rolled F017 into a NON-FINDING; the two features share a name but are orthogonal
- **Dispatch-provided P0/P1/P2 severity frame** (dedup-contract-unhonored=P0 blocker, routed-without-gate=P1, edge-case=P2) was directly applicable and let the referee pass land within ~60s of hunter/skeptic synthesis
- **"+1 minute as emergent artefact, not deliberate route" reframing** is the load-bearing insight: the dispatch hypothesis was that dedup fired and chose "New file +1 minute" silently; the evidence is that dedup never fired because the filename had already advanced via `HH-MM` timestamp recomputation, so `existsSync` returned false. This moves F017 from "contract partially honored with wrong default" to "contract entirely unimplemented" — a higher severity class

## What Failed (Iteration 1)
- (none — audit was well-scoped and single-dimension)

## What Failed (Iteration 2)
- (none — audit reconciled MCP layer cleanly)

## What Failed (Iteration 3)
- Initial attempt to Read SKILL.md and README.md in full hit 16.7K / 15.8K token overflow — pivoted to grep-first + targeted Read(offset, limit) for critical line contexts; pattern is now established for future large-doc iterations

## What Failed (Iteration 4)
- (none — iteration was well-scoped; the dispatch-provided classification rules made decisions mechanical and fast)

## What Failed (Iteration 5)
- (none — root cause was reachable within dispatch scope; no detours required)

## What Worked (Iteration 7)
- **Three-sub-surface parallel sweep** (test fixtures + compiled dist + templates) in a single iteration: 1 parallel round of Bash (ls tests/mcp_tests/templates) + 2 parallel Greps (scripts/tests + mcp_server/tests memory/ hits) covered sub-surfaces 1+3 in tool call 1; 1 parallel round of Read(slug-uniqueness) + Bash(ls templates/memory + dist) + Grep(templates memory/*) covered remaining surfaces in tool call 2 — 7 tool calls total for 15 files audited
- **Single Grep of `CHK-052` template string** across the entire `templates/` directory returned 7 hits in 4 distinct checklist files + 3 worked examples — definitively proved F024's scaffolding-contamination thesis in one grep; same pattern that worked for F020 phantom-metadata discovery (iter 5)
- **Compiled dist parity check as negative-evidence tool**: a single Grep of `memory|contextDir` against `dist/core/file-writer.js` returned a 1:1 mirror of the source `.ts` file at the same line offsets — confirmed NO independent drift in 1 grep and 0 additional reads; efficient closure of a low-expected-finding sub-surface
- **Internal-contradiction detection via adjacent-block reading**: `full-spec-doc-indexing.vitest.ts` asserts BOTH "returns memory" (line 91-105) AND "rejects legacy memory" (line 265-286) in the same file — this internal inconsistency is load-bearing evidence for F023 because it proves the test surface is not in a coherent migration state, not merely preserving legacy behavior
- **Honest newFindingsRatio adjustment** (raw 1.00 → adjusted 0.32) acknowledged F023's continuity-of-F001-F007 character while protecting F024's full novelty weight — prevented the iteration from reading as "ran out of productive work" when it genuinely discovered a new defect family

## What Failed (Iteration 7)
- (none — three sub-surfaces closed in 7 tool calls; dispatch's "≤1 P1 + ≤2 P2" convergence target overshot by 1 P1, but the overshoot is evidence-backed and within scope)

## What Worked (Iteration 6)
- **Scope-minimal evidence collection** for a clean-surface audit: 2 parallel Reads of the slug + file-writer files + 2 Reads of the workflow.ts construction sites + 1 Read of formatTimestamp + 3 targeted greps (containment callsite, filename construction, contextDir derivation) = 10 tool calls covered the entire 4-vector security surface
- **Working inside-out** (start from the most dangerous primitive — filename construction at workflow.ts:1252, then the slug sanitizer, then the containment guards) prevented wasted reads on peripheral files
- **Dispatch-provided 4-vector frame** (traversal / injection / TOCTOU / containment) gave exhaustive coverage in ONE iteration — each vector was either exploitable (P0/P1 finding) or ruled-out with concrete evidence, no hanging "need to investigate more" threads

## What Failed (Iteration 6)
- (none — surface was narrow, clean, and closable in one pass)

## Exhausted Approaches
- `references/memory/*.md` retirement-claim vs runtime sweep — PRODUCTIVE (iter 4): 5/5 files reviewed; 2 findings (F014, F015) + 3 NON-FINDINGS (embedding_resilience, epistemic_vectors, trigger_config rolled into F013). Scope-closed.
- `references/workflows/` scope-as-dispatched (worked_examples + quick_reference + execution_methods) — PRODUCTIVE (iter 4): 1 P1 finding (F016 wrong-layout teaching) + 2 NON-FINDINGS (compiled-artifact paths only). Scope-closed for dispatch.
- Save-side Session Deduplication contract vs runtime trace (iter 5) — PRODUCTIVE: 2 P0 (F017, F020) + 1 P1 (F019) + 1 P2 (F021); NEW defect families "contract-claim-without-runtime-implementation" and "phantom-frontmatter-metadata"; scope-closed for save-side dedup surface. Test fixture assertions (slug-uniqueness.vitest.ts, session-manager.vitest.ts) NOT audited against the new gap — deferred to iter 7 (may collapse into iter 8 synthesis).
- Security 4-vector audit (iter 6): path-traversal + content-injection + TOCTOU + containment — PRODUCTIVE-CLEAN: 0 P0 + 0 P1 + 1 P2 (F022, defense-in-depth test-coverage gap). Scope-closed. Existing guards (slugify whitelist, realpath-based containment at 2 sites, atomic O_CREAT|O_EXCL, machine-generated DATE/TIME) are sufficient. No further security iterations warranted.
- Test-fixture + templates + compiled-dist cross-validation (iter 7): PRODUCTIVE — 0 P0 + 2 P1 (F023 test-fixture-drift across ≥8 vitest files, F024 templates teach retirement-violating workflow via CHK-052 + context_template.md) + 1 P2 (F025 templates/memory/README internal inconsistency). Dist parity confirmed clean (F003 covers). Three sub-surfaces scope-closed. All 4 dimensions now complete — no further single-dimension iterations warranted; iter 8 is synthesis-only.

## Productive Approaches
- Broad single-directory grep + parallel Read of handler entry points (proved MCP layer has no independent writes)
- Explicit non-finding classification when pattern-match is a caller-supplied path (caller responsibility already captured upstream)
- Parallel grep with ONE comprehensive regex across multiple large doc files + targeted Read(offset, limit) for critical line contexts (avoids token overflow on >10K files)
- Reconciliation ledger format for traceability iterations — assembles point-findings into a system-level verdict that wouldn't surface from individual P1 claims
- Glob-first scope enumeration + parallel full-file Read on the two largest docs + grep-only on the known-low-hit docs (iter 4 pattern — 3 tool calls covered 8 files)
- **Three-step codepath trace for contract-vs-runtime audits** (doc-contract → primary gate → fallback heuristics) hit root cause in 7 tool calls (iter 5 pattern) — pattern is reusable for any "documented behavior vs runtime" question
- **Zero-hit grep for contract artefacts** is a strong negative-evidence tool: when a contract names frontmatter keys or config constants, one grep across the implementation tree definitively classifies whether the contract is shipped or phantom

## Next Focus

**r1 state (archived):** iter-8 synthesis produced `review/review-report.md` recommending Path A (honor retirement). Path A was chosen and shipped as `v3.4.1.0`.

**r2 state (active, iters 3-7 complete):** 15 new findings across 4 dimensions documenting Path A cutover defects:
- 3 P0: F026 (phantom-render survives template deletion), F027 (test-scripts-modules broken), F038 (13-file orphan-mock on memory-indexer)
- 5 P1: F028 (14+ test-files silently read undefined contextFilename), F029 (compat-alias teaching-drift), F031 (writeGraphMetadataFile containment-regression), F034 (content-router hard-abort without fallback), F039 (setupContextDirectory mock teaching retired layout)
- 7 P2: F030, F032, F033, F035, F036, F037, F040 (various drift + edge-case + cosmetic)

**r2 verdict:** FAIL — 3 active P0 block next release. Path A as shipped left significant test-surface drift (13 orphan mocks + 14 broken contextFilename asserts + 1 broken CommonJS smoke-test surface) AND a new P0 behavior defect (phantom-render on every save). r2 addendum at `v3.4.1.0:166` addressed only 2 of the 15 actual r2 issues.

**r2 recommended next focus:**
- r2-8 (dedicated test-execution pass): run `npm run test` in both `scripts/` and `mcp_server/`; capture failure set; enumerate what passes-as-false-positive vs fails-outright.
- r2-9 (synthesis): consolidate r1 + r2 findings into a v2 `review-report.md` tracking closed-by-Path-A / active-post-Path-A / new-introduced-by-Path-A categories. Recommend operator execute a follow-up spec to close the 3 P0 + 5 P1.
- Operator action before r2-8: decide whether to (a) continue auditing (r2-8 through r2-14) or (b) kick off a remediation spec immediately from the r2 iter 3-7 findings. The 3 P0 are actionable without further audit.
