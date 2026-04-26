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

## 2. SCENARIO CONTRACT

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

**Block A — Affordance routing + privacy (010/004 baseline + 010/007/T-D denylist):**

1. `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run skill_advisor/tests/affordance-normalizer.test.ts skill_advisor/tests/lane-attribution.test.ts skill_advisor/tests/routing-fixtures.affordance.test.ts --reporter=dot`
2. `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py`
3. `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck`

**Block B — Debug counter parity (R-007-P2-9, 010/007/T-F):**

4. **TS counters surface:** `rg -n "affordanceNormalizerCounters|getAffordanceNormalizerCounters|resetAffordanceNormalizerCounters" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts` — confirm 5 counters declared (`received`, `accepted`, `dropped_unsafe`, `dropped_empty`, `dropped_unknown_skill`), exported getter, exported reset.
5. **Python counters surface:** `rg -n "AFFORDANCE_NORMALIZER_COUNTERS|get_affordance_normalizer_counters|reset_affordance_normalizer_counters" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` — confirm matching 5-key dict, getter, reset.
6. **Counter parity assertion:** call `resetAffordanceNormalizerCounters()`, run normalizer over the shared fixture (`skill_advisor/tests/__shared__/affordance-injection-fixtures.json`, 28 injection + 11 benign + 4 privacy), then call `getAffordanceNormalizerCounters()`. Assert: `received === 43` (28 + 11 + 4), `accepted >= 11` (benign survive), `dropped_unsafe >= 28` (injection phrases drop), `dropped_empty + dropped_unknown_skill` accounts for the rest. Repeat in Python via `test_skill_advisor.py` shared-fixture parity tests (already covers PY counters).

### Expected

- Block A: focused Vitest run passes (37+ tests). Python suite reports affordance compiler checks passing (57 tests). TypeScript typecheck passes. Public recommendation output contains lane names + scores, not raw matched affordance phrases.
- Block B: TS + Python both expose 5 named counters (`received` / `accepted` / `dropped_unsafe` / `dropped_empty` / `dropped_unknown_skill`); shared-fixture run produces consistent counter values across TS and Python implementations.

### Evidence

Captured command output for steps 1–3, `rg` output for steps 4–5, the counter object snapshots for step 6. JSON excerpt showing `laneBreakdown` uses existing lane names only (no new lane introduced).

### Pass / Fail

- **Pass**: Block A — normalized affordance evidence routes through `derived_generated` and `graph_causal`, privacy assertions pass, explicit author triggers retain precedence. Block B — both TS and Python expose the 5 counters; shared-fixture parity holds.
- **Fail**: Block A — raw affordance phrase leaks, new lane appears, new relation type required, or affordance-only outranks explicit. Block B — counters absent from one implementation, OR TS/Python counter values diverge by >0 on the shared fixture.

### Failure Triage

- **Block A**: Check `affordance-normalizer.ts` allowlist first. Then inspect `fusion.ts` to confirm raw affordance inputs call `normalize()` before lane execution. Finally inspect `derived.ts` and `graph-causal.ts` for raw phrase evidence or non-`EDGE_MULTIPLIER` relation usage.
- **Block B**: If counters absent, inspect `mcp_server/skill_advisor/lib/affordance-normalizer.ts:153-157` for `affordanceNormalizerCounters` declaration + bumps inside `normalize()`, and `mcp_server/skill_advisor/scripts/skill_graph_compiler.py:407` for the matching Python dict + bumps inside `normalize_affordance_input()` (010/007/T-F R-007-P2-9). If parity diverges, run the Python R-007-P2-8 shared-fixture test trio to isolate which sanitizer (TS or PY) is out of sync.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
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
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md`
- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence` (baseline) + `026/010/007-review-remediation` T-D (denylist broadened R-007-9, conflicts_with reject R-007-8) + T-F (debug counters R-007-P2-9)
- Coverage extension: 010/011-manual-testing-playbook-coverage-and-run (Block B added)
