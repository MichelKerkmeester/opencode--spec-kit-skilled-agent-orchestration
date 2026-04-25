## Iteration 06

### Focus

Packet-local evidence integrity: whether the claimed `applied/T-*.md` reports actually exist for downstream review tooling.

### Files Audited

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:20-32`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/checklist.md:34-106`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:94-115`

### Findings

- `[P1][docs] .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:25-29 names `applied/T-014.md` as a key packet file, but the packet tree at this path contains no `applied/` directory.`
- `[P1][verification] .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/checklist.md:36-51 marks every task complete using `applied/T-*.md` evidence links that are not present on disk, so the checklist cannot be independently replayed from the packet contents.`
- `[P1][ledger-integrity] .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:100-115 records those same `applied/T-*.md` paths as `Created | OK`, which makes the packet's canonical file ledger inaccurate for downstream consumers.`

### Evidence

```md
- "applied/T-014.md"

- [x] [P1] T014 targeted Vitest regression suites passed. [Evidence: applied/T-014.md]

| `.opencode/specs/.../applied/T-014.md` | Created | OK | Applied evidence for targeted Vitest execution. |
```

### Recommended Fix

- Restore the missing `applied/T-*.md` reports into the packet, or replace every checklist/resource-map/implementation-summary reference with evidence that is actually present in this packet checkout.
Target files:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/checklist.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md`

### Status

new-territory
