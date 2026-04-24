# Deep Research Dashboard — 013-code-graph-hook-improvements-pt-02

- Status: `max_iterations`
- Iterations: `10/10`
- Last Focus: `Final convergence check, duplicate collapse, and synthesis-ready recommendation shaping`
- Convergence Threshold: `0.05`
- Stop Reason: `max_iterations`
- Final Findings: `6 total`
- Severity Split: `P0: 0`, `P1: 3`, `P2: 3`
- Canonical Outputs:
  - `research.md`
  - `findings-registry.json`
  - `deep-research-state.jsonl`

## Iteration Timeline

| Iteration | Status | newInfoRatio | Focus | Cumulative Findings |
|---|---|---:|---|---:|
| 01 | `new-territory` | 0.92 | Prior packet, charter, and closure re-anchor | 0 |
| 02 | `new-territory` | 0.76 | Read-path gating when full scans are suppressed | 1 |
| 03 | `new-territory` | 0.68 | CocoIndex seed fidelity and graph bridge loss | 2 |
| 04 | `converging` | 0.53 | Scan metadata persistence and stale summary risk | 3 |
| 05 | `converging` | 0.41 | Summary readers and operator surfaces | 4 |
| 06 | `converging` | 0.31 | Startup builder-to-runtime transport | 5 |
| 07 | `converging` | 0.21 | Deadline and truncation ergonomics | 6 |
| 08 | `converging` | 0.14 | Docs/runtime drift and operator ergonomics | 6 |
| 09 | `converging` | 0.08 | Revalidation against pt-01 and closed CF set | 6 |
| 10 | `converging` | 0.04 | Final convergence and recommendation shaping | 6 |

## Final Finding Index

- `F-001` `P1` `correctness` — Query/context read paths keep executing when `full_scan` is required but suppressed.
- `F-002` `P1` `correctness` — CocoIndex seeds lose ranking/snippet/range fidelity before graph resolution.
- `F-003` `P1` `freshness` — `graphEdgeEnrichmentSummary` can stay stale because null summaries do not clear persisted metadata.
- `F-004` `P2` `observability` — Persisted detector/enrichment summaries remain write-only for production operators.
- `F-005` `P2` `cross-runtime` — Startup structured payloads stop at the builder layer and adapter tests guard text only.
- `F-006` `P2` `ergonomics` — Deadline/truncation behavior is partial and unlabeled on `code_graph_context`.

## Iteration Files

- `iterations/iteration-01.md`
- `iterations/iteration-02.md`
- `iterations/iteration-03.md`
- `iterations/iteration-04.md`
- `iterations/iteration-05.md`
- `iterations/iteration-06.md`
- `iterations/iteration-07.md`
- `iterations/iteration-08.md`
- `iterations/iteration-09.md`
- `iterations/iteration-10.md`
