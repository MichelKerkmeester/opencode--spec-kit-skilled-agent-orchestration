# Iteration 3: Validator Auto-Fire Surface

## Status
insight

## Focus
Validator auto-fire surface (validate.sh PostToolUse, generate-context.js auto-trigger conditions)

## Sources read
- specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-001.md:34 - prior graph automation map; deep-loop graph convergence is YAML-driven, not a general hook.
- specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-002.md:31 - prior CCC/eval map; CCC/eval/ablation are manual slash/MCP surfaces.
- .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87 - validator usage and exit-code contract.
- .opencode/skill/system-spec-kit/scripts/spec/validate.sh:112 - argument parsing for `--strict`; this is a CLI entrypoint, not a hook handler.
- .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:58 - context-save CLI help: creates saved context, indexes into Spec Kit Memory, refreshes graph metadata.
- .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:481 - structured input parsing requires JSON/stdin payload with target spec folder.
- .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:24 - compiled context-save CLI help mirrors the TypeScript source.
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1338 - canonical save updates `description.json`.
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1421 - canonical save refreshes `graph-metadata.json`.
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1498 - canonical save Step 11.5 auto-indexes touched canonical spec docs and graph metadata.
- .opencode/command/memory/save.md:120 - `/memory:save` command contract: trigger phrases and generate-context script.
- .opencode/command/memory/save.md:341 - `/memory:save` runs generate-context and refreshes metadata/indexes as command work.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2681 - MCP `memory_save` validates, indexes, and persists one memory file.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2737 - `memory_save` only indexes canonical spec docs or constitutional memory files.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3060 - `memory_save` indexes the parsed memory file.
- .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:103 - `reindexSpecDocs` calls `memory_index_scan` with `includeSpecDocs:true`, incremental mode.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:105 - spec-doc discovery list for indexing.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:247 - memory index scan collects constitutional files, spec docs, and graph metadata files.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1294 - MCP startup scan runs on server startup.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1305 - startup scan discovers constitutional and spec documents.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1343 - startup scan indexes each discovered file.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047 - optional file watcher reindexes changed markdown files.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:2116 - startup scan is scheduled with `setImmediate`.
- .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:350 - real-time file watcher is disabled unless `SPECKIT_FILE_WATCHER=true`.
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:330 - `SPECKIT_FILE_WATCHER` default is false.
- .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:271 - watcher only processes markdown changes.
- .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:377 - watcher calls reindex, not validation.
- .claude/settings.local.json:24 - Claude runtime hooks configured: UserPromptSubmit, PreCompact, SessionStart, Stop.
- .claude/settings.local.json:61 - Claude Stop hook invokes compiled `session-stop.js`.
- .claude/settings.json:1 - Claude shared settings contain env/statusLine only, no hook config.
- .codex/settings.json:1 - Codex runtime hooks configured: SessionStart, UserPromptSubmit, PreToolUse.
- .codex/settings.json:25 - Codex PreToolUse invokes compiled `pre-tool-use.js`; no PostToolUse.
- .codex/config.toml:9 - Codex config registers the Spec Kit Memory MCP server, not validation hooks.
- .gemini/settings.json:67 - Gemini hooks are enabled.
- .gemini/settings.json:70 - Gemini hooks configured: SessionStart, PreCompress, BeforeAgent, SessionEnd.
- .github/hooks/superset-notify.json:25 - Copilot-style `postToolUse` exists but only calls `superset-notify.sh`.
- .github/hooks/scripts/superset-notify.sh:4 - superset notify forwards externally if available, otherwise returns `{}`; no validate/generate invocation.
- .opencode/plugins/README.md:1 - OpenCode uses local plugin entrypoints under `.opencode/plugins`.
- .opencode/plugins/spec-kit-skill-advisor.js:632 - OpenCode skill-advisor plugin exposes event/system/tool handlers, not validation.
- .opencode/plugins/spec-kit-compact-code-graph.js:365 - OpenCode compact plugin handles cache/context transforms, not validation or context generation.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:94 - Claude Stop hook can run generate-context via structured JSON.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:490 - Claude Stop hook calls context autosave if autosave is enabled.
- .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:58 - compiled Claude Stop hook spawns generate-context.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:97 - Gemini SessionEnd persists hook state only; no generate-context invocation was found.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:3 - Codex PreToolUse is a narrow Bash deny policy, not validation.
- .opencode/skill/system-spec-kit/references/config/hook_system.md:64 - documented runtime hook matrix covers advisor/startup/compaction/cleanup, not validation PostToolUse.
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:31 - prompt-time advisor hook flow only.
- AGENTS.md:145 - common workflow says `/memory:save`/generate-context is auto-indexed.
- AGENTS.md:146 - completion workflow claims validation runs automatically.
- AGENTS.md:224 - memory-save rule says generate-context runs on save-context triggers, not on every edit.
- AGENTS.md:334 - distributed governance says agents must run validate after authored spec-doc writes.
- .opencode/skill/system-spec-kit/SKILL.md:63 - same distributed governance requirement.
- .opencode/skill/system-spec-kit/SKILL.md:505 - manual `/memory:save` context-save trigger.
- .opencode/skill/system-spec-kit/SKILL.md:661 - auto-index touched spec docs is a `/memory:save` default, not an arbitrary file-edit hook.
- .opencode/skill/system-spec-kit/SKILL.md:714 - validator is documented as an automated validation script and manual command surface.

## Findings (4-class reality map rows)

| Trigger surface | Auto-fire path (file:line) | Manual entry | Class | Severity |
|-----------------|----------------------------|--------------|-------|----------|
| validate.sh on PostToolUse (Claude) | None found; Claude hooks are UserPromptSubmit/PreCompact/SessionStart/Stop at `.claude/settings.local.json:24`; Stop hook is configured at `.claude/settings.local.json:61` | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87`) | manual | n/a |
| validate.sh on PostToolUse (Codex) | None found; Codex has PreToolUse only at `.codex/settings.json:25`, and the handler is a Bash deny policy at `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:3` | same direct validator invocation | manual | n/a |
| validate.sh on postToolUse (Copilot wrapper) | `.github/hooks/superset-notify.json:25` defines `postToolUse`, but `.github/hooks/scripts/superset-notify.sh:4` only forwards externally or returns `{}` | same direct validator invocation | manual | n/a |
| validate.sh on PostToolUse (Gemini) | None found; Gemini hooks are SessionStart/PreCompress/BeforeAgent/SessionEnd at `.gemini/settings.json:70` | same direct validator invocation | manual | n/a |
| validate.sh on OpenCode plugin events | None found; OpenCode loads `.opencode/plugins` per `.opencode/plugins/README.md:1`, and the active plugins expose advisor/compact handlers at `.opencode/plugins/spec-kit-skill-advisor.js:632` and `.opencode/plugins/spec-kit-compact-code-graph.js:365` | same direct validator invocation | manual | n/a |
| validate.sh after authored spec-doc write | Documented obligation at `AGENTS.md:334` and `.opencode/skill/system-spec-kit/SKILL.md:63`, but no runtime hook config fires validator after writes | same direct validator invocation | aspirational | P1 |
| completion validation auto-runs | `AGENTS.md:146` says validation runs automatically when claiming completion, but the concrete validator surface is still the CLI at `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87` | manual completion workflow plus direct validator invocation | aspirational | P2 |
| generate-context.js after arbitrary spec edit | None found; generate-context is documented as save-context tooling at `.opencode/command/memory/save.md:120` and `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:58` | `/memory:save`, `save context`, `save memory`, or explicit `node .../generate-context.js --json ...` | manual | n/a |
| generate-context.js on Claude Stop | `.claude/settings.local.json:61` configures Stop; `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:58` spawns generate-context conditionally | `/memory:save` or explicit generate-context invocation | half | n/a |
| generate-context.js on Gemini SessionEnd | `.gemini/settings.json:113` configures SessionEnd, but `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:97` persists hook state only and does not spawn generate-context | `/memory:save` or explicit generate-context invocation | manual | n/a |
| generate-context.js on Codex/Copilot/OpenCode lifecycle | Codex has no Stop hook in `.codex/settings.json:1`; Copilot wrapper session hooks only forward through `.github/hooks/scripts/superset-notify.sh:4`; OpenCode plugins expose context transforms at `.opencode/plugins/spec-kit-compact-code-graph.js:401`, not generation | `/memory:save` or explicit generate-context invocation | manual | n/a |
| generate-context.js Step 11.5 re-indexing | Inside canonical save, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1498` auto-indexes touched canonical spec docs and graph metadata | `/memory:save` or explicit generate-context invocation | half | n/a |
| memory_save MCP indexing | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2681` validates/indexes/persists one file; canonical spec-doc filter at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2737`; index call at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3060` | explicit `memory_save` tool call | manual | n/a |
| MCP startup re-index | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2116` schedules startup scan; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1305` discovers docs; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1343` indexes files | explicit `memory_index_scan` for refresh on demand | auto | n/a |
| optional markdown file watcher re-index | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047` starts watcher only when enabled; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:350` defaults watcher off; `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:377` reindexes changed files | set `SPECKIT_FILE_WATCHER=true` or run `memory_index_scan` manually | half | n/a |

## NEW gap-findings (P0/P1/P2)

F-013-013 (P1): The "run validate after each authored spec-doc write" requirement is enforced as agent governance, not as a runtime PostToolUse hook. `AGENTS.md:334` and `.opencode/skill/system-spec-kit/SKILL.md:63` require it, but Claude/Codex/Gemini/OpenCode configs do not register a validator hook and the Copilot-style `postToolUse` wrapper only forwards to an external superset hook. Severity is P1 because the docs can lead operators to believe validation is mechanically enforced when it depends on agent compliance.

F-013-014 (P2): "Claim completion: Validation runs automatically" at `AGENTS.md:146` is over-broad. The actual validator is a CLI script (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87`) and no completion hook was found that invokes it; the closest enforcement is workflow instruction. Severity is P2 because the process still tells agents to validate, but the automation wording is false under the inspected runtime configs.

F-013-015 (P2): Context-save auto-generation is not cross-runtime parity. Claude Stop conditionally spawns generate-context (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:94`), while Gemini SessionEnd persists hook state without generate-context (`.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:97`) and Codex/OpenCode/Copilot configs do not spawn it. Severity is P2 because this is a documentation/expectation risk rather than direct data loss if `/memory:save` remains the explicit save path.

## Cross-runtime contradictions

Claude is the only inspected runtime with a lifecycle hook that conditionally auto-runs `generate-context.js`: `.claude/settings.local.json:61` points to the Stop hook and `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:94` performs the spawn. Gemini has a SessionEnd hook at `.gemini/settings.json:113`, but `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:97` only persists hook state. Codex has SessionStart/UserPromptSubmit/PreToolUse at `.codex/settings.json:1`, Copilot has a generic `postToolUse` forwarder at `.github/hooks/superset-notify.json:25`, and OpenCode uses plugins per `.opencode/plugins/README.md:1`; none of those paths fire validator or context generation.

Validation is consistently manual across runtimes despite governance text that implies post-write or completion automation. Re-indexing is different: MCP startup scan auto-indexes, generate-context auto-indexes touched docs inside canonical saves, and the optional file watcher reindexes markdown when explicitly enabled, but none of those re-index paths run `validate.sh --strict`.

## newInfoRatio estimate
0.86

## Next focus
Iteration 4 should drill into session-bootstrap and hook-priming reality: which startup/prompt/compact hooks actually recover spec context, which only append advisor text, and which documented recovery surfaces are manual slash-command paths rather than runtime automation.
