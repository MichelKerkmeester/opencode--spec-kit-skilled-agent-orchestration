# Iteration 001

- Timestamp: 2026-04-14T09:35:00.000Z
- Focus dimension: correctness
- Files reviewed: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts, .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts, .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts, .opencode/skill/system-spec-kit/mcp_server/context-server.ts
- Outcome: Confirmed that the retired standalone memory surface is still live on save and indexing hot paths.

## Findings

### P0
- F001 - Legacy specs/**/memory save and indexing support remains live. The live memory_save contract still allows specs/**/memory/*.md, the parser returns true for those paths, startup indexing still scans them, and recovery hints/tests still teach the same surface. The retired standalone memory path therefore remains active on save/index hot paths. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:958-987] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1190-1199] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1260-1299] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:223-229] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:217] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1307-1349]

### P1
- None.

### P2
- None.

## Evidence Notes

- memory_save still documents specs/**/memory and .opencode/specs/**/memory as valid filePath inputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218]
- isMemoryFile returns true for markdown or text files inside /specs/.../memory/. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:958-987]
- handleMemorySave only rejects inputs when isMemoryFile returns false, so the legacy path is still accepted by the live handler. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084]
- Startup recovery and boot indexing still talk about pending memory files and call findMemoryFiles(root). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1190-1199] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1260-1299]

## State Update

- status: insight
- newInfoRatio: 0.68
- findingsSummary: P0 1, P1 0, P2 0
- findingsNew: P0 1, P1 0, P2 0
- nextFocus: Security sweep for leftover shared-memory governance or shared-space residues.
