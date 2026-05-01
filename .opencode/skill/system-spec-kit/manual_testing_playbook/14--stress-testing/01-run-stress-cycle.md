---
title: "01 -- Run stress cycle"
description: "This scenario guides an operator through a full stress test cycle: freeze corpus, score packet x dimension cells, author findings, emit a rubric sidecar, compare deltas, capture telemetry, validate, and update the parent phase map."
audited_post_018: true
---

# 01 -- Run stress cycle

## 1. OVERVIEW

This scenario validates a target release, remediation set, or subsystem change with a structured stress test cycle. The operator freezes a representative corpus, scores each packet x dimension cell on a 0-2 rubric, writes narrative findings, emits a machine-readable sidecar, compares against the prior version, and records any telemetry samples needed to reproduce the verdict.

Preconditions:

- Target system has a stable baseline or explicitly declared first-run baseline.
- Prior cycle's `findings-rubric.json` is accessible when the run claims a comparison.
- Scope, target packets, corpus, dimensions, and scoring owner are declared before scoring starts.
- Runtime and measurement paths are stable enough that another operator can rerun or inspect the evidence.

## 2. SCENARIO CONTRACT


- Objective: Produce reproducible release-readiness or regression evidence for a packet set.
- Real user request: `Please validate Run stress cycle against the target packets, score every packet x dimension cell on the 0-2 rubric, write findings.md with evidence and verdicts, emit findings-rubric.json, compare against the prior cycle if present, capture measurements for wired runtime paths, and return a concise pass/fail verdict with cited evidence. and tell me whether the expected signals are present: fixed corpus, completed score cells, narrative findings, parseable sidecar, aggregate percent, comparison deltas, REGRESSION self-checks, optional telemetry samples, strict validator output.`
- RCAF Prompt: `As a stress-cycle validation operator, run the frozen corpus against the target packets, score every packet x dimension cell on the 0-2 rubric, write findings.md with evidence and verdicts, emit findings-rubric.json, compare against the prior cycle if present, capture measurements for wired runtime paths, and return a concise pass/fail verdict with cited evidence.. Verify fixed corpus, completed score cells, narrative findings, parseable sidecar, aggregate percent, comparison deltas, REGRESSION self-checks, optional telemetry samples, strict validator output. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against the target packets, score every packet x dimension cell on the 0-2 rubric, write findings.md with evidence and verdicts, emit findings-rubric.json, compare against the prior cycle if present, capture measurements for wired runtime paths, and return a concise pass/fail verdict with cited evidence., capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: fixed corpus, completed score cells, narrative findings, parseable sidecar, aggregate percent, comparison deltas, REGRESSION self-checks, optional telemetry samples, strict validator output
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the artifacts let a future investigator reproduce the verdict reasoning without the original operator; FAIL if evidence, scoring, comparison, or validation is missing.

---

## 3. TEST EXECUTION

### Step 1: Freeze Baseline Corpus

Use a fixed corpus before dispatch. For search/RAG domains, `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/corpus.ts` is the canonical example: each fixture has an ID, query, expected relevant IDs, expected channels, citation expectations, refusal expectations, and notes.

For non-search domains, freeze representative scenarios as JSON or markdown fixtures. Each scenario should include a stable ID, the user prompt or stimulus, expected outcome, evidence path, and any domain-specific constraints.

### Step 2: Score Each Packet x Dimension

Score every packet x dimension cell on the 0-2 scale.

| Score | Anchor |
|-------|--------|
| 0 | Absent, broken, contradicted by evidence, or regressed. |
| 1 | Partial, degraded, inconsistent, or not fully reproducible. |
| 2 | Present, working, improved, and supported by evidence. |

Canonical v1 dimensions are `correctness`, `robustness`, `telemetry`, and `regression-safety`. If a packet freezes a domain-specific rubric, state the dimensions and explain why they differ.

### Step 3: Author `findings.md`

Write one section per packet under review. Each section must include:

- Verdict: `PROVEN`, `NEUTRAL`, `REGRESSION`, or `NOT-PROVEN`.
- Evidence at file:line where the claim depends on source or artifact content.
- Score line per dimension.
- Rationale explaining why the score follows from the evidence.
- Limitation or caveat when the packet was only partially exercised.

The narrative should also include header status, stop reason, methodology, headline numbers, aggregate summary, comparison block, recommendations, limitations, and artifact list.

### Step 4: Run Hunter -> Skeptic -> Referee For Every REGRESSION

Every REGRESSION candidate gets an inline adversarial block in `findings.md`.

```text
Hunter: strongest case that this is a real regression.
Skeptic: alternate explanations, missing evidence, environment differences, or scorer uncertainty.
Referee: final disposition, severity, owner, and whether the verdict remains REGRESSION.
```

Do not publish a REGRESSION verdict from score delta alone. A dropped score is a candidate until this review is documented.

### Step 5: Emit `findings-rubric.json`

Fill `.opencode/skill/system-spec-kit/templates/stress_test/findings-rubric.template.json` and save the completed sidecar next to `findings.md`.

The sidecar must include cycle metadata, corpus metadata, rubric dimensions, scale, weights, one scored cell per packet x dimension, aggregate math, verdict counts, and prior-version comparison fields.

### Step 6: Compute Aggregate

Compute:

```text
score_sum / max_possible * 100
```

`max_possible` equals the number of cells times the max-per-cell score after weights. Record both exact percent and rounded percent. v1.0.2 is the worked example: 30 cells, score sum 201, max 240, percent rounded 83.8.

### Step 7: Compare To Prior Version

When a prior sidecar exists:

1. Load the prior `findings-rubric.json`.
2. Match current cells by stable ID.
3. Build a per-cell delta table.
4. Flag any cell that dropped as a candidate REGRESSION.
5. Run the REGRESSION adversarial block before final disposition.
6. Record aggregate `deltaPercent`.

If the comparison is not like-for-like, state that in both `findings.md` and the sidecar. v1.0.3 did this because its harness telemetry rubric was directional rather than directly comparable to the v1.0.2 30-cell CLI model rubric.

### Step 8: Capture Telemetry Samples

If the cycle exercises a wired runtime, capture telemetry under `measurements/`. Typical samples:

- `*-envelopes.jsonl`
- `*-audit-log-sample.jsonl`
- `*-shadow-sink-sample.jsonl`
- `*-summary.json`

The v1.0.3 wiring run is the worked example: its findings file lists 12 envelope samples, 12 decision-audit rows, 12 shadow sink rows, summary metrics, and a rubric sidecar.

### Step 9: Run Strict Validator

Run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <path> --strict
```

Use the packet that owns the cycle artifacts as `<path>`. If the validator reports warnings, document whether they are pre-existing or caused by the cycle docs and fix in scope before claiming completion.

### Step 10: Update Parent Packet's PHASE MAP

Add the new cycle to the parent packet's PHASE MAP. Keep the update minimal: folder name, focus, and status. Do not narrate migration history in phase-parent specs.

## 4. VERIFICATION

- Strict validator exits 0 for the cycle packet.
- `findings.md` exists and contains per-packet verdicts plus evidence.
- `findings-rubric.json` parses as JSON and includes all scored cells.
- Aggregate percent and rounded percent are calculated from the sidecar values.
- Prior-cycle delta table exists when a prior sidecar exists.
- Every REGRESSION candidate has Hunter -> Skeptic -> Referee inline.
- Telemetry samples exist under `measurements/` when the cycle exercised a wired runtime.

Success criteria: a future investigator can read `findings.md`, `findings-rubric.json`, and `measurements/*summary.json` and reproduce the verdict reasoning without the original operator present.

## 5. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--stress-testing/01-stress-test-cycle.md](../../feature_catalog/14--stress-testing/01-stress-test-cycle.md)
- Rubric template: [findings-rubric.template.json](../../templates/stress_test/findings-rubric.template.json)
- Rubric schema: [findings-rubric.schema.md](../../templates/stress_test/findings-rubric.schema.md)
- Findings template: [findings.template.md](../../templates/stress_test/findings.template.md)
- v1.0.1 baseline: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/`
- v1.0.2 rerun: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/`
- v1.0.3 wiring run: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/`

## 6. SOURCE METADATA

- Group: Stress testing
- Playbook ID: 01
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--stress-testing/01-run-stress-cycle.md`
