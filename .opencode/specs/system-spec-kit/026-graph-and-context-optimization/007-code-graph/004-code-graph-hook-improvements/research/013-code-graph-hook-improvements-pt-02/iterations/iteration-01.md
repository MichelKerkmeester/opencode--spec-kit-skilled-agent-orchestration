## Iteration 01

### Focus

This round re-anchored the packet on the parent charter, pt-01 synthesis, and the already-applied closure notes. The goal was to mark which lanes were already closed, which lanes were still open but only at a high level in pt-01, and where deeper evidence would most likely produce packet-worthy net-new findings.

### Context Consumed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md`

### Findings

- Pt-01 already narrowed the unresolved field to subtree scan scope, readiness caching, context freshness/provenance drift, latent deadline handling, and startup transport loss, so this packet should deepen those lanes or find new downstream residuals rather than re-surveying the whole subsystem [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md:3-4,13-20].
- The parent packet explicitly kept scan/read/readiness paths, the CocoIndex bridge, session-prime startup wiring, and operator-facing status/docs in scope, which legitimizes deeper work in those exact surfaces [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/spec.md:54-74].
- CF-009, CF-010, and CF-014 already closed staged persistence, query trust mapping, and artifact-root drift, so new work should look for residual metadata, transport, or read-path gaps downstream of those fixes rather than reopening the fixes themselves [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md:5-12; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md:5-13; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md:5-13].

### Evidence

```md
Ten focused iterations found one high-severity correctness gap and five follow-on P1/P2 gaps
that sit outside the already-closed CF-002/CF-009/CF-010/CF-014 lanes.
The clearest risk is that `code_graph_scan(rootDir=...)` can narrow the graph to a subtree
and then delete out-of-scope rows while status/startup surfaces still present the remaining graph as healthy.
```

```md
1. What correctness, freshness, scalability, or ergonomic gaps still exist in the code-graph scan, read, and readiness paths?
3. Which code-graph tools, events, or signals are under-used by downstream consumers (memory search, CocoIndex bridge, session bootstrap)?
5. Which cross-runtime hook surfaces would benefit from code-graph-aware enrichment that isn't present today?
```

```md
The manual code_graph_scan path still bypasses the staged persistence discipline used by ensure-ready,
so failed writes can mark broken files fresh and hide stale structural data.
Target Files Modified
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` |
```

### Negative Knowledge

- The child-phase artifact-root split is already addressed by CF-014, so packet-local artifact placement is not a live gap for pt-02.
- The staged-persistence flaw itself is closed by CF-009; the interesting follow-up is whether post-scan metadata now drifts independently of the staged write path.
- Query trust mapping is no longer the broadest weak point after CF-010; the remaining work is surface-specific contract leakage.

### New Questions

- `Correctness` — Do query/context read paths still continue after `ensureCodeGraphReady()` returns `action: "full_scan"` with `inlineIndexPerformed: false`?
- `Bridge Fidelity` — Does the CocoIndex seed bridge preserve `score`, `snippet`, and range fidelity, or does it collapse to a line-only lookup?
- `Observability` — Are scan-time summaries actually consumable anywhere outside the scan response itself?
- `Cross-Runtime` — Does `buildStartupBrief().sharedPayload` survive any runtime adapter boundary?

### Status

`new-territory`
