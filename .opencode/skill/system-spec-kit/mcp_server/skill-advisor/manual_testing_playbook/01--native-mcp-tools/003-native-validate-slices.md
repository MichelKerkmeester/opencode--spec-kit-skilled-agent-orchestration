---
title: "NC-003 Native advisor_validate Slice Bundle"
description: "Manual validation that advisor_validate returns the full prompt-safe native contract: measured slices, threshold semantics, telemetry diagnostics, and recorded outcome totals."
trigger_phrases:
  - "nc-003"
  - "native advisor_validate slice bundle"
  - "native advisor_validate"
  - "native"
---

# NC-003 Native advisor_validate Slice Bundle

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `advisor_validate` runs the real native validation bundle and surfaces the full 014 public contract rather than returning hard-coded pass values.

---

## 2. SETUP

- Repo root is the working directory.
- Corpus and regression fixture files are present.
- Python 3 is available for parity checks.

---

## 3. STEPS

1. Call:

```text
advisor_validate({"confirmHeavyRun":true,"skillSlug":null})
```

2. Capture the full response.
3. Confirm the response includes `data.thresholdSemantics` and `data.telemetry` before checking the slice details.
4. Run a focused slice with explicit outcome events so `recordedThisRun` and the totals delta can be checked deterministically:

```text
advisor_validate({
  "confirmHeavyRun":true,
  "skillSlug":"system-spec-kit",
  "outcomeEvents":[
    {"runtime":"codex","outcome":"accepted","skillId":"system-spec-kit"},
    {"runtime":"codex","outcome":"corrected","skillId":"system-spec-kit","correctedSkillId":"skill-installer"},
    {"runtime":"codex","outcome":"ignored","skillId":"system-spec-kit"}
  ]
})
```

5. Compare `data.telemetry.outcomes` from step 4 against the baseline snapshot from step 1. In an isolated workspace, `scope.kind` should flip to `skill`, `scope.skillSlug` should be `system-spec-kit`, and `accepted`, `corrected`, and `ignored` totals should each increase by exactly 1.

---

## 4. EXPECTED

- Envelope has `status: "ok"`.
- `data.thresholdSemantics.aggregateValidation` includes `fullCorpusTop1`, `holdoutTop1`, `perSkillTop1`, and `unknownCountTargetMax`.
- `data.thresholdSemantics.runtimeRouting` includes the live `confidenceThreshold`, `uncertaintyThreshold`, and `confidenceOnly` values used by runtime routing.
- `data.slices.corpus.full_corpus_top1` includes `percentage`, `passed`, `threshold`, and `count`.
- `data.slices.corpus.unknown_count.value` is present with `targetMax: 10`.
- `data.slices.holdout.holdout_top1` is present.
- `data.slices.parity.explicit_skill_top1_regression.regressions` is an array.
- `data.slices.safety.adversarial_stuffing_blocked.passed` is present.
- `data.slices.latency.regression_suite_status` includes `p0PassRate`, `failedCount`, `commandBridgeFalsePositiveRate`, `cacheHitP95Ms`, and `uncachedP95Ms`.
- `data.telemetry.diagnostics` includes `recordsPath`, `recordsRetained`, `rollingCacheHitRate`, `rollingP95Ms`, and `rollingFailOpenRate`.
- The focused step-4 response sets `data.telemetry.outcomes.recordedThisRun` to `3`.
- `data.telemetry.outcomes.scope.kind` is `skill` for the focused call, with `scope.skillSlug: "system-spec-kit"`.
- `data.telemetry.outcomes.totals` includes integer totals for `accepted`, `corrected`, and `ignored`; in an isolated workspace those totals increase by exactly `+1` each after the step-4 call.
- Current Phase 027 baseline is 80.5% full corpus, 77.5% holdout, UNKNOWN at or below 10, and zero regressions on Python-correct prompts.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Slice fields missing | JSON path absent | Rebuild and rerun handler tests. |
| Values look fixed across changed fixture input | Repeat after focused `skillSlug` call and compare counts | Treat as hard-coded output defect. |
| Threshold or telemetry sections missing | `data.thresholdSemantics` or `data.telemetry` absent | Treat as public-contract drift and inspect the handler/schema pair before updating docs. |
| Outcome totals do not reflect injected events | `recordedThisRun !== 3` or isolated totals fail to increase by `+1/+1/+1` | Inspect outcome-record persistence and rerun `advisor_validate` handler coverage. |
| Python parity fails | Handler returns regressions for Python-correct prompts | Run the Python regression suite and inspect mismatched IDs. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/`
