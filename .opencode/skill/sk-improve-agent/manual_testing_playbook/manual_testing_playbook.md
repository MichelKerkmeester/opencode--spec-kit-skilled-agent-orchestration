---
title: "sk-improve-agent Manual Testing Playbook"
description: "Operator-facing validation package for the sk-improve-agent skill covering integration scanning, dynamic profiling, 5-dimension scoring, benchmark integration, reducer dimensions, end-to-end loop execution, and runtime-truth validation."
---

# sk-improve-agent Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.


This document provides the root manual-validation contract for `sk-improve-agent`. The root playbook keeps the package-level expectations concise while the linked per-feature files carry the exact prompt, command, verification, and triage details.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--integration-scanner/`
- `02--profile-generator/`
- `03--5d-scorer/`
- `04--benchmark-integration/`
- `05--reducer-dimensions/`
- `06--end-to-end-loop/`
- `07--runtime-truth/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#5--sub-agent-orchestration-and-wave-planning)
- [6. INTEGRATION SCANNER](#6--integration-scanner)
- [7. PROFILE GENERATOR](#7--profile-generator)
- [8. 5-DIMENSION SCORER](#8-5-dimension-scorer)
- [9. BENCHMARK INTEGRATION](#9--benchmark-integration)
- [10. REDUCER DIMENSIONS](#10--reducer-dimensions)
- [11. END-TO-END LOOP](#11--end-to-end-loop)
- [12. RUNTIME TRUTH](#12--runtime-truth)
- [13. REVIEW PROTOCOL](#13--review-protocol)
- [14. RELATED RESOURCES](#14--related-resources)

---

## 1. OVERVIEW

This playbook provides 31 deterministic scenarios across 7 categories validating the current `sk-improve-agent` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and command-specific evidence requirements.

### REALISTIC TEST MODEL

1. Start from the operator-visible improvement workflow rather than only the raw script call.
2. Treat the feature files as the source of exact command and verification truth.
3. Capture enough evidence that another operator can replay the verdict without guessing.
4. Report a concise PASS/FAIL outcome with the decisive evidence.

---

## 2. GLOBAL PRECONDITIONS

- Node.js is available and can run the `sk-improve-agent` scripts.
- The working directory is the repository root.
- The referenced agent, command, and script files exist in the current checkout.
- Any scenario that writes to `/tmp` or a spec folder uses disposable artifacts.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact command or workflow path that ran.
- The exact prompt used when orchestration behavior is part of the scenario.
- Output excerpts that prove or disprove the expected signals.
- A PASS/FAIL verdict with one decisive reason.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Scenario-specific commands live in the linked feature files.
- Resolve placeholders such as `{spec}` before execution and capture the actual value used.
- Keep verification evidence tied to the same run that produced the verdict.

---

## 5. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Run scanner, profile, scorer, and benchmark scenarios before end-to-end loop scenarios.
- Treat runtime-truth scenarios as a closure wave after the loop and reducer behaviors are already validated.
- Keep one coordinator slot free when parallelizing script-level checks so evidence collation stays consistent.

---

## 6. INTEGRATION SCANNER

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### IS-001 | Scan Known Agent (Debug)

#### Description
scanning a known agent discovers all integration surfaces and confirms mirror alignment.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that scanning a known agent discovers all integration surfaces and confirms mirror alignment against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` at root level. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `status: "complete"` at root level; `surfaces.canonical.exists: true`; `surfaces.mirrors` array with 3 entries, each with `syncStatus: "aligned"`; `summary.totalSurfaces >= 20`; `summary.mirrorSyncStatus: "all-aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 1`; Exit code is 0

#### Test Execution
> **Feature File:** [IS-001](01--integration-scanner/001-scan-known-agent.md)

### IS-002 | Scan Missing Agent (Nonexistent)

#### Description
scanning a nonexistent agent produces graceful error handling instead of a crash.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that scanning a nonexistent agent produces graceful error handling instead of a crash against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash); `surfaces.canonical.exists: false`; All entries in `surfaces.mirrors` have `syncStatus: "missing"`; `summary.missingCount > 0`; No unhandled exception or stack trace

#### Test Execution
> **Feature File:** [IS-002](01--integration-scanner/002-scan-missing-agent.md)

### IS-003 | Scan Diverse Agent (Debug)

#### Description
scanning the debug agent discovers a broad set of integration surfaces (20+ expected).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that scanning the debug agent discovers a broad set of integration surfaces (20+ expected) against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `status: "complete"`; `summary.totalSurfaces >= 20`; `surfaces.mirrors` entries with `syncStatus: "aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 5`; Surfaces span commands, skills, and global docs (CLAUDE.md, agent definitions, skill routing entries); Exit code is 0

#### Test Execution
> **Feature File:** [IS-003](01--integration-scanner/003-scan-diverse-agent.md)

### IS-004 | JSON Output File via --output Flag

#### Description
the --output flag writes scan results to a valid JSON file at the specified path.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the --output flag writes scan results to a valid JSON file at the specified path against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify File `/tmp/test-scan-output.json` is created after the command completes. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: File `/tmp/test-scan-output.json` is created after the command completes; The file contains valid JSON (parseable without errors); JSON structure matches stdout output: `status`, `surfaces`, `summary` top-level fields; `surfaces.canonical.exists: true`, `surfaces.mirrors` array present; `summary.totalSurfaces`, `summary.mirrorSyncStatus` fields present

#### Test Execution
> **Feature File:** [IS-004](01--integration-scanner/004-json-output-file.md)


---

## 7. PROFILE GENERATOR

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### PG-005 | ALWAYS/NEVER Rules Extraction

#### Description
the profile generator correctly extracts ALWAYS and NEVER behavioral rules from a target agent definition.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the profile generator correctly extracts ALWAYS and NEVER behavioral rules from a target agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.ruleCoherence` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: JSON output with `derivedChecks.ruleCoherence` array; Each entry has `type` field set to `"always"` or `"never"` and a `rule` or `text` field with verbatim text from the agent file; At least 3 entries with `type: "always"`; At least 2 entries with `type: "never"`; Exit code is 0

#### Test Execution
> **Feature File:** [PG-005](02--profile-generator/005-rules-extraction.md)

### PG-006 | OUTPUT VERIFICATION Checklist Extraction (Debug)

#### Description
the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the profile generator extracts OUTPUT VERIFICATION checklist items from the debug agent definition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.outputChecks` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: JSON output with `derivedChecks.outputChecks` array; Each entry has `id`, `check`, and `weight` fields; Items correspond to checklist entries from the debug agent's OUTPUT VERIFICATION section; At least 5 items extracted; Exit code is 0

#### Test Execution
> **Feature File:** [PG-006](02--profile-generator/006-output-checks.md)

### PG-007 | Inline NEVER Rules Fallback (No Dedicated Section)

#### Description
NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that NEVER rules embedded inline (outside a dedicated RULES section) are still extracted as a fallback against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify JSON output with `derivedChecks.ruleCoherence` array. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: JSON output with `derivedChecks.ruleCoherence` array; At least 1 entry with `type: "never"` extracted from inline "NEVER" patterns in the debug agent body text; The debug agent has no dedicated `## Rules` or `## Behavioral Rules` section, so these rules come from the body scan fallback; No false positives from code examples or quoted text

#### Test Execution
> **Feature File:** [PG-007](02--profile-generator/007-inline-rules-fallback.md)

### PG-008 | Profile JSON File Output via --output Flag

#### Description
the --output flag writes a valid profile JSON file for the review agent.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the --output flag writes a valid profile JSON file for the review agent against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify File `/tmp/test-profile.json` is created after the command completes. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: File `/tmp/test-profile.json` is created after the command completes; The file contains valid JSON (parseable without errors); JSON structure includes top-level fields: `id`, `derivedChecks`, `agentMeta`; `derivedChecks` contains `ruleCoherence` and `outputChecks` sub-fields; Exit code is 0

#### Test Execution
> **Feature File:** [PG-008](02--profile-generator/008-file-output.md)


---

## 8. 5-DIMENSION SCORER

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### 5D-010 | Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)

#### Description
dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `evaluationMode` field equals `"dynamic-5d"`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `evaluationMode` field equals `"dynamic-5d"`; `profileId` is derived from the agent name (e.g., `"orchestrate"`); `dimensions` array contains exactly 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Each dimension has `score` (0-100), `weight`, and `details` array; NO `legacyScore` field (orchestrate has no static profile); No error about missing or unknown profile

#### Test Execution
> **Feature File:** [5D-010](03--5d-scorer/010-dynamic-arbitrary.md)

### 5D-012 | Dimension Details Array with Individual Check Results

#### Description
each dimension in the 5D scorer output includes a details array showing individual check results.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that each dimension in the 5D scorer output includes a details array showing individual check results against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Each dimension object has a `details` array of individual check objects; Each check object in `details` has at minimum:

#### Test Execution
> **Feature File:** [5D-012](03--5d-scorer/012-dimension-details.md)

### 5D-013 | Missing Candidate File Returns infra_failure

#### Description
providing a nonexistent candidate file results in an infra_failure status and exit code 1.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that providing a nonexistent candidate file results in an infra_failure status and exit code 1 against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Exit code is 1 (not 0). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Exit code is 1 (not 0); Output is valid JSON (no stack trace); `status` field equals `"infra_failure"`; `failureModes` array contains `"profile-generation-failure"`; No unhandled exception or stack trace is printed

#### Test Execution
> **Feature File:** [5D-013](03--5d-scorer/013-missing-candidate.md)


---

## 9. BENCHMARK INTEGRATION

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### BI-014 | Benchmark Without Integration Report

#### Description
running a benchmark without the --integration-report flag produces output with no integration-specific fields.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that running a benchmark without the --integration-report flag produces output with no integration-specific fields against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark completes successfully with exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Benchmark completes successfully with exit code 0; Output JSON at `/tmp/bench-no-integration.json` is valid and contains:

#### Test Execution
> **Feature File:** [BI-014](04--benchmark-integration/014-without-integration.md)

### BI-015 | Benchmark With Integration Report

#### Description
running a benchmark with --integration-report adds integrationScore and related fields to the output.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that running a benchmark with --integration-report adds integrationScore and related fields to the output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:

#### Test Execution
> **Feature File:** [BI-015](04--benchmark-integration/015-with-integration.md)


---

## 10. REDUCER DIMENSIONS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### RD-017 | JSONL Without Dimensions Produces Normal Dashboard

#### Description
JSONL Without Dimensions Produces Normal Dashboard.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate backward compatibility: JSONL records that lack dimension fields still produce a normal reducer dashboard against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-nodim/agent-improvement-dashboard.md`; Registry generated at `/tmp/reducer-test-nodim/experiment-registry.json`; Dashboard does NOT contain a "Dimensional Progress" table (no dimension data in records); Standard composite score and verdict sections are present

#### Test Execution
> **Feature File:** [RD-017](05--reducer-dimensions/017-no-dimensions.md)

### RD-018 | JSONL With Dimensions Produces Dimensional Progress Table

#### Description
JSONL records containing dimension data produce a Dimensional Progress table in the reducer output.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-dim/agent-improvement-dashboard.md`; Dashboard includes a "Dimensional Progress" section with a table showing columns: Dimension, Latest, Best, Trend; All 5 dimensions appear in the table: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Standard composite score and verdict sections are also present alongside the dimensional table

#### Test Execution
> **Feature File:** [RD-018](05--reducer-dimensions/018-with-dimensions.md)

### RD-019 | Plateau Detection on Identical Dimension Scores

#### Description
three or more consecutive identical dimension scores trigger the plateau stop condition.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that three or more consecutive identical dimension scores trigger the plateau stop condition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-plateau/agent-improvement-dashboard.md`; Registry generated at `/tmp/reducer-test-plateau/experiment-registry.json`; Registry shows `stopStatus.shouldStop: true` with reason mentioning "dimensions plateaued" or similar; Dimensional Progress table shows the flat score trend across all 3 records

#### Test Execution
> **Feature File:** [RD-019](05--reducer-dimensions/019-plateau-detection.md)


---

## 11. END-TO-END LOOP

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract.

### E2E-020 | Full Pipeline Loop with Debug Target

#### Description
Full Pipeline Loop with Debug Target.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the complete /improve:improve-agent loop end-to-end using the debug agent as the target against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Init phase creates `improvement/` directory with config, charter, strategy, and manifest. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Init phase creates `improvement/` directory with config, charter, strategy, and manifest; Integration scan runs and produces `integration-report.json`; Candidate generated under `improvement/candidates/`; Score output produced via dynamic-mode 5-dimension scoring; Dashboard generated at `improvement/agent-improvement-dashboard.md`; Loop completes 1 iteration without errors

#### Test Execution
> **Feature File:** [E2E-020](06--end-to-end-loop/020-full-pipeline.md)

### E2E-021 | Full Pipeline Loop with Non-Standard Agent (Debug)

#### Description
Full Pipeline Loop with Non-Standard Agent (Debug).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the complete /improve:improve-agent loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dynamic profile generated on-the-fly (debug.md has no static profile). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Dynamic profile generated on-the-fly (debug.md has no static profile); Integration scan discovers debug agent surfaces; 5-dimension scoring produces scores for all dimensions: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; No errors about missing profile or unsupported target; Dashboard reflects debug-specific scoring, not recycled data from a different agent

#### Test Execution
> **Feature File:** [E2E-021](06--end-to-end-loop/021-any-agent.md)

### E2E-022 | Mutation Coverage Graph Tracking

#### Description
the improvement loop maintains a mutation coverage graph with `loop_type: "improvement"` namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the improvement loop maintains a mutation coverage graph with loop_type: "improvement" namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs); Graph nodes include dimension nodes (structural, ruleCoherence, integration, outputQuality, systemFitness); Graph edges track which mutations target which dimensions (COVERS, DERIVED_FROM); Exhausted mutation types are recorded and not re-attempted; Journal events reference graph node/edge IDs for traceability; Dashboard reflects mutation coverage state per dimension

#### Test Execution
> **Feature File:** [E2E-022](06--end-to-end-loop/022-mutation-coverage-graph-tracking.md)

### E2E-023 | Trade-Off Detection Across Dimensions

#### Description
the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dimension trajectory tracked per iteration (at least 3 data points before convergence claim). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Dimension trajectory tracked per iteration (at least 3 data points before convergence claim); Trade-off detected when one dimension delta is positive and another is negative beyond threshold; Trade-off report includes: affected dimensions, magnitude of change, Pareto assessment; Journal emits `trade-off-detected` event with structured data; Candidate with unresolved trade-off is flagged for human review, not auto-promoted; Dashboard shows dimension trajectories with trade-off annotations

#### Test Execution
> **Feature File:** [E2E-023](06--end-to-end-loop/023-trade-off-detection.md)

### E2E-024 | Candidate Lineage Graph Tracking

#### Description
the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Candidate lineage graph created with per-session node entries. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Candidate lineage graph created with per-session node entries; Each candidate node stores: session-id, wave-index (default 0 for single-wave), spawning mutation type, parent node reference; Root candidates have null parent; subsequent candidates reference their predecessor; Lineage is traversable from root to leaf (full candidate history); Session-id isolation: lineage from different sessions does not cross-contaminate; When parallel waves are enabled: multiple candidates per iteration with distinct wave indices

#### Test Execution
> **Feature File:** [E2E-024](06--end-to-end-loop/024-candidate-lineage.md)


---

## 12. RUNTIME TRUTH

This category covers 10 scenario summaries while the linked feature files remain the canonical execution contract.

### RT-025 | Stop-Reason Taxonomy Validation

#### Description
every completed improvement session emits a `session_ended` event with a valid `stopReason` and `sessionOutcome` drawn from the frozen taxonomies defined in `improvement-journal.cjs`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that every completed improvement session emits a session_ended event with a valid stopReason and sessionOutcome drawn from the frozen taxonomies defined in improvement-journal.cjs against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Journal contains at least one `session_ended` or `session_end` event. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: Journal contains at least one `session_ended` or `session_end` event; `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`; Both fields are present (validation rejects events missing either); `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome

#### Test Execution
> **Feature File:** [RT-025](07--runtime-truth/025-stop-reason-taxonomy.md)

### RT-026 | Audit Journal Lifecycle Event Emission

#### Description
the improvement journal captures events for each lifecycle boundary: `session_start`, `candidate_generated`, `candidate_scored`, `gate_evaluation`, and `session_end`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the improvement journal captures events for each lifecycle boundary: session_start, candidate_generated, candidate_scored, gate_evaluation, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement-journal.jsonl` file created at the configured journal path. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `improvement-journal.jsonl` file created at the configured journal path; Events appear in chronological order (each has a `timestamp` field); At minimum, the following event types are present after a 1-iteration run:

#### Test Execution
> **Feature File:** [RT-026](07--runtime-truth/026-audit-journal-emission.md)

### RT-027 | Fresh-Session Continuation After Archive

#### Description
the current release uses standalone `new`-mode sessions, so continuation happens by archiving the previous run and starting a fresh `/improve:improve-agent` session.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate current-release continuation guidance against the sk-improve-agent session model and journal behavior. Verify archived evidence stays intact, each new invocation starts in `new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`improvement/` directory is preserved under `improvement_archive/` before the next run begins. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: The archived `improvement/` directory is preserved under `improvement_archive/` before the next run begins; The fresh run creates a new `improvement/` directory instead of reusing the archived one; The fresh session starts in `new` mode with a new session id and generation `1`; Iteration numbering restarts from `1` in the fresh session journal; No unsupported lineage flags or multi-generation session behaviors are required or documented as shipped

#### Test Execution
> **Feature File:** [RT-027](07--runtime-truth/027-resume-continuation.md)

### RT-028 | Legal-Stop Gate Blocking

#### Description
when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a `blockedStop` rather than `converged`, and the blocked-stop event includes the failing gate details.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a blockedStop rather than converged, and the blocked-stop event includes the failing gate details against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `legal_stop_evaluated` event emitted with `gateResults` containing all 5 gate bundles:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `legal_stop_evaluated` event emitted with `gateResults` containing all 5 gate bundles:

#### Test Execution
> **Feature File:** [RT-028](07--runtime-truth/028-legal-stop-gates.md)

### RT-029 | Benchmark Stability Measurement

#### Description
`benchmark-stability.cjs` correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that `isStable()` returns true only when variance is below threshold.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that benchmark-stability.cjs correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that isStable() returns true only when variance is below threshold against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats; Each dimension entry contains: `coefficient` (0.0-1.0), `mean`, `stddev`, `samples`; Stability coefficient formula: `1 - (stddev / mean)`; perfect stability = 1.0; `stable: true` when all dimensions have coefficient >= `warningThreshold` (default 0.95); `stable: false` when any dimension has coefficient < threshold; `warnings` array contains a `stabilityWarning` entry for each unstable dimension; `isStable()` returns `true` only when variance (1 - coefficient) is below `maxVariance` (default 0.05)

#### Test Execution
> **Feature File:** [RT-029](07--runtime-truth/029-benchmark-stability.md)

### RT-030 | Dimension Trajectory and Convergence Eligibility

#### Description
`mutation-coverage.cjs` tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that mutation-coverage.cjs tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `recordTrajectory()` appends per-dimension scores with iteration number and timestamp. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `recordTrajectory()` appends per-dimension scores with iteration number and timestamp; `getTrajectory()` returns the full score history as an array of data points; `checkConvergenceEligibility()` returns `{ canConverge, reason, dataPoints }`; With fewer than `MIN_TRAJECTORY_POINTS` (3) data points: `canConverge: false`, reason mentions "Insufficient"; With 3+ stable data points (all deltas within `DEFAULT_STABILITY_DELTA` of 2): `canConverge: true`; With 3+ data points but unstable dimension(s): `canConverge: false`, reason names the unstable dimensions; Trajectory data is persisted to the coverage graph JSON file (survives process restart)

#### Test Execution
> **Feature File:** [RT-030](07--runtime-truth/030-dimension-trajectory.md)

### RT-031 | Parallel Candidates Opt-In Default

#### Description
the default configuration has `parallelWaves.enabled: false` and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the default configuration has parallelWaves.enabled: false and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning) against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement_config.json` has `parallelWaves.enabled: false` by default. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `improvement_config.json` has `parallelWaves.enabled: false` by default; `parallelWaves.maxCandidates: 3` (configured but not active); During an improvement session with defaults: only one candidate is generated per iteration; Candidate lineage (if tracked) shows all nodes with `waveIndex: 0` (single-wave); No parallel mutation spawning occurs regardless of exploration-breadth score; The activation conditions (exploration-breadth threshold, 3+ unresolved mutation families, 2 consecutive ties) are never evaluated when `enabled: false`

#### Test Execution
> **Feature File:** [RT-031](07--runtime-truth/031-parallel-candidates-opt-in.md)

### RT-032 | Journal Wiring Boundary Coverage

#### Description
the `/improve:improve-agent` autonomous workflow wires `improvement-journal.cjs` at every required boundary: `session_start`, per-iteration lifecycle checkpoints, and `session_end`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that the /improve:improve-agent autonomous workflow wires improvement-journal.cjs at every required boundary: session_start, per-iteration lifecycle checkpoints, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` contains `improvement-journal.cjs` emission steps for:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` contains `improvement-journal.cjs` emission steps for:

#### Test Execution
> **Feature File:** [RT-032](07--runtime-truth/032-journal-wiring.md)

### RT-033 | Insufficient Sample Propagation

#### Description
low-sample guards propagate `insufficientData` and `insufficientSample` states from the helpers into the reducer registry and the dashboard's Sample Quality reporting.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that low-sample guards propagate insufficientData and insufficientSample states from the helpers into the reducer registry and the dashboard's Sample Quality reporting against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory; `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays; `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome; `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`; `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed; No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path

#### Test Execution
> **Feature File:** [RT-033](07--runtime-truth/033-insufficient-sample.md)

### RT-034 | Replay Consumer Artifact Verification

#### Description
Replay Consumer Artifact Verification.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate ADR-002 Option A replay-consumer behavior: reduce-state.cjs reads improvement-journal.jsonl, candidate-lineage.json, and mutation-coverage.json, writes their summaries into the registry, and degrades gracefully when any one artifact is missing against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify \`experiment-registry.json\` contains the replay-consumer summaries. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: `experiment-registry.json` contains:

#### Test Execution
> **Feature File:** [RT-034](07--runtime-truth/034-replay-consumer.md)

---

## 13. REVIEW PROTOCOL

- For each scenario, run the linked commands or workflow, capture the output, and record the verdict with supporting evidence.
- If an output shape or score is wrong, compare the live result against the linked feature file rather than the old root matrix.
- Treat drift between the root summary and the feature file as a documentation bug; the feature file wins until both are resynchronized.

---

## 14. RELATED RESOURCES

- `SKILL.md`: `.opencode/skill/sk-improve-agent/SKILL.md`
- `references/evaluator_contract.md`: scoring rubric and evaluator rules.
- `references/integration_scanning.md`: scanner behavior and surface expectations.
- `references/quick_reference.md`: command examples and operator shortcuts.
