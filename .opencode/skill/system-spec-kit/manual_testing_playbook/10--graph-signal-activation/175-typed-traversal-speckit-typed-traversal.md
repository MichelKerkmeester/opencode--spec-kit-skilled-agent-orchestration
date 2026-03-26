---
title: "175 -- Typed traversal (SPECKIT_TYPED_TRAVERSAL)"
description: "This scenario validates typed traversal (SPECKIT_TYPED_TRAVERSAL) for `175`. It focuses on the default-on graduated rollout and verifying sparse-first policy and intent-aware edge traversal scoring."
---

# 175 -- Typed traversal (SPECKIT_TYPED_TRAVERSAL)

## 1. OVERVIEW

This scenario validates typed traversal (SPECKIT_TYPED_TRAVERSAL) for `175`. It focuses on the default-on graduated rollout and verifying sparse-first policy and intent-aware edge traversal scoring.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `175` and confirm the expected signals without contradicting evidence.

- Objective: Verify sparse-first policy + intent-aware edge traversal scoring
- Prompt: `Test the default-on SPECKIT_TYPED_TRAVERSAL behavior. Verify that sparse graphs (density < 0.5) constrain traversal to 1-hop typed expansion and that intent-aware edge traversal maps query intents to edge-type priority orderings. Confirm the scoring formula score = seedScore * edgePrior * hopDecay * freshness is applied. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: SPARSE_DENSITY_THRESHOLD=0.5 gates sparse-first policy; SPARSE_MAX_HOPS=1 constrains traversal in sparse graphs; INTENT_EDGE_PRIORITY maps intents to edge-type orderings; scoring formula = seedScore * edgePrior * hopDecay * freshness; edge prior tiers: first=1.0, second=0.75, remaining=0.5; MAX_HOPS=2 in normal mode
- Pass/fail: PASS if sparse graphs constrain to 1-hop and intent-aware scoring applies correct formula with edge prior tiers; FAIL if sparse graphs allow multi-hop, intent mapping missing, or scoring formula incorrect

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 175 | Typed traversal (SPECKIT_TYPED_TRAVERSAL) | Verify sparse-first policy + intent-aware edge traversal scoring | `Test the default-on SPECKIT_TYPED_TRAVERSAL behavior. Verify sparse-first 1-hop constraint and intent-aware edge scoring formula. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_TYPED_TRAVERSAL` is unset or `true` 2) Run search against a sparse graph (density < 0.5) 3) Verify traversal constrained to SPARSE_MAX_HOPS=1 4) Run search with classified intent (e.g., fix_bug) 5) Verify INTENT_EDGE_PRIORITY mapping applied 6) Confirm score = seedScore * edgePrior * hopDecay * freshness | isTypedTraversalEnabled() returns true; sparse-first: density < 0.5 → 1-hop; INTENT_EDGE_PRIORITY maps fix_bug/add_feature/find_decision/understand/find_spec/refactor/security_audit; edge prior tiers: 1.0/0.75/0.5; MAX_BOOST_PER_HOP=0.05; MAX_COMBINED_BOOST=0.20 | Causal boost output + traversal hop count + edge prior values + scoring breakdown + test transcript | PASS if sparse-first constrains to 1-hop and intent-aware scoring uses correct formula and edge priors; FAIL if sparse graphs allow > 1 hop, intent mapping missing, or scoring formula wrong | Verify isTypedTraversalEnabled() → Confirm flag is not forced off → Check SPARSE_DENSITY_THRESHOLD=0.5 → Inspect SPARSE_MAX_HOPS=1 enforcement → Verify INTENT_EDGE_PRIORITY mappings → Check scoring formula components |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/16-typed-traversal.md](../../feature_catalog/10--graph-signal-activation/16-typed-traversal.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/causal-boost.ts`

---

## 5. SOURCE METADATA

- Group: Graph signal activation
- Playbook ID: 175
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/175-typed-traversal-speckit-typed-traversal.md`
