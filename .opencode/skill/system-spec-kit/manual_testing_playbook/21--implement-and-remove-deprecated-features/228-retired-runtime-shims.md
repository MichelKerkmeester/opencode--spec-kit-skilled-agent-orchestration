---
title: "228 -- Retired runtime shims and inert compatibility flags"
description: "This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior."
---

# 228 -- Retired runtime shims and inert compatibility flags

## 1. OVERVIEW

This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `228` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior
- Prompt: `Validate retired runtime shims for the Spec Kit Memory MCP server. Capture the evidence needed to prove deprecated compatibility flags such as eager warmup, shadow scoring, novelty boost, and adaptive fusion names may still appear in exports or warnings, but they no longer change the live runtime path. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 228 | Retired runtime shims and inert compatibility flags | Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior | `Validate retired runtime shims for the Spec Kit Memory MCP server. Capture the evidence needed to prove deprecated compatibility flags such as eager warmup, shadow scoring, novelty boost, and adaptive fusion names may still appear in exports or warnings, but they no longer change the live runtime path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts` 2) inspect source-backed assertions or snapshots showing eager warmup stays disabled and deprecated warmup flags only surface as compatibility warnings 3) inspect source-backed assertions or snapshots showing shadow scoring runtime helpers return inert values and novelty boost reports as not applied 4) inspect source-backed assertions or snapshots showing hybrid search always follows adaptive fusion as the default live path without consulting the retired flag | Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag | Test transcript + key assertion output or source-backed snapshots for warmup, shadow scoring, novelty, and adaptive-fusion behavior | PASS if the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior | Inspect `shared/embeddings.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/eval/shadow-scoring.ts`, `mcp_server/lib/scoring/composite-scoring.ts`, and `mcp_server/lib/search/hybrid-search.ts` if any deprecated flag appears to change live execution |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/01-category-stub.md](../../feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 228
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `21--implement-and-remove-deprecated-features/228-retired-runtime-shims.md`
