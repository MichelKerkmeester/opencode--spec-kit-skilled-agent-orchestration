---
title: "270 -- Phase 017 maintainability extracts"
description: "This scenario validates the Phase 017 maintainability extracts for `270`. It focuses on proving the shared helper surfaces replaced the old inline variants without changing the contracts they serve."
---

# 270 -- Phase 017 maintainability extracts

## 1. OVERVIEW

This scenario validates the Phase 017 maintainability extracts for `270`. It focuses on proving the shared helper surfaces replaced the old inline variants without changing the contracts they serve.

---

## 2. CURRENT REALITY

- Objective: Verify the shared `assertNever()` helper, `runEnrichmentStep()`, `executeAtomicReconsolidationTxn()`, and `advisoryPreset` rename are wired as the live pipeline contracts
- Prompt: `As a pipeline validation operator, validate Phase 017 maintainability extracts against the documented helper surfaces. Verify assertNever() handles the documented union exhaustiveness cases, runEnrichmentStep() still preserves lane-specific failure mapping, reconsolidation conflict handling routes through one shared transaction helper, and memory-context now reports advisoryPreset instead of readiness in the structural nudge metadata. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: helper-based code paths are active; tests for the extracted helpers pass; routing metadata uses `advisoryPreset`
- Pass/fail: PASS if the extracted helper surfaces are the live path and no old inline contract is still active

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, validate the Phase 017 helper extracts. Verify assertNever() handles the documented union exhaustiveness cases, runEnrichmentStep() still preserves lane-specific failure mapping, reconsolidation conflict handling routes through one shared transaction helper, and memory-context now reports advisoryPreset instead of readiness in the structural nudge metadata. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run the exhaustiveness suite
2. Run the `runEnrichmentStep()` suite
3. Run the reconsolidation suite that covers shared conflict transactions
4. Inspect `memory_context` structural routing metadata or the nudge tests and confirm the field name is `advisoryPreset`

### Expected

Helper-based code paths are active; tests for the extracted helpers pass; routing metadata uses `advisoryPreset`

### Evidence

Vitest output for the helper suites plus routing metadata evidence showing `advisoryPreset`

### Pass / Fail

- **Pass**: the extracted helper surfaces are the live path and no old inline contract is still active
- **Fail**: the runtime still depends on an old inline branch or the renamed routing field is inconsistent

### Failure Triage

Inspect `mcp_server/lib/utils/exhaustiveness.ts`, `mcp_server/handlers/save/post-insert.ts`, `mcp_server/lib/storage/reconsolidation.ts`, and `mcp_server/handlers/memory-context.ts`

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/24-phase-017-maintainability-extracts.md](../../feature_catalog/14--pipeline-architecture/24-phase-017-maintainability-extracts.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 270
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/270-phase-017-maintainability-extracts.md`
