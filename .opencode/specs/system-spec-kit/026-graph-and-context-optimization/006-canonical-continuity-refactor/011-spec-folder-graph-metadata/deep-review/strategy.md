# Deep Review Strategy

## Scope

- Packet: `011-spec-folder-graph-metadata`
- Assigned iterations: `3-6`
- Focus: schema/parser correctness, save-path refresh, discovery/index integration, backfill coverage, targeted test coverage

## Iteration Plan

3. Re-read `graph-metadata-schema.ts` and `graph-metadata-parser.ts` to confirm the v1 contract, merge semantics, and edge-case handling.
4. Verify the canonical save path refreshes `graph-metadata.json`, discovery finds the files, and packet indexing uses the new document type.
5. Validate repo-wide backfill coverage and spot-check five random `graph-metadata.json` files for structural correctness.
6. Re-run the four graph-metadata tests and confirm they cover schema, integration, refresh, and backfill flows.

## Findings Summary

- Iterations 3, 4, and 6 verified the shipped implementation without requiring code changes.
- Iteration 5 found packet-doc drift: the rollout packet still stated that the live filesystem count was `515`, but the current repo count is `516` after a later packet gained its own `graph-metadata.json`. The packet summary was updated to separate rollout-time coverage from current-state counting.

## Verification Notes

- The live review count under `.opencode/specs` is `516` `graph-metadata.json` files.
- Five random `graph-metadata.json` files were spot-checked and all matched the expected `schema_version`, `manual`, and `derived` structure.
