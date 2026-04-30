# Deep Research Strategy: Automation & Self-Management

## Topic
Automation reality map across skill advisor, code graph, system-spec-kit, memory/database, hook system × 5 CLI runtimes.

## Executor
- cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=null (normal)
- maxIterations=7, convergenceThreshold=0.10, stuckThreshold=2

## 4-class taxonomy (decision rule for every automation claim)

| Class | Definition |
|---|---|
| **Auto** | Fires without operator intervention; trigger source cited at file:line |
| **Half** | Fires automatically in some paths; requires manual fallback in others |
| **Manual** | Requires explicit operator invocation (CLI command, slash command, hook trigger) |
| **Aspirational** | Documented as automatic but no runtime path supports it; gap-finding |

## Iteration Focus Map

| Iter | Focus | Primary RQs |
|------|-------|-------------|
| 1 | Skill advisor entry-point catalog (hook + CLI + MCP + tuner) | RQ1 |
| 2 | Code graph scan/verify/status/ensure-ready + watcher path | RQ2 |
| 3 | system-spec-kit validator + generate-context + auto-indexing | RQ3 |
| 4 | Memory/DB: save / index_scan / match_triggers / bootstrap / checkpoints / retention / causal | RQ4 |
| 5 | Per-runtime hook wiring reality (Claude / Copilot / Codex / Gemini / OpenCode-plugin / native) | RQ5 |
| 6 | Cross-cutting gaps + auto-without-docs + claims-without-paths | RQ6 |
| 7 | 4-column reality map synthesis + Planning Packet | RQ7 + all |

## Known Context

### Recent refinement work (today)
- 14 commits closing v1.0.3 anomaly arc
- 028 shipped flat-first artifact roots + auto-stage at synthesis end (closed two skill contract bugs)
- 026 removed vestigial readiness scaffolding
- 025 wired degradedReadiness via getGraphReadinessSnapshot
- The cleanup itself reveals automation patterns to investigate

### Critical entry points
- Hook: `.opencode/skill/system-spec-kit/mcp_server/hooks/` + `.opencode/hooks/`
- Skill advisor: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/{handlers,scripts}/`
- Code graph: `.opencode/skill/system-spec-kit/mcp_server/code_graph/{handlers,lib,watcher}/`
- system-spec-kit: `.opencode/skill/system-spec-kit/scripts/` + `.opencode/skill/system-spec-kit/SKILL.md`
- Memory: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-*.ts`
- Per-runtime configs: `.claude/`, `.codex/`, `.gemini/`, `.opencode/`

### Reference docs to cite
- CLAUDE.md (project-level)
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`

## Constraints
- READ ONLY across the codebase (research only).
- Per-iter file:line citations MANDATORY for any concrete finding.
- Speculation findings get severity ≤ P2 with explicit `speculation: true` flag.
- Convergence honest; stop when newInfoRatio < 0.10 for 2 consecutive iters OR max=7.
- Adversarial Hunter→Skeptic→Referee on every "documented but absent" P0/P1 finding.

## Synthesis Targets
- `research/research-report.md` — 9-section structure with 4-column reality map per subsystem
- Per-RQ answers with file:line evidence
- Top 3-5 P0/P1 gap-findings with Planning Packet entries
- Open questions for downstream remediation phases
