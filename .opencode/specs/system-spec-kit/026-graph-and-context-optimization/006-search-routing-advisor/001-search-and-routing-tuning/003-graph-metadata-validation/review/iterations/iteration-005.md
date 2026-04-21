# Iteration 5: Correctness check for schema-enforced derived-field caps

## Focus
Correctness review of whether the packet's documented derived-field caps are actually enforced by the graph metadata schema.

## Files Reviewed
- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`

## Findings
### P1 - Required
- **F004**: Documented derived-field caps are not enforced by the schema validator - `spec.md:27` - The packet documents max sizes for `trigger_phrases`, `key_topics`, `key_files`, and `entities`, but the live `graphMetadataDerivedSchema` accepts unbounded arrays for all four fields, so oversized payloads still validate. [SOURCE: spec.md:27-30; .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36-49]

## Ruled Out
- This is not only a parser-layer issue; the validation layer itself accepts larger payloads, so the drift remains even if the current derivation logic usually keeps arrays smaller.

## Dead Ends
- The schema file does not embed the packet's documented limits anywhere, so there was no stronger contract source than the packet background itself for these caps.

## Recommended Next Focus
Rotate into security again and confirm no blocker-grade issue was hidden behind the contract-drift findings.

## Assessment
- Dimensions addressed: correctness
