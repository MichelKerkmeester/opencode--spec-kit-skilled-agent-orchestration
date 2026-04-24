---
title: Deep review report
verdict: CONDITIONAL
hasAdvisories: false
total_iterations: 10
stop_reason: converged
---

# Deep Review Report

## 1. Executive summary
The 10-iteration loop finished **CONDITIONAL**. No P0 findings survived the final sweep, but the packet ended with **5 active P1 findings** across correctness, traceability, and maintainability. Per the requested verdict rule (`P0 -> FAIL`, `>=5 P1 -> CONDITIONAL`, else `PASS`), that keeps the packet below PASS even though the loop converged after three consecutive low-churn iterations.

The dominant risk is **packet drift after renumbering**: the phase implementation is present, but parts of the packet still point at removed research paths or stale metadata. The production-side code also has one correctness defect in cache identity and one maintainability gap in telemetry regression coverage.

## 2. Scope
Reviewed packet:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry/{spec.md,plan.md,tasks.md,checklist.md,decision-record.md,implementation-summary.md,description.json,graph-metadata.json}`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/{cross-encoder.vitest.ts,cross-encoder-extended.vitest.ts}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/research/010-search-and-routing-tuning-pt-01/research.md`

Write scope stayed inside this packet's `review/` directory.

## 3. Method
1. Initialized a fresh review packet with the requested 10-iteration limit, 0.10 convergence threshold, and 3-iteration low-churn stop rule.
2. Rotated dimensions in the requested order: correctness -> security -> traceability -> maintainability, then repeated.
3. Required every finding to carry file-line evidence from packet docs, code, or tests.
4. Replayed the final three iterations as stabilization passes; all three landed at `newFindingsRatio <= 0.05`, so convergence triggered on iteration 010.
5. Applied the user-specified verdict rule rather than the skill's default PASS/CONDITIONAL split.

## 4. Findings by severity

### P0
| ID | Dimension | Title | Evidence | Notes |
|----|-----------|--------|----------|-------|
| None | - | - | - | No P0 survived the adversarial reread. |

### P1
| ID | Dimension | Title | Evidence | First seen | Notes |
|----|-----------|-------|----------|------------|-------|
| F001 | correctness | Cache key ignores document content | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248-265`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433-439` | 001 | Stable document ids can replay stale reranks and inflate hit telemetry. |
| F002 | traceability | Packet docs still point at a removed sibling research path | `plan.md:13-15`, `tasks.md:6-7`, `checklist.md:11`, `decision-record.md:7` | 003 | The packet's own rationale links are no longer replayable from the migrated path. |
| F003 | traceability | `description.json` parentChain still encodes the old phase number | `description.json:16-19`, `graph-metadata.json:3-5` | 003 | Packet metadata lineage disagrees with the canonical packet id. |
| F004 | maintainability | Stale-hit and eviction telemetry remain unprotected by targeted regression tests | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140-153`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442-444`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433-460`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:193-200` | 004 | Two of the four counters can drift without a dedicated failing test. |
| F005 | traceability | Decision record still advertises the phase as planned | `decision-record.md:1-3`, `spec.md:1-5`, `implementation-summary.md:1-10` | 007 | Status-bearing docs disagree on whether the phase is complete. |

### P2
| ID | Dimension | Title | Evidence | Notes |
|----|-----------|-------|----------|-------|
| None | - | - | - | No P2-only advisory survived as a standalone finding. |

## 5. Findings by dimension

### Correctness
- **F001** - `generateCacheKey()` hashes only provider/query/doc ids and omits document content, but the cache-hit path returns cached reranks directly. A stable id with changed content can therefore produce a false hit and stale telemetry. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248-265`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433-439`]

### Security
- No active findings. Both security passes found aggregate counters only; no secret material, authn/authz boundary, or input handling issue surfaced in this telemetry slice. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516-548`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/configs/README.md:49-53`]

### Traceability
- **F002** - The packet still cites `../research/research.md` from multiple documents, but the renumbered phase no longer has that sibling path. [SOURCE: `plan.md:13-15`] [SOURCE: `tasks.md:6-7`] [SOURCE: `checklist.md:11`] [SOURCE: `decision-record.md:7`]
- **F003** - `description.json` still records `010-search-and-routing-tuning` in `parentChain`, while the packet id and graph metadata use `001-search-and-routing-tuning`. [SOURCE: `description.json:16-19`] [SOURCE: `graph-metadata.json:3-5`]
- **F005** - `decision-record.md` says `status: planned` even though the rest of the packet is marked complete. [SOURCE: `decision-record.md:1-3`] [SOURCE: `spec.md:1-5`] [SOURCE: `implementation-summary.md:1-10`]

### Maintainability
- **F004** - The live code increments `staleHits` and `evictions`, but the tests only assert a fresh-hit cache path plus reset-to-zero behavior, so two telemetry semantics are currently under-specified by the automated suite. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140-153`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442-444`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433-460`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:193-200`]

## 6. Adversarial self-check for P0
No finding remained at P0 after adversarial reread.

- **F001** was challenged as a possible P0 because it can distort tuning data, but it still requires a narrow condition (stable ids paired with changed content inside the cache TTL) and does not create a security break or unconditional crash. It stays P1.
- The security sweeps in iterations 002, 006, and 010 did not find a route from these counters to secret leakage or privilege escalation, so no security issue was promoted above PASS for that dimension.

## 7. Remediation order
1. **Repair packet traceability first**: fix the broken `../research/research.md` references (F002) so the packet's rationale is locally replayable again.
2. **Correct metadata lineage**: update `description.json` so `parentChain` matches the migrated `001-search-and-routing-tuning` path (F003).
3. **Normalize packet status fields**: mark `decision-record.md` complete or otherwise reconcile its state with the rest of the packet (F005).
4. **Harden cache identity**: include document content or a content-derived fingerprint in the cache key so reranker hits reflect the actual reranked payload (F001).
5. **Close the telemetry test gap**: add explicit stale-hit and LRU-eviction assertions to the cross-encoder tests (F004).

## 8. Verification suggestions
1. Add a regression test that reranks the same document id with changed content and asserts the cache does not serve the old result.
2. Add one stale-entry test and one cache-bound eviction test so `hits/misses/staleHits/evictions` all have a direct failing test.
3. Re-run packet validation after repairing the docs/metadata to confirm the migrated path and status markers are consistent across `spec.md`, `decision-record.md`, `description.json`, and `graph-metadata.json`.
4. Replay a fresh review after the fixes to confirm the packet drops below the `>=5 P1` conditional threshold.

## 9. Appendix

### Iteration list
| Iteration | Dimension | New findings | Ratio | Delta file |
|-----------|-----------|--------------|-------|------------|
| 001 | correctness | F001 | 1.00 | `review/deltas/iter-001.jsonl` |
| 002 | security | none | 0.00 | `review/deltas/iter-002.jsonl` |
| 003 | traceability | F002, F003 | 0.67 | `review/deltas/iter-003.jsonl` |
| 004 | maintainability | F004 | 0.25 | `review/deltas/iter-004.jsonl` |
| 005 | correctness | none | 0.00 | `review/deltas/iter-005.jsonl` |
| 006 | security | none | 0.00 | `review/deltas/iter-006.jsonl` |
| 007 | traceability | F005 | 0.20 | `review/deltas/iter-007.jsonl` |
| 008 | maintainability | none | 0.00 | `review/deltas/iter-008.jsonl` |
| 009 | correctness | none | 0.00 | `review/deltas/iter-009.jsonl` |
| 010 | security | none | 0.00 | `review/deltas/iter-010.jsonl` |

### Delta churn
- Last 3 `newFindingsRatio` values: `0.00 -> 0.00 -> 0.00`
- Dimension coverage after iteration 004: `4 / 4`
- Final stop reason: `converged`
- Final severity counts: `P0=0, P1=5, P2=0`
