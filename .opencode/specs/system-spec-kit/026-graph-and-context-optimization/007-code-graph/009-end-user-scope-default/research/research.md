# Deep Research Synthesis: End-User Scope Default for Code Graph Indexing

<!-- ANCHOR:research -->

## 1. Executive summary

Five iterations converged on a simple design: code graph scans should exclude `.opencode/skill/**` by default, while maintainers can opt in with `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or a one-call `includeSkills:true` override. The scope decision lives in two layers today: default scan globs in `code_graph/lib/indexer-types.ts` and a hard walker guard in `lib/utils/index-scope.ts` (`indexer-types.ts:137`, `index-scope.ts:31`). The live database is dominated by skill internals: 1,571/1,619 tracked files, 34,274/34,850 nodes, and 15,573/16,530 edges are under `.opencode/skill` or touch those nodes, based on the persisted tables defined in `code-graph-db.ts:55` and `code-graph-db.ts:86`. Migration must be loud: only explicit full scans prune existing tracked paths that still exist on disk (`scan.ts:241`, `scan.ts:247`).

## 2. Research charter

Topic: make end-user repository code the default code graph scope, with skill internals available only by explicit opt-in. Scope: scanner defaults, flag surface, default exclude list, migration, consumers, adjacent systems, performance, compatibility, and workflow invariance. Non-goals: implementing the change, changing memory index scope, changing CocoIndex scope, reworking schema shape, or backporting historical graphs.

## 3. Methodology

This was a 5-iteration local code research loop. Iteration 1 mapped scan scope and default excludes. Iteration 2 compared env, tool schema, runtime config, and one-call override surfaces. Iteration 3 checked DB pruning, readiness, advisor, and skill graph impact. Iteration 4 measured live database pollution and adjacent systems. Iteration 5 checked backward compatibility and ADR-005 workflow invariance. Evidence came from direct file reads, targeted `rg`/`find`, and SQLite queries against the live code graph database.

## 4. Key findings

Q1: Scope is split across defaults and an invariant guard. `handleCodeGraphScan()` creates config through `getDefaultConfig()` and appends caller excludes (`scan.ts:214`, `scan.ts:216`). Candidate walking also calls `shouldIndexForCodeGraph()` before glob excludes (`structural-indexer.ts:1298`). Both layers must change together.

Q2: Use a default-off env var plus one-call override. The scan schema is closed (`tool-schemas.ts:562`, `tool-schemas.ts:566`), so `includeSkills` must be added deliberately. Env vars already configure the MCP server through `opencode.json:25`; `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` is the clean maintainer setup path.

Q3: End-user-only should be the default. Existing `excludeGlobs` are additive (`scan.ts:216`), so old behavior should not remain implicit. The measured live graph is mostly skill internals, which directly supports changing the default.

Q4: Default exclude list should be the existing list plus `.opencode/skill/**`, while retaining the existing `mcp-coco-index/mcp_server` exclusion. Current defaults exclude common generated/vendor paths but not `.opencode/skill` broadly (`indexer-types.ts:138`, `index-scope.ts:31`).

Q5: Migration needs an explicit full scan. Full scan mode removes tracked files no longer present in current results (`scan.ts:243`, `scan.ts:247`), and `removeFile()` deletes touched edges before deleting the file row (`code-graph-db.ts:565`, `code-graph-db.ts:574`). Incremental scans only clean files that disappeared from disk, not files that became out-of-scope.

Q6: Advisor and skill graph are low-risk because they use a separate skill metadata path and `skill-graph.sqlite` (`context-server.ts:222`, `skill-graph-db.ts:4`). Query, context, status, verify, and detect-changes need clearer readiness/migration messaging because they depend on the structural code graph.

Q7: CocoIndex is adjacent but separate. `ccc_reindex` shells out to its own binary (`ccc-reindex.ts:31`) and `ccc_status` reports `.cocoindex_code` with readiness not applicable (`ccc-status.ts:26`, `ccc-status.ts:37`). It should be tracked as a follow-up, not folded into this packet.

Q8: Performance/storage delta is large. Persisted DB measurement shows 97.0% of tracked files and 98.3% of nodes are under `.opencode/skill`. Filesystem approximation using current scan extensions found 1,572 skill-source candidates out of 2,827, but the DB numbers are the stronger evidence because they represent current query pollution.

Q9: Backward compatibility should be explicit opt-in. Maintainers set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` before starting the MCP server, or pass `includeSkills:true` for a one-off scan, then run `code_graph_scan({ incremental:false })`. The README already documents full-scan pruning after exclude changes (`README.md:289`, `README.md:295`).

Q10: Workflow invariance holds if public spec workflow language stays unchanged. ADR-005 keeps `Level 1/2/3/3+ + phase-parent` as the only public/AI-facing spec vocabulary (`decision-record.md:211`, `decision-record.md:217`). This packet can stay compliant by using concrete code graph scope wording and not changing Gate 3, spec levels, or conversation prompts.

## 5. Where the scope decision lives

The scan entry point is `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`. It accepts `rootDir`, `includeGlobs`, `excludeGlobs`, `incremental`, `verify`, and `persistBaseline` (`scan.ts:25`) and creates defaults through `getDefaultConfig(resolvedRootDir)` (`scan.ts:214`). The default include and exclude lists live in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` (`indexer-types.ts:137`, `indexer-types.ts:138`). The walker-level invariant lives in `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`, and the walker applies it before glob rules (`structural-indexer.ts:1292`, `structural-indexer.ts:1298`). Implementation must update both the config defaults and the guard.

## 6. Flag surface recommendation

Chosen surface: `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` as the maintainer env opt-in, and `includeSkills:true` as a one-call override on `code_graph_scan`. The env var is durable for maintainers running the MCP server from `opencode.json` (`opencode.json:19`, `opencode.json:25`). The one-call field is necessary for tests, manual scans, and tooling because the schema is strict (`tool-schemas.ts:566`). Rejected alternatives: `opencode.json` only, because tests and library calls should not depend on one runtime config file; `excludeGlobs` only, because additive excludes cannot opt back into a hard guard (`scan.ts:216`, `structural-indexer.ts:1298`); retaining old default behavior, because the live graph is dominated by skill internals.

## 7. Default exclude path list

Recommended default excludes: `node_modules`, `dist`, `.git`, `vendor`, `external`, `z_future`, `z_archive`, `mcp-coco-index/mcp_server`, and `.opencode/skill/**`. The existing list appears in both `getDefaultConfig()` and the shared scope guard (`indexer-types.ts:138`, `index-scope.ts:31`). The existing `mcp-coco-index/mcp_server` carve-out should remain even when `includeSkills:true` is used, unless a future packet intentionally broadens the maintainer scope.

## 8. Default decision

Default: end-user-only. Skill internals appear only when `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or `includeSkills:true` is set. This matches the packet goal, removes the measured 97.0% file pollution from the current database, and preserves a direct maintainer opt-in path.

## 9. Migration path

Add a scope fingerprint in `code_graph_metadata` and compare it during readiness/status. If the stored fingerprint differs, status/query/context should report a full scan requirement. The operator action is `code_graph_scan({ rootDir: "<repo-root>", incremental:false })`, which already prunes out-of-scope tracked files (`scan.ts:243`, `scan.ts:247`). Do not rely on incremental scans, because existing skill paths still exist and can remain hash-fresh (`ensure-ready.ts:301`, `ensure-ready.ts:322`). Use delete semantics, not archive semantics: `removeFile()` already removes edges and file rows (`code-graph-db.ts:565`, `code-graph-db.ts:576`).

## 10. Consumer impact analysis

| Consumer | Impact | Mitigation |
|---|---|---|
| `code_graph_query` | Skill symbols vanish by default; full-scan states already block instead of silently full-rebuilding (`query.ts:1089`). | Add scope warning and tell maintainers to opt in or run full scan. |
| `code_graph_context` | Same graph scope change; blocked payload already carries `requiredAction:"code_graph_scan"` (`context.ts:184`, `context.ts:196`). | Reuse blocked payload shape for scope mismatch. |
| `code_graph_status` | Must expose scope mismatch before stats optimism (`status.ts:158`, `status.ts:167`). | Include excluded tracked counts until full scan prunes them. |
| `detect_changes` | Read-only and blocks when graph is not ready (`detect-changes.ts:246`, `detect-changes.ts:260`). | No behavioral change beyond clearer reason text. |
| `code_graph_verify` | Requires fresh graph and no inline full scan (`verify.ts:154`, `verify.ts:160`). | Require explicit full scan after scope change. |
| Advisor / skill graph | Low direct impact; separate `skill-graph.sqlite` and metadata scan (`context-server.ts:222`, `advisor-status.ts:105`). | No code graph dependency required. |
| Startup/session brief | May display stale polluted counts (`startup-brief.ts:122`, `startup-brief.ts:131`). | Add concise scope mismatch hint. |
| CocoIndex | Separate index and binary (`ccc-status.ts:26`, `ccc-reindex.ts:31`). | Follow-up packet if semantic search scope also needs cleanup. |

## 11. Adjacent systems

CocoIndex, detect-changes, verify, status, startup brief, and skill graph were checked. Only code graph read/status surfaces need immediate messaging. CocoIndex has its own index directory and readiness-not-applicable path (`ccc-status.ts:26`, `ccc-status.ts:37`). Skill graph remains separate by design (`skill-graph-db.ts:4`, `context-server.ts:1479`). Runtime directories outside `.opencode/skill` are negligible in this workspace; `.codex`, `.claude`, and `.gemini` together had only 2 scanner-extension files after default excludes.

## 12. Performance delta

Measured persisted DB delta: default exclusion would remove up to 1,571 of 1,619 tracked files (97.0%), 34,274 of 34,850 nodes (98.3%), and 15,573 of 16,530 edges touching those nodes (94.2%). The code graph DB schema stores those file, node, and edge rows in `code_files`, `code_nodes`, and `code_edges` (`code-graph-db.ts:55`, `code-graph-db.ts:68`, `code-graph-db.ts:86`). Filesystem approximation using scanner extensions found a 55.6% skill-source candidate share, but the DB measurement is the real UX signal.

## 13. Backward compat path

Maintainers get two compatibility paths: set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` before launching the MCP server, or pass `includeSkills:true` to `code_graph_scan`. Existing databases need a full scan after changing scope. Existing tests should be extended: schema acceptance for `includeSkills` belongs near `tool-input-schema.vitest.ts:534`, and default exclude assertions belong near `code-graph-indexer.vitest.ts:242`.

## 14. Workflow invariance check

Pass, with constraints. Do not change Gate 3 wording, spec level docs, validator text unrelated to code graph scope, or AI-facing spec workflow text. ADR-005 states the public/AI-facing spec vocabulary remains level-based (`decision-record.md:211`, `decision-record.md:217`) and forbids leaking internal template taxonomy (`decision-record.md:235`). This implementation can avoid that risk because it only changes code graph scan scope, env docs, schema, and readiness/status text.

## 15. Risks + mitigations

R1 silent maintainer breakage: high impact. Mitigation: scope fingerprint warning, status counts for old skill paths, documented one-step opt-in, and explicit full scan.

R2 advisor and skill graph breakage: lower than expected. Mitigation: keep their separate metadata scan path unchanged and add regression coverage if any imports from code graph appear.

R3 hook/session scope drift: medium. Mitigation: startup brief should surface stale scope mismatch and recommend full scan.

R4 CocoIndex stale semantic results: out of scope but real. Mitigation: track as follow-up because CocoIndex uses `.cocoindex_code` and its own binary.

R5 existing DB stale nodes: high likelihood. Mitigation: delete rows through full scan pruning and optionally VACUUM if file size matters (`README.md:298`).

## 16. Implementation plan sketch

Phase 1: Add scope policy helpers and tests. Update `index-scope.ts`, `indexer-types.ts`, `scan.ts`, `tool-schemas.ts`, `tool-input-schema.vitest.ts`, and `code-graph-indexer.vitest.ts`. Add `SPECKIT_CODE_GRAPH_INDEX_SKILLS` handling and `includeSkills`.

Phase 2: Add migration/readiness messaging. Add a scope fingerprint in `code_graph_metadata`, compare it in readiness/status, and reuse the existing full-scan blocked response shape.

Phase 3: Update docs and verification. Update the code graph README, env reference, startup/status text, and manual tests. Run focused vitest suites plus strict spec validation.

## 17. Open questions remaining

No blocking research questions remain. Implementation can choose the exact helper names and whether excluded tracked counts live in status only or also in query/context readiness payloads.
<!-- /ANCHOR:research -->
