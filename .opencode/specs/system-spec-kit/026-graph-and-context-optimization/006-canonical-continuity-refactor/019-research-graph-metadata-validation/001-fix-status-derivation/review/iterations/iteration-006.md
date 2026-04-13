# Iteration 006: Normalization Follow-Up on Explicit Statuses

## Focus
Traced the three residual mixed-case status buckets back through the parser and schema.

## Findings

### P0

### P1

### P2
- **F001**: Explicit status passthrough leaves non-canonical buckets in the active corpus — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:587` — `deriveStatus()` returns the first ranked frontmatter status verbatim, so values like `"Complete"`, `"In Progress"`, and `"completed"` survive backfill and still appear as separate buckets in active packet metadata.

## Ruled Out
- Stale graph files as the only cause: the source packet docs still carry the mixed-case status spellings that the parser preserves.

## Dead Ends
- This issue does not invalidate the new fallback logic; it is limited to normalization and reporting consistency.

## Recommended Next Focus
Run a skeptic pass on the new finding, then re-check the focused Vitest coverage for adjacent regressions.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: This was the first pass that tied the residual corpus anomaly to a concrete parser branch and live examples.
