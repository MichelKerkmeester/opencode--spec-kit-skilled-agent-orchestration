---
title: "095 -- Strict Zod schema validation (P0-1)"
description: "This scenario validates Strict Zod schema validation (P0-1) for `095`. It focuses on Confirm schema enforcement rejects hallucinated params."
audited_post_018: true
---

# 095 -- Strict Zod schema validation (P0-1)

## 1. OVERVIEW

This scenario validates Strict Zod schema validation (P0-1) for `095`. It focuses on Confirm schema enforcement rejects hallucinated params.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm schema enforcement rejects hallucinated params.
- Real user request: `Please validate Strict Zod schema validation (P0-1) against memory_search({query:"test", bogus:1}) and tell me whether the expected signals are present: Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer.`
- RCAF Prompt: `As a pipeline validation operator, validate Strict Zod schema validation (P0-1) against memory_search({query:"test", bogus:1}). Verify zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if strict mode rejects unknown params and passthrough mode allows them

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, confirm schema enforcement rejects hallucinated params against memory_search({query:"test", bogus:1}). Verify zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. call any MCP tool with an extra unknown parameter (e.g., `memory_search({query:"test", bogus:1})`)
2. verify Zod strict error is returned
3. set `SPECKIT_STRICT_SCHEMAS=false` and confirm `.passthrough()` allows the extra param
4. verify validation runs per-tool in handler, not duplicated at server dispatch

### Expected

Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer

### Evidence

Tool outputs + Zod error messages

### Pass / Fail

- **Pass**: strict mode rejects unknown params and passthrough mode allows them
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `tool-schemas.ts` for `.strict()` vs `.passthrough()` branching

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/13-strict-zod-schema-validation.md](../../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 095
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/095-strict-zod-schema-validation-p0-1.md`
