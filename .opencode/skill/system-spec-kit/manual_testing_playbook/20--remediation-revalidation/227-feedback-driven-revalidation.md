---
title: "227 -- Feedback-driven revalidation"
description: "This scenario validates Feedback-driven revalidation for `227`. It focuses on Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals."
---

# 227 -- Feedback-driven revalidation

## 1. OVERVIEW

This scenario validates Feedback-driven revalidation for `227`. It focuses on Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `227` and confirm the expected signals without contradicting evidence.

- Objective: Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals
- Prompt: `Validate feedback-driven revalidation for the Spec Kit Memory MCP server. Capture the evidence needed to prove memory_validate updates confidence and validation counters, records best-effort adaptive ranking signals, promotes only through the guarded positive-validation path, persists negative-feedback demotion history, and keeps learned-feedback plus ground-truth capture within their documented bounds. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded
- Pass/fail: PASS if the targeted suites pass and the evidence confirms memory_validate preserves confidence tracking, adaptive feedback, guarded promotion, negative-feedback persistence, and bounded learned-feedback behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 227 | Feedback-driven revalidation | Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals | `Validate feedback-driven revalidation for the Spec Kit Memory MCP server. Capture the evidence needed to prove memory_validate updates confidence and validation counters, records best-effort adaptive ranking signals, promotes only through the guarded positive-validation path, persists negative-feedback demotion history, and keeps learned-feedback plus ground-truth capture within their documented bounds. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts` 2) inspect assertions covering confidence and validation-counter updates for positive and negative `memory_validate` calls 3) inspect assertions covering best-effort adaptive feedback writes plus positive-only promotion thresholds and non-promotable tiers 4) inspect assertions covering persisted negative-feedback events, bounded learned-feedback behavior, and ground-truth capture fields | Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded | Test transcript + key assertion output for confidence tracking, adaptive feedback, promotion semantics, negative-feedback persistence, and learned-feedback safeguards | PASS if the targeted suites pass and the evidence confirms memory_validate preserves confidence tracking, adaptive feedback, guarded promotion, negative-feedback persistence, and bounded learned-feedback behavior | Inspect `mcp_server/handlers/checkpoints.ts`, `mcp_server/lib/scoring/confidence-tracker.ts`, `mcp_server/lib/cognitive/adaptive-ranking.ts`, `mcp_server/lib/search/auto-promotion.ts`, `mcp_server/lib/scoring/negative-feedback.ts`, `mcp_server/lib/search/learned-feedback.ts`, and `mcp_server/lib/eval/ground-truth-feedback.ts` if validation outcomes or bounded learning signals regress |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [20--remediation-revalidation/03-feedback-driven-revalidation.md](../../feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 227
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `20--remediation-revalidation/227-feedback-driven-revalidation.md`
