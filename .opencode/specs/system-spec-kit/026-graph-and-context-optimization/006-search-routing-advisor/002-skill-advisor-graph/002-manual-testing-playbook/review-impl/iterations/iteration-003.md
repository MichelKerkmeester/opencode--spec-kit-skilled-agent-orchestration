# Iteration 003 - Robustness

## Scope

Focused on freshness and rebuild logic around the relocated skill-advisor package.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

Verification:
- Vitest run 003 passed: 8 files, 54 tests.

## Findings

### IMPL-F003 - P1 Robustness - Freshness probe does not fingerprint nested skill-advisor graph metadata

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:103` lists required advisor scripts but not nested `graph-metadata.json`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:156` scans only top-level skill slugs under `.opencode/skill`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:163` probes each top-level skill's `graph-metadata.json`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:180` adds required script probes.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:82` explicitly adds nested skill-advisor metadata.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:89` includes the nested metadata as `skill-advisor`.

Why this matters:
The compiler treats nested skill-advisor graph metadata as a routing source, but the freshness probe does not include it in the source signature or max mtime. A metadata-only skill-advisor graph edit can leave `advisor_status` reporting `live` even when the graph needs regeneration.

## Delta

New findings: 1 P1.
No P0 findings.
