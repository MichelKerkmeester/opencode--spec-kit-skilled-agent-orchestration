# Iteration 004 - Memory and Database Automation

## Focus
Strategy focus: `memory_save`, `memory_index_scan`, `memory_match_triggers`, `session_bootstrap`, checkpoints, retention, cleanup, and causal graph behavior for RQ4 (`research/deep-research-strategy.md:26`).

## Sources Read
- `CLAUDE.md:142-155`, `CLAUDE.md:227-232` - memory workflow claims.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1723-1888` - planner follow-ups and deferred enrichment/reconsolidation.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2681-2770` - `memory_save` handler and governed ingest fields.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3028-3058`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3120-3330` - plan-only and full-auto atomic save paths.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:185-245`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:420-560` - manual index scan and incremental behavior.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:183-280` - trigger matching tool.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:1-11`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:162-185` - bootstrap composite behavior.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:1-16`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:165-230` - resume composite and code graph/CocoIndex state.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:28-32`, `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:301-607` - checkpoint tool handlers.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202-257`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737-840` - session cleanup intervals.
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-333` - retention metadata validation and persistence.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:140-152`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:96-103` - reconsolidation and enrichment default false.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:344-420` - causal link auto-extraction.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2032-2045` - async ingest crash recovery reset.

## Findings

| ID | Severity | Claim | Actual behavior | Gap class | Recommended action |
|----|----------|-------|-----------------|-----------|--------------------|
| F4.1 | P1 | `memory_save` automatically saves and indexes context. | The handler is explicit; it validates input, checks database readiness, validates path scope, applies governed ingest, and then saves/indexes. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2681-2770`. | Manual | Keep as explicit MCP/command surface. |
| F4.2 | P1 | Canonical save applies by default. | Planner-first saves return a non-mutating plan and follow-up actions unless `plannerMode:'full-auto'` is requested. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1723-1780`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3028-3058`. | Half | Make default plan-only visible in operator docs. |
| F4.3 | P1 | Save-time enrichment always updates causal/entity graph. | Reconsolidation and post-insert enrichment are deferred by default; the flags default false. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1783-1888`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:140-152`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:100-103`. | Half | Document opt-in flags and follow-up backfill. |
| F4.4 | P1 | `memory_index_scan` is automatic. | The handler is explicit, rate-limited by a scan lease, discovers spec docs and graph metadata, then performs incremental scan/deletion when invoked. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:185-245`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:420-560`. | Manual | Keep as operator-triggered maintenance. |
| F4.5 | P1 | Memory index startup is automatic. | The MCP server startup scan indexes changed files and runs post-mutation hooks. Source: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1320-1374`. | Auto | Keep as startup automation. |
| F4.6 | P1 | File-change memory indexing is always automatic. | Optional real-time watcher only starts when `SPECKIT_FILE_WATCHER=true`; otherwise no watcher path runs. Sources: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047-2090`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-355`. | Half | Fix always-on watcher claims. |
| F4.7 | P1 | `memory_match_triggers` fires automatically before every tool. | The handler is explicit: it requires a prompt, checks DB, optionally uses session cognitive state, and returns matches. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:183-280`. | Manual | Keep as Gate 1 instruction, not runtime guarantee. |
| F4.8 | P1 | `session_bootstrap` auto-runs on startup. | It is a composite handler over resume, health, structural snapshot, and skill graph status; hook wrappers can call it, but the handler itself is explicit. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:1-11`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:162-185`. | Manual | Document as fallback/composite tool. |
| F4.9 | P1 | Checkpoints self-create before risky DB changes. | Checkpoint create/list/restore/delete are explicit handlers; restore establishes barriers for save/index scans. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:28-32`, `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:301-607`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:283-313`. | Manual | Keep as operator maintenance. |
| F4.10 | P1 | Session cleanup is automatic. | `session-manager.init` runs cleanup immediately and schedules expired-session and stale-session cleanup intervals. Sources: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202-257`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737-840`. | Auto | Keep; this is a true server-start automation. |
| F4.11 | P1 | Retention expiry is automatically swept. | Governed ingest persists `retention_policy` and `delete_after`, and comments say ephemeral rows require `deleteAfter` because sweeps key off it. No handler/runtime sweep entry was found in handler/context-server searches. Source: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-333`. | Aspirational | Add a retention sweep tool/interval or downgrade docs to metadata-only. |
| F4.12 | P1 | Causal links are automatically inferred. | Causal links are inserted only when post-insert enrichment runs and parsed causal links resolve; enrichment is disabled by default. Sources: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2561-2565`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:344-420`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:147-152`. | Half | Document opt-in enrichment and unresolved-link behavior. |
| F4.13 | P2 | Async ingest self-recovers after crashes. | Context server initializes the ingest queue and resets incomplete jobs to queued on startup. Source: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2032-2045`. | Auto | Keep as startup recovery automation. |

## Adversarial Self-Check: F4.11
- **Hunter**: Retention fields are persisted and `deleteAfter` is required for ephemeral rows, but no sweep handler or context-server interval appeared in the source search. That makes "retention cleanup" a P1 aspirational claim.
- **Skeptic**: Cleanup candidates and session cleanup exist elsewhere; a sweep may be named generically.
- **Referee**: Session cleanup is real but applies session tables, not `memory_index.delete_after`. Without a located sweep entry, F4.11 stays P1 Aspirational, with the caveat that a differently named maintenance command could downgrade it in remediation.

## New Info Ratio
0.71. The memory subsystem has more true automation than code graph, but much of it is startup or feature-flag scoped.

## Open Questions Carried Forward
- Is there an unpublished operator command for retention sweeps?
- Should `memory_save` plan-only defaults be mirrored in global instructions wherever "auto-indexed" appears?

## Convergence Signal
continue. RQ4 has one unresolved P1 aspirational finding to carry into synthesis.

