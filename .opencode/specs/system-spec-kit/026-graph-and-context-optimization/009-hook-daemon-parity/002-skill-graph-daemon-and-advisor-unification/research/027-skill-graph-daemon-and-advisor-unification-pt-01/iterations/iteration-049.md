# Iteration 049 — Follow-up Track F: F5 — z_archive and z_future treatment

## Question
z_archive/ + z_future/ treatment — indexed for search but not for routing? Or excluded entirely?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:36-42` → The lifecycle gap is specifically that archived material can pollute derived-trigger corpus stats unless the system defines explicit treatment for old, superseded, and archived trees.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:115-117` → F5 is explicitly the decision about whether `z_archive/` and `z_future/` should stay indexed for search, stay out of routing, or be excluded entirely.
- `AGENTS.md:269` → The repo-level spec-folder contract says graph-metadata backfill is inclusive by default and only skips `z_archive/` and `z_future/` when `--active-only` is chosen intentionally.
- `.opencode/skill/system-spec-kit/SKILL.md:546-547` → The system-spec-kit skill repeats that manual graph-metadata repair should refresh all packet folders, including `z_archive/` and `z_future/`, unless `--active-only` is requested.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:4-9,24,111-121` → The live backfill implementation encodes that policy: default traversal includes both trees, while `activeOnly` drops paths matching either `z_archive` or `z_future`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:26-28,56-57,68-77` → Default spec-document discovery excludes `z_archive` at directory-walk time along with scratch/memory/iterations, so archived packets are already removed from the main spec-doc indexing path.
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:26-35,37-44,67-91,130-143` → Path classification excludes `/z_archive/` for spec documents but does **not** exclude `/z_future/`; graph-metadata classification excludes neither tree, so future packets remain eligible for document and graph-metadata discovery while archived packets do not.
- `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:278-279` → The current test suite asserts that `spec.md` inside `/z_archive/` must be rejected from spec-doc indexing.
- `.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:33-41,93-123,288-330` → Default folder scoring treats `z_archive` as archived, applies a 0.1 multiplier, and skips archived folders unless `includeArchived` is true; there is no corresponding `z_future` archive pattern.

## Analysis
The repo already rules out the "exclude entirely" option. Both the operator docs and the live graph-metadata backfill script deliberately keep `z_archive/` and `z_future/` inside the structural maintenance corpus by default, and only suppress them when an explicit `--active-only` mode is requested. That means the current architecture values lineage, repairability, and graph completeness enough to keep non-active trees materialized rather than pretending they do not exist. `AGENTS.md:269`, `.opencode/skill/system-spec-kit/SKILL.md:546-547`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:4-9,24,111-121`

The asymmetry appears in discovery and ranking. Archived packets are already treated as non-default material: spec-doc discovery skips `z_archive`, tests enforce that exclusion, and folder scoring hard-demotes or omits archived folders unless the caller explicitly asks for them. But `z_future` does **not** receive the same suppression; the path-classification layer does not exclude it, and the archive heuristics do not mark it archived. So the repo today effectively says "future work is discoverable like live work, archive is not" even though `activeOnly` already groups both trees together as non-active. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:26-28,56-57,68-77`, `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:26-35,37-44,67-91,130-143`, `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:278-279`, `.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:33-41,93-123,288-330`

For F5, the least disruptive adopt-now answer is to formalize a split between **indexability** and **default routing eligibility**. Keep both `z_archive` and `z_future` indexed structurally so search, lineage, migration, and operator repair flows can still see them. But treat both as non-active for default advisor/routing and corpus-stat lanes: `z_archive` stays behind the existing archived/includeArchived gates, while `z_future` gets a parallel "planned/not-yet-routable" suppression until promotion out of `z_future`. That closes the current inconsistency, preserves discoverability, and directly addresses the pollution risk that motivated Track F without throwing away useful historical or planned context. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:36-42,115-117`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:111-121`, `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:26-35,37-44,67-91`, `.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:288-330`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Keep `z_archive` and `z_future` indexed for structural/search purposes, but exclude both from default routing and corpus-stat generation. `z_archive` should remain explicitly archived, while `z_future` should be searchable/plannable but non-routable until promoted into the active tree.

## Dependencies
A5, B6, C2, F1, F2, F3, F4

## Open follow-ups
- Decide whether `z_future` needs its own explicit status lane (`planned`, `future`, or similar) rather than being implicitly inferred from path.
- Split the current `--active-only` semantics into clearer operator controls if future implementations need `includeFuture` without `includeArchive`.
- Align F2 supersession policy with F5 path policy so a superseded active packet and a path-archived packet do not compete for the same routing semantics.

## Metrics
- newInfoRatio: 0.46
- dimensions_advanced: [F]
