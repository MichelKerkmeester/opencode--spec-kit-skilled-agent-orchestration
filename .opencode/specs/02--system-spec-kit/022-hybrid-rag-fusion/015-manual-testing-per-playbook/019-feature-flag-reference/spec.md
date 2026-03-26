---
title: "Feature Specification: manual-testing-per-playbook feature-flag-reference phase [template:level_2/spec.md]"
description: "Phase 019 documents the feature-flag-reference manual test packet for the Spec Kit Memory system. It groups eight flag-catalog and Hydra roadmap scenarios from the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "feature flag reference manual testing"
  - "phase 019 feature flag reference"
  - "SPECKIT flags classification tests"
  - "hybrid rag fusion flag catalog playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook feature-flag-reference phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [018-ux-hooks](../018-ux-hooks/spec.md) |
| **Successor** | [020-feature-flag-reference](../020-feature-flag-reference/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual feature-flag-reference scenarios for the Spec Kit Memory system live inside the central playbook and require a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated feature-flag-reference packet, Phase 019 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single feature-flag-reference-focused specification that maps all eight Phase 019 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook. The eight tests cover SPECKIT_* flag classification (EX-028), session and cache policy retrieval (EX-029), MCP configuration limits (EX-030), DB path precedence (EX-031), embedding provider selection (EX-032), debug and telemetry toggles (EX-033), CI branch metadata vars (EX-034), and Hydra roadmap capability flag isolation (125).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-028 | Flag catalog verification | [`../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) | `List SPECKIT flags active/inert/deprecated` | `memory_search({ query:"SPECKIT flags active inert deprecated", limit:20 })` -> `memory_context({ mode:"deep", prompt:"Classify SPECKIT flags as active, inert, or deprecated", sessionId:"ex028" })` |
| EX-029 | Session policy audit | [`../../feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md`](../../feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md) | `Retrieve dedup/cache policy settings` | `memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })` |
| EX-030 | MCP limits audit | [`../../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md`](../../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md) | `Find MCP validation settings defaults` | `memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })` |
| EX-031 | Storage precedence check | [`../../feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md`](../../feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md) | `Explain DB path precedence env vars` | `memory_search({ query:"SPEC_KIT_DB_DIR SPECKIT_DB_DIR database path precedence", limit:20 })` -> `memory_context({ mode:"focused", prompt:"Explain DB path precedence env vars", sessionId:"ex031" })` |
| EX-032 | Provider selection audit | [`../../feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md`](../../feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md) | `Retrieve embedding provider selection rules` | `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })` |
| EX-033 | Observability toggle check | [`../../feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md`](../../feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md) | `List telemetry/debug vars and separate opt-in flags from inert flags` | `memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 })` |
| EX-034 | Branch metadata source audit | [`../../feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md`](../../feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md) | `Find branch env vars used in checkpoint metadata` | `memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })` |
| 125 | Hydra roadmap capability flags | [`../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) | `Validate memory roadmap flag snapshots without changing live graph-channel defaults.` | `1) cd .opencode/skill/system-spec-kit/mcp_server 2) SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))" 3) SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` |

### Out of Scope
- Executing the eight feature-flag-reference scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-feature-flag-reference phases from `001-retrieval/` through `018-ux-hooks/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 019 feature-flag-reference requirements, test inventory, and acceptance criteria |
| `plan.md` | Rewrite | Phase 019 feature-flag-reference execution plan and review workflow |
| `tasks.md` | Rewrite | Phase 019 task tracker — all tasks pending |
| `checklist.md` | Rewrite | Phase 019 verification checklist — all items unchecked |
| `implementation-summary.md` | Rewrite | Blank template pending execution |
| `description.json` | Rewrite | Reset to Draft, Not Started |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-028 flag catalog verification: classify SPECKIT_ flags as active, inert, or deprecated. | PASS if classifications are internally consistent; validate active, inert, and deprecated flags against code/config docs |
| REQ-002 | Execute EX-029 session policy audit: surface all required session/cache control keys. | PASS if all required session/cache control keys are surfaced; expand query terms on failure |
| REQ-003 | Execute EX-030 MCP limits audit: identify defaults and keys for MCP guardrails. | PASS if defaults and keys for MCP guardrails are identified; verify in config files directly on failure |
| REQ-004 | Execute EX-031 storage precedence check: confirm DB path precedence chain is unambiguous. | PASS if DB path precedence chain is unambiguous; cross-check startup config loader on failure |
| REQ-005 | Execute EX-032 provider selection audit: confirm provider routing and key precedence. | PASS if provider routing and key precedence are clear; verify env in runtime on failure |
| REQ-006 | Execute EX-033 observability toggle check: clearly separate opt-in versus inert controls. | PASS if opt-in versus inert controls are clearly separated; check feature flag governance section on failure |
| REQ-007 | Execute EX-034 branch metadata source audit: surface all listed branch env vars. | PASS if all listed branch env vars are found; search CI scripts and runtime helpers on failure |
| REQ-008 | Execute 125 Hydra roadmap capability flag isolation: verify two dist-build snapshots with distinct env var injection. | PASS if runtime SPECKIT_GRAPH_UNIFIED flag does not flip roadmap metadata and SPECKIT_HYDRA_* env vars can explicitly opt out of the roadmap snapshot |

No P1 items are defined for this phase; all eight feature-flag-reference scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 feature-flag-reference scenarios (EX-028 through EX-034 and 125) are executed with evidence captured per the review protocol.
- **SC-002**: Each scenario has a PASS, PARTIAL, or FAIL verdict with explicit rationale.
- **SC-003**: Coverage is reported as 8/8 with no skipped test IDs.
- **SC-004**: 125 snapshot comparison outputs are captured before any env cleanup.
### Acceptance Scenarios

**Given** the `019-feature-flag-reference` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `019-feature-flag-reference` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `019-feature-flag-reference` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `019-feature-flag-reference` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review; do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/19--feature-flag-reference/`](../../feature_catalog/19--feature-flag-reference/) | Supplies feature context for each flag-reference scenario | Keep every test row linked to its mapped feature-flag-reference file |
| Dependency | MCP runtime and `dist` build of `capability-flags.js` | Required to execute `memory_search`, `memory_context`, and 125 node-based snapshot scenarios | Verify the dist build is current before executing 125 and confirm `memory_search` is available |
| Risk | 125 requires a freshly compiled dist build; stale builds produce incorrect snapshot results | High | Run `npm run build` inside the mcp_server directory before executing 125 and inspect `capability-flags.ts` if snapshots diverge from expectations |
| Risk | EX-028 through EX-034 rely on memory search retrieving indexed flag documentation; results may be sparse if flag docs have not been indexed | Medium | Run `memory_index_scan({ force:true })` if search results are unexpectedly sparse, then retry the affected scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which indexed corpus is expected to hold the SPECKIT flag documentation so EX-028 through EX-034 memory_search calls return relevant results? Should a dedicated flag-reference memory file be pre-indexed before execution?
- For 125, should both dist build runs use the same `mcp_server` working directory, or is there a preferred test environment that isolates env var bleed between the two snapshot commands?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: EX-028 through EX-034 MCP calls must complete within the standard tool timeout window.
- **NFR-P02**: 125 node invocations must each complete in under 10 seconds; a timeout indicates a build or module resolution issue.

### Security
- **NFR-S01**: No real API keys (COHERE_API_KEY, OPENAI_API_KEY, VOYAGE_API_KEY) may appear in evidence artifacts; use variable names only.
- **NFR-S02**: SPECKIT_HYDRA_* env var injection for 125 must be scoped to single shell invocations; unset after snapshot capture.

### Reliability
- **NFR-R01**: If MCP search returns 0 results for a flag-reference scenario, document the EVIDENCE GAP and triage via feature catalog cross-reference per playbook instructions; do not fabricate retrieval evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- EX-028 zero-result search: triage via feature catalog cross-reference; verdict PARTIAL (not FAIL) if classification is confirmed via catalog.
- 125 snapshot key absent from JSON output: verify dist build and re-run; do not accept undefined as a valid value.

### Error Scenarios
- 125 module not found: run `npm run build` and retry; if still failing, mark BLOCKED with verbatim error.
- EX-031 to EX-034 zero results: run `memory_index_scan({ force:true })` and retry once before accepting PARTIAL triage path.

### State Transitions
- 125 step 2 env var bleed: if SPECKIT_HYDRA_PHASE leaks into step 1 re-run, unset all SPECKIT_HYDRA_* vars and restart from step 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 8 scenarios, 7 read-only MCP and 1 node snapshot |
| Risk | 12/25 | Indexed corpus dependency, dist build freshness, env var isolation |
| Research | 6/20 | Exact prompts and commands already defined in playbook |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
