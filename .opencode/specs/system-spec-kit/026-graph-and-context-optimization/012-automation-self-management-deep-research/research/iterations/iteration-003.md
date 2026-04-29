# Iteration 003 - system-spec-kit Validation, Context Generation, Indexing

## Focus
Strategy focus: system-spec-kit validator, `generate-context.js`, phase-parent detection, metadata generation, and auto-indexing for RQ3 (`research/deep-research-strategy.md:25`).

## Sources Read
- `CLAUDE.md:145`, `CLAUDE.md:227-232`, `CLAUDE.md:276` - save context and metadata claims.
- `.opencode/skill/system-spec-kit/SKILL.md:828-845` - completion and validation rules.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:14-18`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-130`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:669-786` - validator entry and strict checks.
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh:330-339`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:352-356`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:948-989`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:1184-1195` - graph metadata and description generation.
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:58-92`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:404-446`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:481-590` - canonical save CLI and phase-parent pointer refresh.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1320-1374` - MCP server startup scan.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2032-2090` - ingest recovery and optional watcher.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-355` - file watcher default false.

## Findings

| ID | Severity | Claim | Actual behavior | Gap class | Recommended action |
|----|----------|-------|-----------------|-----------|--------------------|
| F3.1 | P1 | Spec validation runs automatically. | `validate.sh` is a script entry point; strict mode adds continuity freshness and evidence marker lint. It can be skipped with `SPECKIT_SKIP_VALIDATION`. Sources: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:14-18`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-130`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:669-786`. | Manual | Document as command/skill-owned gate, not ambient daemon. |
| F3.2 | P1 | Strict validation covers freshness and evidence automatically. | Those checks run automatically inside `validate.sh --strict`, but only after an operator or workflow invokes the validator. Source: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:781-786`. | Half | Keep the strict-mode behavior description. |
| F3.3 | P1 | New spec folders get graph metadata automatically. | `create.sh` calls `create_graph_metadata_file` when it creates child or subfolders, and that helper writes `graph-metadata.json` if absent. Sources: `.opencode/skill/system-spec-kit/scripts/spec/create.sh:330-339`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:352-356`. | Auto | Keep for `create.sh`-created packets. |
| F3.4 | P1 | New spec folders get `description.json` automatically. | `create.sh` invokes `generate-description.js` for parent, child, and normal folders when the script exists; failures are non-fatal warnings. Sources: `.opencode/skill/system-spec-kit/scripts/spec/create.sh:948-989`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:1184-1195`. | Auto | Keep, but mention non-fatal generation failures. |
| F3.5 | P1 | `/memory:save` fully applies canonical saves by default. | `generate-context.ts` defaults to planner-first `plan-only`; `--full-auto` is the explicit mutation-first shortcut. Sources: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:58-92`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:531-590`. | Half | Document default plan-only semantics prominently. |
| F3.6 | P1 | `generate-context.js` refreshes graph metadata. | The help says canonical saves refresh root `graph-metadata.json`, and the code updates phase-parent pointers after save. Sources: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:80-85`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:404-446`. | Half | Keep, scoped to canonical save invocation. |
| F3.7 | P1 | Spec docs get indexed automatically for search. | The MCP server performs a startup scan over spec documents and constitutional memories and runs post-mutation hooks when indexed or updated. Source: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1320-1374`. | Auto | Keep, scoped to MCP server startup. |
| F3.8 | P1 | Real-time spec-doc indexing is always on. | The file watcher starts only when `isFileWatcherEnabled()` is true; the flag defaults false and requires `SPECKIT_FILE_WATCHER=true`. Sources: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047-2090`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-355`. | Half | Fix docs that imply always-on watching. |
| F3.9 | P2 | Phase-parent active-child pointer is ambiently maintained. | The pointer update is inside `generate-context.ts` after save, not a background watcher. Source: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:428-446`. | Half | Keep as save-time automation. |

## New Info Ratio
0.68. This iteration clarified that spec-doc automation mostly hangs off command invocation and MCP server startup.

## Open Questions Carried Forward
- Should strict validation be auto-run by command workflows only, or should hooks enforce it before completion claims?
- Should file watcher docs be reduced to "opt-in" globally?

## Convergence Signal
continue. RQ3 is answered enough for synthesis.

