# Iteration 004: Change Safety, Detect Changes, Impact, and Rename

## Focus

Assess GitNexus pre-edit and post-edit safety mechanics and determine what Public should adapt or reject.

## Actions Taken

- Reviewed GitNexus `detect_changes`, `rename`, and `impact` tool contracts.
- Folded sidecar findings about `git diff` scope and rename application behavior.
- Compared findings against Public's verification and Code Graph readiness needs.

## Findings

- GitNexus `detect_changes` maps git diff hunks to indexed symbols and affected execution flows, making it a strong model for post-edit impact verification. [SOURCE: external/gitnexus/src/mcp/tools.ts:221]
- Sidecar evidence found that `detect_changes` shells to `git diff`, so untracked files are outside the obvious path and Public should add explicit untracked/new-file handling. [SOURCE: external/gitnexus/src/mcp/local/local-backend.ts:1970]
- GitNexus `rename` advertises graph-found and text-search-found edits with different confidence classes. [SOURCE: external/gitnexus/src/mcp/tools.ts:251]
- Sidecar evidence found a safety caveat: non-dry-run rename applies a whole-file word-boundary regex replacement, so Public should adapt preview concepts but reject whole-file application behavior. [SOURCE: external/gitnexus/src/mcp/local/local-backend.ts:2313]
- GitNexus `impact` depth semantics are valuable for agent preflight: d=1 direct breakage, d=2 likely affected, d=3 transitive testing candidates. [SOURCE: external/gitnexus/src/mcp/tools.ts:299]

## Questions Answered

- Partially answered: Impact and detect-changes are high-value adaptations; rename should be adapted only with stricter range-based application.

## Questions Remaining

- Whether Public's first safety packet should implement `detect_changes` first or impact traversal first.

## Ruled Out

- Copy GitNexus rename application behavior directly; Public should preserve exact preview ranges and require post-change detection.

## Dead Ends

- Using text-search-only rename as a graph feature; it weakens the trust story unless clearly labeled as low confidence.

## Sources Consulted

- external/gitnexus/src/mcp/tools.ts:221
- external/gitnexus/src/mcp/tools.ts:251
- external/gitnexus/src/mcp/tools.ts:299
- external/gitnexus/src/mcp/local/local-backend.ts:1970
- external/gitnexus/src/mcp/local/local-backend.ts:2313

## Reflection

- What worked and why: The sidecar safety review found concrete implementation caveats that README-level research would miss.
- What did not work and why: Treating rename as a direct adoption candidate failed under source inspection.
- What I would do differently: For implementation, start with dry-run-only impact plans.

## Recommended Next Focus

Research route, API, shape, and tool graph surfaces.
