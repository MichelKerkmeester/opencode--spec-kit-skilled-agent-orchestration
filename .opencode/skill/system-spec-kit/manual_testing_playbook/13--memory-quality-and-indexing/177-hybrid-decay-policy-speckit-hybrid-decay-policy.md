---
title: "177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)"
description: "This scenario validates hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) for `177`. It focuses on the default-on graduated rollout and verifying type-aware no-decay FSRS policy for decision/constitutional/critical types."
---

# 177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)

## 1. OVERVIEW

This scenario validates hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) for `177`. It focuses on the default-on graduated rollout and verifying type-aware no-decay FSRS policy for decision/constitutional/critical types.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `177` and confirm the expected signals without contradicting evidence.

- Objective: Verify type-aware no-decay FSRS policy for decision/constitutional/critical types
- Prompt: `Test the default-on SPECKIT_HYBRID_DECAY_POLICY behavior. Verify that memories with context_type decision, constitutional, or critical receive Infinity stability (no decay), while all other context types follow the standard FSRS v4 schedule. Confirm this is separate from TM-03 and that disabling the flag restores uniform FSRS decay for all types. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: classifyHybridDecay() maps decision/constitutional/critical to no_decay class; applyHybridDecayPolicy() returns Infinity stability for no_decay types; standard FSRS v4 power-law decay for all other types; separate from TM-03; flag OFF restores uniform decay
- Pass/fail: PASS if protected types receive Infinity stability and other types follow standard FSRS decay; FAIL if protected types decay, non-protected types get Infinity, or flag defaults to OFF

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | Verify type-aware no-decay FSRS policy for decision/constitutional/critical types | `Test the default-on SPECKIT_HYBRID_DECAY_POLICY behavior. Verify no-decay for protected types and standard FSRS for others. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_HYBRID_DECAY_POLICY` is unset or `true` 2) Save a memory with context_type=decision 3) Save a memory with context_type=general 4) Inspect stability values: decision should be Infinity, general should be finite 5) Verify classifyHybridDecay() output for constitutional and critical types 6) Set flag to `false`, verify uniform FSRS decay for all types | isHybridDecayPolicyEnabled() returns true; classifyHybridDecay() maps decision/constitutional/critical → no_decay; applyHybridDecayPolicy() returns Infinity for no_decay; standard FSRS v4 R(t) = (1 + 19/81 * t/S)^(-0.5) for others; flag OFF → uniform decay | Stability values per context_type + classifyHybridDecay() output + FSRS decay curve comparison + test transcript | PASS if decision/constitutional/critical get Infinity stability and others follow FSRS schedule; FAIL if protected types decay, non-protected get Infinity, or flag defaults OFF | Verify isHybridDecayPolicyEnabled() → Confirm flag is not forced off → Check classifyHybridDecay() type mapping → Inspect applyHybridDecayPolicy() Infinity assignment → Verify FSRS v4 formula for standard types |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/cognitive/fsrs-scheduler.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 177
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/177-hybrid-decay-policy-speckit-hybrid-decay-policy.md`
