---
title: "Implementation Plan: manual-testing-per-playbook maintenance phase [template:level_1/plan.md]"
description: "Phase 004 defines the execution plan for four maintenance-phase manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for the incremental index scan and startup runtime compatibility guard scenarios."
trigger_phrases:
  - "maintenance execution plan"
  - "phase 004 manual tests"
  - "memory index scan verdict plan"
  - "startup guard review plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook maintenance phase

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
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + MCP + Vitest |

### Overview
This plan converts the four maintenance-phase scenarios in the manual testing playbook into an ordered execution workflow for Phase 004. The phase covers two original scenarios — the incremental index scan (MCP-driven) and the startup runtime compatibility guard suite (CLI-driven) — plus two cross-category scenarios assigned to the maintenance phase: async shutdown with deadline (code analysis of server lifecycle) and memory_delete confirm schema tightening (MCP schema validation).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for both maintenance tests were confirmed against the cross-reference index and maintenance feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [ ] Sandbox spec folder for EX-014 incremental scan is identified and contains at least one recently changed file.

### Definition of Done
- [x] All four maintenance-phase scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [x] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [x] Coverage is reported as 4/4 scenarios for Phase 004 with no skipped test IDs.
- [x] Any sandbox mutations or index changes are restored or explicitly documented before closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual maintenance test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, sandbox spec folder with changed files, Node/npm toolchain, and source code access for code-analysis scenarios.
- **Execution layer**: MCP calls for EX-014 (`memory_index_scan` + `memory_stats`) and NEW-101 (`memory_delete` schema validation); CLI `npm test` for EX-035 (`startup-checks.vitest.ts`); code analysis for NEW-100 (`context-server.ts` shutdown logic).
- **Evidence bundle**: Scan summaries, stats snapshots, Vitest output transcript, schema validation outputs, shutdown code analysis, and diagnostic warnings captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked maintenance feature files.
- [ ] Confirm MCP runtime access for `memory_index_scan` and `memory_stats`.
- [ ] Identify or prepare a sandbox spec folder containing at least one recently modified file for EX-014.
- [ ] Confirm Node.js version and `npm install` has been run in `.opencode/skill/system-spec-kit/mcp_server/` for EX-035.
- [ ] Record the current `.node-version-marker` state before execution to enable restoration if needed.

### Phase 2: Non-Destructive Tests
- [ ] Run EX-014 against the prepared sandbox: execute `memory_index_scan(force:false)` then `memory_stats()`, and confirm the scan summary shows changed files reflected in the updated index state.

### Phase 2b: Cross-Category Tests
- [ ] Run NEW-100 against `context-server.ts`: analyze `gracefulShutdown()`/`fatalShutdown()` and `SHUTDOWN_DEADLINE_MS` for file watcher, local reranker, vector index cleanup within 5-second deadline. Capture code-analysis evidence.
- [ ] Run NEW-101 against MCP: execute `memory_delete({id:…, confirm:true})` (accepted), `memory_delete({id:…, confirm:false})` (rejected), `memory_delete({specFolder:…, confirm:true})` (accepted), `memory_delete({specFolder:…})` without confirm (rejected). Capture schema validation outputs.

### Phase 3: Destructive Tests
- No destructive tests are defined for Phase 004. EX-014 modifies index records but is scoped to the sandbox spec folder; this is treated as a controlled, reversible change rather than a destructive mutation requiring a separate phase.

### Phase 4: Evidence Collection and Verdict
- [ ] Run EX-035: change directory to `.opencode/skill/system-spec-kit/mcp_server` and execute `npm test -- --run tests/startup-checks.vitest.ts`; capture the full test transcript and suite summary.
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 4/4 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-014 | Incremental sync run | `Run index scan for changed docs` | MCP |
| EX-035 | Startup diagnostics verification | `Run the dedicated startup guard validation suite` | manual (CLI) |
| NEW-100 | Async shutdown with deadline | `Validate server shutdown deadline behavior` | code analysis |
| NEW-101 | memory_delete confirm schema tightening | `Validate memory_delete confirm:z.literal(true) enforcement` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/04--maintenance/`](../../feature_catalog/04--maintenance/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_index_scan` and `memory_stats` | Internal | Yellow | EX-014 incremental scan scenario cannot be executed or verified |
| Node.js runtime and npm toolchain in `mcp_server/` | Internal | Yellow | EX-035 startup guard validation suite cannot be executed |
| Source code `context-server.ts` for shutdown analysis | Internal | Green | NEW-100 code analysis cannot be performed without access to server source |
| MCP `memory_delete` tool with schema validation | Internal | Green | NEW-101 schema enforcement tests cannot be executed without MCP runtime |
| Sandbox spec folder with known changed files | Internal | Yellow | EX-014 results are non-deterministic without a controlled input set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EX-014 index changes persist beyond the intended sandbox scope, or EX-035 mutates the `.node-version-marker` file in a way that changes subsequent startup behavior.
- **Procedure for EX-014**: Re-run `memory_index_scan(force:true)` against the baseline state, or restore from the nearest checkpoint if scan output corrupted the shared index.
- **Procedure for EX-035**: Restore the original `.node-version-marker` file from version control or a pre-run backup, and rerun the suite to confirm the marker is stable before the next startup.
- **Procedure for NEW-101**: Schema validation tests are read-only probes against the Zod schema; no rollback needed. If a test record is created during probing, delete it via `memory_delete({id:…, confirm:true})`.
<!-- /ANCHOR:rollback -->

---
