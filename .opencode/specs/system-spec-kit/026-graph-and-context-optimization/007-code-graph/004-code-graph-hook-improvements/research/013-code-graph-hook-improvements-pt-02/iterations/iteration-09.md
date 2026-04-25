## Iteration 09

### Focus

This round was a revalidation pass. The goal was to confirm that the emerging packet findings are truly distinct from pt-01 and the closed CF set, and to rule out adjacent lanes that looked tempting but do not deserve promotion into the synthesis.

### Context Consumed

- `iterations/iteration-01.md`
- `iterations/iteration-02.md`
- `iterations/iteration-03.md`
- `iterations/iteration-04.md`
- `iterations/iteration-05.md`
- `iterations/iteration-06.md`
- `iterations/iteration-07.md`
- `iterations/iteration-08.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md`

### Findings

- The strongest new packet themes are not the pt-01 headline gaps themselves, but downstream residuals: read-path soft continuation on `full_scan`, CocoIndex seed fidelity loss, stale post-scan summary metadata, unsurfaced summary readers, startup transport/test drift, and unlabeled deadline truncation [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md:13-20; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:86-92; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:239-242].
- CF-009, CF-010, and CF-014 remain closed with respect to their original targets, so pt-02 should cite them as background and avoid restating them as open findings [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md:5-12; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md:5-13; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md:5-13].
- The packet still has enough synthesis-worthy material without reopening subtree scan scope or readiness debounce invalidation, which keeps pt-02 from duplicating pt-01's center of gravity [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md:3-4,22-28].

### Evidence

```md
### P1
- `F-002` `freshness` — The bounded inline refresh path caches readiness decisions for five seconds...
- `F-003` `correctness` — `code_graph_context` emits a second freshness story...
- `F-004` `ergonomics` — The context surface advertises bounded work but does not actually wire a live deadline...
```

```md
The manual code_graph_scan path still bypasses the staged persistence discipline used by ensure-ready,
so failed writes can mark broken files fresh and hide stale structural data.
Target Files Modified
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts` |
```

```md
Expanded the shared resolver to return the canonical packet and archive directories
so child-phase research runs have one runtime-owned artifact root.
Target Files Modified
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` |
```

### Negative Knowledge

- The subtree-root scan deletion issue remains important, but it is already thoroughly documented in pt-01 and does not need to dominate pt-02.
- The readiness debounce invalidation bug remains open, but it is better referenced as prior context than repeated as the primary pt-02 finding set.
- Artifact-root drift is no longer live evidence after CF-014; keeping it in the synthesis would overstate a closed lane.

### New Questions

- `Synthesis` — Which of the emerging findings deserve P1 vs P2 severity when grouped for implementation planning?
- `Scope Control` — Should pt-02 mention pt-01 carry-over findings only in Related Work, or briefly in Key Findings for operator continuity?
- `Implementation Handoff` — Do the recommended fixes split naturally into read-path, bridge, metadata, and startup packets?

### Status

`converging`
