---
title: "SAD-001 -- Native Recommendation Happy Path"
description: "Canonical manual scenario validating that advisor_recommend returns a prompt-safe Skill Advisor recommendation envelope for a realistic user request."
---

# SAD-001 -- Native Recommendation Happy Path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAD-001`.

---

## 1. OVERVIEW

This scenario validates the native `advisor_recommend` MCP happy path. It confirms that a realistic prompt returns an `ok` envelope with a useful top recommendation, active thresholds, freshness metadata, and no raw prompt leakage.

### Why This Matters

The Skill Advisor's primary user-facing behavior is choosing the right skill before work starts. If this scenario fails, hook integrations and CLI wrappers cannot be trusted because they depend on the same recommendation surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAD-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that `advisor_recommend` returns a prompt-safe recommendation for a memory-oriented request.
- Real user request: `Save this conversation context to memory so the next session can resume from the current packet.`
- RCAF Prompt:
  - Role: Skill Advisor MCP operator validating recommendation quality.
  - Context: The repository is at root, the MCP server build is current, and the user request should route to `system-spec-kit`.
  - Action: Call `advisor_recommend` with attribution enabled, capture the JSON response, and inspect thresholds, freshness, recommendation fields, and prompt-safety boundaries.
  - Format: Return `PASS` or `FAIL` with the top skill ID, confidence, freshness, and one prompt-safety note.
- Expected execution process: Operator calls the native MCP tool, saves the JSON response, checks the top recommendation, and searches metadata fields for raw prompt text.
- Expected signals: Response envelope has `status: "ok"`. `data.effectiveThresholds` is present. First recommendation is `system-spec-kit` or another clearly justified memory/spec-kit skill. Attribution fields contain lane metadata, not raw prompt text.
- Desired user-visible outcome: A short verdict naming the recommended skill and why it is safe to route there.
- Pass/fail: PASS if the response is `ok`, recommendations are non-empty, the top recommendation is appropriate, thresholds are present, and raw prompt text is absent from metadata. FAIL if any critical condition fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language.
2. Confirm the MCP server build is current.
3. Execute the deterministic MCP call.
4. Save the JSON response to `/tmp/skill-advisor-playbook/sad-001.json`.
5. Compare observed output against the expected signals.
6. Return a concise final verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-001 | Native recommendation happy path | Confirm `advisor_recommend` returns a prompt-safe recommendation envelope | `Role: Skill Advisor MCP operator. Context: repo root with a current MCP build and a memory-oriented request. Action: call advisor_recommend with attribution enabled and inspect thresholds, freshness, recommendation fields, and prompt-safety boundaries. Format: return PASS or FAIL with top skill ID, confidence, freshness, and one prompt-safety note.` | 1. `bash: mkdir -p /tmp/skill-advisor-playbook` -> 2. `advisor_recommend({"prompt":"Save this conversation context to memory so the next session can resume from the current packet.","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})` -> 3. Save JSON to `/tmp/skill-advisor-playbook/sad-001.json` -> 4. Search captured JSON for the raw prompt literal | Envelope status is `ok`; `data.effectiveThresholds` is present; recommendations are non-empty; top recommendation is appropriate for memory/spec-kit work; lane attribution has numeric contribution metadata only | `/tmp/skill-advisor-playbook/sad-001.json` plus terminal transcript and final verdict | PASS if response is ok, recommendation is appropriate, thresholds are present, and raw prompt text is absent from metadata; FAIL otherwise | 1. Run `advisor_status`; 2. Rebuild with `advisor_rebuild` if freshness is absent or unavailable; 3. Confirm disable flag is unset; 4. Inspect scorer tests for changed routing expectations |

### Optional Supplemental Checks

Run the same prompt with `topK: 3` to confirm the secondary recommendations are plausible and still prompt-safe.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--mcp-surface/01-advisor-recommend.md` | Feature-catalog source for `advisor_recommend` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../handlers/advisor-recommend.ts` | Native recommendation handler |
| `../../schemas/advisor-tool-schemas.ts` | Tool input/output schema |
| `../../tests/handlers/advisor-recommend.vitest.ts` | Automated handler coverage |
| `../../tests/legacy/advisor-privacy.vitest.ts` | Prompt-safety regression coverage |

---

## 5. SOURCE METADATA

- Group: Recommendation
- Playbook ID: SAD-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--recommendation/001-native-recommendation-happy-path.md`
