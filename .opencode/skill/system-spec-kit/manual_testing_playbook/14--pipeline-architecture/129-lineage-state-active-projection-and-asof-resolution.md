---
title: "129 -- Lineage state active projection and asOf resolution"
description: "This scenario validates Lineage state active projection and asOf resolution for `129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution."
audited_post_018: true
---

# 129 -- Lineage state active projection and asOf resolution

## 1. OVERVIEW

This scenario validates Lineage state active projection and asOf resolution for `129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution.

---

## 2. SCENARIO CONTRACT


- Objective: Verify append-first lineage projection, deterministic `asOf` resolution, and timestamp ordering across non-ISO or timezone variants.
- Real user request: `` Please validate Lineage state active projection and asOf resolution against cd .opencode/skill/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants. ``
- RCAF Prompt: `As a pipeline validation operator, validate Lineage state active projection and asOf resolution against cd .opencode/skill/system-spec-kit/mcp_server. Verify append-first lineage projection, deterministic asOf resolution, and timestamp ordering across non-ISO or timezone variants. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, verify append-first lineage projection, deterministic asOf resolution, and timestamp ordering across non-ISO or timezone variants against cd .opencode/skill/system-spec-kit/mcp_server. Verify targeted suite passes; transcript shows active projection selection, deterministic asOf resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server`
2. `npm test -- --run tests/memory-lineage-state.vitest.ts`
3. Inspect the output for active projection, `asOf`, integrity failure coverage, and timestamp-order coverage for variant date formats

### Expected

Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants

### Evidence

Test transcript + suite summary

### Pass / Fail

- **Pass**: `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run `npm test -- --run tests/memory-lineage-state.vitest.ts -t asOf`; inspect `validateTransitionInput()` in `lib/storage/lineage-state.ts` and `lib/search/vector-index-schema.ts` if projection or timestamp assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 129
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/129-lineage-state-active-projection-and-asof-resolution.md`
