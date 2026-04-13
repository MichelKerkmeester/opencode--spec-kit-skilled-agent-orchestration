# Iteration 004: Maintainability of the Predicate Shape

## Focus
Reviewed the balance between regex guards, structural checks, and canonical-doc retention.

## Findings

### P0

### P1

### P2

## Ruled Out
- Canonical packet docs being dropped: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:547` still appends the packet docs after filtering.

## Dead Ends
- Maintainability concerns needed a verification-tooling pass to show operator impact.

## Recommended Next Focus
Re-run the focused Vitest suite and then move to the corpus audit.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: maintainability
- Novelty justification: The predicate remained readable and consistent with the research packet, but reproducibility questions remained open.
