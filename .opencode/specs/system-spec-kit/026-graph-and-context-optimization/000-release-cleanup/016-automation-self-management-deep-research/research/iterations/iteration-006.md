# Iteration 006 - Cross-Cutting Gaps and Auto-Without-Docs

## Focus
Strategy focus: cross-cutting gaps, automatic behaviors missing from docs, and claims without runtime paths for RQ6 (`research/deep-research-strategy.md:28`).

## Sources Read
- `CLAUDE.md:51-57`, `CLAUDE.md:90-101`, `CLAUDE.md:141-159` - global automation claims.
- `.opencode/skill/system-spec-kit/mcp_server/README.md:515-523` - real-time watcher and retry claims.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1320-1374`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2032-2090` - actual startup scan, ingest recovery, and optional watcher.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202-257` - true automatic cleanup intervals.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442` - read-path selective self-heal.
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:19-24`, `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204` - code graph doctor non-apply reality.
- `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:49-68`, `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:162-194` - advisor doctor apply reality.
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:96-103` - opt-in/off defaults.

## Findings

| ID | Severity | Cross-cutting pattern | Evidence | Gap class | Recommended action |
|----|----------|----------------------|----------|-----------|--------------------|
| F6.1 | P1 | "Auto" often means "automatic inside an explicitly invoked tool." | `memory_save`, `code_graph_scan`, `memory_index_scan`, and `validate.sh` all do substantial automated work after invocation, but none are ambient daemons. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2681-2770`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-356`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:185-245`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-130`. | Manual | Use "operator-triggered automation" wording. |
| F6.2 | P1 | Startup automation is real and under-documented compared with prompt hooks. | MCP server startup scan and ingest crash recovery are true automatic behaviors. Sources: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1320-1374`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2032-2045`. | Auto | Promote startup automation to docs, with server-start precondition. |
| F6.3 | P1 | Watcher claims overgeneralize. | README says real-time filesystem watching continuously monitors the project folder, but the file watcher is opt-in and spec-doc scoped. Sources: `.opencode/skill/system-spec-kit/mcp_server/README.md:515-518`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047-2090`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-355`. | Aspirational | Replace global claim with opt-in scope matrix. |
| F6.4 | P1 | Feature flags silently convert Auto to Half. | Reconsolidation, post-insert enrichment, and file watcher defaults are off unless explicitly enabled. Sources: `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:96-103`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:140-152`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-355`. | Half | Add "default state" column to automation docs. |
| F6.5 | P1 | Code graph doctor is diagnostic while skill advisor doctor can mutate. | Code graph doctor forbids `code_graph_scan` and source mutations; skill advisor doctor validates and applies bounded edits, rebuilds, and verifies. Sources: `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:19-24`, `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204`, `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:49-68`, `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:162-194`. | Half | Split doctor docs by capability, not shared "doctor" label. |
| F6.6 | P2 | True automatic cleanup exists outside memory retention. | Session manager schedules expired and stale session cleanup intervals. Source: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202-257`. | Auto | Add to reality map as real automation. |
| F6.7 | P2 | Read-path self-heal is safer than watcher-based auto-write. | `ensureCodeGraphReady` selectively reindexes stale files with timeout and returns degraded readiness on failure. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442`. | Auto | Keep read-path self-heal as preferred structural graph automation. |
| F6.8 | P1 | Hook reliability is runtime-specific, not global. | Hook docs explicitly say capabilities differ and Copilot next-prompt freshness is different from in-turn context. Source: `.opencode/skill/system-spec-kit/references/config/hook_system.md:64-78`. | Half | Use per-runtime wording everywhere. |

## Adversarial Self-Check: F6.3
- **Hunter**: README says continuous project-folder watching auto-updates the index; implementation starts watcher only under `SPECKIT_FILE_WATCHER=true` and against spec base paths.
- **Skeptic**: The claim may refer broadly to memory/spec-doc index, not structural code graph.
- **Referee**: Even limited to memory, "continuous" is false by default. F6.3 stays P1 Aspirational for doc remediation.

## New Info Ratio
0.39. This was mostly synthesis, but it surfaced a reusable remediation pattern: document trigger, default flag, fallback, and scope.

## Open Questions Carried Forward
- Should the remediation phase create one automation matrix doc shared by all runtimes?
- Should "doctor" workflows be renamed to separate diagnostic and apply classes?

## Convergence Signal
approaching. New information is dropping, but P1 findings still needed cross-system framing.

