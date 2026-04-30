---
title: "227 -- Feedback-driven revalidation"
description: "This scenario validates Feedback-driven revalidation for `227`. It focuses on Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals."
audited_post_018: true
phase_018_change: "Post-018 audit kept the scenario aligned to the live `memory_validate` feedback loop, guarded promotion path, and bounded learned feedback."
---

# 227 -- Feedback-driven revalidation

## 1. OVERVIEW

This scenario validates Feedback-driven revalidation for `227`. It focuses on Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals.
- Real user request: `Please validate Feedback-driven revalidation against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts and tell me whether the expected signals are present: Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded.`
- RCAF Prompt: `As a remediation validation operator, validate Feedback-driven revalidation against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts. Verify memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms memory_validate preserves confidence tracking, adaptive feedback, guarded promotion, negative-feedback persistence, and bounded learned-feedback behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a remediation validation operator, confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts. Verify validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts`
2. inspect assertions covering confidence and validation-counter updates for positive and negative `memory_validate` calls
3. inspect assertions covering best-effort adaptive feedback writes plus positive-only promotion thresholds and non-promotable tiers
4. inspect assertions covering persisted negative-feedback events, bounded learned-feedback behavior, and ground-truth capture fields

### Expected

Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded

### Evidence

Test transcript + key assertion output for confidence tracking, adaptive feedback, promotion semantics, negative-feedback persistence, and learned-feedback safeguards

### Pass / Fail

- **Pass**: the targeted suites pass and the evidence confirms memory_validate preserves confidence tracking, adaptive feedback, guarded promotion, negative-feedback persistence, and bounded learned-feedback behavior
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `mcp_server/handlers/checkpoints.ts`, `mcp_server/lib/scoring/confidence-tracker.ts`, `mcp_server/lib/cognitive/adaptive-ranking.ts`, `mcp_server/lib/search/auto-promotion.ts`, `mcp_server/lib/scoring/negative-feedback.ts`, `mcp_server/lib/search/learned-feedback.ts`, and `mcp_server/lib/eval/ground-truth-feedback.ts` if validation outcomes or bounded learning signals regress

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [20--remediation-revalidation/03-feedback-driven-revalidation.md](../../feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 227
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `20--remediation-revalidation/227-feedback-driven-revalidation.md`
