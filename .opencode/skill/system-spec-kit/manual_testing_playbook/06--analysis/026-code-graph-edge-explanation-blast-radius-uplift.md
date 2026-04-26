---
title: "EX-026 -- Code Graph edge explanation and blast radius uplift"
description: "This scenario validates Code Graph edge explanation and blast radius uplift for `EX-026`. Covers baseline reason/step + depthGroups + riskLevel + minConfidence + ambiguityCandidates + failureFallback (010/003) AND 010/007 hardening: exact-limit overflow detection (R-007-P2-4), multi-subject seed preservation (R-007-P2-5), failureFallback.code enumeration (R-007-P2-6), edge reason/step control-character sanitization (R-007-P2-3)."
---

# EX-026 -- Code Graph edge explanation and blast radius uplift

## 1. OVERVIEW

This scenario validates `code_graph_query` relationship + blast_radius end-to-end. Covers (1) baseline 010/003 enrichment — `reason`, `step`, `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates`, `failureFallback`; (2) **exact-limit overflow detection** added in 010/007/T-F (R-007-P2-4); (3) **multi-subject seed preservation** added in 010/007/T-F (R-007-P2-5); (4) **failureFallback.code enumeration** across all 5 codes added in 010/007/T-F (R-007-P2-6); (5) **edge reason/step control-character sanitization** added in 010/007/T-D (R-007-P2-3).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-026` and confirm the expected signals without contradicting evidence.

- Objective: Validate Code Graph explanation metadata, enriched impact output, AND the 010/007 hardening behaviors (overflow truth, seed preservation, stable failure codes, control-char sanitization).
- Real user request: `Show me why this Code Graph relationship exists and what the blast radius looks like with confidence filtering. Also confirm the system handles exact-limit results, partial multi-subject queries, and adversarial edge metadata correctly.`
- Prompt: `As an analysis validation operator, validate code_graph_query relationship and blast_radius output for edge reason/step metadata, depthGroups, riskLevel, minConfidence, ambiguityCandidates, failureFallback (with stable code field), exact-limit overflow detection, multi-subject seed preservation, and read-path control-character sanitization. Return a concise pass/fail verdict with cited output fields.`
- Expected execution process: Run a fresh scan, query a relationship with known edges, run blast_radius with various inputs (filtered, exact-limit, multi-subject, ambiguous, fault-injected), and probe edge reason/step round-trip.
- Expected signals: Edge rows include `reason` and `step`; blast-radius output includes `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates`, `failureFallback.code` ∈ `{limit_reached, unresolved_subject, ambiguous_subject, empty_source, compute_error}`, `preservedSeedNodes` on partial multi-subject; control-character bytes in `reason` round-trip as `null`.
- Desired user-visible outcome: Operator can audit why edges exist, judge impact risk, and trust failure modes are observable + stable.
- Pass/fail: PASS if all required fields appear with plausible values across all blocks; FAIL if any bare blast-radius error string replaces `failureFallback`, ambiguity is silently resolved, exact-limit returns `partialResult: true` (false-positive overflow), multi-subject failure wipes resolved seeds, OR control characters round-trip through edge metadata.

---

## 3. TEST EXECUTION

### Prompt

```text
As an analysis validation operator, validate code_graph_query relationship and blast_radius output across 5 blocks: (A) baseline edge reason/step + depthGroups + riskLevel + minConfidence + ambiguityCandidates + failureFallback; (B) exact-limit overflow detection — partialResult:false when count===limit; (C) multi-subject seed preservation when one subject is unresolvable; (D) failureFallback.code enumeration across all 5 codes; (E) edge reason/step control-character round-trip returns null. Return a concise pass/fail verdict with cited output fields.
```

### Commands

**Block A — Baseline reason/step + blast_radius enrichment (010/003):**

1. `code_graph_scan`
2. `code_graph_query({ operation: "calls_from", subject: "<known-symbol>" })` — assert each edge row includes `reason` (string|null) and `step` (string|null).
3. `code_graph_query({ operation: "blast_radius", subject: "<known-file-or-symbol>", maxDepth: 2 })` — assert `depthGroups[]`, `riskLevel ∈ {high, medium, low}`, `minConfidence` echo, `ambiguityCandidates[]` (may be empty).
4. `code_graph_query({ operation: "blast_radius", subject: "<known-symbol>", maxDepth: 2, minConfidence: 0.75 })` — assert filtered output drops edges below 0.75; compare `affectedFiles` count vs the unfiltered run from step 3.

**Block B — Exact-limit overflow detection (R-007-P2-4, 010/007/T-F):**

5. Pick a `<seed-symbol>` whose blast radius produces exactly N affected files. Confirm N via a high-limit pre-query: `code_graph_query({ operation: "blast_radius", subject: "<seed-symbol>", limit: 1000 })`.
6. Re-query with `limit: N` (the exact count). Assert response: `affectedFiles.length === N` AND `partialResult: false` (the 010/007/T-F fix requests `limit + 1` from SQL to detect TRUE overflow; previously this case false-positived to `partialResult: true`).
7. Re-query with `limit: N - 1`. Assert response: `affectedFiles.length === N - 1` AND `partialResult: true` (genuine overflow case — sanity check the limit+1 logic still detects real overflow).

**Block C — Multi-subject seed preservation (R-007-P2-5, 010/007/T-F):**

8. `code_graph_query({ operation: "blast_radius", subjects: ["<resolvable-1>", "<resolvable-2>", "<NONEXISTENT-fqname>"], maxDepth: 1 })` — three subjects, one unresolvable.
9. Assert response: `partialResult: true`, `failureFallback.code === 'unresolved_subject'`, `preservedSeedNodes[]` contains the two resolved seeds (NOT empty), `nodes[]` reflects the resolved-seed traversal (not wiped to `[]`).

**Block D — failureFallback.code enumeration (R-007-P2-6, 010/007/T-F):**

10. **`limit_reached`**: query a high-fanout subject with `limit: 1`. Assert `failureFallback.code === 'limit_reached'`.
11. **`unresolved_subject`**: query with a non-existent fq name. Assert `failureFallback.code === 'unresolved_subject'` (also covered by step 9 in the multi-subject case).
12. **`ambiguous_subject`**: query with a fq name that has multiple matching candidates. Assert `failureFallback.code === 'ambiguous_subject'` AND `ambiguityCandidates[]` populated.
13. **`empty_source`**: query a subject that is structurally valid but has no outbound edges (e.g., a leaf module). Assert `failureFallback.code === 'empty_source'`.
14. **`compute_error`**: hard to trigger from a clean DB. **MAY BE UNAUTOMATABLE** — if so, cross-reference `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` fault-injection coverage and document the runner SKIP. If reproducible, assert `failureFallback.code === 'compute_error'` AND that the `spec_kit.graph.blast_radius_failure_total{code='compute_error'}` metric incremented.

**Block E — Edge reason/step control-character sanitization (R-007-P2-3, 010/007/T-D):**

15. **Setup (direct DB write):** identify an existing edge row in `code_edges` (use `code_graph_query` to find one) and update its `metadata` JSON to inject a control character into `reason`: `UPDATE code_edges SET metadata = json_set(metadata, '$.reason', 'normal' || char(7) || 'bytes') WHERE id = <edge-id>;` (char(7) = `\x07` BEL).
16. Re-query the edge via `code_graph_query({ operation: "calls_from", subject: "<symbol>" })` and capture the same edge from output.
17. Assert: the returned edge's `reason` field is `null` (sanitizer rejected the control-char-containing string per the read-path allowlist) — NOT the raw `'normal\x07bytes'` string. Same assertion for `step` if injected there.
18. **Teardown:** restore the original `metadata` value OR drop the test edge.

### Expected

- Block A: each edge has `reason` + `step` keys (value may be null); blast_radius response has `depthGroups`, `riskLevel`, echoed `minConfidence`, `ambiguityCandidates`, `failureFallback` (when applicable).
- Block B: exact-limit case returns `partialResult: false` (the bug-fix assertion); under-limit case returns `partialResult: true` with overflow indicator.
- Block C: multi-subject failure preserves resolved seeds in `preservedSeedNodes`; `nodes[]` reflects partial traversal not wiped to `[]`.
- Block D: each of the 5 `failureFallback.code` values triggers from its respective scenario; `compute_error` may SKIP if fault injection isn't accessible.
- Block E: control-char-containing `reason` round-trips as `null`; raw bytes do NOT leak through the read path.

### Evidence

JSON payloads from steps 2, 3, 4, 6, 7, 9, 10, 12, 13, (14 if reproduced), and 17. The pre-query high-limit response from step 5. The DB row before/after for steps 15 + 18.

### Pass / Fail

- **Pass**: Block A required fields present and behave correctly; Block B exact-limit assertion holds (`partialResult: false`); Block C `preservedSeedNodes[]` populated on partial failure; Block D at least 4 of 5 codes triggered (compute_error allowed UNAUTOMATABLE with cited test coverage); Block E control-char `reason` returns `null`.
- **Fail**: Any of: relationship rows missing reason/step; exact-limit case returns `partialResult: true` (R-007-P2-4 regression); multi-subject failure returns empty `nodes[]` or missing `preservedSeedNodes` (R-007-P2-5 regression); `failureFallback.code` field missing from any response (R-007-P2-6 regression); control characters round-trip through `reason` to caller (R-007-P2-3 regression — security relevant).

### Failure Triage

1. **Block A**: Run `code_graph_scan` and repeat if readiness blocks the first attempt. If no ambiguous symbol exists, create two same-fq-name fixtures in scratch.
2. **Block B**: If exact-limit case false-positives, inspect `mcp_server/code_graph/handlers/query.ts:859-897` for the limit+1 SQL request and `totalAffectedBeforeSlice > limit` overflow check (010/007/T-F R-007-P2-4).
3. **Block C**: If `preservedSeedNodes` is missing, inspect `mcp_server/code_graph/handlers/query.ts:1048-1058` multi-subject loop — confirm resolved seeds aren't reset to `[]` on a sibling failure (010/007/T-F R-007-P2-5).
4. **Block D**: If `failureFallback.code` is undefined, inspect `mcp_server/code_graph/handlers/query.ts:1121-1135` and `BlastRadiusFailureCode` literal union; check all 5 failure-fallback sites set the code (010/007/T-F R-007-P2-6).
5. **Block E**: If control characters round-trip, inspect read-path sanitizer at `mcp_server/code_graph/lib/code-graph-db.ts:756-805` (`rowToEdge`), `mcp_server/code_graph/handlers/query.ts:608-635` (`edgeMetadataOutput`), and `mcp_server/code_graph/lib/code-graph-context.ts:287-320` (`formatContextEdge`). Allowlist: single-line, length ≤200, no control chars (`\x00-\x1F\x7F`); failures fall through to `null` (010/007/T-D R-007-P2-3).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `mcp_server/code_graph/handlers/query.ts` | Blast-radius and relationship query output |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Edge metadata writer |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Context propagation |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Automated coverage for risk, filtering, ambiguity and fallback |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Automated coverage for reason and step metadata |

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md`
- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift` (baseline) + `026/010/007-review-remediation` T-D (R-007-P2-3) + T-F (R-007-P2-4/5/6)
- Coverage extension: 010/011-manual-testing-playbook-coverage-and-run (Blocks B + C + D + E added)
