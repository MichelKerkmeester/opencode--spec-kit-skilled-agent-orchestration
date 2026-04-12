# Plan: 006-doctor-debug-overlay

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Implementation Order
1. Freeze the overlay scope to summary, guidance, and redacted evidence.
2. Reuse health hints, FTS consistency checks, dry-run results, and routing guidance already emitted by current handlers.
3. Add a compact operator-facing summary only after the evidence model is bounded.

## Integration Points
- Health hints and repair confirmation flow in `memory-crud-health.ts`.
- Save dry-run, preflight, and sufficiency summaries in `memory-save.ts`.
- Startup and routing guidance in `context-server.ts`.
- Optional helper-tool registration in `tool-schemas.ts`.

## Rollback Plan
If the overlay grows into a new repair authority or leaks raw content, keep the current verbose signals and drop the compact facade.
