## Iteration 08
### Focus
Canonical filtering and fallback coverage gaps: inspect Gate D regression tests for unverified resume/search behaviors that could hide live fallback or archived-result regressions.

### Findings
- The Gate D regression suite carries explicit TODOs for four DB-backed checks: archived memories excluded by default, preferred document-type filtering, `legacyFallbackEnabled: false` enforcement, and accurate `droppedNonCanonicalResults` counts. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:459-474`
- The same test block explains why current assertions are insufficient: the mocks return pre-constructed rows and bypass the real filtering pipeline, so the live canonical-filtering path is not actually exercised. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:459-469`
- Gate D still claims complete reader-ready proof, which means a meaningful slice of archive/legacy suppression remains documented as done but only partially verified in practice. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:101-113`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:121-124`

### New Questions
- Which of the four TODO cases is most likely to fail first on a real DB fixture?
- Should these TODOs be promoted to blocking checks for any future resume/search refactor touching canonical filtering?
- Does the live `memory_search` handler still have latent archived-row paths that the mock-based Gate D tests would miss?
- Are resume and search using the same canonical-filtering primitives, or could they drift independently?

### Status
converging
