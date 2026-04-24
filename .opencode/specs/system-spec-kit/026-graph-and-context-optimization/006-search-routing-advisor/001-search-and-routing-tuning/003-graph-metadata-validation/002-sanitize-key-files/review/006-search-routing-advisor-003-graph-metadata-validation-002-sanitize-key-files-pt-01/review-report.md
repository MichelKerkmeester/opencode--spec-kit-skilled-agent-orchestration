# Deep Review Report - Sanitize Key Files in Graph Metadata

## 1. Executive summary

**Verdict: CONDITIONAL.** The 10-iteration review found **0 P0**, **5 P1**, and **0 P2** findings across correctness, traceability, and maintainability. Security review did not confirm a packet-specific exploit path, but the packet still carries stale lineage metadata, stale authority/evidence links, and a non-canonical `key_files` output surface.

The loop stopped at **max_iterations** after covering all four dimensions. The packet is not release-blocked by a P0, but it is not audit-clean enough for an unqualified PASS because the required traceability surfaces still drift from the current packet layout.

## 2. Scope

Reviewed packet:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Referenced implementation and contract surfaces:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts`

Review mode was read-only outside the packet's `review/` folder.

## 3. Method

The loop ran 10 iterations with a fixed dimension rotation:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Each iteration re-read the prior state, selected one dimension, inspected the packet plus referenced implementation/tests, wrote a narrative artifact, appended a JSONL delta, and refreshed the findings registry. Convergence did not trigger early because the packet kept surfacing enough cross-document drift to justify the full 10-pass run.

## 4. Findings by severity

### P0

| ID | Finding | Dimension | Evidence |
|----|---------|-----------|----------|
| None | No blocker-level finding was confirmed. | — | — |

### P1

| ID | Finding | Dimension | Evidence |
|----|---------|-----------|----------|
| F001 | `description.json.parentChain` still points at `010-search-and-routing-tuning` instead of the current `001-search-and-routing-tuning` branch. | correctness | `description.json:14-20`; `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88`; `.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts:38-42` |
| F002 | `plan.md` still cites `../research/research.md` even though the current packet's derived source-doc inventory no longer includes a research artifact. | traceability | `plan.md:13-16`; `graph-metadata.json:195-201` |
| F003 | `decision-record.md` repeats the same stale `../research/research.md` authority path. | traceability | `decision-record.md:6-10`; `graph-metadata.json:195-201` |
| F004 | `checklist.md` marks blocking claims complete using stale parser line numbers that no longer land on the cited predicate/filter logic. | traceability | `checklist.md:7-13`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:545-590`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929-942` |
| F005 | `graph-metadata.json` still stores duplicate aliases for the same parser/test files (`.opencode/skill/...` and `mcp_server/...`). | maintainability | `graph-metadata.json:33-40`; `implementation-summary.md:53-57`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:717-789` |

### P2

| ID | Finding | Dimension | Evidence |
|----|---------|-----------|----------|
| None | No advisory-only finding was retained in the final registry. | — | — |

## 5. Findings by dimension

| Dimension | P0 | P1 | P2 | Findings |
|-----------|---:|---:|---:|----------|
| correctness | 0 | 1 | 0 | F001 |
| security | 0 | 0 | 0 | None confirmed |
| traceability | 0 | 3 | 0 | F002, F003, F004 |
| maintainability | 0 | 1 | 0 | F005 |

## 6. Adversarial self-check for P0

No P0 finding survived adversarial re-check. The security passes re-read both the filter gate and the existing-file resolver together and did **not** find evidence that this packet can still persist a command-like or traversal-style `key_files` value as a real file reference. The strongest issues remained documentation/metadata drift and output cleanliness, which justify P1 but not P0 severity.

## 7. Remediation order

1. **Repair canonical ancestry metadata**: regenerate or repair `description.json` so `parentChain` mirrors the current packet path under `001-search-and-routing-tuning`.
2. **Repair stale authority links**: update `plan.md` and `decision-record.md` so they point at a current research authority or explicitly drop the obsolete `../research/research.md` references.
3. **Repair checklist evidence**: rewrite `checklist.md` evidence anchors to current parser lines or to higher-stability file/section references so the checked claims stay auditable.
4. **Canonicalize `key_files` output**: normalize persisted implementation-file display paths so one file maps to one canonical key-file entry before the 20-slot cap is applied.

## 8. Verification suggestions

1. Regenerate the packet description metadata and confirm the resulting `parentChain` equals the current ancestor chain for `system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files`.
2. Update `plan.md`, `decision-record.md`, and `checklist.md`, then verify every checked claim still lands on a live authority/evidence surface.
3. Re-run the packet's existing validation commands:
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
4. Regenerate `graph-metadata.json` and confirm `derived.key_files` no longer contains both `.opencode/skill/system-spec-kit/...` and `mcp_server/...` aliases for the same file.

## 9. Appendix

### Iteration list and delta churn

| Iteration | Dimension | Delta file | newFindingsRatio | Summary |
|-----------|-----------|------------|-----------------:|---------|
| 001 | correctness | `review/deltas/iter-001.jsonl` | 0.34 | Found stale `description.json.parentChain`. |
| 002 | security | `review/deltas/iter-002.jsonl` | 0.08 | No new security finding; ruled out packet-specific exploit path. |
| 003 | traceability | `review/deltas/iter-003.jsonl` | 0.42 | Found stale plan/ADR authority links and stale checklist evidence lines. |
| 004 | maintainability | `review/deltas/iter-004.jsonl` | 0.18 | Found alias-duplicate `key_files` entries. |
| 005 | correctness | `review/deltas/iter-005.jsonl` | 0.11 | Reconfirmed F001 against canonical generator/merge contracts. |
| 006 | security | `review/deltas/iter-006.jsonl` | 0.06 | Stabilization pass; no new security issue. |
| 007 | traceability | `review/deltas/iter-007.jsonl` | 0.12 | Reconfirmed citation/evidence drift after migration. |
| 008 | maintainability | `review/deltas/iter-008.jsonl` | 0.09 | Reconfirmed alias duplication as an output-cleanliness issue. |
| 009 | correctness | `review/deltas/iter-009.jsonl` | 0.07 | Final persistence check still showed stale ancestry metadata. |
| 010 | security | `review/deltas/iter-010.jsonl` | 0.06 | Final stabilization pass; verdict unchanged. |

### Final packet state

- Config: `review/deep-review-config.json`
- Registry: `review/deep-review-findings-registry.json`
- State log: `review/deep-review-state.jsonl`
- Strategy: `review/deep-review-strategy.md`
- Dashboard: `review/deep-review-dashboard.md`
- Iterations: `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- Deltas: `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
