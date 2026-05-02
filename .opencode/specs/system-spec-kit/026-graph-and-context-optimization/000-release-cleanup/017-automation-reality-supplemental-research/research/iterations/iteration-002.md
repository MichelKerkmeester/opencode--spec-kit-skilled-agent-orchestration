# Iteration 2: CCC + Eval + Ablation Reality

## Status
insight

## Focus
CCC + eval reporting + ablation runner reality

## Sources read
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-001.md:1` - prior iteration focused on deep-loop graph tools, so this pass did not duplicate that map.
- `.opencode/command/memory/search.md:1-4` - `/memory:search` frontmatter exposes `spec_kit_memory_eval_run_ablation` and `spec_kit_memory_eval_reporting_dashboard`, but no CCC tools.
- `.opencode/command/memory/search.md:726-729` - `/memory:search ablation` is the explicit slash-command trigger for ablation and requires `SPECKIT_ABLATION=true`.
- `.opencode/command/memory/search.md:767-769` - `/memory:search dashboard` is the explicit slash-command trigger for reporting dashboard output.
- `.opencode/command/memory/search.md:852-853` - command enforcement matrix maps ablation/dashboard to single analysis-tool calls.
- `.opencode/command/memory/search.md:912-913` - appendix shows the concrete operator MCP calls for both eval tools.
- `.opencode/command/memory/search.md:931-932` - tool coverage table maps `eval_run_ablation` to `ablation` and `eval_reporting_dashboard` to `dashboard`.
- `.opencode/command/memory/manage.md:1-4` - `/memory:manage` allowed-tools list omits `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
- `.opencode/command/memory/manage.md:904-921` - `/memory:manage` enforcement matrix omits all CCC tools.
- `.opencode/command/memory/manage.md:925-941` - `/memory:manage` tool signatures omit all CCC tools.
- `.opencode/command/memory/README.txt:257-258` - command coverage maps eval tools to `/memory:search`.
- `.opencode/command/memory/README.txt:271-273` - command coverage maps the CCC trio to `/memory:manage`, contradicting `manage.md`.
- `.opencode/command/spec_kit/resume.md:1-4` - `/spec_kit:resume` allows `mcp__cocoindex_code__search`, not the CCC MCP tools.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:85-113` - generic MCP dispatch only invokes a dispatcher when the requested tool name matches.
- `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:39-65` - lifecycle dispatcher registers and routes `eval_run_ablation` and `eval_reporting_dashboard`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:20-31` - code-graph dispatcher registers the CCC trio.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-96` - code-graph dispatcher invokes CCC handlers only for requested CCC tool names.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:920-1014` - MCP `CallToolRequestSchema` dispatches the requested tool name; no ambient CCC/eval invocation is present in this server path.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:440-489` - public MCP schemas define eval ablation and dashboard tools.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:716-747` - public MCP schemas define CCC status, reindex, and feedback tools.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:9-11` - actual CCC handlers are exported from `mcp_server/code_graph/handlers`, not `mcp_server/handlers`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:22-58` - `ccc_status` is a direct handler that checks binary/index availability and recommends manual reindex when missing.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:27-54` - `ccc_reindex` is a direct handler that runs the `ccc` CLI with `index` or `index --full`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:29-60` - `ccc_feedback` is a direct handler that appends feedback JSONL under the CocoIndex skill folder.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223-327` - `eval_run_ablation` handler checks the feature flag, builds an eval search adapter, runs ablation, and optionally stores snapshots.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:388-409` - `eval_reporting_dashboard` handler generates and formats dashboard output.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:39-46` - ablation is enabled only when `SPECKIT_ABLATION` equals `true`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:537-558` - `runAblation()` is a public API, not a scheduler; it returns null when the flag is off.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:588-675` - ablation executes baseline plus one-disabled-channel runs per channel.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:739-845` - ablation storage writes eval metric snapshots when explicitly called.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:1-14` - dashboard module is read-only aggregation over eval DB tables after initialization.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:576-615` - dashboard report generation queries snapshots, groups sprint entries, and applies request limits.
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:648-738` - dashboard formatting returns text or JSON.
- `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:13-19` - separate CLI usage and output contract for ablation runner.
- `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:90-95` - CLI refuses unless `SPECKIT_ABLATION=true`.
- `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:164-176` - CLI explicitly calls `runAblation()` and stores results.
- `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:187-196` - CLI writes `/tmp/ablation-result.json`.
- `.opencode/skill/system-spec-kit/scripts/evals/README.md:57-70` - eval script inventory lists `run-ablation.ts` but no dashboard CLI.
- `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md:25-31` - feature catalog documents `run-ablation.ts` and ground-truth ID mapping as operator-facing eval runners.
- `.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:18-26` - feature catalog describes dual ablation/k-sensitivity MCP behavior and flag gating.
- `.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md:18-22` - feature catalog describes dashboard as read-only report generation after possible DB initialization.
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:183-202` - tests assert tool definition presence for eval and CCC tools.
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303-306` - tests assert dispatch coverage includes eval and CCC names.
- `.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:26-27` - tests map eval tools to handler exports; this is dispatch coverage, not auto-fire.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:266-279` - tests invoke CCC handlers directly for readiness parity, not workflow automation.
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:153-168` - tests validate eval ablation schema behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:708-755` - tests validate CCC schemas.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:218-327` - tests exercise `handleEvalRunAblation` directly.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:451-512` - tests exercise `handleEvalReportingDashboard` directly.
- `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:177-213` - tests cover feature-flag gating for the ablation framework.
- `.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:153-172` - tests cover dashboard behavior against an empty DB.
- `.github/hooks/superset-notify.json:3-31` - repository hook config only wires session start/end, prompt, and post-tool notification scripts; no CCC/eval scheduled path.
- `.github/hooks/scripts/session-start.sh:10-11` - session-start hook runs Copilot session priming only.
- `.github/hooks/scripts/user-prompt-submitted.sh:10-11` - prompt hook runs prompt-submit logic only.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:584-615` - session resume checks code graph status and CocoIndex availability via helper, not CCC MCP tools.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:364-370` - session bootstrap calls `handleSessionResume`, inheriting availability checks but not CCC tool calls.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:451-468` - prompt/session priming checks CocoIndex availability and recommends `mcp__cocoindex_code__search`, not CCC tools.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:155-185` - session snapshot checks CocoIndex availability and emits semantic-search routing advice, not CCC tool calls.
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md:306-308` - architecture doc points CCC handler paths at `handlers/ccc-*.ts`, which is stale relative to actual `code_graph/handlers`.
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/iterations/iteration-002.md:30` - 012 baseline already noted `ccc_reindex` is manual and does not refresh structural code graph readiness.

## Findings (4-class reality map rows)

| Tool | Auto-fire trigger (file:line) | Manual entry | Class | Severity if aspirational |
|------|-------------------------------|--------------|-------|--------------------------|
| ccc_reindex | None found. Background/session paths check CocoIndex availability through helpers instead of invoking `ccc_reindex` (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:609-615`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:451-468`). Runtime dispatch only calls the handler when the requested tool name is `ccc_reindex` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-90`). | Direct MCP tool call `mcp__spec_kit_memory__ccc_reindex({ full })`; handler shells out to `ccc index` or `ccc index --full` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:45-54`). `/memory:manage` is documented as the command home but the command cannot call it (`.opencode/command/memory/README.txt:271-273`, `.opencode/command/memory/manage.md:1-4`). | manual | n/a |
| ccc_feedback | None found. No hook, CI, session bootstrap, or memory command path invokes feedback automatically; dispatcher requires requested tool name `ccc_feedback` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:91-96`). | Direct MCP tool call `mcp__spec_kit_memory__ccc_feedback({ query, rating, resultFile?, comment? })`; handler appends JSONL feedback to `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:44-60`). | manual | n/a |
| ccc_status | None found. Session/bootstrap surfaces probe `isCocoIndexAvailable()` directly, not `ccc_status` (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:609-615`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:155-185`). Runtime dispatch only calls the handler when requested (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-88`). | Direct MCP tool call `mcp__spec_kit_memory__ccc_status({})`; handler reports binary/index availability and recommends manual `ccc_reindex` when missing (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:22-58`). | manual | n/a |
| eval_run_ablation | None found. `/memory:search ablation` is an explicit operator trigger, not a background auto-fire (`.opencode/command/memory/search.md:726-729`); no GitHub workflow exists and repository hooks only run session/prompt/post-tool wrappers (`.github/hooks/superset-notify.json:3-31`). | `/memory:search ablation`; direct MCP tool call `mcp__spec_kit_memory__eval_run_ablation(...)`; CLI `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` (`.opencode/command/memory/search.md:912`, `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:13-19`). | manual | n/a |
| eval_reporting_dashboard | None found. `/memory:search dashboard` is an explicit operator trigger, not scheduled reporting (`.opencode/command/memory/search.md:767-769`); repository hooks do not call it (`.github/hooks/scripts/session-start.sh:10-11`, `.github/hooks/scripts/user-prompt-submitted.sh:10-11`). | `/memory:search dashboard`; direct MCP tool call `mcp__spec_kit_memory__eval_reporting_dashboard({ sprintFilter?, channelFilter?, metricFilter?, limit?, format? })` (`.opencode/command/memory/search.md:913`, `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:388-409`). No dashboard CLI found in eval script inventory (`.opencode/skill/system-spec-kit/scripts/evals/README.md:57-70`). | manual | n/a |

## NEW gap-findings (P0/P1/P2)

**F-013-011 - P1 - CCC command-home documentation is stale.** The memory command coverage matrix maps `ccc_status`, `ccc_feedback`, and `ccc_reindex` to `/memory:manage` (`.opencode/command/memory/README.txt:271-273`), but `manage.md` neither allows nor documents those calls in its executable command surface (`.opencode/command/memory/manage.md:1-4`, `.opencode/command/memory/manage.md:904-921`). Severity is P1 because operators following the command matrix will try the wrong slash command, but the direct MCP tools and handlers do exist.

**F-013-012 - P2 - CCC architecture handler paths are stale.** `ARCHITECTURE.md` lists CCC handlers as `handlers/ccc-reindex.ts`, `handlers/ccc-status.ts`, and `handlers/ccc-feedback.ts` (`.opencode/skill/system-spec-kit/ARCHITECTURE.md:306-308`), while the actual exports are under `mcp_server/code_graph/handlers` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:9-11`). Severity is P2 because runtime dispatch is intact; the drift mainly misleads source navigation and research prompts.

## newInfoRatio estimate
0.78 - iteration 1 did not cover CCC or eval tools, and 012 only had one narrow `ccc_reindex` note about structural graph freshness. Most of this pass is new entry-point reality mapping; the repeated baseline is the broader manual-vs-auto distinction.

## Next focus
Iteration 3 should drill into session-bootstrap, session-resume, hook priming, and startup-payload claims: separate real lifecycle auto-surfacing from manual recovery commands, and verify whether Codex/Copilot/Gemini/Claude hook docs match actual checked-in hook config.
