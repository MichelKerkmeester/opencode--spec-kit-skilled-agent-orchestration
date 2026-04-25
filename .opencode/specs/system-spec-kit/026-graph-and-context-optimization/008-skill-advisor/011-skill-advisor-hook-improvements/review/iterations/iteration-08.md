## Iteration 08

### Focus
Stabilization pass on packet docs, especially whether `resource-map.md` remains a clean audit ledger.

### Files Audited
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:24-28`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:34-42`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:121-127`

### Findings
- P1 `traceability` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:36`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:116`: the resource map still misreports filesystem truth (`Missing on disk: 0`, `applied/ | Created | OK`) even after the packet tree shows no `applied/` directory, so the ledger is not reliable as an audit artifact.
- P2 `docs` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:24-28`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:121`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:127`: the file instructs authors to keep the resource map "paths-only", but it includes narrative prose and inline `NEEDS VERIFICATION` judgments, reducing machine-readability and making the ledger harder to diff cleanly.
- P2 `traceability` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/resource-map.md:122-127`: the resource map preserves two unreconciled research lineages (`014-skill-advisor-hook-improvements-pt-02` and `029-skill-advisor-hook-improvements-pt-01`) without resolving which one is canonical for packet 014.

### Evidence
```md
# resource-map.md
Keep this file **paths-only** - no narrative, no decisions, no test evidence.
- **Missing on disk**: 0
| `.opencode/.../applied/` | Created | OK | Per-task evidence reports for all 15 implementation tasks. |
| `.../029-skill-advisor-hook-improvements-pt-01/` | Cited | OK | NEEDS VERIFICATION: ... |
```

### Recommended Fix
- Make the resource map purely factual again: drop narrative judgments, reconcile the canonical research lineage, and recompute the missing-on-disk/applied rows from the actual packet tree. Target files: `resource-map.md`.

### Status
converging
