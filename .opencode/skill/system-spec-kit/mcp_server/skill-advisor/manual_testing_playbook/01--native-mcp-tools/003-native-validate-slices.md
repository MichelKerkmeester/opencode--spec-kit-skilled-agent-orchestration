---
title: "NC-003 Native advisor_validate Slice Bundle"
description: "Manual validation that advisor_validate returns measured corpus, holdout, parity, safety, and latency slices."
---

# NC-003 Native advisor_validate Slice Bundle

## 1. OVERVIEW

Validate that `advisor_validate` runs the real native validation bundle rather than returning hard-coded pass values.

---

## 2. SETUP

- Repo root is the working directory.
- Corpus and regression fixture files are present.
- Python 3 is available for parity checks.

---

## 3. STEPS

1. Call:

```text
advisor_validate({"skillSlug":null})
```

2. Capture the full response.
3. Optionally call a focused slice:

```text
advisor_validate({"skillSlug":"system-spec-kit"})
```

---

## 4. EXPECTED

- Envelope has `status: "ok"`.
- `data.slices.corpus.full_corpus_top1` includes `percentage`, `passed`, `threshold`, and `count`.
- `data.slices.corpus.unknown_count.value` is present with `targetMax: 10`.
- `data.slices.holdout.holdout_top1` is present.
- `data.slices.parity.explicit_skill_top1_regression.regressions` is an array.
- `data.slices.safety.adversarial_stuffing_blocked.passed` is present.
- `data.slices.latency.regression_suite_status` includes `p0PassRate`, `failedCount`, `commandBridgeFalsePositiveRate`, `cacheHitP95Ms`, and `uncachedP95Ms`.
- Current Phase 027 baseline is 80.5% full corpus, 77.5% holdout, UNKNOWN at or below 10, and zero regressions on Python-correct prompts.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Slice fields missing | JSON path absent | Rebuild and rerun handler tests. |
| Values look fixed across changed fixture input | Repeat after focused `skillSlug` call and compare counts | Treat as hard-coded output defect. |
| Python parity fails | Handler returns regressions for Python-correct prompts | Run the Python regression suite and inspect mismatched IDs. |

---

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/`
