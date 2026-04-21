# Iteration 004: Maintainability metadata hygiene

## Focus
Maintainability review of the generated graph artifacts and packet metadata quality.

## Files Reviewed
- `graph-metadata.json`
- `description.json`
- `implementation-summary.md`

## Findings
### P1 - Required
None.

### P2 - Suggestion
- **F004**: `graph-metadata.json` mixes canonical repo-relative paths with broken shorthand entries in `derived.key_files` — `graph-metadata.json:33` — The same implementation and test appear once with the correct `.opencode/skill/system-spec-kit/...` prefix and again as unresolved `mcp_server/...` or `tests/...` paths, which makes downstream navigation and deduplication noisier than necessary. Supporting evidence: `graph-metadata.json:35`, `graph-metadata.json:39`.
- **F005**: `graph-metadata.json` entity extraction retains anchor markup and meaningless tokens — `graph-metadata.json:118` — Derived entities such as `a` and `Phase 1 <!-- ANCHOR:phase-1 -->` leak formatting noise into the packet graph, which lowers the signal quality of metadata-driven search surfaces. Supporting evidence: `graph-metadata.json:130`, `graph-metadata.json:136`, `graph-metadata.json:142`.

## Ruled Out
- The packet docs themselves are readable; the maintainability debt is concentrated in the generated metadata artifacts, not in `spec.md` or `plan.md`.

## Dead Ends
- Re-reading `tasks.md` did not reveal human-authored maintainability drift beyond what the generated metadata already surfaced.

## Recommended Next Focus
Return to correctness and verify whether the packet's promise that `metadata_only` targets `implementation-summary.md` is actually true at the router contract layer or only after save-handler resolution.

## Assessment
- Dimensions addressed: maintainability
- New findings ratio: 0.18
- Convergence: Continue. All four dimensions are now covered, but the loop is still discovering material evidence-bearing drift.
