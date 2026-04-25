---
title: "199 -- Skill Advisor affordance evidence"
description: "This scenario validates Skill Advisor affordance evidence for `199`. It focuses on allowlisted affordance routing through existing derived and graph-causal lanes while preserving privacy."
---

# 199 -- Skill Advisor affordance evidence

This document captures the user-testing contract, current behavior, execution flow, source anchors, and metadata for `199`.

---

## 1. OVERVIEW

This scenario validates Skill Advisor affordance evidence for `199`. It focuses on allowlisted affordance routing through existing derived and graph-causal lanes while preserving privacy.

### Why This Matters

Tool and resource hints can improve Skill Advisor recall, but raw descriptions can contain private text or prompt-stuffing attempts. This scenario confirms affordances help routing only after normalization and never create a new scoring lane or public raw-phrase output.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `199` and confirm the expected signals without contradictory evidence.

- Objective: Validate normalized affordance evidence in Skill Advisor scoring.
- Real user request: `Route this prompt using the browser recorder affordance, but do not expose the raw tool phrase.`
- Prompt: `As a Skill Advisor validation operator, run the affordance routing fixture against the native scorer. Verify affordance evidence contributes through derived_generated and graph_causal only, raw matched phrases stay out of recommendation payloads, and explicit triggers still win. Return a concise pass/fail verdict with cited test output.`
- Expected execution process: Run focused Vitest and Python compiler checks, inspect lane attribution, then inspect the public recommendation payload shape.
- Expected signals: `affordance-normalizer.test.ts` passes privacy assertions, `lane-attribution.test.ts` shows `derived_generated` and `graph_causal`, `routing-fixtures.affordance.test.ts` shows recall lift and explicit precedence, and Python compiler tests keep `ALLOWED_ENTITY_KINDS` unchanged.
- Desired user-visible outcome: The advisor can use sanitized affordance hints without leaking raw tool descriptions or adding routing vocabulary.
- Pass/fail: PASS if all checks pass and no raw matched affordance phrase appears in output. FAIL if a new lane appears, raw phrases leak, or explicit triggers lose to affordance-only evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a Skill Advisor validation operator, run the affordance routing fixture against the native scorer. Verify affordance evidence contributes through derived_generated and graph_causal only, raw matched phrases stay out of recommendation payloads, and explicit triggers still win. Return a concise pass/fail verdict with cited test output.`

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run skill_advisor/tests/affordance-normalizer.test.ts skill_advisor/tests/lane-attribution.test.ts skill_advisor/tests/routing-fixtures.affordance.test.ts --reporter=dot`
2. `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py`
3. `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck`

### Expected

The focused Vitest run passes. The Python suite reports the affordance compiler checks passing. TypeScript typecheck passes. Public recommendation output contains lane names and scores, not raw matched affordance phrases.

### Evidence

Capture the command output, plus a JSON excerpt showing `laneBreakdown` uses existing lane names only.

### Pass / Fail

- **Pass**: Normalized affordance evidence routes through `derived_generated` and `graph_causal`, privacy assertions pass, and explicit author triggers retain precedence.
- **Fail**: A raw affordance phrase leaks, a new lane appears, a new relation type is required, or affordance-only evidence outranks explicit author evidence.

### Failure Triage

Check `affordance-normalizer.ts` allowlist first. Then inspect `fusion.ts` to confirm raw affordance inputs call `normalize()` before lane execution. Finally inspect `derived.ts` and `graph-causal.ts` for raw phrase evidence or non-`EDGE_MULTIPLIER` relation usage.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../feature_catalog/11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Primary affordance sanitizer |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` | Privacy and allowlist regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lane-attribution.test.ts` | Lane attribution regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts` | Routing recall and precision regression coverage |

---

## 5. SOURCE METADATA

- Group: Scoring and calibration
- Playbook ID: 199
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md`
