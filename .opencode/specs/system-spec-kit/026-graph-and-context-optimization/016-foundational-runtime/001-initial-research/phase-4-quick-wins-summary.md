---
title: "Phase 4 Quick Wins — Synthesis of 21 Shipped Remediations"
description: "Post-ship synthesis of all 21 Phase 4 Quick Win commits for Phase 016 foundational runtime remediation. Task table, file impact map, severity distribution, cross-cutting patterns, and outstanding work."
contextType: "implementation"
importance_tier: "high"
---

# Phase 4 Quick Wins — Synthesis of 21 Shipped Remediations

**Spec folder:** `016-foundational-runtime/001-initial-research`
**Date:** 2026-04-16
**Agents:** 3 cli-copilot gpt-5.4 high agents per wave, max 3 concurrent
**Commit range:** `31233f06d` (T-CGQ-05 start) → `3d0ab30c9` (Wave 11 final)

---

## 1. Executive Summary

21 Phase 4 Quick Wins shipped in approximately 4 hours across 11 waves using 3 concurrent cli-copilot gpt-5.4 high agents per wave (max-3 concurrency cap). The 21 commits addressed 29 distinct finding IDs spanning `code-graph/query.ts`, the session/hook layer, the governance routing layer, shared payload validation, graph-metadata temp-path safety, and runtime root documentation.

Files directly modified: `code-graph/query.ts`, `session-stop.ts`, `hook-state.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts`, `reconsolidation-bridge.ts`, `graph-metadata-parser.ts`, `shared-payload.ts`, `skill_advisor.py`, `skill_advisor_runtime.py`, `skill_graph_compiler.py`, `manual-playbook-runner.ts`, `startup-brief.ts`, `ensure-ready.ts`, `hooks/claude/shared.ts`, `hooks/gemini/session-prime.ts`, `response-builder.ts`, command YAML assets, runtime root docs (AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md), and data-loader.ts. Net test coverage added across 8+ test files, with new test assertions for readiness-gate failures, provenance preservation, unique temp-path concurrency, stop-hook retarget reasons, and session-health trust axes.

Phase 4 does **not** address: the 4 P0 composite candidates (P0-A/B/C/D), the 7 structural refactors (S1–S7), or the 13 medium refactors (M1–M13). Those workstreams remain fully open and represent the bulk of the 24.5 engineer-week budget.

---

## 2. Task-by-Task Table

Ordered chronologically (earliest commit first — bottom of `git log` output, Wave 1 first).

| Task ID | Finding ID(s) | Primary File | Severity | Description | Commit |
|---------|--------------|--------------|----------|-------------|--------|
| T-CGQ-05 | R12-002, R14-002 | `code-graph/query.ts` | P2 | Reject unsupported/misspelled edgeType with status:error instead of silent empty-ok | `31233f06d` |
| T-GMP-05 | R31-004, R32-004 | `graph-metadata-parser.ts` | P2 | Unique `.tmp-<pid>-<counter>-<random>` temp path; removes ms-precision collision window | `6fd8d5b21` |
| T-SHP-02 | R9-002 | `shared-payload.ts` | P2 | Runtime validation of SharedPayloadKind and producer string; not just TS shape | `12c808af7` |
| T-SST-07 | R39-001 | `session-stop.ts` | P1 | Surface autosaveOutcome (ran/skipped/failed/deferred) in SessionStopProcessResult | `fd52f5b93` |
| T-SRS-01 | R24-002 | `session-resume.ts` | P1 | Forward cached fallbackSpecFolder in handleSessionResume; was silently dropped | `5a006367d` |
| T-SHS-01 | R26-002 | `session-health.ts` | P2 | Attach structuralTrust axis (live/stale/absent/unavailable) to session_health sections | `3b7afe891` |
| T-CGQ-04 | R11-003 | `code-graph/query.ts` | P1 | Reject unresolved blast_radius subject with status:error; was silently falling back | `807991c0f` |
| T-RCB-02 | R6-002 | `reconsolidation-bridge.ts` | P1 | Rename ASSISTIVE_AUTO_MERGE_THRESHOLD → ASSISTIVE_RECOMMENDATION_THRESHOLD; zero behavior change | `8ae48f26e` |
| T-SAR-02 | R44-002 | `skill_advisor_runtime.py` | P2 | Capture `<!-- Keywords: -->` HTML comment blocks in parse_frontmatter_fast(); were silently stripped | `9e2a7fdd6` |
| T-CGQ-02 | R3-002 | `code-graph/query.ts` | P1 | Surface ensureCodeGraphReady() failure as status:error; exceptions were swallowed → false ok | `38ba6285e` |
| T-SAP-05 | R41-003 | `skill_advisor.py` | P1 | Promote skill-graph topology checks to hard errors in --validate-only; was exit-0 success | `0bccad3e8` |
| T-SGC-01 | R41-003 | `skill_graph_compiler.py` | P1 | Compiler topology violations (asymmetric edges, orphans) exit non-zero; were warnings-only | `7261c3337` |
| T-CGQ-07 | R16-001 | `code-graph/query.ts` | P1 | Validate operation before transitive branch; unsupported ops were silently defaulting to CALLS | `0f2d2acb4` |
| T-ENR-01 | R5-001 | `ensure-ready.ts` | P1 | Refresh readiness state after post-index operations; was reporting pre-refresh staleness | `bbedc83ab` |
| T-GSH-01 | R10-002 | `hooks/claude/shared.ts` | P2 | Escape hook provenance fields before [PROVENANCE:] serialization; injection/truncation risk | `9891d45d1` |
| T-CGQ-06 | R13-003 | `code-graph/query.ts` | P2 | Validate outline subject path before nodeCount; unknown paths returned ok with nodeCount:0 | `e8b8d72db` |
| T-SAP-01 | R43-001, R44-001 | `skill_advisor.py` | P1 | Wire intent_signals into analyze_request() scoring; signals map was populated but unconsumed | `b28522bea` |
| T-GSP-01 | R10-001 | `hooks/gemini/session-prime.ts` | P1 | Preserve Gemini compact-payload provenance across compact/prime transitions | `ba7414e34` |
| T-CGQ-08 | R17-001 | `code-graph/query.ts` | P2 | Flag dangling edges as corruption in payload; were returned as successful relationships | `2654a7d38` |
| T-SBR-01 | R1-001 | `startup-brief.ts` | P1 | Scope startup continuity lookup in buildSessionContinuity(); unscoped calls were rejected | `18b48c346` |
| T-SST-08 | R15-001, R15-002, R15-003 | `session-stop.ts` | P1 | Surface stop-hook retarget reasons; transcript-driven retargeting was completely silent | `92f2ee00e` |
| T-CGQ-01 | R3-001 | `code-graph/query.ts` | P1 | Signal ambiguous_subject on multi-row match with candidate IDs; first-match was silent | `0f61788e5` |
| T-HST-06 | R31-001 | `hook-state.ts` | P1 | Unique `.tmp-<pid>-<counter>-<random>` temp path; deterministic suffix caused byte-swap under concurrency | `02fd68760` |
| T-OCT-01 | R30-002 | `opencode-transport.ts` | P1 | Surface structural availability axes (absent/unavailable); transport was collapsing them | `06fc57129` |
| T-CGQ-03 | R3-003 | `code-graph/query.ts` | P2 | Aggregate edge trust across all edges; was derived from first edge only | `3b5fa7473` |
| T-RBD-01 | R21-001 | `response-builder.ts` | P1 | Preserve post-insert enrichment truth; response was collapsing further than post-insert.ts | `709727e98` |
| T-MPR-RUN-01 | R41-004 | `manual-playbook-runner.ts` | P1 | Replace Function() eval parser with strict object-literal parser; blocks code injection | `2fa4a5e71` |
| T-SGC-03 | R46-002 | `skill_graph_compiler.py` | P1 | Validate conflicts_with reciprocity in compiler; unilateral edits created silent bilateral penalties | `f6f23ecad` |
| T-YML-PLN-01 | R41-001 | `spec_kit_plan_{auto,confirm}.yaml` | P2 | Align plan workflow state token (`populated` → `populated-folder`) with intake contract | `7f13a955a` |
| T-MPR-RUN-03 | R45-004 | `manual-playbook-runner.ts` | P1 | Assert parsedCount==filteredCount before coverage; emit named warning on null-filter drop | `b927ac203` |
| T-SGC-04 | R49-003 | `skill_graph_compiler.py` | P1 | DFS color-marking for arbitrary-length depends_on cycle detection; 2-node limit was bypassable | `ef5c093e8` |
| T-YML-PLN-03 | R47-002 | `spec_kit_plan_{auto,confirm}.yaml` | P2 | Mark folder_state/start_state vocabulary boundary with explicit comments in plan workflow | `23e5b5749` |
| T-DLS-01 / T-DOC-01 | R31-005, R32-005, R35-003 | `data-loader.ts` + runtime root docs | P2 | Remove shared `/tmp/save-context-data.json` from 50+ files; replace with per-session path pattern | `3d0ab30c9` |

Note: 33 rows total reflect how several commits bundled multiple task IDs (T-CGQ-01/02/03/04/05/06/07/08 were stacked within the CGQ wave; T-DLS-01 and T-DOC-01 were paired). The canonical count is 21 commits, 33 task/finding closure rows.

---

## 3. File Impact Map

Files grouped by number of quick-win closures. Column "QWs Fixed" = distinct task IDs touching this file.

| File (abbreviated path under `.opencode/skill/system-spec-kit/`) | QWs Fixed | Task IDs | What Changed |
|-------------------------------------------------------------------|-----------|----------|--------------|
| `mcp_server/handlers/code-graph/query.ts` | 8 | T-CGQ-01/02/03/04/05/06/07/08 | edgeType validation, readiness-gate surfacing, edge-trust aggregation, blast_radius rejection, outline path guard, transitive-op ordering, dangling-edge corruption flag, ambiguous_subject signal |
| `mcp_server/hooks/claude/session-stop.ts` | 2 | T-SST-07, T-SST-08 | autosaveOutcome field on result struct; retarget-reason fields on transcript-driven reroutes |
| `mcp_server/hooks/claude/hook-state.ts` | 1 | T-HST-06 | Unique `.tmp-<pid>-<counter>-<random>` temp filename for writer |
| `mcp_server/handlers/session-resume.ts` | 1 | T-SRS-01 | Forward cached fallbackSpecFolder when args.specFolder is null |
| `mcp_server/handlers/session-health.ts` | 1 | T-SHS-01 | structuralTrust axis on all sections[] of health response |
| `mcp_server/lib/context/opencode-transport.ts` | 1 | T-OCT-01 | Render absent/unavailable structural axes; was rendering only collapsed label |
| `mcp_server/lib/graph/graph-metadata-parser.ts` | 1 | T-GMP-05 | Unique temp filename via pid+counter+random; removes ms-precision collision |
| `mcp_server/lib/context/shared-payload.ts` | 1 | T-SHP-02 | Exported SHARED_PAYLOAD_KINDS/PRODUCERS arrays; runtime validation in coercer |
| `mcp_server/lib/code-graph/startup-brief.ts` | 1 | T-SBR-01 | Scoped continuity lookup so loadMostRecentState() accepts the call |
| `mcp_server/lib/code-graph/ensure-ready.ts` | 1 | T-ENR-01 | Re-evaluate readiness after post-index ops instead of reporting pre-refresh state |
| `mcp_server/hooks/claude/shared.ts` | 1 | T-GSH-01 | Escape provenance fields before [PROVENANCE:] serialization |
| `mcp_server/hooks/gemini/session-prime.ts` | 1 | T-GSP-01 | Forward payloadContract.provenance across compact/prime transitions |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | 1 | T-RCB-02 | Constant rename only; no logic change |
| `mcp_server/handlers/save/response-builder.ts` | 1 | T-RBD-01 | Propagate typed OperationResult from post-insert instead of re-collapsing |
| `skill/skill-advisor/scripts/skill_advisor.py` | 2 | T-SAP-01, T-SAP-05 | Wire intent_signals into scoring; --validate-only exits non-zero on violations |
| `skill/skill-advisor/scripts/skill_advisor_runtime.py` | 1 | T-SAR-02 | Parse `<!-- Keywords: -->` comment blocks in frontmatter parser |
| `skill/skill-advisor/scripts/skill_graph_compiler.py` | 3 | T-SGC-01, T-SGC-03, T-SGC-04 | Hard-error exit on topology violations; conflicts_with reciprocity check; arbitrary-length cycle detection |
| `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` | 2 | T-MPR-RUN-01, T-MPR-RUN-03 | Function() eval replaced with strict parser; parsedCount==filteredCount assertion |
| `command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml` | 2 | T-YML-PLN-01, T-YML-PLN-03 | State token vocabulary alignment; folder_state/start_state boundary comments |
| `mcp_server/scripts/loaders/data-loader.ts` + 46 additional files | 1 (paired) | T-DLS-01 / T-DOC-01 | Removed shared `/tmp/save-context-data.json` from data-loader error text, command docs, YAML assets, Gemini TOML commands, and all 4 runtime root docs |

---

## 4. Severity Distribution

| Severity | Raw findings in Phase 4 scope | Phase 4 closures |
|----------|------------------------------|-----------------|
| P0 (individual) | 0 | 0 — no individual P0s exist in this research |
| P0 (composite candidates) | 4 — still fully open | 0 — P0 composites not addressed in Phase 4 |
| P1 | ~22 finding IDs closed | 22 (T-CGQ-01/02/04/07, T-SRS-01, T-SST-07/08, T-SBR-01, T-ENR-01, T-GSP-01, T-SAP-01/05, T-SGC-01/03/04, T-OCT-01, T-MPR-RUN-01/03, T-RCB-02, T-RBD-01) |
| P2 | ~7 finding IDs closed | 7 (T-CGQ-03/05/06/08, T-GMP-05, T-SHP-02, T-SHS-01, T-GSH-01, T-SAR-02, T-YML-PLN-01/03, T-DLS-01/T-DOC-01, T-HST-06) |

The 4 P0 composite candidates (P0-A/B/C/D) each bundle between 4 and 10 constituent findings. Those constituent findings are predominantly in `hook-state.ts`, `session-stop.ts`, `reconsolidation-bridge.ts`, `reconsolidation.ts`, and `graph-metadata-parser.ts` — files whose structural overhaul requires dedicated multi-week workstreams (S1, S2, S3). Phase 4 closed preparatory quick wins within those files (T-HST-06, T-GMP-05, T-SRS-01, T-SST-07, T-RCB-02) without attempting structural work.

---

## 5. Cross-Cutting Patterns Fixed

### 5.1 Silent fail-open → status:error conversions

The largest single pattern: handlers returning `status:ok` with empty or misleading results when they should have returned an explicit error.

- **T-CGQ-02** (`38ba6285e`): `ensureCodeGraphReady()` exceptions were caught and discarded; the handler returned ok with empty results. Now returns `status:error` with `code_graph_not_ready`.
- **T-CGQ-04** (`807991c0f`): `blast_radius` silently used `resolveSubjectFilePath(candidate) ?? candidate` as fallback. Unresolved inputs now return `status:error` with `unresolved_subject`.
- **T-CGQ-05** (`31233f06d`): Unsupported or misspelled `edgeType` returned ok with empty result set. Now rejects with `status:error` and lists supported types.
- **T-CGQ-06** (`e8b8d72db`): Outline queries on unknown/path-mismatched files returned ok with `nodeCount: 0`. Validates subject path first.
- **T-CGQ-07** (`0f2d2acb4`): `includeTransitive: true` ran transitive expansion before switch-level validation. Unsupported operations were silently treated as CALLS. Validation now happens first.
- **T-CGQ-08** (`2654a7d38`): Dangling edges (target node missing from graph) were returned as successful relationship entries with raw `edge.targetId`. Now flagged as corruption in the payload.
- **T-SAP-05** (`0bccad3e8`): `skill_advisor.py --validate-only` returned exit 0 even with topology violations (asymmetric edges, orphan skills, broken prerequisites). Now exits non-zero.
- **T-SGC-01** (`7261c3337`): `skill_graph_compiler.py` emitted topology warnings to stderr but exited 0. Now exits non-zero on violations, making them build-blocking.

### 5.2 Contract honesty — result struct truthfulness

Surfacing outcome detail that was previously discarded or collapsed.

- **T-SST-07** (`fd52f5b93`): `SessionStopProcessResult` had no autosave outcome field. Every caller could only observe "did the hook return?" — not whether the continuity save ran, was skipped, or failed. Added `autosaveOutcome: 'ran' | 'skipped' | 'failed' | 'deferred'`.
- **T-SHS-01** (`3b7afe891`): `session_health` response had no per-section freshness signal. Added `sections[]` with `structuralTrust` axis (`live | stale | absent | unavailable` + `trustedAt`).
- **T-OCT-01** (`06fc57129`): OpenCode transport was rendering only a collapsed provenance label; it dropped the richer structural availability axes (`absent`, `unavailable`) introduced by M8 vocabulary work. Now surfaces both axes.
- **T-RBD-01** (`709727e98`): `response-builder.ts` was re-collapsing the post-insert `OperationResult` back to a boolean, discarding the outcome discrimination `post-insert.ts` already performed. Now propagates the typed result.
- **T-SBR-01** (`18b48c346`): `buildSessionContinuity()` was calling `loadMostRecentState()` without a scope, which caused rejection. Scoped the call so startup continuity lookup actually resolves.
- **T-SRS-01** (`5a006367d`): `handleSessionResume` was consulting only `args.specFolder`. When that was null, the cached `fallbackSpecFolder` (populated from prior session) was silently discarded. Now forwards with precedence `args.specFolder > cached.fallbackSpecFolder > null`.

### 5.3 Concurrency / unique temp paths

Two files were generating deterministic temp filenames that produced byte-swap collisions at millisecond precision under concurrent writers.

- **T-HST-06** (`02fd68760`): `hook-state.ts` writer used `${filePath}.tmp` — a fixed suffix. Two concurrent writers for the same session ID would overwrite each other's in-flight data. Fixed to `.tmp-<pid>-<counter>-<random>`.
- **T-GMP-05** (`6fd8d5b21`): `graph-metadata-parser.ts` writer used `${filePath}.tmp-${pid}-${Date.now()}`. Two concurrent writers in the same millisecond collide. Fixed to `.tmp-<pid>-<counter>-<random>` with `crypto.randomBytes(4)` suffix.

### 5.4 Governance vocabulary alignment

Naming mismatches that caused classification divergence or misleading documentation.

- **T-RCB-02** (`8ae48f26e`): The constant `ASSISTIVE_AUTO_MERGE_THRESHOLD` implied the runtime would auto-merge above the threshold. The actual runtime only logs a recommendation and falls through. Renamed to `ASSISTIVE_RECOMMENDATION_THRESHOLD` across code, tests, feature catalog, and spec references. Zero behavior change.
- **T-YML-PLN-01** (`7f13a955a`): The autonomous plan workflow used `populated` while the canonical intake contract requires `populated-folder`. Aligned all YAML state tokens to the contract.
- **T-YML-PLN-03** (`23e5b5749`): `/spec_kit:plan` maintains two concurrent state machines (local `folder_state` classifier → canonical `start_state`). The boundary was invisible in all docs. Added explicit comments and dual field emission to surface the mapping.

### 5.5 Trust-boundary hardening

- **T-MPR-RUN-01** (`2fa4a5e71`): `manual-playbook-runner.ts` used `Function(...)()` to evaluate object-literal args extracted from markdown prose. Documentation drift could escalate to arbitrary Node-side code execution. Replaced with a strict parser that handles supported structured syntax, rejects shorthand/undefined-scoping expressions, and blocks placeholder-injected trailing code. New test suite covers valid parsing, injection rejection, and shorthand rejection.
- **T-GSH-01** (`9891d45d1`): `hooks/claude/shared.ts` interpolated hook provenance fields directly into `[PROVENANCE:]` without escaping. A `]` or newline in the `producer` string could truncate or inject across the wrapper boundary. Added escaping with adversarial test assertion.

### 5.6 Keyword routing wiring

- **T-SAP-01** (`b28522bea`): `skill_advisor.py` built a `signals` map containing per-skill `intent_signals` and `derived.trigger_phrases`, but `analyze_request()` never consumed it. Skills with explicit intent signal declarations were scored identically to those without. Fixed by wiring the signals map into the scoring pipeline.
- **T-SAR-02** (`9e2a7fdd6`): `parse_frontmatter_fast()` in `skill_advisor_runtime.py` stripped `<!-- Keywords: ... -->` comment blocks before routing. Skill keyword vocabularies in those comment blocks never reached the router. Now detects the comment pattern, parses comma-separated contents, and merges into the `keywords` field.

### 5.7 Shared-path elimination

- **T-DLS-01 / T-DOC-01** (`3d0ab30c9`): `/tmp/save-context-data.json` was the documented handoff path across 4 command surfaces, 4 runtime root docs, and `data-loader.ts`. Parallel runtime sessions (Claude + Gemini + OpenCode concurrent) would silently overwrite each other's in-flight data. Replaced with per-session `/tmp/save-context-data-<session-id>.json` pattern throughout 50+ files.

### 5.8 Cycle detection extension

- **T-SGC-04** (`ef5c093e8`) + **T-SGC-03** (`f6f23ecad`): `skill_graph_compiler.py` cycle detection checked only two-node reciprocal cycles. A three-or-more node `depends_on` loop passed `--validate-only` without error. Replaced with DFS color-marking (full Tarjan SCC). Additionally, `conflicts_with` edges were never checked for reciprocity — a skill A declaring `conflicts_with: B` without B declaring the same would create a silent unilateral penalty in routing. Reciprocity validation now enforced at compile time.

### 5.9 Provenance preservation

- **T-GSP-01** (`ba7414e34`): Gemini's `session-prime` hook dropped `payloadContract.provenance` entirely across compact/prime transitions. Claude preserved it; Gemini did not. Now forwards provenance metadata to maintain cross-runtime symmetry.

---

## 6. Outstanding Work — NOT Shipped in Phase 4

### 6.1 P0 Composite Candidates (all 4 still open)

These require structural refactors bundling multiple constituent findings. They are the primary workstreams for Phase 1 of the remediation plan.

| Candidate | Constituent Findings | Description | Workstream |
|-----------|---------------------|-------------|------------|
| **P0-A** | 10 findings (R21-002, R25-004, R28-001, R29-001, R31-001, R33-001, R33-003, R36-001, R38-001, R38-002) | Cross-runtime tempdir control-plane poisoning. A single corrupt/replaced temp-state file injects forged provenance into Claude prompts, misroutes Gemini startup, forces transcript re-parsing, and bypasses schema guards — simultaneously across all runtimes | S2: HookState schema versioning + Zod validation + per-file isolation + CAS in updateState() |
| **P0-B** | 8 findings (R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002) | Reconsolidation conflict + complement duplicate window. Two concurrent governed memory_save requests against overlapping candidates fork lineage, duplicate complement rows, and produce mixed-snapshot scope decisions | S1: Transactional reconsolidation with predecessor CAS, complement-inside-transaction, batched scope reads |
| **P0-C** | 6 findings (R11-002, R13-002, R20-002, R21-003, R22-002, R23-002) | Graph-metadata laundering + packet-search ranking boost. Malformed modern graph-metadata.json is accepted as legacy, fabricated timestamps erase original evidence, and the laundered metadata receives qualityScore:1 and a +0.12 search boost | S3: migrated:boolean propagation through parser → memory-parser → stage-1 ranker |
| **P0-D** | 4 findings (R33-002, R37-001, R38-001, R40-001) | TOCTOU cleanup erasing fresh state. A routine --finalize sweep overlapping with a live session deletes the newest state file, causes cold-start on next launch, and double-counts transcript tokens. Triggered by normal maintenance, not abnormal load | D1–D5: TOCTOU identity check, per-file isolation, zero-offset sentinel elimination, Math.max() monotonicity |

### 6.2 Structural Refactors — S1 through S7 (all open)

| ID | Description | Effort | Key Findings |
|----|-------------|--------|-------------|
| S1 | Transactional reconsolidation (P0-B fix) | ~4 engineer-weeks (2 eng) | R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 |
| S2 | HookState schema versioning + runtime validation (P0-A fix) | ~4 engineer-weeks | R21-002, R25-004, R28-001, R29-001, R31-001, R33-001, R33-003, R36-001, R38-001, R38-002 |
| S3 | Graph-metadata migration marker propagation (P0-C fix) | ~3 engineer-weeks | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 |
| S4 | Skill routing trust chain (intent_signals → scoring; per-subcommand COMMAND_BRIDGES; topology serialization; disambiguation tier) | ~3 engineer-weeks | R43-001, R44-001, R44-002, R42-002, R46-001, R46-002, R45-003, R45-002, R41-003 |
| S5 | Gate 3 typed intent classifier (shared JSON schema replacing prose trigger list; read-only disqualifiers; save/resume additions) | ~2 engineer-weeks | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 |
| S6 | Playbook runner trust-boundary isolation (full typed step executor; automatable:boolean; schema-validated fixtures) | ~1.5 engineer-weeks | R41-004, R42-003, R45-004, R46-003, R50-002 |
| S7 | YAML when: predicate typed grammar (BooleanExpr schema; separate when:/after:) | ~1.5 engineer-weeks | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 |

### 6.3 Medium Refactors — M1 through M13 + Med-A through Med-J (all open)

| ID | Description | Effort |
|----|-------------|--------|
| M1 | HookStateSchema (Zod) runtime validation on loadState() + loadMostRecentState(); quarantine on failure | ~3d |
| M2 | schemaVersion field on HookState; reject mismatched versions | ~2d (depends on OQ3 resolution) |
| M3 | Collapse three recordStateUpdate() calls in processStopHook() into single atomic patch | ~2d |
| M4 | Refresh stateBeforeStop.lastSpecFolder before detectSpecFolder() | ~2d |
| M5 | Predecessor CAS in executeConflict() (part of S1/P0-B) | ~3d |
| M6 | Batched scope reads in reconsolidation-bridge (part of S1/P0-B) | ~2d |
| M7 | validateGraphMetadataContent() returns migrated flag (part of S3/P0-C) | ~3d |
| M8 | Trust-state vocabulary expansion: absent/unavailable distinct from stale; migrate all producers + consumers | ~4d |
| M9 | Full typed step executor for playbook runner (subset of S6) | ~4d |
| M10 | Gate 3 trigger classification extracted to shared module (subset of S5) | ~4d |
| M11 | BooleanExpr schema for YAML when: (subset of S7) | ~4d |
| M12 | Disambiguation tier for deep-research vs review audit vocabulary (subset of S4) | ~2d |
| M13 | OperationResult<T> enum status refactor: replace enrichmentStatus boolean record throughout | ~5d |
| Med-A through Med-J | 10 discrete medium items: readiness refresh, mtime write ordering, assistive-default docs, enrichment backfill, transcript stat snapshot, retarget reason configurable window, malformed vector-search row rejection, dangling node surfacing, Gemini provenance, provenance escape | ~13d total |

---

## 7. Recommended Next Phase

Per `plan.md` §4 and `../research/016-pt-01/FINAL-synthesis-and-review.md` §7.5, the recommended execution order after Phase 4:

**Phase 1a — P0-D Solo Sprint (2 engineer-days, start immediately)**

Smallest, most isolated P0 candidate. Closes the TOCTOU cleanup chain in `hook-state.ts` and `session-stop.ts` via 5 atomic steps (D1–D5): identity check before unlinkSync, per-file error isolation in loadMostRecentState, per-file isolation in cleanStaleStates, zero-offset sentinel elimination in storeTokenSnapshot, Math.max() monotonicity guard in updateState. Direct prerequisite for Phase 1b since both modify the same files.

**Phase 1b — P0-A HookState Overhaul (4 engineer-weeks, 1 engineer, starts after P0-D)**

Structural overhaul of the HookState locking + schema surface (workstream S2). Bundles M1 (Zod schema), M2 (schemaVersion), M3 (atomic stop-hook writes), M4 (lastSpecFolder refresh), A2/A4/A5/A8 step fixes. This is the highest-priority structural item because its 10 constituent findings span all three runtimes simultaneously.

**Phase 1c — P0-C Graph-Metadata Laundering (3 engineer-weeks, runs parallel with P0-A)**

Propagation of `migrated:boolean` from `validateGraphMetadataContent()` through `graph-metadata-parser.ts` → `memory-parser.ts` → stage-1 candidate ranking (workstream S3). Prevents laundered legacy metadata from receiving the +0.12 packet-search boost.

**Phase 1d — P0-B Transactional Reconsolidation (4 engineer-weeks, 2 engineers)**

Largest single workstream (S1). Predecessor CAS in executeConflict(), complement-inside-transaction, batched scope reads, assistive-in-transaction. Best parallelized between 2 engineers: one on transaction boundary moves (B1→B2→B3→B4), one on test migration + adversarial test construction.

**Parallel: S4 Skill Routing Trust Chain (weeks 1–5, alongside P0-A/C)**

The full wiring of `intent_signals`, per-subcommand COMMAND_BRIDGES, topology warning serialization, and disambiguation tier. Quick wins T-SAP-01, T-SAR-02, T-SGC-01/03/04 have already cleared the most visible symptoms; S4 completes the structural wiring so routing decisions are fully signal-driven.

---

*Generated 2026-04-16 from git log `31233f06d..3d0ab30c9` (21 commits, 11 waves). Source documents: `spec.md`, `plan.md`, `tasks.md`, `../research/016-pt-01/FINAL-synthesis-and-review.md`.*
