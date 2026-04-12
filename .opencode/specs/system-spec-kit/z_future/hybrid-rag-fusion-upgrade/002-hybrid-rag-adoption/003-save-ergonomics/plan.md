# Plan: 003-save-ergonomics

## Affected Files
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Implementation Order
1. Freeze the wrapper contract around `--json`, `--stdin`, or a JSON temp file.
2. Preserve explicit-target precedence and preflight visibility.
3. Add operator guidance around dry-run, validation, and failure recovery.

## Integration Points
- CLI parsing and target resolution in `generate-context.js` and `generate-context.ts`.
- Save preflight and dry-run behavior in `memory-save.ts`.
- Any future helper-tool surfacing through `tool-schemas.ts`.

## Rollback Plan
If ergonomics require bypassing structured JSON input or explicit-target precedence, keep the current save flow unchanged and move the wrapper idea to the prototype backlog.
