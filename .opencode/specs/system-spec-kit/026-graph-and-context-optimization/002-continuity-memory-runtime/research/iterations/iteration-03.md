## Iteration 03
### Focus
Gate D fallback semantics: re-read Gate D docs and the live resume-mode handler/tests to see whether archived and legacy fallback behavior still exists or only survives in packet prose.

### Findings
- Gate D still specifies a four-level `resumeLadder` with archived fallback and D0 archived safety thresholds, so the packet prose assumes archived rescue is part of the live reader design. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:70-72`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:103-104`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:144-150`
- The shipped resume-mode handler hardcodes `levels` to `handover`, `continuity`, and `spec_docs`, and explicitly sets both `legacyMemoryFallback` and `archivedTierEnabled` to `false`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:887-916`
- The tests reinforce the runtime behavior: Gate D resume assertions require `archivedTierEnabled` to be `false`, and bootstrap messaging is not allowed to mention `archived` or `legacy`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:148-155`, `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts:83-91`

### New Questions
- Should Gate D docs be narrowed to the shipped three-level ladder, or is the runtime missing an archived fallback stage that was never completed?
- Which packet currently owns the D0 archived observation language if Gate D no longer implements it?
- Are any monitoring, dashboards, or runbooks still looking for archived-tier signals that the runtime now suppresses?
- Does the broader `session_resume` surface inherit the same no-archive contract everywhere, or only through Gate D resume mode?

### Status
new-territory
