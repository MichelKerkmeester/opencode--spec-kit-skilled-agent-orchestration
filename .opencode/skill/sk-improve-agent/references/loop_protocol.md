---
title: Loop Protocol
description: End-to-end agent-improver workflow from initialization through guarded promotion or stop decisions.
---

# Loop Protocol

End-to-end operator view of how the agent-improver command, mutator, scorer, benchmark runner, reducer, and approval gates fit together. Use it when you need the full lifecycle, not just a quick command reminder.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Describes the normal agent-improver loop from packet initialization through reduction, stop decisions, and guarded promotion.

### When to Use

Use this reference when:
- Running a new agent-improver packet
- Explaining how candidates move through score, benchmark, and reducer stages
- Checking where promotion and rollback sit in the workflow

### Core Principle

The loop is evaluator-first. Candidate generation, scoring, benchmarking, reduction, and promotion must stay separated so each stage can be trusted.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:init -->
## 2. INIT

- Confirm spec folder and execution mode
- Confirm target path and resolve the target profile (static or dynamic)
- Run `scan-integration.cjs` to map the target's full integration surface
- If using dynamic mode, run `generate-profile.cjs` to derive the scoring profile from the target agent's own rules
- Create `{spec_folder}/improvement/`, `candidates/`, and `benchmark-runs/`
- Copy the config, strategy, charter, and manifest templates into the runtime area
- Record the baseline candidate in `agent-improvement-state.jsonl`

---

<!-- /ANCHOR:init -->
<!-- ANCHOR:propose -->
## 3. PROPOSE

- Read the charter and target manifest first
- Read the target profile and fixture expectations first
- Read the canonical target surface
- Generate one bounded candidate artifact
- Write it under `improvement/candidates/` only

---

<!-- /ANCHOR:propose -->
<!-- ANCHOR:score-and-benchmark -->
## 4. SCORE AND BENCHMARK

- Run `score-candidate.cjs` against the candidate (use `--dynamic` for 5-dimension scoring or `--profile` for legacy keyword checks)
- Run `run-benchmark.cjs` against the packet-local output set for the active profile (use `--integration-report` to include integration consistency scoring)
- Keep scorer execution separate from the mutator step
- Record baseline, candidate, benchmark run, rejected, accepted, or infra-failure events in the ledger
- When using dynamic mode, the scorer produces per-dimension scores (structural, ruleCoherence, integration, outputQuality, systemFitness)

---

<!-- /ANCHOR:score-and-benchmark -->
<!-- ANCHOR:reduce-and-decide -->
## 5. REDUCE AND DECIDE

- Run `reduce-state.cjs`
- Refresh `agent-improvement-dashboard.md`
- Refresh `experiment-registry.json`
- Continue if the score delta is meaningful, the benchmark passes, and the manifest boundary was respected
- Reject if the scorer flags structure, safety, or scope issues
- Keep the simpler candidate when score deltas tie
- Stop when repeatability, weak-benchmark, or infra-failure no-go rules trigger

---

<!-- /ANCHOR:reduce-and-decide -->
<!-- ANCHOR:promote -->
## 6. PROMOTE

Only the canonical handover target can promote. Promotion remains a guarded later-phase workflow requiring:
- explicit operator approval
- evaluator threshold met
- benchmark evidence already present
- rollback plan available
- manifest still respected

---

<!-- /ANCHOR:promote -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- `quick_reference.md`
- `evaluator_contract.md`
- `integration_scanning.md`
- `benchmark_operator_guide.md`
- `rollback_runbook.md`
- `../README.md`

<!-- /ANCHOR:related-resources -->
