# Deep Research Strategy: Automation Reality Supplemental (Continuation of 012)

## Topic

Supplemental automation reality research extending 012's 7-iteration baseline (50-row reality map, 14 auto / 14 half / 18 manual / 4 P1 aspirational). 012 stopped on max_iterations with newInfoRatio=0.18, ABOVE the 0.10 convergence threshold — information density was not exhausted.

## Continuation Lineage

- Parent session: 012 (sessionId 2026-04-29T13:15:00.000Z)
- This session: 013 (sessionId 2026-04-29T14:35:00.000Z)
- lineageMode: `continuation`
- continuedFromRun: 012-automation-self-management-deep-research

## Executor

- cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=`fast`
- maxIterations=5, convergenceThreshold=0.10, stuckThreshold=2

## 4-class taxonomy (carry-over from 012)

| Class | Definition |
|---|---|
| **Auto** | Fires without operator intervention; trigger source cited at file:line |
| **Half** | Fires automatically in some paths; requires manual fallback in others |
| **Manual** | Requires explicit operator invocation (CLI command, slash command, hook trigger) |
| **Aspirational** | Documented as automatic but no runtime path supports it; gap-finding |

## Iteration Focus Map

| Iter | Focus | Primary RQs |
|------|-------|-------------|
| 1 | Deep-loop graph automation reality (deep_loop_graph_query/upsert/convergence/status) | RQ1 |
| 2 | CCC + eval reporting + ablation runner reality (ccc_*, eval_run_ablation, eval_reporting_dashboard) | RQ2 |
| 3 | Validator auto-fire surface (validate.sh PostToolUse, generate-context.js auto-trigger) | RQ3 |
| 4 | Adversarial Hunter→Skeptic→Referee on 012's 4 P1 findings + NEW gap hunt | RQ4 + RQ5 |
| 5 | Synthesis + sequenced remediation backlog (packets 031-035) | RQ6 + all |

## 012's 4 P1 Aspirational Findings (to challenge in iter 4)

1. **Code-graph watcher overclaim** — `.opencode/skill/system-spec-kit/mcp_server/README.md:515-518` claims real-time watching; no watcher under `code_graph/`. Re-test: Is there a chokidar/fs.watch path 012 missed? Test fixture? Documented-but-disabled flag?
2. **Memory retention sweep missing** — `scope-governance.ts:225-333` persists `delete_after` metadata; no sweep path. Re-test: Is there a session-manager cron sweep? Cleanup interval? CLI tool that fires it?
3. **Copilot hook docs conflict** — `references/config/hook_system.md:22` describes stale `.claude/settings.local.json` wrapper; `hooks/copilot/README.md:27-34` forbids that shape. Re-test: Which doc is authoritative? Is one runtime-resolved? Does the conflict actually mis-configure operators?
4. **Codex hook readiness mismatch** — docs require `[features].codex_hooks=true` + `hooks.json`; repo uses `.codex/settings.json` without flag. Re-test: Is settings.json equivalent? Is the flag deprecated? Where does Codex actually load hooks from?

## Key Questions

- [ ] Q1: For each deep-loop graph MCP tool, where does it auto-fire vs require manual call? File:line evidence.
- [ ] Q2: CCC reindex/feedback/status — is it called by any background path or only on operator trigger?
- [ ] Q3: eval_run_ablation and eval_reporting_dashboard — wired into CI? On-demand only? Test-fixture-only?
- [ ] Q4: validate.sh — does any hook config (Claude/Codex/Copilot) fire it on PostToolUse? Or operator-only?
- [ ] Q5: generate-context.js — auto-fires after spec edits? Or only when /memory:save invoked?
- [ ] Q6: 012's 4 P1 — do any survive adversarial retest with NEW corroborating evidence?
- [ ] Q7: New gaps in session-manager cleanup intervals, freshness checks, skill_graph_validate auto-fire?
- [ ] Q8: Sequenced remediation backlog — what's the operator-actionable Tier A → B → C → D plan?

## Known Context

### From 012 (carry-over baseline)
- 50-row 4-column reality map: 14 auto / 14 half / 18 manual / 4 aspirational
- 4 P1 findings already enumerated (above)
- 18 commits on main today closing v1.0.3 anomaly arc + 028 skill contract bugs + 026 readiness scaffolding cleanup
- Recent packets: 005-013 under 026 wrapper

### Critical entry points (in addition to 012's catalog)
- Deep-loop graph: `mcp_server/lib/deep-loop/coverage-graph.ts`, `mcp_server/handlers/deep-loop-graph-*.ts`
- CCC: `mcp_server/handlers/ccc-{reindex,feedback,status}.ts`
- Eval: `mcp_server/handlers/eval-*.ts`, `mcp_server/lib/eval/`
- Validator: `scripts/spec/validate.sh`, `mcp_server/dist/hooks/`
- Hook configs: `.claude/settings.local.json`, `.codex/settings.json`, `.codex/hooks.json` (if present)

## Constraints (carry-over from 012)
- READ ONLY across the codebase (research only).
- Per-iter file:line citations MANDATORY for any concrete finding.
- Speculation findings get severity ≤ P2 with explicit `speculation: true` flag.
- Convergence honest; stop when newInfoRatio < 0.10 for 2 consecutive iters OR max=5.
- Adversarial Hunter→Skeptic→Referee on every "documented but absent" P0/P1 finding (mandatory in iter 4).
- Adversarial retest of 012's 4 P1 findings MUST cite NEW evidence not already in 012's research-report.md.

## Synthesis Targets
- `research/research-report.md` — 7-section structure: (1) supplemental scope vs 012, (2) extended reality map (delta only), (3) per-RQ answers, (4) 4-P1 adversarial outcomes, (5) NEW gaps, (6) sequenced remediation backlog packets 031-035, (7) open questions
- Per-RQ answers with file:line evidence
- Top P0/P1 NEW gap-findings
- Operator-actionable remediation packets 031-035 with effort estimates and dependency graph

## Next Focus

**Iteration 1**: Deep-loop graph automation reality. Map every entry point for `deep_loop_graph_query`, `deep_loop_graph_upsert`, `deep_loop_graph_convergence`, `deep_loop_graph_status`. Where do they fire? Only via deep-research/deep-review YAML steps? Manual-only via MCP tool calls? Cite file:line for each. Classify each as auto / half / manual / aspirational.
