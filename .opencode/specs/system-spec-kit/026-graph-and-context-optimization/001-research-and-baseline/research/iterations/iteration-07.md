## Iteration 07
### Focus
Test the archived code-graph prerequisite story against later code-graph upgrades and the new scan-scope remediation findings.

### Findings
- The archived corpus treated the canonical scan artifact, trust packaging, and graph-lane enrichment as largely future work. Since then, the code-graph upgrades packet shipped detector provenance vocabulary, bounded blast-radius traversal, explicit multi-file union mode, advisory hot-file breadcrumbs, and additive edge-evidence enrichment. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/research.md:32-34`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/implementation-summary.md:44-62`
- The same packet also documents that lexical fallback cascades, clustering, and export work remain deferred, so old P2 and P3 graph work was not erased; it was narrowed and sequenced. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/implementation-summary.md:82-86`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/implementation-summary.md:107-109`
- A newer scan-scope packet then shipped stale highlights, default excludes, `.gitignore` honoring, and scan-scope logging, but its own deep-research metadata captures two P0 bugs: `indexFiles()` ignored the caller's incremental flag and `capturesToNodes()` emitted duplicate symbol IDs, yielding a 33-file regression instead of the expected ~1425 files. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md:15-18`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md:60-65`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md:101-107`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md:115-117`
- The result is a major state change: the graph artifact gap is no longer "no package," but "package shipped with unresolved full-scan correctness and recovery work." Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/implementation-summary.md:61-64`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md:15-18`

### New Questions
- Should the master packet now treat code-graph scan correctness as a blocker above additional enrichment work?
- Which archived graph recommendations are now closed enough to remove from the hidden-prerequisite ledger?
- How much of the current scan instability is isolated to operator-driven full scans versus all graph consumers?

### Status
new-territory
