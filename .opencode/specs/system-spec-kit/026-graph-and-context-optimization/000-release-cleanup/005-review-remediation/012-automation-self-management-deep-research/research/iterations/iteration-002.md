# Iteration 002 - Code Graph Scan, Readiness, Verify, Watcher

## Focus
Strategy focus: code graph scan, verify, status, `ensureCodeGraphReady`, and watcher paths for RQ2 (`research/deep-research-strategy.md:23-24`).

## Sources Read
- `.opencode/skill/system-spec-kit/SKILL.md:788-790` - documented read-path freshness behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:1-6`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:52-56` - auto-trigger helper and thresholds.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442` - selective/full inline behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087-1092` - query readiness and full-scan block.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62-96`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163-220` - context readiness and block.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:241-262` - read-only preflight blocks.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-356` - manual scan handler.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158-280` - status snapshot is read-only.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:141-178` - verify handler and optional baseline.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:27-73` - CocoIndex reindex handler.
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:1-24`, `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204` - code graph doctor is diagnostic-only.
- Absence check: `rg 'watch|watcher|chokidar|fs.watch' .opencode/skill/system-spec-kit/mcp_server/code_graph ...` found watcher code in skill-advisor/context-server, not in `code_graph/`.

## Findings

| ID | Severity | Claim | Actual behavior | Gap class | Recommended action |
|----|----------|-------|-----------------|-----------|--------------------|
| F2.1 | P1 | `code_graph_scan` auto-runs when needed. | `handleCodeGraphScan` is a tool handler; it indexes when invoked, can do incremental skipping, forces full reindex on git HEAD change, and optionally verifies only on full scan with `verify:true`. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-356`. | Manual | Document as operator/tool invocation. |
| F2.2 | P1 | Graph reads self-heal stale data. | `ensureCodeGraphReady` auto-runs selective reindex when allowed and the stale set is small; failures return stale readiness rather than throwing away context. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442`. | Auto | Keep claim for selective stale-file paths. |
| F2.3 | P1 | Graph reads can always repair themselves. | Query and context allow inline selective reindex but explicitly disallow inline full scans. Full-scan states return `requiredAction: code_graph_scan`. Sources: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087-1092`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163-220`. | Half | Document "selective auto, full manual." |
| F2.4 | P1 | `code_graph_status` updates graph freshness. | Status calls `getGraphReadinessSnapshot` first and comments that the snapshot is read-only; it emits degraded recovery but does not mutate graph rows. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158-280`. | Manual | Keep as status/readiness only. |
| F2.5 | P1 | `detect_changes` can infer impact even on stale graph. | The handler blocks on any non-fresh state and passes `allowInlineIndex:false`, so it never silently reindexes. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:241-262`. | Manual | Keep block-first behavior; document it. |
| F2.6 | P1 | `code_graph_verify` repairs or verifies automatically. | Verify calls `ensureCodeGraphReady` with inline indexing defaulting false, blocks unless fresh, and persists baseline only with `persistBaseline:true`. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:141-178`. | Manual | Keep as explicit quality gate. |
| F2.7 | P2 | CocoIndex reindex participates in code graph freshness. | `ccc_reindex` invokes the separate `ccc index` binary and returns `readiness_not_applicable`; it does not refresh structural code graph readiness. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:27-73`. | Manual | Avoid conflating CocoIndex and structural graph docs. |
| F2.8 | P1 | Code graph doctor can auto-apply repairs. | The auto YAML is Phase A diagnostic-only, forbids source mutation and forbids invoking `code_graph_scan`. Sources: `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:19-24`, `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204`. | Manual | Keep as diagnostic report until Phase B exists. |
| F2.9 | P1 | File-watcher auto-reindexing keeps the code graph current. | The memory README claims real-time filesystem watching updates the index automatically, but watcher evidence in this codebase is memory/spec-doc and skill graph watcher code, not a code-graph watcher under `code_graph/`. Sources: `.opencode/skill/system-spec-kit/mcp_server/README.md:515-518`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047-2090`, absence check over `mcp_server/code_graph/`. | Aspirational | Fix docs or implement a structural code-graph watcher. |
| F2.10 | P2 | Deleted tracked files self-clean on readiness checks. | `ensureCodeGraphReady` calls deleted tracked file cleanup before returning readiness. Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:341-343`. | Auto | Keep as narrow auto-cleanup claim. |

## Adversarial Self-Check: F2.9
- **Hunter**: The README says chokidar watches the project folder and updates the index automatically (`README.md:515-518`). The code graph directory has no watcher path; `ensure-ready` is read-path based and full scans remain manual.
- **Skeptic**: A watcher exists in `context-server.ts:2047-2090`, and it can start a file watcher plus skill graph watcher.
- **Referee**: The skeptic found memory/spec-doc indexing, not structural code graph indexing. F2.9 stays P1 Aspirational because the operational consequence is stale structural answers until a read path or manual scan occurs.

## New Info Ratio
0.74. The most useful distinction is "selective inline reindex" vs "manual full scan."

## Open Questions Carried Forward
- Should a structural watcher exist, or should docs explicitly say code graph freshness is read-path and manual-scan based?
- Should `doctor:code-graph` grow an apply mode or stay diagnostic by design?

## Convergence Signal
continue. RQ2 is answered, with one high-leverage aspirational gap.

