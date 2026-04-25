---
_memory:
  continuity:
    next_safe_action: "Synthesize research.md and resource-map.md from iter 010 + prior 9; orchestrator runs canonical save"
---
# Iteration 010 — Cross-Cutting Synthesis + Adopt/Adapt/Reject/Defer Matrix

**Focus:** Synthesize 9-iteration review into final A/A/R/D matrix mapped to owner sub-phases.
**Iteration:** 10 of 10
**Convergence score:** 0.93

The review converged on one P1 and a bounded P2 backlog. No P0 was found. The useful dedupe is by underlying closure or regression surface, not raw ID: 28 raw IDs collapse to 18 distinct issues once repeats, follow-up confirmations, and test/doc mirrors are grouped.

## Cumulative finding inventory (deduplicated)

| Distinct | Raw IDs | First iter | Severity | Remediation | RQ | Status | Owner |
|---|---:|---:|---|---|---|---|---|
| D1 | F1/F6/F24 | 001 | P1 | code-fix + test-add | RQ1/RQ3/RQ5 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D2 | F2/F7 | 001 | P2 | code-fix | RQ3 | DEFER | future diff hardening |
| D3 | F3/F10 | 001 | P2 | code-fix | RQ3 | DEFER | future phase-runner hardening |
| D4 | F4 | 001 | P2 | test-add | RQ5 | ADOPT | `010/009-test-rig-adversarial-coverage` |
| D5 | F5 | 001 | P2 | doc-fix | RQ4 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D6 | F8/F9 | 002 | P2 | code-fix + test-add | RQ3/RQ5 | DEFER | future diff hardening |
| D7 | F11/F25 | 003 | P2 | code-fix + test-add | RQ3/RQ5 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D8 | F12 | 003 | P2 | code-fix or doc-fix | RQ2 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D9 | F13-iter3 | 003 | P2 | doc-fix | RQ4 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D10 | F14-iter4/F15-iter4 | 004 | P2 | test-add | RQ5 | ADOPT | `010/009-test-rig-adversarial-coverage` |
| D11 | F13-iter5 | 005 | P2 | test-add/code-fix | RQ3/RQ5 | ADAPT | future affordance hardening |
| D12 | F14-iter5/F27 | 005 | P2 | code-fix + test-add/doc-fix | RQ2/RQ3/RQ5 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D13 | F15-iter5 | 005 | P2 | test-add/doc-fix | RQ2/RQ5 | ADAPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D14 | F16/F18 | 006 | P2 | test-add | RQ3/RQ5 | ADOPT | `010/009-test-rig-adversarial-coverage` |
| D15 | F17 | 006 | P2 | doc-fix or test-add | RQ2/RQ5 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D16 | F19-F23 | 007 | P2 | doc-fix | RQ4 | ADOPT | `010/008-closure-integrity-and-pathfix-remediation` |
| D17 | F26 | 009 | P2 | test-add | RQ5 | ADOPT | `010/009-test-rig-adversarial-coverage` |
| D18 | F28 | 009 | P2 | scope-defer | RQ5 | DEFER | fixture polish backlog |

Source anchors: iteration 001 identified F1-F5; iteration 002 confirmed F6-F10; iteration 003 introduced F11-F13; iteration 004 confirmed F12 and added F14/F15; iteration 005 added affordance F13-F15; iteration 006 added F16-F18; iteration 007 added F19-F23; iteration 008 systematically verified 33 010/007 closure rows and re-confirmed the five contradicted closures; iteration 009 added F24-F28.

## A/A/R/D matrix

### ADOPT (P1 + closure-critical P2) -- must close

| Finding | Severity | Owner sub-phase | Remediation type |
|---|---|---|---|
| D1: `detect_changes` mixed-header path-containment bypass, with missing mixed-header regression tests | P1 | `010/008-closure-integrity-and-pathfix-remediation` | code-fix + test-add |
| D4: phase-runner duplicate-output rejection lacks regression tests | P2 | `010/009-test-rig-adversarial-coverage` | test-add |
| D5: 010/001 license docs retain stale quote-era claims after scrub decision | P2 | `010/008-closure-integrity-and-pathfix-remediation` | doc-fix |
| D7: malformed edge metadata JSON/read-path sanitizer coverage gap | P2 | `010/008-closure-integrity-and-pathfix-remediation` | code-fix + test-add |
| D8: R-007-P2-4 `limit + 1` closure claim does not match implementation mechanism | P2 | `010/008-closure-integrity-and-pathfix-remediation` | decide code-fix or doc-fix |
| D9: `riskLevel` depth-one count 10 is undocumented | P2 | `010/008-closure-integrity-and-pathfix-remediation` | doc-fix |
| D10: blast-radius `failureFallback.code` and `minConfidence` boundaries lack handler tests | P2 | `010/009-test-rig-adversarial-coverage` | test-add |
| D12: `conflicts_with` reject is Python-only; TS normalizer and playbook coverage still drift | P2 | `010/008-closure-integrity-and-pathfix-remediation` | code-fix + test-add/doc-fix |
| D14: trust-badge partial overlay and age-label boundary tests are missing | P2 | `010/009-test-rig-adversarial-coverage` | test-add |
| D15: T-E "3/3 SQL tests" claim is actually two SQL-pipeline tests plus one formatter pass-through | P2 | `010/008-closure-integrity-and-pathfix-remediation` | doc-fix or test-add |
| D16: tool-count canonicalization to 51 is incomplete across SKILL, INSTALL_GUIDE, MCP README, and feature catalog | P2 | `010/008-closure-integrity-and-pathfix-remediation` | doc-fix |
| D17: R-007-12 tests prove generation increments but not `memory_search` cache-key semantics | P2 | `010/009-test-rig-adversarial-coverage` | test-add |

### ADAPT (P2 -- accept with scope adjustment)

| Finding | Adjustment |
|---|---|
| D11: obfuscated prompt-injection variants outside denylist | Adopt a bounded scope only: direct regex synonyms, punctuation/zero-width normalization if cheap, and explicit docs that semantic equivalence, multilingual prompts, and encoded payloads are not guaranteed by this packet. |
| D13: affordance debug counters not value-tested; `dropped_unsafe` is permanently zero | Add value tests for the counters that do fire, then either rename/document `dropped_unsafe` as reserved or increment it only for a clearly defined unsafe-drop event. Do not invent a broad unsafe metric without a stable meaning. |

### REJECT (false positives or out-of-scope)

| Finding | Reason |
|---|---|
| None | No prior finding was fully false. Several are lower priority, but each points at a real code, doc, test, or scope contract mismatch. |

### DEFER (legitimate but lower priority)

| Finding | Defer-to |
|---|---|
| D2: diff path byte-safety contract lacks NUL/control/backslash/path-length handling | Future diff hardening packet; real boundary issue, but below the mixed-header P1. |
| D3: phase-runner accepts malformed runtime keys outside TypeScript | Future phase-runner hardening; exported API risk, not currently hit by shipped literal phase definitions. |
| D6: hunk completeness and rename/copy-only diff handling remain partial | Future diff parser completeness packet. |
| D18: manual fixture has boilerplate-heavy near-duplicate seed pairs | Fixture polish backlog unless duplicate-threshold flake appears. |

## RQ convergence verdict

| RQ | Verdict | Evidence-backed conclusion |
|---|---|---|
| RQ1 | ANSWERED | One P1 and zero P0 regressions were found across 010/001-006. The P1 is D1/F1/F6: mixed old/new `detect_changes` headers can bypass one-sided containment validation, re-confirmed by iteration 008 as R-007-3 contradicted by code and by iteration 009 as not covered by 011 tests. |
| RQ2 | MOSTLY-ANSWERED | The 33 010/007 closures were systematically checked in iteration 008: 20 closed in code, 8 intended doc-only, 5 contradicted. The contradicted set is bounded: D1, D8, D12, D15, and D16. |
| RQ3 | ANSWERED WITH BOUNDED GAPS | Most hardening boundaries are code-backed, including readiness gating, ambiguity handling, trust-badge merge, age sanitization, and causal cache generation. The remaining real adversarial gaps are D1, D7, D11, D12, plus deferred D2/D3/D6. |
| RQ4 | ANSWERED | Documentation drift is known and P2-only: D5 license/audit wording, D9 riskLevel threshold wording, and D16 tool-count/detail drift. No new P0/P1 doc/code drift was found. |
| RQ5 | ANSWERED | 011 improved regression coverage but is not adversarially complete. The bounded test-add list is D1/D4/D7/D10/D12/D14/D17, with D18 deferred as fixture polish. |

Convergence by RQ:
- RQ1: 0.95. One reachable P1, no P0, no late-arriving high-severity surprises after iteration 2.
- RQ2: 0.90. Systematic closure table completed; open uncertainty is only remediation choice for F12 and F17.
- RQ3: 0.88. Boundary gaps are catalogued; some deferred hardening remains deliberately outside the next packet.
- RQ4: 0.94. Drift is well bounded and mostly mechanical doc cleanup.
- RQ5: 0.90. Test gaps are concrete and mapped to owner packets; broad adversarial completeness remains intentionally bounded.

## Recommended next-phase sub-phases

1. `010/008-closure-integrity-and-pathfix-remediation`
   - Close D1, D5, D7, D8, D9, D12, D13, D15, and D16.
   - This is the must-do packet because it contains the only P1 plus all closure-contradiction/doc-drift repairs that could make the 010/007 closure record misleading.

2. `010/009-test-rig-adversarial-coverage`
   - Close D4, D10, D14, and D17, and add the D1/D7/D12 regression tests if not already covered by 010/008.
   - This can be a separate packet if the team wants remediation code and test-rig expansion reviewed independently. Folding it into 010/008 is acceptable if cycle time matters more than separation.

Future backlog:
- Diff hardening packet for D2 and D6.
- Phase-runner exported-API hardening for D3.
- Fixture polish for D18.
- Bounded affordance-obfuscation hardening for D11 if the team wants to go beyond direct ASCII prompt-injection strings.

## Final convergence statement

The 10-iteration review answered all five RQs with source-cited evidence from the nine prior iteration artifacts and deltas. Confidence is high for the P0/P1 verdict, the 33-closure aggregate, and the doc-drift inventory. Confidence is medium-high for the P2 backlog prioritization because several items are valid but intentionally policy-shaped: F12 can be fixed in code or corrected in docs, F17 can be fixed by a third SQL test or by claim correction, and D11 depends on how broad the sanitizer threat model should become.

Final counts: total distinct findings 18; P0 0; P1 1; P2 17; ADOPT 12; ADAPT 2; REJECT 0; DEFER 4.

## Negative convergence (clean surfaces)

- No shipped runtime `GitNexus`/`gitnexus` scrub regression was found in the scanned runtime paths; 010/001's remaining issue is stale packet wording, not runtime leakage.
- `runPhases` already rejects duplicate phase names, duplicate published output keys, output/name collisions, and cycles; the open phase-runner issue is exported runtime key validation and missing duplicate-output tests.
- `detect_changes` readiness gating is fail-closed for non-fresh graph states and does not inline-index during diff handling.
- The diff parser's per-file counters prevent the next file header from being consumed as hunk body; the remaining parser issues are completeness/rename/copy attribution, not greedy multi-file corruption.
- Blast-radius exact-limit runtime behavior is correct; the issue is the documented `limit + 1` mechanism and missing boundary tests.
- Affordance routing through `derived_generated` and `graph_causal` is correct, and raw affordance phrases are not surfaced in recommendation evidence.
- Trust-badge per-field merge, DB getter seam, bind-side string casting, failure-reason shape, and non-causal cache-key exclusion are implemented.
- Root README and `system-spec-kit/README.md` mostly match the shipped 51-tool code surface; drift concentrates in SKILL.md, INSTALL_GUIDE, MCP README detail sections, and feature catalog wording.
- Iteration 008 found no new closure gaps beyond already-known contradictions, which is the strongest convergence signal in the run.

EXIT_STATUS=DONE | total=18 | P0=0 | P1=1 | P2=17 | adopt=12 | adapt=2 | reject=0 | defer=4 | next=synthesis
