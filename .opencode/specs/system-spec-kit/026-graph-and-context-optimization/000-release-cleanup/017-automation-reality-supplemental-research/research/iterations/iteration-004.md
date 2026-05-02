# Iteration 4: Adversarial 4-P1 Retest + NEW Gap Hunt

## Status
insight

## Focus
Adversarial Hunter→Skeptic→Referee on 012's 4 P1 findings + NEW gap hunt

## Sources read
- specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/research-report.md:123 - 012 active registry lists the 4 P1 aspirational automation findings retested here.
- specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/iterations/iteration-002.md:35 - prior adversarial check found no structural code_graph watcher, only memory/spec-doc watcher.
- specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/iterations/iteration-004.md:40 - prior retention check found governance metadata but no located deletion path.
- specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/iterations/iteration-005.md:30 - prior hook consistency check flagged Copilot and Codex readiness mismatches.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047 - optional runtime watcher block is gated by `isFileWatcherEnabled()`.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:2050 - `startFileWatcher()` is called for spec markdown indexing, not code graph indexing.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:2068 - `startSkillGraphWatcher()` is started under the same optional watcher gate.
- .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:251 - watcher implementation uses chokidar over configured paths.
- .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:274 - watcher rejects non-markdown targets before indexing.
- .opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:188 - test coverage confirms markdown-only change detection.
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329 - code graph readiness is a read-path preflight, not a daemon watcher.
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:398 - selective inline reindex can run only after a stale status decision.
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163 - `code_graph_context` invokes readiness with selective inline indexing only.
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087 - `code_graph_query` invokes readiness with `allowInlineFullScan: false`.
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158 - code graph status is explicitly read-only.
- .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:280 - governed ephemeral ingestion requires `deleteAfter` because sweeps are expected to key off `delete_after`.
- .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:310 - governance writes `retention_policy` and `delete_after` fields.
- .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202 - session manager schedules interval-driven cleanup.
- .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737 - session cleanup deletes from session-scoped tables, not memory_index.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:115 - bulk delete counting filters by tier/spec/date, not `delete_after`.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183 - bulk delete candidate selection also omits `delete_after`.
- .opencode/skill/system-spec-kit/references/config/hook_system.md:22 - shared hook doc still describes Copilot wrapper parity with Claude-style objects.
- .opencode/skill/system-spec-kit/references/config/hook_system.md:72 - same shared doc maps Copilot lifecycle through `.claude/settings.local.json`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27 - Copilot hook README says Copilot does not use Claude `.claude/settings.local.json`.
- .github/hooks/superset-notify.json:3 - actual checked-in Copilot hook config uses `.github/hooks` JSON entries.
- .github/hooks/scripts/session-start.sh:10 - actual Copilot SessionStart script calls the generated session-prime hook.
- .github/hooks/scripts/user-prompt-submitted.sh:10 - actual Copilot UserPromptSubmit script calls the generated user-prompt hook.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1 - Copilot hook implementation documents that Copilot ignores hook output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md:21 - Codex hook README says live registration is user-level `~/.codex/hooks.json`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md:48 - Codex hook README keeps repo `.codex/settings.json` as examples.
- .codex/settings.json:1 - repo-local Codex hook examples exist in `.codex/settings.json`.
- .codex/config.toml:43 - repo-local Codex config has no `codex_hooks` feature flag.
- .opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:123 - policy checks hook registration from home/workspace `hooks.json`, not `settings.json`.
- .opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:148 - policy parses `[features].codex_hooks`.
- .opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:285 - policy reports live only when feature flag and hooks registration both pass.
- /Users/michelkerkmeester/.codex/hooks.json:2 - current user runtime has SessionStart hook registration.
- /Users/michelkerkmeester/.codex/config.toml:42 - current user runtime has `[features] codex_hooks = true`.
- /Users/michelkerkmeester/.superset/bin/codex:102 - current wrapper also passes `--enable codex_hooks`.
- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:49 - skill advisor daemon can acquire a lease and start a skill graph watcher.
- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:293 - skill graph daemon watcher uses chokidar paths.
- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:394 - daemon watcher reindexes changed skill metadata and publishes generation.
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:28 - `skill_graph_scan` is an explicit tool handler.
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts:40 - `skill_graph_validate` is an explicit diagnostic handler.
- .opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:23 - causal tools dispatch only the requested tool name.
- .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:415 - `memory_drift_why` requires an explicit `memoryId`.
- .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:38 - lifecycle tools dispatch only the requested learning-history tool.
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:659 - `memory_get_learning_history` reads session learning by spec folder.
- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:86 - advisor status computes freshness/trust state.
- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:54 - advisor rebuild is a separate helper, not called by status.
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60 - code graph tools dispatch `code_graph_context` only when requested.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:262 - structural routing only nudges toward code graph tools.
- .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:60 - memory tools dispatch `memory_health` only when requested.
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:425 - memory health auto-repair requires explicit confirmation.
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts:808 - context server recommends `memory_health` when graph metadata is unavailable instead of running it.

## Part A: Adversarial 4-P1 retest

### P1-1: Code-graph watcher overclaim
- Hunter findings: A chokidar path does exist under `mcp_server/`, but it is the optional spec markdown watcher plus optional skill graph watcher started from `context-server.ts`. The watcher rejects non-markdown file changes before indexing, and its tests exercise markdown extension detection. Code graph handlers use `ensureCodeGraphReady()` on `code_graph_query` and `code_graph_context`, but that is read-path freshness remediation with full scans disabled.
- Skeptic counter-evidence: The only daemon-like code graph-adjacent behavior found is selective inline reindex during an invoked query/context call. It does not auto-fire on source-code file changes, and `code_graph_status` is read-only.
- Referee verdict: validated - 012's P1 stands. The repo has watcher machinery, but not a structural code_graph source watcher. The actual implementation is manual/read-path freshness, not real-time structural graph maintenance.
- NEW evidence cited: .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:274; .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087

### P1-2: Memory retention sweep missing
- Hunter findings: A session-manager cleanup loop exists and starts immediate plus interval-driven session cleanup. A manual `memory_bulk_delete` tool also exists. Neither is the promised retention sweep over governed `memory_index.delete_after`.
- Skeptic counter-evidence: Session cleanup only deletes session delivery/working-state rows and intentionally preserves session learning. `memory_bulk_delete` filters by tier, spec folder, and creation date; it does not read `delete_after`. Governance still writes `delete_after` metadata and says ephemeral cleanup sweeps key off it.
- Referee verdict: validated - 012's P1 stands. Cleanup infrastructure exists, but the sweep needed to honor retained governed memories is absent from the searched paths.
- NEW evidence cited: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183

### P1-3: Copilot hook docs conflict
- Hunter findings: The shared hook-system reference still tells operators Copilot wrapper parity can use Claude-style `.claude/settings.local.json` objects. The Copilot-specific README says the opposite and directs Copilot config away from Claude settings. Actual checked-in hook wiring uses `.github/hooks/superset-notify.json` plus shell scripts into generated Copilot hook code.
- Skeptic counter-evidence: The current repo's operational path is not blocked by the stale shared doc because `.github/hooks` contains a concrete Copilot-style configuration. No install-time resolver was found that reconciles the docs; the mitigation is that the checked-in config already follows the Copilot-specific route.
- Referee verdict: reclassified - not a pure P1 automation gap in the current repo because the live checked-in Copilot hook path exists. It remains a P2 documentation drift: one reference can still mislead an operator into a Claude-only shape.
- NEW evidence cited: .github/hooks/superset-notify.json:3; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27

### P1-4: Codex hook readiness mismatch
- Hunter findings: Repo-local `.codex/settings.json` exists, but the Codex hook policy does not treat settings as live registration. It checks home/workspace `hooks.json` plus `[features].codex_hooks`. In the current user runtime, `~/.codex/hooks.json` exists, `~/.codex/config.toml` enables `codex_hooks`, and the wrapper also passes `--enable codex_hooks`.
- Skeptic counter-evidence: `.codex/settings.json` is not equivalent to `hooks.json` according to the local policy code and Codex hook README. The current operator environment is live, but the checked-in repo alone is only an example/config hint and remains partial without user-level hooks plus the feature flag.
- Referee verdict: reclassified - current runtime readiness is half-automated/environment-dependent, not a live P1 for this operator. The residual issue is P2 doc/config ambiguity: repo-local settings can look sufficient, but policy requires hooks registration plus feature enablement.
- NEW evidence cited: .opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:123; /Users/michelkerkmeester/.codex/config.toml:42; /Users/michelkerkmeester/.codex/hooks.json:2

## Part B: NEW gap-findings

| ID | Surface | Class | Severity | File:line | Summary |
|----|---------|-------|----------|-----------|---------|
| NEW-013-001 | session-manager cleanup interval | auto | n/a | .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202 | Timer-driven cleanup is real, but it is scoped to session-state tables rather than governed memory retention. |
| NEW-013-002 | code graph freshness checks | half | P2 | .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163 | `code_graph_query`/`code_graph_context` can self-heal stale selective slices on invocation, but full scans are intentionally blocked into manual `code_graph_scan`. |
| NEW-013-003 | skill_graph_scan and skill_graph_validate auto-fire | half/manual | P2 | .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1507 | Skill graph scan can run at startup, watcher, or daemon paths, but `skill_graph_validate` remains manual diagnostic coverage. |
| NEW-013-004 | memory_drift_why auto-fire | manual | n/a | .opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:23 | Drift explanation is only dispatched when the operator invokes the tool; no drift detector auto-calls it. |
| NEW-013-005 | memory_get_learning_history feedback loop | manual | n/a | .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:659 | Learning history is a read-only query over session learning rows; no automated feedback loop consumer was found. |
| NEW-013-006 | advisor_status freshness remediation | manual diagnostic | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:86 | Advisor status detects freshness/trust state but does not invoke the rebuild helper; repair remains separate. |
| NEW-013-007 | code_graph_context auto-fire | half | n/a | .opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60 | `code_graph_context` self-checks readiness once requested, but other routing paths only recommend it rather than invoking it automatically. |
| NEW-013-008 | memory_health diagnostic auto-run | manual/confirmed repair | P2 | .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:425 | `memory_health` is surfaced as a recommendation and can repair only with explicit confirmation; no diagnostic auto-run was found. |

## newInfoRatio estimate
0.74

## Next focus
Iteration 5 — synthesis + sequenced remediation backlog
