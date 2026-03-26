---
title: "095 -- Strict Zod schema validation (P0-1)"
description: "This scenario validates Strict Zod schema validation (P0-1) for `095`. It focuses on Confirm schema enforcement rejects hallucinated params."
---

# 095 -- Strict Zod schema validation (P0-1)

## 1. OVERVIEW

This scenario validates Strict Zod schema validation (P0-1) for `095`. It focuses on Confirm schema enforcement rejects hallucinated params.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `095` and confirm the expected signals without contradicting evidence.

- Objective: Confirm schema enforcement rejects hallucinated params
- Prompt: `Validate SPECKIT_STRICT_SCHEMAS enforcement. Capture the evidence needed to prove Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer
- Pass/fail: PASS if strict mode rejects unknown params and passthrough mode allows them

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 095 | Strict Zod schema validation (P0-1) | Confirm schema enforcement rejects hallucinated params | `Validate SPECKIT_STRICT_SCHEMAS enforcement. Capture the evidence needed to prove Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise user-facing pass/fail verdict with the main reason.` | 1) call any MCP tool with an extra unknown parameter (e.g., `memory_search({query:"test", bogus:1})`) 2) verify Zod strict error is returned 3) set `SPECKIT_STRICT_SCHEMAS=false` and confirm `.passthrough()` allows the extra param 4) verify validation runs per-tool in handler, not duplicated at server dispatch | Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer | Tool outputs + Zod error messages | PASS if strict mode rejects unknown params and passthrough mode allows them | Inspect `tool-schemas.ts` for `.strict()` vs `.passthrough()` branching |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/13-strict-zod-schema-validation.md](../../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 095
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/095-strict-zod-schema-validation-p0-1.md`
