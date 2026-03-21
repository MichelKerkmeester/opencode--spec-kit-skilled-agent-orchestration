---
title: "Implementation Plan: manual-testing-per-playbook memory quality and indexing phase [template:level_1/plan.md]"
description: "Phase 013 defines the execution plan for 42 exact memory-quality-and-indexing scenario IDs in the Spec Kit Memory system, including the dedicated memory-section sub-scenarios."
trigger_phrases:
  - "memory quality execution plan"
  - "phase 013 manual tests"
  - "indexing verdict plan"
  - "manual testing playbook memory save"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook memory quality and indexing phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem spec folder + sandbox artifacts + runtime metadata |
| **Testing** | manual + MCP |

### Overview
This plan converts the memory-quality-and-indexing scenarios in the manual testing playbook into an ordered execution workflow for Phase 013. The phase now tracks 42 exact IDs by keeping the original top-level scenarios while explicitly breaking out `M-005a..c`, `M-006a..c`, and `M-007a..j`. The phase starts with source verification and sandbox setup, runs lower-risk inspection and dry-run scenarios first, isolates stateful save and corruption tests in disposable workspaces, and closes with review-protocol verdicting across all 42 exact IDs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`](../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md).
- [x] PASS, PARTIAL, FAIL, and coverage rules were loaded from [`../../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md`](../../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md).
- [x] All 42 exact scenario IDs were mapped to feature-catalog context, including source-backed judgment calls for `M-001` through `M-004`.
- [x] Destructive scenarios that write files, corrupt metadata, restart services, or mutate indexing state were identified for sandbox-only execution.

### Definition of Done
- [ ] All 42 exact scenario IDs have prompt, command, evidence, and verdict records tied to the playbook wording.
- [ ] Every destructive scenario was executed in a disposable sandbox or restored from checkpoint before phase closeout.
- [ ] Coverage is reported as 42/42 exact IDs for Phase 013 with no skipped scenario IDs.
- [ ] Final reviewer output uses review-protocol verdict language and clearly distinguishes PASS, PARTIAL, and FAIL evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual memory-quality test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: playbook rows, review protocol, mapped feature files, sandbox spec folders, and checkpoint rules.
- **Execution layer**: manual operator actions plus MCP calls such as `memory_save`, `memory_search`, `memory_stats`, `memory_index_scan`, and related CLI/script commands.
- **Evidence bundle**: save outputs, search traces, JSON artifacts, description.json snapshots, service-restart comparisons, and validator output.
- **Verdict layer**: review-protocol checks that classify each exact scenario ID as PASS, PARTIAL, or FAIL and enforce full phase coverage.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply review-protocol verdict`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify the playbook, review protocol, and all linked feature files match the 42-ID Phase 013 inventory.
- [ ] Confirm MCP runtime access for `memory_save`, `memory_search`, `memory_stats`, `memory_index_scan`, and any required CLI/script entry points.
- [ ] Prepare disposable sandbox spec folders, temporary JSON files under `/tmp`, and restart-safe test notes before any write or corruption scenario begins.
- [ ] Record baseline environment variables, API-key state, DB path context, and checkpoint availability before stateful execution.

### Phase 2: Non-Destructive Tests
- [ ] Run inspection and dry-run-first scenarios before mutation-heavy cases: `039`, `040`, `041`, `045`, `046`, `047`, `048`, `069`, `073`, `131`, `133`, `M-001`, `M-002`, `M-004`, `M-005c`, `M-006a`, `M-006b`, `M-006c`, and the non-mutating `M-007*` proof lanes where safe.
- [ ] Capture the exact prompt, commands, expected signals, and evidence targets for each scenario before collecting verdict notes.
- [ ] Keep a running list of reusable sandbox inputs so later destructive scenarios can reference the same baseline files where appropriate.

### Phase 3: Destructive Tests
- [ ] Restrict `042`, `043`, `044`, `111`, `119`, `132`, `M-003`, `M-005`, `M-005a`, `M-005b`, `M-006`, `M-007`, `M-007a`, `M-007b`, `M-007c`, `M-007e`, `M-007f`, `M-007g`, `M-007h`, `M-007i`, `M-007j`, and `M-008` to disposable sandboxes, checkpoints, or isolated runtime sessions.
- [ ] For metadata-corruption tests, snapshot `spec.md`, `description.json`, and generated memory files before corruption or regeneration steps, then restore or discard the sandbox afterward.
- [ ] For save/reindex/restart scenarios, separate baseline, failure-path, and recovery-path evidence so no state leak carries into the next test.
- [ ] If a destructive scenario cannot be isolated safely, stop that scenario and mark it blocked rather than mutating shared workspace state.

### Phase 4: Evidence Collection and Verdict
- [ ] For each exact scenario ID, capture prompt, exact command sequence, raw output, expected signals, evidence artifact paths, and reviewer rationale.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt and commands executed as written, expected signals present, evidence readable, and outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per exact scenario ID and summarize phase coverage as 42/42 exact IDs with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| 039 | Confirm retry then reject path | `Verify PI-A5 quality loop behavior.` | MCP |
| 040 | Confirm signal category detection | `Validate signal vocabulary expansion (TM-08).` | manual + MCP |
| 041 | Confirm save-time preflight warn/fail behavior | `Verify pre-flight token budget validation (PI-A3).` | MCP |
| 042 | Confirm per-folder plus aggregated routing | `Validate PI-B3 folder description discovery.` | manual + MCP |
| 043 | Confirm 3-layer gate behavior | `Verify pre-storage quality gate (TM-04).` | MCP |
| 044 | Confirm merge/deprecate thresholds | `Validate reconsolidation-on-save (TM-06).` | MCP |
| 045 | Confirm quality and structure output | `Assess smarter memory content generation (S1).` | manual |
| 046 | Confirm anchor-priority thinning | `Validate anchor-aware chunk thinning (R7).` | manual |
| 047 | Confirm persisted intent labels | `Verify encoding-intent capture (R16).` | manual |
| 048 | Confirm entity pipeline persistence | `Validate auto entity extraction (R10).` | manual |
| 069 | Confirm shared normalization path | `Validate entity normalization consolidation.` | manual |
| 073 | Confirm restart persistence | `Verify quality gate timer persistence.` | manual |
| 092 | Confirm implemented auto entity extraction | `Validate implemented auto entity extraction (R10).` | manual |
| 111 | Confirm embedding-failure fallback and BM25 searchability | `Validate deferred lexical-only indexing fallback.` | manual + MCP |
| 119 | Confirm collision resolution | `Validate memory filename collision prevention.` | manual + MCP |
| 131 | Confirm batch-generated folder descriptions exist and conform to schema | `Validate PI-B3 batch backfill results.` | manual |
| 132 | Confirm per-folder description metadata matches schema contract | `Validate description.json required fields and types.` | manual + MCP |
| 133 | Confirm dry-run preview behavior | `Validate memory_save dryRun preview behavior, including insufficiency detection.` | MCP |
| M-001 | Context Recovery and Continuation | `/memory:continue specs/<target-spec>` | MCP |
| M-002 | Targeted Memory Lookup | `Find rationale for <specific decision>` | MCP |
| M-003 | Context Save + Index Update | `No explicit prompt; command-driven scenario in playbook.` | manual + MCP |
| M-004 | Main-Agent Review and Verdict Handoff | `@review findings-first review with severity + verdict APPROVE/CHANGES_REQUESTED` | manual |
| M-005 | Outsourced Agent Memory Capture Round-Trip | `Dispatch task to external CLI agent and capture memory back to Spec Kit` | manual + MCP |
| M-005a | JSON-mode hard-fail | `Validate JSON-mode hard-fail for outsourced agent handback.` | manual + MCP |
| M-005b | nextSteps persistence | `Validate nextSteps persistence for outsourced agent handback.` | manual + MCP |
| M-005c | Verification freshness | `Validate freshness requirements for outsourced agent handback proof.` | manual |
| M-006 | Stateless Enrichment and Alignment Guardrails | `Run a stateless memory save for a spec that edits generic code paths and verify enrichment/guard behavior` | manual + MCP |
| M-006a | Unborn-HEAD and dirty snapshot fallback | `Validate unborn-HEAD and dirty snapshot fallback.` | manual |
| M-006b | Detached-HEAD snapshot preservation | `Validate detached-HEAD snapshot preservation.` | manual |
| M-006c | Similar-folder boundary protection | `Validate similar-folder boundary protection.` | manual |
| M-007 | Session Capturing Pipeline Quality | `Run full closure verification for spec 010-perfect-session-capturing, including JSON authority, stateless enrichment, the full native fallback chain (OpenCode, Claude, Codex, Copilot, Gemini), numeric quality calibration, and indexing readiness.` | manual + MCP |
| M-007a | JSON authority and successful indexing | `Validate rich JSON authority and successful indexing.` | manual + MCP |
| M-007b | Thin JSON insufficiency rejection | `Validate thin JSON insufficiency rejection and lower-score behavior.` | manual + MCP |
| M-007c | Mis-scoped stateless rejection | `Validate mis-scoped stateless save rejection.` | manual + MCP |
| M-007d | Spec-folder and git-context enrichment presence | `Validate spec-folder and git-context enrichment plus render quality.` | manual + MCP |
| M-007e | OpenCode precedence | `Validate OpenCode precedence without bypassing alignment blocking.` | manual + MCP |
| M-007f | Claude fallback | `Validate Claude fallback under canonical workspace identity.` | manual + MCP |
| M-007g | Codex fallback | `Validate Codex fallback under canonical workspace identity.` | manual + MCP |
| M-007h | Copilot fallback | `Validate Copilot fallback under canonical workspace identity.` | manual + MCP |
| M-007i | Gemini fallback | `Validate Gemini fallback under canonical workspace identity.` | manual + MCP |
| M-007j | Final `NO_DATA_AVAILABLE` hard-fail | `Validate final NO_DATA_AVAILABLE hard-fail behavior.` | manual + MCP |
| M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | `Run direct manual verification for per-memory history log behavior (feature 09 gap closure).` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`](../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md`](../../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/), [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md), and [`../../../../../skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md`](../../../../../skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md) | Internal | Green | Test-to-feature context and cross-category mapping rationale lose their canonical references |
| MCP runtime, CLI scripts, and restart-capable sandbox environment | Internal | Yellow | Save, reindex, restart, and search scenarios cannot be executed safely or reproducibly |
| Disposable sandbox spec folders and checkpoints | Internal | Yellow | Destructive description.json, file-collision, and save-path tests cannot run without risking shared state |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A Phase 013 scenario modifies shared runtime state, corrupts non-sandbox metadata, leaves extra memory files behind, or changes service configuration in a way that could taint later scenarios.
- **Procedure**: Restore the sandbox checkpoint or discard the disposable spec folder, revert edited `spec.md` and `description.json` files, remove generated temporary JSON artifacts, reset environment variables and API keys to baseline values, restart the runtime if required, and rerun only the affected scenario after the environment is clean.
<!-- /ANCHOR:rollback -->

---
