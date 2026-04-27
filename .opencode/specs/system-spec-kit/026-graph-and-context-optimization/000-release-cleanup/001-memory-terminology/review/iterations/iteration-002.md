# Deep Review Iteration 002

## Dimension

Security, with required closure verification for P1-001 and P1-002 from iteration 1.

## Closure Verification

### P1-001 - REQ-004 headline-pattern zero-out

Status: CLOSED.

Evidence:
- The requested REQ-004 grep over `.opencode/skill/system-spec-kit/**/*.md`, `CLAUDE.md`, and `AGENTS.md` returned `total_hits=10`, `non_cognitive_hits=0`, `cognitive_hits=10`.
- The remaining hits are inside the cognitive carve-out. Sample evidence includes cognitive README prose at `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:35`, `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:39`, and `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:119`.

Classification: Pass. No regression. Do not escalate to P0.

### P1-002 - REQ-005 Anthropic/MCP Note callout

Status: CLOSED.

Evidence:
- `.opencode/skill/system-spec-kit/README.md:58` contains a `Note:` callout naming Anthropic Claude Memory and the MCP reference `memory` server.
- `.opencode/skill/system-spec-kit/mcp_server/README.md:53` contains a `Note:` callout naming Anthropic Claude Memory and the MCP reference `memory` server.

Classification: Pass. No regression. Do not escalate to P0.

## Files Reviewed

Count: 59 concrete files plus repo-wide frontmatter and markdown grep scans.

Primary evidence surfaces:
- `.opencode/skill/sk-deep-review/SKILL.md`
- `.opencode/skill/sk-deep-review/references/quick_reference.md`
- `.opencode/skill/sk-code-review/references/review_core.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-strategy.md`
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
- `.opencode/agent/context.md`
- `.claude/agents/context.md`
- `.gemini/agents/context.md`
- `.codex/agents/context.toml`
- `.opencode/command/memory/save.md`
- `.claude/commands/memory/save.md`
- `.opencode/command/memory/manage.md`
- `.claude/commands/memory/manage.md`
- 33 TypeScript files under `.opencode/skill/system-spec-kit/mcp_server/handlers/`
- 9 storage files under `.opencode/skill/system-spec-kit/mcp_server/lib/storage/` with `memory_*` SQL references

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

Classification note: the handler-glob audit found 20 unique frozen tool names in `.opencode/skill/system-spec-kit/mcp_server/handlers/*.ts`, not 21, because `memory_quick_search` is wired through the tool delegation path instead of the handler index. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:63`, `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79`, `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:81`, `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:96`, and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1028`. The public schema still preserves all 21 frozen names at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:47`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:54`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:196`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:214`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:221`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:228`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:234`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:240`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:280`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:295`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:301`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:323`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:416`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:423`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:429`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:435`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:494`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:500`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:506`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:529`, and `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:542`. This is not a rename leak and not a security finding.

## Traceability Checks

- `spec_code`: PASS. REQ-004 and REQ-005 closures now match the requested acceptance checks.
- `checklist_evidence`: PASS. Security boundary evidence was captured for frontmatter, MCP tool names, SQL table names, runtime strings, and mirror parity.
- `agent_cross_runtime`: PASS. `.opencode/agent/context.md`, `.claude/agents/context.md`, `.gemini/agents/context.md`, and `.codex/agents/context.toml` each have `spec-doc record` count `5`.
- `feature_catalog_code`: PASS. `memory_quick_search` remains documented as live and is wired through `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:63`, `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79`, `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:81`, and `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:96`.
- `frontmatter_identifier_audit`: PASS. `grep -rln '^_memory:' .opencode/specs/` returned `1950` files; renamed frontmatter search for `_spec_doc_record:` and `_indexed_continuity:` returned `0`. Sample preserved keys: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/research/research.md:14`, `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/implementation-summary.md:10`, `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/tasks.md:9`, `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/plan.md:9`, `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/spec.md:10`.
- `mcp_tool_name_audit`: PASS. All 21 frozen public tool names remain in `tool-schemas.ts`; 20 are exported via `handlers/index.ts`, and `memory_quick_search` is routed by `tools/memory-tools.ts`.
- `sql_table_name_audit`: PASS. Storage DDL/DML still references `memory_*` tables, renamed SQL reference count is `0`, and `working_memory` remains preserved at `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:46`.
- `runtime_output_string_audit`: PASS. The preserved `Memory ID` runtime strings are only the known causal-graph carve-out at `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:586` and `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:587`; non-causal capitalized handler hits count is `0`.
- `command_cross_runtime`: PASS. `.opencode/command/memory/save.md` and `.claude/commands/memory/save.md` share MD5 `ec4e91a6093646d6555c4b4fba8dc334`; `.opencode/command/memory/manage.md` and `.claude/commands/memory/manage.md` share MD5 `2a314757932dce40e3532aac201e52e8`.

## Verdict

PASS with `hasAdvisories=false`.

Both iteration-1 P1 findings verified CLOSED. No new P0, P1, or P2 findings were opened in the security pass.

## Next Dimension

Traceability, with emphasis on spec/checklist alignment and feature-catalog/code consistency after the bulk substitution wave.
