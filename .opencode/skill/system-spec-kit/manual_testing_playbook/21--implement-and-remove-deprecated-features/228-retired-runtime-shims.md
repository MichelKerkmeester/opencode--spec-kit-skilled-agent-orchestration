---
title: "228 -- Retired runtime shims and inert compatibility flags"
description: "This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior."
audited_post_018: true
phase_018_change: "Validated against phase-018 canonical continuity refactor; keeps the compatibility-only checks for lazy warmup, shadow scoring, novelty, and adaptive fusion."
---

# 228 -- Retired runtime shims and inert compatibility flags

## 1. OVERVIEW

This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `228` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior
- Prompt: `As a canonical-continuity validation operator, validate Retired runtime shims and inert compatibility flags against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts. Verify deprecated runtime flags remain visible for compatibility while no longer steering live behavior. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a canonical-continuity validation operator, confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts. Verify targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts`
2. inspect source-backed assertions or snapshots showing eager warmup stays disabled and deprecated warmup flags only surface as compatibility warnings
3. inspect source-backed assertions or snapshots showing shadow scoring runtime helpers return inert values and novelty boost reports as not applied
4. inspect source-backed assertions or snapshots showing hybrid search always follows adaptive fusion as the default live path without consulting the retired flag

### Expected

Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag

### Evidence

Test transcript + key assertion output or source-backed snapshots for warmup, shadow scoring, novelty, and adaptive-fusion behavior

### Pass / Fail

- **Pass**: the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `shared/embeddings.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/eval/shadow-scoring.ts`, `mcp_server/lib/scoring/composite-scoring.ts`, and `mcp_server/lib/search/hybrid-search.ts` if any deprecated flag appears to change live execution

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/01-category-stub.md](../../feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 228
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `21--implement-and-remove-deprecated-features/228-retired-runtime-shims.md`
