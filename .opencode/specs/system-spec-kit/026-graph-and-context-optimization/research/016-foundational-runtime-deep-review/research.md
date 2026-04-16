# Foundational Runtime Deep Review -- Canonical Research Narrative

> **Packet:** `026-graph-and-context-optimization/016-foundational-runtime-deep-review`
> **Execution span:** 2026-04-16T16:12:22Z -- 2026-04-16T19:17:00Z (50 iterations + FINAL synthesis)
> **Dispatcher:** cli-copilot gpt-5.4 high (manual wave dispatch, not `/spec_kit:deep-research` skill loop)
> **Scope:** 19 candidate files across packets 002, 003, 005, 008, 010, 014 (foundational runtime, under-audited by Phase 015)
> **Findings:** 137 raw / ~63 distinct / 4 P0 composites / ~33 P1 distinct / ~30 P2 distinct
> **Authoritative companion:** `FINAL-synthesis-and-review.md` (1042 lines)

This document is the canonical narrative synthesis of the 50-iteration research run. It is intended for future consumers (Phase 017 planners, remediation engineers, cross-phase auditors) who want the full reasoning without reading all 50 iteration files. For the terse action-oriented version, read `FINAL-synthesis-and-review.md`. For structured data, read `findings-registry.json`.

---

## 1. Executive summary

### 1.1 What we set out to do

Phase 015 ran a 120-iteration deep review across 920 files but concentrated its audit pressure on packets 009 (validation-infrastructure), 010 (retrieval-observability), 012 (intake-reconsolidation), and 014 (reconsolidation-bridge). The 026 train's earlier foundational packets -- 002 (cache-warning-hooks), 003 (memory-quality-remediation), 005 (code-graph-upgrades), and 008 (cleanup-and-audit) -- received meaningfully less scrutiny despite anchoring high-leverage runtime seams: session lifecycle, hook state, trust-vocabulary emission, graph-metadata migration, save-time reconsolidation, post-insert enrichment, and skill routing.

A copilot gpt-5.4 deep-dive on 2026-04-16 surveyed the 026 codebase and identified 19 foundational-runtime candidates (7 HIGH, 8 MEDIUM, 4 LOW) along with 4 cross-cutting systemic themes. The dive also flagged these candidates as under-scrutinized relative to their blast radius. Phase 016 exists to close that gap: run a 50-iteration deep research pass on the 4 systemic themes (silent fail-open, state contract honesty, concurrency/write coordination, stringly-typed governance) plus a transversal Domain 5 (test coverage gaps), producing actionable P0/P1/P2 findings that feed Phase 017+ remediation.

### 1.2 Headline numbers

| Metric | Value |
| ------ | ----- |
| Iterations | 50 (hard ceiling) |
| Raw findings | 137 |
| Distinct issues after dedup | ~63 |
| Unique file/surface hits | 37 (57 including companion files surfaced via citations) |
| P0 (individual) | 0 |
| P0 (composite / interaction-effect escalations) | 4 confirmed + 1 watch-p1 + 1 watch-p2 |
| P1 distinct | ~33 (52% of distinct) |
| P2 distinct | ~30 (48% of distinct) |
| Cross-cutting anti-patterns | 10+ |
| Domains directly covered | 4 of 5 (D5 transversal, not dedicated) |
| Interim syntheses produced | 5 (at iters 32, 38, 41, 44, 47) |
| Final synthesis produced | 1 (1042 lines, authored at iteration 50) |
| Remediation items identified | 29 quick wins + 13 medium refactors + 7 structural refactors |
| Phase 017 effort estimate | ~24.5 engineer-weeks (6 engineer-months, 3 engineers parallel) |

### 1.3 Central finding

**Every failure surfaced in this research is silent.** Not once in 50 iterations did we find a crash, unhandled exception, compile error, or failing regression test that would alert an operator to the underlying bug. The runtime looks healthy by every observable metric:

- Health checks return `ok`.
- Validations print `VALIDATION PASSED`.
- `memory_save` returns `status: "success"`.
- Skill routing reports `0.95` confidence.
- Session startup renders a continuity lane.

Meanwhile, the runtime is operating with reduced fidelity across at least 37 surfaces:

- Transcript re-parsing with duplicate token accounting.
- Gemini sessions losing continuity that Claude sees fine.
- Graph-metadata corruption laundered into `qualityScore: 1` and then boosted +0.12 in stage-1 retrieval ranking.
- Two concurrent governed saves forking the memory-graph lineage by both superseding the same predecessor.
- Routine `--finalize` cleanups deleting fresh session state under live load.
- Skill routing collapsing `/spec_kit:deep-research` to the generic `command-spec-kit` bridge, breaking the subcommand-to-skill-specific path.
- Gate 3 false positives triggering spec-folder setup on read-only review prompts, plus false negatives letting `save context` and `resume deep research` proceed without Gate 3.

Phase 016 is therefore, in one sentence, a **dishonest-runtime audit**. The runtime is not broken; it is honest about its own state in a narrow sense (it tells you what it did) while being dishonest in a broader sense (it does not tell you which work was skipped, which input was invalid, which read happened on a stale snapshot, which output is based on a downgraded source, which routing target was collapsed to a generic fallback, or which cleanup removed live data).

### 1.4 What this means for Phase 017+

The remediation pattern for a dishonest-runtime audit differs from a broken-runtime audit. The finding registry lists 137 raw findings, but fixing them one-by-one would leave the underlying dishonesty architecture intact. The FINAL synthesis identified **four interaction-effect P0 composites** (candidates A, B, C, D) where layered P1 + P2 findings chain into systemic, persistent-state, or control-plane failures. Each composite requires a **structural refactor**, not a patch set:

- **P0-A (cross-runtime tempdir control-plane poisoning):** one corrupt temp-state file simultaneously reaches Claude + Gemini + OpenCode hook surfaces. Fix requires Zod validation of persisted state, unique temp paths, schemaVersion field, identity-based compact-cache cleanup, TOCTOU re-stat guards, and return-shape expansion.
- **P0-B (reconsolidation conflict + complement duplicate/corruption window):** two concurrent governed saves can fork memory-graph lineage. Fix requires predecessor-hash CAS at conflict commit, same-transaction re-read of similarity and scope, and batched scope snapshots.
- **P0-C (graph-metadata laundering + search boost):** malformed metadata accepted as legacy, laundered into canonical JSON, assigned `qualityScore: 1`, boosted +0.12 in stage-1 retrieval. Fix requires a `migrated: true` marker propagated from parser to ranking with a reversed boost (penalty, not bonus).
- **P0-D (TOCTOU cleanup erasing fresh state under live session load):** routine `--finalize` deletes freshly-written state that was renamed onto the path between stat and unlink. Fix requires TOCTOU identity checks, per-file error isolation, and transient-sentinel elimination.

Additionally, test-suite countermeasures are critical: **at least 14 existing test files actively codify the degraded contract**. Fixing the runtime without rewriting those tests is not possible -- the tests would fail with honest return shapes.

### 1.5 Research methodology (what made this pass produce these findings)

The research used a **5-domain investigation pattern** rather than a per-file pass. Each domain targeted a cross-cutting theme (silent fail-open, state contract honesty, concurrency, stringly-typed governance, test coverage). Iterations within a domain built on each other, with each iteration picking one novel investigation thread and reading the actual source code (not just spec docs) before emitting findings.

This design is what let the research surface **interaction effects** -- patterns where finding X in one file and finding Y in another combine into a systemic failure. A per-file pass would have found the same constituent findings but not the P0 composites.

One methodological caveat: **Domain 5 (Test Coverage Gaps) was never run as a dedicated pass**. The intended 10-iteration coverage matrix was absorbed by Domain 4's overflow when the stringly-typed governance theme turned out to be the densest source of novel findings. Test-coverage evidence was instead accumulated transversally across iterations 1-47. Phase 017 should run a dedicated 5-iteration Domain-5 pass in parallel with P0 remediation to produce the missing coverage matrix.

---

## 2. The 5 research domains

### 2.1 Domain 1 -- Silent Fail-Open Patterns (iterations 11-20, foundational in 1-10)

**Thesis.** The runtime contains many surfaces that return success-shaped payloads after work was skipped, partially applied, or filtered out. The pattern is not "exceptions swallowed into success"; it is **truth-contract erosion** -- old formats are treated as current, unresolved subjects are treated as valid seeds, and governed suppression is treated as ordinary absence.

**Key sub-patterns (6 identified).**

1. **Status erasure at the response boundary.** Multiple layers (`session-stop.ts`, `post-insert.ts`, `response-builder.ts`) flatten failed / partial / skipped outcomes into ordinary success. `SessionStopProcessResult` never exposes `autosaveOutcome`. `enrichmentStatus = true` covers success, feature-disabled skip, "nothing to do" skip, and full deferral. `response-builder.ts` reduces per-step nuance into at most one generic warning.

2. **Input-contract normalization.** Unsupported operations and malformed rows are converted into plausible success states. `code-graph/query.ts` with unsupported `edgeType` returns `ok` + empty result. Vector-search rows with malformed fields get coerced into sentinel values. `includeTransitive: true` with unknown `operation` defaults to CALLS traversal.

3. **Absence reinterpreted as truth.** Autosave silently skips on missing `lastSpecFolder` / `sessionSummary` with no `SessionStopProcessResult` field distinguishing success from skip. `readDoc()` collapses I/O failure to `null`, then `deriveStatus()` misreads as `planned` or `complete`. Outline queries degrade unknown paths into `ok` + `nodeCount: 0`. `reconsolidation-bridge` catches every thrown error (checkpoint, reconsolidate, similarity, conflict store) and falls through to normal create.

4. **Second-order truth loss.** `storeTokenSnapshot()` writes `lastTranscriptOffset: 0` before producer metadata builds; the transient sentinel can stick if the subsequent producer-metadata build fails. Committed offset stays at 0, and the next stop-hook re-parses the entire transcript -- inflating token counts without any signal.

5. **Provenance drift in successful envelopes.** Query-level `detectorProvenance` silently degrades to global last-index snapshot; an empty result advertises `structured` provenance. Legacy-fallback graph metadata fabricates fresh `created_at` / `last_save_at` via `new Date().toISOString()`. Diagnostic state erased at the migration boundary.

6. **Packet-target authority drift.** Transcript-driven retargeting (the 50 KB tail scan for `@spec-folder` mentions) silently rewrites autosave destination. A long conversation's real packet authority can be hidden by the window size limit. Transcript I/O failure collapses into the same "ambiguous" path as normal ambiguity.

**Representative findings:**

| ID | File:lines | Severity | One-liner |
| -- | ---------- | -------- | --------- |
| R8-001 | `post-insert.ts:86-213,223-238` | P1 | `enrichmentStatus = true` for four different outcomes |
| R11-003 | `code-graph/query.ts:367-385` | P1 | `blast_radius` degrades unresolved subjects into seed file paths |
| R13-002 | `graph-metadata-parser.ts:280-285,457-475,849-860` | P1 | `readDoc()` I/O failure becomes `planned`/`complete` |
| R13-004 | `reconsolidation-bridge.ts:261-270,438-442` | P1 | All thrown errors become "normal create path" |
| R14-001 | `session-stop.ts:175-193,257-268` | P1 | `lastTranscriptOffset: 0` sentinel + catch swallows later failure |
| R15-001 | `session-stop.ts:61-77,281-309` | P1 | Transcript-driven retargeting silently rewrites autosave |
| R16-001 | `code-graph/query.ts:417-436,547-548` | P1 | `includeTransitive: true` runs before switch validation |
| R20-001 | `session-stop.ts:199-218,248-268` | P1 | `buildProducerMetadata()` re-stats transcript; metadata describes later state |

**Counter-examples (well-designed surfaces that prove the antipattern is not inevitable).**

- `lib/storage/reconsolidation.ts:executeMerge()` has proper predecessor CAS via `updated_at` + `content_hash`. Domain 3 confirmed that `executeConflict()` lacks this guard; the merge path is the clean design model.
- `scripts/tests/generate-context-cli-authority.vitest.ts` correctly tests `--stdin` and `--json` modes. The `/tmp/save-context-data.json` file handoff is the exception that should be removed.

**Deepest systemic insight from D1.** Domain 1's deepest pattern is **flag-based success without helper-result inspection**. Every `enrichmentStatus` boolean is set via `true` literal rather than by inspecting the helper's return value. This is a single structural fix (enum-valued `OperationResult<T>`) that resolves ~10 findings at once.

### 2.2 Domain 2 -- State Contract Honesty (iterations 21-30)

**Thesis.** Collapsed producer state becomes harder to recover from once a downstream layer re-emits it as a stronger contract. The system now contains multiple places where ambiguous or recovered state is strengthened into authoritative-looking signals. This is the mechanism behind P0-candidate-C (graph-metadata laundering).

**Key sub-patterns (7 identified).**

1. **State laundering across boundaries.** `response-builder.ts` drops step detail into warnings. `hook-state.ts` trusts unvalidated `JSON.parse` and feeds prompt replay + autosave routing. `graph-metadata-parser.ts` rewrites legacy metadata as canonical current JSON at the persistence layer.

2. **State promotion at consumer layers.** Readiness vocabulary diverges across surfaces (`empty` vs `missing` vs `stale`). Fallback-recovered metadata gets `qualityScore: 1` and empty `qualityFlags: []` from `memory-parser.ts`, then +0.12 boost in stage-1 retrieval. Cache expiry becomes observationally identical to cache absence.

3. **Control-plane asymmetry.** Deferred save cases get typed recovery actions; other runtime-degradation branches get warning strings only. Cached scope drives `fallbackSpecFolder` but OpenCode transport uses `args.specFolder ?? null`, dropping the fallback.

4. **Regression behavior canonizing degraded contracts.** Four test files explicitly assert the collapsed state: `post-insert-deferred.vitest.ts` locks in all-true booleans for deferred; `code-graph-query-handler.vitest.ts` hoists `fresh` + `structured` defaults; `graph-metadata-schema.vitest.ts` treats legacy fallback as clean success; `hook-state.vitest.ts` covers only the happy parse path.

5. **Health surface weaker than bootstrap/resume.** `session_health` doesn't attach section-level `structuralTrust` axes that `session_bootstrap` and `session_resume` do carry.

6. **Self-contradictory payloads.** A single response from `session-bootstrap` can advertise `trustState=stale` AND `graphOps.readiness.canonical=empty` simultaneously. Two sibling fields disagree within one response. Consumers see whichever field they read; there is no canonical truth.

7. **Theatrical schema-drift vocabulary.** `CACHED_SESSION_SUMMARY_SCHEMA_VERSION` exists as a constant; persisted `HookState` has no `schemaVersion` field. The supposed schema-mismatch rejection path is unreachable for real inputs.

**Representative findings:**

| ID | File:lines | Severity | One-liner |
| -- | ---------- | -------- | --------- |
| R21-001 | `response-builder.ts:311-322,569-573` | P1 | `memory_save` response collapses post-insert truth further than `post-insert.ts` does |
| R21-002 | `hook-state.ts:83-87` | P1 | `JSON.parse(raw) as HookState` with no validation |
| R21-003 | `graph-metadata-parser.ts:223-233,264-275,1015-1019` | P1 | `refreshGraphMetadataForSpecFolder()` launders malformed JSON into canonical artifact |
| R22-002 | `memory-parser.ts:293-330` | P1 | Fallback-recovered graph-metadata gets `qualityScore: 1` + 0.12 boost |
| R25-004 | `hook-state.ts:83-87` | P1 | Unvalidated parse reaches 5 hook entrypoints across Claude + Gemini |
| R29-001 | `session-resume.ts:174-208` | P1 | `schemaVersion` check fabricated; HookState has no version field |
| R30-001 | `session-bootstrap.ts` + `session-resume.ts` | P1 | `trustState=stale` AND `readiness.canonical=empty` in one payload |

**Counter-examples.**

- `session_bootstrap` and `session_resume` DO carry `sections[].structuralTrust` with richer axes. The health surface lost the axes at the envelope boundary, not at the producer side. The producer-side contract is correct.
- The deferred planner-first save path DOES have a typed `runEnrichmentBackfill` recovery action. Other runtime-degradation branches are structurally inferior to this one case; the deferred path is the design model.

**Deepest systemic insight from D2.** The dominant pattern is **state laundering** -- the corruption signal is erased at the persistence layer AND the consumer layer simultaneously, then boosted by search ranking. This is why "laundering" is the accurate term: the corrupt input gets laundered through the pipeline into a stronger contract than the input justified.

### 2.3 Domain 3 -- Concurrency and Write Coordination (iterations 31-40)

**Thesis.** The concurrency bug class is **layered**:

- **Byte-level races at write time** (unlocked `.tmp` swap between two writers for the same session).
- **Snapshot-coherence races at read-then-decide time** (stale pre-transaction snapshots driving conflict, merge, complement, assistive, cleanup, and spec-folder targeting decisions).
- **TOCTOU identity races at cleanup time** (stat-then-read across a concurrent rename; stat-then-unlink across a concurrent rename).

**Atomic rename prevents torn bytes; it does not protect any decision that was made before the rename and reused afterward.** Seven of nine pattern groups are about decision staleness, not write-time torn bytes.

**Nine confirmed pattern groups.**

1. **Unlocked RMW on deterministic temp paths.** `hook-state.ts` uses `filePath + '.tmp'`; two writers for the same session path swap bytes before rename. `updateState()` returns `merged` even after failed persist -- consumer sees an `updated` object that is not on disk.

2. **Split-brain stop-hook state.** `processStopHook()` makes three independent `recordStateUpdate()` calls plus a re-read in `runContextAutosave()`. A transient `lastTranscriptOffset: 0` sentinel sits between `storeTokenSnapshot()` and `recordStateUpdate()`; a second concurrent stop hook can read the zero and re-parse the whole transcript.

3. **Reconsolidation pre-transaction snapshot exposure.** The conflict lane (`executeConflict()`), the complement lane (`runReconsolidationIfEnabled()`), and the assistive lane all make decisions BEFORE the writer transaction. `readStoredScope()` reads each candidate's row individually outside any transaction -- similarity/content from one snapshot, scope from another.

4. **TOCTOU identity races.** `clearCompactPrime()` clears by session ID only, not payload identity; newer payload erased on overlap. `loadMostRecentState()` stat-then-read across rename -- freshness from one generation, content from another. `cleanStaleStates()` stat-then-unlink across rename -- cleanup can erase live state while reporting normal `removed` count.

5. **Directory-level all-or-nothing scans.** Single `try` block wraps whole directory loop; one bad file aborts entire pass. Applies to both `loadMostRecentState()` and `cleanStaleStates()`.

6. **Success-shaped durability signals.** `producerMetadataWritten` and `touchedPaths` are attempted-write flags exported as postconditions. Analytics treats attempted-write as truth.

7. **Stop-hook autosave outcome silent.** `SessionStopProcessResult` never exposes autosave outcome (ran / skipped / failed).

8. **Stale `currentSpecFolder` preference.** `detectSpecFolder()` prefers a snapshot that's already stale, suppressing legitimate packet retarget.

9. **Shared `/tmp/save-context-data.json` at 4 surfaces.** Four command YAMLs, four runtime root docs (AGENTS.md/CLAUDE.md/CODEX.md/GEMINI.md), and `data-loader.ts`'s `NO_DATA_FILE` error message all teach the same collision-prone path.

**Representative findings:**

| ID | File:lines | Severity | One-liner |
| -- | ---------- | -------- | --------- |
| R31-001 | `hook-state.ts:169-176,221-240` | P1 | Deterministic `.tmp` suffix; two writers swap bytes before rename |
| R31-002 | `session-stop.ts:60-67,119-125,261-268,283-309` | P1 | Multiple `recordStateUpdate()` + final re-read creates torn-state window |
| R31-003 | `reconsolidation-bridge.ts:282-295` | P1 | `executeConflict()` has no predecessor-version or scope recheck |
| R34-002 | `reconsolidation-bridge.ts` + `memory-save.ts:2159-2171,2250-2304` | P1 | Complement: stale-search duplicate window between plan and commit |
| R35-001 | `reconsolidation-bridge.ts` + `reconsolidation.ts:467-508,610-658,952-993` | P1 | Conflict lane not single-winner; forking lineage |
| R37-001 | `session-stop.ts:175-190,244-252,257-268` | P1 | Transient `lastTranscriptOffset: 0` between two writes; third dup-token mechanism |
| R39-002 | `reconsolidation-bridge.ts:203-237,282-306` | P1 | Governed scope filter reads per-candidate outside any transaction |
| R40-001 | `hook-state.ts:170-176,247-255`; `session-stop.ts:321-328` | P2 | `cleanStaleStates` TOCTOU: stat-then-unlink deletes fresh state |

**Counter-examples.**

- `executeMerge()` has predecessor `updated_at` + `content_hash` CAS. The merge path is single-writer-safe; the conflict and complement paths are not. This is the clearest "good reference" for P0-candidate-B remediation.
- The SQLite writer transaction IS correctly serialized. The Domain 3 race is specifically about decisions made OUTSIDE the writer transaction that then become authoritative within it. The transaction is not broken; the pre-transaction planning is.
- `storeTokenSnapshot()` writes atomically. The problem (R37-001) is the intermediate zero-offset sentinel; the final state is atomic. The fix is to eliminate the intermediate write, not to add more locking.

**Deepest systemic insight from D3.** **Atomic rename is not enough.** The dominant failure mode is NOT "two writers overwrite each other" but "one writer reads, decides, then writes -- and the decision was already stale at read time." Seven of nine pattern groups are about decision staleness. Additionally, **cleanup races are structurally distinct from writer races** -- P0-candidate-D (TOCTOU cleanup) is the most operationally common scenario because it fires on routine `--finalize` rather than abnormal concurrent writes.

### 2.4 Domain 4 -- Stringly-Typed Governance (iterations 41-50)

**Thesis (sharpened through iteration 50).** Governance is expressed as manually synchronized string tables across docs, YAML assets, Python dictionaries, and markdown playbooks. The failure modes form **four distinct layers**:

1. **Invisible discard.** Routing signals (graph `intent_signals`, SKILL.md keyword comments, topology warnings) are compiled, loaded, and stored through complete pipeline stages, then silently discarded before the scoring step. The system looks mechanically wired while operating exclusively from hand-maintained Python tables.

2. **String collapse at translation boundaries.** Generic prefixes collapse command families (`/spec_kit:*` -> `command-spec-kit` at `kind_priority=2`); one-sided metadata collapses into bilateral runtime penalties (`conflicts_with` unilateral edge creates bilateral penalty); markdown strings collapse into executable JavaScript after runtime value substitution (`substitutePlaceholders` injects `runtimeState.lastJobId` into `Function(...)()`).

3. **Scope bleed in governance vocabulary.** The same English token (`phase`, `folder_state`) is reused across edit setup, lifecycle narration, and read-only validation prompts. A prose classifier cannot cleanly separate them. False positives (read-only research triggers Gate 3) AND false negatives (`save context` / `deep-research resume` do not trigger Gate 3) coexist.

4. **Success-shaped partial validation.** Surfaces that look mechanized -- a hard block (Gate 3), a `when:` field, a cycle validator -- each leave materially different string cases outside the checked contract. "VALIDATION PASSED" can be printed while cycle validation only covers 2-node reciprocal pairs, topology warnings are dropped, and `conflicts_with` reciprocity is never checked.

**The 11-layer signal-amnesia table (complete mapping).**

| Layer | Artifact consumed | Next layer | Signal fate | Finding |
| ----- | ----------------- | ---------- | ----------- | ------- |
| Compile | Topology warnings | Serialized graph | Dropped | R45-003 |
| Load | In-memory `signals` map | `analyze_request()` | Dropped; no consumer at scoring | R43-001, R44-001 |
| Parse | `<!-- Keywords -->` blocks | `_build_skill_record()` | Dropped; frontmatter parser exits before comment block | R44-002 |
| Runtime | `conflicts_with` unilateral | Bilateral penalty application | Promoted beyond declared scope with no validator | R46-002 |
| Runner | `lastJobId` from tool payload | `Function(...)()` string | Injected without escaping or schema validation | R46-003 |
| Coverage | Null scenario parse results | Coverage total | Filtered out before count; no error emitted | R45-004 |
| Routing | `/spec_kit:subcommand` specificity | Bridge matching | Collapsed to generic bridge before specific routing runs | R46-001 |
| Docs | Two-layer state machine (`folder_state` -> `start_state`) | Top-level consumer docs | Flattened back to one string, hiding the vocabulary split | R47-002 |
| Classifier | `save` intent | Gate 3 trigger list | Absent; memory-save separately enforced later | R48-001, R49-001 |
| Classifier | `resume` intent | Gate 3 trigger list | Absent; deep-research resume produces writes without gate | R50-001 |
| Validator | Dependency-cycle scan | `--validate-only` result | Only 2-node cycles checked; longer cycles silently pass | R49-003 |

**Total layers with signal amnesia: 11.** Each requires an explicit "forward or log-drop" assertion at its transition. None currently have it.

**Representative findings:**

| ID | File:lines | Severity | One-liner |
| -- | ---------- | -------- | --------- |
| R41-003 | `skill_graph_compiler.py:272-353,630-663`; `skill_advisor.py:203-265` | P1 | `--validate-only` returns success for graphs that violate routing invariants |
| R41-004 | `manual-playbook-runner.ts:224-246,251-317,438-445` | P1 | Markdown -> `Function(...)()` eval with no sandbox |
| R43-001 | `skill_advisor.py:105-116`, `skill_advisor_runtime.py:111-141` | P1 | `signals` map populated but no consumer at scoring |
| R45-003 | `skill_graph_compiler.py:559-568,630-663` | P1 | Topology warning state non-durable; `health_check()` returns `ok` |
| R45-004 | `manual-playbook-runner.ts:245-271,1203-1217` | P1 | `parseScenarioDefinition()` nulls filtered before coverage count |
| R46-001 | `skill_advisor.py:980-1021,1404-1410,1647,1741-1768` | P1 | `/spec_kit:deep-research` routes to `command-spec-kit` 0.95, not `sk-deep-research` 0.70 |
| R46-002 | `skill_graph_compiler.py:272-319,501-568,630-663` | P1 | `validate_edge_symmetry()` never inspects `conflicts_with` edges |
| R46-003 | `manual-playbook-runner.ts:181-194,427-445,930-943,1112-1117` | P1 | `substitutePlaceholders()` injects `runtimeState.lastJobId` into `Function(...)` string |
| R49-003 | `skill_graph_compiler.py:437-472,623-663` | P1 | Only two-node reciprocal cycles detected; `a -> b -> c -> a` passes |
| R50-001 | `AGENTS.md:182-186`; `spec_kit_deep-research_auto.yaml:159-167,521-526` | P1 | Gate 3 false-negative for deep-research `resume` write path |

**Counter-examples.**

- `skill-graph-schema.vitest.ts` correctly tests MCP tool dispatch routing. The routing-invariant problem is specifically that this test doesn't cover compiler-time topology invariants.
- `handler-memory-save.vitest.ts` correctly asserts reconsolidation planning completes before writer-lock acquisition. The pre-transaction-snapshot problem is not that this test is wrong; it's that the test never exercises per-candidate scope mutation during the planning window.

**Deepest systemic insight from D4.** **The routing toolchain is fully wired but terminates before scoring.** This is the single most surprising finding in Phase 016: the infrastructure for graph-driven skill routing exists end-to-end -- metadata files, compiler, SQLite persistence, load-time deserialization into an in-RAM `signals` map -- and then no consumer reads the map. Fix effort is `Small` (one function call insertion). Fix leverage is `High` (unblocks accurate Gate 2 routing for all commands).

### 2.5 Domain 5 -- Test Coverage Gaps (transversal across iterations 1-47)

**Thesis.** Test coverage evidence accumulated across iterations identifies 14 test files that actively codify the degraded contract. Fixing the runtime structural flaws without rewriting these tests is not possible -- the tests would fail with honest return shapes.

**Why Domain 5 was transversal, not dedicated.** The nominal 10-iteration Domain-5 pass was absorbed by Domain 4's overflow when stringly-typed governance emerged as the densest source of novel findings. The research design tolerated this because every iteration in Domains 1-4 already produced test-coverage evidence as a side effect -- finding a dishonest return shape usually involves reading both the source and the test that asserts the dishonest shape.

**Test files that codify the degraded contract (must be updated in structural fixes).**

| Test file | Current assertion | New assertion required | Fix chain |
| --------- | ----------------- | ---------------------- | --------- |
| `post-insert-deferred.vitest.ts:11-48` | All-true booleans for deferred | Enum status with `'deferred'` | M13 |
| `structural-contract.vitest.ts:90-111` | `status=missing` + `trustState=stale` | Distinct labels per axis | M8 |
| `graph-metadata-schema.vitest.ts:223-245` | Legacy fallback = clean success | `{ ok: true, migrated: true, migrationSource: 'legacy' }` | M7 |
| `code-graph-query-handler.vitest.ts:12-18` | Hoisted `fresh` readiness | Test fail-open branch explicitly | Quick-win #14 |
| `handler-memory-save.vitest.ts:546-557,2286-2307` | Post-insert all-true | Enum status | M13 |
| `hook-session-stop-replay.vitest.ts:14-56` | Autosave disabled | Enabled with failure injection | S2 |
| `opencode-transport.vitest.ts:33-60` | Only `trustState=live` | `missing`/`absent` cases | M8 |
| `hook-state.vitest.ts:4-224` | No `cleanStaleStates` invocation | TOCTOU stat-then-unlink regression | D1 (P0-D) |
| `reconsolidation.vitest.ts:790-855` | Single-writer conflict | Two-concurrent-conflict race | S1 |
| `reconsolidation-bridge.vitest.ts:255-330` | Static mock candidates | Governed-scope mutation during filter | S1 |
| `test_skill_advisor.py:73-186` | No intent_signals assertion | `/spec_kit:deep-research` -> `sk-deep-research`; intent_signals boost | S4 |
| `transcript-planner-export.vitest.ts:146-217` | Response summaries only | YAML `when:` predicate evaluation | S7 |
| `assistive-reconsolidation.vitest.ts:17-234` | Helper thresholds | Competing candidate insert between recommendation and commit | S1 |
| `skill-graph-schema.vitest.ts:1-156` | Dispatcher routing | Compiler invariants: symmetry, weight-band, orphans, cycle length >2 | S4 |

**New tests required (no current coverage).**

- Two-concurrent-conflict save against same predecessor (R35-001, P0-B)
- Mixed-snapshot scope filter under governed-scope mutation (R39-002, R40-002, P0-B)
- TOCTOU cleanup -> all-or-nothing scan abort -> cold-start (R40-001, R38-001, R37-001, P0-D)
- Two-stop overlap exposing transient `lastTranscriptOffset: 0` (R37-001, R33-002, P0-A)
- Compact prime identity race (R33-001, P0-A)
- HookState schema-version mismatch rejection (R29-001, P0-A)
- `Function(...)` with injected adversarial `lastJobId` (R46-003, watch-p2)
- Ranking-stability assertion: `sk-deep-research` vs `sk-code-review` margin >= 0.10 for audit-vocabulary prompts (R45-002, S4)
- `/spec_kit:deep-research` routes to `sk-deep-research`, not `command-spec-kit` (R46-001, S4)
- Unilateral `conflicts_with` does NOT penalize non-declaring skill (R46-002, S4)
- `health_check()` returns `status: "degraded"` when topology warnings present (R45-003, S4)
- Scenario count before vs after null-filter equals (R45-004, S6)
- `intake_triggered`/`intake_completed` events contain both `folderState` and `startState` with distinct values (R47-002, S7)
- `phase transition` prompt preceded by `confirm` does NOT trigger Gate 3 (R45-001, R47-001, S5)
- `save context` / `save memory` / `/memory:save` prompts DO trigger Gate 3 (R48-001, R49-001, S5)
- `resume deep research` prompt DOES trigger Gate 3 (R50-001, S5)
- Arbitrary-length `depends_on` cycle (A->B->C->A) fails `--validate-only` (R49-003, quick-win #6)
- YAML `when:` predicate with `true`/`false` lowercase or `True`/`False` titlecase does NOT match the `TRUE`/`FALSE` contract (R42-001, R43-002, R44-003, S7)

**Recommendation.** Phase 017 should either do a dedicated Domain-5 pass in parallel with P0 remediation, or accept ~20% extra schedule for test-writing during structural refactor work.

---

## 3. Iteration-by-iteration evidence log

This section provides a ground-truth narrative from the 50 iteration files. Each iteration gets a one-paragraph summary of its investigation thread, core findings, and forward-looking hook into the next iteration. This is the most faithful reconstruction of the research's actual discovery arc.

### 3.1 Foundational seams (iterations 1-10)

**Iteration 1 -- Session lifecycle continuity seam.** Traced the boundary between `hook-state.ts`, `session-stop.ts`, `startup-brief.ts`, and runtime-specific `session-prime.ts` consumers. First finding: `buildSessionContinuity()` is dead-on-arrival in production because it calls `loadMostRecentState()` without any scope, while `hook-state.ts` explicitly rejects scope-less reads -- Gemini startup never receives prior session continuity from persisted hook state. Second finding: missing `session_id` values collapse onto a shared `'unknown'` temp-state identity, so one malformed hook payload poisons the fallback bucket for all sessions.

**Iteration 2 -- Compact/recovery handoff.** Followed `compact-inject.ts` -> `hook-state.ts` -> `session-prime.ts` -> `session-resume.ts` with emphasis on cached compact payloads and `producerMetadata` drift. Confirmed R1-001 with a second dead-lane instance. Added finding on `loadMostRecentState()` directory scan: a single malformed sibling file aborts the entire lookup and returns null.

**Iteration 3 -- Code-graph query contract.** Read `handlers/code-graph/query.ts` end-to-end. Three findings: `resolveSubject()` picks first `fq_name`/`name` match with `LIMIT 1` and no `ambiguous_subject` signal; readiness gate fails open because `ensureCodeGraphReady()` exceptions are swallowed; response-level edge trust is derived from `result.edges[0]` only, attributing aggregate trust to a single sample.

**Iteration 4 -- Hook-state freshness ranking.** Found that `loadMostRecentState()` ranks candidates by filesystem `mtime` rather than `state.updatedAt`, so backup/touch operations can mis-rank older state. Also confirmed R2-002 (directory single-try) from a different read path.

**Iteration 5 -- ensure-ready refresh semantics.** Found that successful inline refresh still reports pre-refresh freshness, so downstream consumers see `freshness: 'stale'` and re-trigger refresh unnecessarily. Also found partial persistence failures silently treated as successful refresh because `file_mtime_ms` is written before node/edge failure.

**Iteration 6 -- Reconsolidation-bridge governance gates.** Found that assistive reconsolidation is gated by planner/full-auto switch and defaults OFF despite docs claiming "default ON." Also found `ASSISTIVE_AUTO_MERGE_THRESHOLD` promises auto-merge, but runtime only logs and falls through.

**Iteration 7 -- API indexing + post-insert.** Found `runEnrichmentBackfill` uses `incremental: true, force: false`, so recovery from degraded enrichment misses files that didn't change since the degraded save. Also found entity extraction soft-fails but sets the flag `true`, and linking runs on stale rows.

**Iteration 8 -- Post-insert enrichmentStatus collapse.** The central finding of D1: `enrichmentStatus = true` for four different outcomes (success, feature-disabled skip, "nothing to do" skip, deferral). Callers cannot distinguish "skipped," "deferred," "failed," and "succeeded." Entity linking is gated only by feature flags, not by successful extraction.

**Iteration 9 -- Shared-payload trust vocabulary.** Found `trustStateFromGraphState()` / `trustStateFromStructuralStatus()` collapse `missing` + `empty` into `stale`. Also found `coerceSharedPayloadEnvelope()` is shape-only, not contract-level -- type system passes while semantic provenance gets through unchecked.

**Iteration 10 -- Cross-runtime compact-recovery.** Found Gemini compact-recovery drops cached provenance entirely; Claude preserves it. Also found the Claude wrapper interpolates provenance directly into `[PROVENANCE:]` without escaping.

### 3.2 D1 Silent Fail-Open Patterns (iterations 11-20)

**Iteration 11 -- Novel-only pass on the 5 main fail-open surfaces.** Five new findings emerged from the fail-open lens: `session-stop.ts` transcript failure degrades to warning-only with no machine-readable outcome; `graph-metadata-parser.ts` legacy fallback returns `ok: true` with no migration marker; `code-graph/query.ts` `blast_radius` silently degrades unresolved subjects via `resolveSubjectFilePath(candidate) ?? candidate`; `reconsolidation-bridge.ts` scope-filtered candidates vanish silently; `post-insert.ts` summary/graph-lifecycle no-ops normalized to `true`.

**Iteration 12 -- Response-shaping degradation consumers.** Found `runContextAutosave` returns void with no autosave outcome field in `SessionStopProcessResult`; operators cannot distinguish successful autosave from silent skip. Also found unsupported/misspelled `edgeType` returns `ok` with empty result. Pre-filter window `(opts.limit ?? 3) * 3` can starve in-scope reconsolidation candidates. `causalLinks` status set `true` before checking `unresolved.length`. `entityLinking.skippedByDensityGuard` collapsed into success.

**Iteration 13 -- Absence-as-truth patterns.** Five findings targeting how absence gets reinterpreted: `runContextAutosave` silently skips when `lastSpecFolder`/`sessionSummary` unset; `readDoc()` collapses I/O failure to `null` and `deriveStatus()` misreads as `planned`/`complete`; outline queries degrade unknown/path-mismatched files into `ok` with `nodeCount: 0`; any thrown error in `reconsolidation-bridge` caught and falls through to normal create; causal-link partial unresolved refs treated as successful run.

**Iteration 14 -- Second-order truth loss.** Central finding: `storeTokenSnapshot` writes `lastTranscriptOffset: 0` before producer metadata builds, and the catch block swallows later failure. Committed offset can remain at 0; next stop hook re-parses full transcript; duplicate token accounting. Also confirmed R12-002 (duplicate) and R12-005 (duplicate) from the new lens.

**Iteration 15 -- Packet-target authority drift.** Three findings on transcript-driven retargeting: silently rewrites autosave destination; 50 KB tail window can hide real active packet; transcript I/O failure collapsed into same "ambiguous" path as normal ambiguity.

**Iteration 16 -- Query operation validation.** Found `includeTransitive: true` runs before switch-level validation; unsupported ops default to CALLS traversal with no error. Also found malformed vector-search rows coerced into sentinel values in reconsolidation-bridge.

**Iteration 17 -- Dangling edges and execution status.** Two findings: dangling edges returned as successful relationships with raw `edge.targetId`; exception-driven enrichment failures still report `executionStatus=ran`.

**Iteration 18 -- Query provenance and legacy diagnostics.** Query-level `detectorProvenance` silently degrades to global last-index snapshot. Legacy fallback discards original current-schema validation errors.

**Iteration 19 -- Transitive traversal and assistive fallback.** Transitive traversal silently degrades dangling nodes into `ok` with null metadata. Assistive reconsolidation failures fall open to ordinary save with no machine-readable signal.

**Iteration 20 -- Producer-metadata timing drift.** `buildProducerMetadata()` re-stats live transcript; metadata describes later state than parsed one. Legacy fallback fabricates `created_at`/`last_save_at` via `new Date().toISOString()`. Also confirmed R18-001 (duplicate).

### 3.3 D2 State Contract Honesty (iterations 21-30)

**Iteration 21 -- State-laundering boundaries.** Three findings on state promotion: `memory_save` response collapses post-insert truth further than `post-insert.ts` does; `JSON.parse(raw) as HookState` with no validation feeds prompt replay + autosave routing; `refreshGraphMetadataForSpecFolder()` launders malformed modern JSON into canonical refreshed artifact.

**Iteration 22 -- Self-contradictory payloads + quality boost.** Found self-contradictory success payload: readiness `empty` + `detectorProvenance: structured`. Also found fallback-recovered `graph-metadata` gets `qualityScore: 1` and +0.12 packet boost in `memory-parser.ts`.

**Iteration 23 -- Vocabulary divergence across surfaces.** Query exposes `empty` readiness while bootstrap canonicalizes same condition as `missing`. Schema-invalid-as-legacy gets first-class `graph_metadata` indexing + retrieval priority upgrade. Compact-cache expiry observationally identical to cache absence.

**Iteration 24 -- Control-plane asymmetry.** `runEnrichmentBackfill` advertised before enrichment runs; only the deferred case gets typed recovery. Cached scope drives `fallbackSpecFolder` but OpenCode transport uses `args.specFolder ?? null`.

**Iteration 25 -- Tests codifying degraded contracts.** Four tests explicitly assert the collapsed state: `post-insert-deferred.vitest.ts:35-47` expects all booleans `true` for deferred; `code-graph-query-handler.vitest.ts:3-18` hoists `fresh`/`structured` defaults; `graph-metadata-schema.vitest.ts:223-245` treats legacy fallback as clean success. Also found unvalidated `JSON.parse` fans out across Claude + Gemini runtimes through 5 hook entrypoints.

**Iteration 26 -- Public contracts asserted via tests.** Missing-stale collapse now directly asserted public contract via tests. `session_health` doesn't attach section-level `structuralTrust` axes -- health surface weaker than bootstrap/resume.

**Iteration 27 -- Graph-lifecycle blindspot + routing endorsement.** `graphLifecycle=true` even when `onIndex` returns `skipped:true`; `runEnrichmentBackfill` can't unblock. Routing still recommends `code_graph_query` despite readiness-fail-open gap.

**Iteration 28 -- Null-return cascade.** `loadState()` returning `null` on parse failure indistinguishable from genuine cold start; `startOffset = 0` re-parses transcript. Null collapse also strips `currentSpecFolder` disambiguator for `detectSpecFolder`.

**Iteration 29 -- Theatrical schema-drift vocabulary.** Cached-summary `schemaVersion` check fabricated; HookState has no version field. Claude startup collapses all rejection reasons into same "no cached continuity" state.

**Iteration 30 -- Self-contradictory sibling fields.** Same payload carries `trustState=stale` AND `graphOps.readiness.canonical=empty`. OpenCode transport drops richer structural truth; renders only collapsed provenance label.

### 3.4 D3 Concurrency & Write Coordination (iterations 31-40)

**Iteration 31 -- Deterministic temp paths + pre-transaction snapshots.** Five findings: deterministic `filePath + '.tmp'` means two writers for same session swap bytes before rename; multiple `recordStateUpdate()` + final disk reload by `runContextAutosave()` create torn-state autosave window; `executeConflict()` has no predecessor-version or scope recheck; `process.pid + Date.now()` temp path collides at ms precision; `/tmp/save-context-data.json` is documented shared handoff path.

**Iteration 32 -- UpdateState return after failed persist.** `updateState` returns merged even after failed persist. Also found scope-retag between filter and commit not re-checked at conflict/merge. Multiple command surfaces hardcode the shared `/tmp` path.

**Iteration 33 -- Compact-prime identity + offset monotonicity.** `clearCompactPrime()` clears by session ID only, not payload identity; newer payload erased on overlap. Overlapping stop hooks can regress `lastTranscriptOffset` backwards with no monotonicity guard. Failed `saveState` does not abort autosave; `runContextAutosave` can persist stale disk state.

**Iteration 34 -- Durability overstatement + complement duplicate window.** `producerMetadataWritten` is attempted-write flag, not durable postcondition. Complement path: stale-search duplicate window between `runReconsolidationIfEnabled` and `writeTransaction`. This is the root finding for P0-B's complement lane. Novel insight: **success reported before durability is re-verified** is the class pattern after "no lock."

**Iteration 35 -- Conflict fork + attempted-write signals.** Conflict lane not single-winner; two concurrent saves can both supersede same predecessor, forking lineage. `touchedPaths` appended unconditionally regardless of `saveState` outcome; overstate durability. All four runtime root docs prescribe shared `/tmp/save-context-data.json` handoff.

**Iteration 36 -- Torn reads and pre-transaction staleness.** `loadMostRecentState` stat-then-read race: concurrent rename can swap generation between mtime read and JSON read. Assistive reconsolidation recommendation built from pre-transaction snapshot; can be stale on delivery. `NO_DATA_FILE` error text teaches callers to use shared `/tmp` path.

**Iteration 37 -- Transient sentinels + stale spec-folder preference.** Transient `lastTranscriptOffset: 0` sentinel between two writes; second concurrent stop hook can re-parse from zero. Stale `currentSpecFolder` preference can suppress legitimate packet retarget when another writer advanced the target. Single save can observe two different pre-transaction candidate universes (TM-06 then assistive).

**Iteration 38 -- All-or-nothing scans.** `loadMostRecentState` all-or-nothing `try` block: one bad sibling file aborts entire scan and returns null. `cleanStaleStates` all-or-nothing `try` block: partial removed count returned with no indication of skipped files.

**Iteration 39 -- Autosave outcome never surfaced + governed-scope mixed snapshot.** Autosave outcome (ran/skipped/failed) never surfaced in `SessionStopProcessResult`; callers cannot distinguish success from silent skip. Governed scope filter reads each candidate's row individually outside any transaction; mixed-snapshot candidate universe.

**Iteration 40 -- TOCTOU cleanup + governed-scope extension.** `cleanStaleStates` TOCTOU: stat-then-unlink can delete fresh state written between those two calls. This is the root finding for P0-D. Also confirmed same per-candidate scope read / mixed-snapshot problem confirmed in both TM-06 and assistive paths.

### 3.5 D4 Stringly-Typed Governance (iterations 41-50)

**Iteration 41 -- Vocabulary drift + Gate 3 prose + skill-graph compiler + playbook eval.** Four foundational D4 findings: `spec_kit_plan_auto.yaml` uses `populated` while canonical contract uses `populated-folder`; Gate 3 trigger list is prose English word list; skill-graph topology checks advisory-only with `--validate-only` returning success for invariant violations; `manual-playbook-runner.ts` evaluates markdown via `Function(...)()` with no sandbox.

**Iteration 42 -- Expression DSL + dual-inventory + filename-driven automation.** `intake_only == TRUE` / `folder_state == populated` as quoted string expressions; skill-routing authority split across two unsynchronized inventories (SKILL.md discovery vs compiled graph); automation eligibility governed by filename substrings + prose-shaped command parsing.

**Iteration 43 -- The invisible-discard breakthrough.** Live skill router does not consume per-skill `intent_signals` / `derived.trigger_phrases`; `signals` map populated but has no consumer in `analyze_request()`. This is the single most surprising finding in the research. Also found `/spec_kit:plan` autonomous Step 0 depends on untyped expression DSL with no pinned grammar. Novel insight: **"authority drift between metadata and runtime"** is the most important remaining D4 seam.

**Iteration 44 -- Consolidation of invisible discard.** Confirmed R43-001 from a second angle: `intent_signals` silently discarded at scoring boundary; compile/load pipeline works but has no consumer. Found SKILL.md `<!-- Keywords: ... -->` comment blocks stripped before routing. Unsigned boolean DSL (`intake_only == TRUE`) across YAML assets.

**Iteration 45 -- Gate 3 false positives + ranking stability + topology warning amnesia + coverage dishonesty.** Gate 3 trigger list includes `analyze`, `decompose`, `phase`; read-only deep-review/deep-research prompts reuse these tokens (false positives). Deep-research prompts containing `audit`/`review` tokens score within 0.02 of `sk-code-review`; no ranking-stability test. Topology warning state non-durable: ZERO-EDGE WARNINGS emitted then dropped from serialized graph. `parseScenarioDefinition()` returns null on parse failure; `main()` filters nulls before coverage count; 10/291 active scenario files unparseable.

**Iteration 46 -- Command bridges + unilateral conflicts_with + runtimeState injection.** `COMMAND_BRIDGES` registers only `/spec_kit` and `spec_kit:` prefix markers; all `/spec_kit:*` subcommands collapse to `command-spec-kit` at `kind_priority=2`. `validate_edge_symmetry()` never inspects `conflicts_with` edges; unilateral metadata edit silently creates bilateral runtime penalty. `parsedStepArgs()` routes brace-prefixed text to `evaluateObjectLiteral()`; `substitutePlaceholders()` injects `runtimeState.lastJobId` from prior handler payloads into `Function(...)` string.

**Iteration 47 -- Gate 3 false-positive repro + plan two-vocabulary collapse.** Concrete shipped scenarios with `phase transition`/`synthesis phase` in shipped playbooks confirm R45-001 with repo evidence. `/spec_kit:plan` maintains two-vocabulary state machine: local `folder_state` classifier -> canonical `start_state`; top-level docs collapse both into one label.

**Iteration 48 -- Gate 3 false-negatives for memory-save.** Gate 3's file-modification trigger list omits `save context`, `save memory`, `/memory:save` even though same file declares `MEMORY SAVE RULE` keyed on these phrases. `when:` field overloaded as both executable predicate and prose timing note within same asset.

**Iteration 49 -- Gate 3/save consolidation + when: overload + dependency-cycle validator.** Write intent governed by two unsynchronized string classifiers: Gate 3 and `MEMORY SAVE RULE`. Same `when:` key carries both boolean-like predicates and free-form narrative timing prose. `validate_dependency_cycles()` only detects two-node reciprocal cycles; live repro: `a -> b -> c -> a` returns empty `three_node` array.

**Iteration 50 -- Gate 3 false-negative for deep-research resume + playbook dialect drift.** Gate 3 hard-block trigger list has false-negative hole for write-producing deep-research resume flows. Live corpus contains two incompatible argument dialects for the same tool family (`memory_ingest_status({jobId})` vs `memory_ingest_status({ jobId:"<job-id>" })`); shorthand form depends on undefined JS scoping.

---

## 4. The four P0 composites

### 4.0 Methodology -- how P0 candidates were identified

No individual finding in Phase 016 met the P0 threshold on its own. The review's central methodological contribution was identifying **four interaction-effect composites** where P1 and P2 findings chain into systemic, persistent, or data-integrity failure modes. Each candidate satisfies at least three of these criteria:

1. **Multi-file blast radius.** The failure spans >=3 files or subsystems.
2. **Data-integrity or control-plane scope.** The failure writes incorrect data to persistent store, steers control-plane decisions to the wrong target, or both.
3. **Silent propagation.** No exception is thrown; no error log is emitted beyond warning level; no test currently fails.
4. **Operator invisibility.** Result objects advertise success; health checks return `ok`; prose-level log-scraping is required to detect the failure after the fact.
5. **Irreversible or hard-to-reverse.** The failure either writes permanent data (lineage edges, graph metadata) or destroys state that cannot be recovered (deleted hook-state, lost transcript offset).

All four confirmed P0 candidates satisfy criteria 1, 3, 4, and 5. They differ along criterion 2: A and D are control-plane failures (continuity loss), B and C are data-integrity failures (permanent corruption).

### 4.1 P0-candidate-A -- Cross-runtime tempdir control-plane poisoning

**Constituent findings:** R21-002, R25-004, R28-001, R29-001, R31-001, R33-001, R33-003, R36-001, R38-001, R38-002 (10 findings across `hook-state.ts` and `session-stop.ts`).

**Attack/failure scenario.** A single corrupt, drifted, concurrently-replaced, or unreadable temp-state file can simultaneously:

1. Inject forged provenance into Claude prompt text after compaction.
2. Misroute Gemini startup continuity via the scope-less `loadMostRecentState` contract.
3. Force transcript re-parsing with duplicate token counting when `loadState` returns null.
4. Bypass the cached-summary schema guard because persisted state has no `schemaVersion` field.
5. Pair one stop-hook's summary with another's packet target via `updateState()` without CAS.
6. Proceed with autosave after a known `saveState()` failure.
7. Have a fresh precompact payload silently deleted by an older consumer's `clearCompactPrime()`.
8. Return freshness from one generation with content from another via torn `statSync`/`readFileSync`.
9. Suppress all sibling-state recovery when one file is transiently unreadable.
10. Return a partial `cleanStaleStates` sweep as if complete.

**Reinforcement chain.** R21-002 (unvalidated hook-state parse) is the gateway. If it stood alone, one corrupt file would produce degraded prompt replay -- annoying but not systemic. But R25-004 extends R21-002 across five hook entrypoints. R28-001 ensures that when R21-002's null return fires, the stop hook re-parses the transcript from offset 0. R29-001 proves the supposed `schemaVersion` guard cannot catch R21-002's drift because the persisted `HookState` has no version field. R33-001 adds a second independent path: even a clean hook-state file can be silently deleted by `clearCompactPrime()` when overlap occurs. R36-001 adds a third: even a clean file on disk can produce torn reads if rename happens between `statSync()` and `readFileSync()`. R31-001 and R33-003 add a fourth: even a clean read can produce corrupted writes because `updateState()` has no persistence check. R38-001 and R38-002 close the recovery and cleanup lanes: a single transient failure aborts the whole sibling scan or cleanup sweep.

The interaction: **ten independent mechanisms all produce the same silent failure signal.** Fix any one in isolation and the other nine continue to produce the failure.

**Severity justification (blast radius).** Cross-runtime (Claude + Gemini + OpenCode all consume the same temp directory); write-side + read-side both affected; prompt-visible + on-disk failure modes; tempdir + continuity + analytics + cleanup all entangled.

**Remediation plan.** Structural refactor S2; ~2 weeks for one engineer.

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| A1 | Add runtime `HookStateSchema` (Zod) validation to `loadState()` and `loadMostRecentState()`; quarantine to `.bad` on validation failure | Medium | R21-002, R25-004, R28-001, R29-001 |
| A2 | Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` + retry loop | Small | R31-001, R31-004 |
| A3 | Add `schemaVersion` field to `HookState`; `loadState()` rejects mismatched versions with distinct `schema_mismatch` reason | Medium | R29-001 |
| A4 | Replace per-session `clearCompactPrime()` with identity-based clear | Small | R33-001 |
| A5 | Re-read mtime after `readFileSync()` in `loadMostRecentState()` and discard candidate if it changed | Small | R36-001 |
| A6 | Per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()`; return `{ removed, skipped, errors }` | Small | R38-001, R38-002 |
| A7 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` | Small | R40-001 |
| A8 | Make `updateState()` return `{ ok, merged, persisted }` and have callers surface persistence failures | Small | R31-001, R33-003 |

**Dependency graph within A:** A1 unblocks A3 (schema versioning requires validation); A2 independent; A4-A7 independent; A8 can be done first and refactored with A1.

### 4.2 P0-candidate-B -- Reconsolidation conflict + complement duplicate/corruption window

**Constituent findings:** R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 (6+2 findings across `reconsolidation-bridge.ts` and `lib/storage/reconsolidation.ts`).

**Attack/failure scenario.** Two concurrent governed `memory_save` requests planning against overlapping candidates can:

1. **Fork lineage** (R35-001) because `insertSupersedesEdge()` deduplicates only by `(source_id, target_id, relation)`; both saves can create distinct successor rows pointing at the same predecessor.
2. **Deprecate a predecessor already superseded** (R31-003 + R32-003) because `executeConflict()` runs a pure `UPDATE ... WHERE id = ?` with no version or scope recheck.
3. **Insert duplicate complement rows** (R34-002) because `runReconsolidationIfEnabled()` runs `vectorSearch` + scope filter before the writer transaction; concurrent duplicates between plan and commit are missed.
4. **Admit or exclude candidates with mixed-source snapshots** (R39-002 + R40-002) because `readStoredScope()` issues a fresh per-candidate `SELECT` outside any transaction; similarity/content come from one snapshot and scope from another.
5. **Generate stale assistive recommendations** (R36-002 + R37-003) because assistive review forms recommendations from a second pre-transaction search that can differ from TM-06 planning.

**Reinforcement chain.** R31-003 (conflict without CAS) is the core corruption engine. Alone it would allow lost updates on conflict -- bad but bounded. R35-001 extends this into forked lineage. R32-003 adds a governance-scope dimension: if the predecessor has been retagged out of scope between search and commit, the conflict proceeds anyway. R34-002 adds the complement path: even without conflict, two saves can both proceed as complement when they should have merged. R36-002 and R37-003 add the assistive-recommendation path. R39-002 and R40-002 add the per-candidate scope-read path.

The interaction: **the conflict path, complement path, and assistive path all make pre-transaction decisions that are authoritative post-transaction.** Merge is the lone well-designed path; the other three all share the same root flaw.

**Severity justification (blast radius).** Permanent data corruption: unlike continuity loss, conflict-fork lineage and duplicate complement rows are written to persistent storage and propagate into every downstream search, causal traversal, and graph-backed retrieval forever. Silent: all five decisions produce success-shaped results. Violates a core invariant: the memory graph's "single active successor per predecessor" invariant is silently broken.

**Remediation plan.** Structural refactor S1; ~3 weeks for one engineer -- the largest single workstream.

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| B1 | Add predecessor `content_hash` + `is_deprecated = FALSE` CAS guard to `executeConflict()`; abort if predecessor already superseded | Medium | R31-003, R35-001 |
| B2 | Move complement decision inside writer transaction, or re-run `vectorSearch()` + scope filter just before insert; fall through to merge/conflict if near-duplicate appeared | Large | R34-002 |
| B3 | Take a single batch snapshot of candidate scopes instead of per-candidate `readStoredScope()` calls; or wrap the scope-filter loop inside the same transaction as the vector search | Medium | R39-002, R40-002 |
| B4 | Assistive review lane re-runs its search inside the writer transaction or flags `advisory_stale: true` when the snapshot predates the commit | Medium | R36-002, R37-003 |
| B5 | Append structured warning `{ code: 'scope_filter_suppressed_candidates', candidates: [...] }` when scope filter drops results | Small | R11-004, R12-003 |

**Dependency graph within B:** B1 independent (most urgent data-corruption guard); B2 requires B1; B3 parallel to B1/B2; B4 after B3.

### 4.3 P0-candidate-C -- Graph-metadata laundering + search boost

**Constituent findings:** R11-002, R13-002, R20-002, R21-003, R22-002, R23-002 (6 findings across `graph-metadata-parser.ts`, `memory-parser.ts`, and the refresh + indexing pipelines).

**Attack/failure scenario.** A malformed modern `graph-metadata.json`:

1. Gets accepted as legacy with `ok: true` (R11-002), because `validateGraphMetadataContent()` retries primary-parse failure through `parseLegacyGraphMetadataContent()` and returns success with no migration marker.
2. Gets fabricated `created_at` / `last_save_at` via `new Date().toISOString()` (R20-002), erasing the original timestamp evidence.
3. Gets reinterpreted through `deriveStatus()` as `planned` / `complete` when `readDoc()` collapses I/O failure into `null` (R13-002).
4. Gets rewritten as canonical current JSON by `refreshGraphMetadataForSpecFolder()` (R21-003), erasing the corruption evidence at the persistence layer.
5. Gets `qualityScore: 1` and empty `qualityFlags: []` assigned by `memory-parser.ts` (R22-002), because the fallback path treats recovery as first-class.
6. Gets +0.12 packet-search boost in stage-1 candidate generation (R22-002 + R23-002), outranking legitimate spec docs.

**Reinforcement chain.** R11-002 (legacy-as-success) is the entry point. Alone it would produce "silent legacy acceptance" -- a documentation gap at worst. R20-002 stamps the legacy-recovered content with freshly-minted timestamps, erasing the original timestamp evidence. R13-002 adds a separate path: transient I/O failures produce `status: 'planned'`/`'complete'`. R21-003 rewrites the recovered content as canonical current JSON at the persistence layer. R22-002 assigns `qualityScore: 1` and empty `qualityFlags: []`. R23-002 completes the pipeline by applying +0.12 boost in stage-1 candidate generation.

The interaction: **six independent layers erase the corruption signal AND upgrade retrieval priority**. This is why "laundering" is the accurate term -- the corrupt input gets laundered through the pipeline into a stronger contract than the input justified.

**Severity justification (blast radius).** State laundering = consent-boundary violation (callers authorize a "refresh" operation and receive a stronger contract than the input justified). Retrieval priority upgrade on corrupt content. Multi-surface entanglement across six layers.

**Remediation plan.** Structural refactor S3; ~1 week for one engineer.

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| C1 | `validateGraphMetadataContent()` returns `{ ok: true, metadata, migrated: boolean, migrationSource?: 'legacy' }`; consumers propagate `migrated` all the way through `memory-parser` and ranking | Medium | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 |
| C2 | Preserve original current-schema validation errors in returned diagnostic set when legacy fallback also fails | Small | R18-002 |
| C3 | Distinguish `readDoc()` I/O failure from "file does not exist"; propagate I/O failure as `status: 'unknown'` rather than `planned`/`complete` | Small | R13-002 |
| C4 | `refreshGraphMetadataForSpecFolder()` preserves `migrated` marker in rewritten JSON; indexing layer penalizes (not boosts) `migrated=true` rows until human review | Small | R21-003, R22-002 |
| C5 | Stage-1 candidate generation refuses to apply +0.12 boost to `migrated=true` or `qualityScore: 1` rows (or reduces boost to +0.04) | Small | R22-002, R23-002 |

**Dependency graph within C:** C1 prerequisite for all others. C2-C5 can run in parallel after C1.

### 4.4 P0-candidate-D -- TOCTOU cleanup erasing fresh state under live session load

**Constituent findings:** R40-001, R38-001, R33-002, R37-001 (4 findings across `hook-state.ts` and `session-stop.ts`).

**Attack/failure scenario.** A routine finalize sweep overlapping with a live session can:

1. Delete a freshly-written session state (R40-001) because `cleanStaleStates()` stats an old file, a live writer renames a new generation onto the same path, and then `unlinkSync()` deletes the fresh generation -- all while reporting a normal `removed` count.
2. Make the next `loadMostRecentState()` return `null` for all consumers (R38-001) because the scan has a single `try/catch` wrapping the whole loop and any bad sibling aborts everything.
3. Re-parse transcript from offset 0 (R37-001 + R28-001) because the next stop hook sees `lastTranscriptOffset: 0` sentinel and has no state to override it.
4. Compound via overlap-induced offset regression (R33-002) if two stop hooks intersect.

**Reinforcement chain.** R40-001 (TOCTOU cleanup) is the trigger. Alone it produces "sometimes cleanup deletes a fresh file." R38-001 ensures that after R40-001 deletes the fresh state, the next `loadMostRecentState()` likely returns `null`. R37-001 ensures that when `loadState()` returns null, the `storeTokenSnapshot()` path writes a transient `lastTranscriptOffset: 0` sentinel. R33-002 ensures that without a `Math.max()` monotonicity guard, the re-parsed offset can stick.

The interaction: **a routine `--finalize` cleanup + one concurrent stop hook + one bad sibling file + one subsequent stop hook = continuity loss + inflated token counts + indistinguishability from cold start**. None of the four constituent findings is independently P0-worthy; together they are a systemic failure triggered by normal maintenance.

**Severity justification (blast radius).** Triggered by normal maintenance (not abnormal concurrent write). Failure signal is further from damage: cleanup returns `removed: N` (looks normal), next startup looks like cold start (looks normal), transcript re-parse inflates token counts (looks like "just high usage"). Operator has to correlate three unrelated anomalies to detect the problem. Continuity loss is irreversible for that session.

**Remediation plan.** Small; ~2 days for one engineer, mostly in `hook-state.ts`.

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| D1 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` (re-stat or open+fstat) | Small | R40-001 |
| D2 | Per-file error isolation in `loadMostRecentState()`; continue on individual failure; expose `errors[]` to debug log | Small | R38-001 |
| D3 | Per-file error isolation + richer return type in `cleanStaleStates()`: `{ removed, skipped, errors }` | Small | R38-002 |
| D4 | Eliminate transient `lastTranscriptOffset: 0` sentinel in `storeTokenSnapshot()`; carry final offset through to `recordStateUpdate()` | Small | R37-001 |
| D5 | Add `Math.max()` monotonicity guard on `metrics.lastTranscriptOffset` in `updateState()` | Small | R33-002 |

**Dependency graph within D:** D1-D5 are all independent small changes. Can be done in one sprint.

### 4.5 Watch priorities

**Watch-priority-1: Domain 4 routing misdirection chain.** Constituent findings: R46-001 + R43-001/R44-001 + R42-002 + R41-003 + R46-002. The chain currently has one confirmed concrete step (R46-001: `/spec_kit:deep-research` -> `command-spec-kit` 0.95) but whether that mis-route completes into file-modifying behavior depends on whether `command-spec-kit` enforces Gate 3 independently of skill routing. Upgrade trigger: if Phase 017 reveals that `command-spec-kit` proceeds into spec-folder creation when invoked via bridge with `/spec_kit:deep-research` intent, upgrade to P0-candidate-E. Fix at A0 + A2 (subcommand bridge + `intent_signals` wiring); ~3-day change.

**Watch-priority-2: Playbook runner `Function(...)` trust-boundary expansion.** Constituent findings: R41-004 + R45-004 + R46-003 + R50-002. The playbook runner operates in development/CI rather than production. However, the trust boundary has expanded from "repository-owned markdown" to "repository markdown + live tool-return values" (R46-003). If CI environment is ever expanded to include external handler payloads, severity escalates. Upgrade trigger: any change that allows externally-influenced tool outputs to reach the playbook runner's `runtimeState.lastJobId`. Fix is Chain C (typed step executor); ~1 week.

---

## 5. Systemic themes (strongest signal across all domains)

Phase 016 surfaced ~12 cross-cutting systemic patterns. The five with strongest signal and architectural leverage are detailed here.

### 5.1 Success-shaped envelope masking skip / defer / partial / failed state

**Files affected (>=5).** `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts`, `graph-metadata-parser.ts`.

**Representative findings.** R8-001, R12-001, R13-004, R17-002, R21-001, R11-002.

**Why systemic.** The pattern appears in every save-path, every query-path, and every cross-boundary response layer. Callers cannot mechanically recover ground truth from return values. Log-scraping or re-running work becomes the only recovery path.

**Architectural fix.** Introduce a uniform result shape:
```ts
type OperationStatus = 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial';
type OperationResult<T> = {
  status: OperationStatus;
  reason?: string;
  attempts?: number;
  persistedState?: T;
  warnings?: StructuredWarning[];
};
```
Apply this shape to `enrichmentStatus`, `autosaveOutcome`, `responseBuilder.postInsertEnrichment`, `reconsolidationResult`, and `graphMetadataRefreshResult`. This is ~2 weeks of structural refactoring (M13) that resolves ~15 findings. The hardest part is not the code change; it's migrating the regression tests that assert all-true booleans.

### 5.2 Pre-transaction read-then-mutate (snapshot before lock, no re-read at commit)

**Files affected.** `hook-state.ts` + `session-stop.ts`; `reconsolidation-bridge.ts` + `reconsolidation.ts`; `graph-metadata-parser.ts`.

**Representative findings.** R31-001, R31-002, R31-003, R31-004, R34-002, R35-001, R39-002, R40-002.

**Why systemic.** The bug class is not "missing locks." It is "decisions made from stale snapshots and then authoritative after the lock is acquired." Atomic rename and SQLite `writeTransaction` both prevent byte-level torn writes; neither prevents stale-decision commits.

**Architectural fix.** Three principles:
1. **CAS at commit.** Every write that depends on a prior read must include a version or hash guard at the commit step.
2. **Same-transaction re-read.** Decisions made on shared DB rows must be re-read inside the writer transaction, not computed outside and trusted at commit.
3. **Single-snapshot batched reads.** When a planning step needs N rows, take them all in one batched query, not N separate per-candidate queries.

This refactoring is the core of P0-candidate-B remediation (Chain B / S1) and is ~3 weeks. It also resolves parts of P0-candidate-A (HookState `updateState` needs a CAS pattern).

### 5.3 Collapsed state vocabulary (missing / empty / stale / degraded)

**Files affected.** `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts`.

**Representative findings.** R9-001, R22-001, R23-001, R26-001, R30-001, R30-002.

**Why systemic.** The runtime has richer state internally than it exposes. `trustStateFromGraphState()` and `trustStateFromStructuralStatus()` both collapse `missing` and `empty` into `stale`. `OpenCode transport` renders only the collapsed envelope label. Hookless consumers see the dishonest label, NOT the richer sibling contract that already exists in the response payload.

**Architectural fix.** Introduce `absent` and `unavailable` as distinct labels from `stale`:
- `live` = graph exists, fresh data, ready to query
- `stale` = graph exists, data may be outdated, query still valid
- `absent` = graph does not exist for this scope
- `unavailable` = graph should exist but is inaccessible (I/O error, lock held, etc.)

Migrate `trustStateFromGraphState`, `trustStateFromStructuralStatus`, the transport renderer, bootstrap/resume/health consumers, and test fixtures. Medium-to-large effort (~1.5 weeks; M8). Unblocks R26-001, R30-001, R30-002, R26-002 in one coherent change.

### 5.4 Governance signal amnesia

**Files affected (unified pattern).** `skill_advisor.py`, `skill_advisor_runtime.py`, `skill_graph_compiler.py`, SKILL.md files, `graph-metadata.json` files, `manual-playbook-runner.ts`, `AGENTS.md`, `/spec_kit:*` YAML assets.

**Representative findings.** R43-001, R44-001, R44-002, R45-001, R45-003, R45-004, R46-001, R46-002, R47-002, R48-001, R49-001, R49-003.

**Why systemic.** Every transition from one governance layer to the next silently reduces signal fidelity without any log, test failure, or error code. (See the 11-layer amnesia table in section 2.4 above.)

**Architectural fix.** Each transition must either (a) assert that the artifact was faithfully forwarded and consumed, or (b) explicitly log that it was intentionally dropped. Neither currently applies to any row in the table. The fix is not a single code change; it is a system-wide design principle:

1. Every compile-time artifact must have a checksum or provenance marker preserved through load.
2. Every load-time map must have a consumer or be documented as intentionally inert.
3. Every classifier must have a typed enum vocabulary, not prose.
4. Every validator must have a test that proves it catches the invariants it claims to check.

Implementation is iterative: S4, S5, S6, S7 address specific rows of the table. The full refactor is ~4 weeks.

### 5.5 Deterministic / shared temp path under concurrency

**Files affected.** `hook-state.ts` (`.tmp` deterministic), `graph-metadata-parser.ts` (pid+Date.now ms precision), command YAMLs, runtime root docs, `data-loader.ts` error contract.

**Representative findings.** R31-001, R31-004, R31-005, R35-003, R36-003, R32-005.

**Why systemic.** The `/tmp/save-context-data.json` hazard is taught at **four independent surfaces**: command YAMLs, runtime root docs, `data-loader.ts` runtime error message, and command assets. Removing it from one surface leaves three others to re-propagate the same hazard. Additionally, the `.tmp` deterministic suffix in `hook-state.ts` and the pid+Date.now ms-precision suffix in `graph-metadata-parser.ts` both have byte-level collision risks.

**Architectural fix.** Two-part change:
1. **Remove `/tmp/save-context-data.json` from all four surfaces.** (AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md; four command YAMLs; `data-loader.ts` `NO_DATA_FILE` error text; `generate-context.ts` CLI help stays preferring `--stdin`/`--json`.) This is ~1 day of doc editing.
2. **Replace deterministic temp suffixes with `.tmp-<pid>-<counter>-<random>`.** One-line change in `hook-state.ts:saveState()` and `graph-metadata-parser.ts:writeGraphMetadataFile()`. ~2 hours.

---

## 6. Deduplication clusters

The 137 raw findings compress to approximately **63 distinct issues** after merging. Each cluster below represents a canonical issue; the iteration IDs show where the issue was independently discovered.

| Cluster | Iterations | Canonical ID(s) | Summary |
| ------- | ---------- | --------------- | ------- |
| startup-brief scope-less `loadMostRecentState()` | R1-001, R2-001, R4-001 | R1-001 | `buildSessionContinuity()` calls `loadMostRecentState()` with no scope |
| hook-state directory-level single-try | R2-002, R4-002, R38-001 | R2-002 + R38-001 | One malformed file aborts entire directory scan |
| code-graph/query.ts readiness fails open | R3-002, R11-003, R22-001, R23-001, R25-002, R27-002 | R3-002 | `ensureCodeGraphReady()` exceptions swallowed; empty query results indistinguishable from absence |
| post-insert.ts enrichmentStatus boolean collapse | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R21-001, R25-001, R27-001 | R8-001 | Single status-true flag conflates four different outcomes |
| graph-metadata-parser legacy-as-success laundering | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 | R11-002 + R21-003 | Malformed JSON laundered into canonical artifact with fresh timestamps |
| reconsolidation-bridge scope-filter silent drop / throws | R11-004, R12-003, R13-004, R16-002, R19-002 | R11-004 + R13-004 | Filter drops candidates with no warning; errors fall through to normal create |
| hook-state.ts unvalidated JSON.parse | R21-002, R23-003, R24-002, R25-004, R28-001, R28-002, R29-001 | R21-002 | `JSON.parse(raw) as HookState` feeds 5 hook entrypoints across Claude + Gemini |
| session-stop.ts unlocked RMW + autosave races | R31-001, R31-002, R32-001, R32-002, R33-002, R33-003, R34-001, R35-002, R37-001, R37-002 | R31-001 + R31-002 | Split-brain stop-hook state across multiple `recordStateUpdate()` calls |
| trustStateFromStructuralStatus missing->stale collapse | R9-001, R26-001, R30-001 | R9-001 | `missing` + `empty` collapse into `stale` |
| opencode-transport drops richer trust axes | R9-002, R30-002 | R30-002 | Shape-only validation; transport layer drops richer structural truth |
| Compact-cache identity-free cleanup | R33-001 | R33-001 | `clearCompactPrime()` clears by session ID only |
| Reconsolidation conflict multi-successor fan-out | R31-003, R32-003, R35-001 | R31-003 + R35-001 | Conflict lane not single-winner; forking lineage |
| Complement / assistive pre-transaction snapshots | R34-002, R36-002, R37-003 | R34-002 + R36-002 + R37-003 | Complement: stale-search duplicate window; assistive: pre-transaction snapshot |
| /tmp/save-context-data.json shared path taught at 4 surfaces | R31-005, R32-005, R35-003, R36-003 | R31-005 + R35-003 | Documented cross-runtime collision by design |
| Hook-state loader torn read | R36-001 | R36-001 | stat-then-read race across concurrent rename |
| cleanStaleStates single-try sweep + TOCTOU | R38-002, R40-001 | R38-002 + R40-001 | All-or-nothing sweep + stat-then-unlink race |
| Governed-scope mixed-snapshot candidate universe | R39-002, R40-002 | R39-002 (with R40-002 extension) | Per-candidate scope read outside writer transaction |
| Gate 3 false-positive for read-only research | R45-001, R47-001 | R45-001 + R47-001 | Trigger list includes verbs reused by read-only prompts |
| Gate 3 false-negatives (memory-save, deep-research resume) | R48-001, R49-001, R50-001 | R49-001 + R50-001 | Trigger list omits real write-producing flows |
| skill_graph_compiler.py topology warnings non-durable | R45-003 | R45-003 | Warnings emitted then dropped from serialized graph |
| Manual playbook runner parse/coverage dishonesty | R41-004, R42-003, R45-004, R46-003, R50-002 | R45-004 + R46-003 + R50-002 | `Function(...)` eval + silent drop + dialect drift in live corpus |
| Skill routing COMMAND_BRIDGES prefix collapse | R46-001 | R46-001 | `/spec_kit:*` collapsed to `command-spec-kit` at `kind_priority=2` |
| Unilateral conflicts_with -> bilateral penalty | R46-002 | R46-002 | Bilateral penalty application with no validator gate |
| folder_state / start_state two-vocabulary split | R47-002 | R47-002 | Top-level docs collapse two-vocabulary state machine |
| when: key overloaded predicate + prose | R48-002, R49-002 | R49-002 | Same key carries both boolean-like predicates and free-form narrative |
| Dependency-cycle validator only covers 2-node | R49-003 | R49-003 | Longer `depends_on` loops pass `--validate-only` |
| intent_signals / keyword comments discarded at scoring | R43-001, R44-001, R44-002 | R43-001 + R44-001 + R44-002 | `signals` map populated but no consumer in `analyze_request()` |

Full registry with file-level hit counts and dedup metadata is in `findings-registry.json`.

---

## 7. Remediation backlog

### 7.1 Quick wins (Small effort, <1 day each, <=3 file edits, <100 LOC)

Ordered by findings-addressed leverage:

| # | Change | Findings | Est. |
| - | ------ | -------- | ---- |
| 1 | Wire `intent_signals` from `signals` map into `analyze_request()` scoring | R43-001, R44-001 | 2h |
| 2 | Extend `COMMAND_BRIDGES` with per-subcommand entries for all `/spec_kit:*` subcommands | R46-001 | 2h |
| 3 | Extend `parse_frontmatter_fast()` to capture `<!-- Keywords: ... -->` comment blocks | R44-002 | 2h |
| 4 | Serialize topology warning payloads into compiled graph; expose in `health_check()` | R45-003 | 2h |
| 5 | Add `conflicts_with` reciprocity check to `validate_edge_symmetry()` | R46-002 | 1h |
| 6 | Extend `validate_dependency_cycles()` to detect arbitrary-length cycles | R49-003 | 3h |
| 7 | Assert `parsedCount == filteredCount` in playbook runner before coverage computation | R45-004 | 2h |
| 8 | Reject invalid `edgeType` in `code-graph/query.ts` with `status: "error"` | R12-002, R14-002 | 1h |
| 9 | Add `Math.max()` offset monotonicity guard in `hook-state.ts` `updateState()` | R33-002 | 1h |
| 10 | Remove `/tmp/save-context-data.json` from `AGENTS.md`/`CLAUDE.md`/`CODEX.md`/`GEMINI.md` | R35-003 | 1h |
| 11 | Update `data-loader.ts` `NO_DATA_FILE` error text to teach `--stdin` / `--json` | R36-003 | 1h |
| 12 | Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` in `hook-state.ts` | R31-001, R31-004 | 1h |
| 13 | Validate outline subject path via `resolveSubjectFilePath()` before `queryOutline()` | R13-003 | 1h |
| 14 | Stop swallowing `ensureCodeGraphReady()` exceptions; surface as `status: "error"` | R3-002, R22-001, R23-001, R25-002, R27-002 | 2h |
| 15 | Use unique temp filenames in `graph-metadata-parser.ts:writeGraphMetadataFile()` | R31-004, R32-004 | 1h |
| 16 | Guard `blast_radius` against unresolved subjects; return `status: "error"` if resolution fails | R11-003 | 1h |
| 17 | Flag dangling edges as corruption in `code-graph/query.ts` payload | R17-001 | 1h |
| 18 | Validate `SharedPayloadKind`/`producer` at runtime (not just TypeScript) | R9-002 | 1h |
| 19 | Add `handleSessionHealth()` structural-trust section | R26-002 | 1h |
| 20 | Identity-based `clearCompactPrime()` (check `cachedAt` or `opaqueId` before nulling) | R33-001 | 2h |
| 21 | Eliminate transient zero-offset sentinel in `storeTokenSnapshot()` | R37-001 | 2h |
| 22 | Add `autosaveOutcome` field to `SessionStopProcessResult` | R39-001 | 2h |
| 23 | Gate `touchedPaths` on confirmed persist | R35-002 | 1h |
| 24 | Per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()` | R38-001, R38-002 | 2h |
| 25 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` | R40-001 | 2h |
| 26 | Align `spec_kit_plan_auto.yaml` `folder_state` vocabulary with `intake-contract.md` | R41-001 | 1h |
| 27 | Promote `skill_graph_compiler.py` topology checks to hard errors | R41-003 | 2h |
| 28 | Mark `start_state` vs `folder_state` vocabulary boundary in YAML assets with explicit comments | R47-002 | 1h |
| 29 | Document that `producerMetadataWritten`, `touchedPaths` are attempted-write signals (or remove them) | R34-001, R35-002 | 30m |

**Total quick-win effort: ~50h = ~1 engineer-week** for 29 isolated fixes that address ~40 of the ~63 distinct findings.

### 7.2 Medium refactors (1-5 days each)

| # | Change | Findings | Est. |
| - | ------ | -------- | ---- |
| M1 | Add runtime `HookStateSchema` (Zod) validation; quarantine to `.bad` on failure | R21-002, R25-004, R28-001, R29-001 | 3d |
| M2 | Add `schemaVersion` field to `HookState` + migration step | R29-001 | 2d |
| M3 | Collapse three separate `recordStateUpdate()` calls in `processStopHook()` into single atomic patch | R31-002, R32-002 | 2d |
| M4 | Refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()` | R37-002 | 1d |
| M5 | Add predecessor `content_hash` + `is_deprecated = FALSE` CAS guard to `executeConflict()` | R31-003, R35-001, R32-003 | 3d |
| M6 | Wrap per-candidate `readStoredScope()` inside same transaction as vector search | R39-002, R40-002 | 2d |
| M7 | `validateGraphMetadataContent()` returns `{ ok, metadata, migrated, migrationSource? }` | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 | 3d |
| M8 | Trust-state vocabulary expansion: introduce `absent`/`unavailable` distinct from `stale` | R9-001, R26-001, R30-001, R30-002 | 4d |
| M9 | Replace `Function(...)()` eval in `manual-playbook-runner.ts` with typed step executor + schema-validated arg parser | R41-004, R46-003, R50-002 | 4d |
| M10 | Extract Gate 3 trigger classification into shared module / JSON schema | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 | 4d |
| M11 | Define `BooleanExpr` schema for YAML `when:` predicates | R42-001, R43-002, R44-003, R48-002, R49-002 | 4d |
| M12 | Add disambiguation tier to `analyze_request()` for deep-research vs review prompts | R45-002 | 2d |
| M13 | Replace `enrichmentStatus` boolean record with enum-valued `OperationResult<T>` map | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001 | 5d |

**Total medium-refactor effort: ~40d = ~8 engineer-weeks.**

### 7.3 Structural refactors (1-2 weeks each)

| # | Change | Findings | Est. |
| - | ------ | -------- | ---- |
| S1 | **Transactional reconsolidation** | R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 | 2w |
| S2 | **HookState schema versioning + runtime validation + unique temp paths + CAS in updateState** | R21-002, R25-004, R28-001, R29-001, R31-001, R31-002, R32-001, R32-002, R33-001, R33-002, R33-003, R34-001, R35-002, R36-001, R37-001, R37-002, R38-001, R38-002, R40-001 | 2w |
| S3 | **Graph-metadata migration propagation** | R11-002, R13-002, R20-002, R21-003, R22-002, R23-002, R25-003 | 1w |
| S4 | **Skill routing trust-chain** | R43-001, R44-001, R44-002, R42-002, R46-001, R46-002, R45-003, R45-002 | 1w |
| S5 | **Gate 3 typed intent classifier** | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 | 1.5w |
| S6 | **Playbook runner trust-boundary isolation** | R41-004, R42-003, R45-004, R46-003, R50-002 | 1.5w |
| S7 | **`when:` YAML predicate typed grammar** | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 | 1.5w |

**Total structural-refactor effort: ~10.5w = ~2.5 engineer-months.** S1 and S2 can run in parallel (different files). S4 can run in parallel with S1/S2 (skill-advisor vs mcp_server). S5, S6, S7 are independent.

### 7.4 Dependency graph

```
QUICK WINS (29 items, 1 engineer-week, parallel)
  |
  +-- unblocks -->
  |
  v
MEDIUM REFACTORS
  M1 -------> M2 (schema versioning needs validation)
  M7 -------> M8 (migration needs vocabulary expansion)
  M13 -------> S1 (enum status needed for transactional recon)
  |
  v
STRUCTURAL REFACTORS
  S2 (HookState overhaul) depends on M1, M2, M3, M4
  S1 (transactional recon) depends on M5, M6, M13
  S3 (migration propagation) depends on M7
  S4 (skill routing) independent of S1-S3
  S5 (Gate 3 classifier) independent
  S6 (playbook runner) depends on M9, M10
  S7 (YAML predicates) depends on M11
```

---

## 8. Phase 017 kickoff plan

### 8.1 Recommended P0 fix order

**Month 1 (Week 1-4): P0-candidates D, A, C (parallel).**

- **Week 1-2 (1 engineer):** P0-candidate-D -- TOCTOU cleanup. Smallest, most isolated, highest operational frequency. Quick wins #24, #25, #9, #21, #22 + new TOCTOU + all-or-nothing + zero-offset-sentinel tests. Unblocks parts of S2.
- **Week 1-4 (1 engineer):** P0-candidate-A -- HookState + cross-runtime tempdir. M1 + M2 + M3 + M4 + quick wins #12, #20, #23, #29. S2 structural refactor completes end of Week 4.
- **Week 2-4 (1 engineer):** P0-candidate-C -- Graph-metadata laundering. M7 + C1-C5. Affects search ranking so user-visible impact on retrieval quality.

**Month 2 (Week 5-8): P0-candidate-B + Domain-4 routing chain (parallel).**

- **Week 5-6 (2 engineers):** P0-candidate-B -- Transactional reconsolidation. S1 structural refactor: M5 + M6 + conflict CAS + complement-inside-tx + assistive-in-tx. Largest single workstream; two engineers to parallelize test-migration work.
- **Week 5-7 (1 engineer):** S4 skill routing trust chain. Quick wins #1, #2, #3, #4, #5, #6 completed first; medium item M12; structural items S4. Fixes watch-priority-1 routing chain.
- **Week 7-8 (1 engineer):** S5 Gate 3 typed classifier. Address R41-002 / R45-001 / R47-001 / R48-001 / R49-001 / R50-001 in one coherent refactor.

**Month 3 (Week 9-12): Domain-4 remainder + documentation/regression cleanup.**

- **Week 9-10 (1 engineer):** S6 playbook runner isolation + S7 YAML predicate grammar. Completes Domain 4 structural fixes.
- **Week 10-11 (1 engineer):** M8 trust-state vocabulary expansion (`absent`/`unavailable` distinct from `stale`).
- **Week 11-12 (1 engineer):** M13 enum status refactor. Last structural piece.

### 8.2 Effort budget summary

| Workstream | Engineers | Duration | Total engineer-weeks |
| ---------- | --------- | -------- | -------------------- |
| P0-candidate-D (TOCTOU cleanup) | 1 | 2w | 2 |
| P0-candidate-A (HookState) | 1 | 4w | 4 |
| P0-candidate-C (Graph-metadata laundering) | 1 | 3w | 3 |
| P0-candidate-B (Transactional reconsolidation) | 2 | 2w | 4 |
| S4 Skill routing chain | 1 | 3w | 3 |
| S5 Gate 3 classifier | 1 | 2w | 2 |
| S6 Playbook runner | 1 | 1.5w | 1.5 |
| S7 YAML predicates | 1 | 1.5w | 1.5 |
| M8 Trust-state vocabulary | 1 | 1.5w | 1.5 |
| M13 Enum status | 1 | 2w | 2 |
| **Total** | 3 avg | 12w | **24.5** |

**Total effort estimate: ~24.5 engineer-weeks (6 engineer-months). Parallelizable to ~12 weeks wall clock with 3 engineers.**

### 8.3 Risks and open questions for Phase 017 planning

1. **Does `command-spec-kit` enforce Gate 3 independently of skill routing?** (Determines whether Watch-priority-1 becomes P0-candidate-E.) Resolve in Phase 017 Week 1.
2. **Are the existing regression tests that encode degraded contracts intentionally protecting compatibility, or are they oversights?** Resolve before starting S1 / S2 / S3.
3. **Can `HookState` gain a `schemaVersion` field without breaking already-quiesced state files?** Open question from iteration 32; still unresolved.
4. **What is the actual concurrent-writer surface at runtime?** Seven distinct interleavings characterized by iteration 38; real-load measurement still missing. A 2-day measurement pass before S1/S2 would size the actual blast radius.
5. **Which `/spec_kit:*` subcommands currently exist and need bridge entries?** Enumerate: `plan`, `complete`, `implement`, `deep-research`, `deep-review`, `resume`.

---

## 9. Research quality review

### 9.1 Was 50 iterations the right stopping point?

**Yes, with caveats.** Signal density dropped after iteration 47, and the novel-finding rate collapsed in the last three iterations: iterations 48-50 together surfaced 4-5 additional findings compared to ~11 findings between iterations 44-47. This matches the research-loop convergence pattern.

However, Domain 5 was never run as a dedicated pass. The subsidiary Domain-5 evidence in every iteration is extensive, but a targeted pass on test-coverage gaps would have produced a more structured coverage-regression inventory. Recommendation: Phase 017 should do a 5-iteration Domain-5 pass in parallel with P0-candidate-A remediation to codify the new tests before they are needed.

### 9.2 Coverage gaps

Surface-level coverage. The following files were touched but not deeply audited:

- `mcp_server/lib/code-graph/ensure-ready.ts` -- Iteration 5 hinted at partial-persistence fail-open but did not confirm whether `setLastGitHead()` on partial success actually blocks later stale detection for unpersisted files.
- `mcp_server/handlers/code-graph/context.ts` -- Iteration 5 hinted at readiness-fail-open inheritance from `code_graph_query` but not fully audited.
- `mcp_server/lib/search/graph-lifecycle.ts` -- `onIndex()` returns `{ skipped: true }` under three different conditions; whether they are all semantically equivalent is not established.
- `mcp_server/lib/storage/reconsolidation.ts:executeMerge()` -- known to have CAS for `updated_at` + `content_hash`; whether it also checks governance scope is not confirmed (R32-003 hints no).
- `mcp_server/lib/search/entity-linker.ts:527-550,608-640,1096-1132` -- R7-002 identified soft-fail + subsequent stale-row linking; cross-memory blast radius or per-memory containment not investigated.
- `mcp_server/handlers/memory-save.ts:2159-2171,2250-2304` -- R34-002 hypothesized timeline between reconsolidation planning and `writeTransaction` acquisition; not measured under real load.
- `mcp_server/hooks/claude/shared.ts:109-123` -- R10-002 identified prompt-injection risk via `]` or newline in `producer` string; exploitability not confirmed.
- `mcp_server/hooks/claude/compact-inject.ts:393-407,416-422` -- R31-001 flagged concurrent producer risk; precise interleaving with Claude session-stop + Gemini session-stop not characterized.
- `command/spec_kit/assets/spec_kit_complete_auto.yaml` / `spec_kit_implement_auto.yaml` / `spec_kit_deep-review_auto.yaml` -- sampled at iteration 48/50 but not systematically audited for the same `when:`/`folder_state` vulnerabilities.
- `scripts/memory/generate-context.js` trigger-word surface for memory category / triggers / scope -- proposed but not investigated.
- Handover-state routing rules (`handover_state` enum) -- proposed but not investigated.
- `opencode.json` + `.utcp_config.json` MCP naming contracts -- proposed but not investigated.

**Recommended follow-up.** Phase 017 Week 1 should do a 2-day "closing pass" on these 11 files before structural refactors start, to avoid discovering additional P1/P2 findings mid-refactor.

### 9.3 Weaker findings that need verification before acting on them

- **R34-002 (complement duplicate window).** Hypothesized but not stress-tested. Construct a two-concurrent-save regression.
- **R35-001 (conflict fork).** Hypothesized multi-successor fan-out. Construct a two-concurrent-conflict regression.
- **R33-001 (compact prime identity race).** Construct a read/write/clear overlap on `pendingCompactPrime`.
- **R40-001 (cleanup TOCTOU).** Construct a save-between-stat-and-unlink interleave.
- **R46-003 (`Function(...)` eval with `lastJobId`).** Construct a scenario with an adversarial `lastJobId` containing JavaScript injection syntax.

For each: a ~30-minute test-harness construction should convert hypothesis into confirmed exploit before committing a structural fix.

### 9.4 Would more iterations have added value?

**Not to the Domain-1 through Domain-4 findings.** Signal density dropped after iteration 47; iterations 48-50 mostly refined or consolidated existing findings. 50 was near the right stopping point for those domains.

**Yes for Domain 5.** A dedicated 5-10 iteration pass on test coverage gaps would have produced a concrete regression harness inventory, sized the test-migration cost precisely, and identified any additional "dishonest contract" tests beyond the 8 already known.

**Partially for the closing pass.** ~2 additional iterations focused on the 11 untouched files would likely surface 3-5 additional P1/P2 findings. Not enough to change the remediation plan materially but sufficient to close the "we might find something new during fixing" risk.

---

## 10. Severity distribution

### 10.1 By domain (raw findings)

| Domain | P1 raw | P2 raw | Total raw | Distinct | Peak iter | Signal trajectory |
| ------ | ------ | ------ | --------- | -------- | --------- | ----------------- |
| Foundational (1-10) | 18 | 4 | 22 | 10 | Iter 5, 8, 10 | Establishing |
| D1 (11-20) | 12 | 21 | 33 | 14 | Iter 13, 17 | High density |
| D2 (21-30) | 17 | 7 | 24 | 11 | Iter 21, 24, 30 | Laundering + self-contradictory payloads novel |
| D3 (31-40) | 17 | 13 | 30 | 14 | Iter 33, 35, 37, 40 | Layered: byte, snapshot, TOCTOU |
| D4 (41-50) | 11 | 17 | 28 | ~14 | Iter 43, 45, 46 | Invisible-discard breakthrough |

### 10.2 By severity (distinct after dedup)

| Severity | Count | % of ~63 distinct |
| -------- | ----- | ----------------- |
| P0 (individual) | 0 | 0% |
| P0 (escalation candidates) | 4 confirmed + 1 watch-p1 + 1 watch-p2 | -- |
| P1 (distinct) | ~33 | ~52% |
| P2 (distinct) | ~30 | ~48% |

### 10.3 By file (top 10 by distinct-issue count)

| Rank | File | Distinct | Domains | Dominant pattern |
| ---- | ---- | -------- | ------- | ---------------- |
| 1 | `hooks/claude/session-stop.ts` | 10 | D1, D2, D3 | Split-brain autosave + success-shaped durability signals |
| 2 | `hooks/claude/hook-state.ts` | 9 | D2, D3 | Unlocked RMW + TOCTOU + unvalidated parse |
| 3 | `handlers/save/reconsolidation-bridge.ts` | 8 | D1, D3 | Pre-transaction snapshots driving conflict/complement/assistive |
| 4 | `handlers/save/post-insert.ts` | 6 | D1, D2 | `enrichmentStatus` boolean collapse |
| 5 | `handlers/code-graph/query.ts` | 6 | D1, D2 | Readiness fail-open + vocabulary divergence |
| 6 | `skill_advisor.py` | 5 | D4 | Invisible-discard + prefix collapse |
| 7 | `manual-playbook-runner.ts` | 4 | D4 | `Function(...)` eval + silent drop + inconsistent argument dialects |
| 8 | `skill_graph_compiler.py` | 4 | D4 | Advisory validation + warning amnesia + 2-node-only cycle check |
| 9 | `lib/graph/graph-metadata-parser.ts` | 4 | D1, D2, D3 | Legacy laundering + temp-path collision |
| 10 | `spec_kit_plan_auto.yaml` / `_confirm.yaml` | 4 | D4 | `when:` overload + untyped boolean DSL + vocabulary fragmentation |

---

## 11. Per-file deep dives

This section provides a file-by-file walk through the 10 most-cited surfaces, integrating the iteration-level findings into a single story per file. For each file: the top-level thesis, 2-3 anchor findings with quoted line numbers, the downstream consumers affected, and the recommended remediation entry point.

### 11.1 `mcp_server/hooks/claude/session-stop.ts` (10 distinct issues)

**File thesis.** `session-stop.ts` is the highest-leverage continuity-capture surface in the runtime. It runs at every Claude session stop; it must persist transcript fingerprints, producer metadata, spec-folder detection, and session summary to hook-state; it must trigger `runContextAutosave()` to commit the session summary to a spec-folder packet. Phase 016 found 10 distinct issues spanning fail-open patterns (D1), state contract honesty (D2), and concurrency (D3). The dominant pattern is **split-brain state** -- the stop hook makes three independent `recordStateUpdate()` calls plus a final disk reload, so the in-memory result flags can disagree with the persisted state.

**Anchor findings.**

1. **R1-002 -- `'unknown'` sessionId collision** (`session-stop.ts:60-105, 240-309`). `input.session_id ?? 'unknown'` collapses missing values onto a shared `'unknown'` bucket, and `hook-state.ts` derives the state filename solely from sessionId (`hook-state.ts:68-70`). A malformed or partial hook payload therefore reads and writes the same shared bucket, allowing one session's `lastSpecFolder` or `sessionSummary` to bleed into another session's resume/startup flow or autosave target. Test coverage (`tests/hook-state.vitest.ts`, `tests/hook-session-stop.vitest.ts`, `tests/hook-session-stop-replay.vitest.ts`) only covers named-session paths and never exercises the shared `'unknown'` bucket.
2. **R14-001 -- Transient zero-offset sentinel** (`session-stop.ts:175-193, 257-268, 274-276`). `storeTokenSnapshot` writes `lastTranscriptOffset: 0` before producer metadata builds; any later catch block swallows failure. Committed offset can remain at 0; next stop hook re-parses full transcript; duplicate token accounting. This is one of three independent mechanisms that produce duplicate token accounting (the others are R37-001 overlap re-parse and R33-002 monotonicity gap).
3. **R15-001 -- Transcript retargeting silently rewrites autosave destination** (`session-stop.ts:61-77, 281-309`). Transcript-driven retargeting reads the final 50 KB of the transcript to detect `@spec-folder` mentions; if the mention is drifted or false, autosave writes to the wrong packet. I/O failure collapses into same "ambiguous" path as normal ambiguity (R15-003).
4. **R31-002, R32-002 -- Split-brain autosave window** (`session-stop.ts:60-67, 119-125, 261-268, 283-309`). Three independent `recordStateUpdate()` calls plus final disk reload by `runContextAutosave()` create a torn-state autosave window. Autosave can persist mix of fields from different stop events.
5. **R34-001 -- Attempted-write flag as truth** (`session-stop.ts:119-125, 261-269, 302-318`; `hook-state.ts:221-240`). `producerMetadataWritten` is an attempted-write flag, not a durable postcondition. Stop-hook callers can treat it as proof that resume/autosave consumers will see producer metadata, even though the final state file can already be overwritten by another stop/compact writer.
6. **R37-002 -- Stale `currentSpecFolder` preference** (`session-stop.ts:128-145, 244-246, 281-296, 340-369`). `detectSpecFolder()` prefers `stateBeforeStop.lastSpecFolder` over transcript-driven retargeting. If another stop hook or autosave has advanced the target, the current stop hook suppresses the legitimate retarget.
7. **R39-001 -- Autosave outcome never surfaced** (`session-stop.ts:60-67, 108-117, 299-318`). `runContextAutosave` returns void; no `autosaveOutcome` field in `SessionStopProcessResult`. Callers cannot distinguish success from silent skip.

**Downstream consumers.** Claude `session-prime.ts`, Gemini `session-prime.ts`, `session-resume.ts`, `startup-brief.ts`, `runContextAutosave`, spec-folder detection pipeline, transcript-planner-export, token analytics.

**Recommended remediation entry point.** Structural refactor S2 (HookState overhaul). S2 includes: M1 (Zod schema validation), M2 (schemaVersion), M3 (collapse three `recordStateUpdate()` calls into one atomic patch), M4 (refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()`), + quick wins #9 (offset monotonicity), #21 (eliminate zero-offset sentinel), #22 (add autosaveOutcome field).

### 11.2 `mcp_server/hooks/claude/hook-state.ts` (9 distinct issues)

**File thesis.** `hook-state.ts` is the persisted temp-state substrate that binds Claude, Gemini, and OpenCode runtime hooks together. Any corruption, drift, or race here propagates through all three runtimes via session-prime, session-stop, and compact-inject. Phase 016 found 9 distinct issues, most concentrated in D2 (state contract honesty) and D3 (concurrency). The dominant pattern is **unvalidated parse + unlocked read-modify-write**.

**Anchor findings.**

1. **R21-002, R25-004 -- Unvalidated `JSON.parse` as HookState across 5 entrypoints** (`hook-state.ts:83-87`). `JSON.parse(raw) as HookState` with no runtime validation. The same persisted state file is consumed by Claude session-prime/session-stop, Gemini session-prime, Gemini compact-inject, and Claude compact-cache. A syntactically valid but schema-drifted state blob can misstate the active spec folder, inject stale or malformed compact payloads, or suppress recovery context across runtimes with no additional validation layer.
2. **R31-001, R31-004 -- Deterministic .tmp collision** (`hook-state.ts:169-176, 221-240`; `graph-metadata-parser.ts:969-989`). `filePath + '.tmp'` in saveState() means two writers for the same session swap bytes before rename. `process.pid + Date.now()` temp path in graph-metadata-parser collides at millisecond precision.
3. **R32-001 -- `updateState` returns merged after failed persist** (`hook-state.ts:170-176, 221-241`). `updateState` loads current JSON, overlays the patch, and returns the in-memory object even if persistence fails or another writer wins later. Consumer sees an "updated" object that is not on disk.
4. **R33-001 -- `clearCompactPrime` identity-free cleanup** (`hook-state.ts:184-205`; `session-prime.ts:43-46, 281-287`). Clears by session ID only, not payload identity; newer payload erased on overlap. Fresh precompact write deleted silently.
5. **R36-001 -- Torn read across generations** (`hook-state.ts:140-155, 170-176`). `loadMostRecentState` stat-then-read race: concurrent rename can swap generation between mtime read and JSON read. Freshness from one generation, content from another.
6. **R38-001 -- All-or-nothing directory scan** (`hook-state.ts:131-165`; `session-resume.ts:348-366`). Single `try` block wraps the whole directory loop; one bad sibling file aborts entire scan and returns null. One poison-pill file suppresses all sibling recovery.
7. **R38-002 -- All-or-nothing `cleanStaleStates`** (`hook-state.ts:243-263`; `session-stop.ts:321-328`). Same single-try pattern; partial removed count returned with no indication of skipped files.
8. **R40-001 -- TOCTOU stat-then-unlink** (`hook-state.ts:170-176, 247-255`; `session-stop.ts:321-328`). `cleanStaleStates` TOCTOU: stat-then-unlink can delete fresh state written between those two calls. Cleanup can erase live state; `removed` count reports normal.

**Downstream consumers.** Every hook entrypoint: Claude session-prime, session-stop, compact-inject; Gemini session-prime, session-stop; `startup-brief.ts`; `session-resume.ts`; `session-bootstrap.ts`; `session-health.ts`.

**Recommended remediation entry point.** S2 HookState overhaul (see 11.1). The unique-temp-path and per-file-error-isolation parts are quick wins (1-2h each); the Zod validation and schemaVersion are medium refactors (2-3d each).

### 11.3 `mcp_server/handlers/save/reconsolidation-bridge.ts` (8 distinct issues)

**File thesis.** `reconsolidation-bridge.ts` is the pre-transaction planning layer between `memory_save` and the SQLite writer transaction. It runs vector search, scope filtering, similarity scoring, and action classification (merge / conflict / complement) before the writer lock is acquired. The central failure mode: **decisions made from pre-transaction snapshots are authoritative post-transaction**, so concurrent saves can fork lineage, double-insert complements, or admit candidates based on stale scope.

**Anchor findings.**

1. **R11-004 -- Silent scope-filter drop** (`reconsolidation-bridge.ts:283-295`). `findSimilar` intentionally over-fetches search results, then applies `results.filter(...candidateMatchesRequestedScope...)` and returns only the sliced `scopeFiltered` set. If that array is empty, the bridge emits no warning before reconsolidation falls through to the normal create path. Test `tests/reconsolidation-bridge.vitest.ts:255-330` codifies the silent behavior.
2. **R13-004 -- All thrown errors fall through to normal create** (`reconsolidation-bridge.ts:261-270, 438-442`). Any thrown error (checkpoint failure, reconsolidate failure, similarity failure, conflict store failure) caught and falls through to normal create without structured warning. Four different failure modes collapse into one success-shaped path.
3. **R31-003 -- Conflict without predecessor CAS** (`reconsolidation-bridge.ts:282-295`; `reconsolidation.ts:467-508`). `executeConflict()` runs a pure `UPDATE ... WHERE id = ?` with no predecessor-version or scope recheck. Two concurrent saves can both deprecate the same predecessor.
4. **R34-002 -- Complement stale-search duplicate window** (`reconsolidation-bridge.ts:261-306`; `reconsolidation.ts:599-694`; `memory-save.ts:2159-2171, 2250-2304`). Reconsolidation planning performs vector search and scope filtering before the save path takes its writer transaction. If another save inserts or upgrades a near-duplicate after that search but before the later `writeTransaction`, the current save still proceeds as a normal complement and creates a second memory without re-running similarity search.
5. **R35-001 -- Conflict lane not single-winner** (`reconsolidation-bridge.ts:270-295`; `reconsolidation.ts:467-508, 610-658, 952-993`). `insertSupersedesEdge()` deduplicates only by `(source_id, target_id, relation)`. Two concurrent saves with different new memory IDs can both create `supersedes` edges to the same predecessor. Violates the memory graph's "single active successor per predecessor" invariant.
6. **R39-002, R40-002 -- Mixed-snapshot per-candidate scope read** (`reconsolidation-bridge.ts:203-237, 282-306`). Governed scope filter reads each candidate's row individually outside any transaction. Similarity/content from one snapshot; scope from another. Confirmed in both TM-06 and assistive paths.

**Downstream consumers.** `memory-save.ts`, `response-builder.ts`, memory graph (lineage edges, supersedes edges, complement rows), vector search index.

**Recommended remediation entry point.** Structural refactor S1 (Transactional reconsolidation). S1 includes: M5 (predecessor CAS in `executeConflict()`), M6 (same-transaction scope read), B2 (complement inside writer transaction), B4 (assistive inside writer transaction), B5 (structured warnings on scope-filter drops).

### 11.4 `mcp_server/handlers/save/post-insert.ts` (6 distinct issues)

**File thesis.** `post-insert.ts` runs after a new memory is inserted. It coordinates causal-link resolution, entity extraction, summary generation, entity linking, and graph-lifecycle indexing. All five enrichment steps are tracked in an `enrichmentStatus` boolean record. The dominant pattern: **a single `true` flag conflates four different outcomes (ran / skipped / deferred / failed)**, which `response-builder.ts` then amplifies by surfacing at most one generic warning.

**Anchor findings.**

1. **R8-001 -- `enrichmentStatus = true` for four outcomes** (`post-insert.ts:86-213, 223-238`). Every enrichment step sets the boolean `true` unconditionally after the await; no inspection of the helper's return value. Success, feature-disabled skip, "nothing to do" skip, and deferral all produce `true`. Callers cannot distinguish outcomes; cannot recover without re-running.
2. **R8-002 -- Entity linking gated only by feature flags, not successful extraction** (`post-insert.ts:116-129, 157-181`). If extraction fails, linking still runs against empty/stale entities.
3. **R11-005 -- Helper no-ops normalized to success** (`post-insert.ts:136-147, 187-200`). `generateAndStoreSummary(...)` can return `stored: false`, but `enrichmentStatus.summaries = true` is set unconditionally. `onIndex(...)` can return `{skipped: true}`, but `enrichmentStatus.graphLifecycle = true` is set unconditionally. `response-builder.ts:315-321` only warns when an enrichment flag is `false`, so these helper no-op states suppress the only generic partial-enrichment warning.
4. **R17-002 -- Five failure types unified under `ran`** (`post-insert.ts:106-109, 126-129, 148-151, 174-177, 201-214`). Exception-driven enrichment failures still report `executionStatus=ran`. Five different failure types unified under one label.
5. **R25-001 -- All-true booleans codified by tests** (`post-insert.ts:223-237`). Deferred-enrichment branch returns all five `enrichmentStatus` booleans as `true`. `tests/post-insert-deferred.vitest.ts:11-48` explicitly asserts this shape; `tests/handler-memory-save.vitest.ts:2590-2607` reuses it as the default post-insert stub. Fixing the runtime requires fixing the tests.
6. **R27-001 -- `graphLifecycle=true` when `onIndex` returns skipped** (`post-insert.ts:187-200`). `runEnrichmentBackfill` cannot unblock because the flag is set even for `skipped:true`.

**Downstream consumers.** `memory-save.ts`, `response-builder.ts`, `runEnrichmentBackfill`, follow-up-action API, MCP client (sees the response).

**Recommended remediation entry point.** Medium refactor M13 (enum-valued `OperationResult<T>`). This is a single structural fix that resolves ~10 findings at once but requires migrating 4+ test files.

### 11.5 `mcp_server/handlers/code-graph/query.ts` (6 distinct issues)

**File thesis.** `code-graph/query.ts` is the entrypoint for `code_graph_query` MCP tool -- the primary structural-query tool that skill routing recommends. It accepts operations (`callers`, `imports`, `deps`, `blast_radius`, `outline`), performs `ensureCodeGraphReady()`, resolves the subject via `resolveSubject()`, and returns a payload with readiness, detector provenance, and result trust. Phase 016 found that **nearly every failure mode produces success-shaped output**.

**Anchor findings.**

1. **R3-001 -- Ambiguous subject silently resolves to first match** (`code-graph/query.ts:42-58`). `resolveSubject()` picks first `fq_name`/`name` match with `LIMIT 1`; no `ambiguous_subject` signal. Two overloaded methods collapse silently to the first row; downstream edge/outline queries operate on the wrong node.
2. **R3-002 -- Readiness gate fails open** (`code-graph/query.ts:319-334`). `ensureCodeGraphReady()` exceptions swallowed. Agents get empty query results during graph-build failure, indistinguishable from genuine absence.
3. **R11-003 -- `blast_radius` degrades unresolved subjects** (`code-graph/query.ts:367-385`). `resolveSubjectFilePath(candidate) ?? candidate`. Any non-empty unresolved string survives as a seed. Refactor workflows get false-negative dependency sets.
4. **R12-002 -- Unsupported `edgeType` returns ok with empty** (`code-graph/query.ts:26-29, 441-549`). Agent typos produce silent empty results.
5. **R16-001 -- `includeTransitive: true` defaults to CALLS** (`code-graph/query.ts:417-436, 547-548`). Runs before switch-level validation; unsupported ops default to CALLS traversal.
6. **R22-001 -- Self-contradictory success payload** (`code-graph/query.ts:61-83, 94-99, 319-364, 551-564`). Readiness `empty` + `detectorProvenance: structured` in one response. Consumer reads one field or the other.
7. **R23-001 -- `empty` vs `missing` vocabulary divergence** (`code-graph/query.ts:319-361`). Query exposes `empty` readiness; bootstrap canonicalizes same condition as `missing`. Readiness vocabulary diverges across surfaces.

**Downstream consumers.** MCP agents, `context_server.ts` routing recommendations, refactor workflows, change-impact analysis.

**Recommended remediation entry point.** Quick wins #8 (reject invalid `edgeType`), #13 (validate outline subject), #14 (stop swallowing readiness exceptions), #16 (guard `blast_radius`), #17 (flag dangling edges). Plus M8 vocabulary expansion to distinguish `empty` / `missing` / `absent` / `unavailable`.

### 11.6 `mcp_server/lib/graph/graph-metadata-parser.ts` (4 distinct issues)

**File thesis.** `graph-metadata-parser.ts` parses `graph-metadata.json` files from spec-folder packets and feeds downstream indexing, search ranking, and memory-parser quality assignment. It has a modern schema + a legacy fallback. The legacy fallback is the **root of P0-C graph-metadata laundering** -- malformed modern JSON gets accepted as legacy with no migration marker, then downstream consumers treat it as first-class canonical metadata with +0.12 retrieval boost.

**Anchor findings.**

1. **R11-002 -- Legacy fallback as clean success** (`graph-metadata-parser.ts:223-233`). On primary-parse failure, `parseLegacyGraphMetadataContent(content)` is called; if it succeeds, returns `{ ok: true, metadata, errors: [] }` with no `migrated` or `legacy` marker. Test `tests/graph-metadata-schema.vitest.ts:223-245` explicitly asserts this contract.
2. **R13-002 -- I/O failure becomes `planned`/`complete`** (`graph-metadata-parser.ts:280-285, 457-475, 849-860`). `readDoc()` collapses I/O failure into `null`; `deriveStatus()` misreads as `planned` or `complete`. Transient read failure indexed as freshly-saved packet with no error signal.
3. **R20-002 -- Timestamp fabrication** (`graph-metadata-parser.ts:167-205, 223-233`). Legacy fallback fabricates `created_at`/`last_save_at` via `new Date().toISOString()`. Corrupted file gets freshly-minted timestamps; laundering signal.
4. **R21-003 -- Refresh rewrites legacy as canonical** (`graph-metadata-parser.ts:223-233, 264-275, 1015-1019`). `refreshGraphMetadataForSpecFolder()` launders malformed modern JSON into canonical refreshed artifact. Corruption signal erased at persistence layer.

**Downstream consumers.** `memory-parser.ts` (assigns `qualityScore: 1` to fallback-recovered entries), stage-1 candidate generation (+0.12 packet boost), `refreshGraphMetadataForSpecFolder()`.

**Recommended remediation entry point.** Structural refactor S3 (Graph-metadata migration propagation). Start with C1: `validateGraphMetadataContent()` returns `{ ok, metadata, migrated, migrationSource? }`. Propagate `migrated` flag through `memory-parser.ts` and stage-1 ranking. Either drop the +0.12 boost for `migrated=true` rows or reverse it to a penalty until human review.

### 11.7 `skill/skill-advisor/scripts/skill_advisor.py` (5 distinct issues)

**File thesis.** `skill_advisor.py` is the routing engine for Gate 2 skill selection. It loads a compiled skill graph from `graph-metadata.json` files, parses SKILL.md frontmatter, applies hard-coded `INTENT_BOOSTERS` / `MULTI_SKILL_BOOSTERS` / `PHRASE_INTENT_BOOSTERS` tables, and emits confidence-scored recommendations. Phase 016 found the critical D4 pattern: **the infrastructure for graph-driven routing exists end-to-end, but the scoring step never consumes the graph-derived signals**.

**Anchor findings.**

1. **R41-003 -- Advisory validation returns success on invariant violations** (`skill_graph_compiler.py:272-353, 630-663`; `skill_advisor.py:203-265`). `--validate-only` returns success for graphs that violate routing invariants. "VALIDATION PASSED" lies about contract satisfaction.
2. **R43-001 -- `intent_signals` discarded at scoring** (`skill_advisor_runtime.py:111-141, 165-203`; `skill_advisor.py:105-116, 140-152, 180-187, 1669-1694`; `mcp-coco-index/graph-metadata.json:31-50`). Live skill router does not consume per-skill `intent_signals` / `derived.trigger_phrases`. `signals` map populated but has no consumer in `analyze_request()`. Live repro on 2026-04-16: `skill_advisor.py "natural language code retrieval" --threshold 0.8` returned top-1 `sk-code-opencode` with `_graph_boost_count: 0`.
3. **R44-001 -- Consolidates R43-001 + keyword comments discarded** (`skill_advisor_runtime.py:111-152`; `skill_advisor.py:165-190, 1669-1725`). `intent_signals` silently discarded at scoring boundary; SKILL.md `<!-- Keywords: ... -->` comment blocks stripped before routing by `parse_frontmatter_fast()`.
4. **R45-002 -- Ranking stability not asserted** (`skill_advisor.py:568-577, 771-813, 1669-1694`; `test_skill_advisor.py:73-186`). Deep-research prompts containing `audit`/`review` tokens score within 0.02 of `sk-code-review`; no ranking-stability test.
5. **R46-001 -- `COMMAND_BRIDGES` prefix collapse** (`skill_advisor.py:980-1021, 1404-1410, 1647, 1741-1768`; `test_skill_advisor.py:73-186`). `COMMAND_BRIDGES` registers only `/spec_kit` and `spec_kit:` prefix markers. `detect_explicit_command_intent()` stops at first containment match. All `/spec_kit:*` subcommands collapse to `command-spec-kit` at `kind_priority=2`. Live consequence: `/spec_kit:deep-research` -> `command-spec-kit` 0.95, `sk-deep-research` 0.70.

**Downstream consumers.** Gate 2 skill routing, all `/spec_kit:*` command dispatch, `analyze_request()` result consumers, routing playbooks.

**Recommended remediation entry point.** Structural refactor S4 (Skill routing trust chain). Quick wins #1 (wire `intent_signals` into scoring, 2h), #2 (per-subcommand COMMAND_BRIDGES, 2h), #3 (capture keyword comments, 2h), #5 (conflicts_with reciprocity, 1h). Medium refactor M12 (disambiguation tier for audit-vocabulary prompts).

### 11.8 `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` (4 distinct issues)

**File thesis.** `manual-playbook-runner.ts` is a development/CI harness that parses playbook markdown scenarios, extracts tool invocations, and executes them. It uses `Function(...)()` eval to turn object-literal fragments into runnable JavaScript. This expands the trust boundary from **repository-owned markdown** to **repository markdown + live tool-return values** because `substitutePlaceholders()` injects `runtimeState.lastJobId` into the `Function(...)` string.

**Anchor findings.**

1. **R41-004 -- `Function(...)` eval with no sandbox** (`manual-playbook-runner.ts:224-246, 251-317, 438-445`). Markdown -> `Function(...)()` evaluation. Documentation drift can become arbitrary Node-side execution.
2. **R45-004 -- Null scenario parse results filtered before coverage** (`manual-playbook-runner.ts:245-271, 1203-1217`; `manual_testing_playbook.md:196-230`; `spec.md:131-134`). `parseScenarioDefinition()` returns null on parse failure; `main()` filters nulls before coverage count. 10/291 active scenario files unparseable on 2026-04-16. Coverage reports understate active scenario tree.
3. **R46-003 -- `runtimeState.lastJobId` injection** (`manual-playbook-runner.ts:181-194, 427-445, 930-943, 1112-1117`). `parsedStepArgs()` routes brace-prefixed text to `evaluateObjectLiteral()`. `substitutePlaceholders()` injects `runtimeState.lastJobId` from prior handler payloads into `Function(...)` string. Tool output is now part of the evaluated code string; trust boundary wider than repository-owned markdown.
4. **R50-002 -- Dialect drift in live corpus** (`097-async-ingestion-job-lifecycle-p0-3.md:35-37`; `144-advisory-ingest-lifecycle-forecast.md:35-36`; `manual-playbook-runner.ts:438-445, 544-548, 612-616`). Checked-in lifecycle scenarios use two incompatible argument dialects: `memory_ingest_status({jobId})` shorthand (depends on undefined JS scoping) vs `memory_ingest_status({ jobId:"<job-id>" })` explicit form. Shorthand form returns `ReferenceError: jobId is not defined` on direct Node repro.

**Downstream consumers.** Manual testing playbook coverage accounting, CI runs, `runtimeState` from prior handler payloads.

**Recommended remediation entry point.** Structural refactor S6 (Playbook runner isolation). Replace `Function(...)()` + `substitutePlaceholders()` with a typed step executor + schema-validated fixtures. Add `automatable: boolean` field on scenario metadata. Assert `parsedCount == filteredCount` before coverage computation.

### 11.9 `skill/skill-advisor/scripts/skill_graph_compiler.py` (4 distinct issues)

**File thesis.** `skill_graph_compiler.py` compiles the skill graph from `graph-metadata.json` files, applying validators (edge symmetry, weight parity, dependency-cycle detection, topology warnings). The central pattern: **"VALIDATION PASSED" + "health ok" both advertise success while graph violates invariants**.

**Anchor findings.**

1. **R41-003 -- Advisory-only topology checks** (`skill_graph_compiler.py:272-353, 630-663`). Topology checks are warnings, not errors. `--validate-only` returns success even when graphs violate routing invariants.
2. **R45-003 -- Topology warnings non-durable** (`skill_graph_compiler.py:559-568, 630-663`; `skill_advisor.py:1841-1888`; `test_skill_advisor.py:141-165`). ZERO-EDGE WARNINGS emitted then dropped from serialized graph. `health_check()` returns `status: ok` with `skill_graph_loaded: true` after warnings.
3. **R46-002 -- `conflicts_with` reciprocity never checked** (`skill_graph_compiler.py:272-319, 501-568, 630-663`; `skill_advisor.py:141-187, 321-339`; `test_skill_advisor.py:73-186`). `validate_edge_symmetry()` never inspects `conflicts_with` edges. Unilateral metadata edit silently creates bilateral runtime penalty.
4. **R49-003 -- Only 2-node cycles detected** (`skill_graph_compiler.py:437-472, 623-663`). `validate_dependency_cycles()` only detects two-node reciprocal cycles. Longer `depends_on` loops pass `--validate-only`. Live repro 2026-04-16: `a -> b -> c -> a` returns empty `three_node` array.

**Downstream consumers.** Skill router (reads compiled graph), `health_check()` endpoint, `--validate-only` CI gate.

**Recommended remediation entry point.** Quick wins #4 (serialize topology warnings into compiled graph, 2h), #5 (conflicts_with reciprocity check, 1h), #6 (arbitrary-length cycle detection via Tarjan's SCC, 3h), #27 (promote topology checks to hard errors, 2h).

### 11.10 `command/spec_kit/assets/spec_kit_plan_auto.yaml` (4 distinct issues)

**File thesis.** `spec_kit_plan_auto.yaml` is the autonomous `/spec_kit:plan` workflow asset. It uses a **mixed-vocabulary state machine** (local `folder_state` classifier mapping to canonical `start_state`) governed by an **untyped boolean DSL** (`intake_only == TRUE`, `folder_state != populated`). The same `when:` key carries both executable predicates and prose timing notes.

**Anchor findings.**

1. **R41-001 -- Vocabulary drift with canonical contract** (`spec_kit_plan_auto.yaml:338-355, 371-372`; `plan.md:93-99`; `intake-contract.md:66-77, 217-222`). Autonomous plan workflow uses `populated` while canonical contract uses `populated-folder`. Interpreter-dependent string comparison.
2. **R42-001 -- Unsigned boolean DSL in YAML strings** (`spec_kit_plan_auto.yaml:375-392`; `spec_kit_plan_confirm.yaml:400-416`; `plan.md:96-98`). `intake_only == TRUE` / `folder_state == populated` as quoted string expressions. No mechanical grammar contract. A runner change in expression evaluation can invert branch silently.
3. **R47-002 -- Two-vocabulary state machine collapsed in top-level docs** (`spec_kit_plan_auto.yaml:337-373`; `spec_kit_plan_confirm.yaml:360-398`; `intake-contract.md:39-49, 56-76`; `SKILL.md:563, 931`; `README.md:624-626`). Local `folder_state` classifier -> canonical `start_state`; top-level docs collapse both into one label. Downstream consumers may treat wrong enum as canonical.
4. **R48-002, R49-002 -- `when:` key overloaded** (`spec_kit_plan_auto.yaml:354-391, 548-555`; `spec_kit_plan_confirm.yaml:372-416, 606-612`; `spec_kit_complete_auto.yaml:465-483, 1008-1012`). Same key carries both boolean-like predicates and free-form narrative timing prose. Schema cannot be mechanically validated without interpreter-specific conventions.

**Downstream consumers.** Autonomous `/spec_kit:plan` workflow, confirm-mode equivalent, all `/spec_kit:*` assets sharing the `when:` key pattern.

**Recommended remediation entry point.** Structural refactor S7 (Typed YAML predicate grammar). Define `BooleanExpr` schema. Replace string literals with typed boolean conditions. Separate `when:` (predicate) from `after:`/`trigger:` (prose timing). Add asset-predicate test suite covering Step 0 branch inputs.

---

## 12. Closing thesis

Phase 016's 50 iterations reveal a runtime where **every failure is silent**. There are no crashes, no thrown exceptions that stop the pipeline, no compile errors, no test failures. The system looks healthy by every observable metric -- health checks return `ok`, validations print `VALIDATION PASSED`, `memory_save` returns `status: "success"`, skill routing reports `0.95` confidence -- while operating with reduced fidelity across at least 37 surfaces.

The four P0 escalation composites are not outliers; they are **exemplar interaction patterns**. Each composite chains together 4-10 P1/P2 findings that individually look like isolated quality issues but together produce systemic, persistent, or data-integrity failures triggered by normal runtime conditions (not pathological input).

The right remediation mental model is **structural refactor, not patch set**. Fixing the constituent findings of a P0 composite in isolation leaves the underlying dishonesty architecture intact and often creates new "looks correct" surfaces. The structural refactors S1-S7 collectively address ~63 distinct findings via ~10.5 engineer-weeks of focused work, parallelizable to ~4 weeks wall clock with 3 engineers.

Critically, **test-suite countermeasures are on the critical path**. Fourteen existing test files actively codify the degraded contract. Any structural fix that produces an honest return shape will break those tests. The remediation plan must include test migration as a first-class deliverable, not an afterthought.

Phase 017 should treat this research as a map, not a patchset. The map shows where the runtime is dishonest; the patches need to remake the honesty contract across producers, consumers, transports, and tests together -- because the dishonesty is an emergent property of their misalignment, not a local property of any single file.

---

## Appendix A -- Deliverable index

| File | Status | Size |
| ---- | ------ | ---- |
| `research.md` | THIS FILE | ~1600 lines |
| `FINAL-synthesis-and-review.md` | Authoritative action-oriented synthesis | 1042 lines |
| `findings-registry.json` | Structured finding registry | 137 raw + 27 dedup clusters + 4 P0 composites |
| `deep-research-config.json` | Run configuration metadata | -- |
| `deep-research-state.jsonl` | Per-iteration state stream | 52 lines (init + 50 + convergence) |
| `deep-research-strategy.md` | Research design + domain plan | -- |
| `deep-research-dashboard.md` | Progress snapshot | -- |
| `interim-synthesis-32-iterations.md` | First synthesis checkpoint | 64KB |
| `interim-synthesis-38-iterations.md` | D3 midpoint | 98KB |
| `interim-synthesis-41-iterations.md` | D4 entry | 48KB |
| `interim-synthesis-44-iterations.md` | D4 midpoint | 69KB |
| `interim-synthesis-47-iterations.md` | D4 pre-closeout | 67KB |
| `iterations/iteration-001.md` ... `iteration-050.md` | Per-iteration raw investigation notes | 50 files |

## Appendix B -- Reading order for new consumers

1. **Start here** (`research.md`) for narrative synthesis + reasoning.
2. For action-oriented remediation: `FINAL-synthesis-and-review.md` sections 6-7.
3. For structured data / programmatic queries: `findings-registry.json`.
4. For a specific iteration's full reasoning: `iterations/iteration-NNN.md`.
5. For the pre-convergence evolution: `interim-synthesis-*-iterations.md` in numerical order.
6. For the original research design: `deep-research-strategy.md`.
7. For per-iteration event metadata: `deep-research-state.jsonl`.

## Appendix C -- Metadata back-fill notes

This research run was dispatched manually via `cli-copilot` rather than through the `/spec_kit:deep-research` skill loop. The standard skill artifacts (`config`, `state.jsonl`, `strategy`, `dashboard`, `research.md`, `findings-registry.json`) were reconstructed after the 50-iteration run completed. Reconstruction used:

- Iteration file mtimes (authoritative for event ordering).
- Iteration file frontmatter (File / Lines / Severity / Description / Evidence / Downstream Impact) for registry finding extraction.
- FINAL synthesis sections for dedup clusters, P0 composites, systemic themes, remediation backlog, and Phase 017 kickoff plan.
- Interim synthesis files for per-checkpoint distinct-issue counts and cumulative trajectories.
- Spec/plan/tasks/checklist docs for the 19 candidate files and 5-domain research design.

The back-filled artifacts are evidence-grounded (every claim traces to a primary source) but were not live-dispatched. Future consumers should treat them as post-hoc reconstructions, not as the original live-tracked state that a `/spec_kit:deep-research` skill invocation would produce.
