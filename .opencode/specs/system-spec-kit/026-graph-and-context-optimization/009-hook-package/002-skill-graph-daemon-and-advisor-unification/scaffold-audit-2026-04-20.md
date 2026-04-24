# Phase 027 Scaffold Audit vs Research Synthesis

## Executive Summary
- 6 gaps found (severity breakdown: high 3 / medium 3 / low 0)
- Overall fidelity: concerning
- Top 3 recommendations:
  - Patch 027/001 + 027/002 to explicitly carry A2/B1/B5 derived-source invalidation, including `derived.key_files`, assets/examples/local docs, and targeted watcher/invalidation coverage.
  - Promote A7 sanitizer from a checklist-only note into scoped implementation work with tests before any advisor-visible metadata is stored or published.
  - Convert research.md Section 11 measurement gates into child spec/checklist acceptance gates, especially deterministic 70%/70%, `UNKNOWN <=10`, explicit-skill, gold-`none`, ambiguity, and lifecycle slices.

## Coverage Matrix
| Research item | Source | Assigned child | Status | Notes |
| --- | --- | --- | --- | --- |
| A1 Watcher choice | `research.md:21` | 001 | covered | Chokidar is P0 in `001/spec.md:79` and checklist `001/checklist.md:36`. |
| A2 Change detection scope | `research.md:22` | 001/002 | gap | Skill definition files and graph metadata are covered, but `derived.source_docs` + `derived.key_files` are not fully carried; see Gap 1. |
| A3 Incremental indexer | `research.md:23` | 001 | covered | Hash-aware targeted re-index in `001/spec.md:62`, `001/checklist.md:18`. |
| A4 Transaction model | `research.md:24` | 001 | covered | Post-commit generation publication in `001/spec.md:63`, `001/checklist.md:12`. |
| A5 Daemon lifecycle | `research.md:25` | 001/005 | covered | Fail-open lifecycle in `001/spec.md:66`, compat path in `005/spec.md:68-79`. |
| A6 Resource budget | `research.md:26`, `research.md:163` | 001 | covered | Tightened <=1% CPU / <20MB RSS in `001/spec.md:65`, `001/checklist.md:15`. |
| A7 Sanitization at re-index | `research.md:27` | 001/002 | gap | Only appears as checklist conformance; no scope/task/acceptance owner. See Gap 2. |
| A8 Failure modes | `research.md:28` | 001 | covered/partial | SQLITE_BUSY, ENOENT, rebuild are covered; Track H robustness hardening remains under-specified. |
| B1 Extraction sources | `research.md:34`, `research.md:73-83` | 002 | gap | Commit messages correctly excluded, but assets/examples/key files are missing. See Gap 1. |
| B2 Extraction pipeline | `research.md:35` | 002 | covered | Deterministic n-gram/pattern + DF/IDF in `002/spec.md:61`, `002/checklist.md:39`. |
| B3 Sync model | `research.md:36` | 002 | covered | Writes to `graph-metadata.json.derived`, no SKILL.md overwrite in `002/spec.md:70`, `002/checklist.md:40`. |
| B4 Precision safeguards | `research.md:37` | 002/003 | covered | Trust lanes/caps in `002/spec.md:63-64`; fusion lane in `003/spec.md:67-68`. |
| B5 Freshness trigger | `research.md:38` | 001/002 | gap | Provenance fingerprint exists, but `derived.key_files` and full B1 input invalidation are not scoped. See Gap 1. |
| B6 Corpus stats | `research.md:39` | 002 | covered | DF/IDF startup/debounced updates in `002/spec.md:69`, `002/checklist.md:22`. |
| B7 Adversarial resilience | `research.md:40` | 002 | covered | Anti-stuffing caps/demotions in `002/spec.md:64`, `002/checklist.md:17`. |
| C1 Memory-MCP primitives | `research.md:46` | 003 | covered/caution | Projection is scoped, but wording still says "hybrid" without always restating no prompt-time embeddings. |
| C2 Mapping memory concepts | `research.md:47` | 003 | covered | Project-not-copy memory fields in `003/spec.md:62`, `003/checklist.md:19`. |
| C3 Causal graph traversal | `research.md:48` | 003 | covered/partial | Traversal over `skill_edges` covered; Track I discovery is deferred but not documented. See Gap 6. |
| C4 Scoring fusion | `research.md:49`, `research.md:249-250` | 003 | covered | Five-lane fusion + ablation in `003/spec.md:63-73`. |
| C5 Ambiguity handling | `research.md:50` | 003 | covered | Top-2 within 0.05 in `003/spec.md:70`, `003/checklist.md:21`. |
| C6 Performance | `research.md:51` | 003/006 | covered | Semantic 0.00 and latency bench in `003/spec.md:68`, `003/spec.md:99`, `006/spec.md:66-70`. |
| C7 Training/tuning data | `research.md:52` | 003/006 | covered | Corpus parity/harness in `003/spec.md:73`, shadow replay in `006/spec.md:60`. |
| C8 Target accuracy | `research.md:53`, `research.md:150-162` | 003/006 | gap | Promotion gates exist, but deterministic 70%/70% and slice gates are missing/partial. See Gap 3. |
| D1 Current split inventory | `research.md:59` | 003/005 | covered | 003 inventories/migrates existing files; 005 inventories callers. |
| D2 Target layout | `research.md:60` | 003/004/005/006 | covered | Self-contained package is enforced in `003/spec.md:61`, `004/spec.md:59-63`. |
| D3 MCP tool surface | `research.md:61` | 004 | covered | Child 004 uses `advisor_recommend`, `advisor_status`, `advisor_validate`; parent spec stale. See Gap 5. |
| D4 Subprocess elimination | `research.md:62` | 003/005 | covered | Native TS with shim retained in `003/spec.md:77-80`, `005/spec.md:68-74`. |
| D5 Cache/freshness sharing | `research.md:63` | 001/004 | covered | Source signature/cache integration in `004/spec.md:64`, `004/checklist.md:18`. |
| D6 Install/bootstrap | `research.md:64` | 005 | covered | Install/bootstrap and rollback docs in `005/spec.md:80-87`, `005/checklist.md:14-15`. |
| D7 Backward compatibility | `research.md:65` | 005 | covered | Python shim modes/flags preserved in `005/spec.md:68-79`. |
| D8 Plugin relationship | `research.md:66` | 005 | covered | Plugin remains adapter in `005/spec.md:75-79`, `005/checklist.md:38`. |
| E1 Watcher benchmark | `research.md:230` | 001 | covered | Benchmark gate in `001/spec.md:65`, `001/tasks.md:43-46`. |
| E2 Cross-runtime daemon sharing | `research.md:231` | 001 | covered | Workspace lease in `001/spec.md:61`, `001/checklist.md:11`. |
| E3 WAL contention ceiling | `research.md:232` | 001 | covered | One active writer in `001/checklist.md:44`. |
| E4 Debounce calibration | `research.md:233` | 001 | covered | 2s/1s provisional in `001/spec.md:65`, `001/checklist.md:45`. |
| F1 Age/status haircuts | `research.md:239` | 002 | covered | Derived lane only in `002/spec.md:65`, `002/checklist.md:21`. |
| F2 Supersession | `research.md:240` | 002/005 | covered | Routing in 002, status surface in 005. |
| F3 v1->v2 migration | `research.md:241` | 002 | covered | Mixed reads/backfill in `002/spec.md:68`, `002/checklist.md:14`. |
| F4 Rollback | `research.md:242` | 002/005 | covered | Additive strip in `002/spec.md:84`, status in `005/spec.md:88-92`. |
| F5 z_archive/z_future | `research.md:243` | 002/005 | covered | Indexed/not routed in `002/spec.md:67`, status surfaces in `005/spec.md:90-91`. |
| G1 Initial weights | `research.md:249` | 003 | covered | Weights in `003/spec.md:63-68`. |
| G2 Lane ablation | `research.md:250` | 003 | covered | `ablation.ts` in `003/spec.md:72`, `003/tasks.md:41-43`. |
| G3 Parity definition | `research.md:251` | 003 | covered | Exact top-1 + threshold/abstain in `003/spec.md:73`, `003/checklist.md:13`. |
| G4 Parity harness ownership | `research.md:252` | 003 | covered | Owned by `003/spec.md:73`. |
| G5 Shadow-cycle methodology | `research.md:253` | 006 | covered | Shadow-cycle + no live mutation in `006/spec.md:60`, `006/checklist.md:10`. |
| G6 Promotion gates | `research.md:254` | 006 | covered/partial | Main gates exist; slice coverage from Section 11 is incomplete. See Gap 3. |
| Y1 E x F coherence | `research.md:260` | 001/002 | covered | 002 consumes daemon control plane; listed in `002/checklist.md:50`. |
| Y2 E x G coherence | `research.md:261` | 003/006 | covered | Parity/shadow outside hot path; `003/checklist.md:47`. |
| Y3 F x G adjustment | `research.md:262` | 002/003 | covered | Hard prerequisite in `003/spec.md:88`, `003/checklist.md:48`. |
| Section 11 measurement plan | `research.md:146-165` | 001/003/006 | gap | Daemon/latency mostly covered; accuracy/slice gates incomplete. See Gap 3. |
| Track H deferred robustness | `next-research-paths.md:131-140`, `research.md:289` | 001-005 | gap | Partial inline coverage, not explicit or complete. See Gap 4. |
| Track I causal edge discovery | `next-research-paths.md:142-150`, `research.md:289` | deferred/post-027 | gap | Deferral not recorded in scaffold. See Gap 6. |

## Gaps (detailed)

### Gap 1 - high: Derived-source invalidation omits `derived.key_files` and parts of B1 source coverage
- Research source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:22`, `research.md:34`, `research.md:73-83`, `research.md:270-272`
- Expected location: child 001 watcher/invalidation contract plus child 002 derived provenance/schema
- Observed: 001 narrows watching to graph metadata plus skill definition files only (`002-daemon-freshness-foundation/spec.md:59`) and 002 extraction/provenance covers skill definition content, reference headings, and `intent_signals` (`003-lifecycle-and-derived-metadata/spec.md:61-62`). The v2 `derived` shape includes `source_docs[]` but no `key_files` (`003-lifecycle-and-derived-metadata/spec.md:70`). Asset filenames, examples, and `derived.key_files` do not appear in 002 requirements/checklist (`003-lifecycle-and-derived-metadata/spec.md:81-95`, `003-lifecycle-and-derived-metadata/checklist.md:37-51`).
- Recommended fix: Add explicit fields and gates for `derived.source_docs[]` and `derived.key_files[]`; define which local inputs count as deterministic B1 sources (skill definition headings/body/examples, references headings, assets filenames, graph metadata `intent_signals`, source docs, key files); add targeted invalidation tests proving changes to each input refresh only the affected derived rows. Keep commit messages explicitly out of first slice.

### Gap 2 - high: A7 sanitizer is checklist-only, not scoped implementation work
- Research source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:27`
- Expected location: child 001 and/or 002, depending on where advisor-visible metadata is stored/published
- Observed: 001 mentions A7 only in the research conformance checklist (`002-daemon-freshness-foundation/checklist.md:40`). 001 scope/tasks do not name sanitizer integration or tests (`002-daemon-freshness-foundation/spec.md:58-66`, `002-daemon-freshness-foundation/tasks.md:17-47`). 002 has anti-stuffing and trust lanes, but no renderer/shared-payload sanitizer before persisting/publishing derived metadata (`003-lifecycle-and-derived-metadata/spec.md:60-71`).
- Recommended fix: Add a P0 requirement and task for applying the existing renderer/shared-payload sanitizer before writing `graph-metadata.json.derived`, SQLite rows, status envelopes, or advisor-visible diagnostics. Add fixtures with instruction-shaped skill definition and reference content proving sanitized storage and prompt-safe rendering.

### Gap 3 - high: Section 11 measurement gates are only partially converted into child acceptance criteria
- Research source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:146-165`, especially `research.md:150-155`, `research.md:157-162`
- Expected location: child 003 for deterministic scorer acceptance, child 006 for promotion/shadow acceptance, child 004 for `advisor_validate` outputs
- Observed: 003 gates parity and latency but not the deterministic improvement targets of >=70% full-corpus top-1, >=70% holdout top-1, `UNKNOWN <=10`, gold-`none` no increase, or explicit-skill no-regression (`004-native-advisor-core/spec.md:83-100`, `004-native-advisor-core/checklist.md:9-24`). 006 gates >=75%/72.5% promotion thresholds and gold-`none`, latency, parity, regression fixtures (`007-promotion-gates/spec.md:62-69`, `007-promotion-gates/checklist.md:12-22`), but it does not encode `UNKNOWN <=10`, explicit-skill no-regression, ambiguity slice, or lifecycle-slice checks. 006 plan says those slices are measured (`007-promotion-gates/plan.md:34-38`), but the spec/checklist do not require them.
- Recommended fix: Add 003 P0/P1 gates for deterministic scorer acceptance: >=70% full corpus (140/200), >=70% holdout (28/40), `UNKNOWN <=10`, no gold-`none` false-fire increase, no explicit-skill regression/no-abstain, ambiguity slice stable, and derived-lane attribution/ablation. Add 006 promotion gates for the same slice bundle plus lifecycle fixtures from 002. Add `advisor_validate` response fields in 004 for all Section 11 slices, not only overall accuracy.

### Gap 4 - medium: Track H robustness was meant to be inline, but the scaffold only covers it implicitly and incompletely
- Research source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:131-140`, `next-research-paths.md:176-182`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:287-289`
- Expected location: mostly 001, with 005 docs/playbooks for user-facing recovery
- Observed: 001 covers some related cases: `SQLITE_BUSY`, ENOENT, corrupted SQLite rebuild, descriptor pressure, heartbeat/scan telemetry (`002-daemon-freshness-foundation/spec.md:64-66`, `002-daemon-freshness-foundation/spec.md:93-96`). It does not explicitly assign H1 reindex-storm back-pressure/rate-limit/circuit breaker, H2 malformed SKILL.md quarantine/skip/backoff behavior, H4 editor crash mid-save partial-write scenarios, or H5 alerting/health metrics beyond telemetry. 005 docs/playbooks do not mention Track H recovery scenarios (`006-compat-migration-and-bootstrap/plan.md:11-19`, `006-compat-migration-and-bootstrap/checklist.md:29-41`).
- Recommended fix: Add a small "Track H inline hardening" subsection to 001 plan/spec with H1-H4 acceptance tests and to 005 playbook scope for H5 operator scenarios. Keep it as implementation-local hardening, not a new packet.

### Gap 5 - medium: Parent spec still contains stale pre-synthesis tool names and prompt-time hybrid/embedding framing
- Research source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:51`, `research.md:61`, `research.md:128-130`
- Expected location: parent spec and child 004
- Observed: child 004 correctly scopes `advisor_recommend`, `advisor_status`, and `advisor_validate` (`005-mcp-advisor-surface/spec.md:54`, `005-mcp-advisor-surface/checklist.md:10-13`). Parent spec still says D3 should expose `advisor_match`, `advisor_reindex`, `advisor_status`, `advisor_explain` (`spec.md:135`) and D8 asks whether the plugin should proxy to `advisor_match` (`spec.md:140`). Parent Track C also frames fusion as "keyword score + embedding similarity + causal-boost + tier-weight" (`spec.md:122`) and asks whether embedding lookups can run every prompt (`spec.md:124`) without a clear post-synthesis note that C6 rejected prompt-time embeddings for now.
- Recommended fix: Patch parent spec Section 3 with a short "post-research verdict override" note or update the D3/D8 names directly to `advisor_recommend/status/validate`. Add an explicit C6 note that prompt-time embedding/hybrid lookup stays shadow/prototype and semantic live weight is 0.00 until 006 gates pass.

### Gap 6 - medium: Track I causal-edge discovery is deferred in research but not recorded in the scaffold
- Research source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:142-150`, `next-research-paths.md:154-159`, `next-research-paths.md:181-182`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:287-289`
- Expected location: parent plan/implementation-summary and 003 out-of-scope notes
- Observed: 003 scopes bounded traversal over existing `skill_edges` (`004-native-advisor-core/spec.md:62`, `004-native-advisor-core/spec.md:96`) but never records that edge discovery/population is deliberately deferred. Parent plan and implementation summary do not mention Track I deferral (`plan.md:30-58`, `implementation-summary.md:87-96`).
- Recommended fix: Add Track I as a documented deferral in parent plan or implementation-summary, and add 003 out-of-scope text: no automated edge discovery, no trigger co-occurrence mining, no command-bridge log inference; traversal uses existing/hand-authored `skill_edges` only unless implementation evidence makes Track I blocking.

## Risk Register Conformance
| Risk | Research source | Scaffold coverage | Status |
| --- | --- | --- | --- |
| R1 Watcher misses/loops | `research.md:136` | `001/plan.md:33`, `001/spec.md:59-66` | covered, with Track H hardening gap |
| R2 SQLite contention/publication | `research.md:137` | `001/plan.md:34`, `001/spec.md:61-64` | covered |
| R3 Derived confidence inflation | `research.md:138` | `002/plan.md:34`, `003/plan.md:37` | covered, but source coverage gap affects inputs |
| R4 Keyword stuffing/ranking poisoning | `research.md:139` | `002/plan.md:35`, `002/spec.md:64` | covered |
| R5 Premature semantic/learned promotion | `research.md:140` | `003/plan.md:38`, `006/plan.md:36` | covered |
| R6 TS/Python parity drift | `research.md:141` | `003/plan.md:39`, `005/plan.md:36`, `006/plan.md:37` | covered |
| R7 Graph/advisor ownership blur | `research.md:142` | `004/plan.md:34`, ADR-002 | covered |
| R8 Plugin/privacy/disable regression | `research.md:143` | `004/plan.md:35`, `005/plan.md:37` | covered |
| R9 Measurement blind spots | `research.md:144` | `002/plan.md:36`, `003/plan.md:40`, `006/plan.md:38` | partial; Section 11 slice gates missing from spec/checklists |

### Section 13.7 Delta Coverage
| Delta | Source | Coverage | Status |
| --- | --- | --- | --- |
| R1/R2: benchmark-gated metadata-only watching + one writer | `research.md:281` | 001 benchmark + lease | covered |
| R3: lifecycle normalization before fusion | `research.md:282` | 002 lifecycle fixtures + 003 Y3 gate | covered |
| R5: semantic live weight 0.00 + shadow bundle | `research.md:283` | 003 semantic-shadow + 006 gates | covered |
| R6: exact top-1 + pass-threshold/abstain parity | `research.md:284` | 003 parity harness; 006 gate | covered |
| R9: lifecycle fixtures and non-routing expectations | `research.md:285` | 002 fixtures + 003 consumption | partial; not fully represented in 006 promotion slice gates |

## ADR Accuracy Check
| ADR | Research citation OK? | Decision text accurate? | Notes |
| --- | --- | --- | --- |
| ADR-001 Chokidar + hash-aware SQLite | OK | Accurate | Matches A1/A3/E1. It does not cover A2/A7; those must be handled in child text. |
| ADR-002 self-contained package | OK | Accurate | Matches adjusted D2 and R7; child 003/004 align. |
| ADR-003 five-lane fusion | OK | Accurate | Matches C4/G1/G2/G6. Semantic 0.00 is delegated to ADR-006. |
| ADR-004 single-writer lease | OK | Accurate | Matches E2/E3. |
| ADR-005 additive v1/v2 migration | OK | Accurate | Matches F3/F4. |
| ADR-006 semantic 0.00 promotion gates | OK | Mostly accurate | Main gates match G5/G6, but downstream child gates should also carry Section 11 slice coverage (`UNKNOWN`, explicit skill, ambiguity, lifecycle). |

## next-research-paths.md disposition
- Tracks E/F/G - absorbed into follow-up run OK. The scaffold reflects E in 001, F in 002/005, and G in 003/006.
- Track H - inline-during-impl only partial. 001 covers corrupted SQLite, ENOENT, SQLITE_BUSY, descriptor warnings, and telemetry, but does not explicitly cover H1 reindex-storm back-pressure/circuit breaker, H2 malformed skill definition quarantine/backoff, H4 partial-write crash scenarios, or H5 alerting/playbook coverage.
- Track I - deferred by research, but not noted in scaffold. 003 implements traversal over existing `skill_edges`; no scaffold text says automated edge discovery is out of scope/post-027.

## Final Recommendation
- Is the scaffolding ready for 027/001 `/spec_kit:implement` dispatch? No.
- MUST be patched before starting implementation:
  - Add derived-source/key-file invalidation and schema coverage (Gap 1).
  - Add sanitizer implementation scope/tasks/tests (Gap 2).
  - Add Section 11 measurement gates into 003/004/006 specs/checklists (Gap 3).
- SHOULD be patched but is not independently blocking once MUST items are fixed:
  - Add explicit Track H inline hardening coverage (Gap 4).
  - Update parent spec stale tool names/hybrid wording (Gap 5).
  - Record Track I deferral in parent/003 (Gap 6).
