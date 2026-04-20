# Phase 027 r01 Deep Research Final Report

This report synthesizes the 40 completed Phase 027 r01 deep-research iterations into a decision register, architecture, roadmap, risk model, and measurement plan for the skill-graph daemon and advisor unification work.

## 1. EXECUTIVE SUMMARY / OVERVIEW

Phase 027 r01 converged after 40 planned iterations: 31 A-D sub-question verdicts, 4 cross-track coherence checks, and 5 synthesis intermediates. The A-D verdict distribution is 29 `adopt_now`, 2 `prototype_later`, and 0 `reject`. The strongest adopt-now decisions are to use Chokidar plus the existing hash-aware TypeScript SQLite indexer as the daemon base, to store generated trigger evidence in `graph-metadata.json.derived` with explicit provenance and trust lanes, and to move the advisor runtime toward MCP-native TypeScript with `advisor_recommend`, `advisor_status`, and `advisor_validate`. No question produced a `reject` verdict; the strongest rejected implementation options are raw `fs.watch` or direct `fsevents`, a new standalone `advisor-index.json`, and removing the OpenCode plugin surface during this migration.

## 2. SCOPE

This synthesis covers the research packet for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/`, with source scope defined by the local `spec.md`. It includes the skill-graph auto-update daemon, advisor trigger and keyword derivation, advanced advisor matching through hybrid and causal-style signals, and consolidation into the system-spec-kit MCP server. It does not authorize code changes, broad support-file watching by default, prompt-time embedding lookup, learned ranking promotion, Python CLI removal, or plugin deprecation without the later gates defined below.

## 3. METHODOLOGY

The packet used the fixed 40-iteration deep-research protocol in `deep-research-strategy.md`: iterations 1-31 answered one A-D sub-question each, iterations 32-35 checked cross-track coherence, and iterations 36-40 produced synthesis intermediates and final consolidation. Each iteration required concrete evidence, analysis, a verdict, confidence, dependencies, and metrics. The final synthesis reads the iteration files as the evidence-of-record and normalizes verdict spelling to `adopt_now`, `prototype_later`, and `reject` for the registry.

## 4. TRACK A FINDINGS

| ID | Verdict | Confidence | Rationale | Evidence |
| --- | --- | --- | --- | --- |
| A1 Watcher choice | `adopt_now` | high | Use Chokidar as the watcher substrate; reject raw `fs.watch` and direct `fsevents` because the repo already depends on Chokidar and has watcher behavior patterns for platform and editor-save hazards. | `iterations/iteration-001.md:6`, `iterations/iteration-001.md:40`, `iterations/iteration-001.md:49` |
| A2 Scope of change detection | `adopt_now` | high | Watch `graph-metadata.json` for the durable graph index now, and use `SKILL.md`, `derived.source_docs`, and `derived.key_files` as targeted derived-metadata invalidation inputs. | `iterations/iteration-002.md:6`, `iterations/iteration-002.md:36`, `iterations/iteration-002.md:45` |
| A3 Incremental vs full re-index | `adopt_now` | high | Use the existing TypeScript SQLite content-hash indexer as the daemon default; reserve full re-index for explicit recovery or schema maintenance. | `iterations/iteration-003.md:6`, `iterations/iteration-003.md:34`, `iterations/iteration-003.md:43` |
| A4 Update transaction model | `adopt_now` | high | Treat the single SQLite graph transaction as the consistency boundary and publish freshness, generation, and cache invalidation only after commit. | `iterations/iteration-004.md:6`, `iterations/iteration-004.md:43`, `iterations/iteration-004.md:52` |
| A5 Daemon lifecycle | `adopt_now` | high | Keep the daemon MCP-owned: startup scan, opt-in in-process watcher, graceful shutdown, freshness-gated hooks, and fail-open prompt behavior. | `iterations/iteration-005.md:6`, `iterations/iteration-005.md:54`, `iterations/iteration-005.md:63` |
| A6 Resource budget | `prototype_later` | medium | Narrow metadata-only watching is acceptable after fixing Chokidar v4 glob behavior, but broad watching has descriptor and memory uncertainty and needs a benchmark harness first. | `iterations/iteration-006.md:6`, `iterations/iteration-006.md:35`, `iterations/iteration-006.md:44` |
| A7 Sanitization at re-index | `adopt_now` | high | Apply the existing renderer/shared-payload sanitizer before storing or publishing advisor-visible skill metadata. | `iterations/iteration-007.md:6`, `iterations/iteration-007.md:31`, `iterations/iteration-007.md:40` |
| A8 Failure modes | `adopt_now` | high | Adopt a failure-mode contract covering Chokidar stable writes, benign `ENOENT`, WAL single-writer caveats, `SQLITE_BUSY`, stale/unavailable fail-open behavior, scan leases, and rebuild-from-source recovery. | `iterations/iteration-008.md:6`, `iterations/iteration-008.md:46`, `iterations/iteration-008.md:55` |

## 5. TRACK B FINDINGS

| ID | Verdict | Confidence | Rationale | Evidence |
| --- | --- | --- | --- | --- |
| B1 Extraction sources | `adopt_now` | high | Use explicit metadata and deterministic local content extraction now; exclude commit messages from the first implementation slice. | `iterations/iteration-009.md:6`, `iterations/iteration-009.md:34`, `iterations/iteration-009.md:43` |
| B2 Extraction pipeline | `adopt_now` | high | Adopt a deterministic hybrid pipeline: explicit signals plus TypeScript n-gram/pattern extraction, upgraded with corpus-aware DF/IDF in B6; keep embeddings offline or prototype-only. | `iterations/iteration-010.md:6`, `iterations/iteration-010.md:42`, `iterations/iteration-010.md:51` |
| B3 Sync model | `adopt_now` | high | Preserve author-authored SKILL.md/frontmatter/Keywords signals and write generated companions to schema-v2 `graph-metadata.json.derived`; do not create `advisor-index.json` now. | `iterations/iteration-011.md:6`, `iterations/iteration-011.md:29`, `iterations/iteration-011.md:38` |
| B4 Precision safeguards | `adopt_now` | high | Keep derived triggers in a separated lower-trust lane with caps, haircuts, and corpus-gated precision checks before default routing confidence can rise. | `iterations/iteration-012.md:6`, `iterations/iteration-012.md:32`, `iterations/iteration-012.md:41` |
| B5 Freshness trigger | `adopt_now` | high | Reuse the A3 graph and content-hash SQLite authority, with a derived-provenance fingerprint for B1 inputs; mtimes are only wake/cache signals. | `iterations/iteration-013.md:6`, `iterations/iteration-013.md:34`, `iterations/iteration-013.md:43` |
| B6 Corpus stats | `adopt_now` | high | Maintain repo-level DF/IDF statistics as an index-time baseline, recomputed on startup and debounced graph or derived-input changes. | `iterations/iteration-014.md:6`, `iterations/iteration-014.md:32`, `iterations/iteration-014.md:41` |
| B7 Adversarial resilience | `adopt_now` | high | Make adversarial scoring lanes explicit and enforce anti-stuffing caps/demotions before generated triggers become more influential. | `iterations/iteration-015.md:6`, `iterations/iteration-015.md:44`, `iterations/iteration-015.md:53` |

## 6. TRACK C FINDINGS

| ID | Verdict | Confidence | Rationale | Evidence |
| --- | --- | --- | --- | --- |
| C1 Available memory-MCP primitives | `adopt_now` | high | The repo already has retrieval, trigger, causal, indexing, stats, health, and hybrid fusion primitives; Track C needs scoped adapter design, not primitive invention. | `iterations/iteration-016.md:6`, `iterations/iteration-016.md:48`, `iterations/iteration-016.md:57` |
| C2 Mapping memory concepts to advisor | `adopt_now` | high | Project skill metadata into memory-style retrieval channels while keeping memory lifecycle, governance, and decay fields out of canonical skills. | `iterations/iteration-017.md:6`, `iterations/iteration-017.md:37`, `iterations/iteration-017.md:46` |
| C3 Causal graph for skills | `adopt_now` | high | Use causal-style traversal over existing `skill_edges`; avoid direct `memory_causal_link` reuse because that storage assumes `memory_index` rows. | `iterations/iteration-018.md:6`, `iterations/iteration-018.md:32`, `iterations/iteration-018.md:41` |
| C4 Scoring fusion | `adopt_now` | high | Adopt deterministic analytical fusion with normalized channels, caps, attribution, and ablation patterns; keep learned weighting shadow-only. | `iterations/iteration-019.md:6`, `iterations/iteration-019.md:45`, `iterations/iteration-019.md:54` |
| C5 Ambiguity handling | `adopt_now` | high | Use causal-style skill edges upstream in scoring and uncertainty calibration, while keeping renderer output deterministic and sanitized. | `iterations/iteration-020.md:6`, `iterations/iteration-020.md:31`, `iterations/iteration-020.md:40` |
| C6 Performance | `prototype_later` | high | Do not put prompt-time embedding lookup on every advisor prompt; cache, lexical, and SQL graph lanes stay hot-path, while embedding/hybrid search remains shadow or prototype. | `iterations/iteration-021.md:6`, `iterations/iteration-021.md:39`, `iterations/iteration-021.md:48` |
| C7 Training/tuning data | `adopt_now` | high | Use the 200-prompt corpus as frozen deterministic benchmark/tuning data with stratified holdout; do not promote learned weights directly from it. | `iterations/iteration-022.md:6`, `iterations/iteration-022.md:41`, `iterations/iteration-022.md:50` |
| C8 Target accuracy | `adopt_now` | high | Gate deterministic improvements at 70% full-corpus and holdout top-1; require stricter 75% full-corpus and 72.5% holdout before semantic or learned channels leave shadow mode. | `iterations/iteration-023.md:6`, `iterations/iteration-023.md:35`, `iterations/iteration-023.md:53` |

## 7. TRACK D FINDINGS

| ID | Verdict | Confidence | Rationale | Evidence |
| --- | --- | --- | --- | --- |
| D1 Current split inventory | `adopt_now` | high | Treat the split inventory as the migration baseline: system-spec-kit MCP owns live graph and hook shell; standalone skill-advisor owns Python scoring, JSON fallback, CLI health, regression, and benchmark harnesses. | `iterations/iteration-024.md:6`, `iterations/iteration-024.md:48`, `iterations/iteration-024.md:68` |
| D2 Migration target layout | `adopt_now` | high | Keep `lib/skill-graph/` as graph plane, consolidate advisor runtime under `lib/skill-advisor/`, add `handlers/skill-advisor/` and `tools/advisor-tools.ts`, and retain Python CLI as a compatibility shim. | `iterations/iteration-025.md:6`, `iterations/iteration-025.md:55`, `iterations/iteration-025.md:67` |
| D3 MCP-tool surface | `adopt_now` | high | Add `advisor_recommend`, `advisor_status`, and `advisor_validate` with strict schemas, public tool definitions, dispatcher registration, and tests; defer batch/benchmark tools. | `iterations/iteration-026.md:6`, `iterations/iteration-026.md:44`, `iterations/iteration-026.md:87` |
| D4 Subprocess elimination | `adopt_now` | medium | Move toward native TypeScript, not PyOdide, but stage the migration behind parity because the Python implementation and CLI compatibility surface are large. | `iterations/iteration-027.md:6`, `iterations/iteration-027.md:48`, `iterations/iteration-027.md:57` |
| D5 Cache + freshness sharing | `adopt_now` | high | Reuse shared cache/freshness primitives, but keep advisor prompt-result caching as a domain-specific wrapper with source-signature, privacy, freshness, and latency contracts. | `iterations/iteration-028.md:6`, `iterations/iteration-028.md:42`, `iterations/iteration-028.md:51` |
| D6 Install/bootstrap | `adopt_now` | high | Update guides, symlinks, verification, and rollback docs to match the MCP-native architecture; do not add a new MCP server registration. | `iterations/iteration-029.md:6`, `iterations/iteration-029.md:49`, `iterations/iteration-029.md:58` |
| D7 Backward compat matrix | `adopt_now` | high | Make native MCP/TypeScript authoritative, but preserve `skill_advisor.py` CLI modes, disable flags, and manual playbook scenarios until parity and docs migration finish. | `iterations/iteration-030.md:6`, `iterations/iteration-030.md:47`, `iterations/iteration-030.md:69` |
| D8 Plugin relationship | `adopt_now` | high | Keep the OpenCode plugin and bridge as a thin runtime adapter; route the backend to native advisor behavior after consolidation and deprecate only subprocess internals later. | `iterations/iteration-031.md:6`, `iterations/iteration-031.md:32`, `iterations/iteration-031.md:41` |

## 8. ARCHITECTURAL SKETCH

The unified architecture has two planes: a graph/freshness plane and an advisor projection/scoring plane. The graph plane receives skill source changes, refreshes derived metadata when provenance inputs change, and commits `skill_nodes` plus `skill_edges` in one SQLite transaction. Only after commit does it publish generation, freshness, and cache invalidation. The advisor plane reads committed graph state into a skill-specific projection, scores with explicit and derived lanes kept separate, and exposes hook, MCP, CLI-shim, and plugin adapter surfaces.

```text
Skill source files
  - SKILL.md identity and explicit keywords
  - references, assets, key files, source docs
  - graph-metadata.json intent_signals and derived block
        |
        v
Derived refresh / provenance worker
  - structured extraction from approved sources
  - derived_fingerprint over B1 inputs
  - sanitizer, anti-stuffing, provenance tags
  - writes graph-metadata.json.derived, not SKILL.md
        |
        v
Skill-graph daemon
  - Chokidar/debounced events
  - content-hash comparison
  - single SQLite transaction
  - upsert skill_nodes, replace changed skill_edges
        |
        v
Post-commit publication
  - advisor generation bump
  - source signature refresh
  - prompt/result cache invalidation
  - freshness: live | stale | absent | unavailable
        |
        v
Advisor projection and scoring
  - explicit_author lane: name, description, Keywords, intent_signals
  - derived_generated lane: derived.trigger_phrases plus provenance
  - lexical/phrase lane: deterministic prompt matching
  - graph/causal lane: bounded skill_edges traversal
  - semantic lane: optional precomputed or shadow semanticHits
  - analytical capped fusion and confidence calibration
        |
        v
Runtime surfaces
  - buildSkillAdvisorBrief() -> native recommendSkills()
  - advisor_recommend, advisor_status, advisor_validate
  - skill_graph_scan/query/status/validate remain graph tools
  - skill_advisor.py shim and OpenCode bridge remain compatibility adapters
```

The required cross-track adjustment is X3: generated keywords are valid inputs, but must enter the C scorer as a separate capped and provenance-aware `derived_generated` lane. They must not masquerade as direct author intent or the current direct `(signal)` boost lane.

## 9. IMPLEMENTATION ROADMAP

| Sub-packet | Scope | Depends on | Effort |
| --- | --- | --- | --- |
| `027/001` | Skill-graph daemon and freshness foundation: narrow watcher, hash-aware scan wiring, scan lease or writer coordination, post-commit generation/cache invalidation, stale/unavailable/fail-open status, rebuild-from-source diagnostics. | A1-A6, A8, D5, X1, X2 | 4-6 days |
| `027/002` | Derived metadata and scoring-signal trust lanes: provenance fingerprint, stale/regenerated/live states, explicit-vs-derived loading, derived caps/haircuts, corpus and adversarial regression gates. | `027/001`, B1-B7, C4, C7, C8, X1, X3 | 5-7 days |
| `027/003` | Native advisor core: skill projection, bounded skill-edge traversal, analytical fusion in TypeScript, conflict and ambiguity handling, prompt-safe diagnostics, Python parity harness. | `027/001`, `027/002`, C1-C8, D2, D4, X2-X4 | 7-10 days |
| `027/004` | MCP advisor surface: `advisor_recommend`, `advisor_status`, `advisor_validate`, strict Zod schemas, dispatcher registration, handler tests, cache/freshness integration. | `027/003`, D2, D3, D5, D6, X4 | 4-6 days |
| `027/005` | Compatibility and bootstrap migration: `skill_advisor.py` shim, native hook/plugin bridge backend, install/bootstrap verification, manual playbooks, disable flags, prompt-safe status. | `027/004`, D6-D8, A5, C6 | 4-6 days |
| `027/006` | Shadow/prototype promotion gates: semantic-hit lane, learned fusion shadow metrics, optional batch/benchmark tools, corpus ablations, accuracy/latency/false-fire gates. | `027/003`, `027/004`, B4, B7, C6-C8, D3 | 3-5 days |

## 10. RISK REGISTER

| ID | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| R1 | Watcher or daemon misses relevant source changes or loops on atomic writes. | Stale graph/advisor results or noisy rescans. | Keep Tier 1 watching narrow, use targeted derived-source stale marking, debounce stable writes, and expose stale/unavailable state. |
| R2 | SQLite writer contention or premature freshness publication corrupts graph trust. | Prompt-time readers could see old/new mixed state or repeated `SQLITE_BUSY`. | Use one SQLite transaction as authority, publish generation only after commit, add scan lease and queued rescan. |
| R3 | Derived keywords inflate confidence or create wrong-skill false fires. | Higher recall hides worse precision. | Split `explicit_author` and `derived_generated` lanes, cap derived contribution, add haircuts and corpus precision checks. |
| R4 | Keyword stuffing or prompt-injection-shaped skill text poisons ranking before rendering. | Malicious or sloppy metadata outranks precise skills. | Add trust lanes, cardinality limits, repetition-density and suspicious-pattern demotions, adversarial fixtures, and gold-`none` gates. |
| R5 | Semantic lookup or learned ranking enters prompt-time path too early. | Hook latency regresses or learned weights overfit a small corpus. | Keep semantic/learned channels shadow-only until C6/C7/C8 accuracy, holdout, latency, and shadow-cycle gates pass. |
| R6 | Native TypeScript port diverges from Python CLI behavior. | Gate 2 fallback, health checks, playbooks, and plugin output break. | Stage `recommendSkills()` behind parity harnesses and keep `skill_advisor.py` as compatibility shim until docs/tests move. |
| R7 | MCP consolidation blurs graph and advisor ownership. | Duplicate graph logic or schema churn. | Preserve `lib/skill-graph` as graph authority and put projection/scoring/status under `lib/skill-advisor` plus `advisor_*` handlers. |
| R8 | Plugin/bridge migration leaks prompts or removes controls too early. | OpenCode users lose prompt-safe status, disable paths, or bridge isolation. | Keep plugin and Node bridge as adapters, preserve prompt-safe diagnostics, and retain disable aliases through migration. |
| R9 | Measurement gates miss ambiguity, `none`, explicit-skill, and latency regressions. | Exact top-1 can improve while critical UX or safety slices regress. | Track full corpus, holdout, per-skill slices, gold `none`, `UNKNOWN`, explicit prompts, ambiguity, p95 latency, and adversarial fixtures. |

## 11. MEASUREMENT PLAN

| Area | Metric | Target | Harness |
| --- | --- | --- | --- |
| Static advisor accuracy | Full corpus exact top-1 | >=70%, at least 140/200 correct | Extended `smart-router-measurement.ts` |
| Frozen holdout | Stratified 20% holdout top-1 | >=70%, at least 28/40 correct | Deterministic holdout split |
| `UNKNOWN` fallback | Full-corpus `UNKNOWN` count | <=10, down from 37 | Static report slice |
| Gold `none` safety | False fires on `none` prompts | No increase from baseline | Static harness plus adversarial fixtures |
| Explicit skill prompts | Explicit-skill top-1/no-abstain | No regression and no derived-lane displacement | Static harness slice |
| Derived lane | Derived-only or derived-dominant matches | Lane attribution required; cannot pass default threshold without direct support unless precision-gated | Static harness with lane ablation |
| Adversarial stuffing | Stuffed/generated trigger abuse | Stuffed skill cannot pass default routing without legitimate direct evidence | New adversarial regression fixtures |
| Regression safety | P0, all-cases, command bridge false positives | P0 pass 1.0, failed cases 0, command-bridge FP <=0.05 | `skill_advisor_regression.py` during compatibility window |
| Native parity | Python vs TypeScript scorer | Same top-1/pass-threshold outcome on canonical regression and corpus before Python removal | Dual-run parity wrapper |
| Hot-path latency | Cache-hit p95 | <=50ms release gate, preserve sub-ms where practical | Advisor timing/bench lane |
| Uncached deterministic latency | Lexical plus skill-graph SQL p95 | <=60ms before default hook use | New advisor bench lane |
| Compatibility latency | Python shim cold/warm p95 | Cold <=60ms, warm <=20ms while shim remains | `skill_advisor_bench.py` |
| Semantic/learned shadow | Promotion gate | >=75% full corpus, >=72.5% holdout, no safety regression, two shadow cycles, no latency breach | Shadow harness and ablations |
| Daemon budget | Idle CPU, RSS, descriptors, debounce | <5% idle CPU, <50MB measured daemon budget, debounce <10s, no broad watch default until pass | Watcher benchmark and `skill_graph_status` |
| Freshness/recovery | Stale/unavailable/rebuild behavior | Prompt-time fail-open diagnostics, source-derived DB rebuild, no mixed generation publication | Integration tests and manual SQLite scenarios |
| Hook/plugin privacy | Diagnostic output | No raw prompt, fingerprint, stdout, or stderr in status streams | Manual hook/plugin privacy scenarios |

## 12. APPENDIX

| ID | Track | Iteration file |
| --- | --- | --- |
| A1 | A | `iterations/iteration-001.md` |
| A2 | A | `iterations/iteration-002.md` |
| A3 | A | `iterations/iteration-003.md` |
| A4 | A | `iterations/iteration-004.md` |
| A5 | A | `iterations/iteration-005.md` |
| A6 | A | `iterations/iteration-006.md` |
| A7 | A | `iterations/iteration-007.md` |
| A8 | A | `iterations/iteration-008.md` |
| B1 | B | `iterations/iteration-009.md` |
| B2 | B | `iterations/iteration-010.md` |
| B3 | B | `iterations/iteration-011.md` |
| B4 | B | `iterations/iteration-012.md` |
| B5 | B | `iterations/iteration-013.md` |
| B6 | B | `iterations/iteration-014.md` |
| B7 | B | `iterations/iteration-015.md` |
| C1 | C | `iterations/iteration-016.md` |
| C2 | C | `iterations/iteration-017.md` |
| C3 | C | `iterations/iteration-018.md` |
| C4 | C | `iterations/iteration-019.md` |
| C5 | C | `iterations/iteration-020.md` |
| C6 | C | `iterations/iteration-021.md` |
| C7 | C | `iterations/iteration-022.md` |
| C8 | C | `iterations/iteration-023.md` |
| D1 | D | `iterations/iteration-024.md` |
| D2 | D | `iterations/iteration-025.md` |
| D3 | D | `iterations/iteration-026.md` |
| D4 | D | `iterations/iteration-027.md` |
| D5 | D | `iterations/iteration-028.md` |
| D6 | D | `iterations/iteration-029.md` |
| D7 | D | `iterations/iteration-030.md` |
| D8 | D | `iterations/iteration-031.md` |
| X1 | X | `iterations/iteration-032.md` |
| X2 | X | `iterations/iteration-033.md` |
| X3 | X | `iterations/iteration-034.md` |
| X4 | X | `iterations/iteration-035.md` |
| S1 | S | `iterations/iteration-036.md` |
| S2 | S | `iterations/iteration-037.md` |
| S3 | S | `iterations/iteration-038.md` |
| S4 | S | `iterations/iteration-039.md` |
| S5 | S | `iterations/iteration-040.md` |
