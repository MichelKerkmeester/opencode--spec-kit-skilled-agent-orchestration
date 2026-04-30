---
title: "SAD-002 -- Ambiguous Recommendation Rendering"
description: "Canonical manual scenario validating that close Skill Advisor recommendations are surfaced as ambiguity instead of false certainty."
---

# SAD-002 -- Ambiguous Recommendation Rendering

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAD-002`.

---

## 1. OVERVIEW

This scenario validates the user-visible ambiguity path for `advisor_recommend`. It confirms that close recommendations are represented as ambiguous rather than overstated as a single certain route.

### Why This Matters

Ambiguous routing is a correctness feature. The advisor should be useful without pretending certainty when a prompt genuinely spans multiple skill domains.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAD-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that a cross-domain prompt surfaces ambiguity or clearly justified competing recommendations.
- Real user request: `Review the OpenCode docs and improve the prompt package for a release note workflow.`
- RCAF Prompt:
  - Role: Skill Advisor MCP operator validating ambiguity handling.
  - Context: The prompt plausibly spans documentation review, prompt improvement, and OpenCode system code.
  - Action: Call `advisor_recommend` with `topK: 2` and attribution enabled, inspect the top two recommendations, and verify that ambiguity is represented when confidence is close.
  - Format: Return `PASS`, `PARTIAL`, or `FAIL` with top-two skill IDs, confidence values, and the ambiguity flag.
- Expected execution process: Operator calls the native MCP tool, captures top-two scoring evidence, and compares the observed ambiguity state with the confidence gap.
- Expected signals: Response envelope has `status: "ok"`. `recommendations` contains at least two entries when two pass thresholds. `data.ambiguous` is true when the top-two confidence values are within the configured ambiguity window. Rendered or summarized output does not overstate certainty.
- Desired user-visible outcome: A verdict that either names a clear route or reports ambiguity between plausible routes.
- Pass/fail: PASS if close top-two recommendations are represented as ambiguous and attribution remains prompt-safe. PARTIAL if only one recommendation passes threshold but the single route is well justified. FAIL if close recommendations are presented as certain or prompt text leaks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the MCP server build is current.
2. Execute the deterministic MCP call with `topK: 2`.
3. Save the JSON response to `/tmp/skill-advisor-playbook/sad-002.json`.
4. Compare top-two confidence values and `data.ambiguous`.
5. Return a user-readable verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-002 | Ambiguous recommendation rendering | Confirm close recommendations are surfaced as ambiguity instead of false certainty | `Role: Skill Advisor MCP operator. Context: cross-domain prompt spanning documentation review, prompt improvement, and OpenCode system work. Action: call advisor_recommend with topK 2 and attribution enabled, then inspect top-two confidence values and the ambiguity flag. Format: return PASS, PARTIAL, or FAIL with top-two skill IDs, confidence values, and ambiguity state.` | 1. `advisor_recommend({"prompt":"Review the OpenCode docs and improve the prompt package for a release note workflow.","options":{"topK":2,"includeAttribution":true,"includeAbstainReasons":true}})` -> 2. Save JSON to `/tmp/skill-advisor-playbook/sad-002.json` -> 3. Compare `data.recommendations[0].confidence`, `data.recommendations[1].confidence`, and `data.ambiguous` | Envelope status is `ok`; top recommendations are plausible for the prompt; close top-two results set `ambiguous: true`; lane attribution remains prompt-safe | `/tmp/skill-advisor-playbook/sad-002.json` plus top-two confidence notes | PASS if ambiguity matches close top-two scoring and prompt-safety holds; PARTIAL if only one skill passes threshold with a clear reason; FAIL if close candidates are shown as certain or prompt text leaks | 1. Inspect scorer ambiguity threshold; 2. Re-run handler and renderer tests; 3. Check lane attribution for prompt leakage; 4. Review feature catalog ambiguity entry |

### Optional Supplemental Checks

Run a narrower prompt that should not be ambiguous and verify `data.ambiguous` is false.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/04--scorer-fusion/03-ambiguity.md` | Feature-catalog source for ambiguity behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../handlers/advisor-recommend.ts` | Native recommendation handler |
| `../../lib/scorer/ambiguity.ts` | Ambiguity threshold logic |
| `../../lib/render.ts` | User-visible brief rendering |
| `../../tests/handlers/advisor-recommend.vitest.ts` | Automated recommendation coverage |
| `../../tests/legacy/advisor-renderer.vitest.ts` | Rendering coverage |

---

## 5. SOURCE METADATA

- Group: Recommendation
- Playbook ID: SAD-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--recommendation/002-ambiguous-recommendation-rendering.md`
