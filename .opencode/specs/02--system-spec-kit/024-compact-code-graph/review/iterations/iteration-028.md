# Iteration 028: D2 Security Convergence Sweep

## Focus

Final D2 handler-entry convergence sweep across all requested surfaces: `scan.ts`, `query.ts`, `context.ts`, `status.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`, and `memory-context.ts`. I reread the review state first, including the prior `F009` / `F010` re-verification and the earlier D2 handler passes, then checked each entry point for input validation, arbitrary-file-read exposure, denial-of-service sinks, internal-state leakage, and unsanitized disk writes.

## New Findings

### [P2] F031 - `ccc_feedback` persists unbounded caller-controlled `comment` / `resultFile` strings to disk

- The live server-level `SEC-003` guard only length-checks `query`, `title`, `specFolder`, `contextType`, `name`, `prompt`, and `filePath`; it never validates `comment` or `resultFile`, and `resultFile` does not match the guarded `filePath` key name.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:11-20][SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:41-49][SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:87-106]
- The published `ccc_feedback` schema also leaves both `resultFile` and `comment` as bare strings with no `maxLength`, so even the declarative contract does not bound the fields that reach the write sink.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:714-726]
- The code-graph dispatcher still forwards raw `ccc_*` arguments straight into handlers without a per-tool `validateToolArgs(...)` call, so those unbounded fields reach the sink on the live path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:314-318][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:35-55]
- `handleCccFeedback(...)` then appends the caller-controlled `query`, `resultFile`, `rating`, and `comment` into a persistent JSONL file at `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl` via synchronous `appendFileSync(...)`, and echoes the stored entry back in the success response.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:17-55]
- **Impact:** any MCP caller on the live `ccc_feedback` path can grow a persistent repository-local file with arbitrarily large `comment` / `resultFile` payloads and force equally oversized success payloads. This is a storage / response-amplification sink, not just a doc-level schema drift.
- **Fix:** enforce runtime schema validation on the `ccc_*` dispatcher path, add explicit `maxLength` bounds for `comment` and `resultFile`, and avoid echoing the full persisted entry back to callers.

## Verified Healthy / Narrowed Non-Findings

- The final sweep found **no new arbitrary-file-read sink** beyond the already-tracked `code_graph_scan.rootDir` boundary issue. In the reviewed handler code, `code_graph_query`, `code_graph_context`, and `code_graph_status` operate on the code-graph DB / context builder rather than opening caller-named filesystem paths directly.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:88-176][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:33-95][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:8-49]
- `ccc_status` and `ccc_reindex` still resolve fixed project-relative CocoIndex paths from `process.cwd()`, and `ccc_reindex` only toggles a boolean `full` flag when building its shell command. I did **not** confirm a new caller-controlled path or command-injection route in those two handlers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-43][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-53]
- `memory_context` still has the previously observed raw internal error/details echo, but this convergence sweep found no new auth-boundary or code-execution issue there. The handler still rejects empty input and still routes session reuse through trusted-session resolution before strategy execution.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:984-1059][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1163-1205]
- Raw JSONL log-forging through `ccc_feedback` remains ruled out: the handler serializes the full entry with `JSON.stringify(...)` before appending a newline, so this pass did not add a separate newline-injection finding there.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:37-45]

## Summary

- New finding: **`F031` [P2]**
- Reconfirmed: **`F010` remains active** on the live `code_graph_*` / `ccc_*` dispatcher path; **no new arbitrary-file-read sink** was found beyond the earlier `code_graph_scan.rootDir` issue
- Reconfirmed healthy/narrowed: `memory_context` still validates input and trusted-session reuse on its live path; no new handler-local auth/code-execution issue was added in this sweep
- New findings delta: **`+0 P0`, `+0 P1`, `+1 P2`**
- Recommended next focus: fold `ccc_feedback` into the broader code-graph validation remediation by enforcing runtime argument validation on the `ccc_*` path and adding explicit field bounds before the next D2 closure pass
