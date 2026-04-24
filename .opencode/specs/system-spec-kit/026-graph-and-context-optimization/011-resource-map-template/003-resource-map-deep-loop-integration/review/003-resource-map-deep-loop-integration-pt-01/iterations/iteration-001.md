# Iteration 001: correctness - extractor evidence normalization

## Dispatcher
- Dimension: correctness
- Focus: shared extractor path normalization against the review delta contract
- Scope slice: extractor, extractor README, focused Vitest coverage, review prompt-pack contract

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`
- `.opencode/skill/system-spec-kit/scripts/resource-map/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts`
- `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`

## Findings - New

### P0 Findings
- None.

### P1 Findings
- **F001**: Review extractor does not normalize canonical `file:line` evidence before classification and status checks — `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:397` — `normalizePathCandidate()` preserves a trailing `:line`, so `determineStatus()` checks a nonexistent path and the emitted review map can mark a real file as missing when fed the documented review delta shape.
  - Rationale: the review prompt-pack's canonical delta example uses `file":"path:line"`, but the extractor only normalizes slash and traversal state.
  - Evidence:
    - `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:397-418` returns the path string unchanged apart from slash/traversal cleanup.
    - `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:456-460` resolves the whole string against the repo root and returns `MISSING` when the line suffix remains.
    - `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:77-82` documents review finding delta rows as `{"type":"finding",...,"file":"path:line",...}`.
  - Recommendation: strip `:line` / `:line-range` suffixes during review-path normalization, or prefer a dedicated `line` field before calling `determineStatus()` and `classifyPath()`.

### P2 Findings
- None.

## Findings Closed
- None.

## Traceability Checks
- `spec_code`: partial - extractor implementation diverges from the documented review delta example for finding file anchors.
- `checklist_evidence`: pass - the focused test file and README document the current path-only expectations.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` correctly scopes the extractor to repo paths and deterministic degradation behavior.
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` emits the resource map through the shared extractor rather than duplicating path logic.

## Assessment
- Verdict: CONDITIONAL
- Coverage delta: correctness reviewed across the shared extractor and its direct tests.
- Convergence signal: newFindingsRatio=0.56; correctness still active because the core review evidence contract is not fully honored.
- Dimensions addressed: correctness

## Next Focus
Security pass on the reducer emit path, YAML synthesis commands, and extractor runtime behavior to confirm there is no shell/network or unsafe path handling regression.
