# Deep Review Report - Fix Status Derivation Packet

## Executive summary
**Verdict:** CONDITIONAL  
**Severity counts:** P0: 0, P1: 5, P2: 2  
**hasAdvisories:** true  

The packet does not contain a blocker-class implementation defect, but it is not clean enough to ship as a trustworthy packet artifact set. The loop finished at the 10-iteration ceiling with five active P1 findings concentrated in machine-readable identity drift and broken packet-local traceability.

## Scope
Reviewed packet: `system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation`.

Reviewed packet-local docs and metadata:
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed linked implementation/contract surfaces:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skill/system-spec-kit/templates/level_2/tasks.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts`

## Method
1. Initialized a local review packet under `review/` and rotated the review dimension order as requested: correctness -> security -> traceability -> maintainability.
2. Re-read packet-local docs/metadata on each pass, then cross-checked claims against the live generator/parser/task-routing contracts.
3. Logged per-iteration findings, cumulative severity counts, and delta churn in `iterations/` and `deltas/`.
4. Stopped at the explicit 10-iteration ceiling because late traceability findings kept the run above the requested convergence threshold.

## Findings by severity

### P0
| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| None | - | No P0 findings were confirmed. | - |

### P1
| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F001 | correctness | `description.json.parentChain` still advertises `010-search-and-routing-tuning` after the packet moved to `001-search-and-routing-tuning`, so machine-readable ancestry is wrong. | `description.json:14-20`; `generate-description.ts:75-89`; `memory-parser.ts:544-566` |
| F003 | traceability | Core rationale still cites `../research/research.md`, but that artifact is absent under the parent packet. | `plan.md:13-16`; `decision-record.md:7-10`; `checklist.md:8-12` |
| F004 | traceability | Packet evidence still points reviewers at `graph-metadata-parser.ts:498-510`, while the live fallback branch now lives at `969-1014`. | `spec.md:18-19`; `plan.md:13-14`; `checklist.md:7-8`; `graph-metadata-parser.ts:969-1014` |
| F005 | traceability | `tasks.md` uses `T-01` / `T-V1`, but the canonical routed update path only matches `T###` / `CHK-###`. | `tasks.md:6-14`; `templates/level_2/tasks.md:45-55`; `memory-save.ts:1282-1285`; `anchor-merge-operation.ts:562-564` |
| F006 | maintainability | `spec.md` under-documents the delivered verification surface by omitting the regression-test file that the packet’s own summary and graph metadata include. | `spec.md:16-19`; `implementation-summary.md:63-70`; `graph-metadata.json:33-43` |

### P2
| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F002 | security | Derived graph metadata publishes broader root-scoped repository paths than the packet needs for its own review surface. | `graph-metadata.json:33-61` |
| F007 | maintainability | `graph-metadata.json` duplicates the parser/test file pair under two path spellings, increasing normalization cost for downstream consumers. | `graph-metadata.json:33-43` |

## Findings by dimension
| Dimension | Findings | Summary |
|---|---:|---|
| correctness | 1 P1 | Machine-readable packet identity drift remains unresolved after migration. |
| security | 1 P2 | No blocker-class security issue, but metadata exposure is broader than necessary. |
| traceability | 3 P1 | Missing rationale artifact, stale line anchors, and non-canonical task IDs break core packet traceability. |
| maintainability | 1 P1, 1 P2 | The packet under-documents its true verification surface and keeps duplicate derived path spellings. |

## Adversarial self-check for P0
No P0 findings were recorded. The final adversarial pass re-checked the strongest candidates (machine-readable ancestry drift and missing research link) and kept them at P1 because they materially damage packet fidelity and reviewability but do not show a blocker-class correctness or security break in the shipped implementation itself.

## Remediation order
1. **Regenerate packet metadata** so `description.json.parentChain` matches the live `001-search-and-routing-tuning` path.
2. **Repair packet-local evidence links** by restoring or replacing the missing `../research/research.md` reference targets and refreshing stale line anchors to the current parser lines.
3. **Normalize task/checklist IDs** to canonical `T###` / `CHK-###` forms so routed task updates can target this packet.
4. **Align packet scope summaries** so `spec.md` lists the same implementation/test verification surface already recorded in `implementation-summary.md` and `graph-metadata.json`.
5. **Collapse duplicate key-file spellings** inside `graph-metadata.json` so downstream graph consumers do not ingest redundant logical files.

## Verification suggestions
- Re-run the description generator for this packet and confirm `parentChain` mirrors the live folder path segments.
- Rebuild packet-local citations so every doc reference resolves to an existing file and current line range.
- Normalize `tasks.md` to canonical task/checklist IDs and verify the routed merge/update regex can match them.
- Refresh `graph-metadata.json` after the doc repairs and confirm only one spelling remains for each logical key file.
- Re-run a focused deep review or packet validation pass after the fixes to confirm both core traceability protocols move from `fail` to `pass`.

## Appendix

### Iteration list
| Iteration | Dimension | Status | New findings | Ratio | Decision |
|---|---|---|---:|---:|---|
| 001 | correctness | complete | 1 | 0.55 | continue |
| 002 | security | complete | 1 | 0.12 | continue |
| 003 | traceability | complete | 1 | 0.34 | continue |
| 004 | maintainability | complete | 1 | 0.18 | continue |
| 005 | correctness | insight | 0 | 0.11 | continue |
| 006 | security | insight | 0 | 0.10 | continue |
| 007 | traceability | complete | 1 | 0.16 | continue |
| 008 | maintainability | insight | 0 | 0.10 | continue |
| 009 | correctness | insight | 0 | 0.10 | continue |
| 010 | traceability | complete | 2 | 0.22 | stop:maxIterationsReached |

### Delta churn
- `iter-001.jsonl`: initial correctness issue discovered
- `iter-002.jsonl`: security advisory opened
- `iter-003.jsonl`: missing research-link traceability issue opened
- `iter-004.jsonl`: scope-summary maintainability issue opened
- `iter-005.jsonl`: correctness evidence strengthened
- `iter-006.jsonl`: security evidence strengthened
- `iter-007.jsonl`: stale line-anchor traceability issue opened
- `iter-008.jsonl`: maintainability evidence strengthened
- `iter-009.jsonl`: correctness evidence strengthened
- `iter-010.jsonl`: task-ID and duplicate-path findings opened; run stopped at max iterations
