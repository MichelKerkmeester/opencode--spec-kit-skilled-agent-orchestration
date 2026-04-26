---
title: "DRV-023 -- Review reducer fails closed on corruption and missing anchors"
description: "Verify that malformed JSONL exits 2 unless --lenient is passed, and missing machine-owned anchors block reducer writes unless --create-missing-anchors is used."
---

# DRV-023 -- Review reducer fails closed on corruption and missing anchors

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-023`.

---

## 1. OVERVIEW

This scenario validates fail-closed reducer behavior for `DRV-023`. The objective is to verify that malformed JSONL blocks the reducer unless `--lenient` is passed, that missing machine-owned anchors block strategy rewrites unless `--create-missing-anchors` is passed, and that `corruptionWarnings` remains visible in reducer-owned state even when lenient recovery is used.

### WHY THIS MATTERS

Fail-closed behavior protects review state from quietly drifting into partial writes or ambiguous recovery. Operators need a predictable contract: corruption must stop the reducer by default, missing anchors must block unsafe rewrites by default, and both escape hatches must be explicit so recovery stays intentional.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Review reducer fails closed on corruption and missing anchors.
- Given: A review packet fixture prepared in two variants: one with a deliberately corrupt JSONL line and one with a strategy file missing the `next-focus` machine-owned anchor.
- When: The operator runs the reducer without `--lenient`, then with `--lenient`, and separately retries the missing-anchor packet with and without `--create-missing-anchors`.
- Then: Without `--lenient`, malformed JSONL exits with code `2` and populates `corruptionWarnings`; without `--create-missing-anchors`, the reducer throws `Missing machine-owned anchor ...`; with `--lenient`, the reducer exits `0` while preserving `corruptionWarnings`; with `--create-missing-anchors`, the reducer creates the missing anchor and proceeds.
- Real user request: If the review reducer sees corrupt JSONL or a missing machine-owned anchor, does it fail closed by default, and what explicit flags let me recover without losing the warning state?
- Prompt: `As a manual-testing orchestrator, validate fail-closed reducer behavior for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed JSONL exits with code 2 unless --lenient is passed, that missing machine-owned anchors throw Missing machine-owned anchor ... unless --create-missing-anchors is used, and that corruptionWarnings remains present after lenient recovery. Return a concise operator-facing verdict.`
- Expected execution process: Run the corruption check first, inspect `corruptionWarnings`, then run the missing-anchor check, and finally rerun each guarded case with its explicit escape hatch so the operator can prove both the default fail-closed behavior and the opt-in recovery path.
- Desired user-facing outcome: The user can explain the reducer's default safety posture, the exact escape hatches, and where warning state is preserved for later triage.
- Expected signals: corrupt JSONL exits `2` without `--lenient`; `corruptionWarnings` is populated in the registry; missing anchors throw `Missing machine-owned anchor ...`; `--lenient` exits `0` while preserving `corruptionWarnings`; `--create-missing-anchors` appends the `next-focus` anchor and allows the reducer to proceed.
- Pass/fail posture: PASS if all four exit behaviors match the documented contract and warning state is preserved; FAIL if any default fail-closed or opt-in recovery behavior is missing, inverted, or silent.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Use separate fixture copies for corruption and missing-anchor checks so one guard does not mask the other.
3. Capture exit codes, stderr, registry warnings, and the anchor block so another operator can replay both fail-closed paths and both explicit recovery paths.
4. Return a short user-facing explanation, not just raw implementation notes.

### Prompt
As a manual-testing orchestrator, validate fail-closed reducer behavior for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed JSONL exits with code `2` unless `--lenient` is passed, that missing machine-owned anchors throw `Missing machine-owned anchor ...` unless `--create-missing-anchors` is used, and that `corruptionWarnings` remains present after lenient recovery. Return a concise operator-facing verdict.

### Commands
1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture}; echo "exit: $?"`
2. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'`
3. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture}; echo "exit: $?"`
4. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture} --lenient; echo "exit: $?"`
5. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'`
6. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture} --create-missing-anchors; echo "exit: $?"`
7. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {anchor_fixture}/review/deep-review-strategy.md`

### Expected
Without `--lenient`, corrupt JSONL exits `2` and preserves `corruptionWarnings`; without `--create-missing-anchors`, the reducer throws `Missing machine-owned anchor ...`; with `--lenient`, the reducer exits `0` but preserves `corruptionWarnings`; with `--create-missing-anchors`, the missing anchor is created and the reducer proceeds.

### Evidence
Capture both exit codes, the missing-anchor stderr, the populated `.corruptionWarnings` field before and after `--lenient`, and the strategy `next-focus` anchor after `--create-missing-anchors`.

### Pass/Fail
PASS if all four exit conditions match the documented contract and warning state is still visible after lenient recovery; FAIL if any exit code, error string, warning surface, or anchor bootstrap behavior differs.

### Failure Triage
Privilege `reduce-state.cjs` for exit semantics and `review-reducer-fail-closed.vitest.ts` for concrete expected behavior. If fixture preparation accidentally combines both failures in one directory, split into two fixture copies before judging the reducer.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; emits `corruptionWarnings`, exits non-zero on corruption, and enforces machine-owned anchor presence unless recovery flags are passed |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Review state contract; documents `corruptionWarnings`, fail-closed semantics, dashboard surfaces, and strategy anchor bootstrap behavior |
| `.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts` | Concrete regression coverage for corruption, `--lenient`, missing anchors, and `--create-missing-anchors` behavior |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/023-fail-closed-reducer.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-04-11.
