# Iteration 1: Correctness contract check for derived entity bounds

## Focus
Correctness review of the packet's documented derived-field limits against the live graph-metadata implementation.

## Files Reviewed
- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`

## Findings
### P1 - Required
- **F003**: Documented 16-entity cap drifts from live parser behavior - `spec.md:30` - The packet says derived `entities` are capped at 16, but `deriveEntities()` currently returns up to 24 entries. [SOURCE: spec.md:29-30; .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:897-912]

## Ruled Out
- The reviewed parser paths did not contradict the packet's stated 12-item limits for trigger phrases, key topics, or key files during this pass.

## Dead Ends
- Re-reading the packet background alone was insufficient; the cap only became concrete once the parser return slice was checked.

## Recommended Next Focus
Rotate into security and verify that the packet root no longer surfaces command-shaped values, secrets, or unsafe derived references.

## Assessment
- Dimensions addressed: correctness
